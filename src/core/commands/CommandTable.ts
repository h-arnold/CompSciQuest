// Canonical command table (application-and-ui.md §5, §5.1 and §5.2). One entry
// per canonical verb. The parser's aliases and the player-facing help reply are
// both derived from these constants, so they cannot drift apart.

export type HelpGroup =
  'Movement' | 'Looking and handling' | 'People' | 'Progress' | 'Saves';

export interface CommandSpec {
  readonly verb: string;
  readonly syntax: string;
  readonly aliases: readonly string[];
  readonly group: HelpGroup;
  readonly detail?: string;
}

export interface DirectionSpec {
  readonly name: string;
  readonly shortcut: string;
}

export const COMMAND_TABLE: readonly CommandSpec[] = [
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
    group: 'Movement',
  },
  {
    verb: 'take',
    syntax: 'take <item>',
    aliases: ['get', 'pick up'],
    group: 'Looking and handling',
  },
  {
    verb: 'drop',
    syntax: 'drop <item>',
    aliases: ['put down'],
    group: 'Looking and handling',
  },
  {
    verb: 'use',
    syntax: 'use <item> on <target>',
    aliases: [],
    group: 'Looking and handling',
  },
  {
    verb: 'examine',
    syntax: 'examine <target>',
    aliases: ['x', 'look at'],
    group: 'Looking and handling',
  },
  {
    verb: 'open',
    syntax: 'open <target>',
    aliases: [],
    group: 'Looking and handling',
  },
  {
    verb: 'close',
    syntax: 'close <target>',
    aliases: ['shut'],
    group: 'Looking and handling',
  },
  {
    verb: 'unlock',
    syntax: 'unlock <item> <target>',
    aliases: [],
    group: 'Looking and handling',
  },
  {
    verb: 'put',
    syntax: 'put <item> <target>',
    aliases: ['place'],
    group: 'Looking and handling',
  },
  { verb: 'look', syntax: 'look', aliases: [], group: 'Looking and handling' },
  {
    verb: 'inventory',
    syntax: 'inventory',
    aliases: ['i', 'inv'],
    group: 'Progress',
  },
  { verb: 'score', syntax: 'score', aliases: [], group: 'Progress' },
  { verb: 'help', syntax: 'help', aliases: ['?'], group: 'Progress' },
  // content-bible.md §12 (2026-11-27 W7 fix): both the documented hyphenated
  // form and natural spacing are player-facing aliases for talk-to.
  {
    verb: 'talk-to',
    syntax: 'talk-to <npc>',
    aliases: ['talk', 'talk to'],
    group: 'People',
  },
  {
    verb: 'ask',
    syntax: 'ask <npc> about <topic>',
    aliases: [],
    group: 'People',
    detail:
      'Also ask about <topic>: the NPC is inferred when exactly one is present.',
  },
  {
    verb: 'tell',
    syntax: 'tell <npc> about <topic>',
    aliases: [],
    group: 'People',
  },
  {
    verb: 'give',
    syntax: 'give <npc> <item>',
    aliases: [],
    group: 'People',
  },
  {
    verb: 'show',
    syntax: 'show <npc> <item>',
    aliases: [],
    group: 'People',
  },
  { verb: 'bye', syntax: 'bye', aliases: ['goodbye'], group: 'People' },
  {
    verb: 'answer',
    syntax: 'answer N',
    aliases: [],
    group: 'Progress',
    detail: 'Bare quiz numbers 1, 2, … are also accepted.',
  },
  { verb: 'hint', syntax: 'hint [target]', aliases: [], group: 'Progress' },
];

export const DIRECTIONS: readonly DirectionSpec[] = [
  { name: 'north', shortcut: 'n' },
  { name: 'south', shortcut: 's' },
  { name: 'east', shortcut: 'e' },
  { name: 'west', shortcut: 'w' },
  { name: 'up', shortcut: 'u' },
  { name: 'down', shortcut: 'd' },
  { name: 'in', shortcut: 'in' },
  { name: 'out', shortcut: 'out' },
];

// Spec §6.3: the legend is prose, not commands, so it is pinned here beside
// helpText() rather than derived from COMMAND_TABLE. Each bullet has one source.
const READING_THE_ROOM: readonly string[] = [
  '- **Bold** marks something you can examine or use.',
  '- ***Bold italic*** marks someone you can talk to.',
  '- *Italic* marks a way out.',
];

// The five meta actions are UI commands, not parser verbs; COMMAND_TABLE keeps
// its 21 verbs and this list is their single source in the Saves help group.
const SAVE_ACTIONS: readonly string[] = [
  'save',
  'load',
  'download',
  'import',
  'restart',
];

const GROUP_ORDER: readonly HelpGroup[] = [
  'Movement',
  'Looking and handling',
  'People',
  'Progress',
  'Saves',
];

const FOOTER_LINK =
  '[CompSciQuest on GitHub Pages](https://h-arnold.github.io/CompSciQuest/)';

function aliasSuffix(aliases: readonly string[]): string {
  return aliases.length === 0 ? '' : `  (${aliases.join(', ')})`;
}

function detailSuffix(detail: string | undefined): string {
  return detail === undefined ? '' : `  — ${detail}`;
}

function commandLine(spec: CommandSpec, directions: string): string {
  const value =
    spec.verb === 'go' ? ` — or type a direction: ${directions}` : '';
  return `- \`${spec.syntax}\`${value}${aliasSuffix(spec.aliases)}${detailSuffix(spec.detail)}`;
}

function groupLines(group: HelpGroup): readonly string[] {
  if (group === 'Saves') {
    return [`**${group}**`, ...SAVE_ACTIONS.map((action) => `- \`${action}\``)];
  }
  const directions = DIRECTIONS.map(
    (direction) => `\`${direction.name}\``,
  ).join(', ');
  const commands = COMMAND_TABLE.filter((spec) => spec.group === group).map(
    (spec) => commandLine(spec, directions),
  );
  return [`**${group}**`, ...commands];
}

export function helpText(): string {
  return [
    '**Reading the room**',
    ...READING_THE_ROOM,
    '',
    ...GROUP_ORDER.flatMap((group) => [...groupLines(group), '']),
    FOOTER_LINK,
  ].join('\n');
}
