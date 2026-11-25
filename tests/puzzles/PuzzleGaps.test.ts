// Red test for Z-GAP-02 (skeleton-decisions.md, 2026-11-25): a puzzle that is
// unsolved with all requirements already true emits both events in one batch,
// with the phase settled to `solved` before `puzzle-solved` is emitted.
import { describe, expect, it } from 'vitest';
import { createEffectApplier } from '../../src/core/effects/EffectApplier';
import { FakeRandom } from '../fixtures/persistence';
import {
  DOOR_FLAG,
  eventTypes,
  loadConditionEvaluatorFactory,
  loadPuzzleSystemFactory,
  mechanicsBundle,
  mechanicsState,
  PUZZLE_ID,
  puzzle,
  turnContext,
} from '../fixtures/mechanics';
import {
  loadGameWithPhases,
  makeTurnDependencies,
  phaseFakes,
} from '../fixtures/turn';

describe('puzzle GAP decision (skeleton-decisions.md)', () => {
  it('Z-GAP-02: activation and completion are both emitted in the first batch, in order', async () => {
    const state = mechanicsState({
      flags: { [DOOR_FLAG]: true },
      puzzles: { [PUZZLE_ID]: { phase: 'unsolved' } },
    });
    const createEvaluator = await loadConditionEvaluatorFactory();
    const createPuzzles = await loadPuzzleSystemFactory();
    const bundle = mechanicsBundle([], [puzzle()]);
    const system = createPuzzles({
      bundle,
      evaluator: createEvaluator(),
      random: new FakeRandom([0]),
      applier: createEffectApplier(state, { random: new FakeRandom([0]) }),
    });
    let phaseAtSolve: string | undefined;
    const calls: string[] = [];
    const game = await loadGameWithPhases(
      makeTurnDependencies(calls, {
        ...phaseFakes(calls),
        initialState: state,
        react: () => {
          const events = system.react(turnContext(state, { bundle }), []);
          if (events.some((event) => event.type === 'puzzle-solved')) {
            phaseAtSolve = state.puzzles[PUZZLE_ID]?.phase;
          }
          return events;
        },
      }),
    );

    const batch = game.submit('look');
    const types = eventTypes(batch);

    expect(types).toContain('puzzle-activated');
    expect(types.indexOf('puzzle-solved')).toBe(
      types.indexOf('puzzle-activated') + 1,
    );
    expect(phaseAtSolve).toBe('solved');
    expect(state.puzzles[PUZZLE_ID]?.phase).toBe('solved');
  });
});
