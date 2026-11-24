// Canonical serialisable schedule shape from shared-rules.md §6.
import type { Effect } from '../effects/Effect';

export interface ScheduledEvent {
  readonly id: string;
  readonly kind: 'fuse' | 'daemon';
  readonly remainingTurns: number;
  readonly repeatEveryTurns?: number; // omitted when equal to remainingTurns
  readonly effect: Effect;
}
