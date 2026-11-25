// Canonical signature from application-and-ui.md §8 / shared-rules.md §6.
import type { EffectApplier } from '../effects/EffectApplier';
import type { GameEvent } from '../events/GameEvent';
import type { ScheduledEvent } from './ScheduledEvent';
import type { TurnContext } from '../TurnContext';

export interface Scheduler {
  tick(context: TurnContext): readonly GameEvent[];
}

export interface SchedulerDependencies {
  readonly applier: EffectApplier;
}

function setCountdown(entry: ScheduledEvent, turns: number): void {
  (entry as { remainingTurns: number }).remainingTurns = turns;
}

export function createScheduler(
  dependencies: SchedulerDependencies,
): Scheduler {
  const { applier } = dependencies;
  return {
    tick(context): readonly GameEvent[] {
      const events: GameEvent[] = [];
      const remaining: ScheduledEvent[] = [];
      // Array order in the save is the documented fire order (shared-rules.md §6).
      for (const entry of context.state.schedule) {
        const initial = entry.remainingTurns;
        const next = initial - 1;
        setCountdown(entry, next);
        if (next > 0) {
          remaining.push(entry);
          continue;
        }
        for (const event of applier.apply(entry.effect)) events.push(event);
        if (entry.kind === 'fuse') continue;
        // A daemon resets to its repeat interval, not its initial countdown.
        setCountdown(entry, entry.repeatEveryTurns ?? initial);
        remaining.push(entry);
      }
      (context.state.schedule as ScheduledEvent[]).splice(
        0,
        context.state.schedule.length,
        ...remaining,
      );
      return events;
    },
  };
}
