// E2E-HINTRETRY-01..02 — a retry clears the transient hint view and a fresh
// hint can appear afterwards; New Game, Continue and Restart never leak a
// stale hint. Expected quiz, question and hint text all come from the generated
// authored bundles; crafted valid v1 saves only set deterministic engine state.
// Canonical nodes: Game.observeViewEvent()/getViewData(), HintPanel.refresh(),
// QuizPanel.refresh(), HintView (hints.md §3–4; combat.md §3, §5).
import { expect, test, type Page } from 'playwright/test';
import { actors } from '../src/content/authored/actors';
import { areas } from '../src/content/authored/areas';
import { hints } from '../src/content/authored/hints';
import { questions } from '../src/content/authored/questions';
import { quizzes } from '../src/content/authored/quizzes';
import {
  makeState,
  SAVED_AT,
  seedStorage,
  startFromLiveSave,
  submit,
  waitForLine,
  watchConsole,
} from './helpers';

type AuthoredQuiz = (typeof quizzes)[number];
type AuthoredQuestion = (typeof questions)[number];

function authoredQuiz(quizId: string): AuthoredQuiz {
  const quiz = quizzes.find((entry) => entry.id === quizId);
  if (quiz === undefined)
    throw new Error(`Authored quiz '${quizId}' is missing`);
  return quiz;
}

function authoredLevelOneHint(hintId: string): string {
  const sequence = hints.find((entry) => entry.id === hintId);
  const found = sequence?.levels.find((entry) => entry.level === 1);
  if (found === undefined) {
    throw new Error(`Authored hint '${hintId}' has no level 1`);
  }
  return found.text;
}

function questionFor(questionId: string): AuthoredQuestion {
  const question = questions.find((entry) => entry.id === questionId);
  if (question === undefined) {
    throw new Error(`Authored question '${questionId}' is missing`);
  }
  return question;
}

function quizPanel(page: Page) {
  return page.locator('.quiz-panel');
}

function hintPanel(page: Page) {
  return page.locator('.hint-panel');
}

async function expectHintHidden(page: Page): Promise<void> {
  await expect(hintPanel(page)).toHaveCount(1);
  await expect(hintPanel(page)).toBeHidden();
  expect(await hintPanel(page).textContent(), 'no stale hint text').toBe('');
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

async function displayedQuestion(
  page: Page,
  quiz: AuthoredQuiz,
): Promise<AuthoredQuestion> {
  // The prompt is the first direct paragraph (§6.1); numbered options are the
  // panel's direct div children, with the requirement as a separate live region.
  const promptLine = await quizPanel(page).locator('> p').first().textContent();
  const prompt = (promptLine ?? '').replace(/^Question \d+ of \d+: /u, '');
  const question = quiz.questionIds
    .map((id) => questionFor(id))
    .find((entry) => entry.prompt === prompt);
  if (question === undefined) {
    throw new Error(`No authored question matches prompt: ${prompt}`);
  }
  const lines = await quizPanel(page).locator('> div').allTextContents();
  expect(numberedOptions(lines)).toEqual(question.options);
  return question;
}

function wrongAnswer(question: AuthoredQuestion): string {
  const right = question.correctOptionIds[0] ?? 0;
  return String(((right + 1) % question.options.length) + 1);
}

async function enterSwitchFloorQuiz(page: Page): Promise<void> {
  await startFromLiveSave(page, { 'tutorial-complete': true });
  await submit(page, 'east');
  await waitForLine(page, 'The Network Hub');
  await submit(page, 'east');
  // Wait for the overheat to finish moving the party before asking the
  // foreman (ENG10 correction: room-entry effects must settle first).
  await waitForLine(page, 'The Switch Floor');
  await waitForLine(page, 'The Binary Hall');
  await submit(page, 'ask foreman about switch-to-bit');
  await waitForLine(page, '> ask foreman about switch-to-bit');
  await expect(quizPanel(page)).toBeVisible();
}

// A valid v1 state with a stale quiz-1 hint, quiz 1 passed and quiz 2
// available. Only authored IDs and authored hint text are used.
function staleHintSave(): string {
  const state = makeState();
  const binaryArea = areas.find((entry) =>
    entry.roomIds.includes('room-binary-hall'),
  );
  if (binaryArea === undefined) {
    throw new Error('No authored area contains room-binary-hall');
  }
  state['flags'] = {
    'quiz-passed:quiz-switchyard': true,
    'switches-set': true,
  };
  state['counters'] = { 'turns-since:puzzle-sort-the-data-types': 3 };
  state['quizAttempts'] = { 'quiz-data-types': 1 };
  state['hints'] = {
    'hint-switchyard': { levelsShown: [1], lastShownTurn: 1 },
  };
  state['rooms'] = {
    ...(state['rooms'] as Record<string, unknown>),
    'room-binary-hall': { inventory: [] },
  };
  state['player'] = {
    ...(state['player'] as Record<string, unknown>),
    position: {
      worldId: binaryArea.worldId,
      areaId: binaryArea.id,
      roomId: 'room-binary-hall',
    },
  };
  state['npcs'] = Object.fromEntries(
    actors.map((actor) => [
      actor.id,
      {
        stateId: actor.initialStateId,
        knownTopics: [],
        inventory: [],
        topicUses: {},
      },
    ]),
  );
  return JSON.stringify({ version: 1, savedAt: SAVED_AT, state });
}

async function continueFromSave(page: Page, save: string): Promise<void> {
  await seedStorage(page, { save });
  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('.workspace')).toBeVisible();
}

