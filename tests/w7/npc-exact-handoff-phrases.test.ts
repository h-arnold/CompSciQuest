// Regressions for W7R-NPC-01/g (npcs.md §3/§5; W7-HANDOFF.md §103 fix 2).
// The five spoken phrases are the row's own literals; every topic ID, actor ID,
// authored response and producer flag below comes from the generated authored
// bundle. Storage, clock and randomness stay injected through the W7 fixtures.
import { describe, expect, it } from 'vitest';
import type { GameState } from '../../src/core/GameState';
import { authoredBundle } from '../fixtures/authored';
import {
  defaultTopic,
  npcBundle,
  npcDto,
  npcState,
  READY,
  spokenTexts,
  submitNpc,
  topic,
} from '../fixtures/npcs';

interface HandoffCase {
  readonly phrase: string;
  readonly actorId: string;
  readonly actorAlias: string;
  readonly exactTopicId: string;
  readonly decoyTopicId: string;
  readonly incompatibleTopicId: string;
  readonly exactFlag: string;
  readonly authoredQuizId: string;
}

// IDs verified against src/content/authored/conversation-topics.ts and
// src/content/authored/quizzes.ts; no card or course fact is invented here.
const HANDOFFS = [
  {
    phrase: 'shifts',
    actorId: 'npc-nibble-clerk',
    actorAlias: 'clerk',
    exactTopicId: 'topic-clerk-shifts',
    decoyTopicId: 'topic-clerk-shifts-known',
    incompatibleTopicId: 'topic-clerk-carries',
    exactFlag: 'carries-added',
    authoredQuizId: 'quiz-number-systems',
  },
  {
    phrase: 'unicode',
    actorId: 'npc-typesetter',
    actorAlias: 'typesetter',
    exactTopicId: 'topic-setter-unicode',
    decoyTopicId: 'topic-setter-string',
    incompatibleTopicId: 'topic-setter-ascii',
    exactFlag: 'unicode-tile-cut',
    authoredQuizId: 'quiz-character-representation',
  },
  {
    phrase: 'storage',
    actorId: 'npc-mosaic-critic',
    actorAlias: 'critic',
    exactTopicId: 'topic-critic-storage',
    decoyTopicId: 'topic-critic-depth',
    incompatibleTopicId: 'topic-critic-vectors',
    exactFlag: 'critic-depth-heard',
    authoredQuizId: 'quiz-graphics-representation',
  },
  {
    phrase: 'capacity',
    actorId: 'npc-stack-keeper',
    actorAlias: 'keeper',
    exactTopicId: 'topic-keeper-capacity',
    decoyTopicId: 'topic-keeper-units',
    incompatibleTopicId: 'topic-keeper-default',
    exactFlag: 'stacks-sealed',
    authoredQuizId: 'quiz-storage-units',
  },
  {
    phrase: 'ratio',
    actorId: 'npc-press-operator',
    actorAlias: 'operator',
    exactTopicId: 'topic-operator-ratio',
    decoyTopicId: 'topic-operator-lossy',
    incompatibleTopicId: 'topic-operator-default',
    exactFlag: 'archive-packed',
    authoredQuizId: 'quiz-data-compression',
  },
] as const satisfies readonly HandoffCase[];

const DECOY_REPLY = 'A different topic answers.';
const DEFAULT_REPLY = 'The keeper changes the subject.';
const INCOMPATIBLE_REPLY = 'An incompatible topic answers.';
const NEVER_SET_FLAG = 'w7r-g-never-set';

function authoredResponse(topicId: string): string {
  const response =
    authoredBundle.conversationTopics.getById(topicId)?.responses[0];
  expect(response, `${topicId} must have an authored response`).toBeDefined();
  expect(response).not.toBe(DECOY_REPLY);
  expect(response).not.toBe(DEFAULT_REPLY);
  return response ?? '';
}

function authoredQuizId(quizId: string): void {
  expect(
    authoredBundle.quizzes.getById(quizId),
    `${quizId} must be authored`,
  ).toBeDefined();
}

function concreteSnapshot(state: GameState, actorId: string): string {
  return JSON.stringify({
    flags: state.flags,
    knownTopics: state.npcs[actorId]?.knownTopics,
    activeNodeId: state.npcs[actorId]?.activeNodeId,
    topicUses: state.npcs[actorId]?.topicUses,
    inventories: Object.fromEntries(
      Object.entries(state.npcs).map(([id, npc]) => [id, [...npc.inventory]]),
    ),
    playerInventory: [...state.player.inventory],
    score: state.score,
    position: state.player.position,
  });
}

