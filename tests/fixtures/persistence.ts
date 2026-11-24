// Deterministic in-memory fixtures for the persistence red tests.
// No real localStorage, wall clock, Math.random, network or file system.
import { expect } from 'vitest';
import type { Clock } from '../../src/application/Clock';
import type { Game } from '../../src/application/Game';
import type { SaveDto } from '../../src/application/SaveDto';
import type { SaveManager } from '../../src/application/SaveManager';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { Catalogue } from '../../src/content/Catalogue';
import { stubBundle } from '../../src/content/stub/index';
import type { GameState, GameStateDto } from '../../src/core/GameState';
import type { Effect } from '../../src/core/effects/Effect';
import type { EventBus } from '../../src/core/events/EventBus';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { Session } from '../../src/core/lifecycle/Session';
import type { Random } from '../../src/core/Random';
import type { SpecTopic } from '../../src/core/scoring/SpecTopic';
import type { SpecTopicCatalogue } from '../../src/core/scoring/SpecTopicCatalogue';
import type { StorageAdapter } from '../../src/storage/StorageAdapter';

export const FIXED_ISO = '2026-11-24T12:06:00.000Z';
export const IMPORTED_ISO = '2026-11-20T09:30:00.000Z';
export const SAVE_KEY = 'compsciquest:save:v1';
export const QUARANTINE_KEY = 'compsciquest:save:v1:corrupt';
// Decimal form avoids a Prettier/unicorn hex-casing conflict; value is 0xDEADBEEF.
export const SEED = 3_735_928_559; // unsigned 32-bit, fits in a plain DTO number

// ---------------------------------------------------------------------------
// Injected fakes
// ---------------------------------------------------------------------------

// URLSearchParams is a deterministic in-memory string store whose `get`
// already returns `string | null`, matching the StorageAdapter port without a
// null literal and without touching real browser storage.
export class MemoryStorage implements StorageAdapter {
  private readonly entries = new URLSearchParams();
  readonly writes: Array<{ readonly key: string; readonly json: string }> = [];
  readonly removals: string[] = [];

  constructor(initial: Readonly<Record<string, string>> = {}) {
    for (const [key, value] of Object.entries(initial)) {
      this.entries.set(key, value);
    }
  }

  read(key: string): string | null {
    return this.entries.get(key);
  }

  write(key: string, json: string): void {
    this.entries.set(key, json);
    this.writes.push({ key, json });
  }

  remove(key: string): void {
    this.entries.delete(key);
    this.removals.push(key);
  }

  snapshot(): Readonly<Record<string, string>> {
    return Object.fromEntries(this.entries);
  }
}

export class FixedClock implements Clock {
  readonly iso: string;

  constructor(iso: string = FIXED_ISO) {
    this.iso = iso;
  }

  now(): string {
    return this.iso;
  }
}

export class FakeRandom implements Random {
  private index = 0;
  readonly values: readonly number[];

  constructor(values: readonly number[] = [0]) {
    this.values = values;
  }

  nextInt(maxExclusive: number): number {
    const value = this.values[this.index] ?? 0;
    this.index += 1;
    return value % maxExclusive;
  }
}

// Default collaborators do nothing; tests inject recorders when a call is
// under test.
function noop(): void {
  // Intentionally empty.
}

export class RecordingBus implements EventBus {
  readonly batches: Array<readonly GameEvent[]> = [];
  readonly events: GameEvent[] = [];
  readonly listeners: Array<(event: GameEvent) => void> = [];

  publish(events: readonly GameEvent[]): void {
    this.batches.push(events);
    this.events.push(...events);
  }

  subscribe(listener: (event: GameEvent) => void): () => void {
    this.listeners.push(listener);
    return noop;
  }
}

// ---------------------------------------------------------------------------
// Deterministic DTO / content fixtures
// ---------------------------------------------------------------------------

