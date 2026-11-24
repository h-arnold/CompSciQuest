// Canonical API contract from storage-schema.md §10 (interface plus runtime
// factory). The factory keeps storage, clock and catalogues injectable.
import type { ContentBundle } from '../content/ContentBundle';
import { createFromDto } from '../core/GameState';
import type { GameState, GameStateDto } from '../core/GameState';
import type { StorageAdapter } from '../storage/StorageAdapter';
import type { Clock } from './Clock';
import type { QuarantineDto } from './QuarantineDto';
import type { LoadFailureReason, LoadResult, SaveDto } from './SaveDto';
import { SCHEMA_VERSION } from './schema';

const SAVE_KEY = 'compsciquest:save:v1';
const QUARANTINE_KEY = 'compsciquest:save:v1:corrupt';
const DOOR_FLAG_PREFIX = 'door-open:';
const ENTITY_RECORD_KEYS = [
  'rooms',
  'npcs',
  'hazards',
  'puzzles',
  'hints',
] as const;
const PUZZLE_PHASES = new Set(['unsolved', 'active', 'solved']);
const SESSION_STATUSES = new Set(['playing', 'won', 'lost']);

export interface SaveManagerDependencies {
  readonly storage: StorageAdapter;
  readonly clock: Clock;
  readonly bundle: ContentBundle;
}

export interface SaveManager {
  buildDto(state: GameStateDto): SaveDto;
  save(state: GameStateDto): void;
  load(): LoadResult;
  validate(text: string): LoadResult;
  restore(dto: SaveDto): GameState;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function valuesOf(value: unknown): readonly unknown[] {
  return isRecord(value) ? Object.values(value) : [];
}

function isStringArray(value: unknown): value is readonly string[] {
  return (
    Array.isArray(value) && value.every((entry) => typeof entry === 'string')
  );
}

function isNumberArray(value: unknown): value is readonly number[] {
  return (
    Array.isArray(value) && value.every((entry) => typeof entry === 'number')
  );
}

function isNumberRecord(
  value: unknown,
): value is Readonly<Record<string, number>> {
  return (
    isRecord(value) &&
    Object.values(value).every((entry) => typeof entry === 'number')
  );
}

function isBooleanRecord(
  value: unknown,
): value is Readonly<Record<string, boolean>> {
  return (
    isRecord(value) &&
    Object.values(value).every((entry) => typeof entry === 'boolean')
  );
}

function hasValidPlayer(value: unknown): boolean {
  if (!isRecord(value)) return false;
  const position = value['position'];
  return (
    isRecord(position) &&
    typeof position['worldId'] === 'string' &&
    typeof position['areaId'] === 'string' &&
    typeof position['roomId'] === 'string' &&
    isStringArray(value['inventory']) &&
    typeof value['lives'] === 'number'
  );
}

function hasOptionalNumber(
  value: Record<string, unknown>,
  key: string,
): boolean {
  const candidate = value[key];
  return candidate === undefined || typeof candidate === 'number';
}

function hasValidNpcs(value: unknown): boolean {
  return valuesOf(value).every(
    (npc) =>
      isRecord(npc) &&
      typeof npc['stateId'] === 'string' &&
      isStringArray(npc['knownTopics']) &&
      isStringArray(npc['inventory']) &&
      isNumberRecord(npc['topicUses']) &&
      (npc['activeNodeId'] === undefined ||
        typeof npc['activeNodeId'] === 'string'),
  );
}

function hasValidHazards(value: unknown): boolean {
  return valuesOf(value).every(
    (hazard) =>
      isRecord(hazard) &&
      typeof hazard['timesFired'] === 'number' &&
      hasOptionalNumber(hazard, 'lastFiredTurn'),
  );
}

function hasValidPuzzles(value: unknown): boolean {
  return valuesOf(value).every(
    (puzzle) => isRecord(puzzle) && PUZZLE_PHASES.has(String(puzzle['phase'])),
  );
}

function hasValidHints(value: unknown): boolean {
  return valuesOf(value).every(
    (hint) =>
      isRecord(hint) &&
      isNumberArray(hint['levelsShown']) &&
      hasOptionalNumber(hint, 'lastShownTurn'),
  );
}

function hasValidProgress(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.every(
      (entry) =>
        isRecord(entry) &&
        typeof entry['worldId'] === 'string' &&
        typeof entry['areaId'] === 'string' &&
        isStringArray(entry['visitedRooms']) &&
        isStringArray(entry['completedTopics']) &&
        typeof entry['earnedScore'] === 'number' &&
        typeof entry['maxScore'] === 'number',
    )
  );
}

