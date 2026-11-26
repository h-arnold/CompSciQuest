// Canonical persisted shape from storage-schema.md §3.2.
// ScoreTracker is the sole writer of earnedScore; maxScore is refreshed from
// content at restore (storage-schema.md §7).
import type { ContentBundle } from '../content/ContentBundle';
import type { GameState } from './GameState';

export interface AreaProgress {
  readonly worldId: string;
  readonly areaId: string;
  readonly visitedRooms: readonly string[];
  readonly completedTopics: readonly string[];
  readonly earnedScore: number;
  readonly maxScore: number;
}

interface MutableAreaProgress {
  worldId: string;
  areaId: string;
  visitedRooms: string[];
  completedTopics: string[];
  earnedScore: number;
  maxScore: number;
}

// Content-derived owners for a room or a spec topic. The `(worldId, areaId)`
// pair is the key used by every progress row (storage-schema.md §3.3).
export function areaPairForRoom(
  bundle: ContentBundle | undefined,
  roomId: string,
): { readonly worldId: string; readonly areaId: string } | undefined {
  const area = bundle?.areas.all.find((entry) =>
    entry.roomIds.includes(roomId),
  );
  return area === undefined
    ? undefined
    : { worldId: area.worldId, areaId: area.id };
}

export function areaPairForTopic(
  bundle: ContentBundle | undefined,
  topicId: string | undefined,
): { readonly worldId: string; readonly areaId: string } | undefined {
  if (topicId === undefined || bundle === undefined) return undefined;
  const area = bundle.areas.all.find((entry) =>
    bundle.specTopics
      .getByAreaId(entry.worldId, entry.id)
      .some((topic) => topic.id === topicId),
  );
  return area === undefined
    ? undefined
    : { worldId: area.worldId, areaId: area.id };
}

function maxScoreOf(
  bundle: ContentBundle | undefined,
  worldId: string,
  areaId: string,
): number {
  return (
    bundle?.specTopics
      .getByAreaId(worldId, areaId)
      .reduce((total, topic) => total + topic.maxScore, 0) ?? 0
  );
}

// The single row-creation owner shared by ScoreTracker and EffectApplier. A
// `(worldId, areaId)` pair identifies a row; no unrelated row is touched and
// earnedScore is created at zero so only ScoreTracker can increase it.
export function ensureProgressRow(
  state: GameState,
  bundle: ContentBundle | undefined,
  worldId: string,
  areaId: string,
): MutableAreaProgress {
  const rows = state.progress as MutableAreaProgress[];
  const existing = rows.find(
    (row) => row.worldId === worldId && row.areaId === areaId,
  );
  if (existing !== undefined) return existing;
  const row: MutableAreaProgress = {
    worldId,
    areaId,
    visitedRooms: [],
    completedTopics: [],
    earnedScore: 0,
    maxScore: maxScoreOf(bundle, worldId, areaId),
  };
  rows.push(row);
  return row;
}
