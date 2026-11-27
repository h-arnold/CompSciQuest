// ENG30-REMAINING-02: the live wrong-answer allowance in QuizView
// (ENGINE_ISSUES.md decision row 30 L53; PLAYTEST_ISSUES.md §30 L316-322;
// combat.md §2 L24 and §3 L41; application-and-ui.md §6.1 and §7.2;
// storage-schema.md §3.2). passMark is the authored count and questionCount is
// QuizStateDto.questionIds.length; remainingWrong subtracts the wrong answers
// already recorded in this attempt and clamps at zero. No course facts are
// authored here: quiz IDs, questions and pass marks come from the catalogue.
import { describe, expect, it } from 'vitest';
import {
  activeQuizState,
  authoredBundle,
  authoredGame,
  authoredState,
} from '../fixtures/authored';

function authoredQuestionAt(quizId: string) {
  const quiz = authoredBundle.quizzes.getById(quizId);
  const questionId = quiz?.questionIds[1];
  const question =
    questionId === undefined
      ? undefined
      : authoredBundle.questions.getById(questionId);
  if (quiz === undefined || question === undefined) {
    throw new Error(`Authored quiz '${quizId}' has no second question.`);
  }
  return question;
}

function viewFor(
  quizId: string,
  overrides: Parameters<typeof activeQuizState>[1] = {},
) {
  const { game } = authoredGame({
    state: authoredState({ quiz: activeQuizState(quizId, overrides) }),
  });
  return game.getViewData().activeQuiz;
}

describe('ENG30-REMAINING-02: remainingWrong follows the live attempt (application-and-ui.md §7.2)', () => {
  it('ENG30-REMAINING-02: a correct answer leaves the wrong-answer allowance unchanged and passMark stays 2 of 3', () => {
    const quizId = 'quiz-switchyard';
    const question = authoredQuestionAt(quizId);

    expect(
      viewFor(quizId, { index: 1, answers: [0], correctCount: 1 }),
    ).toEqual({
      quizId,
      prompt: question.prompt,
      options: question.options,
      questionNumber: 2,
      questionCount: 3,
      passMark: 2,
      remainingWrong: 1,
    });
  });

  it('ENG30-REMAINING-02: one wrong answer reduces the allowance by one while passMark stays the authored count', () => {
    const quizId = 'quiz-switchyard';
    const question = authoredQuestionAt(quizId);

    expect(
      viewFor(quizId, { index: 1, answers: [1], correctCount: 0 }),
    ).toEqual({
      quizId,
      prompt: question.prompt,
      options: question.options,
      questionNumber: 2,
      questionCount: 3,
      passMark: 2,
      remainingWrong: 0,
    });
  });

  it('ENG30-REMAINING-02: multiple wrong answers keep reducing the allowance and clamp it at zero', () => {
    // quiz-data-compression is authored with passMark 4 of 5, so a single
    // wrong answer spends the whole allowance and further wrong answers must
    // not turn the view into a negative number.
    const quizId = 'quiz-data-compression';

    const twoWrong = viewFor(quizId, {
      index: 4,
      answers: [0, 1, 0, 1, 0],
      correctCount: 3,
    });
    expect(twoWrong?.passMark).toBe(4);
    expect(twoWrong?.questionCount).toBe(5);
    expect(twoWrong?.remainingWrong).toBe(0);

    const threeWrong = viewFor(quizId, {
      index: 4,
      answers: [0, 1, 0, 1, 0],
      correctCount: 2,
    });
    expect(threeWrong?.passMark).toBe(4);
    expect(threeWrong?.remainingWrong).toBe(0);
  });

  it('ENG30-REMAINING-02: a fresh QuizStateDto resets the allowance for a new attempt', () => {
    const quizId = 'quiz-switchyard';

    const spent = viewFor(quizId, { answers: [1], correctCount: 0 });
    expect(spent?.passMark).toBe(2);
    expect(spent?.remainingWrong).toBe(0);

    const newAttempt = viewFor(quizId);
    expect(newAttempt?.passMark).toBe(2);
    expect(newAttempt?.remainingWrong).toBe(1);
  });
});
