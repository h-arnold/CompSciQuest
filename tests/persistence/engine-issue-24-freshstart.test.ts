// ENG24-FRESHSTART-01: fresh starts are persisted immediately
// (ENGINE_ISSUES.md decision row 24 L54; PLAYTEST_ISSUES.md §24 L253-258;
// application-and-ui.md §4 L206-235 and §4.1 L237-265; storage-schema.md §9,
// §10 and §11). Every collaborator is an in-memory fake: no real storage,
// clock, random source, network or DOM. The pre-existing save state is turn 4
// with a non-playing status, so the fresh turn-0 write is observable.
import { describe, expect, it } from 'vitest';
import type { Game } from '../../src/application/Game';
import type { SaveDto } from '../../src/application/SaveDto';
import type { SaveManager } from '../../src/application/SaveManager';
import type { GameState, GameStateDto } from '../../src/core/GameState';
import type { SessionStatus } from '../../src/core/SessionStatus';
import {
  FIXED_ISO,
  loadSaveManager,
  makeBundle,
  makeRuntimeState,
  makeStateDto,
  MemoryStorage,
  QUARANTINE_KEY,
  SAVE_KEY,
} from '../fixtures/persistence';
import {
  loadGameWithPhases,
  makeTurnDependencies,
  MemoryBus,
  phaseFakes,
  type TurnGameDependencies,
} from '../fixtures/turn';

const START_ROOM_ID = 'room-stub-start';

interface SaveSnapshot {
  readonly dto: GameStateDto;
  readonly trace: readonly string[];
}

// Records the DTO handed to the canonical SaveManager, then delegates so the
// StorageAdapter write is real (the pattern in engine-issue-24-autosave.test.ts).
class RecordingSaveManager implements SaveManager {
  private readonly inner: SaveManager;
  private readonly trace: readonly string[];
  readonly snapshots: SaveSnapshot[] = [];

  constructor(inner: SaveManager, trace: readonly string[]) {
    this.inner = inner;
    this.trace = trace;
  }

  buildDto(state: GameStateDto): SaveDto {
    return this.inner.buildDto(state);
  }

  save(state: GameStateDto): void {
    this.snapshots.push({
      dto: structuredClone(state),
      trace: [...this.trace],
    });
    this.inner.save(state);
  }

  load(): ReturnType<SaveManager['load']> {
    return this.inner.load();
  }

  validate(text: string): ReturnType<SaveManager['validate']> {
    return this.inner.validate(text);
  }

  restore(dto: SaveDto): ReturnType<SaveManager['restore']> {
    return this.inner.restore(dto);
  }
}

interface Setup {
  readonly game: Game;
  readonly state: GameState;
  readonly storage: MemoryStorage;
  readonly recorder: RecordingSaveManager;
  readonly bus: MemoryBus;
  readonly calls: string[];
}

async function makeSetup(status: SessionStatus): Promise<Setup> {
  const calls: string[] = [];
  const storage = new MemoryStorage();
  const clock = { now: () => FIXED_ISO };
  const bundle = makeBundle();
  const inner = await loadSaveManager({ storage, clock, bundle });
  const recorder = new RecordingSaveManager(inner, calls);
  const state = makeRuntimeState(makeStateDto({ turn: 4, status }));
  const bus = new MemoryBus(calls);
  const dependencies: TurnGameDependencies = makeTurnDependencies(calls, {
    ...phaseFakes(calls),
    initialState: state,
    saveManager: recorder,
    storage,
    clock,
    bundle,
    bus,
    downloadFile(): void {
      // Downloads are not part of this contract.
    },
  });
  const game = await loadGameWithPhases(dependencies);
  return { game, state, storage, recorder, bus, calls };
}

function expectFreshLiveSave(setup: Setup): void {
  // The dirty state is turn 4; the fresh state written to storage is turn 0.
  expect(setup.state.turn).toBe(4);
  expect(setup.recorder.snapshots).toHaveLength(1);
  const saved = setup.recorder.snapshots[0]?.dto;
  expect(saved?.turn).toBe(0);
  expect(saved?.status).toBe('playing');
  expect(saved?.player.position.roomId).toBe(START_ROOM_ID);
  expect(saved?.player.lives).toBe(3);

  expect(setup.storage.writes).toHaveLength(1);
  expect(setup.storage.writes[0]?.key).toBe(SAVE_KEY);
  expect(setup.storage.writes.every((write) => write.key === SAVE_KEY)).toBe(
    true,
  );
  expect(setup.storage.read(QUARANTINE_KEY)).toBeNull();
  expect(setup.storage.removals).toEqual([]);

  // Initial-batch and session-reset behaviour is unchanged.
  expect(setup.calls.filter((call) => call === 'session-new-game')).toEqual([
    'session-new-game',
  ]);
  expect(setup.bus.batches.flat()).toContainEqual(
    expect.objectContaining({
      type: 'room-entered',
      room: expect.objectContaining({ id: START_ROOM_ID }),
    }),
  );
  expect(
    setup.bus.batches.flat().filter((event) => event.type === 'message'),
  ).toEqual([]);
}

function expectReloadStartsNewGame(setup: Setup): void {
  const raw = setup.storage.read(SAVE_KEY);
  expect(raw).not.toBeNull();
  const envelope = JSON.parse(raw ?? '') as SaveDto;
  expect(envelope.version).toBe(1);
  expect(envelope.savedAt).toBe(FIXED_ISO);
  expect(envelope.state.turn).toBe(0);

  setup.game.continueGame(envelope);
  expect(setup.game.getViewData().turn).toBe(0);
  expect(setup.game.getViewData().position.roomId).toBe(START_ROOM_ID);
  // continueGame is not itself a write.
  expect(setup.recorder.snapshots).toHaveLength(1);
}

describe('ENG24-FRESHSTART-01: fresh starts write the live save (application-and-ui.md §4)', () => {
  it('ENG24-FRESHSTART-01: Game.newGame() saves the freshly created state', async () => {
    const setup = await makeSetup('playing');

    setup.game.newGame();

    expectFreshLiveSave(setup);
    expectReloadStartsNewGame(setup);
  });

  it('ENG24-FRESHSTART-01: Game.restart() saves the freshly created state from a won session', async () => {
    const setup = await makeSetup('won');

    setup.game.restart();

    expectFreshLiveSave(setup);
    expectReloadStartsNewGame(setup);
  });

  it('ENG24-FRESHSTART-01: typed restart saves the freshly created state from a lost session', async () => {
    const setup = await makeSetup('lost');

    const batch = setup.game.submit('restart');

    expect(batch).toContainEqual(
      expect.objectContaining({
        type: 'room-entered',
        room: expect.objectContaining({ id: START_ROOM_ID }),
      }),
    );
    expectFreshLiveSave(setup);
    expectReloadStartsNewGame(setup);
  });
});
