// Pure topic selection from npcs.md §4 step 2, §5 and shared-rules.md §2/§3.
// Node topics beat actor topics and defaults; every candidate is gated by the
// shared ConditionEvaluator. This module computes no effects and mutates nothing.
import type { ContentBundle } from '../../content/ContentBundle';
import type { Command } from '../commands/Command';
import { createNameResolver } from '../commands/NameResolver';
import type { Condition } from '../rules/Condition';
import type { ConditionEvaluator } from '../rules/ConditionEvaluator';
import type { TurnContext } from '../TurnContext';
import type { ConversationNode } from './ConversationNode';
import type { ConversationTopic } from './ConversationTopic';
import type { TopicMatch } from './TopicMatch';
import type { ResolvedTopic } from './ResolvedTopic';
import { findDeclaredObjectPhrase, normalise } from './TopicPhrase';

export interface SelectedTopic {
  readonly topic: ConversationTopic;
  readonly fromNode: boolean;
  readonly isDefault: boolean;
}

type AskTellMatch = Extract<
  TopicMatch,
  { readonly kind: 'ask' | 'tell' | 'askTell' }
>;
type GiveShowMatch = Extract<TopicMatch, { readonly kind: 'give' | 'show' }>;
type KeywordMatch = Extract<
  TopicMatch,
  { readonly kind: 'command' | 'special' }
>;

// The match kinds are checked in one place so no equality chain is repeated
// across the selection helpers (npcs.md §2).
function isAskTellMatch(match: TopicMatch): match is AskTellMatch {
  switch (match.kind) {
    case 'ask':
    case 'tell':
    case 'askTell': {
      return true;
    }
    default: {
      return false;
    }
  }
}

function isGiveShowMatch(match: TopicMatch): match is GiveShowMatch {
  switch (match.kind) {
    case 'give':
    case 'show': {
      return true;
    }
    default: {
      return false;
    }
  }
}

function isKeywordMatch(match: TopicMatch): match is KeywordMatch {
  switch (match.kind) {
    case 'command':
    case 'special': {
      return true;
    }
    default: {
      return false;
    }
  }
}

// Ask and tell share one free-text class (npcs.md §3/§4); the verb also gates
// keyword and object matches through this compatibility check.
function isCommandCompatible(match: TopicMatch, command: Command): boolean {
  if (!isAskTellMatch(match)) return true;
  switch (command.kind) {
    case 'ask': {
      return match.kind !== 'tell';
    }
    case 'tell': {
      return match.kind !== 'ask';
    }
    default: {
      return true;
    }
  }
}

// A catch-all is an askTell topic with no object IDs; its authored response is
// the only wording the runtime uses for an unmatched phrase (GAP-09). An
// empty-object tell remains an explicit free-text target because it cannot
// answer ask (npcs.md §3).
export function isDefaultTopic(topic: ConversationTopic): boolean {
  return topic.match.kind === 'askTell' && topic.match.objectIds.length === 0;
}

function hasKeyword(keywords: readonly string[], phrase: string): boolean {
  return keywords.some((keyword) => {
    const normalised = keyword.trim().toLowerCase();
    return normalised === phrase || phrase.split(' ').includes(normalised);
  });
}

function hasObjectMatch(
  topic: ConversationTopic,
  objectId: string,
  command: Command,
): boolean {
  const match = topic.match;
  if (command.kind === 'give' || command.kind === 'show') {
    return isGiveShowMatch(match)
      ? match.kind === command.kind && match.itemIds.includes(objectId)
      : isAskTellMatch(match) && match.objectIds.includes(objectId);
  }
  return (
    isAskTellMatch(match) &&
    match.objectIds.includes(objectId) &&
    isCommandCompatible(match, command)
  );
}

function hasResolvedMatch(
  topic: ConversationTopic,
  resolved: ResolvedTopic,
  command: Command,
  phrase: string,
  canMatchKeywordPhrase: boolean,
  isTopicIdPhrase: boolean,
): boolean {
  if (resolved.kind === 'keyword') {
    return (
      (topic.id === resolved.topicId &&
        (isKeywordMatch(topic.match) || isAskTellMatch(topic.match)) &&
        isCommandCompatible(topic.match, command)) ||
      (canMatchKeywordPhrase &&
        isKeywordMatch(topic.match) &&
        hasKeyword(topic.match.keywords, phrase))
    );
  }
  if (resolved.kind === 'object') {
    return hasObjectMatch(topic, resolved.objectId, command);
  }
  const match = topic.match;
  if (isKeywordMatch(match)) {
    return !isTopicIdPhrase && hasKeyword(match.keywords, phrase);
  }
  if (isGiveShowMatch(match)) {
    return match.kind === command.kind && match.itemIds.includes(phrase);
  }
  // Unmatched free text still reaches an active concrete ask/tell topic; the
  // catch-all is only chosen when no such topic is selectable (npcs.md §3).
  // GIVE and SHOW must keep their own item matches instead of falling into an
  // earlier ask/tell lesson.
  return (
    isAskTellMatch(match) &&
    (command.kind === 'ask' || command.kind === 'tell') &&
    isCommandCompatible(match, command)
  );
}

