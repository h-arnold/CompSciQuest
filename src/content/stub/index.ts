// STUB — replace with authored content
// One world, one area and two rooms; every later mechanic catalogue is empty.
// This is deterministic data only — the engine never hard-codes these IDs.
import type { Catalogue } from '../Catalogue';
import type { ContentBundle } from '../ContentBundle';
import type { GameStateDto } from '../../core/GameState';
import type { SpecTopic } from '../../core/scoring/SpecTopic';
import type { SpecTopicCatalogue } from '../../core/scoring/SpecTopicCatalogue';
import { actors } from '../authored/actors';
import { actorStates } from '../authored/actor-states';
import { conversationTopics } from '../authored/conversation-topics';
import { hazards } from '../authored/hazards';
import { hints } from '../authored/hints';
import { items as authoredItems } from '../authored/items';
import { nodes } from '../authored/nodes';
import { puzzles } from '../authored/puzzles';
import { questions } from '../authored/questions';
import { quizzes } from '../authored/quizzes';
import { specTopics as authoredSpecTopics } from '../authored/spec-topics';
import { stubAreas } from './areas';
import { stubRooms } from './rooms';
import { stubWorlds } from './worlds';

function catalogueFor<T extends { readonly id: string }>(
  all: readonly T[],
): Catalogue<T> {
  return {
    all,
    getById(id: string): T | undefined {
      return all.find((entry) => entry.id === id);
    },
  };
}

// The stub has no authored spec topics, so its area index is empty until real
// content supplies topics with a world/area mapping.
const specTopics: SpecTopicCatalogue = {
  getById(id: string): SpecTopic | undefined {
    return authoredSpecTopics.find((topic) => topic.id === id);
  },
  getByRoomId(roomId: string): readonly SpecTopic[] {
    return authoredSpecTopics.filter((topic) => topic.roomIds.includes(roomId));
  },
  // Canonical signature from application-and-ui.md §8. The stub has no spec
  // topics yet, so there is no index to consult; consume the pinned arguments
  // without inventing lookup behaviour.
  getByAreaId(worldId: string, areaId: string): readonly SpecTopic[] {
    Object.keys({ worldId, areaId });
    return [];
  },
};

// STUB fixture state used only when a façade is built without an explicit
// initial state (persistence seam). It mirrors the deterministic stub DTO so
// exported text is reproducible; live New Game uses createInitial() instead.
export const stubInitialState: GameStateDto = {
  player: {
    position: {
      worldId: 'world-stub',
      areaId: 'area-stub',
      roomId: 'room-stub-start',
    },
    inventory: ['lamp'],
    lives: 3,
  },
  rooms: {
    'room-stub-start': { inventory: [] },
    'room-stub-north': { inventory: [] },
  },
  npcs: {},
  hazards: {},
  puzzles: {},
  hints: {},
  quiz: { questionIds: [], index: 0, correctCount: 0, answers: [] },
  quizAttempts: { 'quiz-1': 1 },
  flags: {},
  progress: [
    {
      worldId: 'world-stub',
      areaId: 'area-stub',
      visitedRooms: ['room-stub-start'],
      completedTopics: ['topic-1'],
      earnedScore: 3,
      maxScore: 10,
    },
  ],
  turn: 4,
  status: 'playing',
  schedule: [],
  rngSeed: 3_735_928_559,
  counters: { 'hints-shown:h1': 1 },
};

export const stubBundle: ContentBundle = {
  worlds: catalogueFor(stubWorlds),
  areas: catalogueFor(stubAreas),
  rooms: catalogueFor(stubRooms),
  items: catalogueFor(authoredItems),
  actors: catalogueFor(actors),
  actorStates: catalogueFor(actorStates),
  conversationTopics: catalogueFor(conversationTopics),
  nodes: catalogueFor(nodes),
  quizzes: catalogueFor(quizzes),
  questions: catalogueFor(questions),
  puzzles: catalogueFor(puzzles),
  hazards: catalogueFor(hazards),
  hints: catalogueFor(hints),
  specTopics,
};
