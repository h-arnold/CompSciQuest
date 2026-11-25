// Effect-to-event and per-puzzle scoring contracts for trace-pinned producers
// (ITEM-USE-10; shared-rules.md §5, application-and-ui.md §9/§10).
import { describe, expect, it } from 'vitest';
import { createEffectApplier } from '../../src/core/effects/EffectApplier';
import type { GameEvent } from '../../src/core/events/GameEvent';
import { createPuzzleSystem } from '../../src/core/puzzles/PuzzleSystem';
import { createConditionEvaluator } from '../../src/core/rules/ConditionEvaluator';
import { createScoreTracker } from '../../src/core/scoring/ScoreTracker';
import type { TurnContext } from '../../src/core/TurnContext';
import {
  authoredBundle,
  authoredState,
  switchyardProgress,
} from '../fixtures/authored';
import { FakeRandom } from '../fixtures/persistence';

describe('trace-pinned producer events', () => {
  it('ITEM-USE-10: set-flag emits flag-changed, puzzle completion emits ordered achievement events and scoring is idempotent', () => {
    const state = authoredState({
      roomId: 'room-switch-floor',
      heldItems: ['item-switch-gauge'],
      progress: [switchyardProgress()],
    });
    const random = new FakeRandom([0]);
    const dependencies = { random, bundle: authoredBundle };
    const applier = createEffectApplier(state, dependencies);
    const flagEvents = applier.apply({
      kind: 'set-flag',
      flag: 'switches-set',
      value: true,
    });
    expect(flagEvents).toEqual([
      { type: 'flag-changed', flag: 'switches-set', value: true },
    ]);

    const context: TurnContext = {
      turn: 1,
      state,
      bundle: authoredBundle,
      random,
      command: { kind: 'use', itemId: 'item-switch-gauge' },
    };
    const puzzles = createPuzzleSystem({
      bundle: authoredBundle,
      evaluator: createConditionEvaluator(),
      random,
      applier,
    });
    const puzzleEvents = puzzles.react(context, flagEvents);
    expect(puzzleEvents.map((event) => event.type)).toEqual(
      expect.arrayContaining([
        'puzzle-activated',
        'puzzle-solved',
        'topic-completed',
      ]),
    );
    const puzzleTypes = puzzleEvents.map((event) => event.type);
    expect(puzzleTypes.indexOf('puzzle-activated')).toBeLessThan(
      puzzleTypes.indexOf('puzzle-solved'),
    );
    expect(puzzleTypes.indexOf('puzzle-solved')).toBeLessThan(
      puzzleTypes.indexOf('topic-completed'),
    );
    const solved = puzzleEvents.find((event) => event.type === 'puzzle-solved');
    if (solved === undefined) {
      throw new Error('The switch puzzle must emit puzzle-solved.');
    }

    const score = createScoreTracker(state, { bundle: authoredBundle });
    const scored = score.observe([...flagEvents, ...puzzleEvents]);
    expect(scored).toContainEqual({
      type: 'score-changed',
      delta: 1,
      total: 1,
      reason: 'puzzle:puzzle-set-the-switches',
    });
    expect(state.progress[0]?.earnedScore).toBe(1);

    const repeated = score.observe([solved]);
    expect(repeated).not.toContainEqual(
      expect.objectContaining({
        type: 'score-changed',
        reason: 'puzzle:puzzle-set-the-switches',
      }),
    );
    expect(state.progress[0]?.earnedScore).toBe(1);

    const completionOnly: readonly GameEvent[] = [
      { type: 'topic-completed', topicId: 'number-conversion' },
    ];
    expect(score.observe(completionOnly)).toEqual(completionOnly);
    expect(state.progress[0]?.earnedScore).toBe(1);
  });
});