function isActive(
  topic: ConversationTopic,
  context: TurnContext,
  evaluator: ConditionEvaluator,
): boolean {
  return evaluator.evaluate(topic.isActive, context.state, context);
}

// Positive room gates in a mandatory `all` chain provide presence or absence
// evidence. Alternatives, negations and node-only conditions remain neutral.
function hasRequiredRoomEvidence(
  condition: Condition,
  context: TurnContext,
  evaluator: ConditionEvaluator,
  evidence: 'matching' | 'unmet',
): boolean {
  if (condition.kind === 'in-room') {
    const matches = evaluator.evaluate(condition, context.state, context);
    return evidence === 'matching' ? matches : !matches;
  }
  return condition.kind === 'all'
    ? condition.of.some((child) =>
        hasRequiredRoomEvidence(child, context, evaluator, evidence),
      )
    : false;
}

function usesOf(
  context: TurnContext,
  actorId: string,
  topicId: string,
): number {
  return context.state.npcs[actorId]?.topicUses[topicId] ?? 0;
}

function isExhaustedOnce(
  topic: ConversationTopic,
  context: TurnContext,
  actorId: string,
): boolean {
  return (
    topic.strategy.kind === 'once' && usesOf(context, actorId, topic.id) > 0
  );
}

export function findDefaultTopic(
  context: TurnContext,
  evaluator: ConditionEvaluator,
  actorId: string,
  node: ConversationNode | undefined,
  excludedTopicIds: readonly string[] = [],
): ConversationTopic | undefined {
  const nodeDefault =
    node === undefined
      ? undefined
      : node.topics.find(
          (topic) =>
            topic.id === node.defaultTopicId &&
            isDefaultTopic(topic) &&
            !excludedTopicIds.includes(topic.id),
        );
  const activeNodeDefault =
    nodeDefault !== undefined && isActive(nodeDefault, context, evaluator)
      ? nodeDefault
      : undefined;
  return (
    activeNodeDefault ??
    context.bundle.conversationTopics.all.find(
      (topic) =>
        isDefaultTopic(topic) &&
        (topic.actorId === undefined || topic.actorId === actorId) &&
        !excludedTopicIds.includes(topic.id) &&
        !isExhaustedOnce(topic, context, actorId) &&
        isActive(topic, context, evaluator),
    )
  );
}

// A phrase that names a declared object ID selects that exact authored topic
// among object matches (npcs.md §3). This is distinct from the forbidden ID
// tie-break in the free-text class: the object is already resolved here.
function exactDeclaredTopic(
  context: TurnContext,
  actorId: string,
  resolved: ResolvedTopic,
  phrase: string,
): ConversationTopic | undefined {
  if (resolved.kind !== 'object') return undefined;
  const bundle: ContentBundle = context.bundle;
  const normalised = phrase.trim().toLowerCase();
  if (
    createNameResolver().resolve(normalised, context.state, bundle) !==
    undefined
  )
    return undefined;
  const declared = findDeclaredObjectPhrase(phrase, bundle, actorId);
  if (declared === undefined || declared.objectId !== resolved.objectId)
    return undefined;
  if (declared.topics.length === 1) return declared.topics[0];
  // Several topics declare the phrase. The one bound to the speaking actor is
  // the authored topic for this conversation (npcs.md §3/§5, W7-HANDOFF.md §103
  // fix 2); an unbound decoy must not answer in its place. This remains an
  // object-match rule: actor binding, never a topic-ID word, is the tie-break.
  // Ambiguity among actor-bound topics leaves the exact preference unset.
  const bound = declared.topics.filter((topic) => topic.actorId === actorId);
  return bound.length === 1 ? bound[0] : undefined;
}

