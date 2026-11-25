// Parser/alias-table contracts from architecture.md §5 and §9, and
// application-and-ui.md §5.2. Every case observes ParsedCommand, never internals.
import { describe, expect, it } from 'vitest';
import type { Command } from '../../src/core/commands/Command';
import type { Effect } from '../../src/core/effects/Effect';
import type { ParsedCommand } from '../../src/core/commands/ParsedCommand';
import {
  CHEST_ID,
  KEY_A,
  loadParser,
  makePutFixture,
} from '../fixtures/parser';
import { loadGameWithPhases, makeTurnDependencies } from '../fixtures/turn';

const GO = 'go';
const TAKE = 'take';
const DROP = 'drop';
const EXAMINE = 'examine';
const CLOSE = 'close';
const INVENTORY = 'inventory';
const HELP = 'help';
const TALK = 'talk-to';
const BYE = 'bye';
const PUT = 'put';

const SHORTCUTS: ReadonlyArray<readonly [string, string]> = [
  ['n', 'north'],
  ['s', 'south'],
  ['e', 'east'],
  ['w', 'west'],
  ['u', 'up'],
  ['d', 'down'],
  ['in', 'in'],
  ['out', 'out'],
];

const NO_ALIAS_VERBS = [
  'use',
  'open',
  'unlock',
  PUT,
  'look',
  'score',
  'ask',
  'tell',
  'give',
  'show',
  'answer',
  'hint',
] as const;

async function parse(raw: string): Promise<ParsedCommand> {
  const parser = await loadParser();
  return parser.parse(raw);
}

describe('parser verb table', () => {
  it('P-PARSE-02: direction shortcuts expand to the canonical go command', async () => {
    for (const [shortcut, direction] of SHORTCUTS) {
      const parsed = await parse(shortcut);

      expect(parsed.verb).toBe(GO);
      expect(parsed.nounPhrases).toEqual([direction]);
      expect(parsed.raw).toBe(shortcut);
    }
  });

  it('P-PARSE-03: full direction names produce the matching go command', async () => {
    for (const [, direction] of SHORTCUTS) {
      const parsed = await parse(direction);

      expect(parsed.verb).toBe(GO);
      expect(parsed.nounPhrases).toEqual([direction]);
    }
  });

  it('P-PARSE-04: get and pick up map to the canonical take verb', async () => {
    const get = await parse('get key');
    const pickUp = await parse('pick up key');

    expect(get.verb).toBe(TAKE);
    expect(get.nounPhrases).toEqual(['key']);
    expect(pickUp.verb).toBe(TAKE);
    expect(pickUp.nounPhrases).toEqual(['key']);
  });

  it('P-PARSE-05: put down maps to the canonical drop verb', async () => {
    const parsed = await parse('put down key');

    expect(parsed.verb).toBe(DROP);
    expect(parsed.nounPhrases).toEqual(['key']);
  });

  it('P-PARSE-06: x and look at map to the canonical examine verb', async () => {
    const short = await parse('x lamp');
    const long = await parse('look at lamp');

    expect(short.verb).toBe(EXAMINE);
    expect(short.nounPhrases).toEqual(['lamp']);
    expect(long.verb).toBe(EXAMINE);
    expect(long.nounPhrases).toEqual(['lamp']);
  });

  it('P-PARSE-07: shut maps to the canonical close verb', async () => {
    const parsed = await parse('shut door');

    expect(parsed.verb).toBe(CLOSE);
    expect(parsed.nounPhrases).toEqual(['door']);
  });

  it('P-PARSE-08: i and inv map to the canonical inventory verb', async () => {
    const short = await parse('i');
    const long = await parse('inv');

    expect(short.verb).toBe(INVENTORY);
    expect(long.verb).toBe(INVENTORY);
  });

  it('P-PARSE-09: the question mark maps to the canonical help verb', async () => {
    const parsed = await parse('?');

    expect(parsed.verb).toBe(HELP);
  });

  it('P-PARSE-10: talk maps to the canonical talk-to verb', async () => {
    const parsed = await parse('talk guide');

    expect(parsed.verb).toBe(TALK);
    expect(parsed.nounPhrases).toEqual(['guide']);
  });

  it('P-PARSE-11: goodbye maps to the canonical bye verb', async () => {
    const parsed = await parse('goodbye');

    expect(parsed.verb).toBe(BYE);
  });

  it('P-PARSE-12: verbs without aliases keep their canonical token', async () => {
    for (const verb of NO_ALIAS_VERBS) {
      const parsed = await parse(`${verb} widget`);

      expect(parsed.verb).toBe(verb);
    }
  });

  it('P-PARSE-13: arbitrary text never throws and keeps the original input', async () => {
    const raw = '  ZORG!!  waves   a   wand??? ';

    const parsed = await parse(raw);

    expect(parsed.raw).toBe(raw);
    expect(typeof parsed.verb).toBe('string');
    expect(parsed.verb.length).toBeGreaterThan(0);
    expect(Array.isArray(parsed.nounPhrases)).toBe(true);
  });

  it('P-PARSE-16: put down is drop while put noun in target stays put', async () => {
    const drop = await parse('put down key');
    const put = await parse('put key in chest');

    expect(drop.verb).toBe(DROP);
    expect(put.verb).toBe(PUT);
    expect(put.nounPhrases).toEqual(expect.arrayContaining(['key', 'chest']));
  });

  it('P-PARSE-16: put noun in target resolves through the facade to a put Command', async () => {
    // The facade's default resolution is left in place; only the dispatch seam
    // records the Command it was handed, so the preposition cannot be silently
    // resolved as an object (application-and-ui.md §5.1/§5.2).
    const { bundle, state } = makePutFixture();
    const captured: Command[] = [];
    const trace: string[] = [];
    const game = await loadGameWithPhases(
      makeTurnDependencies(trace, {
        bundle,
        initialState: state,
        dispatch: (command: Command): readonly Effect[] => {
          captured.push(command);
          return [];
        },
      }),
    );

    game.submit('put key in chest');

    expect(captured).toHaveLength(1);
    expect(captured).toEqual([
      { kind: PUT, itemId: KEY_A, targetId: CHEST_ID },
    ]);
  });
});
