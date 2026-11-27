// Browser verification for ENG24-FRESHSTART-01 and the settled ENG30 live
// allowance. Fresh starts are exercised through the real Restart button and
// the typed `restart` alias, then through Continue after a reload. The quiz
// checks read the generated authored bundle and the rendered panel, so no
// content ID or expected number is invented by this file.
import { expect, test, type Page } from 'playwright/test';
import type { Quiz } from '../src/core/combat/Quiz';
import type { QuizQuestion } from '../src/core/combat/QuizQuestion';
import { questions } from '../src/content/authored/questions';
import { quizzes } from '../src/content/authored/quizzes';
import {
  makeState,
  readStorage,
  SAVE_KEY,
  scorePanel,
  seedStorage,
  START_POSITION,
  START_ROOM_TITLE,
  startNewGame,
  submit,
  transcript,
  waitForLine,
  watchConsole,
} from './helpers';

interface SaveEnvelope {
  readonly savedAt: string;
  readonly state: {
    readonly turn: number;
    readonly player: {
      readonly position: {
        readonly worldId: string;
        readonly areaId: string;
        readonly roomId: string;
      };
      readonly lives: number;
    };
    readonly quiz: {
      readonly activeQuizId?: string;
      readonly questionIds: readonly string[];
      readonly answers: readonly unknown[];
    };
  };
}

async function savedGame(page: Page): Promise<SaveEnvelope> {
  const raw = await readStorage(page, SAVE_KEY);
  expect(raw, 'the live save exists').not.toBeNull();
  return JSON.parse(raw as string) as SaveEnvelope;
}

function initialLives(): number {
  const player = makeState()['player'] as { readonly lives: number };
  return player.lives;
}

function authoredQuiz(quizId: string): Quiz {
  const quiz = quizzes.find((entry) => entry.id === quizId);
  if (quiz === undefined) {
    throw new Error(`Generated authored quiz '${quizId}' is missing`);
  }
  return quiz;
}

function authoredQuestion(questionId: string): QuizQuestion {
  const question = questions.find((entry) => entry.id === questionId);
  if (question === undefined) {
    throw new Error(`Generated authored question '${questionId}' is missing`);
  }
  return question;
}

function quizPanel(page: Page) {
  return page.locator('.quiz-panel');
}

function requirementNode(page: Page) {
  return page.locator('.quiz-panel > p');
}

function requirementLine(quiz: Quiz, wrongAnswersSpent = 0): string {
  const allowance = Math.max(
    0,
    quiz.questionIds.length - quiz.passMark - wrongAnswersSpent,
  );
  return `Pass mark: ${quiz.passMark} correct of ${quiz.questionIds.length}. Wrong answers allowed: ${allowance}.`;
}

async function displayedQuestion(
  page: Page,
  quiz: Quiz,
): Promise<QuizQuestion> {
  const questionLines = await quizPanel(page)
    .locator('> div')
    .allTextContents();
  const first = questionLines[0];
  const prompt = (first ?? '').replace(/^Question \d+ of \d+: /u, '');
  const question = quiz.questionIds
    .map((id) => authoredQuestion(id))
    .find((entry) => entry.prompt === prompt);
  if (question === undefined) {
    throw new Error(`No generated authored question for prompt: ${prompt}`);
  }
  return question;
}

async function answerNumber(
  page: Page,
  quiz: Quiz,
  isCorrect: boolean,
): Promise<string> {
  const question = await displayedQuestion(page, quiz);
  const right = question.correctOptionIds[0] ?? 0;
  const index = isCorrect ? right : (right + 1) % question.options.length;
  return String(index + 1);
}

async function enterSwitchFloorQuiz(page: Page): Promise<Quiz> {
  const quiz = authoredQuiz('quiz-switchyard');
  await startNewGame(page);
  await submit(page, 'east');
  await waitForLine(page, 'The Network Hub');
  await submit(page, 'east');
  // Waiting for both titles proves the scheduled overheat finished before the
  // foreman is asked (ENG10 correction).
  await waitForLine(page, 'The Switch Floor');
  await waitForLine(page, 'The Binary Hall');
  await submit(page, 'ask foreman about switch-to-bit');
  await expect(quizPanel(page)).toBeVisible();
  return quiz;
}

