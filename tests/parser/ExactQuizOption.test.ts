// WR3-A1/A2/A3: combat.md §4 accepts `answer N`, a bare `N` and exact option
// text; §3 step 4 owns the 1-based convention and the out-of-range rule.
// application-and-ui.md §5 owns the canonical Command union (answer/unknown)
// and §9 maps evaluate-answer to answer-evaluated. The canonical seams are
// resolveGameCommand() (src/application/commandResolution.ts:L353),
// answerCommand() (L324), bareAnswerCommand() (L312), Quiz.handle()
// (src/core/combat/QuizSystem.ts:L27) and evaluateAnswer()
// (src/core/effects/EffectApplier.ts:L344). Resolution is observed only through
// the returned Command and the emitted events; the fakes are in-memory only.
// The playtest's semicolon-string case is deliberately out of scope.
import { describe, expect, it } from 'vitest';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { Command } from '../../src/core/commands/Command';
import type { GameState } from '../../src/core/GameState';
import {
  authoredBundle,
  authoredGame,
  authoredState,
  gameplaySnapshot,
  messageTexts,
  readSave,
  switchyardProgress,
} from '../fixtures/authored';
import { catalogueOf } from '../fixtures/persistence';
import { makeParserBundle, makeParserState } from '../fixtures/parser';
import { loadSeam } from '../fixtures/seams';

type GameCommandResolver = (
  raw: string,
  state: GameState,
  bundle: ContentBundle,
) => Command;

interface Evaluation {
  readonly correct: boolean;
  readonly explanation: string;
}

const QUIZ_ID = 'quiz-stub';
const QUESTION_ID = 'question-stub';
const AUTHORED_QUIZ_ID = 'quiz-data-types';
const OPTIONS: readonly string[] = [
  'open <target>',
  'use <item> <target>',
  'unlock <item> <target>',
  'download, then import',
];
const EXPLANATION = 'Use the item on the target.';
const UNKNOWN_MESSAGE = "I don't understand that.";

function loadResolver(): Promise<GameCommandResolver> {
  return loadSeam<GameCommandResolver>(
    '../../src/application/commandResolution',
    'resolveGameCommand',
    'ward-round3-fixes WR3-A1/A2/A3; combat.md §4 accepted answer forms',
  );
}

function quizBundle(): ContentBundle {
  const base = makeParserBundle();
  return {
    ...base,
    quizzes: catalogueOf([
      {
        id: QUIZ_ID,
        actorId: 'npc-1',
        topicId: 'topic-1',
        score: 0,
        questionIds: [QUESTION_ID],
        passMark: 1,
        onPass: [],
        onFail: [],
      },
    ]),
    questions: catalogueOf([
      {
        id: QUESTION_ID,
        prompt: 'Choose the command shown.',
        options: OPTIONS,
        correctOptionIds: [1],
        explanation: EXPLANATION,
      },
    ]),
  };
}

function activeQuizState(): GameState {
  return makeParserState({
    quiz: {
      activeQuizId: QUIZ_ID,
      questionIds: [QUESTION_ID],
      index: 0,
      correctCount: 0,
      answers: [],
    },
  });
}

function snapshot(state: GameState): string {
  return JSON.stringify(state);
}

// A connected seam for the one focused event comparison: the authored quiz,
// storage, clock, random and bus are fakes, but the real resolver and quiz
// handler run so an answer form can be traced to answer-evaluated.
function downstreamBundle(): ContentBundle {
  const quiz = authoredBundle.quizzes.getById(AUTHORED_QUIZ_ID);
  if (quiz === undefined) {
    throw new Error(`The authored quiz '${AUTHORED_QUIZ_ID}' is missing.`);
  }
  return {
    ...authoredBundle,
    quizzes: catalogueOf([
      { ...quiz, questionIds: [QUESTION_ID], passMark: 1 },
    ]),
    questions: catalogueOf([
      {
        id: QUESTION_ID,
        prompt: 'Choose the command shown.',
        options: OPTIONS,
        correctOptionIds: [1],
        explanation: EXPLANATION,
      },
    ]),
  };
}

function evaluationsFor(raw: string): readonly Evaluation[] {
  const { game } = authoredGame({
    bundle: downstreamBundle(),
    state: authoredState({
      roomId: 'room-binary-hall',
      progress: [switchyardProgress()],
      quiz: {
        activeQuizId: AUTHORED_QUIZ_ID,
        questionIds: [QUESTION_ID],
        index: 0,
        correctCount: 0,
        answers: [],
      },
    }),
  });
  return game
    .submit(raw)
    .flatMap((event) =>
      event.type === 'answer-evaluated'
        ? { correct: event.correct, explanation: event.explanation }
        : [],
    );
}