function hasValidSchedule(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.every(
      (event) =>
        isRecord(event) &&
        typeof event['id'] === 'string' &&
        ['fuse', 'daemon'].includes(String(event['kind'])) &&
        typeof event['remainingTurns'] === 'number' &&
        isRecord(event['effect']),
    )
  );
}

function hasValidQuiz(value: unknown): boolean {
  return (
    isRecord(value) &&
    isStringArray(value['questionIds']) &&
    typeof value['index'] === 'number' &&
    typeof value['correctCount'] === 'number' &&
    isNumberArray(value['answers']) &&
    (value['activeQuizId'] === undefined ||
      typeof value['activeQuizId'] === 'string')
  );
}

function hasValidShape(value: unknown): value is GameStateDto {
  return (
    isRecord(value) &&
    hasValidPlayer(value['player']) &&
    ENTITY_RECORD_KEYS.every((key) => isRecord(value[key])) &&
    valuesOf(value['rooms']).every(
      (room) => isRecord(room) && isStringArray(room['inventory']),
    ) &&
    hasValidNpcs(value['npcs']) &&
    hasValidHazards(value['hazards']) &&
    hasValidPuzzles(value['puzzles']) &&
    hasValidHints(value['hints']) &&
    hasValidQuiz(value['quiz']) &&
    isNumberRecord(value['quizAttempts']) &&
    isBooleanRecord(value['flags']) &&
    isNumberRecord(value['counters']) &&
    hasValidProgress(value['progress']) &&
    typeof value['turn'] === 'number' &&
    typeof value['rngSeed'] === 'number' &&
    SESSION_STATUSES.has(String(value['status'])) &&
    hasValidSchedule(value['schedule'])
  );
}

function hasUniqueItemOwnership(state: GameStateDto): boolean {
  const owners = new Set<string>();
  const isNewOwner = (itemId: string): boolean => {
    if (owners.has(itemId)) return false;
    owners.add(itemId);
    return true;
  };
  const inventories: readonly (readonly string[])[] = [
    state.player.inventory,
    ...Object.values(state.npcs).map((npc) => npc.inventory),
    ...Object.values(state.rooms).map((room) => room.inventory),
  ];
  return inventories.every((inventory) =>
    inventory.every((id) => isNewOwner(id)),
  );
}

function hasUniqueProgress(state: GameStateDto): boolean {
  const seen = new Set<string>();
  for (const entry of state.progress) {
    const key = JSON.stringify([entry.worldId, entry.areaId]);
    if (seen.has(key)) return false;
    seen.add(key);
  }
  return true;
}

function haveExistingIds(
  ids: readonly string[],
  getById: (id: string) => unknown,
): boolean {
  return ids.every((id) => getById(id) !== undefined);
}

function hasValidPositionReferences(
  state: GameStateDto,
  bundle: ContentBundle,
): boolean {
  const { position } = state.player;
  return (
    bundle.worlds.getById(position.worldId) !== undefined &&
    bundle.areas.getById(position.areaId) !== undefined &&
    bundle.rooms.getById(position.roomId) !== undefined &&
    haveExistingIds(state.player.inventory, (id) => bundle.items.getById(id)) &&
    haveExistingIds(Object.keys(state.rooms), (id) =>
      bundle.rooms.getById(id),
    ) &&
    haveExistingIds(Object.keys(state.npcs), (id) => bundle.actors.getById(id))
  );
}

function hasValidQuizReferences(
  state: GameStateDto,
  bundle: ContentBundle,
): boolean {
  const quizId = state.quiz.activeQuizId;
  const isValidActiveQuiz =
    quizId === undefined || bundle.quizzes.getById(quizId) !== undefined;
  return (
    haveExistingIds(Object.keys(state.quizAttempts), (id) =>
      bundle.quizzes.getById(id),
    ) &&
    isValidActiveQuiz &&
    haveExistingIds(state.quiz.questionIds, (id) =>
      bundle.questions.getById(id),
    )
  );
}

