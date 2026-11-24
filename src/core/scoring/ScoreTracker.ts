// Canonical signature from application-and-ui.md §8.
// ScoreTracker is the sole writer of AreaProgress.earnedScore.
import type { GameEvent } from '../events/GameEvent';

export interface ScoreTracker {
  observe(events: readonly GameEvent[]): readonly GameEvent[];
  getTotal(): number;
}