// With no selectable topic or default, absence requires unmet mandatory room
// evidence and no matching evidence on any actor-bound topic. Node-only topics
// do not establish presence or absence.
export function isActorOutOfRoom(
  context: TurnContext,
  evaluator: ConditionEvaluator,
  actorId: string,
): boolean {
  const actorTopics = context.bundle.conversationTopics.all.filter(
    (topic) => topic.actorId === actorId,
  );
  const hasUnmetRoom = actorTopics.some((topic) =>
    hasRequiredRoomEvidence(topic.isActive, context, evaluator, 'unmet'),
  );
  const hasMatchingRoom = actorTopics.some((topic) =>
    hasRequiredRoomEvidence(topic.isActive, context, evaluator, 'matching'),
  );
  return hasUnmetRoom && !hasMatchingRoom;
}

function chooseCandidate(
  candidates: readonly (readonly [ConversationTopic, boolean])[],
  context: TurnContext,
  evaluator: ConditionEvaluator,
  actorId: string,
  resolved: ResolvedTopic,
  phrase: string,
  canMatchKeywordPhrase: boolean,
  isTopicIdPhrase: boolean,
): SelectedTopic | undefined {
  const exact = exactDeclaredTopic(context, actorId, resolved, phrase);
  if (exact !== undefined) {
    const isCompatible =
      isAskTellMatch(exact.match) &&
      isCommandCompatible(exact.match, context.command);
    const bound = candidates.find(([topic]) => topic.id === exact.id);
    if (bound !== undefined) {
      if (!isCompatible) return undefined;
      if (isActive(exact, context, evaluator)) {
        return {
          topic: exact,
          fromNode: bound[1],
          isDefault: false,
        };
      }
    }
  }
  const match = candidates.find(
    ([topic]) =>
      !isDefaultTopic(topic) &&
      isActive(topic, context, evaluator) &&
      hasResolvedMatch(
        topic,
        resolved,
        context.command,
        phrase,
        canMatchKeywordPhrase,
        isTopicIdPhrase,
      ),
  );
  return match === undefined
    ? undefined
    : { topic: match[0], fromNode: match[1], isDefault: false };
}

export function selectTopic(
  context: TurnContext,
  evaluator: ConditionEvaluator,
  actorId: string,
  node: ConversationNode | undefined,
  resolved: ResolvedTopic,
  phrase: string,
): SelectedTopic | undefined {
  const nodeTopics = node?.topics ?? [];
  const actorTopics = context.bundle.conversationTopics.all.filter(
    (topic) => topic.actorId === undefined || topic.actorId === actorId,
  );
  // The resolver may name an inactive special. Its exact ID remains
  // authoritative across both passes while active; only otherwise may
  // selection recover by authored keywords in node-then-actor order.
  const keywordCandidate =
    resolved.kind === 'keyword'
      ? (nodeTopics.find((topic) => topic.id === resolved.topicId) ??
        actorTopics.find((topic) => topic.id === resolved.topicId))
      : undefined;
  const canMatchKeywordPhrase =
    resolved.kind === 'keyword' &&
    (keywordCandidate === undefined ||
      !isActive(keywordCandidate, context, evaluator));
  // A whole phrase equal to a catalogue topic ID is not authored vocabulary.
  // Exclude it from free-text keyword token matching without ranking topics.
  const normalisedPhrase = normalise(phrase);
  const isTopicIdPhrase =
    resolved.kind === 'free-text' &&
    context.bundle.conversationTopics.all.some(
      (topic) => normalise(topic.id) === normalisedPhrase,
    );
  const nodeMatch = chooseCandidate(
    nodeTopics.map((topic) => [topic, true] as const),
    context,
    evaluator,
    actorId,
    resolved,
    phrase,
    canMatchKeywordPhrase,
    isTopicIdPhrase,
  );
  if (nodeMatch !== undefined) return nodeMatch;
  const actorMatch = chooseCandidate(
    actorTopics.map((topic) => [topic, false] as const),
    context,
    evaluator,
    actorId,
    resolved,
    phrase,
    canMatchKeywordPhrase,
    isTopicIdPhrase,
  );
  if (actorMatch !== undefined) return actorMatch;
  // W7-HANDOFF.md §103 fix 2: an exact object-match topic that is
  // command-incompatible must not fall through to a different topic here. The
  // default catch-all is delivered by the non-counting idle-response path.
  const exact = exactDeclaredTopic(context, actorId, resolved, phrase);
  if (
    exact !== undefined &&
    !isCommandCompatible(exact.match, context.command)
  ) {
    return undefined;
  }
  const fallback = findDefaultTopic(context, evaluator, actorId, node);
  return fallback === undefined
    ? undefined
    : { topic: fallback, fromNode: false, isDefault: true };
}
