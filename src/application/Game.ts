// Canonical façade from application-and-ui.md §4. The façade owns the turn
// counter and the event buffer; it never computes game rules or scores itself.
import type { ContentBundle } from '../content/ContentBundle';
import { createFromDto, createInitial } from '../core/GameState';
import type { GameState } from '../core/GameState';
import type { Command } from '../core/commands/Command';
import { getCommandHandler } from '../core/commands/verbs/index';
import type { Effect } from '../core/effects/Effect';
import { createEffectApplier } from '../core/effects/EffectApplier';
import type { EventBus } from '../core/events/EventBus';
import type { GameEvent, RoomSummary } from '../core/events/GameEvent';
import { createSession } from '../core/lifecycle/Session';
import type { Session } from '../core/lifecycle/Session';
import type { Random } from '../core/Random';
import { createHazardSystem } from '../core/hazards/HazardSystem';
import { createDialogueSystem } from '../core/npcs/DialogueSystem';
import { TALKING_STATE } from '../core/npcs/ConversationFlow';
import { createPuzzleSystem } from '../core/puzzles/PuzzleSystem';
import { createQuizSystem } from '../core/combat/QuizSystem';
import { createHintSystem } from '../core/hints/HintSystem';
import { createConditionEvaluator } from '../core/rules/ConditionEvaluator';
import { createRuleEngine } from '../core/rules/RuleEngine';
import { createScheduler } from '../core/scheduling/Scheduler';
import { createScoreTracker } from '../core/scoring/ScoreTracker';
import type { ScoreTracker } from '../core/scoring/ScoreTracker';
import type { TurnContext } from '../core/TurnContext';
import type { StorageAdapter } from '../storage/StorageAdapter';
import type { Clock } from './Clock';
import type {
  AreaProgressView,
  GameViewData,
  HintView,
  QuizView,
  SpecTopicView,
} from './GameViewData';
import type { MetaAction } from './MetaAction';
import {
  createComposedReaction,
  type ComposedReaction,
} from './ComposedReaction';
import type { LoadResult, SaveDto } from './SaveDto';
import type { SaveManager } from './SaveManager';
import { resolveGameCommand } from './commandResolution';

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
    context: TurnContext,
    events: readonly GameEvent[],
  ) => readonly GameEvent[];
  readonly score?: ScoreTracker;
  readonly session?: Session;
  readonly clearViews?: () => void;
}

// Shared-rules.md §7: the port's current seed is the persisted PRNG state. A
// bare test fake omits both optional members and stays deterministic.
function adoptSeed(random: Random, state: GameState): void {
  if (typeof random.setSeed === 'function') random.setSeed(state.rngSeed);
}

function recordSeed(random: Random, state: GameState): void {
  const { seed } = random;
  if (seed !== undefined) (state as { rngSeed: number }).rngSeed = seed >>> 0;
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
    const area = bundle.areas.all.find(
      (candidate) =>
        candidate.worldId === entry.worldId && candidate.id === entry.areaId,
    );
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
      visitedRoomCount: Math.min(
        entry.visitedRooms.length,
        area?.roomIds.length ?? 0,
      ),
      roomCount: area?.roomIds.length ?? 0,
      topics,
    };
  });
}

function quizView(
  state: GameState,
  bundle: ContentBundle,
): QuizView | undefined {
  const quizId = state.quiz.activeQuizId;
  if (quizId === undefined) return undefined;
  const questionId = state.quiz.questionIds[state.quiz.index];
  const question =
    questionId === undefined ? undefined : bundle.questions.getById(questionId);
  if (question === undefined) return undefined;
  const quiz = bundle.quizzes.getById(quizId);
  if (quiz === undefined) return undefined;
  const questionCount = state.quiz.questionIds.length;
  return {
    quizId,
    prompt: question.prompt,
    options: question.options,
    questionNumber: state.quiz.index + 1,
    questionCount,
    passMark: quiz.passMark,
    remainingWrong: Math.max(
      0,
      questionCount -
        quiz.passMark -
        (state.quiz.answers.length - state.quiz.correctCount),
    ),
  };
}

