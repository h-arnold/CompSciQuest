// Deterministic fixtures for the connected authored-effects slice. Content comes
// from the committed catalogue; storage, clock, randomness and the bus are fakes.
import {
  createGame,
  type Game,
  type GameDependencies,
} from '../../src/application/Game';
import { createSaveManager } from '../../src/application/SaveManager';
import type { SaveDto } from '../../src/application/SaveDto';
import type { ContentBundle } from '../../src/content/ContentBundle';
import {
  createFromDto,
  createInitial,
  type GameState,
  type GameStateDto,
  type NpcStateDto,
  type RuntimeGameState,
} from '../../src/core/GameState';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { Puzzle } from '../../src/core/puzzles/Puzzle';
import type { Random } from '../../src/core/Random';
import {
  FakeRandom,
  FixedClock,
  makeGameDependencies,
  MemoryStorage,
  RecordingBus,
  SAVE_KEY,
} from './persistence';
import { loadContent } from '../../src/content/index';

export const authoredBundle: ContentBundle = loadContent();

export const SWITCHYARD_AREA_ID = 'area-1-2-1-data-representation';
export const SWITCHYARD_WORLD_ID = 'world-wjec-gcse-computer-science-2025-spec';
export const FOREMAN_ID = 'npc-the-foreman';

function seededNpcs(): Record<string, NpcStateDto> {
  return Object.fromEntries(
    authoredBundle.actors.all.map((actor) => [
      actor.id,
      {
        stateId: actor.initialStateId,
        knownTopics: [],
        inventory: [],
        topicUses: {},
      },
    ]),
  );
}

export function authoredNpc(
  actorId: string,
  overrides: Partial<NpcStateDto> = {},
): NpcStateDto {
  const actor = authoredBundle.actors.getById(actorId);
  if (actor === undefined) {
    throw new Error(
      `Authored actor '${actorId}' is missing from the catalogue.`,
    );
  }
  return {
    stateId: actor.initialStateId,
    knownTopics: [],
    inventory: [],
    topicUses: {},
    ...overrides,
  };
}

export interface AuthoredStateOptions extends Partial<GameStateDto> {
  readonly roomId?: string;
  readonly heldItems?: readonly string[];
}

export function authoredState(
  options: AuthoredStateOptions = {},
): RuntimeGameState {
  const initial = createInitial(authoredBundle).toDto();
  const roomId = options.roomId ?? initial.player.position.roomId;
  const area = authoredBundle.areas.all.find((entry) =>
    entry.roomIds.includes(roomId),
  );
  const worldId = area?.worldId ?? initial.player.position.worldId;
  const areaId = area?.id ?? initial.player.position.areaId;
  const player = {
    ...initial.player,
    ...options.player,
    position: { worldId, areaId, roomId },
    inventory: [...(options.player?.inventory ?? initial.player.inventory)],
  };
  const rooms = Object.fromEntries(
    Object.entries(options.rooms ?? initial.rooms).map(([id, room]) => [
      id,
      { inventory: [...room.inventory] },
    ]),
  );
  const npcs: Record<string, NpcStateDto> = Object.fromEntries(
    Object.entries({ ...seededNpcs(), ...options.npcs }).map(([id, npc]) => [
      id,
      {
        ...npc,
        inventory: [...npc.inventory],
        knownTopics: [...npc.knownTopics],
        topicUses: { ...npc.topicUses },
      },
    ]),
  );
  const heldItems = options.heldItems ?? [];
  for (const itemId of heldItems) {
    for (const room of Object.values(rooms)) {
      room.inventory = room.inventory.filter((entry) => entry !== itemId);
    }
    for (const [id, npc] of Object.entries(npcs)) {
      npcs[id] = {
        ...npc,
        inventory: npc.inventory.filter((entry) => entry !== itemId),
      };
    }
    if (!player.inventory.includes(itemId)) player.inventory.push(itemId);
  }
  return createFromDto({
    ...initial,
    ...options,
    player,
    rooms,
    npcs,
    flags: { ...initial.flags, ...options.flags },
    counters: { ...initial.counters, ...options.counters },
  });
}

// A live quiz attempt for an authored quiz. Question order and IDs come from
// the committed catalogue; overrides describe only the attempt's progress.
export function activeQuizState(
  quizId: string,
  overrides: Partial<GameStateDto['quiz']> = {},
): GameStateDto['quiz'] {
  const quiz = authoredBundle.quizzes.getById(quizId);
  if (quiz === undefined) {
    throw new Error(`Authored quiz '${quizId}' is missing from the catalogue.`);
  }
  return {
    activeQuizId: quizId,
    questionIds: [...quiz.questionIds],
    index: 0,
    correctCount: 0,
    answers: [],
    ...overrides,
  };
}

