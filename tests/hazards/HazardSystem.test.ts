// Red tests for hazard execution (hazards.md §3, §6, §7, §8; shared-rules.md
// §2, §5, §11). Every collaborator is injected and the clock, storage and
// randomness are fakes; no production module is edited here.
import { describe, expect, it } from 'vitest';
import type { Effect } from '../../src/core/effects/Effect';
import { createEffectApplier } from '../../src/core/effects/EffectApplier';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { GameState } from '../../src/core/GameState';
import { createScoreTracker } from '../../src/core/scoring/ScoreTracker';
import type { Hazard } from '../../src/core/hazards/Hazard';
import { FakeRandom, loadSession, RecordingBus } from '../fixtures/persistence';
import {
  DOOR_FLAG,
  eventTypes,
  FIXED_TURN,
  HAZARD_ID,
  hazard,
  loadConditionEvaluatorFactory,
  loadHazardSystemFactory,
  mechanicsBundle,
  mechanicsState,
  NORTH_ROOM,
  PUZZLE_ID,
  SECOND_HAZARD_ID,
  snapshot,
  START_ROOM,
  turnContext,
  type ReactionSystemContract,
} from '../fixtures/mechanics';
import {
  loadFormatEvent,
  loadGameWithPhases,
  makeTurnDependencies,
  phaseFakes,
} from '../fixtures/turn';

async function systemFor(
  definitions: readonly Hazard[],
  state: GameState,
  roomScore = 0,
): Promise<ReactionSystemContract> {
  const createEvaluator = await loadConditionEvaluatorFactory();
  const createHazards = await loadHazardSystemFactory();
  const bundle = mechanicsBundle(definitions, [], roomScore);
  return createHazards({
    bundle,
    evaluator: createEvaluator(),
    random: new FakeRandom([0]),
    applier: createEffectApplierFor(state),
  });
}

// Kept as a named helper so each test shows the sole mutator is injected into
// the reaction system rather than used by the system's caller.
function createEffectApplierFor(state: GameState) {
  return createEffectApplier(state, { random: new FakeRandom([0]) });
}

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

