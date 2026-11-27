// ENG24-AUTOSAVE-01 — autosave after an accepted core command.
// Contract: ENGINE_ISSUES.md #24 (line 54); application-and-ui.md §4;
// storage-schema.md §9/§10/§11/§12; shared-rules.md §2. Every collaborator is
// an injected in-memory fake; no real storage, clock, random source or DOM.
import { describe, expect, it } from 'vitest';
import type { Game } from '../../src/application/Game';
import type { Random } from '../../src/core/Random';
import type { GameState, GameStateDto } from '../../src/core/GameState';
import type { Session } from '../../src/core/lifecycle/Session';
import type { ScoreTracker } from '../../src/core/scoring/ScoreTracker';
import type { SessionStatus } from '../../src/core/SessionStatus';
import type { SaveDto } from '../../src/application/SaveDto';
import type { SaveManager } from '../../src/application/SaveManager';
import type { GameEvent } from '../../src/core/events/GameEvent';
import {
  FIXED_ISO,
  loadSaveManager,
  makeBundle,
  makeRuntimeState,
  makeStateDto,
  MemoryStorage,
  QUARANTINE_KEY,
  SAVE_KEY,
  SEED,
} from '../fixtures/persistence';
import {
  loadGameWithPhases,
  makeTurnDependencies,
  MemoryBus,
  phaseFakes,
  type TurnGameDependencies,
} from '../fixtures/turn';
import type { DownloadCall } from '../fixtures/uiSetup';

// A seed that differs from the DTO's initial seed makes recordSeed observable:
// saveGame() must run before the write, so the written DTO carries this value.
const ROTATED_SEED = 987_654_321;

class FixedSeedRandom implements Random {
  readonly seed = ROTATED_SEED;

  nextInt(): number {
    return 0;
  }
}

interface SaveSnapshot {
  readonly dto: GameStateDto;
  // The trace at the moment of the write proves observer ordering.
  readonly trace: readonly string[];
}

// Snapshot the DTO fields at write time through JSON, matching the storage
// contract without depending on a private conversion method.
function snapshotDto(state: GameStateDto): GameStateDto {
  return structuredClone(state);
}

// Records the exact DTO handed to the canonical SaveManager at write time and
// delegates to the real SaveManager, so storage effects are genuine.
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
      dto: snapshotDto(state),
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

function makeState(options: {
  readonly turn?: number;
  readonly status?: SessionStatus;
}): GameState {
  return makeRuntimeState(
    makeStateDto({
      turn: options.turn ?? 0,
      status: options.status ?? 'playing',
    }),
  );
}

interface Setup {
  readonly game: Game;
  readonly state: GameState;
  readonly storage: MemoryStorage;
  readonly recorder: RecordingSaveManager;
  readonly bus: MemoryBus;
  readonly calls: string[];
  readonly downloads: DownloadCall[];
}

async function makeSetup(
  options: {
    readonly state?: GameState;
    readonly storageEntries?: Readonly<Record<string, string>>;
    readonly score?: ScoreTracker;
    readonly session?: Session;
    readonly calls?: string[];
  } = {},
): Promise<Setup> {
  const calls = options.calls ?? [];
  const storage = new MemoryStorage(options.storageEntries ?? {});
  const clock = { now: () => FIXED_ISO };
  const bundle = makeBundle();
  const inner = await loadSaveManager({ storage, clock, bundle });
  const recorder = new RecordingSaveManager(inner, calls);
  const state = options.state ?? makeState({});
  const bus = new MemoryBus(calls);
  const downloads: DownloadCall[] = [];
  const dependencies: TurnGameDependencies = makeTurnDependencies(calls, {
    ...phaseFakes(calls),
    ...(options.score && { score: options.score }),
    ...(options.session && { session: options.session }),
    initialState: state,
    saveManager: recorder,
    storage,
    clock,
    bundle,
    random: new FixedSeedRandom(),
    bus,
    downloadFile(filename: string, text: string): void {
      downloads.push({ filename, text });
    },
  });
  const game = await loadGameWithPhases(dependencies);
  return { game, state, storage, recorder, bus, calls, downloads };
}

