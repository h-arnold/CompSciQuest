// ENG2-HELP-01: the canonical command table is the single source of truth for
// player-facing syntax and parser aliases (application-and-ui.md §5.1 and §5.2).
// The expected values below are transcribed from the design doc, not read back
// from the module under test.
import { describe, expect, it } from 'vitest';
import type { CommandSpec } from '../fixtures/commandTable';
import {
  HELP_GROUPS,
  hasCommandToken,
  loadCommandTable,
} from '../fixtures/commandTable';
import { resolveGameCommand } from '../../src/application/commandResolution';
import {
  KEY_A,
  CHEST_ID,
  loadParser,
  makePutFixture,
} from '../fixtures/parser';
import { npcBundle, npcState } from '../fixtures/npcs';

const OLD_HELP_LINE =
  'Try a direction, take, drop, examine, open, close, unlock, put, look, inventory, score or help.';

const CANONICAL_COMMANDS: readonly CommandSpec[] = [
  {
    verb: 'go',
    syntax: 'go <direction>',
    aliases: [
      'n',
      's',
      'e',
      'w',
      'u',
      'd',
      'in',
      'out',
      'north',
      'south',
      'east',
      'west',
      'up',
      'down',
    ],
  },
  {
    verb: 'take',
    syntax: 'take <item>',
    aliases: ['get', 'pick up'],
  },
  { verb: 'drop', syntax: 'drop <item>', aliases: ['put down'] },
  { verb: 'use', syntax: 'use <item> on <target>', aliases: [] },
  {
    verb: 'examine',
    syntax: 'examine <target>',
    aliases: ['x', 'look at'],
  },
  { verb: 'open', syntax: 'open <target>', aliases: [] },
  { verb: 'close', syntax: 'close <target>', aliases: ['shut'] },
  { verb: 'unlock', syntax: 'unlock <item> <target>', aliases: [] },
  // application-and-ui.md §5.1: the instruction card teaches PLACE, so it is
  // an authorised alias of put.
  { verb: 'put', syntax: 'put <item> <target>', aliases: ['place'] },
  { verb: 'look', syntax: 'look', aliases: [] },
  { verb: 'inventory', syntax: 'inventory', aliases: ['i', 'inv'] },
  { verb: 'score', syntax: 'score', aliases: [] },
  { verb: 'help', syntax: 'help', aliases: ['?'] },
  // assistance-ward.md authorises natural spacing alongside the documented
  // hyphenated form; both aliases come from this canonical table.
  {
    verb: 'talk-to',
    syntax: 'talk-to <npc>',
    aliases: ['talk', 'talk to'],
  },
  {
    verb: 'ask',
    syntax: 'ask <npc> about <topic>',
    aliases: [],
  },
  {
    verb: 'tell',
    syntax: 'tell <npc> about <topic>',
    aliases: [],
  },
  { verb: 'give', syntax: 'give <npc> <item>', aliases: [] },
  { verb: 'show', syntax: 'show <npc> <item>', aliases: [] },
  { verb: 'bye', syntax: 'bye', aliases: ['goodbye'] },
  { verb: 'answer', syntax: 'answer N', aliases: [] },
  { verb: 'hint', syntax: 'hint [target]', aliases: [] },
];

const CANONICAL_DIRECTIONS = [
  { name: 'north', shortcut: 'n' },
  { name: 'south', shortcut: 's' },
  { name: 'east', shortcut: 'e' },
  { name: 'west', shortcut: 'w' },
  { name: 'up', shortcut: 'u' },
  { name: 'down', shortcut: 'd' },
  { name: 'in', shortcut: 'in' },
  { name: 'out', shortcut: 'out' },
] as const;

function sortedBy<T>(
  items: readonly T[],
  key: (item: T) => string,
): readonly T[] {
  const copy = [...items];
  copy.sort((left, right) => key(left).localeCompare(key(right)));
  return copy;
}

function normalise(specs: readonly CommandSpec[]): readonly CommandSpec[] {
  return sortedBy(
    specs.map((spec) => ({
      verb: spec.verb,
      syntax: spec.syntax,
      aliases: sortedBy([...new Set(spec.aliases)], (alias) => alias),
    })),
    (spec) => spec.verb,
  );
}

