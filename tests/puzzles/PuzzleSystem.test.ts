// Red tests for puzzle phases, action-flag requirements, completion and
// cascades (puzzles.md §3, §5, §7; shared-rules.md §2, §11, §13;
// application-and-ui.md §9, §10). Every collaborator is an injected fake.
import { describe, expect, it } from 'vitest';
import type { ContentBundle } from '../../src/content/ContentBundle';
import { createEffectApplier } from '../../src/core/effects/EffectApplier';
import type { Effect } from '../../src/core/effects/Effect';
import { createScoreTracker } from '../../src/core/scoring/ScoreTracker';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { GameState } from '../../src/core/GameState';
import type { Puzzle } from '../../src/core/puzzles/Puzzle';
import {
  catalogueOf,
  FakeRandom,
  makeBundle,
  makeTopic,
} from '../fixtures/persistence';
import {
  DOOR_FLAG,
  eventTypes,
  FIXED_TURN,
  hazard,
  loadConditionEvaluatorFactory,
  loadHazardSystemFactory,
  loadComposedReactionFactory,
  loadPuzzleSystemFactory,
  mechanicsBundle,
  mechanicsState,
  NORTH_ROOM,
  PUZZLE_ID,
  puzzle,
  recordingComposedReactionDependencies,
  SECOND_PUZZLE_ID,
  snapshot,
  START_ROOM,
  TOPIC_ID,
  turnContext,
  type ReactionSystemContract,
} from '../fixtures/mechanics';
import {
  loadGameWithPhases,
  makeTurnDependencies,
  phaseFakes,
} from '../fixtures/turn';

