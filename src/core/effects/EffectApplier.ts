// Sole mutator for effect-driven fields (shared-rules.md §5). This slice
// implements the effects the persistence contracts exercise and gives every
// other documented effect its canonical event without inventing mechanics.
import type { ContentBundle } from '../../content/ContentBundle';
import {
  areaPairForRoom,
  areaPairForTopic,
  ensureProgressRow,
} from '../AreaProgress';
import type { GameState, RoomStateDto } from '../GameState';
import type { QuizQuestion } from '../combat/QuizQuestion';
import type { PuzzleStateDto } from '../PuzzleStateDto';
import type { QuizStateDto } from '../QuizStateDto';
import type { GameEvent, RoomSummary } from '../events/GameEvent';
import type { Random } from '../Random';
import type { Effect } from './Effect';

export interface EffectApplierDependencies {
  readonly random: Random;
  readonly bundle?: ContentBundle;
}

export interface EffectApplier {
  apply(effect: Effect): readonly GameEvent[];
}

function inventoryOf(state: GameState, ownerId: string): string[] | undefined {
  if (ownerId === 'player') {
    return (state.player as unknown as { inventory: string[] }).inventory;
  }
  const npc = state.npcs[ownerId];
  if (npc) return (npc as unknown as { inventory: string[] }).inventory;
  const room = state.rooms[ownerId];
  return room
    ? (room as unknown as { inventory: string[] }).inventory
    : undefined;
}

function transferItem(
  state: GameState,
  effect: Extract<Effect, { kind: 'transfer-item' }>,
): GameEvent {
  let target = inventoryOf(state, effect.toOwnerId);
  if (
    !target &&
    state.npcs[effect.toOwnerId] === undefined &&
    state.rooms[effect.toOwnerId] === undefined
  ) {
    const room: RoomStateDto = { inventory: [] };
    (state as { rooms: Record<string, RoomStateDto> }).rooms[effect.toOwnerId] =
      room;
    target = inventoryOf(state, effect.toOwnerId);
  }
  const source = inventoryOf(state, effect.fromOwnerId);
  if (source && target) {
    const index = source.indexOf(effect.itemId);
    if (index !== -1) {
      source.splice(index, 1);
      target.push(effect.itemId);
    }
  }
  return {
    type: 'item-moved',
    itemId: effect.itemId,
    fromOwnerId: effect.fromOwnerId,
    toOwnerId: effect.toOwnerId,
  };
}

function applyItemEffect(
  state: GameState,
  effect: Effect,
): readonly GameEvent[] | undefined {
  if (effect.kind === 'transfer-item') return [transferItem(state, effect)];
  if (effect.kind !== 'grant-item' && effect.kind !== 'remove-item')
    return undefined;
  const player = state.player as unknown as { inventory: string[] };
  const index = player.inventory.indexOf(effect.itemId);
  if (effect.kind === 'grant-item') {
    if (index === -1) player.inventory.push(effect.itemId);
  } else if (index !== -1) {
    player.inventory.splice(index, 1);
  }
  return [
    {
      type: 'item-moved',
      itemId: effect.itemId,
      fromOwnerId: effect.kind === 'grant-item' ? 'world' : 'player',
      toOwnerId: effect.kind === 'grant-item' ? 'player' : 'world',
    },
  ];
}

function applyStateEffect(
  state: GameState,
  effect: Effect,
  bundle: ContentBundle | undefined,
): readonly GameEvent[] | undefined {
  if (effect.kind === 'change-lives') {
    const player = state.player as { lives: number };
    player.lives = Math.max(0, player.lives + effect.delta);
    return [{ type: 'lives-changed', lives: player.lives }];
  }
  if (effect.kind === 'set-flag') {
    (state.flags as Record<string, boolean>)[effect.flag] = effect.value;
    return [{ type: 'flag-changed', flag: effect.flag, value: effect.value }];
  }
  if (effect.kind === 'message')
    return [{ type: 'message', text: effect.text }];
  if (effect.kind === 'complete-topic') {
    const pair = areaPairForTopic(bundle, effect.topicId) ?? {
      worldId: state.player.position.worldId,
      areaId: state.player.position.areaId,
    };
    const current = ensureProgressRow(state, bundle, pair.worldId, pair.areaId);
    if (!current.completedTopics.includes(effect.topicId)) {
      current.completedTopics.push(effect.topicId);
    }
    return [{ type: 'topic-completed', topicId: effect.topicId }];
  }
  if (effect.kind === 'schedule') {
    (state.schedule as unknown[]).push(effect.event);
    return [
      {
        type: 'scheduled',
        eventId: effect.event.id,
        kind: effect.event.kind,
        remainingTurns: effect.event.remainingTurns,
      },
    ];
  }
  return undefined;
}

