// Canonical persisted shape from storage-schema.md §3.1; sub-DTOs from §3.2.
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