async function systemFor(
  definitions: readonly Puzzle[],
  state: GameState,
  bundle: ContentBundle = mechanicsBundle([], definitions),
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

describe('puzzle completion and ordering (puzzles.md §3)', () => {
  it('Z-PHASE-01: one true requirement activates an unsolved puzzle and starts the counter next turn', async () => {
    const state = mechanicsState({
      turn: FIXED_TURN,
      flags: { [DOOR_FLAG]: true },
      puzzles: { [PUZZLE_ID]: { phase: 'unsolved' } },
    });
    const definition = puzzle({
      requirements: [
        { kind: 'flag-set', flag: DOOR_FLAG },
        { kind: 'flag-set', flag: 'circuit-closed' },
      ],
    });
    const system = await systemFor([definition], state);

    const events = system.react(turnContext(state), []);

    expect(eventTypes(events)).toContain('puzzle-activated');
    expect(state.puzzles[PUZZLE_ID]?.phase).toBe('active');
    expect(state.counters[`turns-since:${PUZZLE_ID}`]).toBe(0);
  });

  it('Z-PHASE-02: all requirements hold, the phase becomes solved before the event, and a solved puzzle stays solved', async () => {
    const state = mechanicsState({
      flags: { [DOOR_FLAG]: true },
      puzzles: { [PUZZLE_ID]: { phase: 'unsolved' } },
    });
    const system = await systemFor([puzzle()], state);
    const context = turnContext(state);

    const events = system.react(context, []);
    expect(eventTypes(events)).toContain('puzzle-solved');
    expect(state.puzzles[PUZZLE_ID]?.phase).toBe('solved');
    expect(system.react(context, [])).toEqual([]);
  });

  it('Z-PHASE-03: a restored solved puzzle round-trips its phase without re-emitting completion', async () => {
    const state = mechanicsState({
      puzzles: { [PUZZLE_ID]: { phase: 'solved' } },
    });
    const system = await systemFor([puzzle()], state);
    const restored = structuredClone(state);

    expect(restored.puzzles[PUZZLE_ID]?.phase).toBe('solved');
    expect(system.react(turnContext(restored), [])).toEqual([]);
  });

  it('Z-PHASE-04: activation creates a zero counter; a puzzle never active has none', async () => {
    const definition = puzzle({
      requirements: [
        { kind: 'flag-set', flag: DOOR_FLAG },
        { kind: 'flag-set', flag: 'circuit-closed' },
      ],
    });
    const key = `turns-since:${PUZZLE_ID}`;
    const activeState = mechanicsState({
      flags: { [DOOR_FLAG]: true },
      puzzles: { [PUZZLE_ID]: { phase: 'unsolved' } },
      counters: {},
    });
    const activeSystem = await systemFor([definition], activeState);

    activeSystem.react(turnContext(activeState), []);

    expect(
      Object.prototype.hasOwnProperty.call(activeState.counters, key),
    ).toBe(true);
    expect(activeState.counters[key]).toBe(0);

    const idleState = mechanicsState({
      flags: {},
      puzzles: { [PUZZLE_ID]: { phase: 'unsolved' } },
      counters: {},
    });
    const idleSystem = await systemFor([definition], idleState);
    expect(idleSystem.react(turnContext(idleState), [])).toEqual([]);
    expect(Object.prototype.hasOwnProperty.call(idleState.counters, key)).toBe(
      false,
    );
  });

  it('Z-PHASE-05: the counter increments on every later phase-4 turn, including conversation and quiz turns, and is never pruned', async () => {
    const key = `turns-since:${PUZZLE_ID}`;
    const definition = puzzle({
      requirements: [
        { kind: 'flag-set', flag: DOOR_FLAG },
        { kind: 'flag-set', flag: 'circuit-closed' },
      ],
    });
    const state = mechanicsState({
      flags: { [DOOR_FLAG]: true },
      puzzles: { [PUZZLE_ID]: { phase: 'active' } },
      counters: { [key]: 0, 'hints-shown:h1': 1 },
    });
    const commands = [
      { kind: 'talk-to', actorId: 'npc-1' } as const,
      { kind: 'answer', option: 0 } as const,
    ];

    for (const [index, command] of commands.entries()) {
      const system = await systemFor([definition], state);
      system.react(
        turnContext(state, { turn: FIXED_TURN + index + 1, command }),
        [],
      );
      expect(state.counters[key]).toBe(index + 1);
    }

    expect(state.counters[key]).toBe(2);
    expect(state.counters['hints-shown:h1']).toBe(1);
    expect(state.puzzles[PUZZLE_ID]?.phase).toBe('active');
  });

  it('Z-REQ-01: bare possession does not solve an action-flag puzzle', async () => {
    const state = mechanicsState({
      player: {
        position: {
          worldId: 'world-stub',
          areaId: 'area-stub',
          roomId: START_ROOM,
        },
        inventory: ['key'],
        lives: 3,
      },
      flags: { [DOOR_FLAG]: true },
      puzzles: { [PUZZLE_ID]: { phase: 'unsolved' } },
    });
    const possession = await systemFor(
      [puzzle({ requirements: [{ kind: 'has-item', itemId: 'key' }] })],
      state,
    );
    expect(possession.react(turnContext(state), [])).toEqual([]);

    const actionFlag = await systemFor([puzzle()], state);
    const solved = actionFlag.react(turnContext(state), []);
    expect(eventTypes(solved)).toContain('puzzle-solved');
  });

  it('Z-REQ-02: a has-item requirement is valid when carrying something is the solution', async () => {
    const state = mechanicsState({
      player: {
        position: {
          worldId: 'world-stub',
          areaId: 'area-stub',
          roomId: START_ROOM,
        },
        inventory: ['key'],
        lives: 3,
      },
      puzzles: { [PUZZLE_ID]: { phase: 'unsolved' } },
    });
    const system = await systemFor(
      [puzzle({ requirements: [{ kind: 'has-item', itemId: 'key' }] })],
      state,
    );

    const events = system.react(turnContext(state), []);

    expect(eventTypes(events)).toContain('puzzle-solved');
  });

  it('Z-COMP-01: solving emits puzzle-solved, applies onSolve in order and completes the topic', async () => {
    const state = mechanicsState({
      flags: { [DOOR_FLAG]: true },
      puzzles: { [PUZZLE_ID]: { phase: 'unsolved' } },
    });
    const definition = puzzle({
      topicId: TOPIC_ID,
      score: 0,
      onSolve: [
        { kind: 'message', text: 'first reward' },
        { kind: 'message', text: 'second reward' },
        { kind: 'complete-topic', topicId: TOPIC_ID },
      ],
    });
    const bundle = mechanicsBundle([], [definition]);
    const system = await systemFor([definition], state, bundle);
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

    const batch = game.submit('look');

    expect(eventTypes(batch)).toContain('puzzle-solved');
    expect(eventTypes(batch)).toContain('topic-completed');
    expect(
      batch
        .filter(
          (event): event is Extract<GameEvent, { type: 'message' }> =>
            event.type === 'message' && event.text.endsWith('reward'),
        )
        .map((event) => event.text),
    ).toEqual(['first reward', 'second reward']);
    expect(state.progress[0]?.completedTopics.includes(TOPIC_ID)).toBe(true);
  });

  it('Z-COMP-02: several puzzles for one topic each score within the budget; topic-completed scores nothing', async () => {
    const state = mechanicsState({
      flags: { [DOOR_FLAG]: true },
      puzzles: {
        [PUZZLE_ID]: { phase: 'unsolved' },
        [SECOND_PUZZLE_ID]: { phase: 'unsolved' },
      },
    });
    const definitions = [
      puzzle({ id: PUZZLE_ID, topicId: TOPIC_ID, score: 2 }),
      puzzle({ id: SECOND_PUZZLE_ID, topicId: TOPIC_ID, score: 3 }),
    ];
    const bundle = mechanicsBundle([], definitions);
    const system = await systemFor(definitions, state, bundle);
    const scorer = createScoreTracker(state, { bundle });
    const calls: string[] = [];
    const game = await loadGameWithPhases(
      makeTurnDependencies(calls, {
        ...phaseFakes(calls),
        initialState: state,
        apply: (effect: Effect): readonly GameEvent[] =>
          applyAll(state, [effect]),
        react: () => system.react(turnContext(state, { bundle }), []),
        score: scorer,
      }),
    );

    const batch = game.submit('look');
    const awards = batch.filter(
      (event): event is Extract<GameEvent, { type: 'score-changed' }> =>
        event.type === 'score-changed',
    );

    expect(awards).toHaveLength(2);
    expect(awards.map((event) => event.delta)).toEqual(
      expect.arrayContaining([2, 3]),
    );
    expect(awards.every((event) => event.total === 8)).toBe(true);
    expect(state.progress[0]?.earnedScore).toBe(8);
    const before = snapshot(state.progress);
    expect(
      eventTypes(
        applyAll(state, [{ kind: 'complete-topic', topicId: TOPIC_ID }]),
      ),
    ).toContain('topic-completed');
    expect(snapshot(state.progress)).toBe(before);
  });

  it('Z-COMP-03: a non-scoreable puzzle becomes solved without a score change', async () => {
    const state = mechanicsState({
      flags: { [DOOR_FLAG]: true },
      puzzles: { [PUZZLE_ID]: { phase: 'unsolved' } },
    });
    const nonScoreable = puzzle({ score: 0 });
    const bundle = mechanicsBundle([], [nonScoreable]);
    const system = await systemFor([nonScoreable], state, bundle);
    const scorer = createScoreTracker(state, { bundle });
    const calls: string[] = [];
    const game = await loadGameWithPhases(
      makeTurnDependencies(calls, {
        ...phaseFakes(calls),
        initialState: state,
        apply: (effect: Effect): readonly GameEvent[] =>
          applyAll(state, [effect]),
        react: () => system.react(turnContext(state, { bundle }), []),
        score: scorer,
      }),
    );

    const batch = game.submit('look');

    expect(state.puzzles[PUZZLE_ID]?.phase).toBe('solved');
    expect(eventTypes(batch)).not.toContain('score-changed');
    expect(state.progress[0]?.earnedScore).toBe(3);
  });

  it('Z-COMP-04: a covered topic with evidence awards the declared score with a post-award total', async () => {
    const state = mechanicsState();
    const definition = puzzle({ topicId: TOPIC_ID, score: 2 });
    const bundle = mechanicsBundle([], [definition]);
    const tracker = createScoreTracker(state, { bundle });

    const observed = tracker.observe([
      { type: 'puzzle-solved', puzzleId: PUZZLE_ID },
    ]);
    const awards = observed.filter(
      (event): event is Extract<GameEvent, { type: 'score-changed' }> =>
        event.type === 'score-changed',
    );

    expect(awards).toHaveLength(1);
    expect(awards[0]?.delta).toBe(2);
    expect(awards[0]?.reason).toBe(`puzzle:${PUZZLE_ID}`);
    expect(awards[0]?.total).toBe(5);
    expect(state.progress[0]?.earnedScore).toBe(5);
  });

  it('Z-COMP-05: a non-covered topic earns nothing but still solves and completes the topic', async () => {
    const topicEntry = makeTopic({ status: 'in progress', evidence: '' });
    const definition = puzzle({
      topicId: TOPIC_ID,
      score: 2,
      onSolve: [{ kind: 'complete-topic', topicId: TOPIC_ID }],
    });
    const bundle: ContentBundle = {
      ...makeBundle({ topics: [topicEntry] }),
      puzzles: catalogueOf([definition]),
    };
    const state = mechanicsState({
      flags: { [DOOR_FLAG]: true },
      puzzles: { [PUZZLE_ID]: { phase: 'unsolved' } },
    });
    const tracker = createScoreTracker(state, { bundle });

    const observed = tracker.observe([
      { type: 'puzzle-solved', puzzleId: PUZZLE_ID },
    ]);
    expect(observed.some((event) => event.type === 'score-changed')).toBe(
      false,
    );

    const system = await systemFor([definition], state, bundle);
    const events = system.react(turnContext(state, { bundle }), []);
    expect(eventTypes(events)).toContain('puzzle-solved');
    expect(eventTypes(events)).toContain('topic-completed');
    expect(state.puzzles[PUZZLE_ID]?.phase).toBe('solved');
    expect(state.progress[0]?.earnedScore).toBe(3);
  });

  it('Z-SKIP-01: a rule that already fired is skipped silently in the same turn', async () => {
    const state = mechanicsState({
      flags: { [DOOR_FLAG]: true },
      puzzles: { [PUZZLE_ID]: { phase: 'unsolved' } },
    });
    const system = await systemFor([puzzle()], state);
    const context = turnContext(state);

    const events = system.react(context, []);
    const again = system.react(context, events);

    expect(state.puzzles[PUZZLE_ID]?.phase).toBe('solved');
    expect(again).toEqual([]);
    expect(
      events.filter((event) => event.type === 'puzzle-solved'),
    ).toHaveLength(1);
  });

  it('Z-ORDER-01: phase 4 runs Scheduler, Hazards, NPC reactions, Puzzles then Auto-hints', async () => {
    const createComposedReaction = await loadComposedReactionFactory();
    const trace: string[] = [];
    const react = createComposedReaction(
      recordingComposedReactionDependencies(trace),
    );

    react(turnContext(mechanicsState()), []);

    expect(trace).toEqual(['scheduler', 'hazards', 'npcs', 'puzzles', 'hints']);
  });

  it('Z-HINT-01: a threshold-gated hint never changes puzzle phase or solves the puzzle', async () => {
    const state = mechanicsState({
      counters: { [`turns-since:${PUZZLE_ID}`]: 4 },
      puzzles: { [PUZZLE_ID]: { phase: 'active' } },
    });
    const system = await systemFor([puzzle()], state);

    const events = applyAll(state, [
      {
        kind: 'show-hint',
        hintId: 'hint-test',
        level: 1,
        text: 'Try the door.',
      },
    ]);

    expect(eventTypes(events)).toContain('hint-shown');
    expect(state.puzzles[PUZZLE_ID]?.phase).toBe('active');
    expect(system.react(turnContext(state), events)).toEqual([]);
  });

  it('Z-STATE-01: a hazard teleport and flag reset leave an active puzzle active', async () => {
    const state = mechanicsState({
      flags: { 'trap-armed': true },
      puzzles: { [PUZZLE_ID]: { phase: 'active' } },
    });
    const createEvaluator = await loadConditionEvaluatorFactory();
    const createHazards = await loadHazardSystemFactory();
    const bundle = mechanicsBundle([
      hazard({
        effects: [
          { kind: 'set-flag', flag: 'trap-armed', value: false },
          { kind: 'move-player', roomId: NORTH_ROOM, reason: 'level start' },
        ],
      }),
    ]);
    const hazards = createHazards({
      bundle,
      evaluator: createEvaluator(),
      random: new FakeRandom([0]),
      applier: createEffectApplier(state, { random: new FakeRandom([0]) }),
    });
    const calls: string[] = [];
    const game = await loadGameWithPhases(
      makeTurnDependencies(calls, {
        ...phaseFakes(calls),
        initialState: state,
        apply: (effect: Effect): readonly GameEvent[] =>
          applyAll(state, [effect]),
        react: () => hazards.react(turnContext(state, { bundle }), []),
      }),
    );

    const batch = game.submit('look');

    expect(state.flags['trap-armed']).toBe(false);
    expect(state.player.position.roomId).toBe(NORTH_ROOM);
    expect(state.puzzles[PUZZLE_ID]?.phase).toBe('active');
    expect(eventTypes(batch)).not.toContain('puzzle-solved');
  });
});
