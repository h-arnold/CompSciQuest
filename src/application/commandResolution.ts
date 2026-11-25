// Default phase-1 composition: Tokenizer → Parser → NameResolver → Command.
// The parser exposes tokens; this module groups them into content names and
// skips only grammatical prepositions before resolving canonical IDs.
import type { ContentBundle } from '../content/ContentBundle';
import type { Command } from '../core/commands/Command';
import { createNameResolver } from '../core/commands/NameResolver';
import { parse } from '../core/commands/Parser';
import type { GameState } from '../core/GameState';
import type { Direction } from '../types/domain';

const DIRECTION_NAMES: ReadonlySet<string> = new Set([
  'north',
  'south',
  'east',
  'west',
  'up',
  'down',
  'in',
  'out',
]);

const USE_PREPOSITIONS: ReadonlySet<string> = new Set(['on', 'with', 'using']);
const PUT_PREPOSITIONS: ReadonlySet<string> = new Set(['in', 'into', 'on']);
const UNLOCK_PREPOSITIONS: ReadonlySet<string> = new Set(['with', 'using']);

function isDirection(value: string | undefined): value is Direction {
  return value !== undefined && DIRECTION_NAMES.has(value);
}

function noArgumentCommand(kind: string): Command | undefined {
  const commands: Readonly<Record<string, Command>> = {
    look: { kind: 'look' },
    inventory: { kind: 'inventory' },
    score: { kind: 'score' },
    help: { kind: 'help' },
    bye: { kind: 'bye' },
  };
  return commands[kind];
}

function singleIdCommand(kind: string, id: string): Command | undefined {
  switch (kind) {
    case 'take': {
      return { kind: 'take', itemId: id };
    }
    case 'drop': {
      return { kind: 'drop', itemId: id };
    }
    case 'examine': {
      return { kind: 'examine', targetId: id };
    }
    case 'open': {
      return { kind: 'open', targetId: id };
    }
    case 'close': {
      return { kind: 'close', targetId: id };
    }
    case 'talk-to': {
      return { kind: 'talk-to', actorId: id };
    }
    default: {
      return undefined;
    }
  }
}

function splitAt(
  tokens: readonly string[],
  prepositions: ReadonlySet<string>,
): readonly [readonly string[], readonly string[]] | undefined {
  const index = tokens.findIndex((token) => prepositions.has(token));
  return index === -1
    ? undefined
    : [tokens.slice(0, index), tokens.slice(index + 1)];
}

function resolvePair(
  tokens: readonly string[],
  resolve: (phrase: string) => string | undefined,
): readonly [string, string] | undefined {
  for (let split = tokens.length - 1; split > 0; split -= 1) {
    const first = resolve(tokens.slice(0, split).join(' '));
    if (first === undefined) continue;
    const second = resolve(tokens.slice(split).join(' '));
    if (second !== undefined) return [first, second];
  }
  return undefined;
}

function actorAndRemainder(
  tokens: readonly string[],
  resolve: (phrase: string) => string | undefined,
  bundle: ContentBundle,
): readonly [string, readonly string[]] | undefined {
  for (let split = tokens.length - 1; split > 0; split -= 1) {
    const actorId = resolve(tokens.slice(0, split).join(' '));
    if (actorId !== undefined && bundle.actors.getById(actorId) !== undefined) {
      return [actorId, tokens.slice(split)];
    }
  }
  return undefined;
}

function conversationCommand(
  kind: 'ask' | 'tell' | 'give' | 'show',
  tokens: readonly string[],
  resolve: (phrase: string) => string | undefined,
  bundle: ContentBundle,
  unknown: () => Command,
): Command {
  const parts = actorAndRemainder(tokens, resolve, bundle);
  if (parts === undefined) return unknown();
  const [actorId, remainder] = parts;
  if (kind === 'ask' || kind === 'tell') {
    const topic = remainder[0] === 'about' ? remainder.slice(1) : remainder;
    return { kind, actorId, topic: topic.join(' ') };
  }
  const itemId = resolve(remainder.join(' '));
  return itemId === undefined ? unknown() : { kind, actorId, itemId };
}

function useCommand(
  tokens: readonly string[],
  resolve: (phrase: string) => string | undefined,
  unknown: () => Command,
): Command {
  const separated = splitAt(tokens, USE_PREPOSITIONS);
  if (separated !== undefined) {
    const [itemTokens, targetTokens] = separated;
    const itemId = resolve(itemTokens.join(' '));
    const targetId = resolve(targetTokens.join(' '));
    return itemId === undefined || targetId === undefined
      ? unknown()
      : { kind: 'use', itemId, targetId };
  }
  const pair = resolvePair(tokens, resolve);
  if (pair !== undefined) {
    return { kind: 'use', itemId: pair[0], targetId: pair[1] };
  }
  const itemId = resolve(tokens.join(' '));
  return itemId === undefined ? unknown() : { kind: 'use', itemId };
}

