// Game façade lifecycle contracts from application-and-ui.md §4, §4.1 and §11;
// architecture.md §6.5/§9. End states are announced by turns, never by restore.
import { describe, expect, it } from 'vitest';
import type { SaveManager } from '../../src/application/SaveManager';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { Effect } from '../../src/core/effects/Effect';
import type { Session } from '../../src/core/lifecycle/Session';
import type { ScoreTracker } from '../../src/core/scoring/ScoreTracker';
import {
  FakeRandom,
  loadEffectApplier,
  loadSession,
  makeBundle,
  makeEnvelope,
  makeGameDependencies,
  makeRuntimeState,
  makeStateDto,
} from '../fixtures/persistence';
import {
  loadGameWithPhases,
  makeTurnDependencies,
  phaseFakes,
} from '../fixtures/turn';

function scoreOf(total: number, calls: string[]): ScoreTracker {
  return {
    observe(events: readonly GameEvent[]): readonly GameEvent[] {
      calls.push('observe-score');
      return [
        ...events,
        {
          type: 'score-changed',
          delta: total,
          total,
          reason: 'test award',
        },
      ];
    },
    getTotal(): number {
      return total;
    },
  };
}

function sessionWrapped(session: Session, calls: string[]): Session {
  return {
    observe(events: readonly GameEvent[]): readonly GameEvent[] {
      calls.push('observe-session');
      return session.observe(events);
    },
    newGame(): void {
      session.newGame();
    },
  };
}

describe('Game façade lifecycle', () => {
  it('P-TURN-15: newGame, continueGame and restart replace state, clear transient views and emit the initial batch', async () => {
    const calls: string[] = [];
    const started = makeRuntimeState(
      makeStateDto({
        player: {
          position: {
            worldId: 'world-stub',
            areaId: 'area-stub',
            roomId: 'room-stub-north',
          },
          inventory: [],
          lives: 1,
        },
        turn: 7,
      }),
    );
    const game = await loadGameWithPhases(
      makeTurnDependencies(calls, {
        ...phaseFakes(calls),
        initialState: started,
      }),
    );

    const newGameBatch = (() => {
      game.newGame();
      return calls.length;
    })();
    expect(game.getViewData().position.roomId).toBe('room-stub-start');
    expect(game.getViewData().turn).toBe(0);
    expect(game.getViewData().lives).toBe(3);
    expect(newGameBatch).toBeGreaterThan(0);
    expect(calls).toContain('clear-views');
    expect(calls).toContain('session-new-game');

    game.continueGame(makeEnvelope(makeStateDto()));
    expect(game.getViewData().position.roomId).toBe('room-stub-start');
    expect(game.getViewData().status).toBe('playing');

    game.restart();
    expect(game.getViewData().turn).toBe(0);
    expect(game.getViewData().status).toBe('playing');
    expect(calls.filter((call) => call === 'clear-views')).toHaveLength(3);
  });

  it('P-TURN-16: completing every covered topic emits game-won with the final score and restart resets state', async () => {
    const calls: string[] = [];
    const state = makeRuntimeState(
      makeStateDto({
        progress: [
          {
            worldId: 'world-stub',
            areaId: 'area-stub',
            visitedRooms: ['room-stub-start'],
            completedTopics: ['topic-1'],
            earnedScore: 4,
            maxScore: 10,
          },
        ],
      }),
    );
    const bundle = makeBundle();
    const session = await loadSession(state, bundle);
    const game = await loadGameWithPhases(
      makeTurnDependencies(calls, {
        ...phaseFakes(calls),
        score: scoreOf(4, calls),
        session: sessionWrapped(session, calls),
        initialState: state,
      }),
    );

    const batch = game.submit('look');

    expect(state.status).toBe('won');
    expect(game.getViewData().status).toBe('won');
    expect(batch).toContainEqual({ type: 'game-won', finalScore: 4 });

    game.restart();
    expect(game.getViewData().status).toBe('playing');
    expect(game.getViewData().turn).toBe(0);
  });

  it('P-TURN-17: lives reaching zero emits game-over with the final score', async () => {
    const calls: string[] = [];
    const state = makeRuntimeState(
      makeStateDto({
        player: {
          position: {
            worldId: 'world-stub',
            areaId: 'area-stub',
            roomId: 'room-stub-start',
          },
          inventory: [],
          lives: 1,
        },
        progress: [
          {
            worldId: 'world-stub',
            areaId: 'area-stub',
            visitedRooms: [],
            completedTopics: [],
            earnedScore: 5,
            maxScore: 10,
          },
        ],
      }),
    );
    const applier = await loadEffectApplier(state, {
      random: new FakeRandom(),
    });
    const session = await loadSession(state, makeBundle());
    const game = await loadGameWithPhases(
      makeTurnDependencies(calls, {
        ...phaseFakes(calls),
        initialState: state,
        dispatch: (): readonly Effect[] => {
          calls.push('execute');
          return [{ kind: 'change-lives', delta: -1, reason: 'test hazard' }];
        },
        apply: (effect: Effect): readonly GameEvent[] => applier.apply(effect),
        score: scoreOf(5, calls),
        session: sessionWrapped(session, calls),
      }),
    );

    const batch = game.submit('look');

    expect(state.player.lives).toBe(0);
    expect(state.status).toBe('lost');
    expect(batch).toContainEqual({
      type: 'game-over',
      reason: 'lives exhausted',
      finalScore: 5,
    });
  });

  it('P-TURN-18: the load meta action rebinds state and refreshes views without re-announcing an end state', async () => {
    const calls: string[] = [];
    const dto = makeEnvelope(
      makeStateDto({
        status: 'won',
        turn: 9,
        progress: [
          {
            worldId: 'world-stub',
            areaId: 'area-stub',
            visitedRooms: ['room-stub-start'],
            completedTopics: ['topic-1'],
            earnedScore: 7,
            maxScore: 10,
          },
        ],
      }),
    );
    const restored = makeRuntimeState(dto.state);
    const saveManager: SaveManager = {
      ...makeGameDependencies().saveManager,
      load: () => ({ ok: true, dto }),
      restore: () => restored,
    };
    const game = await loadGameWithPhases(
      makeTurnDependencies(calls, {
        ...phaseFakes(calls),
        saveManager,
      }),
    );

    const batch = game.submit('load');

    expect(game.getViewData().status).toBe('won');
    expect(game.getViewData().turn).toBe(9);
    expect(game.getViewData().score).toBe(7);
    expect(
      batch.some(
        (event) => event.type === 'game-won' || event.type === 'game-over',
      ),
    ).toBe(false);
    expect(batch.length).toBeGreaterThan(0);
    expect(calls.filter((call) => call === 'resolve')).toHaveLength(0);
  });
});