describe('WR3 exact quiz option text', () => {
  it('WR3-A1: a displayed option resolves to its 1-based option before verb dispatch', async () => {
    const resolve = await loadResolver();
    const state = activeQuizState();
    const bundle = quizBundle();
    const before = snapshot(state);
    const cases: readonly (readonly [string, number])[] = [
      ['download, then import', 4],
      ['unlock <item> <target>', 3],
      ['open <target>', 1],
    ];

    for (const [raw, option] of cases) {
      expect
        .soft(
          resolve(raw, state, bundle),
          `${raw} is displayed option ${option} and must not fall through to a verb (combat.md §4)`,
        )
        .toEqual({ kind: 'answer', option });
      expect
        .soft(
          resolve(raw, state, bundle),
          'the exact option text must resolve identically to its answer N command',
        )
        .toEqual(resolve(`answer ${option}`, state, bundle));
    }
    expect.soft(snapshot(state)).toBe(before);
  });

  it('WR3-A1: unmatched free text is not coerced to an answer', async () => {
    const resolve = await loadResolver();
    const state = activeQuizState();
    const bundle = quizBundle();
    const before = snapshot(state);
    const raw = 'a made-up answer';

    expect
      .soft(
        resolve(raw, state, bundle),
        'an option that is not displayed stays on the unknown command path',
      )
      .toEqual({ kind: 'unknown', raw });
    expect.soft(snapshot(state)).toBe(before);
  });

  it('WR3-A1: exact option text produces the same answer-evaluated event as answer N', () => {
    const exact = evaluationsFor('unlock <item> <target>');
    const numeric = evaluationsFor('answer 3');

    expect.soft(exact).toEqual(numeric);
    expect.soft(exact).toContainEqual({
      correct: false,
      explanation: EXPLANATION,
    });
  });

  it('WR3-A2: answer N and a bare N still resolve to the same 1-based option', async () => {
    const resolve = await loadResolver();
    const state = activeQuizState();
    const bundle = quizBundle();
    const before = snapshot(state);

    expect
      .soft(
        resolve('answer 2', state, bundle),
        'answer 2 keeps its 1-based option',
      )
      .toEqual({ kind: 'answer', option: 2 });
    expect
      .soft(resolve('2', state, bundle), 'a bare 2 keeps the same option')
      .toEqual({ kind: 'answer', option: 2 });
    expect.soft(snapshot(state)).toBe(before);
  });

  it('WR3-A2: answer <exact option text> keeps the existing answerCommand text path', async () => {
    const resolve = await loadResolver();
    const state = activeQuizState();
    const bundle = quizBundle();
    const before = snapshot(state);
    const command = resolve('answer unlock <item> <target>', state, bundle);

    expect
      .soft(
        command,
        'the prefixed exact-text form stays an answer command, not a verb or unknown',
      )
      .toEqual({ kind: 'answer', option: expect.any(Number) });
    expect
      .soft(
        resolve('answer   UNLOCK <ITEM> <TARGET>  ', state, bundle),
        'the existing text path stays case-insensitive and trimmed',
      )
      .toEqual(command);
    expect.soft(snapshot(state)).toBe(before);
  });

  it('WR3-A2: both accepted numeric forms keep the same explanation and correctness', () => {
    const numeric = evaluationsFor('answer 2');
    const bare = evaluationsFor('2');

    expect.soft(bare).toEqual(numeric);
    expect.soft(numeric).toContainEqual({
      correct: true,
      explanation: EXPLANATION,
    });
  });

  it('WR3-A3: option-like text and a bare number stay unknown outside a quiz', async () => {
    const resolve = await loadResolver();
    const idle = makeParserState();
    const bundle = quizBundle();
    const before = snapshot(idle);

    for (const raw of [...OPTIONS, '2']) {
      expect
        .soft(
          resolve(raw, idle, bundle),
          `without an active quiz, ${raw} must not be intercepted as an answer`,
        )
        .toEqual({ kind: 'unknown', raw });
    }
    expect.soft(snapshot(idle)).toBe(before);
  });

  it('WR3-A3: outside a quiz the friendly unknown message is emitted with no quiz events', () => {
    const { game, storage } = authoredGame({
      state: authoredState({
        roomId: 'room-binary-hall',
        progress: [switchyardProgress()],
      }),
    });
    const before = gameplaySnapshot(readSave(game, storage).dto.state);

    for (const raw of ['download, then import', '2']) {
      const batch = game.submit(raw);
      expect
        .soft(messageTexts(batch), `${raw} gets the existing friendly refusal`)
        .toContain(UNKNOWN_MESSAGE);
      expect
        .soft(
          batch.some(
            (event) =>
              event.type === 'answer-evaluated' || event.type === 'quiz-ended',
          ),
          `${raw} must not reach the quiz pipeline outside a quiz`,
        )
        .toBe(false);
    }
    const after = readSave(game, storage).dto.state;
    expect.soft(after.quiz.activeQuizId).toBeUndefined();
    expect.soft(gameplaySnapshot(after)).toBe(before);
  });
});
