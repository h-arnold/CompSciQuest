// Deterministic fixtures for the `ward-w7-fixes` slice. Every object is an
// in-memory test literal: no authored content prose, no real storage, clock,
// random source, network or file system.
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { Command } from '../../src/core/commands/Command';
import type { Effect } from '../../src/core/effects/Effect';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { GameState, GameStateDto } from '../../src/core/GameState';
import type { HintSequence } from '../../src/core/hints/HintSequence';
import type { ConversationTopic } from '../../src/core/npcs/ConversationTopic';
import type { Quiz } from '../../src/core/combat/Quiz';
import type { TurnContext } from '../../src/core/TurnContext';
import {
  catalogueOf,
  FakeRandom,
  makeBundle,
  makeRuntimeState,
  makeStateDto,
} from './persistence';
import { actorState, always, npcBundle, npcDto } from './npcs';

export const W7_WORLD_ID = 'world-fixture-ward';
export const W7_AREA_ID = 'area-fixture-ward';
export const W7_ROOM_ID = 'room-fixture-records';
export const W7_INTAKE_ROOM_ID = 'room-fixture-intake';
export const W7_DEMONSTRATION_ROOM_ID = 'room-fixture-demonstration';

// ---------------------------------------------------------------------------
// W7F-03..05 — unlock commands and in-world refusal
// ---------------------------------------------------------------------------

export const W7_KEY_ID = 'item-assistance-practice-key';
export const W7_CABINET_ID = 'item-assistance-practice-cabinet';
export const W7_KEY_NAME = 'Practice key';
export const W7_CABINET_NAME = 'Practice cabinet';
export const W7_KEY_ALIASES = ['practice key', 'ward practice key'];
export const W7_CABINET_ALIASES = ['practice cabinet', 'ward practice cabinet'];

export function w7UnlockBundle(): ContentBundle {
  const base = makeBundle();
  return {
    ...base,
    items: catalogueOf([
      {
        id: W7_KEY_ID,
        name: W7_KEY_NAME,
        aliases: W7_KEY_ALIASES,
        portable: true,
        description: 'A small practice key.',
        initialRoom: W7_ROOM_ID,
      },
      {
        id: W7_CABINET_ID,
        name: W7_CABINET_NAME,
        aliases: W7_CABINET_ALIASES,
        portable: false,
        description: 'A locked practice cabinet.',
        initialRoom: W7_ROOM_ID,
      },
    ]),
  };
}

export function w7UnlockState(hasKey: boolean): GameState {
  return makeRuntimeState(
    makeStateDto({
      player: {
        position: {
          worldId: W7_WORLD_ID,
          areaId: W7_AREA_ID,
          roomId: W7_ROOM_ID,
        },
        inventory: hasKey ? [W7_KEY_ID] : [],
        lives: 3,
      },
      rooms: {
        [W7_ROOM_ID]: { inventory: [W7_CABINET_ID] },
      },
      flags: {},
    }),
  );
}

export const W7_UNLOCK_COMMAND: Command = {
  kind: 'unlock',
  itemId: W7_KEY_ID,
  targetId: W7_CABINET_ID,
};

export function w7UnlockContext(state: GameState): TurnContext {
  return {
    turn: state.turn,
    state,
    bundle: w7UnlockBundle(),
    random: new FakeRandom([0]),
    command: W7_UNLOCK_COMMAND,
  };
}

export function stateSnapshot(state: GameState): string {
  return JSON.stringify({
    player: state.player,
    rooms: state.rooms,
    flags: state.flags,
    lives: state.player.lives,
    score: state.score,
  });
}

export function messageTexts(effects: readonly Effect[]): string[] {
  return effects.flatMap((effect) =>
    effect.kind === 'message' ? [effect.text] : [],
  );
}

export function eventTexts(events: readonly GameEvent[]): string[] {
  return events.flatMap((event) => ('text' in event ? [event.text] : []));
}