export function makeStateDto(
  overrides: Partial<GameStateDto> = {},
): GameStateDto {
  return {
    player: {
      position: {
        worldId: 'world-stub',
        areaId: 'area-stub',
        roomId: 'room-stub-start',
      },
      inventory: ['lamp'],
      lives: 3,
    },
    rooms: {
      'room-stub-start': { inventory: [] },
      'room-stub-north': { inventory: [] },
    },
    npcs: {},
    hazards: {},
    puzzles: {},
    hints: {},
    quiz: { questionIds: [], index: 0, correctCount: 0, answers: [] },
    quizAttempts: { 'quiz-1': 1 },
    flags: {},
    progress: [
      {
        worldId: 'world-stub',
        areaId: 'area-stub',
        visitedRooms: ['room-stub-start'],
        completedTopics: ['topic-1'],
        earnedScore: 3,
        maxScore: 10,
      },
    ],
    turn: 4,
    status: 'playing',
    schedule: [],
    rngSeed: SEED,
    counters: { 'hints-shown:h1': 1 },
    ...overrides,
  };
}

export function makeEnvelope(
  state: GameStateDto = makeStateDto(),
  savedAt: string = FIXED_ISO,
): SaveDto {
  return { version: 1, savedAt, state };
}

export function makeRuntimeState(
  dto: GameStateDto = makeStateDto(),
): GameState {
  return {
    ...dto,
    score: dto.progress.reduce((total, entry) => total + entry.earnedScore, 0),
  };
}

export function envelopeText(state: object): string {
  return JSON.stringify({ version: 1, savedAt: FIXED_ISO, state });
}

// The persistence contract is specifically a JSON round-trip, so the test
// helper names that intent instead of using structuredClone.
export function roundTripThroughJson<T>(value: T): T {
  const text = JSON.stringify(value);
  return JSON.parse(text) as T;
}

// Dynamic import by variable path keeps not-yet-implemented modules out of the
// static typecheck while still producing a deterministic red failure at runtime.
export async function importModule(
  path: string,
): Promise<Record<string, unknown>> {
  return (await import(/* @vite-ignore */ path)) as Record<string, unknown>;
}

export function catalogueOf<T extends { readonly id: string }>(
  all: readonly T[],
): Catalogue<T> {
  return {
    all,
    getById(id: string): T | undefined {
      return all.find((entry) => entry.id === id);
    },
  };
}

export interface TopicIndexEntry {
  readonly topic: SpecTopic;
  readonly worldId: string;
  readonly areaId: string;
}

export function makeTopic(
  overrides: Partial<SpecTopic> = {},
  worldId = 'world-stub',
  areaId = 'area-stub',
): TopicIndexEntry {
  return {
    topic: {
      id: 'topic-1',
      title: 'Stub topic',
      specReference: 'stub section',
      codeLocation: '',
      status: 'covered',
      evidence: 'stub evidence',
      roomIds: ['room-stub-start'],
      maxScore: 10,
      ...overrides,
    },
    worldId,
    areaId,
  };
}

export function makeBundle(
  options: {
    readonly topics?: readonly TopicIndexEntry[];
    readonly emptyContent?: boolean;
  } = {},
): ContentBundle {
  const topics = options.topics ?? [makeTopic()];
  const specTopics: SpecTopicCatalogue = {
    getById(id: string): SpecTopic | undefined {
      return topics.find((entry) => entry.topic.id === id)?.topic;
    },
    getByRoomId(roomId: string): readonly SpecTopic[] {
      return topics
        .filter((entry) => entry.topic.roomIds.includes(roomId))
        .map((entry) => entry.topic);
    },
    getByAreaId(worldId: string, areaId: string): readonly SpecTopic[] {
      return topics
        .filter((entry) => entry.worldId === worldId && entry.areaId === areaId)
        .map((entry) => entry.topic);
    },
  };

  if (options.emptyContent === true) {
    return {
      ...stubBundle,
      rooms: catalogueOf([]),
      items: catalogueOf([]),
      actors: catalogueOf([]),
      quizzes: catalogueOf([]),
      specTopics,
    };
  }

  return {
    ...stubBundle,
    items: catalogueOf([
      {
        id: 'lamp',
        name: 'Lamp',
        aliases: [],
        portable: true,
        description: 'A small lamp.',
        initialRoom: 'room-stub-start',
      },
      {
        id: 'key',
        name: 'Key',
        aliases: [],
        portable: true,
        description: 'A small key.',
        initialRoom: 'room-stub-north',
      },
    ]),
    actors: catalogueOf([{ id: 'npc-1', aliases: [], initialStateId: 'idle' }]),
    actorStates: catalogueOf([
      { id: 'idle', stateDesc: 'Waiting.', specialDesc: 'A waiting figure.' },
    ]),
    quizzes: catalogueOf([
      {
        id: 'quiz-1',
        actorId: 'npc-1',
        topicId: 'topic-1',
        score: 0,
        questionIds: [],
        passMark: 1,
        onPass: [],
        onFail: [],
      },
    ]),
    specTopics,
  };
}

