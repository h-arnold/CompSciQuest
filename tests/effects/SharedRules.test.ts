// Red tests for the shared rule spine (shared-rules.md §2, §5, §6, §11, §13;
// application-and-ui.md §6.1, §9). All phase systems are injected fakes.
import { describe, expect, it } from 'vitest';
import { createEffectApplier } from '../../src/core/effects/EffectApplier';
import { createScoreTracker } from '../../src/core/scoring/ScoreTracker';
import type { GameEvent } from '../../src/core/events/GameEvent';
import { FakeRandom } from '../fixtures/persistence';
import {
  eventTypes,
  FIXED_TURN,
  HAZARD_ID,
  hazard,
  loadConditionEvaluatorFactory,
  loadHazardSystemFactory,
  loadComposedReactionFactory,
  loadPuzzleSystemFactory,
  loadSchedulerFactory,
  mechanicsBundle,
  mechanicsState,
  PUZZLE_ID,
  puzzle,
  recordingComposedReactionDependencies,
  scheduled,
  TOPIC_ID,
  turnContext,
  type TurnContract,
} from '../fixtures/mechanics';
import {
  loadFormatEvent,
  loadGameWithPhases,
  makeTurnDependencies,
  phaseFakes,
} from '../fixtures/turn';

describe('shared reaction pipeline (shared-rules.md §2, §5)', () => {
  it('E-PHASE-01: the scheduler ticks first in phase 4 and returns events for the buffer', async () => {
    const createComposedReaction = await loadComposedReactionFactory();
    const trace: string[] = [];
    const systems = {
      ...recordingComposedReactionDependencies(trace),
      scheduler: {
        tick(): readonly GameEvent[] {
          trace.push('scheduler');
          return [{ type: 'message', text: 'scheduler tick' }];
        },
      },
    };
    const react = createComposedReaction(systems);

    const events = react(turnContext(mechanicsState()), []);

    expect(trace[0]).toBe('scheduler');
    expect(
      events.some(
        (event) => event.type === 'message' && event.text === 'scheduler tick',
      ),
    ).toBe(true);
  });

  it('E-PHASE-02: five injected event-returning systems are concatenated in order; phase 4 applies no effects and owns no buffer', async () => {
    const createComposedReaction = await loadComposedReactionFactory();
    const createEvaluator = await loadConditionEvaluatorFactory();
    const createScheduler = await loadSchedulerFactory();
    const createHazards = await loadHazardSystemFactory();
    const createPuzzles = await loadPuzzleSystemFactory();
    const state = mechanicsState({
      flags: { 'door-unlocked': true },
      puzzles: { [PUZZLE_ID]: { phase: 'unsolved' } },
      schedule: [
        scheduled({
          id: 'first-tick',
          effect: { kind: 'message', text: 'scheduler fired' },
        }),
      ],
    });
    const bundle = mechanicsBundle(
      [
        hazard({
          id: HAZARD_ID,
          effects: [
            { kind: 'message', text: 'hazard fired' },
            { kind: 'change-lives', delta: -1, reason: 'overheated' },
          ],
        }),
      ],
      [{ ...puzzleDefinition(), score: 0 }],
    );
    const applier = createEffectApplier(state, {
      random: new FakeRandom([0]),
    });
    const evaluator = createEvaluator();
    const trace: string[] = [];
    const composedReaction = createComposedReaction({
      scheduler: createScheduler({ applier }),
      hazards: createHazards({
        bundle,
        evaluator,
        random: new FakeRandom([0]),
        applier,
      }),
      npcs: {
        react(): readonly GameEvent[] {
          trace.push('npcs');
          return [];
        },
      },
      puzzles: createPuzzles({
        bundle,
        evaluator,
        random: new FakeRandom([0]),
        applier,
      }),
      hints: {
        react(): readonly GameEvent[] {
          trace.push('hints');
          return [];
        },
      },
    });

    const events = composedReaction(turnContext(state, { bundle }), []);

    expect(trace).toEqual(['npcs', 'hints']);
    expect(eventTypes(events)).toEqual([
      'message',
      'hazard-triggered',
      'message',
      'lives-changed',
      'puzzle-activated',
      'puzzle-solved',
      'topic-completed',
    ]);
    expect(events.every((event) => 'type' in event && !('kind' in event))).toBe(
      true,
    );
    expect(state.player.lives).toBe(2);
  });

  it('E-PHASE-03: Game passes one command-bearing TurnContext to every phase-4 system', async () => {
    const createComposedReaction = await loadComposedReactionFactory();
    const seen: TurnContract[] = [];
    const system = {
      react(context: TurnContract): readonly GameEvent[] {
        seen.push(context);
        return [];
      },
    };
    const composedReaction = createComposedReaction({
      scheduler: {
        tick(context): readonly GameEvent[] {
          seen.push(context);
          return [];
        },
      },
      hazards: system,
      npcs: system,
      puzzles: system,
      hints: system,
    });
    const state = mechanicsState();
    const context = turnContext(state, {
      command: { kind: 'open', targetId: 'door' },
    });

    composedReaction(context, []);

    expect(seen).toHaveLength(5);
    expect(seen.every((entry) => entry === context)).toBe(true);
    expect(seen[0]?.command).toEqual({ kind: 'open', targetId: 'door' });

    let observed: unknown;
    const calls: string[] = [];
    const game = await loadGameWithPhases(
      makeTurnDependencies(calls, {
        ...phaseFakes(calls),
        initialState: state,
        resolve: () => ({ kind: 'open', targetId: 'door' }),
        react: (passed): readonly GameEvent[] => {
          observed = passed;
          return [];
        },
      }),
    );

    game.submit('open door');

    expect(observed).toHaveProperty('command');
    expect(observed).toMatchObject({
      command: { kind: 'open', targetId: 'door' },
    });
  });

  it('E-CASC-01: a second reaction pass is allowed, a third is skipped, and a rule fires once', async () => {
    const createComposedReaction = await loadComposedReactionFactory();
    const createEvaluator = await loadConditionEvaluatorFactory();
    const createHazards = await loadHazardSystemFactory();
    const state = mechanicsState({ turn: FIXED_TURN });
    const sourceId = 'hazard-cascade-source';
    const enabledId = 'hazard-cascade-enabled';
    // The first hazard's set-flag emits a non-message event, which is the only
    // condition Game uses (shared-rules.md §2) to allow one extra pass. The
    // second hazard triggers on that buffered event and can therefore fire
    // only in the second pass — a real cascade, with no pre-firing.
    const definitions = [
      hazard({
        id: sourceId,
        once: true,
        effects: [{ kind: 'set-flag', flag: 'cascade-armed', value: true }],
      }),
      hazard({
        id: enabledId,
        once: true,
        trigger: { kind: 'on-event', eventType: 'flag-changed' },
        when: { kind: 'flag-set', flag: 'cascade-armed' },
        effects: [{ kind: 'message', text: 'second reaction fired' }],
      }),
    ];
    const bundle = mechanicsBundle(definitions);
    const evaluator = createEvaluator();
    const applier = createEffectApplier(state, { random: new FakeRandom([0]) });
    const hazards = createHazards({
      bundle,
      evaluator,
      random: new FakeRandom([0]),
      applier,
    });
    const composedReaction = createComposedReaction({
      ...recordingComposedReactionDependencies([]),
      hazards,
    });
    const passEvents: Array<readonly GameEvent[]> = [];
    const calls: string[] = [];
    const game = await loadGameWithPhases(
      makeTurnDependencies(calls, {
        ...phaseFakes(calls),
        initialState: state,
        react: (context, events): readonly GameEvent[] => {
          const produced = composedReaction(context, events);
          passEvents.push(produced);
          return produced;
        },
      }),
    );

    const batch = game.submit('look');
    const triggered = batch
      .filter(
        (event): event is Extract<GameEvent, { type: 'hazard-triggered' }> =>
          event.type === 'hazard-triggered',
      )
      .map((event) => event.hazardId);

    // Exactly two calls: the extra pass ran, and no third pass followed.
    expect(passEvents).toHaveLength(2);
    expect(eventTypes(passEvents[0] ?? [])).toContain('flag-changed');
    expect(eventTypes(passEvents[1] ?? [])).toContain('hazard-triggered');
    expect(triggered).toEqual([sourceId, enabledId]);
    expect(triggered.filter((id) => id === sourceId)).toHaveLength(1);
    expect(triggered.filter((id) => id === enabledId)).toHaveLength(1);
    expect(
      batch.some(
        (event) =>
          event.type === 'message' && event.text === 'second reaction fired',
      ),
    ).toBe(true);
    expect(state.flags['cascade-armed']).toBe(true);
  });

  it('E-EVENT-01: a real effect produces its mapped buffered event, which yields a transcript line', async () => {
    const state = mechanicsState({
      // A zero starting total makes the no-score rule observable below.
      progress: [
        {
          worldId: 'world-stub',
          areaId: 'area-stub',
          visitedRooms: ['room-stub-start'],
          completedTopics: [],
          earnedScore: 0,
          maxScore: 10,
        },
      ],
    });
    const applier = createEffectApplier(state, { random: new FakeRandom([0]) });
    const applied = applier.apply({
      kind: 'change-lives',
      delta: -1,
      reason: 'overheated',
    });
    expect(applied).toEqual([{ type: 'lives-changed', lives: 2 }]);
    expect(state.player.lives).toBe(2);

    const tracker = createScoreTracker(state, {
      bundle: mechanicsBundle(),
    });
    const before = tracker.getTotal();
    expect(before).toBe(0);

    // PUZZLE_ID is not declared by mechanicsBundle(), so this achievement is
    // unmapped: application-and-ui.md §10 awards no score for it. The
    // scoreable, covered-with-evidence path is asserted by Z-COMP-04.
    const events: readonly GameEvent[] = [
      ...applied,
      { type: 'puzzle-solved', puzzleId: PUZZLE_ID },
      { type: 'topic-completed', topicId: TOPIC_ID },
    ];

    const observed = tracker.observe(events);
    const formatEvent = await loadFormatEvent();
    const bundle = mechanicsBundle();

    expect(observed.some((event) => event.type === 'score-changed')).toBe(
      false,
    );
    for (const event of observed) {
      expect(formatEvent(event, bundle).length).toBeGreaterThan(0);
    }
    expect(tracker.getTotal()).toBe(before);
    expect(state.progress[0]?.earnedScore).toBe(0);
  });
});

// A minimal scoreable definition used by the five-system composition check.
function puzzleDefinition() {
  return puzzle({ id: PUZZLE_ID, topicId: TOPIC_ID });
}
