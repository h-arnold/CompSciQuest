// Browser verification for engine issue 10 (ENG10-FEEDBACK-01). The settled
// contract is one player-facing line per answer: `Correct. ` or `Incorrect. `
// followed by the generated explanation unchanged. Suppressed bookkeeping and
// hint-penalty events must not leak into the transcript. Question IDs, option
// text and explanations come from the generated authored bundles; the displayed
// numbered options decide which number is typed, so a shuffled question order
// cannot make this test invent a course fact. Quiz panel and pass-mark display
// belong to other issues and are deliberately not asserted here.
import { expect, test, type Page } from 'playwright/test';
import { questions } from '../src/content/authored/questions';
import { quizzes } from '../src/content/authored/quizzes';
import {
  seedStorage,
  startFromLiveSave,
  submit,
  transcript,
  waitForLine,
  watchConsole,
} from './helpers';

const QUIZ_ID = 'quiz-switchyard';
const HINT_PENALTY = /hint penalty/iu;

type AuthoredQuestion = (typeof questions)[number];

const switchyard = quizzes.find((quiz) => quiz.id === QUIZ_ID);
if (switchyard === undefined) {
  throw new Error(`Generated authored quiz '${QUIZ_ID}' is missing`);
}
const switchyardQuestions = switchyard.questionIds.map((id) => {
  const question = questions.find((entry) => entry.id === id);
  if (question === undefined) {
    throw new Error(`Generated authored question '${id}' is missing`);
  }
  return question;
});

interface DisplayedQuestion {
  readonly question: AuthoredQuestion;
  readonly options: readonly string[];
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

async function displayedQuestion(page: Page): Promise<DisplayedQuestion> {
  // The prompt is the first direct paragraph (§6.1); the numbered options are
  // the panel's direct div children. The trailing requirement paragraph is a
  // separate live region and is deliberately not read as an option.
  const promptLine = await page
    .locator('.quiz-panel > p')
    .first()
    .textContent();
  const first = promptLine ?? '';
  const prompt = first.replace(/^Question \d+ of \d+: /u, '');
  const question = switchyardQuestions.find((entry) => entry.prompt === prompt);
  if (question === undefined) {
    throw new Error(`No generated authored question for prompt: ${prompt}`);
  }
  const lines = await page.locator('.quiz-panel > div').allTextContents();
  const options = numberedOptions(lines);
  expect(
    options,
    'the displayed options are the generated authored options, in order',
  ).toEqual(question.options);
  return { question, options };
}

// The authored question order is shuffled at quiz start, so the number typed is
// derived from the current panel rather than pinned to a question ID.
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
  // The second east lands on The Switch Floor; its scheduled overheat then
  // moves the party to The Binary Hall. Waiting for both real room titles
  // proves the entry effects have finished before the foreman is asked.
  await waitForLine(page, 'The Switch Floor');
  await waitForLine(page, 'The Binary Hall');
  await submit(page, 'ask foreman about switch-to-bit');
  await waitForLine(page, '> ask foreman about switch-to-bit');
  // `quiz-started` is a suppressed internal-ID event (application-and-ui.md
  // §6.1), so the panel and its first rendered question are the stable seam.
  await expect(page.locator('.quiz-panel')).toBeVisible();
  await expect(page.locator('.quiz-panel > p').first()).toContainText(
    'Question 1 of 3:',
  );
}

async function answerAndRead(
  page: Page,
  raw: string,
  before: readonly string[],
): Promise<readonly string[]> {
  await submit(page, raw);
  await waitForLine(page, `> ${raw}`);
  const lines = await transcript(page);
  return lines.slice(before.length);
}

function expectSingleFeedbackLine(
  added: readonly string[],
  expected: string,
): void {
  const feedback = added.filter(
    (line) => line.startsWith('Correct.') || line.startsWith('Incorrect.'),
  );
  expect(feedback, 'exactly one feedback line was appended').toEqual([
    expected,
  ]);
}

function expectNoLeaks(added: readonly string[], all: readonly string[]): void {
  const joined = added.join('\n');
  expect(joined).not.toContain(QUIZ_ID);
  for (const question of switchyardQuestions) {
    expect(joined).not.toContain(question.id);
  }
  expect(all).not.toContain('Hint penalty: 0.');
  expect(
    all.some((line) => HINT_PENALTY.test(line)),
    'no hint-penalty transcript line appeared',
  ).toBe(false);
}

test.describe('engine issue 10 — answer feedback wording', () => {
  let errors: () => readonly string[];

  test.beforeEach(async ({ page }) => {
    errors = watchConsole(page);
    await seedStorage(page, {});
  });

  test.afterEach(() => {
    expect(errors(), 'no console errors during the flow').toEqual([]);
  });

  test('ENG10-FEEDBACK-01 — a correct answer prints one Correct. line with the verbatim explanation', async ({
    page,
  }) => {
    await enterSwitchFloorQuiz(page);
    const displayed = await displayedQuestion(page);
    const raw = String(optionNumber(displayed, true));
    const before = await transcript(page);

    const added = await answerAndRead(page, raw, before);
    expectSingleFeedbackLine(
      added,
      `Correct. ${displayed.question.explanation}`,
    );
    expectNoLeaks(added, await transcript(page));
  });

  test('ENG10-FEEDBACK-01 — a wrong answer prints one Incorrect. line with the verbatim explanation', async ({
    page,
  }) => {
    await enterSwitchFloorQuiz(page);
    const displayed = await displayedQuestion(page);
    const raw = String(optionNumber(displayed, false));
    const before = await transcript(page);

    const added = await answerAndRead(page, raw, before);
    expectSingleFeedbackLine(
      added,
      `Incorrect. ${displayed.question.explanation}`,
    );
    expectNoLeaks(added, await transcript(page));
  });

  test('ENG10-FEEDBACK-01 — correct then wrong answers each add exactly one line, with no hint penalty', async ({
    page,
  }) => {
    await enterSwitchFloorQuiz(page);
    const first = await displayedQuestion(page);
    const beforeFirst = await transcript(page);
    const correctRaw = String(optionNumber(first, true));
    const firstAdded = await answerAndRead(page, correctRaw, beforeFirst);
    expectSingleFeedbackLine(
      firstAdded,
      `Correct. ${first.question.explanation}`,
    );

    const second = await displayedQuestion(page);
    const beforeSecond = await transcript(page);
    const wrongRaw = String(optionNumber(second, false));
    const secondAdded = await answerAndRead(page, wrongRaw, beforeSecond);
    expectSingleFeedbackLine(
      secondAdded,
      `Incorrect. ${second.question.explanation}`,
    );

    const all = await transcript(page);
    expectNoLeaks([...firstAdded, ...secondAdded], all);
  });
});
