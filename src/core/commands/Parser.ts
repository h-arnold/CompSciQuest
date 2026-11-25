// Canonical responsibility from architecture.md §5: turn tokens into a
// ParsedCommand using engine-owned verb and direction tables (§5.2). It never
// throws; unresolved or arbitrary text keeps its original input for errors.
import type { Direction } from '../../types/domain';
import type { ParsedCommand } from './ParsedCommand';
import { tokenize } from './Tokenizer';

const DIRECTION_NAMES = [
  'north',
  'south',
  'east',
  'west',
  'up',
  'down',
  'in',
  'out',
] as const;

const DIRECTION_SHORTCUTS: Readonly<Record<string, Direction>> = {
  n: 'north',
  s: 'south',
  e: 'east',
  w: 'west',
  u: 'up',
  d: 'down',
  in: 'in',
  out: 'out',
};

interface MultiwordAlias {
  readonly words: readonly string[];
  readonly verb: string;
}

const MULTIWORD_ALIASES: readonly MultiwordAlias[] = [
  { words: ['pick', 'up'], verb: 'take' },
  { words: ['put', 'down'], verb: 'drop' },
  { words: ['look', 'at'], verb: 'examine' },
];

const SINGLE_ALIASES: Readonly<Record<string, string>> = {
  get: 'take',
  x: 'examine',
  i: 'inventory',
  inv: 'inventory',
  shut: 'close',
  talk: 'talk-to',
  goodbye: 'bye',
};

function isDirection(value: string): value is Direction {
  return (DIRECTION_NAMES as readonly string[]).includes(value);
}

function parseRaw(raw: string): ParsedCommand {
  // The question mark is a documented punctuation alias (application-and-ui.md
  // §5.2); the tokenizer deliberately strips it, so the parser handles it here.
  if (raw.trim() === '?') {
    return { verb: 'help', nounPhrases: [], raw };
  }

  const tokens = tokenize(raw);
  const first = tokens[0];
  if (first === undefined) {
    return { verb: 'unknown', nounPhrases: [], raw };
  }

  for (const alias of MULTIWORD_ALIASES) {
    if (alias.words[0] === first && alias.words[1] === tokens[1]) {
      return { verb: alias.verb, nounPhrases: tokens.slice(2), raw };
    }
  }

  const shortcut = DIRECTION_SHORTCUTS[first];
  if (shortcut !== undefined) {
    return { verb: 'go', nounPhrases: [shortcut], raw };
  }
  if (isDirection(first)) {
    return { verb: 'go', nounPhrases: [first], raw };
  }

  const alias = SINGLE_ALIASES[first];
  return {
    verb: alias ?? first,
    nounPhrases: tokens.slice(1),
    raw,
  };
}

// The seam loader verifies the export is callable and invokes its named method.
export const parse = Object.assign(parseRaw, { parse: parseRaw });
