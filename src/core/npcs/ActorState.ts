// Canonical declarative state from npcs.md §2 (data, not behaviour).
import type { Effect } from '../effects/Effect';

export interface ActorState {
  readonly id: string; // e.g. 'idle', 'ready', 'talking', 'hostile'
  readonly stateDesc: string; // current-state actor examine text (emitted verbatim)
  readonly specialDesc: string; // shown in the room listing
  readonly onEnter?: readonly Effect[];
  readonly onExit?: readonly Effect[];
}
