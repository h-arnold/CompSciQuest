// One-command turn pipeline contracts: architecture.md §6.2, shared-rules.md §2,
// application-and-ui.md §4/§5/§6. Every collaborator is an injected fake.
import { describe, expect, it } from 'vitest';
import type { SaveManager } from '../../src/application/SaveManager';
import type { Command } from '../../src/core/commands/Command';
import type { Effect } from '../../src/core/effects/Effect';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { Session } from '../../src/core/lifecycle/Session';
import type { ScoreTracker } from '../../src/core/scoring/ScoreTracker';
import {
  FakeRandom,
  loadEffectApplier,
  loadSession,
  makeBundle,
  makeGameDependencies,
  makeRuntimeState,
  makeStateDto,
} from '../fixtures/persistence';
import {
  MemoryBus,
  loadEventBus,
  loadGameWithPhases,
  makeTurnDependencies,
  phaseFakes,
} from '../fixtures/turn';

describe('one-command turn pipeline', () => {
  it('P-TURN-01: submit owns the pipeline and publishes the returned batch', async () => {
    const calls: string[] = [];
    const bus = new MemoryBus(calls);
    const game = await loadGameWithPhases(
      makeTurnDependencies(calls, { bus, ...phaseFakes(calls) }),
    );

    const batch = game.submit('look');

    expect(calls).toContain('resolve');
    expect(calls).toContain('publish');
    expect(batch.length).toBeGreaterThan(0);
    expect(bus.batches).toHaveLength(1);
    expect(bus.batches[0]).toEqual(batch);
  });

  it('P-TURN-02: phases run Resolve, Validate, Execute, React, Observe and Publish in order', async () => {
    const calls: string[] = [];
    const game = await loadGameWithPhases(
      makeTurnDependencies(calls, phaseFakes(calls)),
    );

    game.submit('look');

    expect(calls).toEqual([
      'resolve',
      'validate',
      'execute',
      'react',
      'observe-score',
      'observe-session',
      'publish',
    ]);
  });

  it('P-TURN-03: every submitted game command advances turn exactly once, success or failure', async () => {
    const calls: string[] = [];
    let submitted = 0;
    const game = await loadGameWithPhases(
      makeTurnDependencies(calls, {
        ...phaseFakes(calls),
        resolve: (raw: string): Command => {
          calls.push('resolve');
          submitted += 1;
          return submitted === 1 ? { kind: 'look' } : { kind: 'unknown', raw };
        },
      }),
    );

    expect(game.getViewData().turn).toBe(0);
    game.submit('look');
    expect(game.getViewData().turn).toBe(1);
    game.submit('flibble');
    expect(game.getViewData().turn).toBe(2);
    expect(submitted).toBe(2);
  });

  it('P-TURN-04: meta actions are intercepted before core dispatch and never advance turn', async () => {
    const calls: string[] = [];
    let saves = 0;
    let loads = 0;
    let downloads = 0;
    const base = makeGameDependencies();
    const saveManager: SaveManager = {
      ...base.saveManager,
      save: (): void => {
        saves += 1;
      },
      load: () => {
        loads += 1;
        return { ok: false, reason: 'invalid-json' };
      },
    };
    const game = await loadGameWithPhases(
      makeTurnDependencies(calls, {
        ...phaseFakes(calls),
        saveManager,
        downloadFile: (): void => {
          downloads += 1;
        },
      }),
    );

    for (const raw of ['save', 'load', 'download', 'import {}', 'restart']) {
      game.submit(raw);
    }

    expect(game.getViewData().turn).toBe(0);
    expect(calls.filter((call) => call === 'resolve')).toHaveLength(0);
    expect(saves).toBe(1);
    expect(loads).toBe(1);
    expect(downloads).toBe(1);
    expect(calls).toContain('clear-views');
  });

  it('P-TURN-05: the event bus publishes one whole batch and subscribe returns an unsubscribe function', async () => {
    const createEventBus = await loadEventBus();
    const bus = createEventBus();
    const received: GameEvent[] = [];
    const unsubscribe = bus.subscribe((event: GameEvent): void => {
      received.push(event);
    });
    const batch: readonly GameEvent[] = [
      { type: 'message', text: 'one' },
      { type: 'message', text: 'two' },
    ];

    expect(bus.publish).toBeTypeOf('function');
    expect(unsubscribe).toBeTypeOf('function');
    bus.publish(batch);
    expect(received).toEqual(batch);

    unsubscribe();
    bus.publish([{ type: 'message', text: 'three' }]);
    expect(received).toEqual(batch);
  });

  it('P-TURN-06: ScoreTracker observes before Session so an end event carries the final score', async () => {
    const calls: string[] = [];
    const state = makeRuntimeState(
      makeStateDto({
        progress: [
          {
            worldId: 'world-stub',
            areaId: 'area-stub',
            visitedRooms: [],
            completedTopics: [],
            earnedScore: 9,
            maxScore: 10,
          },
        ],
        player: {
          position: {
            worldId: 'world-stub',
            areaId: 'area-stub',
            roomId: 'room-stub-start',
          },
          inventory: [],
          lives: 0,
        },
      }),
    );
    const bundle = makeBundle();
    const session = await loadSession(state, bundle);
    const score: ScoreTracker = {
      observe(events: readonly GameEvent[]): readonly GameEvent[] {
        calls.push('observe-score');
        return [
          ...events,
          { type: 'score-changed', delta: 9, total: 9, reason: 'test award' },
        ];
      },
      getTotal(): number {
        return 9;
      },
    };
    const observedSession: Session = {
      observe(events: readonly GameEvent[]): readonly GameEvent[] {
        calls.push('observe-session');
        return session.observe(events);
      },
      newGame(): void {
        session.newGame();
      },
    };
    const game = await loadGameWithPhases(
      makeTurnDependencies(calls, {
        ...phaseFakes(calls),
        score,
        session: observedSession,
        initialState: state,
      }),
    );

    const batch = game.submit('look');

    expect(calls.indexOf('observe-score')).toBeLessThan(
      calls.indexOf('observe-session'),
    );
    expect(batch).toContainEqual({
      type: 'game-over',
      reason: 'lives exhausted',
      finalScore: 9,
    });
    expect(state.status).toBe('lost');
  });

  it('P-TURN-08: a rule fires once; one extra reaction pass is allowed and a third is not', async () => {
    const calls: string[] = [];
    let passes = 0;
    const game = await loadGameWithPhases(
      makeTurnDependencies(calls, {
        ...phaseFakes(calls),
        dispatch: (): readonly Effect[] => {
          calls.push('execute');
          return [];
        },
        react: (): readonly GameEvent[] => {
          calls.push('react');
          passes += 1;
          const firstPass: readonly GameEvent[] = [
            { type: 'flag-changed', flag: 'rule-enabled', value: true },
          ];
          const laterPass: readonly GameEvent[] = [
            { type: 'message', text: 'rule-fire' },
          ];
          return passes === 1 ? firstPass : laterPass;
        },
      }),
    );

    const batch = game.submit('look');

    expect(passes).toBe(2);
    expect(calls.filter((call) => call === 'react')).toHaveLength(2);
    expect(
      batch.filter(
        (event) => event.type === 'message' && event.text === 'rule-fire',
      ),
    ).toHaveLength(1);
  });

  it('P-TURN-09: every applied effect yields at least one buffered event', async () => {
    const calls: string[] = [];
    const state = makeRuntimeState(makeStateDto());
    const applier = await loadEffectApplier(state, {
      random: new FakeRandom(),
    });
    const effects: readonly Effect[] = [
      { kind: 'set-flag', flag: 'probe', value: true },
      { kind: 'message', text: 'hello' },
      { kind: 'change-lives', delta: -1, reason: 'test' },
      { kind: 'complete-topic', topicId: 'topic-1' },
      { kind: 'grant-item', itemId: 'lamp' },
      { kind: 'remove-item', itemId: 'lamp' },
      {
        kind: 'transfer-item',
        itemId: 'lamp',
        fromOwnerId: 'player',
        toOwnerId: 'room-stub-north',
      },
      { kind: 'move-player', roomId: 'room-stub-north', reason: 'test' },
      { kind: 'set-actor-state', actorId: 'npc-1', stateId: 'idle' },
      { kind: 'learn-topic', actorId: 'npc-1', topicId: 'topic-1' },
      { kind: 'enter-node', actorId: 'npc-1', nodeId: 'node-1' },
      { kind: 'exit-node', actorId: 'npc-1' },
      { kind: 'set-puzzle-active', puzzleId: 'puzzle-1' },
      { kind: 'set-puzzle-solved', puzzleId: 'puzzle-1' },
      {
        kind: 'schedule',
        event: {
          id: 'fuse-1',
          kind: 'fuse',
          remainingTurns: 1,
          effect: { kind: 'message', text: 'tick' },
        },
      },
      { kind: 'start-quiz', quizId: 'quiz-1', actorId: 'npc-1' },
      { kind: 'show-hint', hintId: 'hint-1', level: 1, text: 'hint' },
    ];
    const game = await loadGameWithPhases(
      makeTurnDependencies(calls, {
        ...phaseFakes(calls),
        initialState: state,
        dispatch: (): readonly Effect[] => {
          calls.push('execute');
          return effects;
        },
        apply: (effect: Effect): readonly GameEvent[] => applier.apply(effect),
      }),
    );

    const batch = game.submit('look');

    expect(batch.length).toBeGreaterThanOrEqual(effects.length);
    expect(batch.map((event) => event.type)).toEqual(
      expect.arrayContaining([
        'flag-changed',
        'message',
        'lives-changed',
        'topic-completed',
        'item-moved',
        'room-entered',
        'actor-state-changed',
        'knowledge-gained',
        'node-entered',
        'node-exited',
        'puzzle-activated',
        'puzzle-solved',
        'scheduled',
        'quiz-started',
        'hint-shown',
      ]),
    );
  });

  it('P-TURN-13: malformed input never throws and returns a friendly message event', async () => {
    const calls: string[] = [];
    const state = makeRuntimeState(makeStateDto());
    const before = JSON.stringify(state.player);
    const game = await loadGameWithPhases(
      makeTurnDependencies(calls, {
        ...phaseFakes(calls),
        initialState: state,
      }),
    );
    const raw = '!!! ??? ???';

    let batch: readonly GameEvent[] = [];
    expect(() => {
      batch = game.submit(raw);
    }).not.toThrow();

    expect(calls.filter((call) => call === 'resolve')).toHaveLength(1);
    expect(batch.length).toBeGreaterThan(0);
    expect(batch.every((event) => event.type === 'message')).toBe(true);
    expect(JSON.stringify(state.player)).toBe(before);
  });
});
