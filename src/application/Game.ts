// Canonical façade from application-and-ui.md §4. The façade owns the turn
// counter and the event buffer; it never computes game rules or scores itself.
import type { ContentBundle } from '../content/ContentBundle';
import { createInitial } from '../core/GameState';
import type { GameState } from '../core/GameState';
import type { Direction } from '../types/domain';
import type { Command } from '../core/commands/Command';
import { createNameResolver } from '../core/commands/NameResolver';
import { parse } from '../core/commands/Parser';
import type { Effect } from '../core/effects/Effect';
import { createEffectApplier } from '../core/effects/EffectApplier';
import type { EventBus } from '../core/events/EventBus';
import type { GameEvent, RoomSummary } from '../core/events/GameEvent';
import { createSession } from '../core/lifecycle/Session';
import type { Session } from '../core/lifecycle/Session';
import type { Random } from '../core/Random';
import { createScoreTracker } from '../core/scoring/ScoreTracker';
import type { ScoreTracker } from '../core/scoring/ScoreTracker';
import type { TurnContext } from '../core/TurnContext';
import type { StorageAdapter } from '../storage/StorageAdapter';
import type { Clock } from './Clock';
import type {
  AreaProgressView,
  GameViewData,
  SpecTopicView,
} from './GameViewData';
import type { MetaAction } from './MetaAction';
import type { LoadResult, SaveDto } from './SaveDto';
import type { SaveManager } from './SaveManager';

export interface Game {
  submit(raw: string): readonly GameEvent[];
  newGame(): void;
  continueGame(dto: SaveDto): void;
  restart(): void;
  getViewData(): GameViewData;
  save(): void;
  download(): void;
  importSave(text: string): LoadResult;
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
  // Documented phase seams (shared-rules.md §2, application-and-ui.md §8).
  readonly resolve?: (raw: string) => Command;
  readonly check?: (command: Command, state: GameState) => readonly string[];
  readonly dispatch?: (
    command: Command,
    context: TurnContext,
  ) => readonly Effect[];
  readonly apply?: (effect: Effect) => readonly GameEvent[];
  readonly react?: (
    state: GameState,
    events: readonly GameEvent[],
  ) => readonly Effect[];
  readonly score?: ScoreTracker;
  readonly session?: Session;
  readonly clearViews?: () => void;
}

function initialBatch(
  state: GameState,
  bundle: ContentBundle,
): readonly GameEvent[] {
  const roomId = state.player.position.roomId;
  const room = bundle.rooms.getById(roomId);
  if (!room) {
    return [{ type: 'message', text: 'The adventure begins.' }];
  }
  const summary: RoomSummary = {
    id: room.id,
    title: room.title,
    description: room.description,
    exits: room.exits.map((exit) => exit.direction),
  };
  return [{ type: 'room-entered', room: summary }];
}

function areaViews(
  state: GameState,
  bundle: ContentBundle,
): readonly AreaProgressView[] {
  return state.progress.map((entry) => {
    const world = bundle.worlds.getById(entry.worldId);
    const area = bundle.areas.getById(entry.areaId);
    const topics: SpecTopicView[] = [];
    for (const topicId of entry.completedTopics) {
      const topic = bundle.specTopics.getById(topicId);
      if (!topic) continue;
      topics.push({
        id: topic.id,
        title: topic.title,
        specReference: topic.specReference,
        status: topic.status,
        complete: true,
      });
    }
    return {
      worldId: entry.worldId,
      areaId: entry.areaId,
      worldName: world?.name ?? entry.worldId,
      areaName: area?.name ?? entry.areaId,
      earnedScore: entry.earnedScore,
      maxScore: entry.maxScore,
      visitedRoomCount: entry.visitedRooms.length,
      roomCount: area?.roomIds.length ?? 0,
      topics,
    };
  });
}

const DIRECTION_NAMES: ReadonlySet<string> = new Set([
  'north',
  'south',
  'east',
  'west',
  'up',
  'down',
  'in',
  'out',
]);

function isDirection(value: string | undefined): value is Direction {
  return value !== undefined && DIRECTION_NAMES.has(value);
}

function noArgumentCommand(kind: string): Command | undefined {
  switch (kind) {
    case 'look': {
      return { kind: 'look' };
    }
    case 'inventory': {
      return { kind: 'inventory' };
    }
    case 'score': {
      return { kind: 'score' };
    }
    case 'help': {
      return { kind: 'help' };
    }
    case 'bye': {
      return { kind: 'bye' };
    }
    default: {
      return undefined;
    }
  }
}