// ---------------------------------------------------------------------------
// W7F-06 — RuleEngine gate denial
// ---------------------------------------------------------------------------

export const W7_AUTHORS_BLOCKED_TEXT =
  "The teaching ports are dark until the ward's calibration mark is entered.";
export const W7_GATE_FALLBACK = 'That way is closed for now.';

type Condition = Parameters<
  import('../../src/core/rules/ConditionEvaluator').ConditionEvaluator['evaluate']
>[0];

export interface W7GateExit {
  readonly direction: 'east';
  readonly targetRoomId: string;
  readonly preconditions: readonly Condition[];
  readonly blockedText?: string;
}

export function w7GateBundle(exits: readonly W7GateExit[]): ContentBundle {
  const base = makeBundle();
  return {
    ...base,
    rooms: catalogueOf([
      {
        id: W7_ROOM_ID,
        title: 'Fixture records room',
        description: 'A deterministic fixture room.',
        exits,
        entryEffects: [],
        score: 0,
      },
    ]),
  };
}

export function w7GateState(): GameState {
  return makeRuntimeState(
    makeStateDto({
      player: {
        position: {
          worldId: W7_WORLD_ID,
          areaId: W7_AREA_ID,
          roomId: W7_ROOM_ID,
        },
        inventory: [],
        lives: 3,
      },
      rooms: { [W7_ROOM_ID]: { inventory: [] } },
      flags: {},
    }),
  );
}

// ---------------------------------------------------------------------------
// W7F-08/09/13 — AI keyword topics and quiz starts
// ---------------------------------------------------------------------------

export const W7_AI_ID = 'npc-fixture-ai';
export const W7_AI_ALIAS = 'ai';
export const W7_QUIZ_ID = 'quiz-assistance-orientation';
export const W7_ANSWERS_TOPIC_ID = 'topic-ai-ward-answers';
export const W7_EXPLICIT_TOPIC_ID = 'topic-ai-ward-orientation';

export const W7_KEYWORDS = {
  'topic-ai-ward-records': ['quiz', 'records'],
  'topic-ai-ward-conversation': ['talk to', 'conversation'],
  [W7_ANSWERS_TOPIC_ID]: ['quiz answers', 'practice test'],
  'topic-ai-ward-hints': ['how to answer', 'hints'],
  'topic-ai-ward-failure': ['failure', 'lives'],
  'topic-ai-ward-save': ['ask ai about save', 'save'],
} as const;

export type W7KeywordTopicId = keyof typeof W7_KEYWORDS;

function keywordTopic(
  id: W7KeywordTopicId,
  response: string,
): ConversationTopic {
  return {
    id,
    actorId: W7_AI_ID,
    match: { kind: 'special', keywords: [...W7_KEYWORDS[id]] },
    isActive: always,
    responses: [response],
    strategy: { kind: 'sequence' },
    effects: [],
  };
}

export function w7KeywordTopics(): readonly ConversationTopic[] {
  return [
    keywordTopic('topic-ai-ward-records', 'Fixture records reply.'),
    keywordTopic('topic-ai-ward-conversation', 'Fixture conversation reply.'),
    keywordTopic(W7_ANSWERS_TOPIC_ID, 'Fixture answers reply.'),
    keywordTopic('topic-ai-ward-hints', 'Fixture hints reply.'),
    keywordTopic('topic-ai-ward-failure', 'Fixture failure reply.'),
    keywordTopic('topic-ai-ward-save', 'Fixture save reply.'),
  ];
}

