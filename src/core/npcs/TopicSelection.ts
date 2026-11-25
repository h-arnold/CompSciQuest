// Pure topic selection from npcs.md §4 step 2, §5 and shared-rules.md §2/§3.
// Node topics beat actor topics and defaults; every candidate is gated by the
// shared ConditionEvaluator. This module computes no effects and mutates nothing.
import type { Command } from '../commands/Command';
import type { ConditionEvaluator } from '../rules/ConditionEvaluator';
import type { TurnContext } from '../TurnContext';
import type { ConversationNode } from './ConversationNode';
import type { ConversationTopic } from './ConversationTopic';
import type { TopicMatch } from './TopicMatch';
import type { ResolvedTopic } from './ResolvedTopic';

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

// A catch-all ask/tell topic declares no object IDs; its authored response is
// the only wording the runtime uses for an unmatched phrase (GAP-09).
export function isDefaultTopic(topic: ConversationTopic): boolean {
  return isAskTellMatch(topic.match) && topic.match.objectIds.length === 0;
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
  if (!isAskTellMatch(match) || !match.objectIds.includes(objectId)) {
    return false;
  }
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

function hasResolvedMatch(
  topic: ConversationTopic,
  resolved: ResolvedTopic,
  command: Command,
  phrase: string,
): boolean {
  if (resolved.kind === 'keyword') {
    return topic.match.kind === 'special' && topic.id === resolved.topicId;
  }
  if (resolved.kind === 'object') {
    return hasObjectMatch(topic, resolved.objectId, command);
  }
  const match = topic.match;
  if (isKeywordMatch(match)) {
    return hasKeyword(match.keywords, phrase);
  }
  if (isGiveShowMatch(match)) {
    return match.kind === command.kind && match.itemIds.includes(phrase);
  }
  // Unmatched free text still reaches an active concrete ask/tell topic; the
  // catch-all is only chosen when no such topic is selectable (npcs.md §3).
  // GIVE and SHOW must keep their own item matches instead of falling into an
  // earlier ask/tell lesson.
  return (
    isAskTellMatch(match) && (command.kind === 'ask' || command.kind === 'tell')
  );
}

function isActive(
  topic: ConversationTopic,
  context: TurnContext,
  evaluator: ConditionEvaluator,
): boolean {
  return evaluator.evaluate(topic.isActive, context.state, context);
}

export function findDefaultTopic(
  context: TurnContext,
  evaluator: ConditionEvaluator,
  actorId: string,
  node: ConversationNode | undefined,
): ConversationTopic | undefined {
  const nodeDefault =
    node === undefined
      ? undefined
      : node.topics.find(
          (topic) => topic.id === node.defaultTopicId && isDefaultTopic(topic),
        );
  const globalDefault = context.bundle.conversationTopics.all.find(
    (topic) =>
      isDefaultTopic(topic) &&
      (topic.actorId === undefined || topic.actorId === actorId),
  );
  for (const topic of [nodeDefault, globalDefault]) {
    if (topic !== undefined && isActive(topic, context, evaluator))
      return topic;
  }
  return undefined;
}

// Free text has no resolved object to match against; a topic whose authored ID
// carries one of the phrase's words is the more specific answer (for example
// "ask the clerk about shifts" selecting `topic-clerk-shifts` over the general
// teaching topic that is still active).
function isIdMatchingPhrase(topicId: string, phrase: string): boolean {
  const words = new Set(topicId.toLowerCase().split('-'));
  return phrase
    .toLowerCase()
    .split(/\s+/u)
    .some((word) => word.length > 0 && words.has(word));
}

function chooseCandidate(
  candidates: readonly (readonly [ConversationTopic, boolean])[],
  context: TurnContext,
  evaluator: ConditionEvaluator,
  resolved: ResolvedTopic,
  phrase: string,
): SelectedTopic | undefined {
  const matches = candidates.filter(
    ([topic]) =>
      !isDefaultTopic(topic) &&
      isActive(topic, context, evaluator) &&
      hasResolvedMatch(topic, resolved, context.command, phrase),
  );
  if (matches.length === 0) return undefined;
  const preferred =
    resolved.kind === 'free-text'
      ? matches.find(([topic]) => isIdMatchingPhrase(topic.id, phrase))
      : undefined;
  const [topic, fromNode] = preferred ?? matches[0]!;
  return { topic, fromNode, isDefault: false };
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
  const nodeMatch = chooseCandidate(
    nodeTopics.map((topic) => [topic, true] as const),
    context,
    evaluator,
    resolved,
    phrase,
  );
  if (nodeMatch !== undefined) return nodeMatch;
  const actorMatch = chooseCandidate(
    actorTopics.map((topic) => [topic, false] as const),
    context,
    evaluator,
    resolved,
    phrase,
  );
  if (actorMatch !== undefined) return actorMatch;
  const fallback = findDefaultTopic(context, evaluator, actorId, node);
  return fallback === undefined
    ? undefined
    : { topic: fallback, fromNode: false, isDefault: true };
}