function roomSummary(
  bundle: ContentBundle | undefined,
  roomId: string,
): RoomSummary {
  const room = bundle?.rooms.getById(roomId);
  return room === undefined
    ? { id: roomId, title: roomId, description: '', exits: [] }
    : {
        id: room.id,
        title: room.title,
        description: room.description,
        exits: room.exits.map((exit) => exit.direction),
      };
}

// walkthrough.md §8.2: entering a new area resets lives to that area's
// declared value. The value comes from the injected bundle, never from a
// literal; the change-lives branch above remains the sole writer and emits the
// canonical lives-changed event (application-and-ui.md §9).
function areaChangeEvents(
  state: GameState,
  bundle: ContentBundle | undefined,
  previous: { readonly worldId: string; readonly areaId: string },
  next: { readonly worldId: string; readonly areaId: string },
): readonly GameEvent[] {
  if (previous.worldId === next.worldId && previous.areaId === next.areaId) {
    return [];
  }
  const area = bundle?.areas.getById(next.areaId);
  if (area === undefined || area.worldId !== next.worldId) return [];
  const player = state.player as { lives: number };
  const delta = area.lives - player.lives;
  return delta === 0
    ? []
    : (applyStateEffect(
        state,
        { kind: 'change-lives', delta, reason: 'area change' },
        bundle,
      ) ?? []);
}

function applyEntityEffect(
  state: GameState,
  effect: Effect,
  bundle: ContentBundle | undefined,
): readonly GameEvent[] | undefined {
  if (effect.kind === 'move-player') {
    const player = state.player as {
      lives: number;
      position: { worldId: string; areaId: string; roomId: string };
    };
    const previous = player.position;
    const pair = areaPairForRoom(bundle, effect.roomId) ?? previous;
    const events: GameEvent[] = [
      {
        type: 'room-entered',
        room: roomSummary(bundle, effect.roomId),
      },
      ...areaChangeEvents(state, bundle, previous, pair),
    ];
    player.position = { ...pair, roomId: effect.roomId };
    return events;
  }
  if (effect.kind === 'set-actor-state') {
    const npc = state.npcs[effect.actorId] as { stateId: string } | undefined;
    if (npc) npc.stateId = effect.stateId;
    return [
      {
        type: 'actor-state-changed',
        actorId: effect.actorId,
        stateId: effect.stateId,
      },
    ];
  }
  if (effect.kind === 'learn-topic') {
    const npc = state.npcs[effect.actorId] as
      { knownTopics: string[] } | undefined;
    if (npc && !npc.knownTopics.includes(effect.topicId)) {
      npc.knownTopics.push(effect.topicId);
    }
    return [
      {
        type: 'knowledge-gained',
        actorId: effect.actorId,
        topicId: effect.topicId,
      },
    ];
  }
  if (effect.kind === 'enter-node') {
    const npc = state.npcs[effect.actorId] as
      { activeNodeId?: string } | undefined;
    if (npc) npc.activeNodeId = effect.nodeId;
    return [
      { type: 'node-entered', actorId: effect.actorId, nodeId: effect.nodeId },
    ];
  }
  if (effect.kind === 'exit-node') {
    const npc = state.npcs[effect.actorId] as
      { activeNodeId?: string } | undefined;
    if (npc) delete npc.activeNodeId;
    return [{ type: 'node-exited', actorId: effect.actorId }];
  }
  return undefined;
}

