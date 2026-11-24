// Canonical port from architecture.md §7, restated in application-and-ui.md §6.
import type { GameEvent } from './GameEvent';

export interface EventBus {
  publish(events: readonly GameEvent[]): void;
  subscribe(listener: (event: GameEvent) => void): () => void;
}
