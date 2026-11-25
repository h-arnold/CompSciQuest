// C7 authoring-time topic-overlap gate (content-rules.md C7 and the §7
// npc-content row; npcs.md §3). It compares an actor's topics that can receive
// the same input and reports every pair whose isActive conditions cannot be
// proved mutually exclusive. The check is deliberately conservative: anything
// it cannot prove stays a finding.

import type { Finding, ParsedCardSet } from '../contracts.ts';
import {
  asNumber,
  asObjectArray,
  asRecord,
  asText,
  collection,
  finding,
  stringList,
  type CardEntry,
} from './common.ts';

type DataRecord = Readonly<Record<string, unknown>>;

const ALWAYS_TRUE: DataRecord = { kind: 'all', of: [] };
const ASK_TELL_KINDS: ReadonlySet<string> = new Set(['ask', 'tell', 'askTell']);
const GIVE_SHOW_KINDS: ReadonlySet<string> = new Set(['give', 'show']);

interface TopicInfo {
  readonly entry: CardEntry;
  readonly id: string;
  readonly actorId: string;
  readonly kind: string;
  readonly match: DataRecord;
  readonly isActive: DataRecord;
}

function recordOf(value: unknown): DataRecord {
  return asRecord(value) ?? {};
}

function conditionOf(value: unknown): DataRecord {
  return asRecord(value) ?? ALWAYS_TRUE;
}

function kindOf(condition: DataRecord): string {
  return asText(condition['kind']);
}

function childrenOf(condition: DataRecord): readonly DataRecord[] {
  return asObjectArray(condition['of']);
}

function unwrapDoubleNot(condition: DataRecord): DataRecord {
  let current = condition;
  while (kindOf(current) === 'not') {
    const inner = asRecord(current['of']);
    if (inner === undefined || kindOf(inner) !== 'not') return current;
    const innerInner = asRecord(inner['of']);
    if (innerInner === undefined) return current;
    current = innerInner;
  }
  return current;
}

function isAlwaysFalse(condition: DataRecord): boolean {
  const kind = kindOf(condition);
  if (kind === 'not') {
    const inner = asRecord(condition['of']);
    return inner !== undefined && isAlwaysTrue(inner);
  }
  if (kind === 'all') {
    return childrenOf(condition).some((child) => isAlwaysFalse(child));
  }
  if (kind === 'any') {
    return childrenOf(condition).every((child) => isAlwaysFalse(child));
  }
  return false;
}

function isAlwaysTrue(condition: DataRecord): boolean {
  const kind = kindOf(condition);
  if (kind === 'not') {
    const inner = asRecord(condition['of']);
    return inner !== undefined && isAlwaysFalse(inner);
  }
  if (kind === 'all') {
    return childrenOf(condition).every((child) => isAlwaysTrue(child));
  }
  if (kind === 'any') {
    return childrenOf(condition).some((child) => isAlwaysTrue(child));
  }
  return false;
}

function literalKey(condition: DataRecord): string | undefined {
  switch (kindOf(condition)) {
    case 'flag-set': {
      return `flag-set:${asText(condition['flag'])}`;
    }
    case 'has-item': {
      return `has-item:${asText(condition['itemId'])}`;
    }
    case 'visited-room': {
      return `visited-room:${asText(condition['roomId'])}`;
    }
    case 'in-room': {
      return `in-room:${asText(condition['roomId'])}`;
    }
    case 'in-area': {
      return `in-area:${asText(condition['worldId'])}:${asText(condition['areaId'])}`;
    }
    case 'npc-knows': {
      return `npc-knows:${asText(condition['actorId'])}:${asText(condition['topicId'])}`;
    }
    case 'actor-state': {
      return `actor-state:${asText(condition['actorId'])}:${asText(condition['stateId'])}`;
    }
    case 'in-node': {
      return `in-node:${asText(condition['actorId'])}:${asText(condition['nodeId'])}`;
    }
    case 'puzzle-solved': {
      return `puzzle-solved:${asText(condition['puzzleId'])}`;
    }
    case 'quiz-passed': {
      return `quiz-passed:${asText(condition['quizId'])}`;
    }
    default: {
      return undefined;
    }
  }
}

function isLiteralEntailment(source: DataRecord, goal: DataRecord): boolean {
  if (kindOf(source) !== kindOf(goal)) return false;
  if (kindOf(source) === 'counter-at-least') {
    return (
      asText(source['key']) === asText(goal['key']) &&
      asNumber(source['value']) >= asNumber(goal['value'])
    );
  }
  const sourceKey = literalKey(source);
  return sourceKey !== undefined && sourceKey === literalKey(goal);
}