describe('hazard execution (hazards.md §3)', () => {
  it('H-TRIG-01: trigger is checked against buffered events, then when against final state', async () => {
    const definition = hazard({
      trigger: { kind: 'on-event', eventType: 'room-entered' },
      when: { kind: 'flag-set', flag: DOOR_FLAG },
    });
    const noFlag = mechanicsState({ flags: {} });
    const noFlagContext = turnContext(noFlag);
    const system = await systemFor([definition], noFlag);

    expect(system.react(noFlagContext, [enteredEvent()])).toEqual([]);

    const finalState = mechanicsState({
      flags: { [DOOR_FLAG]: true },
      turn: FIXED_TURN,
    });
    const finalContext = turnContext(finalState);
    const finalSystem = await systemFor([definition], finalState);
    const events = finalSystem.react(finalContext, [enteredEvent()]);

    expect(eventTypes(events)).toContain('hazard-triggered');
    expect(eventTypes(events)).toContain('lives-changed');
    expect(finalState.player.lives).toBeLessThan(3);
  });

  it('H-TRIG-02: a once hazard that has fired is skipped with no effect or event', async () => {
    const definition = hazard({ once: true });
    const state = mechanicsState({
      turn: FIXED_TURN,
      hazards: {
        [HAZARD_ID]: { lastFiredTurn: FIXED_TURN - 1, timesFired: 1 },
      },
    });
    const system = await systemFor([definition], state);
    const context = turnContext(state);
    const before = snapshot(state);

    const events = system.react(context, [enteredEvent()]);

    expect(events).toEqual([]);
    expect(snapshot(state)).toBe(before);
  });

  it('H-TRIG-03: cooldown blocks an early refire but an absent lastFiredTurn never blocks', async () => {
    const definition = hazard({ cooldownTurns: 3 });
    const cooling = mechanicsState({
      turn: FIXED_TURN,
      hazards: {
        [HAZARD_ID]: { lastFiredTurn: FIXED_TURN - 1, timesFired: 1 },
      },
    });
    const coolingContext = turnContext(cooling);
    const coolingSystem = await systemFor([definition], cooling);
    expect(coolingSystem.react(coolingContext, [enteredEvent()])).toEqual([]);

    const fresh = mechanicsState({
      turn: FIXED_TURN,
      hazards: { [HAZARD_ID]: { timesFired: 1 } },
    });
    const freshContext = turnContext(fresh);
    const freshSystem = await systemFor([definition], fresh);
    const events = freshSystem.react(freshContext, [enteredEvent()]);
    expect(eventTypes(events)).toContain('hazard-triggered');
  });

  it('H-TRIG-04: room-entry hazards fire after the opening room description, in declaration order', async () => {
    const state = mechanicsState({ turn: FIXED_TURN });
    const definitions = [
      hazard({ id: 'hazard-one', once: true }),
      hazard({ id: 'hazard-two', once: true }),
    ];
    const system = await systemFor(definitions, state);
    const calls: string[] = [];
    const bus = new RecordingBus();
    const game = await loadGameWithPhases(
      makeTurnDependencies(calls, {
        ...phaseFakes(calls),
        initialState: state,
        bus,
        apply: createEffectApplierFor(state).apply,
        react: () =>
          system.react(
            turnContext(state, { bundle: mechanicsBundle(definitions) }),
            [],
          ),
      }),
    );

    game.newGame();
    const batch = game.submit('look');

    expect(bus.events[0]?.type).toBe('room-entered');
    expect(
      bus.events.filter((event) => event.type === 'hazard-triggered'),
    ).toHaveLength(2);
    expect(
      bus.events.findIndex((event) => event.type === 'room-entered'),
    ).toBeLessThan(
      bus.events.findIndex((event) => event.type === 'hazard-triggered'),
    );
    expect(
      batch
        .filter(
          (event): event is Extract<GameEvent, { type: 'hazard-triggered' }> =>
            event.type === 'hazard-triggered',
        )
        .map((event) => event.hazardId),
    ).toEqual(['hazard-one', 'hazard-two']);
  });

  it('H-TRIG-05: a missing flag or ID in a condition evaluates false and never throws', async () => {
    const createEvaluator = await loadConditionEvaluatorFactory();
    const evaluator = createEvaluator();
    const state = mechanicsState({ flags: {}, puzzles: {} });
    const context = turnContext(state);
    expect(() =>
      evaluator.evaluate(
        { kind: 'flag-set', flag: 'never-set' },
        state,
        context,
      ),
    ).not.toThrow();
    expect(
      evaluator.evaluate(
        { kind: 'flag-set', flag: 'never-set' },
        state,
        context,
      ),
    ).toBe(false);

    const definition = hazard({
      when: { kind: 'puzzle-solved', puzzleId: 'puzzle-missing' },
    });
    const system = await systemFor([definition], state);
    expect(system.react(context, [enteredEvent()])).toEqual([]);
  });

  it('H-TRIG-06: an on-verb trigger matches context.command.kind and fabricates no event', async () => {
    const definition = hazard({
      once: true,
      trigger: { kind: 'on-verb', verb: 'open' },
      effects: [{ kind: 'message', text: 'The latch gives way.' }],
    });
    const state = mechanicsState();
    const bundle = mechanicsBundle([definition]);
    const system = await systemFor([definition], state);

    const wrongVerb = system.react(
      turnContext(state, { bundle, command: { kind: 'look' } }),
      [],
    );
    const before = snapshot(state);
    expect(wrongVerb).toEqual([]);
    expect(snapshot(state)).toBe(before);

    const matched = system.react(
      turnContext(state, {
        bundle,
        command: { kind: 'open', targetId: 'door' },
      }),
      [],
    );
    expect(eventTypes(matched)).toContain('hazard-triggered');
    expect(
      matched.some((event) =>
        Object.keys(event).some((key) => key === 'verb' || key === 'on-verb'),
      ),
    ).toBe(false);
  });

  it('H-TRIG-07: an on-item-used trigger matches an itemId on context.command', async () => {
    const definition = hazard({
      once: true,
      trigger: { kind: 'on-item-used', itemId: 'key' },
      effects: [{ kind: 'message', text: 'The key turns.' }],
    });
    const state = mechanicsState();
    const bundle = mechanicsBundle([definition]);
    const system = await systemFor([definition], state);
    const before = snapshot(state);

    expect(
      system.react(
        turnContext(state, { bundle, command: { kind: 'look' } }),
        [],
      ),
    ).toEqual([]);
    expect(
      system.react(
        turnContext(state, {
          bundle,
          command: { kind: 'take', itemId: 'lamp' },
        }),
        [],
      ),
    ).toEqual([]);
    expect(snapshot(state)).toBe(before);

    const matched = system.react(
      turnContext(state, {
        bundle,
        command: { kind: 'use', itemId: 'key', targetId: 'door' },
      }),
      [],
    );
    expect(
      matched
        .filter(
          (event): event is Extract<GameEvent, { type: 'hazard-triggered' }> =>
            event.type === 'hazard-triggered',
        )
        .map((event) => event.hazardId),
    ).toEqual([HAZARD_ID]);
  });

  it('H-EVT-01: a firing hazard emits a silent hazard-triggered event plus message and lives-changed lines', async () => {
    const definition = hazard({
      effects: [
        { kind: 'message', text: 'The switches hiss.' },
        { kind: 'change-lives', delta: -1, reason: 'overheated' },
      ],
    });
    const state = mechanicsState();
    const bundle = mechanicsBundle([definition]);
    const system = await systemFor([definition], state);
    const events = system.react(turnContext(state, { bundle }), [
      enteredEvent(),
    ]);
    const formatEvent = await loadFormatEvent();

    expect(eventTypes(events)).toContain('hazard-triggered');
    expect(eventTypes(events)).toContain('lives-changed');
    const messages = events.filter(
      (event): event is Extract<GameEvent, { type: 'message' }> =>
        event.type === 'message',
    );
    expect(messages.map((event) => event.text)).toContain('The switches hiss.');

    // ENG8-LOGID-01: hazard-triggered is internal state, so its ID and reason
    // must not reach the log; the accompanying player-facing events still do.
    for (const event of events) {
      if (event.type === 'hazard-triggered') {
        expect(
          formatEvent(event, bundle),
          'hazard-triggered must render no transcript line',
        ).toEqual([]);
      }
    }
    const playerFacing = events.filter(
      (
        event,
      ): event is Extract<GameEvent, { type: 'message' | 'lives-changed' }> =>
        event.type === 'message' || event.type === 'lives-changed',
    );
    expect(playerFacing.length).toBeGreaterThan(0);
    const renderedText = playerFacing
      .flatMap((event) => formatEvent(event, bundle))
      .join('\n');
    for (const event of playerFacing) {
      expect(
        formatEvent(event, bundle).join('').trim().length,
        `${event.type} must still render player-facing text`,
      ).toBeGreaterThan(0);
    }
    expect(renderedText).not.toMatch(HAZARD_ID);
    expect(renderedText).toContain('The switches hiss.');

    const calls: string[] = [];
    const game = await loadGameWithPhases(makeTurnDependencies(calls, {}));
    expect(Object.keys(game.getViewData())).not.toContain('hazardPanel');
  });

  it('H-EFF-01: damage emits lives-changed and zero lives emits game-over after score observation', async () => {
    const state = mechanicsState({
      player: {
        position: {
          worldId: 'world-stub',
          areaId: 'area-stub',
          roomId: START_ROOM,
        },
        inventory: [],
        lives: 1,
      },
    });
    const definition = hazard({
      once: true,
      effects: [{ kind: 'change-lives', delta: -1, reason: 'overheated' }],
    });
    const system = await systemFor([definition], state);
    const session = await loadSession(state, mechanicsBundle([definition]));
    const calls: string[] = [];
    const game = await loadGameWithPhases(
      makeTurnDependencies(calls, {
        ...phaseFakes(calls),
        initialState: state,
        apply: createEffectApplierFor(state).apply,
        react: () =>
          system.react(
            turnContext(state, { bundle: mechanicsBundle([definition]) }),
            [],
          ),
        session,
        score: {
          observe(events): readonly GameEvent[] {
            calls.push('observe-score');
            return [
              ...events,
              { type: 'score-changed', delta: 0, total: 9, reason: 'probe' },
            ];
          },
          getTotal(): number {
            return 9;
          },
        },
      }),
    );

    const batch = game.submit('look');

    expect(eventTypes(batch)).toContain('lives-changed');
    expect(eventTypes(batch)).toContain('score-changed');
    expect(eventTypes(batch)).toContain('game-over');
    expect(
      batch.findIndex((event) => event.type === 'score-changed'),
    ).toBeLessThan(batch.findIndex((event) => event.type === 'game-over'));
    const over = batch.find(
      (event): event is Extract<GameEvent, { type: 'game-over' }> =>
        event.type === 'game-over',
    );
    expect(over?.reason).toBe('lives exhausted');
    expect(over?.finalScore).toBe(state.score);
    expect(state.status).toBe('lost');
  });

  it('H-EFF-02: a hazard never changes PuzzleStateDto.phase, even when its card carries set-puzzle effects', async () => {
    const state = mechanicsState({
      puzzles: { [PUZZLE_ID]: { phase: 'unsolved' } },
    });
    const definition = hazard({
      effects: [
        { kind: 'set-puzzle-solved', puzzleId: PUZZLE_ID },
        { kind: 'message', text: 'The switches hiss.' },
      ],
    });
    const system = await systemFor([definition], state);
    const events = system.react(turnContext(state), [enteredEvent()]);

    expect(eventTypes(events)).not.toContain('puzzle-solved');
    expect(state.puzzles[PUZZLE_ID]?.phase).toBe('unsolved');
  });

  it('H-EFF-03: the hazard system applies its own effects through the injected applier and returns events', async () => {
    const state = mechanicsState();
    const system = await systemFor([hazard()], state);
    const before = snapshot(state);

    const events: readonly GameEvent[] = system.react(turnContext(state), [
      enteredEvent(),
    ]);

    expect(events.length).toBeGreaterThan(0);
    expect(events.every((event) => 'type' in event && !('kind' in event))).toBe(
      true,
    );
    expect(eventTypes(events)).toContain('hazard-triggered');
    expect(snapshot(state)).not.toBe(before);
    expect(state.player.lives).toBe(2);
  });

  it('H-EFF-04: a hazard teleport emits room-entered and scores a first visit only', async () => {
    const definition = hazard({
      once: true,
      effects: [
        {
          kind: 'move-player',
          roomId: NORTH_ROOM,
          reason: 'returned to the level start',
        },
      ],
    });
    const state = mechanicsState();
    const bundle = mechanicsBundle([definition], [], 2);
    const system = await systemFor([definition], state, 2);
    const scorer = createScoreTracker(state, { bundle });
    const calls: string[] = [];
    const game = await loadGameWithPhases(
      makeTurnDependencies(calls, {
        ...phaseFakes(calls),
        initialState: state,
        apply: createEffectApplierFor(state).apply,
        react: () => system.react(turnContext(state, { bundle }), []),
        score: scorer,
      }),
    );

    const first = game.submit('look');
    const second = game.submit('look');

    expect(eventTypes(first)).toContain('room-entered');
    expect(
      first.filter((event) => event.type === 'score-changed'),
    ).toHaveLength(1);
    expect(
      second.filter((event) => event.type === 'score-changed'),
    ).toHaveLength(0);
  });

  it('H-EFF-05: a hazard flag reset leaves puzzle phase alone and offers no hint', async () => {
    const state = mechanicsState({
      flags: { 'trap-armed': true },
      puzzles: { [PUZZLE_ID]: { phase: 'active' } },
    });
    const definition = hazard({
      once: true,
      effects: [{ kind: 'set-flag', flag: 'trap-armed', value: false }],
    });
    const system = await systemFor([definition], state);
    const calls: string[] = [];
    const game = await loadGameWithPhases(
      makeTurnDependencies(calls, {
        ...phaseFakes(calls),
        initialState: state,
        apply: createEffectApplierFor(state).apply,
        react: () =>
          system.react(
            turnContext(state, { bundle: mechanicsBundle([definition]) }),
            [],
          ),
      }),
    );

    const batch = game.submit('look');

    expect(state.flags['trap-armed']).toBe(false);
    expect(state.puzzles[PUZZLE_ID]?.phase).toBe('active');
    expect(eventTypes(batch)).not.toContain('hint-shown');
  });

  it('H-EFF-06: announce-hazard is the sole carrier of hazard-triggered and no effect writes score', () => {
    const state = mechanicsState();
    const applier = createEffectApplierFor(state);
    const before = snapshot(state.progress);

    const events = applier.apply({
      kind: 'announce-hazard',
      hazardId: HAZARD_ID,
      reason: 'overheated',
    });

    expect(events).toEqual([
      {
        type: 'hazard-triggered',
        hazardId: HAZARD_ID,
        reason: 'overheated',
      },
    ]);
    expect(snapshot(state.progress)).toBe(before);

    // @ts-expect-error award-score was removed from the pinned Effect union
    const legacy: Effect = { kind: 'award-score', delta: 2, reason: 'legacy' };
    expect(eventTypes(applier.apply(legacy))).not.toContain('score-changed');
    expect(snapshot(state.progress)).toBe(before);
  });

  it('H-ORDER-01: two hazards fire in declaration order and each rule fires at most once per turn', async () => {
    const state = mechanicsState();
    const definitions = [
      hazard({
        id: 'hazard-one',
        effects: [{ kind: 'message', text: 'first' }],
      }),
      hazard({
        id: SECOND_HAZARD_ID,
        effects: [{ kind: 'message', text: 'second' }],
      }),
    ];
    const system = await systemFor(definitions, state);
    const context = turnContext(state);

    const first = system.react(context, [enteredEvent()]);
    const second = system.react(context, [enteredEvent()]);

    expect(
      first
        .filter(
          (event): event is Extract<GameEvent, { type: 'message' }> =>
            event.type === 'message',
        )
        .map((event) => event.text),
    ).toEqual(['first', 'second']);
    expect(second).toEqual([]);
  });
});
