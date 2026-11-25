// Red tests for hazard content binding, registration and persistence
// (hazards.md §2, §5, §7; storage-schema.md §3.2; architecture.md §12).
// All factories are injected seams; missing behaviour fails by assertion.
import { describe, expect, it } from 'vitest';
import { createFromDto } from '../../src/core/GameState';
import { createEffectApplier } from '../../src/core/effects/EffectApplier';
import {
  LOCAL_FIXTURE_COVERAGE_TOPIC_IDS,
  loadValidator,
} from '../fixtures/content';
import { FakeRandom, roundTripThroughJson } from '../fixtures/persistence';
import {
  eventTypes,
  FIXED_TURN,
  HAZARD_ID,
  hazard,
  loadConditionEvaluatorFactory,
  loadHazardCatalogueFactory,
  loadHazardSystemFactory,
  loadComposedReactionFactory,
  loadPuzzleSystemFactory,
  loadSchedulerFactory,
  mechanicsBundle,
  mechanicsState,
  NORTH_ROOM,
  recordingComposedReactionDependencies,
  scheduled,
  SECOND_HAZARD_ID,
  snapshot,
  START_ROOM,
  turnContext,
} from '../fixtures/mechanics';
import type { GameEvent } from '../../src/core/events/GameEvent';

function enteredEvent(): GameEvent {
  return {
    type: 'room-entered',
    room: {
      id: START_ROOM,
      title: 'Stub Starting Room',
      description: 'A deterministic placeholder room.',
      exits: [],
    },
  };
}

