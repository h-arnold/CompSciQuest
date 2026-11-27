// MD-HELP-01–03: the grouped help contract from spec §6.3 and
// application-and-ui.md §6.1. Only the generated string and the `help` reply
// are observed; no source file is edited and no runtime state is changed.
import { describe, expect, it } from 'vitest';
import type { Command } from '../../src/core/commands/Command';
import type { Effect } from '../../src/core/effects/Effect';
import { loadCommandTable } from '../fixtures/commandTable';
import { loadVerbTable, makeTurnContext } from '../fixtures/parser';

const SECTION_HEADINGS = [
  '**Reading the room**',
  '**Movement**',
  '**Looking and handling**',
  '**People**',
  '**Progress**',
  '**Saves**',
] as const;

const LEGEND_BULLETS = [
  '- **Bold** marks something you can examine or use.',
  '- ***Bold italic*** marks someone you can talk to.',
  '- *Italic* marks a way out.',
] as const;

// spec §6.3 GAP resolution: these five meta actions come from SAVE_ACTIONS,
// not from COMMAND_TABLE; help lists them as inline code under **Saves**.
const SAVE_ACTIONS = ['save', 'load', 'download', 'import', 'restart'] as const;

const FOOTER_LINK =
  '[CompSciQuest on GitHub Pages](https://h-arnold.github.io/CompSciQuest/)';
const COMMAND_TABLE_PATH = '../../src/core/commands/CommandTable.ts';

function assertInOrder(text: string, needles: readonly string[]): void {
  const positions = needles.map((needle) => text.indexOf(needle));
  for (const [index, needle] of needles.entries()) {
    expect(
      positions[index] ?? -1,
      `${needle} must appear in help`,
    ).toBeGreaterThanOrEqual(0);
  }
  for (let index = 1; index < positions.length; index += 1) {
    expect(
      positions[index] ?? -1,
      `${needles[index]} must follow ${needles[index - 1]}`,
    ).toBeGreaterThan(positions[index - 1] ?? -1);
  }
}

async function helpReply(): Promise<string> {
  const table = await loadVerbTable();
  const command: Command = { kind: 'help' };
  const handler = table.getCommandHandler(command);
  expect(handler, 'help must have a handler').toBeTypeOf('function');
  if (handler === undefined) {
    throw new Error('getCommandHandler must return a handler for help');
  }
  const effects = handler(command, makeTurnContext());
  const messages = effects
    .filter(
      (effect): effect is Extract<Effect, { kind: 'message' }> =>
        effect.kind === 'message',
    )
    .map((effect) => effect.text);
  expect(messages, 'help must emit exactly one message').toHaveLength(1);
  return messages[0] ?? '';
}

describe('MD-HELP grouped generated help', () => {
  it('MD-HELP-01: helpText() emits six bold section headings in the documented order', async () => {
    const { helpText } = await loadCommandTable();
    const text = helpText();

    assertInOrder(text, SECTION_HEADINGS);
    const lines = text.split('\n');
    for (const heading of SECTION_HEADINGS) {
      expect(lines, `${heading} must be its own line`).toContain(heading);
    }
  });

  it('MD-HELP-01: helpText() leads with the exact three reading-the-room legend bullets', async () => {
    const { helpText } = await loadCommandTable();
    const lines = helpText().split('\n');

    expect(lines.slice(0, 4)).toEqual([SECTION_HEADINGS[0], ...LEGEND_BULLETS]);
  });

  it('MD-HELP-01: helpText() emits a Saves section with the five meta actions as inline code', async () => {
    const { helpText, COMMAND_TABLE } = await loadCommandTable();
    const lines = helpText().split('\n');
    const headingIndex = lines.indexOf('**Saves**');

    expect(
      headingIndex,
      '**Saves** must be its own line',
    ).toBeGreaterThanOrEqual(0);

    const positions = SAVE_ACTIONS.map((action) =>
      lines.indexOf(`- \`${action}\``, headingIndex + 1),
    );
    for (const [index, action] of SAVE_ACTIONS.entries()) {
      expect(
        positions[index] ?? -1,
        `\`${action}\` must be inline code under Saves`,
      ).toBeGreaterThan(headingIndex);
    }
    for (let index = 1; index < positions.length; index += 1) {
      expect(
        positions[index] ?? -1,
        `${SAVE_ACTIONS[index]} must follow ${SAVE_ACTIONS[index - 1]}`,
      ).toBeGreaterThan(positions[index - 1] ?? -1);
    }

    // The five meta actions are help entries, not one of the 21 parser verbs.
    const verbs = new Set(COMMAND_TABLE.map((spec) => spec.verb));
    for (const action of SAVE_ACTIONS) {
      expect(
        verbs.has(action),
        `${action} must not be a COMMAND_TABLE verb`,
      ).toBe(false);
    }
  });

  it('MD-HELP-02: syntax and direction values are inline code, including go <direction>', async () => {
    const { helpText, COMMAND_TABLE, DIRECTIONS } = await loadCommandTable();
    const text = helpText();

    expect(text).toContain('`go <direction>`');
    for (const spec of COMMAND_TABLE) {
      expect(text, `${spec.syntax} must be inline code`).toContain(
        `\`${spec.syntax}\``,
      );
    }
    for (const direction of DIRECTIONS) {
      expect(text, `${direction.name} must be inline code`).toContain(
        `\`${direction.name}\``,
      );
    }
  });

  it('MD-HELP-02: helpText() ends with the single Pages footer link and no other URL', async () => {
    const { helpText } = await loadCommandTable();
    const text = helpText();
    const nonEmptyLines = text.split('\n').filter((line) => line.trim() !== '');

    expect(nonEmptyLines.at(-1)).toBe(FOOTER_LINK);
    expect(text.split(FOOTER_LINK)).toHaveLength(2);
    expect(text.match(/\]\(/g) ?? []).toHaveLength(1);
    expect(text.match(/https?:\/\//g) ?? []).toHaveLength(1);
    expect(text).not.toContain('http://');
    expect(text).not.toContain('www.');
  });

  it('MD-HELP-02: the help reply emits the generated string with one footer link', async () => {
    const { helpText } = await loadCommandTable();
    const text = await helpReply();

    expect(text).toBe(helpText());
    expect(text.split(FOOTER_LINK)).toHaveLength(2);
    expect(text.match(/https?:\/\//g) ?? []).toHaveLength(1);
  });

  it('MD-HELP-03: exactly one module under src/core/commands exports helpText()', async () => {
    const modules = import.meta.glob<Record<string, unknown>>(
      '../../src/core/commands/**/*.ts',
    );
    const owners: string[] = [];

    for (const [path, load] of Object.entries(modules)) {
      const module = await load();
      if (typeof module['helpText'] === 'function') {
        owners.push(path);
      }
    }

    expect(owners).toEqual([COMMAND_TABLE_PATH]);
  });

  it('MD-HELP-03: each legend bullet is declared once, beside helpText()', async () => {
    const sources = import.meta.glob<string>(
      '../../src/core/commands/**/*.ts',
      { query: '?raw', import: 'default' },
    );

    for (const bullet of LEGEND_BULLETS) {
      const owners: string[] = [];
      for (const [path, load] of Object.entries(sources)) {
        const source = await load();
        if (source.includes(bullet)) {
          owners.push(path);
        }
      }
      expect(owners, `${bullet} must have one source`).toEqual([
        COMMAND_TABLE_PATH,
      ]);
    }
  });
});
