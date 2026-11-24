// Canonical persisted shape from storage-schema.md §3.2.
export interface HintStateDto {
  readonly levelsShown: readonly number[];
  readonly lastShownTurn?: number; // omitted until first hint
}
