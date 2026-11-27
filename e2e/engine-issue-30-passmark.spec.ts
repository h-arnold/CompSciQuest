// Browser verification for engine issue 30 (ENG30-PASSMARK-01). The quiz panel
// must state the pass requirement and the remaining wrong-answer allowance,
// both derived from the generated authored quiz (passMark) and the number of
// questions in play. No course fact or expected number is hard-coded here: the
// generated authored bundles supply every value, and the displayed numbered
// options decide which answer number is typed. Ordinary commands enter the
// switchyard quiz; crafted valid v1 saves enter other authored quizzes
// deterministically.
import { expect, test, type Page } from 'playwright/test';
import { questions } from '../src/content/authored/questions';
import { quizzes } from '../src/content/authored/quizzes';
import {
  makeState,
  SAVED_AT,
  seedStorage,
  startFromLiveSave,
  startNewGame,
  submit,
  transcript,
  waitForLine,
  watchConsole,
} from './helpers';

type AuthoredQuiz = (typeof quizzes)[number];
type AuthoredQuestion = (typeof questions)[number];

function authoredQuiz(quizId: string): AuthoredQuiz {
  const quiz = quizzes.find((entry) => entry.id === quizId);
  if (quiz === undefined) {
    throw new Error(`Generated authored quiz '${quizId}' is missing`);
  }
  return quiz;
}

function authoredQuestion(questionId: string): AuthoredQuestion {
  const question = questions.find((entry) => entry.id === questionId);
  if (question === undefined) {
    throw new Error(`Generated authored question '${questionId}' is missing`);
  }
  return question;
}

// application-and-ui.md §7.2: these values arrive ready-calculated in the view
// model. The UI renders them as text and decides no rules.
function requirementLine(
  quiz: AuthoredQuiz,
  questionCount: number,
  wrongAnswersSpent = 0,
): string {
  const remainingWrong = Math.max(
    0,
    questionCount - quiz.passMark - wrongAnswersSpent,
  );
  return `Pass mark: ${quiz.passMark} correct of ${questionCount}. Wrong answers allowed: ${remainingWrong}.`;
}

function quizPanel(page: Page) {
  return page.locator('.quiz-panel');
}

function requirementNode(page: Page) {
  return page.locator('.quiz-panel > p');
}

function numberedOptions(lines: readonly string[]): readonly string[] {
  return lines.map((line) => {
    const match = /^\d+\. (.+)$/u.exec(line.trim());
    if (match?.[1] === undefined) {
      throw new Error(`Quiz panel line is not a numbered option: ${line}`);
    }
    return match[1];
  });
}

interface DisplayedQuestion {
  readonly question: AuthoredQuestion;
  readonly options: readonly string[];
}

async function displayedQuestion(
  page: Page,
  quiz: AuthoredQuiz,
): Promise<DisplayedQuestion> {
  const lines = await quizPanel(page).locator('> div').allTextContents();
  const first = lines[0] ?? '';
  const prompt = first.replace(/^Question \d+ of \d+: /u, '');
  const question = quiz.questionIds
    .map((id) => authoredQuestion(id))
    .find((entry) => entry.prompt === prompt);
  if (question === undefined) {
    throw new Error(`No generated authored question for prompt: ${prompt}`);
  }
  const options = numberedOptions(lines.slice(1));
  expect(
    options,
    'displayed options are the authored options, in order',
  ).toEqual(question.options);
  return { question, options };
}

function optionNumber(
  displayed: DisplayedQuestion,
  isCorrect: boolean,
): number {
  const right = displayed.question.correctOptionIds[0] ?? 0;
  const index = isCorrect ? right : (right + 1) % displayed.options.length;
  return index + 1;
}

async function enterSwitchFloorQuiz(page: Page): Promise<void> {
  await startFromLiveSave(page, { 'tutorial-complete': true });
  await submit(page, 'east');
  await waitForLine(page, 'The Network Hub');
  await submit(page, 'east');
  // The second east lands on The Switch Floor, whose scheduled overheat moves
  // the party on to The Binary Hall. Waiting for both titles proves the room
  // entry effects finished before the foreman is asked (ENG10 correction).
  await waitForLine(page, 'The Switch Floor');
  await waitForLine(page, 'The Binary Hall');
  await submit(page, 'ask foreman about switch-to-bit');
  await waitForLine(page, '> ask foreman about switch-to-bit');
  // `quiz-started` is a suppressed internal-ID event, so the rendered panel
  // is the stable seam for an active quiz.
  await expect(quizPanel(page)).toBeVisible();
}

async function enterQuizFromSave(
  page: Page,
  quiz: AuthoredQuiz,
): Promise<void> {
  const state = makeState();
  const quizState = state['quiz'] as Record<string, unknown>;
  quizState['activeQuizId'] = quiz.id;
  quizState['questionIds'] = [...quiz.questionIds];
  quizState['index'] = 0;
  quizState['correctCount'] = 0;
  quizState['answers'] = [];
  const save = JSON.stringify({ version: 1, savedAt: SAVED_AT, state });
  await seedStorage(page, { save });
  await page.goto('./');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('.workspace')).toBeVisible();
  await expect(quizPanel(page)).toBeVisible();
}