function singleIdCommand(kind: string, id: string): Command | undefined {
  switch (kind) {
    case 'take': {
      return { kind: 'take', itemId: id };
    }
    case 'drop': {
      return { kind: 'drop', itemId: id };
    }
    case 'examine': {
      return { kind: 'examine', targetId: id };
    }
    case 'open': {
      return { kind: 'open', targetId: id };
    }
    case 'close': {
      return { kind: 'close', targetId: id };
    }
    case 'talk-to': {
      return { kind: 'talk-to', actorId: id };
    }
    default: {
      return undefined;
    }
  }
}

function doubleIdCommand(
  kind: string,
  first: string,
  second: string | undefined,
): Command | undefined {
  if (second === undefined) return undefined;
  switch (kind) {
    case 'unlock': {
      return { kind: 'unlock', itemId: first, targetId: second };
    }
    case 'give': {
      return { kind: 'give', actorId: first, itemId: second };
    }
    case 'show': {
      return { kind: 'show', actorId: first, itemId: second };
    }
    default: {
      return undefined;
    }
  }
}

// `put <item> in <target>` keeps its raw noun phrases (architecture.md §7), so
// the documented preposition is skipped here rather than resolved as an object.
function putCommand(
  nounPhrases: readonly string[],
  itemId: string,
  idAt: (index: number) => string | undefined,
  unknown: () => Command,
): Command {
  const preposition = nounPhrases.indexOf('in');
  const targetId = idAt(preposition === -1 ? 1 : preposition + 1);
  return targetId === undefined ? unknown() : { kind: 'put', itemId, targetId };
}

// Default phase-1 composition: Tokenizer → Parser → NameResolver → Command.
// Unresolved nouns and unknown verbs become the documented unknown command.
function resolveGameCommand(
  raw: string,
  state: GameState,
  bundle: ContentBundle,
): Command {
  const parsed = parse(raw);
  const resolver = createNameResolver();
  const nounAt = (index: number): string | undefined =>
    parsed.nounPhrases[index];
  const idAt = (index: number): string | undefined => {
    const phrase = nounAt(index);
    return phrase === undefined
      ? undefined
      : resolver.resolve(phrase, state, bundle);
  };
  const unknown = (): Command => ({ kind: 'unknown', raw });

  const simple = noArgumentCommand(parsed.verb);
  if (simple !== undefined) return simple;
  if (parsed.verb === 'go') {
    const direction = nounAt(0);
    return isDirection(direction) ? { kind: 'go', direction } : unknown();
  }
  const first = idAt(0);
  if (first === undefined) return unknown();
  if (parsed.verb === 'use') {
    const targetId = idAt(1);
    return targetId === undefined
      ? { kind: 'use', itemId: first }
      : { kind: 'use', itemId: first, targetId };
  }
  if (parsed.verb === 'put') {
    return putCommand(parsed.nounPhrases, first, idAt, unknown);
  }
  if (parsed.verb === 'hint') return { kind: 'hint', targetId: first };
  if (parsed.verb === 'answer') {
    const option = Number(nounAt(0) ?? '');
    return Number.isSafeInteger(option)
      ? { kind: 'answer', option }
      : unknown();
  }
  return (
    doubleIdCommand(parsed.verb, first, idAt(1)) ??
    singleIdCommand(parsed.verb, first) ??
    unknown()
  );
}

function metaActionOf(raw: string): MetaAction | undefined {
  const trimmed = raw.trim();
  const lowered = trimmed.toLowerCase();
  switch (lowered) {
    case 'save': {
      return { kind: 'save' };
    }
    case 'load': {
      return { kind: 'load' };
    }
    case 'download': {
      return { kind: 'download' };
    }
    case 'restart': {
      return { kind: 'restart' };
    }
    default: {
      const prefix = 'import ';
      return lowered.startsWith(prefix)
        ? { kind: 'import', text: trimmed.slice(prefix.length) }
        : undefined;
    }
  }
}

const END_STATE_COMMANDS: ReadonlySet<Command['kind']> = new Set([
  'look',
  'examine',
  'inventory',
  'score',
  'help',
]);