// Single-valued literals: two different positions/states/nodes cannot both
// hold. Multi-valued literals (flags, inventory, visited rooms, solved puzzles,
// passed quizzes, counters) deliberately return false.
function areLiteralsExclusive(left: DataRecord, right: DataRecord): boolean {
  const kind = kindOf(left);
  if (kind !== kindOf(right)) return false;
  switch (kind) {
    case 'in-room': {
      return asText(left['roomId']) !== asText(right['roomId']);
    }
    case 'in-area': {
      return (
        asText(left['worldId']) !== asText(right['worldId']) ||
        asText(left['areaId']) !== asText(right['areaId'])
      );
    }
    case 'actor-state': {
      return (
        asText(left['actorId']) === asText(right['actorId']) &&
        asText(left['stateId']) !== asText(right['stateId'])
      );
    }
    case 'in-node': {
      return (
        asText(left['actorId']) === asText(right['actorId']) &&
        asText(left['nodeId']) !== asText(right['nodeId'])
      );
    }
    default: {
      return false;
    }
  }
}

// True only when every state satisfying `source` also satisfies `goal`.
function doesEntail(source: DataRecord, goal: DataRecord): boolean {
  const from = unwrapDoubleNot(source);
  const to = unwrapDoubleNot(goal);
  if (isAlwaysFalse(from) || isAlwaysTrue(to)) return true;
  const goalKind = kindOf(to);
  if (goalKind === 'not') {
    const inner = asRecord(to['of']);
    return inner !== undefined && isExclusive(from, inner);
  }
  const sourceKind = kindOf(from);
  if (sourceKind === 'not') return false;
  if (goalKind === 'all') {
    return childrenOf(to).every((child) => doesEntail(from, child));
  }
  if (goalKind === 'any') {
    return childrenOf(to).some((child) => doesEntail(from, child));
  }
  if (sourceKind === 'all') {
    return childrenOf(from).some((child) => doesEntail(child, to));
  }
  if (sourceKind === 'any') {
    return childrenOf(from).every((child) => doesEntail(child, to));
  }
  return isLiteralEntailment(from, to);
}

function isExclusive(left: DataRecord, right: DataRecord): boolean {
  const first = unwrapDoubleNot(left);
  const second = unwrapDoubleNot(right);
  if (isAlwaysFalse(first) || isAlwaysFalse(second)) return true;
  const firstKind = kindOf(first);
  const secondKind = kindOf(second);
  if (firstKind === 'not' || secondKind === 'not') {
    if (firstKind === 'not' && secondKind === 'not') return false;
    const positive = firstKind === 'not' ? second : first;
    const negative = firstKind === 'not' ? first : second;
    const inner = asRecord(negative['of']);
    return inner !== undefined && doesEntail(positive, inner);
  }
  if (firstKind === 'all') {
    return childrenOf(first).some((child) => isExclusive(child, second));
  }
  if (secondKind === 'all') {
    return childrenOf(second).some((child) => isExclusive(first, child));
  }
  if (firstKind === 'any') {
    return childrenOf(first).every((child) => isExclusive(child, second));
  }
  if (secondKind === 'any') {
    return childrenOf(second).every((child) => isExclusive(first, child));
  }
  return areLiteralsExclusive(first, second);
}

function normaliseKeyword(keyword: string): string {
  return keyword.trim().toLowerCase();
}

function keywordsOf(topic: TopicInfo): readonly string[] {
  return stringList(topic.match['keywords'])
    .map((keyword) => normaliseKeyword(keyword))
    .filter((keyword) => keyword.length > 0);
}

function itemIdsOf(topic: TopicInfo): readonly string[] {
  return stringList(topic.match['itemIds']);
}

// Mirrors TopicSelection.hasKeyword: one keyword equals the other or is a
// whitespace-separated word of the other (npcs.md §3, §7).
function areKeywordsOverlapping(
  left: readonly string[],
  right: readonly string[],
): boolean {
  return left.some((first) =>
    right.some(
      (second) =>
        first === second ||
        second.split(' ').includes(first) ||
        first.split(' ').includes(second),
    ),
  );
}

function isFreeTextClass(topic: TopicInfo): boolean {
  return (
    ASK_TELL_KINDS.has(topic.kind) ||
    (topic.kind === 'command' && keywordsOf(topic).length > 0)
  );
}

function isGiveShowClass(topic: TopicInfo): boolean {
  return GIVE_SHOW_KINDS.has(topic.kind) && itemIdsOf(topic).length > 0;
}

function isCandidate(topic: TopicInfo): boolean {
  if (ASK_TELL_KINDS.has(topic.kind)) {
    // A catch-all ask/tell topic is the fallback, not a competing target.
    return stringList(topic.match['objectIds']).length > 0;
  }
  if (topic.kind === 'command') return keywordsOf(topic).length > 0;
  return GIVE_SHOW_KINDS.has(topic.kind) && itemIdsOf(topic).length > 0;
}

