// Canonical signature from application-and-ui.md §8.
import type { GameEvent } from '../events/GameEvent';

export interface Session {
  observe(events: readonly GameEvent[]): readonly GameEvent[];
  newGame(): void;
}