function putCommand(
  tokens: readonly string[],
  resolve: (phrase: string) => string | undefined,
  unknown: () => Command,
): Command {
  const separated = splitAt(tokens, PUT_PREPOSITIONS) ?? fallbackPair(tokens);
  if (separated === undefined) return unknown();
  const itemId = resolve(separated[0].join(' '));
  const targetId = resolve(separated[1].join(' '));
  return itemId === undefined || targetId === undefined
    ? unknown()
    : { kind: 'put', itemId, targetId };
}

function fallbackPair(
  tokens: readonly string[],
): readonly [readonly string[], readonly string[]] | undefined {
  const split = tokens.length - 1;
  return split > 0 ? [tokens.slice(0, split), tokens.slice(split)] : undefined;
}

function unlockCommand(
  tokens: readonly string[],
  resolve: (phrase: string) => string | undefined,
  unknown: () => Command,
): Command {
  const separated = splitAt(tokens, UNLOCK_PREPOSITIONS);
  const pair = separated ?? fallbackPair(tokens);
  if (pair === undefined) return unknown();
  const itemId = resolve(pair[0].join(' '));
  const targetId = resolve(pair[1].join(' '));
  return itemId === undefined || targetId === undefined
    ? unknown()
    : { kind: 'unlock', itemId, targetId };
}

function targetedCommand(
  verb: string,
  tokens: readonly string[],
  resolve: (phrase: string) => string | undefined,
  bundle: ContentBundle,
  unknown: () => Command,
): Command {
  switch (verb) {
    case 'ask':
    case 'tell':
    case 'give':
    case 'show': {
      return conversationCommand(verb, tokens, resolve, bundle, unknown);
    }
    case 'use': {
      return useCommand(tokens, resolve, unknown);
    }
    case 'put': {
      return putCommand(tokens, resolve, unknown);
    }
    case 'unlock': {
      return unlockCommand(tokens, resolve, unknown);
    }
    default: {
      const id = resolve(tokens.join(' '));
      return id === undefined
        ? unknown()
        : (singleIdCommand(verb, id) ?? unknown());
    }
  }
}

function answerCommand(
  tokens: readonly string[],
  state: GameState,
  bundle: ContentBundle,
): Command {
  const numeric = Number(tokens[0] ?? '');
  // A numeric token stays 1-based; the quiz seam converts it to a 0-based
  // option (combat.md §4).
  if (tokens.length > 0 && Number.isSafeInteger(numeric)) {
    return { kind: 'answer', option: numeric };
  }
  const quizId = state.quiz.activeQuizId;
  if (quizId === undefined) return { kind: 'answer', option: 0 };
  const questionId = state.quiz.questionIds[state.quiz.index];
  const question =
    questionId === undefined ? undefined : bundle.questions.getById(questionId);
  const phrase = tokens.join(' ').trim().toLocaleLowerCase('en-GB');
  const index =
    question === undefined
      ? -1
      : question.options.findIndex(
          (option) => option.trim().toLocaleLowerCase('en-GB') === phrase,
        );
  // Resolve to the 0-based option index, expressed as the seam's 1-based value.
  // An unmatched phrase stays inside the quiz so it gets the quiz's friendly
  // out-of-range message rather than a parser error.
  return { kind: 'answer', option: index === -1 ? 0 : index + 1 };
}

export function resolveGameCommand(
  raw: string,
  state: GameState,
  bundle: ContentBundle,
): Command {
  const parsed = parse(raw);
  const resolver = createNameResolver();
  const tokens = parsed.nounPhrases;
  const resolve = (phrase: string): string | undefined =>
    resolver.resolve(phrase, state, bundle);
  const unknown = (): Command => ({ kind: 'unknown', raw });

  const simple = noArgumentCommand(parsed.verb);
  if (simple !== undefined) return simple;
  if (parsed.verb === 'go') {
    return isDirection(tokens[0])
      ? { kind: 'go', direction: tokens[0] }
      : unknown();
  }
  if (parsed.verb === 'answer') return answerCommand(tokens, state, bundle);
  if (parsed.verb === 'hint') {
    if (tokens.length === 0) return { kind: 'hint' };
    const targetId = resolve(tokens.join(' '));
    // An unresolved phrase acts as a bare hint and runs the context order
    // (hints.md §3); it is never a parser error.
    return targetId === undefined
      ? { kind: 'hint' }
      : { kind: 'hint', targetId };
  }
  return targetedCommand(parsed.verb, tokens, resolve, bundle, unknown);
}