describe('ENG24-AUTOSAVE-01 — autosave after a successful command (ENGINE_ISSUES.md #24; storage-schema.md §11)', () => {
  it('ENG24-AUTOSAVE-01: the first accepted command rewrites the live save with the incremented turn and a recorded seed', async () => {
    const setup = await makeSetup();

    const batch = setup.game.submit('look around');

    expect(batch.length).toBeGreaterThan(0);
    expect(setup.recorder.snapshots).toHaveLength(1);
    const saved = setup.recorder.snapshots[0];
    expect(saved?.dto.turn).toBe(1);
    // recordSeed() runs before saveManager.save(), not after it.
    expect(saved?.dto.rngSeed).toBe(ROTATED_SEED);
    expect(saved?.dto.rngSeed).not.toBe(SEED);

    const writes = setup.storage.writes.filter(
      (write) => write.key === SAVE_KEY,
    );
    expect(writes).toHaveLength(1);
    const envelope = JSON.parse(writes[0]?.json ?? '') as SaveDto;
    expect(envelope.version).toBe(1);
    expect(envelope.savedAt).toBe(FIXED_ISO);
    expect(envelope.state.turn).toBe(1);
    expect(envelope.state.rngSeed).toBe(ROTATED_SEED);
    // §12: the derived score is never persisted.
    expect(JSON.stringify(envelope)).not.toContain('"score"');
  });

  it('ENG24-AUTOSAVE-01: the autosave captures the final post-observer state, not the pre-observer state', async () => {
    const state = makeState({});
    const calls: string[] = [];
    const score: ScoreTracker = {
      observe(events: readonly GameEvent[]): readonly GameEvent[] {
        calls.push('observe-score');
        const entry = state.progress[0];
        if (entry) Object.assign(entry, { earnedScore: 9 });
        return events;
      },
      getTotal(): number {
        return state.score;
      },
    };
    const session: Session = {
      observe(events: readonly GameEvent[]): readonly GameEvent[] {
        calls.push('observe-session');
        Object.assign(state, { status: 'won' });
        return events;
      },
      newGame(): void {
        calls.push('session-new-game');
      },
    };
    const setup = await makeSetup({
      state,
      score,
      session,
      calls,
    });
    setup.game.submit('look around');

    expect(setup.recorder.snapshots).toHaveLength(1);
    const saved = setup.recorder.snapshots[0];
    expect(saved?.trace).toContain('observe-score');
    expect(saved?.trace).toContain('observe-session');
    expect(saved?.dto.progress[0]?.earnedScore).toBe(9);
    expect(saved?.dto.status).toBe('won');
    expect(calls).toContain('observe-score');
    expect(calls).toContain('observe-session');

    const stored = JSON.parse(setup.storage.read(SAVE_KEY) ?? '') as SaveDto;
    expect(stored.state.progress[0]?.earnedScore).toBe(9);
    expect(stored.state.status).toBe('won');
  });

  it('ENG24-AUTOSAVE-01: autosave writes only the live key and never clears or replaces quarantine', async () => {
    const quarantined = JSON.stringify({
      quarantinedAt: FIXED_ISO,
      reason: 'invalid-json',
      raw: 'earlier-invalid-save',
    });
    const setup = await makeSetup({
      storageEntries: {
        [QUARANTINE_KEY]: quarantined,
        [SAVE_KEY]: 'previous-live-save',
      },
    });

    setup.game.submit('look around');

    expect(setup.recorder.snapshots).toHaveLength(1);
    expect(setup.storage.read(QUARANTINE_KEY)).toBe(quarantined);
    expect(setup.storage.writes.every((write) => write.key === SAVE_KEY)).toBe(
      true,
    );
    expect(
      setup.storage.writes.some((write) => write.key === QUARANTINE_KEY),
    ).toBe(false);
    expect(setup.storage.removals).toEqual([]);
    expect(setup.storage.read(SAVE_KEY)).not.toBe('previous-live-save');
  });

  it('ENG24-REANCHOR-UNIT-01: typed download, load and import add no autosave, while Download still writes dated JSON and logs its inherited line', async () => {
    const setup = await makeSetup();

    for (const raw of ['download', 'load', 'import {}']) {
      setup.game.submit(raw);
    }

    expect(setup.recorder.snapshots).toHaveLength(0);
    expect(setup.storage.writes).toEqual([]);
    expect(setup.downloads).toHaveLength(1);
    expect(setup.downloads[0]?.filename).toBe(
      `compsciquest-save-${FIXED_ISO.replaceAll(/[:.]/gu, '-')}.json`,
    );
    const envelope = JSON.parse(setup.downloads[0]?.text ?? '') as SaveDto;
    expect(envelope.version).toBe(1);
    expect(envelope.state.turn).toBe(0);
    expect(
      setup.bus.batches
        .flat()
        .some(
          (event) =>
            event.type === 'message' && event.text === 'Save downloaded.',
        ),
    ).toBe(true);
  });

  it('ENG24-REANCHOR-UNIT-01: typed restart writes the live save with fresh state and turn 0', async () => {
    const setup = await makeSetup();

    setup.game.submit('restart');

    expect(setup.recorder.snapshots).toHaveLength(1);
    expect(setup.recorder.snapshots[0]?.dto.turn).toBe(0);
    const writes = setup.storage.writes.filter(
      (write) => write.key === SAVE_KEY,
    );
    expect(writes).toHaveLength(1);
    const envelope = JSON.parse(writes[0]?.json ?? '') as SaveDto;
    expect(envelope.version).toBe(1);
    expect(envelope.state.turn).toBe(0);
    expect(setup.storage.writes.every((write) => write.key === SAVE_KEY)).toBe(
      true,
    );
    expect(setup.storage.removals).toEqual([]);
  });

  it('ENG24-AUTOSAVE-01: explicit Save still logs Game saved. and writes the live save exactly once', async () => {
    const setup = await makeSetup();

    const batch = setup.game.submit('save');

    expect(batch).toContainEqual({
      type: 'message',
      text: 'Game saved.',
    });
    expect(setup.recorder.snapshots).toHaveLength(1);
    expect(
      setup.storage.writes.filter((write) => write.key === SAVE_KEY),
    ).toHaveLength(1);
  });

  it('ENG24-AUTOSAVE-01: a command rejected in an end state neither autosaves nor advances the turn', async () => {
    const state = makeState({ turn: 4, status: 'won' });
    const setup = await makeSetup({ state });

    const batch = setup.game.submit('take lamp');

    expect(batch).toEqual([
      { type: 'message', text: 'The adventure is over — start a new game.' },
    ]);
    expect(setup.recorder.snapshots).toHaveLength(0);
    expect(setup.storage.writes).toEqual([]);
    expect(setup.state.turn).toBe(4);
  });
});