function askState(actorId: string): GameState {
  return npcState({ npcs: { [actorId]: npcDto({ stateId: READY }) } });
}

function decoy(topicId: string, phrase: string) {
  return topic({
    id: topicId,
    match: { kind: 'askTell', objectIds: [phrase] },
    responses: [DECOY_REPLY],
    effects: [{ kind: 'set-flag', flag: `${topicId}-chosen`, value: true }],
  });
}

describe('W7R-NPC-01/g exact handoff preference', () => {
  it.each(HANDOFFS)(
    'W7R-NPC-01/g: the $phrase handoff is preferred among several object matches, even while inactive',
    async ({
      phrase,
      actorId,
      actorAlias,
      exactTopicId,
      decoyTopicId,
      incompatibleTopicId,
      exactFlag,
      authoredQuizId: quizId,
    }) => {
      const authoredReply = authoredResponse(exactTopicId);
      authoredQuizId(quizId);
      const bundle = npcBundle({
        actors: [{ id: actorId, aliases: [actorAlias], initialStateId: READY }],
        topics: [
          decoy(decoyTopicId, phrase),
          topic({
            id: incompatibleTopicId,
            match: { kind: 'tell', objectIds: [phrase] },
            responses: [INCOMPATIBLE_REPLY],
            effects: [
              {
                kind: 'set-flag',
                flag: `${incompatibleTopicId}-chosen`,
                value: true,
              },
            ],
          }),
          topic({
            id: exactTopicId,
            actorId,
            match: { kind: 'askTell', objectIds: [phrase] },
            isActive: { kind: 'flag-set', flag: NEVER_SET_FLAG },
            responses: [authoredReply],
            effects: [
              { kind: 'set-flag', flag: exactFlag, value: true },
              { kind: 'start-quiz', quizId, actorId },
            ],
          }),
          defaultTopic(DEFAULT_REPLY),
        ],
      });
      const state = askState(actorId);
      const before = concreteSnapshot(state, actorId);

      const { events } = await submitNpc(
        { kind: 'ask', actorId, topic: phrase },
        { bundle, state },
      );

      expect(spokenTexts(events)).toEqual([authoredReply]);
      expect(
        events.filter(
          (event) => event.type === 'quiz-started' && event.quizId === quizId,
        ),
      ).toHaveLength(1);
      expect(state.flags[exactFlag]).toBe(true);
      expect(spokenTexts(events)).not.toContain(DECOY_REPLY);
      expect(spokenTexts(events)).not.toContain(INCOMPATIBLE_REPLY);
      expect(state.flags[`${decoyTopicId}-chosen`]).toBeUndefined();
      expect(state.flags[`${incompatibleTopicId}-chosen`]).toBeUndefined();
      expect(concreteSnapshot(state, actorId)).not.toBe(before);
    },
  );
});

describe('W7R-NPC-01/g exact handoff no-fallthrough', () => {
  it.each(HANDOFFS)(
    'W7R-NPC-01/g: $phrase does not fall through to another topic when the exact handoff is command-incompatible',
    async ({
      phrase,
      actorId,
      actorAlias,
      exactTopicId,
      decoyTopicId,
      exactFlag,
      authoredQuizId: quizId,
    }) => {
      const authoredReply = authoredResponse(exactTopicId);
      authoredQuizId(quizId);
      const bundle = npcBundle({
        actors: [{ id: actorId, aliases: [actorAlias], initialStateId: READY }],
        topics: [
          decoy(decoyTopicId, phrase),
          topic({
            id: exactTopicId,
            actorId,
            match: { kind: 'tell', objectIds: [phrase] },
            responses: [authoredReply],
            effects: [
              { kind: 'set-flag', flag: exactFlag, value: true },
              { kind: 'start-quiz', quizId, actorId },
            ],
          }),
          defaultTopic(DEFAULT_REPLY),
        ],
      });
      const state = askState(actorId);
      const before = concreteSnapshot(state, actorId);

      const { events } = await submitNpc(
        { kind: 'ask', actorId, topic: phrase },
        { bundle, state },
      );

      expect(spokenTexts(events)).toEqual([DEFAULT_REPLY]);
      expect(spokenTexts(events)).not.toContain(authoredReply);
      expect(spokenTexts(events)).not.toContain(DECOY_REPLY);
      expect(
        events.filter(
          (event) => event.type === 'quiz-started' && event.quizId === quizId,
        ),
      ).toEqual([]);
      expect(state.flags[`${decoyTopicId}-chosen`]).toBeUndefined();
      expect(state.flags[exactFlag]).toBeUndefined();
      expect(concreteSnapshot(state, actorId)).toBe(before);
    },
  );
});
