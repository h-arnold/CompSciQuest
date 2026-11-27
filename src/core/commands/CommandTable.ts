// Canonical command table (application-and-ui.md §5, §5.1 and §5.2). One entry
// per canonical verb. The parser's aliases and the player-facing help reply are
// both derived from these constants, so they cannot drift apart.

export interface CommandSpec {
  readonly verb: string;
  readonly syntax: string;
  readonly aliases: readonly string[];
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
  },
  { verb: 'take', syntax: 'take <item>', aliases: ['get', 'pick up'] },
  { verb: 'drop', syntax: 'drop <item>', aliases: ['put down'] },
  { verb: 'use', syntax: 'use <item> on <target>', aliases: [] },
  { verb: 'examine', syntax: 'examine <target>', aliases: ['x', 'look at'] },
  { verb: 'open', syntax: 'open <target>', aliases: [] },
  { verb: 'close', syntax: 'close <target>', aliases: ['shut'] },
  { verb: 'unlock', syntax: 'unlock <item> <target>', aliases: [] },
  { verb: 'put', syntax: 'put <item> <target>', aliases: ['place'] },
  { verb: 'look', syntax: 'look', aliases: [] },
  { verb: 'inventory', syntax: 'inventory', aliases: ['i', 'inv'] },
  { verb: 'score', syntax: 'score', aliases: [] },
  { verb: 'help', syntax: 'help', aliases: ['?'] },
  // content-bible.md §12 (2026-11-27 W7 fix round): both the documented
  // hyphenated form and the natural spacing are player-facing aliases here.
  { verb: 'talk-to', syntax: 'talk-to <npc>', aliases: ['talk', 'talk to'] },
  {
    verb: 'ask',
    syntax: 'ask <npc> about <topic>',
    aliases: [],
    detail:
      'Also ask about <topic>: the NPC is inferred when exactly one is present.',
  },
  { verb: 'tell', syntax: 'tell <npc> about <topic>', aliases: [] },
  { verb: 'give', syntax: 'give <npc> <item>', aliases: [] },
  { verb: 'show', syntax: 'show <npc> <item>', aliases: [] },
  { verb: 'bye', syntax: 'bye', aliases: ['goodbye'] },
  {
    verb: 'answer',
    syntax: 'answer N',
    aliases: [],
    detail: 'Bare quiz numbers 1, 2, … are also accepted.',
  },
  { verb: 'hint', syntax: 'hint [target]', aliases: [] },
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

function aliasSuffix(aliases: readonly string[]): string {
  return aliases.length === 0 ? '' : `  (${aliases.join(', ')})`;
}

function detailSuffix(detail: string | undefined): string {
  return detail === undefined ? '' : `  — ${detail}`;
}

export function helpText(): string {
  const commands = COMMAND_TABLE.map(
    (spec) =>
      `  ${spec.syntax}${aliasSuffix(spec.aliases)}${detailSuffix(spec.detail)}`,
  );
  const directions = DIRECTIONS.map(
    (direction) => `${direction.name} (${direction.shortcut})`,
  ).join(', ');
  return [
    'Available commands:',
    ...commands,
    `Directions: ${directions}.`,
  ].join('\n');
}
