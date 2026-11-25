// STUB — replace with authored content
// Transitional seam: the deterministic placeholder data now lives behind the
// authored-module assembly in ../index.ts. C3 removes this fixture entirely.
import type { GameStateDto } from '../../core/GameState';
import type { ContentBundle } from '../ContentBundle';
import { loadContent } from '../index';

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

export const stubBundle: ContentBundle = loadContent();
