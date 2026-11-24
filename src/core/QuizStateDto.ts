// Canonical persisted shape from storage-schema.md §3.2.
export interface QuizStateDto {
  readonly activeQuizId?: string; // omitted when no quiz is active
  readonly questionIds: readonly string[]; // shuffled order, fixed for this attempt
  readonly index: number;
  readonly correctCount: number;
  readonly answers: readonly number[]; // choices in this attempt (0-based)
}