// ---------------------------------------------------------------------------
// Runtime seam loaders — each failure names the missing factory explicitly.
// ---------------------------------------------------------------------------

export interface SaveManagerDependencies {
  readonly storage: StorageAdapter;
  readonly clock: Clock;
  readonly bundle: ContentBundle;
}

export interface GameDependencies {
  readonly saveManager: SaveManager;
  readonly storage: StorageAdapter;
  readonly clock: Clock;
  readonly bundle: ContentBundle;
  readonly random: Random;
  readonly bus: EventBus;
  readonly downloadFile: (filename: string, text: string) => void;
  readonly initialState?: GameState;
}

export interface EffectApplierDependencies {
  readonly random: Random;
}

export interface RuntimeGameState extends GameState {
  toDto(): GameStateDto;
}

export interface EffectApplierLike {
  apply(effect: Effect): readonly GameEvent[];
}

export function asRuntime(state: GameState): RuntimeGameState {
  expect(
    state,
    'restored GameState must expose toDto() (application-and-ui.md §4)',
  ).toHaveProperty('toDto');
  return state as RuntimeGameState;
}

export async function loadSaveManager(
  dependencies: SaveManagerDependencies,
): Promise<SaveManager> {
  const module: Partial<{
    createSaveManager: (dependencies: SaveManagerDependencies) => SaveManager;
  }> = await import('../../src/application/SaveManager');
  expect(
    module.createSaveManager,
    'createSaveManager must be exported from src/application/SaveManager.ts (storage-schema.md §10)',
  ).toBeTypeOf('function');
  return module.createSaveManager!(dependencies);
}

export async function loadGame(dependencies: GameDependencies): Promise<Game> {
  const module: Partial<{
    createGame: (dependencies: GameDependencies) => Game;
  }> = await import('../../src/application/Game');
  expect(
    module.createGame,
    'createGame must be exported from src/application/Game.ts (application-and-ui.md §4)',
  ).toBeTypeOf('function');
  return module.createGame!(dependencies);
}

export async function loadInitialState(): Promise<RuntimeGameState> {
  const module: Partial<{ createInitial: () => RuntimeGameState }> =
    await import('../../src/core/GameState');
  expect(
    module.createInitial,
    'createInitial must be exported from src/core/GameState.ts (storage-schema.md §9; skeleton-decisions.md S-GAP-01)',
  ).toBeTypeOf('function');
  return module.createInitial!();
}

export async function loadSession(
  state: GameState,
  bundle: ContentBundle,
): Promise<Session> {
  const module: Partial<{
    createSession: (state: GameState, bundle: ContentBundle) => Session;
  }> = await import('../../src/core/lifecycle/Session');
  expect(
    module.createSession,
    'createSession must be exported from src/core/lifecycle/Session.ts (application-and-ui.md §11)',
  ).toBeTypeOf('function');
  return module.createSession!(state, bundle);
}

export async function loadEffectApplier(
  state: GameState,
  dependencies: EffectApplierDependencies,
): Promise<EffectApplierLike> {
  const module = await importModule('../../src/core/effects/EffectApplier');
  expect(
    module['createEffectApplier'],
    'createEffectApplier must be exported from src/core/effects/EffectApplier.ts (shared-rules.md §5)',
  ).toBeTypeOf('function');
  const factory = module['createEffectApplier'] as (
    state: GameState,
    dependencies: EffectApplierDependencies,
  ) => EffectApplierLike;
  return factory(state, dependencies);
}

export function makeGameDependencies(
  overrides: Partial<GameDependencies> = {},
): GameDependencies {
  const storage = new MemoryStorage();
  const clock = new FixedClock();
  const bundle = makeBundle();
  return {
    saveManager: {
      buildDto: () => makeEnvelope(),
      save: noop,
      load: () => ({ ok: false, reason: 'invalid-json' }),
      validate: () => ({ ok: false, reason: 'invalid-json' }),
      restore: () => makeRuntimeState(),
    },
    storage,
    clock,
    bundle,
    random: new FakeRandom(),
    bus: new RecordingBus(),
    downloadFile: noop,
    ...overrides,
  };
}