function isTopicOverlap(left: TopicInfo, right: TopicInfo): boolean {
  const areBothFreeText = isFreeTextClass(left) && isFreeTextClass(right);
  // Free text does not distinguish ask from tell, and a command keyword is a
  // phrase that any non-default ask/tell topic also accepts.
  const isFreeTextOverlap =
    left.kind !== 'command' ||
    right.kind !== 'command' ||
    areKeywordsOverlapping(keywordsOf(left), keywordsOf(right));
  // Cross-class pairs are out of scope: objectIds name spec topics, itemIds
  // name items (content-rules.md C7).
  const areBothGiveShow = isGiveShowClass(left) && isGiveShowClass(right);
  const isGiveShowOverlap =
    left.kind === right.kind &&
    itemIdsOf(left).some((itemId) => itemIdsOf(right).includes(itemId));
  return (
    (areBothFreeText && isFreeTextOverlap) ||
    (areBothGiveShow && isGiveShowOverlap)
  );
}

function topicInfos(cards: ParsedCardSet): readonly TopicInfo[] {
  const topics: TopicInfo[] = [];
  for (const entry of collection(cards, 'conversationTopics')) {
    const actorId = asText(entry.data['actorId']);
    // C6 requires every authored topic to carry actorId. An unbound topic is
    // skipped rather than guessed onto an actor (no test depends on it).
    if (actorId.length === 0) continue;
    const match = recordOf(entry.data['match']);
    topics.push({
      entry,
      id: asText(entry.data['id']),
      actorId,
      kind: asText(match['kind']),
      match,
      isActive: conditionOf(entry.data['isActive']),
    });
  }
  return topics;
}

function nodeTopicIdLists(
  cards: ParsedCardSet,
): readonly (readonly string[])[] {
  return collection(cards, 'conversationNodes').map((node) =>
    stringList(node.data['topicIds']),
  );
}

function isNodeExempt(
  leftId: string,
  rightId: string,
  nodeLists: readonly (readonly string[])[],
): boolean {
  return nodeLists.some((ids) => ids.includes(leftId) && ids.includes(rightId));
}

// Node topics come first in node order, then the remaining actor topics in card
// declaration order (npcs.md §3: node topics before actor topics).
function declarationRank(
  topics: readonly TopicInfo[],
  nodeLists: readonly (readonly string[])[],
): ReadonlyMap<string, number> {
  const rank = new Map<string, number>();
  const assign = (id: string): void => {
    if (id.length > 0 && !rank.has(id)) rank.set(id, rank.size);
  };
  for (const ids of nodeLists) for (const id of ids) assign(id);
  for (const topic of topics) assign(topic.id);
  return rank;
}

function groupByActor(
  topics: readonly TopicInfo[],
): readonly (readonly TopicInfo[])[] {
  const groups: TopicInfo[][] = [];
  const indexByActor = new Map<string, number>();
  for (const topic of topics) {
    const index = indexByActor.get(topic.actorId);
    if (index === undefined) {
      indexByActor.set(topic.actorId, groups.length);
      groups.push([topic]);
    } else {
      groups[index]?.push(topic);
    }
  }
  return groups;
}

function earlierOf(
  left: TopicInfo,
  right: TopicInfo,
  rank: ReadonlyMap<string, number>,
): readonly [TopicInfo, TopicInfo] {
  const leftRank = rank.get(left.id) ?? Number.MAX_SAFE_INTEGER;
  const rightRank = rank.get(right.id) ?? Number.MAX_SAFE_INTEGER;
  return leftRank <= rightRank ? [left, right] : [right, left];
}

function pairFinding(
  left: TopicInfo,
  right: TopicInfo,
  nodeLists: readonly (readonly string[])[],
  rank: ReadonlyMap<string, number>,
): Finding | undefined {
  if (
    isNodeExempt(left.id, right.id, nodeLists) ||
    !isTopicOverlap(left, right) ||
    isExclusive(left.isActive, right.isActive)
  ) {
    return undefined;
  }
  const [earlier, later] = earlierOf(left, right, rank);
  return finding(
    earlier.entry.path,
    earlier.entry.entry,
    `conversation topics '${earlier.id}' and '${later.id}' overlap for actor '${earlier.actorId}'`,
    'npc-content',
  );
}

function groupFindings(
  group: readonly TopicInfo[],
  nodeLists: readonly (readonly string[])[],
  rank: ReadonlyMap<string, number>,
): readonly Finding[] {
  const findings: Finding[] = [];
  for (let first = 0; first < group.length; first += 1) {
    const left = group[first];
    if (left === undefined) continue;
    for (let second = first + 1; second < group.length; second += 1) {
      const right = group[second];
      if (right === undefined) continue;
      const findingOfPair = pairFinding(left, right, nodeLists, rank);
      if (findingOfPair !== undefined) findings.push(findingOfPair);
    }
  }
  return findings;
}

export function checkTopicOverlap(cards: ParsedCardSet): readonly Finding[] {
  const topics = topicInfos(cards).filter((topic) => isCandidate(topic));
  const nodeLists = nodeTopicIdLists(cards);
  const rank = declarationRank(topics, nodeLists);
  return groupByActor(topics).flatMap((group) =>
    groupFindings(group, nodeLists, rank),
  );
}
