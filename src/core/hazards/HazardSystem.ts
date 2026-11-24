// Phase-4 seam from application-and-ui.md §8 / shared-rules.md §2.
import type { GameState } from '../GameState';
import type { Effect } from '../effects/Effect';
import type { GameEvent } from '../events/GameEvent';

export interface HazardSystem {
  react(state: GameState, events: readonly GameEvent[]): readonly Effect[];
}
