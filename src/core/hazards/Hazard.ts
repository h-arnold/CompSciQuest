// Canonical declarative definition from hazards.md §2.
import type { Effect } from '../effects/Effect';
import type { Condition } from '../rules/Condition';
import type { Trigger } from '../rules/Trigger';
import type { ScheduledEvent } from '../scheduling/ScheduledEvent';

export interface Hazard {
  readonly id: string;
  readonly trigger: Trigger;
  readonly when: Condition;
  readonly effects: readonly Effect[];
  readonly once?: boolean; // omit for repeatable hazards
  readonly cooldownTurns?: number; // omit when no cooldown
  readonly schedule?: ScheduledEvent;
}
