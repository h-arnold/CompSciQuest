// Canonical effect union from shared-rules.md §5.
import type { ScheduledEvent } from '../scheduling/ScheduledEvent';

export type Effect =
  | {
      readonly kind: 'set-flag';
      readonly flag: string;
      readonly value: boolean;
    }
  | { readonly kind: 'message'; readonly text: string }
  | {
      readonly kind: 'change-lives';
      readonly delta: number;
      readonly reason: string;
    }
  | { readonly kind: 'complete-topic'; readonly topicId: string }
  | { readonly kind: 'grant-item' | 'remove-item'; readonly itemId: string }
  | {
      readonly kind: 'transfer-item';
      readonly itemId: string;
      readonly fromOwnerId: string;
      readonly toOwnerId: string;
    }
  | {
      readonly kind: 'move-player';
      readonly roomId: string;
      readonly reason: string;
    }
  | {
      readonly kind: 'set-actor-state';
      readonly actorId: string;
      readonly stateId: string;
    }
  | {
      readonly kind: 'learn-topic';
      readonly actorId: string;
      readonly topicId: string;
    }
  | {
      readonly kind: 'enter-node';
      readonly actorId: string;
      readonly nodeId: string;
    }
  | { readonly kind: 'exit-node'; readonly actorId: string }
  | { readonly kind: 'set-puzzle-active'; readonly puzzleId: string }
  | { readonly kind: 'set-puzzle-solved'; readonly puzzleId: string }
  | { readonly kind: 'schedule'; readonly event: ScheduledEvent }
  | {
      readonly kind: 'start-quiz';
      readonly quizId: string;
      readonly actorId: string;
    }
  | {
      readonly kind: 'show-hint';
      readonly hintId: string;
      readonly level: number;
      readonly text: string;
    }
  // Quiz progress is carried by effects so phase 3 stays effects-only while
  // EffectApplier remains the sole mutator of QuizStateDto (shared-rules.md §5).
  | {
      readonly kind: 'ask-question';
      readonly quizId: string;
      readonly questionId: string;
      readonly prompt: string;
      readonly options: readonly string[];
    }
  | {
      readonly kind: 'evaluate-answer';
      readonly quizId: string;
      readonly questionId: string;
      readonly option: number; // 0-based index into the question's options
      readonly correct: boolean;
      readonly explanation: string;
    }
  | {
      readonly kind: 'end-quiz';
      readonly quizId: string;
      readonly passed: boolean;
      readonly reason: string;
    }
  // Hazard announcement is the sole carrier of `hazard-triggered` through the
  // sole mutator (shared-rules.md §5, application-and-ui.md §9). Score is never
  // carried by an effect: ScoreTracker awards it from achievement events.
  | {
      readonly kind: 'announce-hazard';
      readonly hazardId: string;
      readonly reason: string;
    };
