// npc-content gate (content-rules.md §4.3, §7, C6): actor binding, reserved
// nodes, the silent ready state and concrete node topic resolution.

import type {
  Finding,
  ParsedCardSet,
  ValidationOptions,
} from '../contracts.ts';
import {
  allEffects,
  asObjectArray,
  asRecord,
  asText,
  authoringOf,
  collection,
  finding,
  idsOf,
  stringList,
  type CardEntry,
} from './common.ts';
import { checkTopicOverlap } from './topicOverlap.ts';

function topicActorFindings(
  topics: readonly CardEntry[],
  actorIds: ReadonlySet<string>,
): readonly Finding[] {
  return topics.flatMap((topic) => {
    const actorId = asText(topic.data['actorId']);
    return actorId.length > 0 && !actorIds.has(actorId)
      ? [
          finding(
            topic.path,
            topic.entry,
            `actorId '${actorId}' names no declared actor`,
            'npc-content',
          ),
        ]
      : [];
  });
}

function defaultTopicFindings(
  node: CardEntry,
  topics: readonly CardEntry[],
  actorId: string,
): readonly Finding[] {
  const defaultTopicId = asText(node.data['defaultTopicId']);
  const matching = topics.filter(
    (topic) => asText(topic.data['id']) === defaultTopicId,
  );
  const foreign = matching.some(
    (topic) => asText(topic.data['actorId']) !== actorId,
  );
  const isMissing = matching.length === 0 && topics.length === 1;
  return defaultTopicId.length > 0 && (foreign || isMissing)
    ? [
        finding(
          node.path,
          node.entry,
          `defaultTopicId '${defaultTopicId}' is not an active topic of actor '${actorId}'`,
          'npc-content',
        ),
      ]
    : [];
}

function reservedFindings(
  node: CardEntry,
  actorIds: ReadonlySet<string>,
  enterNodeTargets: ReadonlySet<string>,
): readonly Finding[] {
  const actorId = asText(node.data['actorId']);
  const nodeId = asText(node.data['id']);
  if (
    actorId.length === 0 ||
    !actorIds.has(actorId) ||
    enterNodeTargets.has(nodeId)
  ) {
    return [];
  }
  const authoring = authoringOf(node.data);
  const reason = asText(authoring['note']) || asText(authoring['reason']);
  return authoring['reserved'] !== true || reason.trim().length === 0
    ? [
        finding(
          node.path,
          node.entry,
          `unentered node '${nodeId}' needs authoring.reserved: true with a reason`,
          'npc-content',
        ),
      ]
    : [];
}

function nodeTopicFindings(
  node: CardEntry,
  topicIds: ReadonlySet<string>,
): readonly Finding[] {
  return stringList(node.data['topicIds'])
    .filter((id) => topicIds.size > 0 && !topicIds.has(id))
    .map((id) =>
      finding(
        node.path,
        node.entry,
        `topicId '${id}' has no declared topic`,
        'npc-content',
      ),
    );
}

function readyStateFindings(states: readonly CardEntry[]): readonly Finding[] {
  return states.flatMap((state) =>
    asText(state.data['id']) === 'actorstate-ready' &&
    asObjectArray(state.data['onEnter']).length > 0
      ? [
          finding(
            state.path,
            state.entry,
            'the silent ready state must not author an onEnter greeting',
            'npc-content',
          ),
        ]
      : [],
  );
}

export function checkNpc(
  cards: ParsedCardSet,
  options: ValidationOptions = {},
): readonly Finding[] {
  const actors = collection(cards, 'actors');
  const actorIds = idsOf(actors);
  const topics = collection(cards, 'conversationTopics');
  const nodes = collection(cards, 'conversationNodes');
  const topicIds = new Set(idsOf(topics));
  const vocabulary = topics.flatMap((topic) =>
    stringList(asRecord(topic.data['match'])?.['objectIds']),
  );
  for (const objectId of vocabulary) topicIds.add(`topic-${objectId}`);
  const enterNodeTargets = new Set(
    allEffects(cards)
      .filter((effect) => asText(effect['kind']) === 'enter-node')
      .map((effect) => asText(effect['nodeId'])),
  );
  const nodeFindings = nodes.flatMap((node) => {
    const actorId = asText(node.data['actorId']);
    return [
      ...(actorId.length > 0 && !actorIds.has(actorId)
        ? [
            finding(
              node.path,
              node.entry,
              `actorId '${actorId}' names no declared actor`,
              'npc-content',
            ),
          ]
        : []),
      ...defaultTopicFindings(node, topics, actorId),
      ...reservedFindings(node, actorIds, enterNodeTargets),
      ...nodeTopicFindings(node, topicIds),
    ];
  });
  // Every admitted TopicMatch, Condition, Effect and ResponseStrategy kind is
  // accepted: unused variants are deliberately not findings (§4.3 point 5).
  return [
    ...topicActorFindings(topics, actorIds),
    ...nodeFindings,
    ...readyStateFindings(collection(cards, 'actorStates')),
    // C7 is opt-in so direct validateCards() callers keep the eight-gate
    // contract; content:validate and generation enable it (content-rules.md §7).
    ...(options.topicOverlap === true ? checkTopicOverlap(cards) : []),
  ];
}
