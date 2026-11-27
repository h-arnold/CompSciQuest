// ENG30-PASSMARK-01: quiz pass requirement and remaining wrong-answer
// allowance as view data (ENGINE_ISSUES.md decision row 30 L53, issues table
// #30 L88; PLAYTEST_ISSUES.md §30; combat.md §2/§3; application-and-ui.md
// §6.1, §7.1, §7.2). passMark is the authored count; remainingWrong is the
// count minus the wrong answers already given in the live attempt, clamped at
// zero. Both are derived at view-build time; the panel renders them as text
// and decides no rules. Attempts, lives, score and flags are ignored. No
// course fact is authored here.
import { afterEach, describe, expect, it } from 'vitest';
import type { QuizView } from '../../src/application/GameViewData';
import type { GameEvent } from '../../src/core/events/GameEvent';
import { formatEvent } from '../../src/ui/formatEvent';
import { QuizPanel } from '../../src/ui/QuizPanel';
import {
  activeQuizState,
  authoredBundle,
  authoredGame,
  authoredState,
  switchyardProgress,
} from '../fixtures/authored';
import { makeBundle } from '../fixtures/persistence';
import {
  installFakeDocument,
  makeViewData,
  restoreDocument,
  type FakeElement,
} from '../fixtures/ui';

afterEach(() => {
  restoreDocument();
});

function authoredQuiz(quizId: string) {
  const quiz = authoredBundle.quizzes.getById(quizId);
  if (quiz === undefined) {
    throw new Error(`Authored quiz '${quizId}' is missing from the catalogue.`);
  }
  return quiz;
}

function firstQuestion(quizId: string) {
  const questionId = authoredQuiz(quizId).questionIds[0];
  const question =
    questionId === undefined
      ? undefined
      : authoredBundle.questions.getById(questionId);
  if (question === undefined) {
    throw new Error(`Authored quiz '${quizId}' has no first question.`);
  }
  return question;
}

// Declares the contract fields explicitly so the stub is not a fresh literal
// checked against the pre-implementation five-field QuizView. Structural typing
// keeps it assignable to QuizView both before and after the interface grows.
interface PassMarkQuizView extends QuizView {
  readonly passMark: number;
  readonly remainingWrong: number;
}

describe('ENG30-PASSMARK-01: quiz view data (application-and-ui.md §7.2)', () => {
  it('ENG30-PASSMARK-01: activeQuiz carries passMark and remainingWrong derived from the authored quiz', () => {
    // quiz-switchyard is authored with passMark 2 and three questions, so the
    // two derived numbers are distinct: 2 to pass, 1 wrong answer affordable.
    const { game } = authoredGame({
      state: authoredState({
        quiz: activeQuizState('quiz-switchyard'),
      }),
    });
    const question = firstQuestion('quiz-switchyard');

    expect(game.getViewData().activeQuiz).toEqual({
      quizId: 'quiz-switchyard',
      prompt: question.prompt,
      options: question.options,
      questionNumber: 1,
      questionCount: 3,
      passMark: 2,
      remainingWrong: 1,
    });
  });

  it('ENG30-REANCHOR-UNIT-01: attempts, lives, score and flags are ignored while the crafted attempt has no wrong answers left', () => {
    // quiz-data-compression is authored with passMark 4 across five questions:
    // 4 to pass and 1 wrong answer affordable at the start of an attempt.
    // The second state has spent that allowance (answers.length - correctCount
    // is 1), so max(0, (5 - 4) - 1) is 0; passMark stays the authored count.
    const quizId = 'quiz-data-compression';
    const question = firstQuestion(quizId);
    const basePlayer = authoredState().player;
    const expectedBase = {
      quizId,
      prompt: question.prompt,
      options: question.options,
      questionNumber: 1,
      questionCount: 5,
      passMark: 4,
      remainingWrong: 1,
    };
    const states = [
      {
        state: authoredState({
          quiz: activeQuizState(quizId),
          flags: {},
          player: { ...basePlayer, lives: 3 },
          progress: [switchyardProgress({ earnedScore: 0 })],
          quizAttempts: {},
        }),
        expected: expectedBase,
      },
      {
        state: authoredState({
          quiz: activeQuizState(quizId, {
            correctCount: 2,
            answers: [0, 1, 0],
          }),
          flags: { 'failed-attempts:quiz-data-compression': true },
          player: { ...basePlayer, lives: 1 },
          progress: [switchyardProgress({ earnedScore: 99 })],
          quizAttempts: { [quizId]: 7 },
        }),
        expected: { ...expectedBase, remainingWrong: 0 },
      },
    ];

    for (const { state, expected } of states) {
      const { game } = authoredGame({ state });
      expect(game.getViewData().activeQuiz).toEqual(expected);
    }
  });
});

describe('ENG30-PASSMARK-01: QuizPanel text rendering (application-and-ui.md §7.1, §7.2)', () => {
  it('ENG30-PASSMARK-01: the panel shows both numbers as text beside the prompt and numbered options', () => {
    installFakeDocument();
    const panel = new QuizPanel();
    // Stub data: passMark 3 of 7 questions leaves 4 wrong answers affordable.
    // The prompt (1 of 7) and option numbers (1., 2.) contain neither 3 nor 4,
    // so each asserted digit must come from the new view fields.
    const quizView: PassMarkQuizView = {
      quizId: 'quiz-stub',
      prompt: 'Which <b>structure</b> repeats?',
      options: ['first <b>option</b>', 'second option'],
      questionNumber: 1,
      questionCount: 7,
      passMark: 3,
      remainingWrong: 4,
    };

    panel.refresh(makeViewData({ activeQuiz: quizView }));

    const text = panel.element.textContent;
    expect(panel.element.hidden).toBe(false);
    expect(text).toContain('Question 1 of 7: Which <b>structure</b> repeats?');
    expect(text).toContain('1. first <b>option</b>');
    expect(text).toContain('2. second option');
    expect(text).toMatch(/\b3\b/); // pass requirement, from passMark
    expect(text).toMatch(/\b4\b/); // wrong-answer allowance, from questionCount - passMark
    expect(panel.element.querySelector('b')).toBeNull();
    const element = panel.element as unknown as FakeElement;
    expect(element.innerHTMLWrites).toEqual([]);
    expect(element.querySelectorAll('button')).toHaveLength(0);
    expect(element.listenerCounts.get('click')).toBeUndefined();

    panel.refresh(makeViewData());
    expect(panel.element.hidden).toBe(true);
    expect(panel.element.textContent).toBe('');
  });
});

describe('ENG30-PASSMARK-01: untouched inherited contracts', () => {
  it('ENG30-PASSMARK-01: answer-evaluated keeps its byte-stable Correct./Incorrect. prefix', () => {
    const explanation =
      'A loop repeats the same block while its condition holds.';
    const base = {
      type: 'answer-evaluated',
      quizId: 'quiz-stub',
      questionId: 'question-stub',
      explanation,
    } as const;
    const bundle = makeBundle();

    expect(formatEvent({ ...base, correct: true }, bundle)).toEqual([
      `Correct. ${explanation}`,
    ]);
    expect(formatEvent({ ...base, correct: false }, bundle)).toEqual([
      `Incorrect. ${explanation}`,
    ]);
  });

  it('ENG30-PASSMARK-01: hint-penalty-applied still returns no lines', () => {
    const event: GameEvent = {
      type: 'hint-penalty-applied',
      hintId: 'hint-stub',
      delta: -1,
    };

    expect(formatEvent(event, makeBundle())).toEqual([]);
  });
});
