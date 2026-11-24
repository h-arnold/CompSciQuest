// Single canonical event union from application-and-ui.md §6.
import type { Direction } from '../../types/domain';

export interface RoomSummary {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly exits: readonly Direction[];
}

export type GameEvent =
  // baseline
  | { readonly type: 'message'; readonly text: string }
  | { readonly type: 'room-entered'; readonly room: RoomSummary }
  | {
      readonly type: 'score-changed';
      readonly delta: number;
      readonly total: number;
      readonly reason: string;
    }
  | { readonly type: 'topic-completed'; readonly topicId: string }
  | { readonly type: 'lives-changed'; readonly lives: number }
  | {
      readonly type: 'game-over';
      readonly reason: string;
      readonly finalScore: number;
    }
  | { readonly type: 'game-won'; readonly finalScore: number }
  // NPCs
  | { readonly type: 'conversation-started'; readonly actorId: string }
  | {
      readonly type: 'npc-spoke';
      readonly actorId: string;
      readonly text: string;
    }
  | {
      readonly type: 'conversation-ended';
      readonly actorId: string;
      readonly reason: string;
    }
  | {
      readonly type: 'topic-suggested';
      readonly actorId: string;
      readonly text: string;
    }
  // hazards and puzzles
  | {
      readonly type: 'hazard-triggered';
      readonly hazardId: string;
      readonly reason: string;
    }
  | { readonly type: 'puzzle-activated'; readonly puzzleId: string }
  | {
      readonly type: 'puzzle-solved';
      readonly puzzleId: string;
      readonly topicId?: string;
    }
  // quiz combat
  | {
      readonly type: 'quiz-started';
      readonly quizId: string;
      readonly actorId: string;
    }
  | {
      readonly type: 'question-asked';
      readonly quizId: string;
      readonly questionId: string;
      readonly prompt: string;
      readonly options: readonly string[];
    }
  | {
      readonly type: 'answer-evaluated';
      readonly quizId: string;
      readonly questionId: string;
      readonly correct: boolean;
      readonly explanation: string;
    }
  | {
      readonly type: 'quiz-ended';
      readonly quizId: string;
      readonly passed: boolean;
      readonly reason: string;
    }
  // hints
  | {
      readonly type: 'hint-shown';
      readonly hintId: string;
      readonly level: number;
      readonly text: string;
    }
  | {
      readonly type: 'hint-penalty-applied';
      readonly hintId: string;
      readonly delta: number;
    }
  // bookkeeping
  | {
      readonly type: 'flag-changed';
      readonly flag: string;
      readonly value: boolean;
    }
  | {
      readonly type: 'item-moved';
      readonly itemId: string;
      readonly fromOwnerId: string;
      readonly toOwnerId: string;
    }
  | {
      readonly type: 'actor-state-changed';
      readonly actorId: string;
      readonly stateId: string;
    }
  | {
      readonly type: 'knowledge-gained';
      readonly actorId: string;
      readonly topicId: string;
    }
  | {
      readonly type: 'node-entered';
      readonly actorId: string;
      readonly nodeId: string;
    }
  | { readonly type: 'node-exited'; readonly actorId: string }
  | {
      readonly type: 'scheduled';
      readonly eventId: string;
      readonly kind: 'fuse' | 'daemon';
      readonly remainingTurns: number;
    };

// The canonical EventBus lives in EventBus.ts; re-exported for the §6 import path.
export type { EventBus } from './EventBus';
