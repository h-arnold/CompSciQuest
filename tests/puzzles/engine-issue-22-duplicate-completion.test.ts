// ENG22-SUCCESSIDS-01 (scope extension) — one solve must show the completion
// outcome once. The authored puzzle already lists `complete-topic` in onSolve;
// a derived completion must not add a second `topic-completed` event.
//
// Authority: ENGINE_ISSUES.md issue #22 (line 84) and Batch E2 (line 50);
// PLAYTEST_ISSUES.md §22 (lines 227-241); docs/developer/application-and-ui.md
// §6.1 (completion line), §9 (set-puzzle-solved and complete-topic effects) and
// §10 (scoring unaffected). The harness is the injected-fake harness used by
// Z-COMP-01 in tests/puzzles/PuzzleSystem.test.ts. No clock, storage, random
// source, network, file system or DOM is used.
import { describe, expect, it } from 'vitest';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { Effect } from '../../src/core/effects/Effect';
import { createEffectApplier } from '../../src/core/effects/EffectApplier';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { GameState } from '../../src/core/GameState';
import type { Puzzle } from '../../src/core/puzzles/Puzzle';
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
  TOPIC_ID,
  turnContext,
  type ReactionSystemContract,
} from '../fixtures/mechanics';
import {
  loadGameWithPhases,
  makeTurnDependencies,
  phaseFakes,
} from '../fixtures/turn';

const OTHER_TOPIC_ID = 'topic-other';

type CompletionEvent = Extract<GameEvent, { type: 'topic-completed' }>;
type SolvedEvent = Extract<GameEvent, { type: 'puzzle-solved' }>;

function freshState(): GameState {
  return mechanicsState({
    flags: { [DOOR_FLAG]: true },
    puzzles: { [PUZZLE_ID]: { phase: 'unsolved' } },
  });
}

async function systemFor(
  state: GameState,
  bundle: ContentBundle,
): Promise<ReactionSystemContract> {
  const createEvaluator = await loadConditionEvaluatorFactory();
  const createPuzzles = await loadPuzzleSystemFactory();
  return createPuzzles({
    bundle,
    evaluator: createEvaluator(),
    random: new FakeRandom([0]),
    applier: createEffectApplier(state, { random: new FakeRandom([0]) }),
  });
}

function applyAll(state: GameState, effects: readonly Effect[]): GameEvent[] {
  const applier = createEffectApplier(state, { random: new FakeRandom([0]) });
  return effects.flatMap((effect) => [...applier.apply(effect)]);
}

async function solveBatch(definition: Puzzle): Promise<readonly GameEvent[]> {
  const state = freshState();
  const bundle = mechanicsBundle([], [definition]);
  const system = await systemFor(state, bundle);
  const calls: string[] = [];
  const game = await loadGameWithPhases(
    makeTurnDependencies(calls, {
      ...phaseFakes(calls),
      initialState: state,
      apply: (effect: Effect): readonly GameEvent[] =>
        applyAll(state, [effect]),
      react: () => system.react(turnContext(state, { bundle }), []),
    }),
  );
  return game.submit('look');
}

function completionsFor(
  batch: readonly GameEvent[],
  topicId: string,
): readonly CompletionEvent[] {
  return batch.filter(
    (event): event is CompletionEvent =>
      event.type === 'topic-completed' && event.topicId === topicId,
  );
}

function solvesFor(batch: readonly GameEvent[]): readonly SolvedEvent[] {
  return batch.filter(
    (event): event is SolvedEvent => event.type === 'puzzle-solved',
  );
}

function rewardMessages(batch: readonly GameEvent[]): readonly string[] {
  type MessageEvent = Extract<GameEvent, { type: 'message' }>;
  return batch
    .filter(
      (event): event is MessageEvent =>
        event.type === 'message' && event.text.endsWith('reward'),
    )
    .map((event) => event.text);
}

describe('puzzle solve completion — ENG22-SUCCESSIDS-01 (PLAYTEST_ISSUES.md §22)', () => {
  it('ENG22-SUCCESSIDS-01: an authored complete-topic does not duplicate the derived topic-completed event', async () => {
    const definition = puzzle({
      topicId: TOPIC_ID,
      score: 0,
      onSolve: [{ kind: 'complete-topic', topicId: TOPIC_ID }],
    });

    const batch = await solveBatch(definition);

    expect(
      completionsFor(batch, TOPIC_ID),
      'one solve must emit exactly one topic-completed for the topic',
    ).toHaveLength(1);
    expect(
      solvesFor(batch).filter((event) => event.puzzleId === PUZZLE_ID),
      'the §9 puzzle-solved event must still be emitted once',
    ).toHaveLength(1);
  });

  it('ENG22-SUCCESSIDS-01: the derived completion is preserved when onSolve has no complete-topic', async () => {
    const definition = puzzle({ topicId: TOPIC_ID, score: 0, onSolve: [] });

    const batch = await solveBatch(definition);

    expect(
      completionsFor(batch, TOPIC_ID),
      'a puzzle without an authored completion still completes its topic once',
    ).toHaveLength(1);
    expect(
      solvesFor(batch).filter((event) => event.puzzleId === PUZZLE_ID),
    ).toHaveLength(1);
  });

  it('ENG22-SUCCESSIDS-01: distinct authored topic completions are both preserved', async () => {
    const definition = puzzle({
      topicId: TOPIC_ID,
      score: 0,
      onSolve: [{ kind: 'complete-topic', topicId: OTHER_TOPIC_ID }],
    });

    const batch = await solveBatch(definition);
    const topicIds = batch
      .filter(
        (event): event is CompletionEvent => event.type === 'topic-completed',
      )
      .map((event) => event.topicId);

    expect(topicIds, 'both distinct topics must be completed').toHaveLength(2);
    expect(new Set(topicIds)).toEqual(new Set([TOPIC_ID, OTHER_TOPIC_ID]));
    expect(
      solvesFor(batch).filter((event) => event.puzzleId === PUZZLE_ID),
    ).toHaveLength(1);
  });

  it('ENG22-SUCCESSIDS-01: onSolve order and non-completion effects are preserved without scoring', async () => {
    const definition = puzzle({
      topicId: TOPIC_ID,
      score: 0,
      onSolve: [
        { kind: 'message', text: 'first reward' },
        { kind: 'complete-topic', topicId: TOPIC_ID },
        { kind: 'message', text: 'second reward' },
      ],
    });

    const batch = await solveBatch(definition);

    expect(rewardMessages(batch)).toEqual(['first reward', 'second reward']);
    expect(
      solvesFor(batch).filter((event) => event.puzzleId === PUZZLE_ID),
    ).toHaveLength(1);
    expect(eventTypes(batch)).not.toContain('score-changed');
  });
});
