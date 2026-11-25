// Canonical signature from application-and-ui.md §8.
// ScoreTracker is the sole writer of AreaProgress.earnedScore.
import type { GameState } from '../GameState';
import type { GameEvent } from '../events/GameEvent';

export interface ScoreTracker {
  observe(events: readonly GameEvent[]): readonly GameEvent[];
  getTotal(): number;
}

// Default tracker for a façade built without an injected observer. The total is
// the documented derivation from AreaProgress.earnedScore; awarding mechanics
// belong to the scoring subsystem and are not invented here.
export function createScoreTracker(state: GameState): ScoreTracker {
  return {
    observe(events) {
      return events;
    },
    getTotal() {
      return state.progress.reduce(
        (total, entry) => total + entry.earnedScore,
        0,
      );
    },
  };
}
