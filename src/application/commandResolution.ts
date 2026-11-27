// Default phase-1 composition: Tokenizer → Parser → NameResolver → Command.
// The parser exposes tokens; this module groups them into content names and
// skips only grammatical prepositions before resolving canonical IDs.
import type { ContentBundle } from '../content/ContentBundle';
import { DIRECTIONS } from '../core/commands/CommandTable';
import type { Command } from '../core/commands/Command';
import { createNameResolver } from '../core/commands/NameResolver';
import { parse } from '../core/commands/Parser';
import type { GameState } from '../core/GameState';
import type { ConversationTopic } from '../core/npcs/ConversationTopic';
import type { Condition } from '../core/rules/Condition';
import type { Direction, Position } from '../types/domain';

// Both the full name and the shortcut are aliases of `go` (§5.2), so both map
// to the canonical Direction name held in the table.
const DIRECTION_BY_TOKEN: ReadonlyMap<string, string> = new Map(
  DIRECTIONS.flatMap(
    (direction) =>
      [
        [direction.name, direction.name],
        [direction.shortcut, direction.name],
      ] as const,
  ),
);

const USE_PREPOSITIONS: ReadonlySet<string> = new Set(['on', 'with', 'using']);
const PUT_PREPOSITIONS: ReadonlySet<string> = new Set(['in', 'into', 'on']);
const UNLOCK_PREPOSITIONS: ReadonlySet<string> = new Set(['with', 'using']);

