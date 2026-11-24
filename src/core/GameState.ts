// Canonical persisted shape from storage-schema.md §3.1; sub-DTOs from §3.2.
import { stubBundle } from '../content/stub/index';
import type { Position } from '../types/domain';
import type { AreaProgress } from './AreaProgress';
import type { HazardStateDto } from './HazardStateDto';
import type { HintStateDto } from './HintStateDto';
import type { NpcStateDto } from './NpcStateDto';
import type { PuzzleStateDto } from './PuzzleStateDto';
import type { QuizStateDto } from './QuizStateDto';
import type { RoomStateDto } from './RoomStateDto';
import type { SessionStatus } from './SessionStatus';
import type { ScheduledEvent } from './scheduling/ScheduledEvent';

export interface GameStateDto {
  readonly player: {
    readonly position: Position;
    readonly inventory: readonly string[];
    readonly lives: number;
  };
  readonly rooms: Readonly<Record<string, RoomStateDto>>;
  readonly npcs: Readonly<Record<string, NpcStateDto>>;
  readonly hazards: Readonly<Record<string, HazardStateDto>>;
  readonly puzzles: Readonly<Record<string, PuzzleStateDto>>;
  readonly hints: Readonly<Record<string, HintStateDto>>;
  readonly quiz: QuizStateDto;
  readonly quizAttempts: Readonly<Record<string, number>>;
  readonly flags: Readonly<Record<string, boolean>>;
  readonly progress: readonly AreaProgress[];
  readonly turn: number;
  readonly status: SessionStatus;
  readonly schedule: readonly ScheduledEvent[];
  readonly rngSeed: number; // unsigned 32-bit PRNG state
  readonly counters: Readonly<Record<string, number>>;
}
// `score` is deliberately absent: it is derived from progress[].earnedScore
// at restore (storage-schema.md §3.1, §7).

// Runtime view of state: same data plus the derived score. createInitial()
// starts at turn 0 (skeleton-decisions.md, S-GAP-01).
export type GameState = GameStateDto & { readonly score: number };

export type { AreaProgress } from './AreaProgress';
export type { HazardStateDto } from './HazardStateDto';
export type { HintStateDto } from './HintStateDto';
export type { NpcStateDto } from './NpcStateDto';
export type { PuzzlePhase, PuzzleStateDto } from './PuzzleStateDto';
export type { QuizStateDto } from './QuizStateDto';
export type { RoomStateDto } from './RoomStateDto';
export type { SessionStatus } from './SessionStatus';

// Runtime counterpart of the DTO. The toDto() method returns the state shape
// only, so a derived score can never leak into a persisted envelope
// (storage-schema.md §3.1, architecture.md §7).
export interface RuntimeGameState extends GameState {
  toDto(): GameStateDto;
}

function stateToDto(state: GameStateDto): GameStateDto {
  return {
    player: state.player,
    rooms: state.rooms,
    npcs: state.npcs,
    hazards: state.hazards,
    puzzles: state.puzzles,
    hints: state.hints,
    quiz: state.quiz,
    quizAttempts: state.quizAttempts,
    flags: state.flags,
    progress: state.progress,
    turn: state.turn,
    status: state.status,
    schedule: state.schedule,
    rngSeed: state.rngSeed,
    counters: state.counters,
  };
}

// Restore factory: derives the runtime total and refreshes no content-derived
// values here — SaveManager owns the content lookup (storage-schema.md §7).
export function createFromDto(dto: GameStateDto): RuntimeGameState {
  const state = stateToDto(dto);
  const score = state.progress.reduce(
    (total, entry) => total + entry.earnedScore,
    0,
  );
  const runtime: RuntimeGameState = {
    ...state,
    score,
    toDto(): GameStateDto {
      return stateToDto(runtime);
    },
  };
  return runtime;
}

// The stub fixture is the only start data available to a no-argument factory;
// the engine reads its IDs from the marked fixture rather than hard-coding them.
// The first command advances turn 0 to 1 (skeleton-decisions.md S-GAP-01).
export function createInitial(): RuntimeGameState {
  const world = stubBundle.worlds.all[0];
  const area = stubBundle.areas.all[0];
  const room = stubBundle.rooms.all[0];
  if (!world || !area || !room) {
    throw new Error('Stub content must declare a world, an area and a room.');
  }
  const topics = stubBundle.specTopics.getByAreaId(world.id, area.id);
  return createFromDto({
    player: {
      position: { worldId: world.id, areaId: area.id, roomId: room.id },
      inventory: [],
      lives: world.lives,
    },
    rooms: Object.fromEntries(
      stubBundle.rooms.all.map((entry) => [entry.id, { inventory: [] }]),
    ),
    npcs: {},
    hazards: {},
    puzzles: {},
    hints: {},
    quiz: { questionIds: [], index: 0, correctCount: 0, answers: [] },
    quizAttempts: {},
    flags: {},
    progress: [
      {
        worldId: world.id,
        areaId: area.id,
        visitedRooms: [room.id],
        completedTopics: [],
        earnedScore: 0,
        maxScore: topics.reduce((total, topic) => total + topic.maxScore, 0),
      },
    ],
    turn: 0,
    status: 'playing',
    schedule: [],
    rngSeed: 0,
    counters: {},
  });
}
