// Red tests for the TADS fuse/daemon scheduler (shared-rules.md §6, §2, §12;
// hazards.md §2). The clock and randomness are injected fakes; no real time.
import { describe, expect, it } from 'vitest';
import { createEffectApplier } from '../../src/core/effects/EffectApplier';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { GameState } from '../../src/core/GameState';
import { FakeRandom } from '../fixtures/persistence';
import {
  loadComposedReactionFactory,
  loadSchedulerFactory,
  mechanicsState,
  recordingComposedReactionDependencies,
  scheduled,
  turnContext,
} from '../fixtures/mechanics';

// The injected applier is a named collaborator; the scheduler owns no state of
// its own beyond the schedule carried by the turn context.
function applierFor(state: GameState) {
  return createEffectApplier(state, { random: new FakeRandom([0]) });
}

describe('scheduler (shared-rules.md §6)', () => {
  it('H-SCHED-02: a fuse at one turn counts down, fires at zero and is removed', async () => {
    const createScheduler = await loadSchedulerFactory();
    const state = mechanicsState({
      schedule: [
        scheduled({
          id: 'fuse-one',
          kind: 'fuse',
          remainingTurns: 1,
          effect: { kind: 'message', text: 'The fuse burned out.' },
        }),
      ],
    });
    const scheduler = createScheduler({ applier: applierFor(state) });

    const events = scheduler.tick(turnContext(state), state);

    expect(
      events.some(
        (event) =>
          event.type === 'message' && event.text === 'The fuse burned out.',
      ),
    ).toBe(true);
    expect(state.schedule).toEqual([]);
  });

  it('H-SCHED-03: a daemon resets to repeatEveryTurns, not its initial countdown', async () => {
    const createScheduler = await loadSchedulerFactory();
    const state = mechanicsState({
      schedule: [
        scheduled({
          id: 'daemon-three',
          kind: 'daemon',
          remainingTurns: 1,
          repeatEveryTurns: 3,
          effect: { kind: 'message', text: 'The daemon woke.' },
        }),
      ],
    });
    const scheduler = createScheduler({ applier: applierFor(state) });

    const events = scheduler.tick(turnContext(state), state);

    expect(
      events.some(
        (event) =>
          event.type === 'message' && event.text === 'The daemon woke.',
      ),
    ).toBe(true);
    expect(state.schedule[0]?.remainingTurns).toBe(3);
  });

  it('H-SCHED-04: scheduled events fire in save-array order and the scheduler runs first in phase 4', async () => {
    const createScheduler = await loadSchedulerFactory();
    const createComposedReaction = await loadComposedReactionFactory();
    const state = mechanicsState({
      schedule: [
        scheduled({
          id: 'first',
          effect: { kind: 'message', text: 'first tick' },
        }),
        scheduled({
          id: 'second',
          effect: { kind: 'message', text: 'second tick' },
        }),
      ],
    });
    const scheduler = createScheduler({ applier: applierFor(state) });
    const trace: string[] = [];
    const systems = recordingComposedReactionDependencies(trace, scheduler);
    const react = createComposedReaction(systems);

    const events = react(turnContext(state), []);

    expect(trace[0]).toBe('scheduler');
    expect(
      events
        .filter(
          (event): event is Extract<GameEvent, { type: 'message' }> =>
            event.type === 'message',
        )
        .map((event) => event.text),
    ).toEqual(['first tick', 'second tick']);
  });
});