function hasValidProgressReferences(
  state: GameStateDto,
  bundle: ContentBundle,
): boolean {
  return state.progress.every(
    (entry) =>
      bundle.worlds.getById(entry.worldId) !== undefined &&
      bundle.areas.getById(entry.areaId) !== undefined &&
      haveExistingIds(entry.completedTopics, (id) =>
        bundle.specTopics.getById(id),
      ),
  );
}

function hasValidFlagReferences(
  state: GameStateDto,
  bundle: ContentBundle,
): boolean {
  return Object.keys(state.flags)
    .filter((flag) => flag.startsWith(DOOR_FLAG_PREFIX))
    .every((flag) => {
      const itemId = flag.slice(DOOR_FLAG_PREFIX.length);
      return itemId.length > 0 && bundle.items.getById(itemId) !== undefined;
    });
}

function hasValidReferences(
  state: GameStateDto,
  bundle: ContentBundle,
): boolean {
  return (
    hasValidPositionReferences(state, bundle) &&
    hasValidQuizReferences(state, bundle) &&
    hasValidProgressReferences(state, bundle) &&
    hasValidFlagReferences(state, bundle) &&
    hasUniqueProgress(state) &&
    hasUniqueItemOwnership(state)
  );
}

function refreshMaxima(
  state: GameStateDto,
  bundle: ContentBundle,
): GameStateDto {
  const progress = state.progress.map((entry) => {
    const topics = bundle.specTopics.getByAreaId(entry.worldId, entry.areaId);
    if (topics.length === 0) return entry;
    const maxScore = topics.reduce((total, topic) => total + topic.maxScore, 0);
    return { ...entry, maxScore };
  });
  return { ...state, progress };
}

export function createSaveManager(
  dependencies: SaveManagerDependencies,
): SaveManager {
  const buildDto = (state: GameStateDto): SaveDto => ({
    version: SCHEMA_VERSION,
    savedAt: dependencies.clock.now(),
    // The core factory strips derived fields such as score from the envelope.
    state: createFromDto(state).toDto(),
  });

  const validate = (text: string): LoadResult => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(text) as unknown;
    } catch {
      return { ok: false, reason: 'invalid-json' };
    }
    if (!isRecord(parsed)) return { ok: false, reason: 'invalid-shape' };
    const version = parsed['version'];
    if (typeof version !== 'number')
      return { ok: false, reason: 'invalid-shape' };
    if (version < SCHEMA_VERSION) return { ok: false, reason: 'wrong-version' };
    if (version > SCHEMA_VERSION) return { ok: false, reason: 'newer-version' };
    if (
      typeof parsed['savedAt'] !== 'string' ||
      !hasValidShape(parsed['state'])
    ) {
      return { ok: false, reason: 'invalid-shape' };
    }
    const state = parsed['state'];
    if (!hasValidReferences(state, dependencies.bundle)) {
      return { ok: false, reason: 'invalid-content' };
    }
    return {
      ok: true,
      dto: {
        version: SCHEMA_VERSION,
        savedAt: parsed['savedAt'],
        state,
      },
    };
  };

  const quarantine = (raw: string, reason: LoadFailureReason): void => {
    if (dependencies.storage.read(QUARANTINE_KEY) !== null) return;
    const record: QuarantineDto = {
      quarantinedAt: dependencies.clock.now(),
      reason,
      raw,
    };
    dependencies.storage.write(QUARANTINE_KEY, JSON.stringify(record));
  };

  return {
    buildDto,
    save(state: GameStateDto): void {
      dependencies.storage.write(SAVE_KEY, JSON.stringify(buildDto(state)));
    },
    load(): LoadResult {
      const raw = dependencies.storage.read(SAVE_KEY);
      if (raw === null) return { ok: false, reason: 'invalid-json' };
      const result = validate(raw);
      if (!result.ok) quarantine(raw, result.reason);
      return result;
    },
    validate,
    restore(dto: SaveDto): GameState {
      return createFromDto(refreshMaxima(dto.state, dependencies.bundle));
    },
  };
}
