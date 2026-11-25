// Canonical port from architecture.md §7, restated in application-and-ui.md §6.
import type { GameEvent } from './GameEvent';

export interface EventBus {
  publish(events: readonly GameEvent[]): void;
  subscribe(listener: (event: GameEvent) => void): () => void;
}

// Canonical in-memory channel (application-and-ui.md §6): publish takes a whole
// batch and subscribe returns an unsubscribe function.
export function createEventBus(): EventBus {
  const listeners = new Set<(event: GameEvent) => void>();
  return {
    publish(events) {
      for (const event of events) {
        for (const listener of listeners) listener(event);
      }
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
