import { afterEach, describe, expect, it } from 'vitest';
import { createGame } from '../../src/application/Game';
import { createSaveManager } from '../../src/application/SaveManager';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { GameState } from '../../src/core/GameState';
import {
  createScoreTracker,
  type ScoreTracker,
} from '../../src/core/scoring/ScoreTracker';
import { ScorePanel } from '../../src/ui/ScorePanel';
import {
  catalogueOf,
  FakeRandom,
  FixedClock,
  makeBundle,
  makeGameDependencies,
  makeRuntimeState,
  makeStateDto,
  MemoryStorage,
  SAVE_KEY,
} from '../fixtures/persistence';
import { installFakeDocument, restoreDocument } from '../fixtures/ui';

const SCORED_ROOM = 'room-stub-start';
const SCORED_PUZZLE = 'puzzle-score-consistency';
const INITIAL_SCORE = 4;

function scoreBundle(): ContentBundle {
  const base = makeBundle();
  return {
    ...base,
    rooms: catalogueOf(
      base.rooms.all.map((room) =>
        room.id === SCORED_ROOM ? { ...room, score: 2 } : room,
      ),
    ),
    puzzles: catalogueOf([
      {
        id: SCORED_PUZZLE,
        requirements: [],
        onSolve: [],
        topicId: 'topic-1',
        score: 3,
        dependsOn: [],
      },
    ]),
    hazards: catalogueOf([
      {
        id: 'hazard-score-consistency-end',
        trigger: { kind: 'on-verb', verb: 'look' },
        when: { kind: 'all', of: [] },
        effects: [{ kind: 'change-lives', delta: -1, reason: 'test hazard' }],
        once: true,
      },
    ]),
  };
}

function scoreState(): GameState {
  return makeRuntimeState(
    makeStateDto({
      player: {
        position: {
          worldId: 'world-stub',
          areaId: 'area-stub',
          roomId: SCORED_ROOM,
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
          earnedScore: INITIAL_SCORE,
          maxScore: 10,
        },
      ],
    }),
  );
}

function roomEntered(bundle: ContentBundle): GameEvent {
  const room = bundle.rooms.getById(SCORED_ROOM);
  if (room === undefined)
    throw new Error(`Missing scored room ${SCORED_ROOM}.`);
  return {
    type: 'room-entered',
    room: {
      id: room.id,
      title: room.title,
      description: room.description,
      exits: room.exits.map((exit) => exit.direction),
    },
  };
}

function awardFixture(hasMultipleAwards: boolean): {
  readonly bundle: ContentBundle;
  readonly state: GameState;
  readonly tracker: ScoreTracker;
  readonly observed: readonly GameEvent[];
  readonly expectedTotal: number;
} {
  const bundle = scoreBundle();
  const state = scoreState();
  const tracker = createScoreTracker(state, { bundle });
  const events: GameEvent[] = [roomEntered(bundle)];
  if (hasMultipleAwards) {
    events.push({ type: 'puzzle-solved', puzzleId: SCORED_PUZZLE });
  }
  const observed = tracker.observe(events);
  return {
    bundle,
    state,
    tracker,
    observed,
    expectedTotal: hasMultipleAwards ? 9 : 6,
  };
}

function progressTotal(state: GameState): number {
  return state.progress.reduce((total, entry) => total + entry.earnedScore, 0);
}

afterEach(() => {
  restoreDocument();
});

describe('W7R-SCORE-01 real ScoreTracker totals', () => {
  it.each([
    { label: 'one real award', hasMultipleAwards: false },
    { label: 'multiple real awards', hasMultipleAwards: true },
  ] as const)(
    'W7R-SCORE-01: $label keep runtime, tracker, progress and announced totals equal',
    ({ hasMultipleAwards }) => {
      const { state, tracker, observed, expectedTotal } =
        awardFixture(hasMultipleAwards);

      expect({
        stateScore: state.score,
        trackerTotal: tracker.getTotal(),
        progressTotal: progressTotal(state),
        announcedTotals: observed
          .filter((event) => event.type === 'score-changed')
          .map((event) => event.total),
      }).toEqual({
        stateScore: expectedTotal,
        trackerTotal: expectedTotal,
        progressTotal: expectedTotal,
        announcedTotals: expectedTotal === 6 ? [6] : [9, 9],
      });
    },
  );

  it('W7R-SCORE-01: view data, ScorePanel and game-over use the same post-batch total', () => {
    installFakeDocument();
    const { bundle, state, tracker, observed, expectedTotal } =
      awardFixture(true);
    const game = createGame(
      makeGameDependencies({
        bundle,
        initialState: state,
        random: new FakeRandom(),
      }),
    );

    const batch = game.submit('look');
    const panel = new ScorePanel(game);
    panel.refresh();
    const gameOver = batch.find((event) => event.type === 'game-over');

    expect({
      stateScore: state.score,
      trackerTotal: tracker.getTotal(),
      progressTotal: progressTotal(state),
      announcedTotals: observed
        .filter((event) => event.type === 'score-changed')
        .map((event) => event.total),
      viewScore: game.getViewData().score,
      panelHeadline: panel.element.textContent.split('Lives:', 1)[0],
      finalScore: gameOver?.finalScore,
    }).toEqual({
      stateScore: expectedTotal,
      trackerTotal: expectedTotal,
      progressTotal: expectedTotal,
      announcedTotals: [9, 9],
      viewScore: expectedTotal,
      panelHeadline: `Score: ${expectedTotal}`,
      finalScore: expectedTotal,
    });
  });

  it.each([
    {
      label: 'a no-score batch',
      events: [{ type: 'message', text: 'No award.' }] as readonly GameEvent[],
      announcedTotals: [] as readonly number[],
    },
    {
      label: 'a zero-score batch',
      events: [
        {
          type: 'score-changed',
          delta: 0,
          total: 999,
          reason: 'zero award',
        },
      ] as readonly GameEvent[],
      announcedTotals: [INITIAL_SCORE],
    },
  ])(
    'W7R-SCORE-01: $label leaves every total and earned progress unchanged',
    ({ events, announcedTotals }) => {
      const bundle = scoreBundle();
      const state = scoreState();
      const tracker = createScoreTracker(state, { bundle });
      const before = JSON.stringify(state.progress);

      const observed = tracker.observe(events);

      expect(state.score).toBe(INITIAL_SCORE);
      expect(tracker.getTotal()).toBe(INITIAL_SCORE);
      expect(progressTotal(state)).toBe(INITIAL_SCORE);
      expect(JSON.stringify(state.progress)).toBe(before);
      expect(
        observed
          .filter((event) => event.type === 'score-changed')
          .map((event) => event.total),
      ).toEqual(announcedTotals);
    },
  );

  it('W7R-SCORE-01: save and restore derive the runtime score without persisting score', () => {
    const { bundle, state, expectedTotal } = awardFixture(true);
    const storage = new MemoryStorage();
    const saveManager = createSaveManager({
      bundle,
      storage,
      clock: new FixedClock(),
    });

    saveManager.save(state);
    const raw = storage.read(SAVE_KEY);
    expect(raw).not.toBeNull();
    const persisted: unknown = JSON.parse(String(raw));
    expect(persisted).not.toHaveProperty('state.score');
    const loaded = saveManager.load();
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) throw new Error('The scored save did not validate.');
    expect(loaded.dto.state).not.toHaveProperty('score');

    const restored = saveManager.restore(loaded.dto);

    expect(restored.score).toBe(expectedTotal);
    expect(createScoreTracker(restored, { bundle }).getTotal()).toBe(
      expectedTotal,
    );
  });
});
