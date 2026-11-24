// Canonical persisted shape from storage-schema.md §3.2.
export interface HazardStateDto {
  readonly lastFiredTurn?: number; // omitted until first fire
  readonly timesFired: number;
}
