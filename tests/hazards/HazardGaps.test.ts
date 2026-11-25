// Red tests for the two engine-side hazard GAP decisions recorded in
// .opencode/scratchpad/skeleton-decisions.md (2026-11-25):
// H-GAP-01 authoring-only telegraph; H-GAP-03 mid-phase state for `when`.
// All systems are injected seams; no production module is edited here.
import { describe, expect, it } from 'vitest';
import { createEffectApplier } from '../../src/core/effects/EffectApplier';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { GameState } from '../../src/core/GameState';
import type { Hazard } from '../../src/core/hazards/Hazard';
import { FakeRandom } from '../fixtures/persistence';
import {
  eventTypes,
  hazard,
  loadConditionEvaluatorFactory,
  loadHazardSystemFactory,
  mechanicsBundle,
  mechanicsState,
  turnContext,
  type ReactionSystemContract,
} from '../fixtures/mechanics';
import {
  loadGameWithPhases,
  makeTurnDependencies,
  phaseFakes,
} from '../fixtures/turn';

const TELEGRAPH_TEXT = 'Heat haze shimmers off a belt of tiny black switches.';

async function hazardsFor(
  definitions: readonly Hazard[],
  state: GameState,
): Promise<ReactionSystemContract> {
  const createEvaluator = await loadConditionEvaluatorFactory();
  const createHazards = await loadHazardSystemFactory();
  return createHazards({
    bundle: mechanicsBundle(definitions),
    evaluator: createEvaluator(),
    random: new FakeRandom([0]),
    applier: createEffectApplier(state, { random: new FakeRandom([0]) }),
  });
}

describe('hazard GAP decisions (skeleton-decisions.md)', () => {
  it('H-GAP-01: a firing hazard emits only hazard-triggered and message, with no authoring-only telegraph', async () => {
    const definition = hazard({
      once: true,
      effects: [{ kind: 'message', text: TELEGRAPH_TEXT }],
    });
    const state = mechanicsState();
    const bundle = mechanicsBundle([definition]);
    const system = await hazardsFor([definition], state);
    const hazardEvents: GameEvent[] = [];
    const calls: string[] = [];
    const game = await loadGameWithPhases(
      makeTurnDependencies(calls, {
        ...phaseFakes(calls),
        initialState: state,
        react: () => {
          // shared-rules.md §2: phase 3 Execute precedes phase 4 React, so the
          // batch also carries the verb handler's message. Isolate the hazard's
          // own contribution (across both allowed reaction passes) before
          // asserting its exact two-event shape.
          const produced = system.react(turnContext(state, { bundle }), []);
          hazardEvents.push(...produced);
          return produced;
        },
      }),
    );

    const batch = game.submit('look');
    const hazardMessages = hazardEvents.filter(
      (event): event is Extract<GameEvent, { type: 'message' }> =>
        event.type === 'message',
    );

    expect(eventTypes(hazardEvents)).toEqual(['hazard-triggered', 'message']);
    expect(hazardMessages.map((event) => event.text)).toEqual([TELEGRAPH_TEXT]);
    expect(
      batch.filter((event) => event.type === 'hazard-triggered'),
    ).toHaveLength(1);
    expect(
      batch.filter(
        (event) => event.type === 'message' && event.text === TELEGRAPH_TEXT,
      ),
    ).toHaveLength(1);
    expect(eventTypes(batch)).not.toContain('hazard-telegraphed');
    expect(JSON.stringify(batch)).not.toContain('telegraph');
  });

  it('H-GAP-03: a later hazard sees a flag set earlier in the same pass, with trigger still using buffered events', async () => {
    const definitions = [
      hazard({
        id: 'hazard-first',
        once: true,
        trigger: { kind: 'on-event', eventType: 'message' },
        effects: [{ kind: 'set-flag', flag: 'second-armed', value: true }],
      }),
      hazard({
        id: 'hazard-second',
        once: true,
        trigger: { kind: 'on-event', eventType: 'message' },
        when: { kind: 'flag-set', flag: 'second-armed' },
        effects: [
          { kind: 'change-lives', delta: -1, reason: 'mid-phase trap' },
        ],
      }),
    ];
    const state = mechanicsState();
    const bundle = mechanicsBundle(definitions);
    const system = await hazardsFor(definitions, state);
    const firstPass = system.react(turnContext(state, { bundle }), [
      { type: 'message', text: 'look around' },
    ]);

    // The chain must settle in one reaction pass: the later hazard's `when`
    // reads the state mutated by the earlier hazard's effect in declaration
    // order, not the outcome of a second pass.
    expect(
      firstPass
        .filter(
          (event): event is Extract<GameEvent, { type: 'hazard-triggered' }> =>
            event.type === 'hazard-triggered',
        )
        .map((event) => event.hazardId),
    ).toEqual(['hazard-first', 'hazard-second']);
    expect(state.flags['second-armed']).toBe(true);
    expect(state.player.lives).toBe(2);

    const reset = mechanicsState();
    const resetSystem = await hazardsFor(definitions, reset);
    let passes = 0;
    const calls: string[] = [];
    const game = await loadGameWithPhases(
      makeTurnDependencies(calls, {
        ...phaseFakes(calls),
        initialState: reset,
        react: () => {
          passes += 1;
          return resetSystem.react(turnContext(reset, { bundle }), [
            { type: 'message', text: 'look around' },
          ]);
        },
      }),
    );

    const batch = game.submit('look');

    expect(
      batch
        .filter(
          (event): event is Extract<GameEvent, { type: 'hazard-triggered' }> =>
            event.type === 'hazard-triggered',
        )
        .map((event) => event.hazardId),
    ).toEqual(['hazard-first', 'hazard-second']);
    expect(reset.flags['second-armed']).toBe(true);
    expect(reset.player.lives).toBe(2);
    expect(passes).toBe(2);
  });
});