async function expectRequirement(
  page: Page,
  quiz: AuthoredQuiz,
  questionCount: number,
  wrongAnswersSpent = 0,
): Promise<void> {
  await expect(requirementNode(page)).toHaveText(
    requirementLine(quiz, questionCount, wrongAnswersSpent),
  );
  // Text-only: no injected markup and no clickable option controls. Answers
  // stay in the labelled Command textbox (application-and-ui.md §7.2).
  expect(await requirementNode(page).locator('*').count()).toBe(0);
  expect(
    await quizPanel(page)
      .locator('button, a, input, select, textarea, [role="button"]')
      .count(),
  ).toBe(0);
}

test.describe('ENG30-PASSMARK-01 — quiz pass requirement and wrong allowance', () => {
  let errors: () => readonly string[];

  test.beforeEach(async ({ page }) => {
    errors = watchConsole(page);
    await seedStorage(page, {});
  });

  test.afterEach(() => {
    expect(errors(), 'no console errors during the flow').toEqual([]);
  });

  test('ENG30-PASSMARK-01 — a real switchyard quiz shows the derived pass line beside the unchanged prompt and numbered options', async ({
    page,
  }) => {
    const quiz = authoredQuiz('quiz-switchyard');
    await enterSwitchFloorQuiz(page);

    const displayed = await displayedQuestion(page, quiz);
    const lines = await quizPanel(page).locator('> div').allTextContents();
    expect(lines[0]).toBe(
      `Question 1 of ${quiz.questionIds.length}: ${displayed.question.prompt}`,
    );
    expect(numberedOptions(lines.slice(1))).toEqual(displayed.question.options);
    await expectRequirement(page, quiz, quiz.questionIds.length);
  });

  test('ENG30-PASSMARK-01 — the wrong-answer allowance drops by one after an incorrect answer while the question advances', async ({
    page,
  }) => {
    const quiz = authoredQuiz('quiz-switchyard');
    const questionCount = quiz.questionIds.length;
    await enterSwitchFloorQuiz(page);
    const displayed = await displayedQuestion(page, quiz);
    const raw = String(optionNumber(displayed, false));
    const before = await transcript(page);
    // The settled switchyard allowance starts at one spare wrong answer
    // (passMark 2 of 3). This is derived from the authored bundle, not pinned.
    const startingAllowance = questionCount - quiz.passMark;
    expect(startingAllowance).toBe(1);
    await expectRequirement(page, quiz, questionCount);

    await submit(page, raw);
    await waitForLine(page, `> ${raw}`);
    const addedAll = await transcript(page);
    const added = addedAll.slice(before.length);
    const feedback = added.filter(
      (line) => line.startsWith('Correct.') || line.startsWith('Incorrect.'),
    );
    expect(feedback).toEqual([`Incorrect. ${displayed.question.explanation}`]);

    await expect(quizPanel(page)).toBeVisible();
    const questionLines = await quizPanel(page)
      .locator('> div')
      .allTextContents();
    expect(questionLines[0]).toMatch(/^Question 2 of \d+: /u);
    const next = await displayedQuestion(page, quiz);
    expect(next.question.id).not.toBe(displayed.question.id);
    // One wrong answer spent: the allowance falls 1 → 0 and the panel stays
    // text-only with numbered, authored options for the advanced question.
    expect(startingAllowance - 1).toBe(0);
    await expectRequirement(page, quiz, questionCount, 1);
  });

  test('ENG30-PASSMARK-01 — no active quiz hides the panel and leaves no pass line', async ({
    page,
  }) => {
    await startNewGame(page);
    await expect(quizPanel(page)).toBeHidden();
    await expect(requirementNode(page)).toHaveCount(0);
    await expect(page.locator('.output-log')).toHaveAttribute(
      'aria-live',
      'polite',
    );
  });

  for (const quizId of [
    'quiz-switchyard',
    'quiz-data-compression',
    'quiz-pattern-bureau',
  ] as const) {
    test(`ENG30-PASSMARK-01 — a crafted valid save for ${quizId} shows its own derived numbers`, async ({
      page,
    }) => {
      const quiz = authoredQuiz(quizId);
      const questionCount = quiz.questionIds.length;
      await enterQuizFromSave(page, quiz);

      const firstQuestion = authoredQuestion(quiz.questionIds[0] ?? '');
      const questionLines = await quizPanel(page)
        .locator('> div')
        .allTextContents();
      expect(questionLines[0]).toBe(
        `Question 1 of ${questionCount}: ${firstQuestion.prompt}`,
      );
      await expectRequirement(page, quiz, questionCount);
      expect(questionCount - quiz.passMark).toBeGreaterThanOrEqual(0);
      await expect(requirementNode(page)).toHaveText(
        `Pass mark: ${quiz.passMark} correct of ${questionCount}. Wrong answers allowed: ${questionCount - quiz.passMark}.`,
      );
    });
  }
});