describe('hazard definitions, registration and persistence', () => {
  it('H-BUILD-01: hazards and puzzles are the first mechanics wired into phase 4', async () => {
    const createEvaluator = await loadConditionEvaluatorFactory();
    const createHazards = await loadHazardSystemFactory();
    const createPuzzles = await loadPuzzleSystemFactory();
    const createScheduler = await loadSchedulerFactory();
    const createComposedReaction = await loadComposedReactionFactory();

    const evaluator = createEvaluator();
    const probe = mechanicsState();
    const dependencies = {
      bundle: mechanicsBundle(),
      evaluator,
      random: new FakeRandom([0]),
      applier: createEffectApplier(probe, { random: new FakeRandom([0]) }),
    };
    const systems = {
      ...recordingComposedReactionDependencies([]),
      scheduler: createScheduler({
        applier: createEffectApplier(probe, { random: new FakeRandom([0]) }),
      }),
      hazards: createHazards(dependencies),
      puzzles: createPuzzles(dependencies),
    };
    expect(createComposedReaction(systems)).toBeTypeOf('function');
  });

  it('H-DEF-01: getForRoom targets the declared room and the start is the area startRoomId', async () => {
    const createCatalogue = await loadHazardCatalogueFactory();
    const definitions = [
      hazard({
        id: HAZARD_ID,
        trigger: { kind: 'on-room-enter', roomId: START_ROOM },
      }),
      hazard({
        id: SECOND_HAZARD_ID,
        trigger: { kind: 'on-room-enter', roomId: NORTH_ROOM },
      }),
    ];
    const catalogue = createCatalogue(definitions);

    expect(catalogue.getById(HAZARD_ID)?.id).toBe(HAZARD_ID);
    expect(catalogue.getForRoom(START_ROOM).map((entry) => entry.id)).toEqual([
      HAZARD_ID,
    ]);
    expect(catalogue.getForRoom(NORTH_ROOM).map((entry) => entry.id)).toEqual([
      SECOND_HAZARD_ID,
    ]);
    expect(mechanicsBundle().areas.getById('area-stub')?.startRoomId).toBe(
      START_ROOM,
    );
  });

  it('H-DEF-02: a hazard with no player-facing telegraph is reported by hazard-content', async () => {
    const validate = await loadValidator();
    const definition = hazard({
      effects: [{ kind: 'change-lives', delta: -1, reason: 'overheated' }],
    });
    const bundle = mechanicsBundle([definition]);
    const before = snapshot(bundle);

    const problems = validate(bundle, LOCAL_FIXTURE_COVERAGE_TOPIC_IDS);

    expect(problems.join(' ').toLowerCase()).toContain('telegraph');
    expect(snapshot(bundle)).toBe(before);
  });

  it('H-SCHED-01: a declared schedule is inactive until a schedule effect registers it', async () => {
    const event = scheduled({ id: 'fuse-hazard' });
    const definition = hazard({
      schedule: event,
      effects: [{ kind: 'schedule', event }],
    });
    const state = mechanicsState();
    const bundle = mechanicsBundle([definition]);
    const createEvaluator = await loadConditionEvaluatorFactory();
    const createHazards = await loadHazardSystemFactory();
    const system = createHazards({
      bundle,
      evaluator: createEvaluator(),
      random: new FakeRandom([0]),
      applier: createEffectApplier(state, { random: new FakeRandom([0]) }),
    });
    expect(state.schedule).toEqual([]);

    const events = system.react(turnContext(state, { bundle }), [
      enteredEvent(),
    ]);

    expect(state.schedule.map((entry) => entry.id)).toEqual(['fuse-hazard']);
    expect(events.some((item) => item.type === 'scheduled')).toBe(true);
  });

  it('H-PERSIST-01: a mid-countdown schedule resumes after a JSON save and restore', async () => {
    const createScheduler = await loadSchedulerFactory();
    const state = mechanicsState({
      schedule: [scheduled({ id: 'fuse-hazard', remainingTurns: 2 })],
    });
    const scheduler = createScheduler({
      applier: createEffectApplier(state, { random: new FakeRandom([0]) }),
    });
    scheduler.tick(turnContext(state), state);
    expect(state.schedule[0]?.remainingTurns).toBe(1);

    const restored = createFromDto(roundTripThroughJson(state));
    const resumed = createScheduler({
      applier: createEffectApplier(restored, { random: new FakeRandom([0]) }),
    });
    const before = restored.schedule[0]?.remainingTurns;
    const events = resumed.tick(
      turnContext(restored, { turn: FIXED_TURN + 1 }),
      restored,
    );

    expect(before).toBe(1);
    expect(events.some((event) => event.type === 'message')).toBe(true);
    expect(restored.schedule).toEqual([]);
  });

  it('H-PERSIST-02: timesFired round-trips and lastFiredTurn is omitted until the first fire', async () => {
    const createEvaluator = await loadConditionEvaluatorFactory();
    const createHazards = await loadHazardSystemFactory();
    const state = mechanicsState({
      turn: FIXED_TURN,
      hazards: { [HAZARD_ID]: { timesFired: 1 } },
    });
    const bundle = mechanicsBundle([hazard({ once: true })]);
    const system = createHazards({
      bundle,
      evaluator: createEvaluator(),
      random: new FakeRandom([0]),
      applier: createEffectApplier(state, { random: new FakeRandom([0]) }),
    });

    expect(
      system.react(turnContext(state, { bundle }), [enteredEvent()]),
    ).toEqual([]);
    expect('lastFiredTurn' in (state.hazards[HAZARD_ID] ?? {})).toBe(false);

    const firstFire = mechanicsState({
      turn: FIXED_TURN,
      hazards: { [HAZARD_ID]: { timesFired: 0 } },
    });
    const firstSystem = createHazards({
      bundle,
      evaluator: createEvaluator(),
      random: new FakeRandom([0]),
      applier: createEffectApplier(firstFire, { random: new FakeRandom([0]) }),
    });
    firstSystem.react(turnContext(firstFire, { bundle }), [enteredEvent()]);
    expect(firstFire.hazards[HAZARD_ID]?.timesFired).toBe(1);
    expect(firstFire.hazards[HAZARD_ID]?.lastFiredTurn).toBe(FIXED_TURN);

    const restored = roundTripThroughJson(firstFire);
    expect(restored.hazards[HAZARD_ID]).toEqual(firstFire.hazards[HAZARD_ID]);
  });

  it('H-PERSIST-03: a repeatable hazard records timesFired and lastFiredTurn and both round-trip', async () => {
    const definition = hazard(); // no `once`, no `cooldownTurns`
    const state = mechanicsState({ turn: FIXED_TURN, hazards: {} });
    const bundle = mechanicsBundle([definition]);
    const createEvaluator = await loadConditionEvaluatorFactory();
    const createHazards = await loadHazardSystemFactory();
    const system = createHazards({
      bundle,
      evaluator: createEvaluator(),
      random: new FakeRandom([0]),
      applier: createEffectApplier(state, { random: new FakeRandom([0]) }),
    });

    const events = system.react(turnContext(state, { bundle }), [
      enteredEvent(),
    ]);

    expect(eventTypes(events)).toContain('hazard-triggered');
    expect(state.hazards[HAZARD_ID]?.timesFired).toBe(1);
    expect(state.hazards[HAZARD_ID]?.lastFiredTurn).toBe(FIXED_TURN);
    expect(roundTripThroughJson(state).hazards[HAZARD_ID]).toEqual(
      state.hazards[HAZARD_ID],
    );
  });
});
