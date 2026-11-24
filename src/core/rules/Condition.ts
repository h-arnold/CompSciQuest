// Canonical condition union from shared-rules.md §3.
export type Condition =
  | { readonly kind: 'flag-set'; readonly flag: string }
  | { readonly kind: 'has-item'; readonly itemId: string }
  | { readonly kind: 'visited-room'; readonly roomId: string }
  | { readonly kind: 'topic-complete'; readonly topicId: string }
  | {
      readonly kind: 'npc-knows';
      readonly actorId: string;
      readonly topicId: string;
    }
  | {
      readonly kind: 'actor-state';
      readonly actorId: string;
      readonly stateId: string;
    }
  | {
      readonly kind: 'in-node';
      readonly actorId: string;
      readonly nodeId: string;
    }
  | { readonly kind: 'puzzle-solved'; readonly puzzleId: string }
  | { readonly kind: 'quiz-passed'; readonly quizId: string }
  | {
      readonly kind: 'counter-at-least';
      readonly key: string;
      readonly value: number;
    }
  | { readonly kind: 'all' | 'any'; readonly of: readonly Condition[] }
  | { readonly kind: 'not'; readonly of: Condition };