export function createGame(dependencies: GameDependencies): Game {
  let state: GameState =
    dependencies.initialState ?? createInitial(dependencies.bundle);
  const isInjectedScore = dependencies.score !== undefined;
  const isInjectedSession = dependencies.session !== undefined;
  const isInjectedApply = dependencies.apply !== undefined;
  let score: ScoreTracker = dependencies.score ?? createScoreTracker(state);
  let session: Session =
    dependencies.session ?? createSession(state, dependencies.bundle);
  let apply: (effect: Effect) => readonly GameEvent[] =
    dependencies.apply ??
    createEffectApplier(state, { random: dependencies.random }).apply;

  const rebind = (): void => {
    if (!isInjectedScore) score = createScoreTracker(state);
    if (!isInjectedSession) {
      session = createSession(state, dependencies.bundle);
    }
    if (!isInjectedApply) {
      apply = createEffectApplier(state, { random: dependencies.random }).apply;
    }
  };

  const publish = (events: readonly GameEvent[]): readonly GameEvent[] => {
    dependencies.bus.publish(events);
    return events;
  };

  const replaceState = (
    next: GameState,
    shouldResetSession: boolean,
  ): readonly GameEvent[] => {
    state = next;
    rebind();
    dependencies.clearViews?.();
    if (shouldResetSession) session.newGame();
    return initialBatch(state, dependencies.bundle);
  };

  const saveGame = (): void => {
    dependencies.saveManager.save(state);
  };

  const downloadGame = (): void => {
    const text = JSON.stringify(dependencies.saveManager.buildDto(state));
    const filename = `compsciquest-save-${dependencies.clock.now().replaceAll(/[:.]/gu, '-')}.json`;
    dependencies.downloadFile(filename, text);
  };

  const importGame = (text: string): LoadResult => {
    const result = dependencies.saveManager.validate(text);
    if (result.ok) {
      state = dependencies.saveManager.restore(result.dto);
      rebind();
      dependencies.clearViews?.();
    }
    return result;
  };

  const metaMessage = (text: string): readonly GameEvent[] =>
    publish([{ type: 'message', text }]);

  const loadMeta = (): readonly GameEvent[] => {
    const result = dependencies.saveManager.load();
    return result.ok
      ? publish(
          replaceState(dependencies.saveManager.restore(result.dto), false),
        )
      : metaMessage('No saved game could be loaded.');
  };

  const importMeta = (text: string): readonly GameEvent[] => {
    const result = importGame(text);
    return metaMessage(
      result.ok ? 'Game imported.' : 'That save could not be imported.',
    );
  };

  const performMeta = (meta: MetaAction): readonly GameEvent[] => {
    switch (meta.kind) {
      case 'save': {
        saveGame();
        return metaMessage('Game saved.');
      }
      case 'load': {
        return loadMeta();
      }
      case 'download': {
        downloadGame();
        return metaMessage('Save downloaded.');
      }
      case 'import': {
        return importMeta(meta.text);
      }
      case 'restart': {
        return publish(replaceState(createInitial(dependencies.bundle), true));
      }
    }
  };

  const applyAll = (effects: readonly Effect[], events: GameEvent[]): void => {
    for (const effect of effects) {
      for (const event of apply(effect)) {
        events.push(event);
      }
    }
  };

  const runTurn = (
    command: Command,
    context: TurnContext,
  ): readonly GameEvent[] => {
    const events: GameEvent[] = [];
    const violations = dependencies.check?.(command, context.state) ?? [];
    if (violations.length > 0) {
      for (const text of violations) {
        events.push({ type: 'message', text });
      }
      return events;
    }
    applyAll(dependencies.dispatch?.(command, context) ?? [], events);

    // Phase 4: one reaction pass, plus one extra when an effect can enable a
    // rule. A third pass is never allowed (shared-rules.md §2).
    const react = (): readonly Effect[] =>
      dependencies.react?.(context.state, events) ?? [];
    const firstPass = react();
    applyAll(firstPass, events);
    if (firstPass.some((effect) => effect.kind !== 'message')) {
      applyAll(react(), events);
    }
    return events;
  };

  return {
    submit(raw: string): readonly GameEvent[] {
      const meta = metaActionOf(raw);
      if (meta !== undefined) return performMeta(meta);

      const command =
        dependencies.resolve?.(raw) ??
        resolveGameCommand(raw, state, dependencies.bundle);
      if (state.status !== 'playing' && !END_STATE_COMMANDS.has(command.kind)) {
        return publish([
          {
            type: 'message',
            text: 'The adventure is over — start a new game.',
          },
        ]);
      }

      (state as { turn: number }).turn += 1;
      const context: TurnContext = {
        turn: state.turn,
        state,
        bundle: dependencies.bundle,
        random: dependencies.random,
      };
      const events = runTurn(command, context);
      return publish(session.observe(score.observe(events)));
    },
    newGame(): void {
      publish(replaceState(createInitial(dependencies.bundle), true));
    },
    continueGame(dto: SaveDto): void {
      publish(replaceState(dependencies.saveManager.restore(dto), false));
    },
    restart(): void {
      publish(replaceState(createInitial(dependencies.bundle), true));
    },
    getViewData(): GameViewData {
      return {
        status: state.status,
        position: state.player.position,
        turn: state.turn,
        lives: state.player.lives,
        score: state.score,
        areas: areaViews(state, dependencies.bundle),
        hints: [],
      };
    },
    save(): void {
      saveGame();
    },
    download(): void {
      downloadGame();
    },
    importSave(text: string): LoadResult {
      const result = importGame(text);
      publish([
        {
          type: 'message',
          text: result.ok
            ? 'Game imported.'
            : 'That save could not be imported.',
        },
      ]);
      return result;
    },
  };
}
