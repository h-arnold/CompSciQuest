// Revision-1 UI red tests for the view-data and panel contracts in
// application-and-ui.md §7.2 and branch-matrix rows UI-HINT-01..03.
// Panels are built on the existing plain-object DOM fake; no jsdom.
import { afterEach, describe, expect, it } from 'vitest';
import type { GameStateDto } from '../../src/core/GameState';
import { HintPanel } from '../../src/ui/HintPanel';
import { QuizPanel } from '../../src/ui/QuizPanel';
import {
  authoredBundle,
  authoredGame,
  authoredState,
  switchyardProgress,
} from '../fixtures/authored';
import {
  installFakeDocument,
  makeViewData,
  restoreDocument,
  type FakeElement,
} from '../fixtures/ui';

afterEach(() => {
  restoreDocument();
});

function activeQuiz(quizId: string): GameStateDto['quiz'] {
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
  };
}

function authoredHintText(hintId: string, level: number): string {
  const definition = authoredBundle.hints
    .getById(hintId)
    ?.levels.find((entry) => entry.level === level);
  if (definition === undefined) {
    throw new Error(`Authored hint '${hintId}' has no level ${level}.`);
  }
  return definition.text;
}

describe('quiz and hint view data (application-and-ui.md §7.2)', () => {
  it('UI-HINT-01: view data carries delivered hints and the active quiz, then drops the quiz', () => {
    const { game } = authoredGame({
      state: authoredState({
        roomId: 'room-binary-hall',
        counters: { 'turns-since:puzzle-sort-the-data-types': 3 },
        quiz: activeQuiz('quiz-data-types'),
        progress: [switchyardProgress()],
      }),
    });

    expect(game.submit('hint')).toContainEqual(
      expect.objectContaining({
        type: 'hint-shown',
        hintId: 'hint-data-types',
        level: 1,
      }),
    );
    const question = authoredBundle.questions.getById('q-dr-04');
    if (question === undefined) {
      throw new Error('The authored q-dr-04 question is missing.');
    }
    const view = game.getViewData();
    expect(view.hints).toContainEqual({
      hintId: 'hint-data-types',
      level: 1,
      text: authoredHintText('hint-data-types', 1),
    });
    expect(view.activeQuiz).toEqual({
      quizId: 'quiz-data-types',
      prompt: question.prompt,
      options: question.options,
      questionNumber: 1,
      questionCount: 4,
    });

    for (let guard = 0; guard < 4; guard += 1) {
      game.submit('answer 1');
    }
    const ended = game.getViewData();
    expect(ended).not.toHaveProperty('activeQuiz');
  });
});

describe('QuizPanel and HintPanel rendering (application-and-ui.md §7.1, §7.2)', () => {
  it('UI-HINT-02: QuizPanel shows the prompt and numbered options, hides without a quiz, and renders text only', () => {
    installFakeDocument();
    const panel = new QuizPanel();
    panel.refresh(makeViewData());
    expect(panel.element.hidden).toBe(true);
    expect(panel.element.textContent).toBe('');

    panel.refresh(
      makeViewData({
        activeQuiz: {
          quizId: 'quiz-stub',
          prompt: 'Which <b>type</b>?',
          options: ['first <b>option</b>', 'second option'],
          questionNumber: 2,
          questionCount: 5,
        },
      }),
    );
    expect(panel.element.hidden).toBe(false);
    expect(panel.element.textContent).toContain('Which <b>type</b>?');
    expect(panel.element.textContent).toContain('1. first <b>option</b>');
    expect(panel.element.textContent).toContain('2. second option');
    expect(panel.element.querySelector('b')).toBeNull();
    const element = panel.element as unknown as FakeElement;
    expect(element.innerHTMLWrites).toEqual([]);

    panel.refresh(makeViewData());
    expect(panel.element.hidden).toBe(true);
    expect(panel.element.textContent).toBe('');
  });

  it('UI-HINT-03: HintPanel shows the delivered hint, hides when none, and renders text only', () => {
    installFakeDocument();
    const panel = new HintPanel();
    panel.refresh(makeViewData());
    expect(panel.element.hidden).toBe(true);
    expect(panel.element.textContent).toBe('');

    panel.refresh(
      makeViewData({
        hints: [
          {
            hintId: 'hint-stub',
            level: 3,
            text: 'Check <b>the row</b> again.',
          },
        ],
      }),
    );
    expect(panel.element.hidden).toBe(false);
    expect(panel.element.textContent).toContain('Check <b>the row</b> again.');
    expect(panel.element.querySelector('b')).toBeNull();
    const element = panel.element as unknown as FakeElement;
    expect(element.innerHTMLWrites).toEqual([]);

    panel.refresh(makeViewData());
    expect(panel.element.hidden).toBe(true);
    expect(panel.element.textContent).toBe('');
  });
});