function shuffleQuestionIds(
  ids: readonly string[],
  random: Random,
): readonly string[] {
  const shuffled = [...ids];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapWith = random.nextInt(index + 1);
    const current = shuffled[index];
    const other = shuffled[swapWith];
    if (current === undefined || other === undefined) continue;
    shuffled[index] = other;
    shuffled[swapWith] = current;
  }
  return shuffled;
}

function questionAskedEvent(quizId: string, question: QuizQuestion): GameEvent {
  return {
    type: 'question-asked',
    quizId,
    questionId: question.id,
    prompt: question.prompt,
    options: question.options,
  };
}

function firstQuestionEvent(
  state: GameState,
  quizId: string,
  bundle: ContentBundle | undefined,
): readonly GameEvent[] {
  const questionId = state.quiz.questionIds[0];
  const question =
    questionId === undefined || bundle === undefined
      ? undefined
      : bundle.questions.getById(questionId);
  return question === undefined ? [] : [questionAskedEvent(quizId, question)];
}

function resetQuiz(state: GameState): void {
  (state as { quiz: QuizStateDto }).quiz = {
    questionIds: [],
    index: 0,
    correctCount: 0,
    answers: [],
  };
}

function startQuiz(
  state: GameState,
  effect: Extract<Effect, { kind: 'start-quiz' }>,
  bundle: ContentBundle | undefined,
  random: Random,
): readonly GameEvent[] {
  const quiz = bundle?.quizzes.getById(effect.quizId);
  const attempts = state.quizAttempts[effect.quizId] ?? 0;
  if (quiz?.attemptsAllowed !== undefined && attempts >= quiz.attemptsAllowed) {
    return [
      { type: 'message', text: 'There are no attempts left for this quiz.' },
    ];
  }
  (state.quizAttempts as Record<string, number>)[effect.quizId] = attempts + 1;
  const questionIds =
    quiz === undefined ? [] : shuffleQuestionIds(quiz.questionIds, random);
  (state as { quiz: QuizStateDto }).quiz = {
    activeQuizId: effect.quizId,
    questionIds,
    index: 0,
    correctCount: 0,
    answers: [],
  };
  return [
    {
      type: 'quiz-started',
      quizId: effect.quizId,
      actorId: effect.actorId,
    },
    ...firstQuestionEvent(state, effect.quizId, bundle),
  ];
}

function evaluateAnswer(
  state: GameState,
  effect: Extract<Effect, { kind: 'evaluate-answer' }>,
): readonly GameEvent[] {
  const current = state.quiz;
  const answers = [...current.answers, effect.option];
  const correctCount = current.correctCount + (effect.correct ? 1 : 0);
  (state as { quiz: QuizStateDto }).quiz = {
    ...current,
    index: current.index + 1,
    correctCount,
    answers,
  };
  if (!effect.correct) {
    const key = `failed-attempts:${effect.quizId}`;
    const counters = state.counters as Record<string, number>;
    counters[key] = (counters[key] ?? 0) + 1;
  }
  return [
    {
      type: 'answer-evaluated',
      quizId: effect.quizId,
      questionId: effect.questionId,
      correct: effect.correct,
      explanation: effect.explanation,
    },
  ];
}

function endQuiz(
  state: GameState,
  effect: Extract<Effect, { kind: 'end-quiz' }>,
  bundle: ContentBundle | undefined,
): readonly GameEvent[] {
  resetQuiz(state);
  const events: GameEvent[] = [
    {
      type: 'quiz-ended',
      quizId: effect.quizId,
      passed: effect.passed,
      reason: effect.reason,
    },
  ];
  const actorId = bundle?.quizzes.getById(effect.quizId)?.actorId;
  if (actorId === undefined) return events;
  const npc = state.npcs[actorId] as { stateId: string } | undefined;
  if (npc === undefined) return events;
  const ready = bundle?.actors.getById(actorId)?.initialStateId ?? 'ready';
  npc.stateId = ready;
  events.push({ type: 'actor-state-changed', actorId, stateId: ready });
  return events;
}