export function w7ExplicitTopics(): readonly ConversationTopic[] {
  const start: Effect = {
    kind: 'start-quiz',
    quizId: W7_QUIZ_ID,
    actorId: W7_AI_ID,
  };
  // In the guard fixture `practice test` is an explicit start form, so the
  // answers topic only owns the non-starting `quiz answers` phrase.
  const answers = keywordTopic(W7_ANSWERS_TOPIC_ID, 'Fixture answers reply.');
  const keywordWithoutStart = w7KeywordTopics().map((topic) =>
    topic.id === W7_ANSWERS_TOPIC_ID
      ? {
          ...answers,
          match: { kind: 'special' as const, keywords: ['quiz answers'] },
        }
      : topic,
  );
  return [
    ...keywordWithoutStart,
    {
      id: W7_EXPLICIT_TOPIC_ID,
      actorId: W7_AI_ID,
      match: {
        kind: 'special',
        keywords: ['orientation', 'audit', 'test', 'practice test'],
      },
      isActive: always,
      responses: ['Fixture explicit start reply.'],
      strategy: { kind: 'sequence' },
      effects: [start],
    },
  ];
}

export const W7_QUESTION_IDS = ['q-w7-1', 'q-w7-2'] as const;

export function w7QuizBundle(
  topics: readonly ConversationTopic[],
  items: ContentBundle['items']['all'] = [],
): ContentBundle {
  const base = npcBundle({
    actors: [
      {
        id: W7_AI_ID,
        aliases: [W7_AI_ALIAS],
        initialStateId: 'actorstate-fixture-ai',
      },
    ],
    states: [actorState('actorstate-fixture-ai'), actorState('talking')],
    topics,
  });
  const quiz: Quiz = {
    id: W7_QUIZ_ID,
    actorId: W7_AI_ID,
    topicId: 'topic-fixture-ward',
    score: 0,
    questionIds: [...W7_QUESTION_IDS],
    passMark: 1,
    onPass: [],
    onFail: [],
  };
  return {
    ...base,
    items: catalogueOf([...items]),
    quizzes: catalogueOf([quiz]),
    questions: catalogueOf(
      W7_QUESTION_IDS.map((id, index) => ({
        id,
        prompt: `Fixture question ${String(index + 1)}.`,
        options: ['First', 'Second'],
        correctOptionIds: [0],
        explanation: `Fixture explanation ${String(index + 1)}.`,
      })),
    ),
  };
}

export interface W7QuizStateOptions {
  readonly activeQuizId?: string;
  readonly heldItems?: readonly string[];
  readonly activeNodeId?: string;
}

export function w7QuizState(options: W7QuizStateOptions = {}): GameState {
  return makeRuntimeState(
    makeStateDto({
      player: {
        position: {
          worldId: W7_WORLD_ID,
          areaId: W7_AREA_ID,
          roomId: W7_ROOM_ID,
        },
        inventory: [...(options.heldItems ?? [])],
        lives: 3,
      },
      rooms: { [W7_ROOM_ID]: { inventory: [] } },
      flags: {},
      npcs: {
        [W7_AI_ID]: npcDto({
          stateId: 'actorstate-fixture-ai',
          ...(options.activeNodeId && {
            activeNodeId: options.activeNodeId,
          }),
        }),
      },
      quiz:
        options.activeQuizId === undefined
          ? { questionIds: [], index: 0, correctCount: 0, answers: [] }
          : {
              activeQuizId: options.activeQuizId,
              questionIds: [...W7_QUESTION_IDS],
              index: 1,
              correctCount: 1,
              answers: [0],
            },
      quizAttempts:
        options.activeQuizId === undefined ? {} : { [W7_QUIZ_ID]: 1 },
    }),
  );
}

// ---------------------------------------------------------------------------
// W7F-10 — SHOW/GIVE transfer feedback
// ---------------------------------------------------------------------------

export const W7_TRANSFER_ITEM_ID = 'item-fixture-tally-token';
export const W7_TRANSFER_ITEM_NAME = 'Tally token';

export function w7TransferItem(): ContentBundle['items']['all'][number] {
  return {
    id: W7_TRANSFER_ITEM_ID,
    name: W7_TRANSFER_ITEM_NAME,
    aliases: ['tally token'],
    portable: true,
    description: 'A small token.',
    initialRoom: W7_ROOM_ID,
  };
}