export function switchyardProgress(
  overrides: Partial<GameStateDto['progress'][number]> = {},
): GameStateDto['progress'][number] {
  return {
    worldId: SWITCHYARD_WORLD_ID,
    areaId: SWITCHYARD_AREA_ID,
    visitedRooms: ['room-binary-hall'],
    completedTopics: [],
    earnedScore: 0,
    maxScore: 24,
    ...overrides,
  };
}

function requirementFlags(puzzle: Puzzle): string[] {
  return puzzle.requirements.flatMap((condition) =>
    condition.kind === 'flag-set' ? [condition.flag] : [],
  );
}

// Satisfy every earlier authored puzzle while leaving the requested producer's
// puzzle unsolved. This isolates one trace-pinned action without inventing a
// producer catalogue or bypassing the canonical PuzzleSystem.
export interface ProducerStateOptions {
  readonly targetPuzzleId?: string;
  readonly extraFlags?: Readonly<Record<string, boolean>>;
}

export function producerState(
  roomId: string,
  heldItems: readonly string[],
  options: ProducerStateOptions = {},
): RuntimeGameState {
  const { targetPuzzleId, extraFlags = {} } = options;
  const flags: Record<string, boolean> = {
    'switch-cooled': true,
    'carry-cleared': true,
    'stacks-sealed': true,
    'tiles-verified': true,
    ...extraFlags,
  };
  const puzzles: Record<string, GameStateDto['puzzles'][string]> = {};
  for (const puzzle of authoredBundle.puzzles.all) {
    if (puzzle.id === targetPuzzleId) continue;
    for (const flag of requirementFlags(puzzle)) flags[flag] = true;
    puzzles[puzzle.id] = { phase: 'solved' };
  }
  return authoredState({
    roomId,
    heldItems,
    flags,
    puzzles,
    progress: [switchyardProgress()],
  });
}

export interface AuthoredGameOptions {
  readonly bundle?: ContentBundle;
  readonly state?: GameState;
  readonly random?: Random;
  readonly overrides?: Partial<GameDependencies>;
}

export interface AuthoredGameFixture {
  readonly game: Game;
  readonly bus: RecordingBus;
  readonly storage: MemoryStorage;
  readonly dependencies: GameDependencies;
}

export function authoredGame(
  options: AuthoredGameOptions = {},
): AuthoredGameFixture {
  const bundle = options.bundle ?? authoredBundle;
  const storage = new MemoryStorage();
  const clock = new FixedClock();
  const bus = new RecordingBus();
  const dependencies = makeGameDependencies({
    bundle,
    initialState: options.state ?? authoredState(),
    random: options.random ?? new FakeRandom([0]),
    storage,
    clock,
    bus,
    saveManager: createSaveManager({ bundle, storage, clock }),
    ...options.overrides,
  });
  return { game: createGame(dependencies), bus, storage, dependencies };
}

// A manual save is a meta-action: it does not advance the turn. Tests use it only
// to observe the persisted DTO, and capture command batches before calling it.
export function readSave(
  game: Game,
  storage: MemoryStorage,
): { readonly dto: SaveDto } {
  game.save();
  const raw = storage.read(SAVE_KEY);
  if (raw === null) {
    throw new Error(
      'The injected in-memory save store did not receive a save.',
    );
  }
  return { dto: JSON.parse(raw) as SaveDto };
}

export function gameplaySnapshot(dto: GameStateDto): string {
  return JSON.stringify({
    player: dto.player,
    rooms: dto.rooms,
    npcs: dto.npcs,
    hazards: dto.hazards,
    puzzles: dto.puzzles,
    hints: dto.hints,
    quiz: dto.quiz,
    quizAttempts: dto.quizAttempts,
    flags: dto.flags,
    progress: dto.progress,
    status: dto.status,
    counters: dto.counters,
  });
}

export function eventTypes(events: readonly GameEvent[]): string[] {
  return events.map((event) => event.type);
}

export function messageTexts(events: readonly GameEvent[]): string[] {
  return events.flatMap((event) =>
    event.type === 'message' ? [event.text] : [],
  );
}

export function changedFlags(events: readonly GameEvent[]): string[] {
  return events.flatMap((event) =>
    event.type === 'flag-changed' ? [event.flag] : [],
  );
}
