// Canonical declarative definition from combat.md §2.
export interface QuizQuestion {
  readonly id: string;
  readonly prompt: string;
  readonly options: readonly string[]; // shown numbered 1..n
  readonly correctOptionIds: readonly number[]; // 0-based indices into options
  readonly explanation: string; // shown after every answer
}
