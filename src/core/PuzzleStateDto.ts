// Canonical persisted shapes from storage-schema.md §3.2.
export type PuzzlePhase = 'unsolved' | 'active' | 'solved';

export interface PuzzleStateDto {
  readonly phase: PuzzlePhase;
}