describe('ENG2-HELP-01 canonical command table', () => {
  it('ENG2-HELP-01: COMMAND_TABLE pins all 21 documented verbs with exact syntax and aliases', async () => {
    const { COMMAND_TABLE } = await loadCommandTable();

    expect(normalise(COMMAND_TABLE)).toEqual(normalise(CANONICAL_COMMANDS));
  });

  it('MD-HELP-01: every COMMAND_TABLE entry declares one of the four documented command groups', async () => {
    const { COMMAND_TABLE } = await loadCommandTable();

    expect(COMMAND_TABLE).toHaveLength(CANONICAL_COMMANDS.length);
    for (const spec of COMMAND_TABLE) {
      expect(
        spec.group,
        `${spec.verb} must declare a help group (spec §6.3)`,
      ).toBeDefined();
      if (spec.group === undefined) {
        throw new Error(`${spec.verb} must declare a help group (spec §6.3)`);
      }
      expect(HELP_GROUPS, `${spec.verb} group must be documented`).toContain(
        spec.group,
      );
    }

    const usedGroups = new Set(COMMAND_TABLE.map((spec) => spec.group));
    const usedGroupNames = [...usedGroups].map(String);
    expect(sortedBy(usedGroupNames, (group) => group)).toEqual(
      sortedBy([...HELP_GROUPS], (group) => group),
    );
    // Saves is a help section fed by SAVE_ACTIONS, not a COMMAND_TABLE group.
    expect(usedGroupNames).not.toContain('Saves');

    // Anchors from the help structure in spec §6.3.
    const byVerb = new Map(
      COMMAND_TABLE.map((spec) => [spec.verb, spec.group]),
    );
    expect(byVerb.get('go')).toBe('Movement');
    expect(byVerb.get('look')).toBe('Looking and handling');
    expect(byVerb.get('examine')).toBe('Looking and handling');
    expect(byVerb.get('talk-to')).toBe('People');
    expect(byVerb.get('ask')).toBe('People');
    expect(byVerb.get('score')).toBe('Progress');
  });

  it('ENG2-HELP-01: DIRECTIONS pins the eight documented name and shortcut pairs', async () => {
    const { DIRECTIONS } = await loadCommandTable();

    expect(sortedBy(DIRECTIONS, (direction) => direction.name)).toEqual(
      sortedBy(CANONICAL_DIRECTIONS, (direction) => direction.name),
    );
  });

  it('ENG2-HELP-01: helpText() builds one static list containing every verb, alias and syntax', async () => {
    const { helpText } = await loadCommandTable();
    const text = helpText();

    expect(typeof text).toBe('string');
    expect(text).not.toBe(OLD_HELP_LINE);
    expect(text.length).toBeGreaterThan(OLD_HELP_LINE.length);
    expect(helpText()).toBe(text);

    for (const spec of CANONICAL_COMMANDS) {
      expect(text, `syntax ${spec.syntax} must appear in help`).toContain(
        spec.syntax,
      );
      expect(hasCommandToken(text, spec.verb), `${spec.verb} in help`).toBe(
        true,
      );
      for (const alias of spec.aliases) {
        expect(hasCommandToken(text, alias), `alias ${alias} in help`).toBe(
          true,
        );
      }
    }

    for (const placeholder of [
      '<direction>',
      '<item> <target>',
      '<npc> about <topic>',
      '<npc> <item>',
      '<item> on <target>',
      'N',
      '[target]',
    ]) {
      expect(text, `${placeholder} must appear in help`).toContain(placeholder);
    }
  });

  it('ENG2-HELP-01: every documented alias and direction resolves through parse() to its primary verb', async () => {
    const { COMMAND_TABLE, DIRECTIONS } = await loadCommandTable();
    const parser = await loadParser();

    for (const spec of COMMAND_TABLE) {
      for (const alias of spec.aliases) {
        expect(
          parser.parse(alias).verb,
          `${alias} must resolve to ${spec.verb}`,
        ).toBe(spec.verb);
      }
    }

    for (const direction of DIRECTIONS) {
      const short = parser.parse(direction.shortcut);
      const full = parser.parse(direction.name);
      expect(short.verb).toBe('go');
      expect(short.nounPhrases).toEqual([direction.name]);
      expect(full.verb).toBe('go');
      expect(full.nounPhrases).toEqual([direction.name]);
    }

    const multiwordAndPunctuation: readonly (readonly [string, string])[] = [
      ['pick up key', 'take'],
      ['put down key', 'drop'],
      ['look at lamp', 'examine'],
      ['?', 'help'],
    ];
    for (const [input, verb] of multiwordAndPunctuation) {
      expect(parser.parse(input).verb, `${input} must resolve`).toBe(verb);
    }
  });

  it('ENG2-HELP-01: canonical verb identity and count match the verbs the parser resolves', async () => {
    const { COMMAND_TABLE, DIRECTIONS } = await loadCommandTable();
    const parser = await loadParser();
    const observed = new Set<string>();

    for (const spec of COMMAND_TABLE) {
      observed.add(parser.parse(spec.verb).verb);
      for (const alias of spec.aliases) {
        observed.add(parser.parse(alias).verb);
      }
    }
    for (const direction of DIRECTIONS) {
      observed.add(parser.parse(direction.name).verb);
      observed.add(parser.parse(direction.shortcut).verb);
    }

    expect(sortedBy([...observed], (verb) => verb)).toEqual(
      sortedBy(
        CANONICAL_COMMANDS.map((spec) => spec.verb),
        (verb) => verb,
      ),
    );
  });
});