export function w7TransferTopic(
  id: string,
  effects: readonly Effect[],
): ConversationTopic {
  return {
    id,
    actorId: W7_AI_ID,
    match: {
      kind: 'askTell',
      objectIds: [W7_TRANSFER_ITEM_ID],
    },
    isActive: always,
    responses: ['Fixture teaching line stays unchanged.'],
    strategy: { kind: 'sequence' },
    effects,
  };
}

// ---------------------------------------------------------------------------
// W7F-12 — room-scoped hint ladders
// ---------------------------------------------------------------------------

export const W7_HINT_IDS = [
  'hint-assistance-orientation',
  'hint-assistance-intake',
  'hint-assistance-demonstration',
] as const;

function w7HintSequence(
  id: (typeof W7_HINT_IDS)[number],
  targetRoomId: string,
): HintSequence {
  return {
    id,
    targets: [targetRoomId],
    levels: [
      {
        level: 1,
        text: `Fixture ${id} level one.`,
        unlock: {
          kind: 'counter-at-least',
          key: `hints-shown:${id}`,
          value: 0,
        },
      },
      {
        level: 2,
        text: `Fixture ${id} level two.`,
        unlock: {
          kind: 'counter-at-least',
          key: `hints-shown:${id}`,
          value: 1,
        },
      },
      {
        level: 3,
        text: `Fixture ${id} level three.`,
        unlock: {
          kind: 'counter-at-least',
          key: `hints-shown:${id}`,
          value: 2,
        },
      },
    ],
  };
}

export function w7HintBundle(): ContentBundle {
  const base = makeBundle();
  const hints = [
    w7HintSequence('hint-assistance-orientation', W7_ROOM_ID),
    w7HintSequence('hint-assistance-intake', W7_INTAKE_ROOM_ID),
    w7HintSequence('hint-assistance-demonstration', W7_DEMONSTRATION_ROOM_ID),
  ];
  return {
    ...base,
    hints: catalogueOf(hints),
    quizzes: catalogueOf([
      {
        id: W7_QUIZ_ID,
        actorId: W7_AI_ID,
        topicId: 'topic-fixture-ward',
        score: 0,
        questionIds: [...W7_QUESTION_IDS],
        passMark: 1,
        onPass: [],
        onFail: [],
        hintSequenceId: 'hint-assistance-orientation',
      },
    ]),
    questions: catalogueOf(
      W7_QUESTION_IDS.map((id, index) => ({
        id,
        prompt: `Fixture question ${String(index + 1)}.`,
        options: ['First', 'Second'],
        correctOptionIds: [0],
        explanation: `Fixture explanation ${String(index + 1)}.`,
      })),
    ),
  };
}

export function w7HintState(
  roomId: string,
  options: {
    readonly activeQuizId?: string;
    readonly intakeLevelShown?: boolean;
  } = {},
): GameStateDto {
  const dto = makeStateDto({
    player: {
      position: { worldId: W7_WORLD_ID, areaId: W7_AREA_ID, roomId },
      inventory: [],
      lives: 3,
    },
    rooms: {
      [W7_ROOM_ID]: { inventory: [] },
      [W7_INTAKE_ROOM_ID]: { inventory: [] },
      [W7_DEMONSTRATION_ROOM_ID]: { inventory: [] },
    },
    flags: {},
    hints:
      options.intakeLevelShown === true
        ? { 'hint-assistance-intake': { levelsShown: [1], lastShownTurn: 3 } }
        : {},
    counters:
      options.intakeLevelShown === true
        ? { 'hints-shown:hint-assistance-intake': 1 }
        : {},
    quiz:
      options.activeQuizId === undefined
        ? { questionIds: [], index: 0, correctCount: 0, answers: [] }
        : {
            activeQuizId: options.activeQuizId,
            questionIds: [...W7_QUESTION_IDS],
            index: 0,
            correctCount: 0,
            answers: [],
          },
  });
  return dto;
}
