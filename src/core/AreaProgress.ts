// Canonical persisted shape from storage-schema.md §3.2.
// ScoreTracker is the sole writer of earnedScore; maxScore is refreshed from
// content at restore (storage-schema.md §7).
export interface AreaProgress {
  readonly worldId: string;
  readonly areaId: string;
  readonly visitedRooms: readonly string[];
  readonly completedTopics: readonly string[];
  readonly earnedScore: number;
  readonly maxScore: number;
}