function showHint(
  state: GameState,
  effect: Extract<Effect, { kind: 'show-hint' }>,
  bundle: ContentBundle | undefined,
): readonly GameEvent[] {
  const hints = state.hints as Record<
    string,
    { levelsShown: readonly number[]; lastShownTurn?: number }
  >;
  const previous = hints[effect.hintId];
  const levelsShown = previous?.levelsShown.includes(effect.level)
    ? [...previous.levelsShown]
    : [...(previous?.levelsShown ?? []), effect.level];
  hints[effect.hintId] = { levelsShown, lastShownTurn: state.turn };
  const key = `hints-shown:${effect.hintId}`;
  const counters = state.counters as Record<string, number>;
  counters[key] = (counters[key] ?? 0) + 1;
  const penalty =
    bundle?.hints
      .getById(effect.hintId)
      ?.levels.find((level) => level.level === effect.level)?.scorePenalty ?? 0;
  return [
    {
      type: 'hint-shown',
      hintId: effect.hintId,
      level: effect.level,
      text: effect.text,
    },
    { type: 'hint-penalty-applied', hintId: effect.hintId, delta: penalty },
  ];
}

function applySystemEffect(
  state: GameState,
  effect: Effect,
  bundle: ContentBundle | undefined,
  random: Random,
): readonly GameEvent[] | undefined {
  if (
    effect.kind === 'set-puzzle-active' ||
    effect.kind === 'set-puzzle-solved'
  ) {
    const isActive = effect.kind === 'set-puzzle-active';
    const previous = state.puzzles[effect.puzzleId];
    (state.puzzles as Record<string, PuzzleStateDto>)[effect.puzzleId] = {
      ...previous,
      phase: isActive ? 'active' : 'solved',
    };
    const event: GameEvent = {
      type: isActive ? 'puzzle-activated' : 'puzzle-solved',
      puzzleId: effect.puzzleId,
    };
    return [event];
  }
  if (effect.kind === 'start-quiz')
    return startQuiz(state, effect, bundle, random);
  if (effect.kind === 'ask-question') {
    return [
      {
        type: 'question-asked',
        quizId: effect.quizId,
        questionId: effect.questionId,
        prompt: effect.prompt,
        options: effect.options,
      },
    ];
  }
  if (effect.kind === 'evaluate-answer') return evaluateAnswer(state, effect);
  if (effect.kind === 'end-quiz') return endQuiz(state, effect, bundle);
  if (effect.kind === 'show-hint') return showHint(state, effect, bundle);
  return undefined;
}

export function hazardTriggeredEvent(
  effect: Extract<Effect, { kind: 'announce-hazard' }>,
): GameEvent {
  return {
    type: 'hazard-triggered',
    hazardId: effect.hazardId,
    reason: effect.reason,
  };
}

function applyBookkeepingEffect(
  _state: GameState,
  effect: Effect,
): readonly GameEvent[] | undefined {
  return effect.kind === 'announce-hazard'
    ? [hazardTriggeredEvent(effect)]
    : undefined;
}

function applyEffect(
  state: GameState,
  effect: Effect,
  bundle: ContentBundle | undefined,
  random: Random,
): readonly GameEvent[] {
  const handlers = [
    applyItemEffect,
    (current: GameState, candidate: Effect) =>
      applyStateEffect(current, candidate, bundle),
    (current: GameState, candidate: Effect) =>
      applyEntityEffect(current, candidate, bundle),
    (current: GameState, candidate: Effect) =>
      applySystemEffect(current, candidate, bundle, random),
    applyBookkeepingEffect,
  ];
  for (const handler of handlers) {
    const events = handler(state, effect);
    if (events) return events;
  }
  return [{ type: 'message', text: '' }];
}

export function createEffectApplier(
  state: GameState,
  dependencies: EffectApplierDependencies,
): EffectApplier {
  // The injected source of randomness is retained for mechanic slices.
  const applier = {
    apply(effect: Effect): readonly GameEvent[] {
      return applyEffect(
        state,
        effect,
        dependencies.bundle,
        dependencies.random,
      );
    },
    random: dependencies.random,
  };
  return applier;
}
