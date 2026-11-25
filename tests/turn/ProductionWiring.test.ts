// Red test for UI-BOOT-18: the production Game built by main.ts must produce
// observable turn events without injected phase fakes. `Game.ts` currently
// defaults check/dispatch/react to empty functions, so a typed command yields
// no events in the real app. Only infrastructure collaborators are faked here
// (storage, clock, random, bus, save manager); no phase seam is injected.
import { describe, expect, it } from 'vitest';
import { createGame } from '../../src/application/Game';
import {
  hazard,
  mechanicsBundle,
  mechanicsState,
  puzzle,
} from '../fixtures/mechanics';
import { makeGameDependencies, RecordingBus } from '../fixtures/persistence';

describe('production game wiring (UI-BOOT-18)', () => {
  it('UI-BOOT-18: an ordinary typed command builds one context with its command and produces events with no injected check, dispatch or react', () => {
    const verbHazard = hazard({
      id: 'hazard-on-look',
      once: true,
      trigger: { kind: 'on-verb', verb: 'look' },
      effects: [{ kind: 'message', text: 'The trap stirs.' }],
    });
    const state = mechanicsState({
      // An unfinished area keeps Session from emitting game-won on an empty
      // batch, so the assertion isolates the missing verb-handler event.
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
    const bus = new RecordingBus();
    const dependencies = makeGameDependencies({
      initialState: state,
      bus,
      bundle: mechanicsBundle([verbHazard]),
    });

    expect('check' in dependencies).toBe(false);
    expect('dispatch' in dependencies).toBe(false);
    expect('react' in dependencies).toBe(false);

    const game = createGame(dependencies);
    const batch = game.submit('look');

    expect(batch.length).toBeGreaterThan(0);
    expect(
      batch.some(
        (event) => event.type === 'room-entered' || event.type === 'message',
      ),
    ).toBe(true);
    expect(
      batch.some(
        (event) =>
          event.type === 'hazard-triggered' &&
          event.hazardId === 'hazard-on-look',
      ),
    ).toBe(true);
    expect(state.turn).toBe(5);
    expect(bus.batches.at(-1)).toEqual(batch);
    expect(bus.batches).toHaveLength(1);
  });

  it('UI-BOOT-18: production reaction reuses one composed system across both passes so a repeatable hazard fires once', () => {
    // Canonical contracts: shared-rules.md §2 (one extra reaction pass, each
    // rule ID fires at most once per turn) and §11(4) (silent cascade skip);
    // hazards.md §3 step 5 (one bookkeeping record per fire); storage-schema.md
    // §4 (turns-since:<puzzleId> advances once per later phase-4 turn).
    // No phase seam is injected: Game must build the production reaction
    // itself, and the two allowed passes must share its per-instance guards.
    const repeatable = hazard({
      id: 'hazard-repeatable',
      trigger: { kind: 'on-turn' },
      effects: [{ kind: 'set-flag', flag: 'hazard-fired', value: true }],
    });
    const timedPuzzle = puzzle({
      id: 'puzzle-timed',
      requirements: [
        { kind: 'flag-set', flag: 'hazard-fired' },
        { kind: 'flag-set', flag: 'never-set' },
      ],
    });
    const state = mechanicsState({
      puzzles: { 'puzzle-timed': { phase: 'unsolved' } },
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
    const bus = new RecordingBus();
    const dependencies = makeGameDependencies({
      initialState: state,
      bus,
      bundle: mechanicsBundle([repeatable], [timedPuzzle]),
    });

    expect('react' in dependencies).toBe(false);
    expect('dispatch' in dependencies).toBe(false);
    expect('check' in dependencies).toBe(false);
    expect('score' in dependencies).toBe(false);
    expect('session' in dependencies).toBe(false);
    expect('apply' in dependencies).toBe(false);

    const game = createGame(dependencies);
    const batch = game.submit('look');

    expect(state.turn).toBe(5);
    expect(
      batch.filter((event) => event.type === 'hazard-triggered'),
    ).toHaveLength(1);
    expect(state.hazards['hazard-repeatable']).toEqual({
      timesFired: 1,
      lastFiredTurn: 5,
    });
    expect(state.counters['turns-since:puzzle-timed']).toBe(0);
  });
});