test.describe('ENG-HINTRETRY-01 — transient hint view clears on a quiz retry', () => {
  let errors: () => readonly string[];

  test.beforeEach(async ({ page }) => {
    errors = watchConsole(page);
    await seedStorage(page, {});
  });

  test.afterEach(() => {
    expect(errors(), 'no console errors during the hint flow').toEqual([]);
  });

  test('E2E-HINTRETRY-01 — a switchyard retry hides the quiz-1 hint and no stale hint remains', async ({
    page,
  }) => {
    const quiz = authoredQuiz('quiz-switchyard');
    await enterSwitchFloorQuiz(page);

    // The first wrong answer auto-offers authored level 1 of hint-switchyard.
    const first = await displayedQuestion(page, quiz);
    const firstRaw = wrongAnswer(first);
    await submit(page, firstRaw);
    await waitForLine(page, `> ${firstRaw}`);
    await expect(hintPanel(page)).toBeVisible();
    await expect(hintPanel(page)).toContainText(
      `Hint 1: ${authoredLevelOneHint('hint-switchyard')}`,
    );

    // Answer wrongly until the authored attempt ends; the hint stays visible.
    for (let guard = 0; guard < quiz.questionIds.length + 1; guard += 1) {
      if (await quizPanel(page).isHidden()) break;
      const current = await displayedQuestion(page, quiz);
      const raw = wrongAnswer(current);
      await submit(page, raw);
      await waitForLine(page, `> ${raw}`);
    }
    await expect(quizPanel(page)).toBeHidden();
    await expect(hintPanel(page)).toBeVisible();

    // Ordinary-command retry publishes quiz-started; the view-only clear
    // hides the stale hint without touching its persisted record.
    await submit(page, 'ask foreman about switch-to-bit');
    await waitForLine(page, '> ask foreman about switch-to-bit');
    await expect(quizPanel(page)).toBeVisible();
    await expectHintHidden(page);
  });

  test('E2E-HINTRETRY-01 — a fresh quiz 2 hint appears after the stale quiz 1 hint was cleared', async ({
    page,
  }) => {
    const staleText = authoredLevelOneHint('hint-switchyard');
    await continueFromSave(page, staleHintSave());
    await expect(hintPanel(page)).toBeVisible();
    await expect(hintPanel(page)).toContainText(`Hint 1: ${staleText}`);

    // Starting a different authored quiz clears the stale hint from the view.
    await submit(page, 'ask foreman about data types');
    await waitForLine(page, '> ask foreman about data types');
    await expect(quizPanel(page)).toBeVisible();
    await expectHintHidden(page);

    // A fresh hint from quiz 2's own authored sequence is now visible.
    await submit(page, 'hint');
    await waitForLine(page, '> hint');
    await expect(hintPanel(page)).toBeVisible();
    await expect(hintPanel(page)).toContainText(
      `Hint 1: ${authoredLevelOneHint('hint-data-types')}`,
    );
    expect(
      await hintPanel(page).textContent(),
      'no hint from quiz 1 remains in the panel',
    ).not.toContain(staleText);
  });

  test('E2E-HINTRETRY-02 — Restart, New Game and Continue leave no stale hint in the panel', async ({
    page,
  }) => {
    const stale = staleHintSave();
    await continueFromSave(page, stale);
    await expect(hintPanel(page)).toBeVisible();

    await page.getByRole('button', { name: 'Restart', exact: true }).click();
    await expect(page.locator('.workspace')).toBeVisible();
    await expectHintHidden(page);

    // A live save carrying a hint exists, but New Game starts fresh.
    await seedStorage(page, { save: stale });
    await page.goto('./');
    await page.getByRole('button', { name: 'New Game' }).click();
    await expect(page.locator('.workspace')).toBeVisible();
    await expectHintHidden(page);

    // Continue from a hint-free valid save also leaves the panel empty.
    await continueFromSave(
      page,
      JSON.stringify({
        version: 1,
        savedAt: SAVED_AT,
        state: makeState(),
      }),
    );
    await expectHintHidden(page);
  });
});