// Follow-up (issue 9): ENGINE_ISSUES.md "Decisions settled with the user" →
// Batch E1 settles two more supported forms — `ask about <topic>` ("ask syntax")
// and bare quiz numbers ("Quiz answers"). The "Help" row defines help as one
// static list of every supported command, alias and required syntax, so both
// forms must appear in the generated copy. Only helpText() output is observed.
describe('issue 9 forms in the generated help text', () => {
  it('ENG9-ASKINFER-01: helpText() lists ask about <topic> and explains that the NPC is inferred when exactly one is present', async () => {
    const { helpText } = await loadCommandTable();
    const text = helpText();

    expect(text, 'help must list the inferred ask syntax').toContain(
      'ask about <topic>',
    );
    expect(
      text.toLowerCase(),
      'help must explain that the NPC is inferred',
    ).toContain('infer');
    expect(
      text.toLowerCase(),
      'help must explain that inference applies when exactly one NPC is present',
    ).toContain('exactly one');
  });

  it('ENG9-BAREANSWER-01: helpText() lists the bare quiz number forms 1, 2, …', async () => {
    const { helpText } = await loadCommandTable();
    const text = helpText();

    expect(
      text,
      'help must list bare quiz numbers as required by ENGINE_ISSUES.md Batch E1',
    ).toContain('1, 2, …');
  });

  it('ENG2-HELP-01: helpText() keeps ask <npc> about <topic> and answer N alongside the issue 9 forms', async () => {
    const { helpText } = await loadCommandTable();
    const text = helpText();

    expect(text, 'the explicit ask form must remain in help').toContain(
      'ask <npc> about <topic>',
    );
    expect(text, 'the answer N form must remain in help').toContain('answer N');
  });
});

// Two aliases that the instruction card and the player already use are declared
// in the canonical table above. These rows pin the player-visible result, not a
// hidden parser constant.
describe('W7 ward fixes — command aliases (assistance-ward.md)', () => {
  it('W7F-01: talk to <npc> is a declared alias and resolves like talk-to <npc>', async () => {
    const { COMMAND_TABLE, helpText } = await loadCommandTable();
    const parser = await loadParser();
    const spec = COMMAND_TABLE.find((entry) => entry.verb === 'talk-to');

    expect(
      spec?.aliases,
      'assistance-ward.md adds natural spacing alongside talk',
    ).toEqual(expect.arrayContaining(['talk', 'talk to']));
    expect(parser.parse('talk to nia')).toEqual({
      verb: 'talk-to',
      nounPhrases: ['nia'],
      raw: 'talk to nia',
    });
    expect(parser.parse('talk-to nia')).toEqual({
      verb: 'talk-to',
      nounPhrases: ['nia'],
      raw: 'talk-to nia',
    });

    const bundle = npcBundle();
    const state = npcState();
    expect(resolveGameCommand('talk to guide', state, bundle)).toEqual({
      kind: 'talk-to',
      actorId: 'npc-1',
    });
    expect(resolveGameCommand('talk-to guide', state, bundle)).toEqual({
      kind: 'talk-to',
      actorId: 'npc-1',
    });
    expect(hasCommandToken(helpText(), 'talk to')).toBe(true);
  });

  it('W7F-02: place <item> in <target> is a declared alias for put', async () => {
    const { COMMAND_TABLE, helpText } = await loadCommandTable();
    const parser = await loadParser();
    const spec = COMMAND_TABLE.find((entry) => entry.verb === 'put');

    expect(spec?.aliases).toEqual(expect.arrayContaining(['place']));
    expect(parser.parse('place brass key in chest').verb).toBe('put');

    const { bundle, state } = makePutFixture();
    const expected = { kind: 'put', itemId: KEY_A, targetId: CHEST_ID };
    expect(
      resolveGameCommand('place brass key in chest', state, bundle),
    ).toEqual(expected);
    expect(resolveGameCommand('put brass key in chest', state, bundle)).toEqual(
      expected,
    );
    expect(hasCommandToken(helpText(), 'place')).toBe(true);
  });
});
