// Canonical signature from application-and-ui.md §8 / shared-rules.md §6.
import type { Effect } from '../effects/Effect';
import type { GameState } from '../GameState';

export interface Scheduler {
  tick(turn: number, state: GameState): readonly Effect[];
}
