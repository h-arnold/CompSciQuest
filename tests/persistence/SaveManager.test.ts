// Red tests for the persistence slice, matrix IDs S-PERSIST-01..29 (except the
// UI/browser rows 22/26/27 and the separate download/type/restore files).
import { describe, expect, it } from 'vitest';
import {
  FIXED_ISO,
  IMPORTED_ISO,
  FakeRandom,
  FixedClock,
  MemoryStorage,
  QUARANTINE_KEY,
  SAVE_KEY,
  SEED,
  asRuntime,
  envelopeText,
  importModule,
  loadEffectApplier,
  loadGame,
  loadInitialState,
  loadSaveManager,
  loadSession,
  makeBundle,
  makeEnvelope,
  makeGameDependencies,
  makeRuntimeState,
  makeStateDto,
  roundTripThroughJson,
} from '../fixtures/persistence';
import {
  CHEST_ID,
  KEY_A,
  START_ROOM,
  makeParserBundle,
} from '../fixtures/parser';
import type { SaveDto } from '../../src/application/SaveDto';

function managerDependencies(
  storage = new MemoryStorage(),
  bundle = makeBundle(),
) {
  return { storage, clock: new FixedClock(), bundle };
}

describe('SaveManager persistence contracts', () => {
  it('S-PERSIST-01: save envelope carries version 1, injected clock timestamp and state', async () => {
    const state = makeStateDto();
    const manager = await loadSaveManager(managerDependencies());

    const dto = manager.buildDto(state);

    expect(dto.version).toBe(1);
    expect(dto.savedAt).toBe(FIXED_ISO);
    expect(dto.state).toEqual(state);
  });

  it('S-PERSIST-02: buildDto adds version and savedAt to the DTO and JSON.stringify yields the stored text', async () => {
    const state = makeStateDto();
    const manager = await loadSaveManager(managerDependencies());

    const dto = manager.buildDto(state);
    const text = JSON.stringify(dto);

    expect(JSON.parse(text)).toEqual({
      version: 1,
      savedAt: FIXED_ISO,
      state,
    });
    expect(dto.state).toEqual(state);
  });

  it('S-PERSIST-03: save writes the serialised envelope to the live save key through StorageAdapter.write', async () => {
    const storage = new MemoryStorage();
    const manager = await loadSaveManager(managerDependencies(storage));
    const state = makeStateDto();

    manager.save(state);

    expect(storage.writes).toHaveLength(1);
    expect(storage.writes[0]?.key).toBe(SAVE_KEY);
    expect(storage.writes[0]?.json).toBe(
      JSON.stringify(manager.buildDto(state)),
    );
  });

  it('S-PERSIST-04: round-trip GameState to DTO to JSON and back preserves every field', async () => {
    const original = makeStateDto();
    const manager = await loadSaveManager(managerDependencies());

    const json = roundTripThroughJson(manager.buildDto(original));
    const restored = asRuntime(manager.restore(json));

    expect(restored.toDto()).toEqual(original);
  });

  it('S-PERSIST-05: score is absent from JSON and derived from progress on restore', async () => {
    const state = makeStateDto({
      progress: [
        {
          worldId: 'world-stub',
          areaId: 'area-stub',
          visitedRooms: ['room-stub-start'],
          completedTopics: [],
          earnedScore: 3,
          maxScore: 10,
        },
        {
          worldId: 'world-stub',
          areaId: 'area-stub-2',
          visitedRooms: [],
          completedTopics: [],
          earnedScore: 4,
          maxScore: 6,
        },
      ],
    });
    const manager = await loadSaveManager(managerDependencies());

    const text = JSON.stringify(manager.buildDto(state));
    const parsed = JSON.parse(text) as Record<string, unknown>;
    const reparsedText = JSON.stringify(parsed);
    const reparsed = JSON.parse(reparsedText) as SaveDto;

    expect(parsed).not.toHaveProperty('score');
    expect(parsed['state']).not.toHaveProperty('score');
    expect(manager.restore(reparsed).score).toBe(7);
  });

  it('S-PERSIST-06: item ownership is exclusive, transfer-item updates both lists and duplicate ownership is rejected', async () => {
    const storage = new MemoryStorage();
    const manager = await loadSaveManager(managerDependencies(storage));
    const runtime = makeRuntimeState(makeStateDto());
    const applier = await loadEffectApplier(runtime, {
      random: new FakeRandom(),
    });

    const events = applier.apply({
      kind: 'transfer-item',
      itemId: 'lamp',
      fromOwnerId: 'player',
      toOwnerId: 'room-stub-north',
    });

    expect(events.some((event) => event.type === 'item-moved')).toBe(true);
    expect(runtime.player.inventory).not.toContain('lamp');
    expect(runtime.rooms['room-stub-north']?.inventory).toContain('lamp');
    const position = makeStateDto().player.position;
    const transferred = makeStateDto({
      player: { position, inventory: [], lives: 3 },
      rooms: {
        'room-stub-start': { inventory: [] },
        'room-stub-north': { inventory: ['lamp'] },
      },
    });
    const transferredResult = manager.validate(envelopeText(transferred));

    expect(transferredResult.ok).toBe(true);

    const duplicate = makeStateDto({
      rooms: {
        'room-stub-start': { inventory: ['lamp'] },
        'room-stub-north': { inventory: [] },
      },
    });

    expect(manager.validate(envelopeText(duplicate))).toEqual({
      ok: false,
      reason: 'invalid-content',
    });
    expect(storage.snapshot()).toEqual({});
  });

  it('S-PERSIST-07: duplicate progress for the same area is rejected as invalid-content', async () => {
    const storage = new MemoryStorage({ [SAVE_KEY]: '{"valid":true}' });
    const manager = await loadSaveManager(managerDependencies(storage));
    const state = makeStateDto({
      progress: [
        {
          worldId: 'world-stub',
          areaId: 'area-stub',
          visitedRooms: [],
          completedTopics: [],
          earnedScore: 1,
          maxScore: 10,
        },
        {
          worldId: 'world-stub',
          areaId: 'area-stub',
          visitedRooms: [],
          completedTopics: [],
          earnedScore: 2,
          maxScore: 10,
        },
      ],
    });
    const before = storage.snapshot();

    expect(manager.validate(envelopeText(state))).toEqual({
      ok: false,
      reason: 'invalid-content',
    });
    expect(storage.snapshot()).toEqual(before);
  });

  it('S-PERSIST-08: an unsigned 32-bit rngSeed round-trips exactly through save and load', async () => {
    const storage = new MemoryStorage();
    const manager = await loadSaveManager(managerDependencies(storage));

    manager.save(makeStateDto({ rngSeed: SEED }));

    expect(manager.load()).toMatchObject({
      ok: true,
      dto: { state: { rngSeed: SEED } },
    });
  });

  it('S-PERSIST-09: import preserves the file savedAt rather than restamping from the Clock', async () => {
    const storage = new MemoryStorage();
    const saveManager = await loadSaveManager(managerDependencies(storage));
    const game = await loadGame(makeGameDependencies({ storage, saveManager }));
    const text = JSON.stringify(makeEnvelope(makeStateDto(), IMPORTED_ISO));

    const result = game.importSave(text);

    expect(result).toMatchObject({
      ok: true,
      dto: { version: 1, savedAt: IMPORTED_ISO },
    });
    expect(storage.snapshot()).toEqual({});
  });

  it('S-PERSIST-13: malformed JSON reports invalid-json and leaves the live save untouched', async () => {
    const live = envelopeText(makeStateDto());
    const storage = new MemoryStorage({ [SAVE_KEY]: live });
    const saveManager = await loadSaveManager(managerDependencies(storage));
    const game = await loadGame(makeGameDependencies({ storage, saveManager }));

    const result = game.importSave('{ this is not json');

    expect(result).toEqual({ ok: false, reason: 'invalid-json' });
    expect(storage.snapshot()).toEqual({ [SAVE_KEY]: live });
  });

  it('S-PERSIST-14: lower versions yield wrong-version and higher versions yield newer-version', async () => {
    const storage = new MemoryStorage();
    const manager = await loadSaveManager(managerDependencies(storage));
    const lower = JSON.stringify({ ...makeEnvelope(), version: 0 });
    const higher = JSON.stringify({ ...makeEnvelope(), version: 2 });

    expect(manager.validate(lower)).toEqual({
      ok: false,
      reason: 'wrong-version',
    });
    expect(manager.validate(higher)).toEqual({
      ok: false,
      reason: 'newer-version',
    });
    expect(storage.snapshot()).toEqual({});
  });

  it('S-PERSIST-15: missing or wrongly typed required keys yield invalid-shape while extra keys are ignored', async () => {
    const storage = new MemoryStorage();
    const manager = await loadSaveManager(managerDependencies(storage));
    const player = { ...makeStateDto().player } as Record<string, unknown>;
    delete player['lives'];

    const missingKey = envelopeText({ ...makeStateDto(), player });
    const wrongType = envelopeText({ ...makeStateDto(), turn: 'four' });
    const extraKeys = envelopeText({
      ...makeStateDto(),
      futureField: 'ignored',
    });

    expect(manager.validate(missingKey)).toEqual({
      ok: false,
      reason: 'invalid-shape',
    });
    expect(manager.validate(wrongType)).toEqual({
      ok: false,
      reason: 'invalid-shape',
    });
    expect(manager.validate(extraKeys).ok).toBe(true);
    expect(storage.snapshot()).toEqual({});
  });

  it('S-PERSIST-16: references to absent room, item, actor, quiz or topic IDs yield invalid-content with no partial state', async () => {
    const manager = await loadSaveManager(
      managerDependencies(
        new MemoryStorage(),
        makeBundle({ emptyContent: true }),
      ),
    );

    const result = manager.validate(envelopeText(makeStateDto()));

    expect(result).toEqual({ ok: false, reason: 'invalid-content' });
    expect(result).not.toHaveProperty('dto');
  });

  it('S-PERSIST-19: boot quarantine stores raw text, reason and clock timestamp for an invalid live save', async () => {
    const raw = '{ corrupt live save';
    const storage = new MemoryStorage({ [SAVE_KEY]: raw });
    const manager = await loadSaveManager(managerDependencies(storage));

    const result = manager.load();

    expect(result).toEqual({ ok: false, reason: 'invalid-json' });
    expect(JSON.parse(storage.read(QUARANTINE_KEY) ?? 'null')).toEqual({
      quarantinedAt: FIXED_ISO,
      reason: 'invalid-json',
      raw,
    });
  });

  it('S-PERSIST-20: boot twice never overwrites the single quarantine slot', async () => {
    const storage = new MemoryStorage({ [SAVE_KEY]: '{ first bad save' });
    const manager = await loadSaveManager(managerDependencies(storage));

    expect(manager.load().ok).toBe(false);
    const first = storage.read(QUARANTINE_KEY);
    storage.write(SAVE_KEY, '{ second bad save');

    expect(manager.load().ok).toBe(false);
    expect(storage.read(QUARANTINE_KEY)).toBe(first);
    expect(
      Object.keys(storage.snapshot()).filter((key) => key === QUARANTINE_KEY),
    ).toHaveLength(1);
  });

  it('S-PERSIST-21: a failed import leaves an existing live save and quarantine untouched', async () => {
    const live = envelopeText(makeStateDto());
    const quarantine = JSON.stringify({
      quarantinedAt: FIXED_ISO,
      reason: 'invalid-json',
      raw: '{ old bad save',
    });
    const storage = new MemoryStorage({
      [SAVE_KEY]: live,
      [QUARANTINE_KEY]: quarantine,
    });
    const saveManager = await loadSaveManager(managerDependencies(storage));
    const game = await loadGame(makeGameDependencies({ storage, saveManager }));
    const before = storage.snapshot();

    const result = game.importSave('{ new bad save');

    expect(result).toEqual({ ok: false, reason: 'invalid-json' });
    expect(storage.snapshot()).toEqual(before);
  });

  it('S-PERSIST-23: StorageAdapter exposes read/write/remove and unit fakes need no real storage or clock', async () => {
    const storage = new MemoryStorage();
    expect(storage.read).toBeTypeOf('function');
    expect(storage.write).toBeTypeOf('function');
    expect(storage.remove).toBeTypeOf('function');

    storage.write('probe', 'value');
    expect(storage.read('probe')).toBe('value');
    storage.remove('probe');
    expect(storage.read('probe')).toBeNull();

    expect(new FixedClock().now()).toBe(FIXED_ISO);
    expect(new FakeRandom().nextInt(10)).toBe(0);

    let module: Record<string, unknown>;
    try {
      module = await importModule('../../src/storage/BrowserStorage');
    } catch {
      throw new Error(
        'BrowserStorage must implement StorageAdapter from src/storage/BrowserStorage.ts (storage-schema.md §10)',
      );
    }
    expect(
      module['BrowserStorage'],
      'BrowserStorage must implement StorageAdapter (storage-schema.md §10)',
    ).toBeDefined();
  });

  it('S-PERSIST-24: validation runs parse, version, shape then content references in order', async () => {
    const manager = await loadSaveManager(managerDependencies());

    expect(manager.validate('{')).toEqual({
      ok: false,
      reason: 'invalid-json',
    });
    const newerVersion = JSON.stringify({ ...makeEnvelope(), version: 2 });
    const wrongType = envelopeText({ ...makeStateDto(), turn: 'four' });
    const missingContent = envelopeText(
      makeStateDto({ flags: { 'door-open:missing-door': true } }),
    );

    expect(manager.validate(newerVersion)).toEqual({
      ok: false,
      reason: 'newer-version',
    });
    expect(manager.validate(wrongType)).toEqual({
      ok: false,
      reason: 'invalid-shape',
    });
    expect(manager.validate(missingContent)).toEqual({
      ok: false,
      reason: 'invalid-content',
    });
  });

  it('S-PERSIST-25: unknown versions are rejected without migration or a partial DTO', async () => {
    const storage = new MemoryStorage();
    const manager = await loadSaveManager(managerDependencies(storage));

    const newVersion = JSON.stringify({ ...makeEnvelope(), version: 99 });
    const oldVersion = JSON.stringify({ ...makeEnvelope(), version: 0 });
    const tooNew = manager.validate(newVersion);
    const tooOld = manager.validate(oldVersion);

    expect(tooNew).toEqual({ ok: false, reason: 'newer-version' });
    expect(tooOld).toEqual({ ok: false, reason: 'wrong-version' });
    expect(tooNew).not.toHaveProperty('dto');
    expect(storage.snapshot()).toEqual({});
  });

  it('S-PERSIST-28: a room absent from rooms has an empty inventory and no entry is created lazily', async () => {
    const state = makeStateDto({
      rooms: { 'room-stub-start': { inventory: [] } },
    });
    const manager = await loadSaveManager(managerDependencies());

    expect(manager.validate(envelopeText(state)).ok).toBe(true);
    const restored = asRuntime(manager.restore(makeEnvelope(state)));

    expect(restored.rooms['room-stub-north']?.inventory ?? []).toEqual([]);
    expect(restored.toDto().rooms['room-stub-north']).toBeUndefined();
  });

  it('S-PERSIST-29: empty or zero progress derives a zero score in restore and view data', async () => {
    const manager = await loadSaveManager(managerDependencies());
    const zeroProgress = [
      {
        worldId: 'world-stub',
        areaId: 'area-stub',
        visitedRooms: [],
        completedTopics: [],
        earnedScore: 0,
        maxScore: 10,
      },
    ];

    const emptyEnvelope = makeEnvelope(makeStateDto({ progress: [] }));
    const zeroEnvelope = makeEnvelope(makeStateDto({ progress: zeroProgress }));

    const emptyState = manager.restore(emptyEnvelope);
    const zeroState = manager.restore(zeroEnvelope);

    expect(emptyState.score).toBe(0);
    expect(zeroState.score).toBe(0);

    const game = await loadGame(
      makeGameDependencies({ saveManager: manager, initialState: emptyState }),
    );

    expect(game.getViewData().score).toBe(0);

    const scoredProgress = [
      {
        worldId: 'world-stub',
        areaId: 'area-stub',
        visitedRooms: ['room-stub-start'],
        completedTopics: [],
        earnedScore: 3,
        maxScore: 10,
      },
      {
        worldId: 'world-stub',
        areaId: 'area-stub-2',
        visitedRooms: [],
        completedTopics: [],
        earnedScore: 4,
        maxScore: 6,
      },
    ];
    const scoredState = makeRuntimeState(
      makeStateDto({ progress: scoredProgress }),
    );
    const scoredGame = await loadGame(
      makeGameDependencies({ saveManager: manager, initialState: scoredState }),
    );

    expect(scoredGame.getViewData().score).toBe(7);
  });

  it('S-PERSIST-31: lives persist at 1, then reaching 0 sets lost and emits game-over', async () => {
    const storage = new MemoryStorage();
    const manager = await loadSaveManager(managerDependencies(storage));
    const runtime = makeRuntimeState(makeStateDto());
    const applier = await loadEffectApplier(runtime, {
      random: new FakeRandom(),
    });

    const first = applier.apply({
      kind: 'change-lives',
      delta: -2,
      reason: 'test hazard',
    });
    expect(first.some((event) => event.type === 'lives-changed')).toBe(true);
    expect(runtime.player.lives).toBe(1);
    expect(runtime.status).toBe('playing');

    const second = applier.apply({
      kind: 'change-lives',
      delta: -1,
      reason: 'test hazard',
    });
    expect(runtime.player.lives).toBe(0);

    const session = await loadSession(runtime, makeBundle());
    const emitted = session.observe(second);

    expect(runtime.status).toBe('lost');
    expect(emitted.some((event) => event.type === 'game-over')).toBe(true);

    manager.save(runtime);
    expect(manager.load()).toMatchObject({
      ok: true,
      dto: { state: { player: { lives: 0 }, status: 'lost' } },
    });
  });

  it('S-GAP-01: createInitial sets turn to zero', async () => {
    const initial = await loadInitialState();

    expect(initial.turn).toBe(0);

    const game = await loadGame(makeGameDependencies());

    expect(game.getViewData().turn).toBe(0);
  });

  it('S-PERSIST-30: one submitted game command increments turn from 0 to 1 even when it fails', async () => {
    const initial = await loadInitialState();
    const game = await loadGame(
      makeGameDependencies({ initialState: initial }),
    );

    expect(game.getViewData().turn).toBe(0);
    game.submit('examine nowhere');
    expect(game.getViewData().turn).toBe(1);
  });

  it('WR4-B1: a save with fixture-held item contents loads without quarantine', async () => {
    const storage = new MemoryStorage();
    const manager = await loadSaveManager(
      managerDependencies(storage, makeParserBundle()),
    );
    const position = {
      worldId: 'world-stub',
      areaId: 'area-stub',
      roomId: START_ROOM,
    };

    // Control: an ordinary room-only save still loads and never quarantines.
    manager.save(
      makeStateDto({
        player: { position, inventory: [KEY_A], lives: 3 },
        rooms: { [START_ROOM]: { inventory: [] } },
      }),
    );
    expect(manager.load()).toMatchObject({ ok: true });
    expect(storage.read(QUARANTINE_KEY)).toBeNull();

    // A placed item is owned by the visible fixture: transfer-item writes the
    // item into a state.rooms entry keyed by that fixture's item ID.
    manager.save(
      makeStateDto({
        player: { position, inventory: [], lives: 3 },
        rooms: {
          [START_ROOM]: { inventory: [CHEST_ID] },
          [CHEST_ID]: { inventory: [KEY_A] },
        },
      }),
    );

    const result = manager.load();

    expect(storage.read(QUARANTINE_KEY)).toBeNull();
    expect(result).toMatchObject({ ok: true });
  });
});