function hintViews(
  state: GameState,
  bundle: ContentBundle,
): readonly HintView[] {
  const views: Array<HintView & { readonly shownTurn: number }> = [];
  for (const [hintId, record] of Object.entries(state.hints)) {
    const level = record.levelsShown.at(-1);
    if (level === undefined) continue;
    const definition = bundle.hints
      .getById(hintId)
      ?.levels.find((entry) => entry.level === level);
    if (definition === undefined) continue;
    views.push({
      hintId,
      level,
      text: definition.text,
      shownTurn: record.lastShownTurn ?? 0,
    });
  }
  views.sort((left, right) => left.shownTurn - right.shownTurn);
  return views.map(({ hintId, level, text }) => ({ hintId, level, text }));
}

const END_STATE_COMMANDS: ReadonlySet<Command['kind']> = new Set([
  'look',
  'examine',
  'inventory',
  'score',
  'help',
]);

export function createGame(dependencies: GameDependencies): Game {
  // The single fresh-state seam: every fresh start (including the fallback
  // below and the typed `restart` meta action) constructs state here only.
  const createFreshState = (): GameState => createInitial(dependencies.bundle);
  // The injected runtime state is the one live state object: injected appliers,
  // tracker and session already point at it, and every production system reads
  // and writes it. Restores still pass through createFromDto so the derived
  // score is rebuilt from progress.
  let state: GameState = dependencies.initialState ?? createFreshState();
  adoptSeed(dependencies.random, state);
  const isInjectedScore = dependencies.score !== undefined;
  const isInjectedSession = dependencies.session !== undefined;
  const isInjectedApply = dependencies.apply !== undefined;
  let score: ScoreTracker =
    dependencies.score ??
    createScoreTracker(state, { bundle: dependencies.bundle });
  let session: Session =
    dependencies.session ?? createSession(state, dependencies.bundle);
  let apply: (effect: Effect) => readonly GameEvent[] =
    dependencies.apply ??
    createEffectApplier(state, {
      random: dependencies.random,
      bundle: dependencies.bundle,
    }).apply;
  // The current suggestion is view state, not persisted game state. It comes
  // only from the NPC event stream; the panel never computes a prompt itself.
  let conversationPrompt: string | undefined;

  const evaluator = createConditionEvaluator();
  const ruleEngine = createRuleEngine({
    bundle: dependencies.bundle,
    evaluator,
    random: dependencies.random,
  });
  const check =
    dependencies.check ??
    ((command, current) => ruleEngine.check(command, current));
  const quizSystem = createQuizSystem({ bundle: dependencies.bundle });
  const dispatch =
    dependencies.dispatch ??
    ((command, context) => {
      // `answer` is the phase-3 quiz seam (application-and-ui.md §8). `hint`
      // emits nothing here: its delivery runs with the other phase-4 systems so
      // a puzzle solved in the same turn is reported before the hint.
      if (command.kind === 'answer') {
        return quizSystem.handle(command, context.state);
      }
      if (command.kind === 'hint') return [];
      const handler = getCommandHandler(command);
      return handler === undefined ? [] : handler(command, context);
    });

  // Phase 4 is composed per turn so each applier is bound to the live state,
  // including after save/load replaces it. All five systems are real: the hints
  // system delivers explicit requests here so a puzzle solved this turn is
  // reported before its hint.
  const productionReaction = (current: GameState): ComposedReaction => {
    const applier = createEffectApplier(current, {
      random: dependencies.random,
      bundle: dependencies.bundle,
    });
    return createComposedReaction({
      scheduler: createScheduler({ applier }),
      hazards: createHazardSystem({
        bundle: dependencies.bundle,
        evaluator,
        random: dependencies.random,
        applier,
      }),
      npcs: createDialogueSystem({
        bundle: dependencies.bundle,
        evaluator,
        random: dependencies.random,
        applier,
      }),
      puzzles: createPuzzleSystem({
        bundle: dependencies.bundle,
        evaluator,
        random: dependencies.random,
        applier,
      }),
      hints: createHintSystem({
        bundle: dependencies.bundle,
        evaluator,
        applier,
      }),
    });
  };

  const rebind = (): void => {
    if (!isInjectedScore) {
      score = createScoreTracker(state, { bundle: dependencies.bundle });
    }
    if (!isInjectedSession) {
      session = createSession(state, dependencies.bundle);
    }
    if (!isInjectedApply) {
      apply = createEffectApplier(state, {
        random: dependencies.random,
        bundle: dependencies.bundle,
      }).apply;
    }
  };

  const publish = (events: readonly GameEvent[]): readonly GameEvent[] => {
    for (const event of events) {
      if (event.type === 'topic-suggested') {
        conversationPrompt = event.text;
        continue;
      }
      if (event.type === 'conversation-ended') {
        conversationPrompt = undefined;
      }
    }
    dependencies.bus.publish(events);
    return events;
  };

  const replaceState = (
    next: GameState,
    shouldResetSession: boolean,
  ): readonly GameEvent[] => {
    state = next;
    adoptSeed(dependencies.random, state);
    conversationPrompt = undefined;
    rebind();
    dependencies.clearViews?.();
    if (shouldResetSession) session.newGame();
    return initialBatch(state, dependencies.bundle);
  };

  const saveGame = (): void => {
    recordSeed(dependencies.random, state);
    // SaveManager takes a plain DTO: a freshly created runtime state carries a
    // toDto() method and a derived score getter, neither of which is data.
    dependencies.saveManager.save(createFromDto(state).toDto());
  };

  // Fresh starts share one save/publish sequence; callers supply the fresh
  // state so each call site goes through the single construction seam above.
  const startFresh = (fresh: GameState): readonly GameEvent[] => {
    const events = replaceState(fresh, true);
    saveGame();
    return publish(events);
  };

  const downloadGame = (): void => {
    recordSeed(dependencies.random, state);
    const text = JSON.stringify(dependencies.saveManager.buildDto(state));
    const filename = `compsciquest-save-${dependencies.clock.now().replaceAll(/[:.]/gu, '-')}.json`;
    dependencies.downloadFile(filename, text);
  };

  const importGame = (text: string): LoadResult => {
    const result = dependencies.saveManager.validate(text);
    if (result.ok) {
      state = dependencies.saveManager.restore(result.dto);
      adoptSeed(dependencies.random, state);
      conversationPrompt = undefined;
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
        return startFresh(createFreshState());
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
    const violations = check(command, context.state);
    if (violations.length > 0) {
      for (const text of violations) {
        events.push({ type: 'message', text });
      }
      return events;
    }
    applyAll(dispatch(command, context), events);

    // Phase 4: one reaction pass, plus one extra when a reaction produces a
    // state-changing event that can enable another rule. A third pass is never
    // allowed (shared-rules.md §2). Systems return events; Game owns the
    // buffer and the single publication.
    // Compose the five phase-4 systems once per turn: both allowed passes must
    // reuse the same instances so once-per-turn guards stay intact. The
    // injected seam remains a single supplied function.
    const react = dependencies.react ?? productionReaction(context.state);
    const firstPass = react(context, events);
    events.push(...firstPass);
    if (firstPass.some((event) => event.type !== 'message')) {
      events.push(...react(context, events));
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
        command,
      };
      const events = runTurn(command, context);
      recordSeed(dependencies.random, state);
      const observed = session.observe(score.observe(events));
      // Autosave the final, post-observer state through the single save seam.
      saveGame();
      return publish(observed);
    },
    newGame(): void {
      startFresh(createFreshState());
    },
    continueGame(dto: SaveDto): void {
      publish(replaceState(createFromDto(dto.state), false));
    },
    restart(): void {
      startFresh(createFreshState());
    },
    getViewData(): GameViewData {
      const speaking = Object.entries(state.npcs).find(
        ([, npc]) => npc.stateId === TALKING_STATE,
      );
      const conversation =
        speaking === undefined
          ? undefined
          : {
              actorId: speaking[0],
              actorName:
                dependencies.bundle.actors.getById(speaking[0])?.aliases[0] ??
                speaking[0],
              ...(conversationPrompt && { prompt: conversationPrompt }),
            };
      const activeQuiz = quizView(state, dependencies.bundle);
      return {
        status: state.status,
        position: state.player.position,
        turn: state.turn,
        lives: state.player.lives,
        score: state.score,
        areas: areaViews(state, dependencies.bundle),
        ...(activeQuiz && { activeQuiz }),
        ...(conversation && { conversation }),
        hints: hintViews(state, dependencies.bundle),
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
      const message = result.ok
        ? 'Game imported.'
        : 'That save could not be imported.';
      publish([{ type: 'message', text: message }]);
      return result;
    },
  };
}

// Pure classification helper; a hoisted declaration stays available to submit()
// wherever it is placed in the module.
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