function directionCommand(token: string | undefined): Command | undefined {
  const name = token === undefined ? undefined : DIRECTION_BY_TOKEN.get(token);
  return name === undefined
    ? undefined
    : // DIRECTIONS is the canonical eight-value table, so its names are Directions.
      { kind: 'go', direction: name as Direction };
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

type LocationCondition = Extract<
  Condition,
  { readonly kind: 'in-room' | 'in-area' }
>;

function isLocationMatch(
  condition: LocationCondition,
  position: Position,
): boolean {
  return condition.kind === 'in-room'
    ? condition.roomId === position.roomId
    : condition.worldId === position.worldId &&
        condition.areaId === position.areaId;
}

// shared-rules.md §3: a location scope is an in-room/in-area condition or an
// all holding at least one. `not` and `any` are never a single location scope.
function isMatchingLocationScope(
  condition: Condition,
  position: Position,
): boolean {
  if (condition.kind === 'in-room' || condition.kind === 'in-area') {
    return isLocationMatch(condition, position);
  }
  if (condition.kind === 'all') {
    return condition.of.some(
      (of) =>
        (of.kind === 'in-room' || of.kind === 'in-area') &&
        isLocationMatch(of, position),
    );
  }
  return false;
}

// `ask about <topic>` names no actor. Infer one only when the existing bundle
// relations identify exactly one present, actor-bound topic (npcs.md §2), so
// there is never a disambiguation prompt (application-and-ui.md §5.2).
function inferAskActor(
  tokens: readonly string[],
  state: GameState,
  bundle: ContentBundle,
): string | undefined {
  if (tokens[0] !== 'about' || tokens.length < 2) return undefined;
  const position = state.player.position;
  const topics: readonly ConversationTopic[] = [
    ...bundle.conversationTopics.all,
    ...bundle.nodes.all.flatMap((node) => node.topics),
  ];
  const present = new Set<string>();
  for (const topic of topics) {
    const actorId = topic.actorId;
    if (
      actorId === undefined ||
      bundle.actors.getById(actorId) === undefined ||
      !isMatchingLocationScope(topic.isActive, position)
    ) {
      continue;
    }
    present.add(actorId);
  }
  return present.size === 1 ? [...present][0] : undefined;
}

function conversationCommand(
  kind: 'ask' | 'tell' | 'give' | 'show',
  tokens: readonly string[],
  resolve: (phrase: string) => string | undefined,
  bundle: ContentBundle,
  state: GameState,
  unknown: () => Command,
): Command {
  const parts = actorAndRemainder(tokens, resolve, bundle);
  if (parts === undefined) {
    if (kind === 'ask') {
      const actorId = inferAskActor(tokens, state, bundle);
      if (actorId !== undefined) {
        return {
          kind: 'ask',
          actorId,
          topic: tokens.slice(1).join(' '),
        };
      }
    }
    return unknown();
  }
  const [actorId, remainder] = parts;
  if (kind === 'ask' || kind === 'tell') {
    const topic = remainder[0] === 'about' ? remainder.slice(1) : remainder;
    return { kind, actorId, topic: topic.join(' ') };
  }
  const itemId = resolve(remainder.join(' '));
  if (itemId !== undefined) return { kind, actorId, itemId };
  // An unresolved item for give/show still names an actor. Keep the actor so
  // the handler can give the canonical out-of-room absence line (WR4-C1-FIX);
  // every other unresolved path keeps the fixed unknown line.
  return kind === 'give' || kind === 'show'
    ? { kind: 'unseen-actor', actorId }
    : unknown();
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

function resolveTokenPair(
  pair: readonly [readonly string[], readonly string[]],
  resolve: (phrase: string) => string | undefined,
): readonly [string, string] | undefined {
  const itemId = resolve(pair[0].join(' '));
  const targetId = resolve(pair[1].join(' '));
  return itemId === undefined || targetId === undefined
    ? undefined
    : [itemId, targetId];
}

function unlockCommand(
  tokens: readonly string[],
  resolve: (phrase: string) => string | undefined,
  unknown: () => Command,
): Command {
  const separated = splitAt(tokens, UNLOCK_PREPOSITIONS);
  // With a preposition the item comes first; in the bare form both names may
  // be multi-word, so split on resolvable halves instead of the last token.
  const pair =
    separated === undefined
      ? resolvePair(tokens, resolve)
      : resolveTokenPair(separated, resolve);
  return pair === undefined
    ? unknown()
    : { kind: 'unlock', itemId: pair[0], targetId: pair[1] };
}

function targetedCommand(
  verb: string,
  tokens: readonly string[],
  resolve: (phrase: string) => string | undefined,
  bundle: ContentBundle,
  state: GameState,
  unknown: () => Command,
): Command {
  switch (verb) {
    case 'ask':
    case 'tell':
    case 'give':
    case 'show': {
      return conversationCommand(verb, tokens, resolve, bundle, state, unknown);
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

// Shared comparison of option text (combat.md §4): only the outer whitespace
// is ignored; case is folded and internal punctuation/spacing is preserved.
function normaliseOptionText(value: string): string {
  return value.trim().toLocaleLowerCase('en-GB');
}

// A bare number is the documented bare form of `answer N` (combat.md §4),
// but only while a quiz is active; elsewhere it stays a friendly unknown.
function bareAnswerCommand(
  verb: string,
  state: GameState,
): Command | undefined {
  if (!/^\d+$/u.test(verb)) return undefined;
  const option = Number(verb);
  if (!Number.isSafeInteger(option)) return undefined;
  return state.quiz.activeQuizId === undefined
    ? undefined
    : { kind: 'answer', option };
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
  const phrase = normaliseOptionText(tokens.join(' '));
  const index =
    question === undefined
      ? -1
      : question.options.findIndex(
          (option) => normaliseOptionText(option) === phrase,
        );
  // Resolve to the 0-based option index, expressed as the seam's 1-based value.
  // An unmatched phrase stays inside the quiz so it gets the quiz's friendly
  // out-of-range message rather than a parser error.
  return { kind: 'answer', option: index === -1 ? 0 : index + 1 };
}

// The whole command, exactly as displayed, is also an accepted answer form
// (combat.md §4). Only a live quiz with a resolvable current question can
// match, and only against the options shown for that question; otherwise normal
// verb resolution proceeds. The seam stays 1-based, as for `answer N`.
function exactOptionAnswerCommand(
  raw: string,
  state: GameState,
  bundle: ContentBundle,
): Command | undefined {
  if (state.quiz.activeQuizId === undefined) return undefined;
  const questionId = state.quiz.questionIds[state.quiz.index];
  const question =
    questionId === undefined ? undefined : bundle.questions.getById(questionId);
  if (question === undefined) return undefined;
  const phrase = normaliseOptionText(raw);
  const index = question.options.findIndex(
    (option) => normaliseOptionText(option) === phrase,
  );
  return index === -1 ? undefined : { kind: 'answer', option: index + 1 };
}

export function resolveGameCommand(
  raw: string,
  state: GameState,
  bundle: ContentBundle,
): Command {
  const exactOption = exactOptionAnswerCommand(raw, state, bundle);
  if (exactOption !== undefined) return exactOption;

  const parsed = parse(raw);
  const resolver = createNameResolver();
  const tokens = parsed.nounPhrases;
  const resolve = (phrase: string): string | undefined =>
    resolver.resolve(phrase, state, bundle);
  const unknown = (): Command => ({ kind: 'unknown', raw });

  const simple = noArgumentCommand(parsed.verb);
  if (simple !== undefined) return simple;
  if (parsed.verb === 'go') {
    return directionCommand(tokens[0]) ?? unknown();
  }
  if (parsed.verb === 'answer') return answerCommand(tokens, state, bundle);
  if (tokens.length === 0) {
    const bareAnswer = bareAnswerCommand(parsed.verb, state);
    if (bareAnswer !== undefined) return bareAnswer;
  }
  if (parsed.verb === 'hint') {
    if (tokens.length === 0) return { kind: 'hint' };
    const targetId = resolve(tokens.join(' '));
    // An unresolved phrase acts as a bare hint and runs the context order
    // (hints.md §3); it is never a parser error.
    return targetId === undefined
      ? { kind: 'hint' }
      : { kind: 'hint', targetId };
  }
  return targetedCommand(parsed.verb, tokens, resolve, bundle, state, unknown);
}