test.describe('engine follow-ups — fresh start and live allowance', () => {
  let errors: () => readonly string[];

  test.beforeEach(async ({ page }) => {
    errors = watchConsole(page);
    await seedStorage(page, {});
  });

  test.afterEach(() => {
    expect(errors(), 'no console errors during the flow').toEqual([]);
  });

  test('ENG24-FRESHSTART-01 — the Restart button persists a fresh game that Continue restores after reload', async ({
    page,
  }) => {
    await startNewGame(page);
    await submit(page, 'east');
    await waitForLine(page, 'The Network Hub');
    await submit(page, 'look');
    const progressed = await savedGame(page);
    expect(progressed.state.turn).toBeGreaterThan(0);
    expect(progressed.state.player.position.roomId).not.toBe(
      START_POSITION.roomId,
    );

    await page.getByRole('button', { name: 'Restart', exact: true }).click();
    const fresh = await savedGame(page);
    expect(fresh.savedAt).not.toBe(progressed.savedAt);
    expect(fresh.state.turn).toBe(0);
    expect(fresh.state.player.position).toEqual(START_POSITION);
    expect(fresh.state.player.lives).toBe(initialLives());
    expect(fresh.state.quiz.questionIds).toEqual([]);
    await expect(scorePanel(page)).toContainText('Score: 0');
    await expect(scorePanel(page)).toContainText(`Lives: ${initialLives()}`);

    await page.goto('./');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.locator('.workspace')).toBeVisible();
    await expect(page.locator('.output-log')).toContainText(START_ROOM_TITLE);
    expect(await savedGame(page)).toEqual(fresh);
  });

  test('ENG24-FRESHSTART-01 — typed restart persists a fresh game that Continue restores after reload', async ({
    page,
  }) => {
    await startNewGame(page);
    await submit(page, 'east');
    await waitForLine(page, 'The Network Hub');
    await submit(page, 'look');
    const progressed = await savedGame(page);
    expect(progressed.state.turn).toBeGreaterThan(0);

    await submit(page, 'restart');
    await expect(
      page.locator('.output-log > div', { hasText: '> restart' }),
    ).toHaveCount(1);
    const fresh = await savedGame(page);
    expect(fresh.savedAt).not.toBe(progressed.savedAt);
    expect(fresh.state.turn).toBe(0);
    expect(fresh.state.player.position).toEqual(START_POSITION);
    expect(fresh.state.player.lives).toBe(initialLives());
    expect(fresh.state.quiz.questionIds).toEqual([]);

    await page.goto('./');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.locator('.workspace')).toBeVisible();
    await expect(page.locator('.output-log')).toContainText(START_ROOM_TITLE);
    expect(await savedGame(page)).toEqual(fresh);
  });

  test('ENG30-REMAINING-02 — the live allowance drops on a wrong answer, holds on a correct answer and resets for the next quiz', async ({
    page,
  }) => {
    const quiz = await enterSwitchFloorQuiz(page);
    const before = await transcript(page);
    await expect(requirementNode(page)).toHaveText(requirementLine(quiz));
    expect(quiz.questionIds.length - quiz.passMark).toBe(1);

    const wrong = await answerNumber(page, quiz, false);
    const wrongQuestion = await displayedQuestion(page, quiz);
    await submit(page, wrong);
    await expect(requirementNode(page)).toHaveText(requirementLine(quiz, 1));
    const allLines = await transcript(page);
    const added = allLines.slice(before.length);
    expect(
      added.filter(
        (line) => line.startsWith('Correct.') || line.startsWith('Incorrect.'),
      ),
    ).toEqual([`Incorrect. ${wrongQuestion.explanation}`]);
    expect(
      await quizPanel(page)
        .locator('button, a, input, select, textarea, [role="button"]')
        .count(),
    ).toBe(0);
    await expect(quizPanel(page).locator('> div').first()).toContainText(
      'Question 2 of',
    );
    const nextQuestion = await displayedQuestion(page, quiz);
    expect(nextQuestion.id).not.toBe(wrongQuestion.id);

    const right = await answerNumber(page, quiz, true);
    await submit(page, right);
    await expect(requirementNode(page)).toHaveText(requirementLine(quiz, 1));

    // Finish this quiz, then start a different authored quiz from the same
    // NPC; the allowance must start from its own questionCount - passMark.
    const last = await answerNumber(page, quiz, true);
    await submit(page, last);
    await expect(quizPanel(page)).toBeHidden();
    const nextQuiz = authoredQuiz('quiz-data-types');
    await submit(page, 'ask foreman about data-types');
    await expect(quizPanel(page)).toBeVisible();
    await expect(requirementNode(page)).toHaveText(requirementLine(nextQuiz));
    expect(nextQuiz.questionIds.length - nextQuiz.passMark).toBe(1);
    await expect(quizPanel(page).locator('> div').first()).toContainText(
      'Question 1 of',
    );
  });
});
