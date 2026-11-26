// Canonical responsibility from architecture.md §5: turn tokens into a
// ParsedCommand using engine-owned verb and direction tables (§5.2). It never
// throws; unresolved or arbitrary text keeps its original input for errors.
// Every alias comes from the canonical CommandTable so it cannot drift from the
// player-facing help reply.
import type { Direction } from '../../types/domain';
import { COMMAND_TABLE, DIRECTIONS } from './CommandTable';
import type { ParsedCommand } from './ParsedCommand';
import { tokenize } from './Tokenizer';

const DIRECTION_NAMES: readonly string[] = DIRECTIONS.map(
  (direction) => direction.name,
);

const DIRECTION_SHORTCUTS: Readonly<Record<string, string>> =
  Object.fromEntries(
    DIRECTIONS.map(
      (direction) => [direction.shortcut, direction.name] as const,
    ),
  );

const DIRECTION_TOKENS: ReadonlySet<string> = new Set(
  DIRECTIONS.flatMap((direction) => [direction.name, direction.shortcut]),
);

interface MultiwordAlias {
  readonly words: readonly string[];
  readonly verb: string;
}

const MULTIWORD_ALIASES: readonly MultiwordAlias[] = COMMAND_TABLE.flatMap(
  (spec) =>
    spec.aliases
      .filter((alias) => alias.includes(' '))
      .map((alias) => ({ words: alias.split(' '), verb: spec.verb })),
);

// A canonical verb may contain a hyphen, which the tokenizer would turn into a
// space. Match the literal verb prefix from COMMAND_TABLE before the alias
// lookup and consume its remainder as noun phrases.
const HYPHENATED_VERBS: readonly string[] = COMMAND_TABLE.map(
  (spec) => spec.verb,
).filter((verb) => verb.includes('-'));

function hyphenatedVerb(
  raw: string,
): readonly [string, readonly string[]] | undefined {
  const lowered = raw.trim().toLowerCase();
  for (const verb of HYPHENATED_VERBS) {
    if (!lowered.startsWith(verb)) continue;
    const rest = lowered.slice(verb.length);
    if (rest.length === 0) return [verb, []];
    if (/^\s/u.test(rest)) return [verb, tokenize(rest)];
  }
  return undefined;
}

function isPunctuationAlias(alias: string): boolean {
  return alias.length > 0 && !/[a-z0-9 ]/i.test(alias);
}

const PUNCTUATION_ALIASES: Readonly<Record<string, string>> =
  Object.fromEntries(
    COMMAND_TABLE.flatMap((spec) =>
      spec.aliases
        .filter((alias) => isPunctuationAlias(alias))
        .map((alias) => [alias, spec.verb] as const),
    ),
  );

// Direction names and shortcuts are handled earlier as `go`; punctuation
// aliases are handled before tokenisation, so neither is repeated here.
const SINGLE_ALIASES: Readonly<Record<string, string>> = Object.fromEntries(
  COMMAND_TABLE.flatMap((spec) =>
    spec.aliases
      .filter(
        (alias) =>
          !alias.includes(' ') &&
          !isPunctuationAlias(alias) &&
          !DIRECTION_TOKENS.has(alias),
      )
      .map((alias) => [alias, spec.verb] as const),
  ),
);

function isDirection(value: string): value is Direction {
  return (DIRECTION_NAMES as readonly string[]).includes(value);
}

function parseRaw(raw: string): ParsedCommand {
  // Punctuation aliases are handled before the tokenizer strips them.
  const punctuationVerb = PUNCTUATION_ALIASES[raw.trim()];
  if (punctuationVerb !== undefined) {
    return { verb: punctuationVerb, nounPhrases: [], raw };
  }

  const hyphenated = hyphenatedVerb(raw);
  if (hyphenated !== undefined) {
    return { verb: hyphenated[0], nounPhrases: hyphenated[1], raw };
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
