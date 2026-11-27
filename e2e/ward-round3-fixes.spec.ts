// Browser coverage for the round-3 ward fixes (WR3-A1, WR3-A2, WR3-A3).
// Every command goes through the real Command box; all question IDs, option
// strings, explanations and quiz effects come from the generated authored
// bundles rather than invented fixtures. Authority: branch-matrix.md WR3-*
// rows, docs/developer/combat.md §§3–4 and application-and-ui.md §§5, 9.
import { expect, test, type Page } from 'playwright/test';
import { questions } from '../src/content/authored/questions';
import { quizzes } from '../src/content/authored/quizzes';
import {
  SAVE_KEY,
  readStorage,
  seedStorage,
  startFromLiveSave,
  startNewGame,
  submit,
  transcript,
  waitForLine,
  watchConsole,
} from './helpers';

const QUIZ_ID = 'quiz-assistance-orientation';
const COMPLETED_TOPIC = 'tutorial-mechanics';
const UNKNOWN = "I don't understand that.";
const OUT_OF_RANGE = 'That answer is not one of the choices.';
const PASSABLE = [
  'download, then import',
  'unlock <item> <target>',
  'open <target>',
] as const;

// Accepted recovery records gate the orientation handoff in Records; seeding
// them on a live New Game save keeps every authored room inventory and NPC
// state intact (the ward-round2 helper's established pattern).
const RECOVERY_FLAGS = {
  'nia-observation-recovered': true,
  'mateo-reading-recovered': true,
  'priya-reasoning-recovered': true,
  'kofi-operation-recovered': true,
} as const;

interface QuizState {
  readonly activeQuizId?: string;
  readonly questionIds: readonly string[];
  readonly index: number;
  readonly correctCount: number;
  readonly answers: readonly number[];
}

type AuthoredQuestion = (typeof questions)[number];

function authoredQuiz() {
  const found = quizzes.find((quiz) => quiz.id === QUIZ_ID);
  if (found === undefined) throw new Error(`No authored quiz ${QUIZ_ID}`);
  return found;
}

function authoredPassMessage(): { readonly text: string } {
  const message = authoredQuiz().onPass.find(
    (effect) => effect.kind === 'message',
  );
  if (message === undefined || message.kind !== 'message') {
    throw new Error('Authored quiz has no pass message');
  }
  return message;
}

function authoredQuestion(questionId: string): AuthoredQuestion {
  const found = questions.find((question) => question.id === questionId);
  if (found === undefined)
    throw new Error(`No authored question ${questionId}`);
  return found;
}

function currentQuestion(state: QuizState): AuthoredQuestion {
  const questionId = state.questionIds[state.index];
  if (questionId === undefined) throw new Error('No current quiz question');
  return authoredQuestion(questionId);
}

function optionIndex(question: AuthoredQuestion, raw: string): number {
  return question.options.findIndex(
    (option) =>
      option.trim().toLocaleLowerCase('en-GB') ===
      raw.trim().toLocaleLowerCase('en-GB'),
  );
}

function correctIndex(question: AuthoredQuestion): number {
  const index = question.correctOptionIds[0];
  if (index === undefined) throw new Error('Question has no correct option');
  return index;
}

function questionWithOption(raw: string): AuthoredQuestion {
  const found = authoredQuiz()
    .questionIds.map((id) => authoredQuestion(id))
    .find((question) => optionIndex(question, raw) !== -1);
  if (found === undefined) throw new Error(`No authored question shows ${raw}`);
  return found;
}

async function savedQuiz(page: Page): Promise<QuizState> {
  await submit(page, 'save');
  await expect.poll(() => readStorage(page, SAVE_KEY)).not.toBeNull();
  const raw = await readStorage(page, SAVE_KEY);
  if (raw === null) throw new Error('Save was not written');
  return (JSON.parse(raw) as { state: { quiz: QuizState } }).state.quiz;
}

interface LiveState {
  readonly quiz: QuizState;
  readonly flags: Record<string, boolean>;
  readonly player: {
    readonly inventory: readonly string[];
    readonly lives: number;
    readonly position: { readonly roomId: string };
  };
  readonly progress: readonly {
    readonly completedTopics: readonly string[];
    readonly earnedScore: number;
  }[];
  readonly turn: number;
}

async function liveState(page: Page): Promise<LiveState> {
  await submit(page, 'save');
  await expect.poll(() => readStorage(page, SAVE_KEY)).not.toBeNull();
  const raw = await readStorage(page, SAVE_KEY);
  if (raw === null) throw new Error('Save was not written');
  return (JSON.parse(raw) as { state: LiveState }).state;
}

const ROUTE: readonly (readonly [string, string])[] = [
  ['east', 'The Network Hub'],
  ['south', 'Intake Bay'],
  ['east', 'Demonstration Ward'],
  ['north', 'Records Office'],
];

async function enterOrientationQuiz(page: Page): Promise<void> {
  await startFromLiveSave(page, RECOVERY_FLAGS);
  for (const [command, title] of ROUTE) {
    await submit(page, command);
    await waitForLine(page, title);
  }
  await submit(page, 'ask ai about orientation');
  await expect(page.locator('.quiz-panel')).toBeVisible();
  const started = await savedQuiz(page);
  expect(started.activeQuizId).toBe(QUIZ_ID);
}

async function answerCorrectly(page: Page): Promise<void> {
  const question = currentQuestion(await savedQuiz(page));
  await submit(page, String(correctIndex(question) + 1));
}

// The authored quiz shuffles its question ids, so reach the target question by
// answering earlier ones correctly rather than assuming a fixed first prompt.
async function reachQuestion(page: Page, targetId: string): Promise<void> {
  for (let step = 0; step < authoredQuiz().questionIds.length; step += 1) {
    const state = await savedQuiz(page);
    if (state.questionIds[state.index] === targetId) return;
    if (state.activeQuizId === undefined) {
      throw new Error(`Quiz ended before reaching ${targetId}`);
    }
    await answerCorrectly(page);
  }
  throw new Error(`Never reached ${targetId}`);
}

test.describe('ward round 3 — exact displayed quiz options', () => {
  let errors: () => readonly string[];

  test.beforeEach(async ({ page }) => {
    errors = watchConsole(page);
    await seedStorage(page);
  });

  test.afterEach(() => {
    expect(errors(), 'no application console errors during the flow').toEqual(
      [],
    );
  });

  for (const raw of PASSABLE) {
    test(`WR3-A1 — the displayed option "${raw}" answers the live question`, async ({
      page,
    }) => {
      const question = questionWithOption(raw);
      await enterOrientationQuiz(page);
      await reachQuestion(page, question.id);

      await expect(page.locator('.quiz-panel')).toContainText(raw);
      const before = await savedQuiz(page);
      const index = optionIndex(question, raw);
      expect(index).toBeGreaterThanOrEqual(0);
      // §6.1 renders answer-evaluated as the canonical verdict followed by
      // the verbatim authored explanation. The displayed option decides which
      // verdict applies, so no expectation is loosened.
      const verdict =
        index === correctIndex(question) ? 'Correct. ' : 'Incorrect. ';

      await submit(page, raw);
      await waitForLine(page, `> ${raw}`);
      const lines = await transcript(page);
      const at = lines.indexOf(`> ${raw}`);
      expect(at).toBeGreaterThanOrEqual(0);
      expect(lines[at + 1]).toBe(`${verdict}${question.explanation}`);

      const after = await savedQuiz(page);
      if (after.activeQuizId === undefined) {
        // The comma-bearing option is authored as the final question; that
        // answer ends the quiz and clears its in-progress state by design.
        expect(after.answers).toEqual([]);
        expect(lines).toContain(authoredPassMessage().text);
        return;
      }
      expect(after.answers).toEqual([...before.answers, index]);
      expect(after.correctCount).toBe(
        before.correctCount + (index === correctIndex(question) ? 1 : 0),
      );
      expect(after.index).toBe(before.index + 1);
      expect(await page.locator('.quiz-panel').textContent()).not.toBe('');
    });
  }

  test('WR3-A1 — exact option text records the same choice as answer N', async ({
    page,
  }) => {
    const raw = 'unlock <item> <target>';
    const question = questionWithOption(raw);
    await enterOrientationQuiz(page);
    await reachQuestion(page, question.id);
    const index = optionIndex(question, raw);

    await submit(page, `answer ${index + 1}`);
    await waitForLine(page, `> answer ${index + 1}`);
    const numeric = await savedQuiz(page);
    expect(await transcript(page)).toContain(
      `Correct. ${question.explanation}`,
    );

    // A second quiz run substitutes only the answer form; the seeded save gives
    // the same shuffled question order on both runs.
    await enterOrientationQuiz(page);
    await reachQuestion(page, question.id);
    await submit(page, raw);
    await waitForLine(page, `> ${raw}`);
    const exact = await savedQuiz(page);
    expect(await transcript(page)).toContain(
      `Correct. ${question.explanation}`,
    );

    expect(exact.answers).toEqual(numeric.answers);
    expect(exact.correctCount).toBe(numeric.correctCount);
    expect(exact.index).toBe(numeric.index);
  });

  test('WR3-A1 — a comma-bearing final option matches the answer N outcome', async ({
    page,
  }) => {
    const raw = 'download, then import';
    const question = questionWithOption(raw);
    const index = optionIndex(question, raw);

    await enterOrientationQuiz(page);
    await reachQuestion(page, question.id);
    await submit(page, `answer ${index + 1}`);
    await waitForLine(page, `> answer ${index + 1}`);
    expect(await transcript(page)).toContain(
      `Correct. ${question.explanation}`,
    );
    const numericState = await liveState(page);

    await enterOrientationQuiz(page);
    await reachQuestion(page, question.id);
    await submit(page, raw);
    await waitForLine(page, `> ${raw}`);
    const exactLines = await transcript(page);
    const exactState = await liveState(page);

    expect(
      exactLines.filter((line) => line === `Correct. ${question.explanation}`),
    ).toHaveLength(1);
    expect(exactLines).toContain(authoredPassMessage().text);
    expect(exactState.flags).toEqual(numericState.flags);
    expect(exactState.progress).toEqual(numericState.progress);
    expect(exactState.player).toEqual(numericState.player);
  });

  test('WR3-A1 — a full pass by exact option text keeps its effects', async ({
    page,
  }) => {
    await enterOrientationQuiz(page);
    for (let step = 0; step < authoredQuiz().questionIds.length; step += 1) {
      const state = await savedQuiz(page);
      if (state.activeQuizId === undefined) break;
      const question = currentQuestion(state);
      const option = question.options[correctIndex(question)];
      if (option === undefined)
        throw new Error('Missing authored correct option');
      await submit(page, option);
      await waitForLine(page, `> ${option}`);
      expect(await transcript(page)).toContain(
        `Correct. ${question.explanation}`,
      );
    }

    const lines = await transcript(page);
    const passMessage = authoredQuiz().onPass.find(
      (effect) => effect.kind === 'message',
    );
    if (passMessage === undefined || passMessage.kind !== 'message') {
      throw new Error('Authored quiz has no pass message');
    }
    expect(lines).toContain(passMessage.text);
    expect(lines).toContain('Topic completed: Game orientation.');
    await expect(page.locator('.quiz-panel')).toBeHidden();

    const state = await liveState(page);
    expect(state.quiz.activeQuizId).toBeUndefined();
    expect(state.flags[`quiz-passed:${QUIZ_ID}`]).toBe(true);
    expect(
      state.progress.find((row) =>
        row.completedTopics.includes(COMPLETED_TOPIC),
      ),
    ).toBeDefined();
    expect(state.player.lives).toBe(3);
    expect(state.progress.reduce((sum, row) => sum + row.earnedScore, 0)).toBe(
      0,
    );
  });

  test('WR3-A1 — a failed attempt by exact option text keeps its effects', async ({
    page,
  }) => {
    await enterOrientationQuiz(page);
    const stateBeforeFail = await liveState(page);
    const roomBefore = stateBeforeFail.player.position.roomId;
    let answered = 0;
    for (let step = 0; step < authoredQuiz().questionIds.length; step += 1) {
      const state = await savedQuiz(page);
      if (state.activeQuizId === undefined) break;
      const question = currentQuestion(state);
      // Answer the first two wrongly, then correctly: 2 of 4 is below the
      // authored pass mark of 3.
      const wrong = question.options.findIndex(
        (_, index) => index !== correctIndex(question),
      );
      const index = answered < 2 ? wrong : correctIndex(question);
      answered += 1;
      const option = question.options[index];
      if (option === undefined) throw new Error('Missing authored option');
      // The first two answers are deliberately wrong; the rest are correct.
      const verdict =
        index === correctIndex(question) ? 'Correct. ' : 'Incorrect. ';
      await submit(page, option);
      await waitForLine(page, `> ${option}`);
      expect(await transcript(page)).toContain(
        `${verdict}${question.explanation}`,
      );
    }

    const lines = await transcript(page);
    const failMessage = authoredQuiz().onFail.find(
      (effect) => effect.kind === 'message',
    );
    if (failMessage === undefined || failMessage.kind !== 'message') {
      throw new Error('Authored quiz has no fail message');
    }
    expect(lines).toContain(failMessage.text);
    const state = await liveState(page);
    expect(state.quiz.activeQuizId).toBeUndefined();
    expect(state.flags[`quiz-passed:${QUIZ_ID}`]).toBeUndefined();
    expect(state.player.position.roomId).toBe(roomBefore);
    expect(state.player.lives).toBe(3);
    expect(state.progress.reduce((sum, row) => sum + row.earnedScore, 0)).toBe(
      0,
    );
  });

  test('WR3-A2 — answer N and a bare N still advance, invalid answers do not', async ({
    page,
  }) => {
    await enterOrientationQuiz(page);
    const first = currentQuestion(await savedQuiz(page));
    await submit(page, String(correctIndex(first) + 1));
    await waitForLine(page, `> ${correctIndex(first) + 1}`);
    const afterBare = await savedQuiz(page);
    expect(afterBare.answers).toEqual([correctIndex(first)]);
    expect(afterBare.index).toBe(1);

    const second = currentQuestion(afterBare);
    await submit(page, `answer ${correctIndex(second) + 1}`);
    await waitForLine(page, `> answer ${correctIndex(second) + 1}`);
    const afterNamed = await savedQuiz(page);
    expect(afterNamed.answers).toEqual([
      correctIndex(first),
      correctIndex(second),
    ]);
    expect(afterNamed.index).toBe(2);

    for (const rejected of ['banana', 'a', '9', 'answer 9']) {
      await submit(page, rejected);
      await waitForLine(page, `> ${rejected}`);
      const lines = await transcript(page);
      const last = lines.at(-1);
      expect([UNKNOWN, OUT_OF_RANGE]).toContain(last);
      expect(await savedQuiz(page)).toEqual(afterNamed);
      expect(await transcript(page)).toContain(
        currentQuestion(afterNamed).prompt,
      );
    }
  });

  test('WR3-A3 — option-like text outside a quiz stays a friendly unknown', async ({
    page,
  }) => {
    await startNewGame(page);
    const before = await liveState(page);

    for (const [step, command] of [...PASSABLE, '1', 'a'].entries()) {
      await submit(page, command);
      await waitForLine(page, `> ${command}`);
      const lines = await transcript(page);
      expect(lines.slice(-2)).toEqual([`> ${command}`, UNKNOWN]);
      const after = await liveState(page);
      const { turn: beforeTurn, ...unchangedBefore } = before;
      const { turn: afterTurn, ...unchangedAfter } = after;
      expect(unchangedAfter).toEqual(unchangedBefore);
      expect(afterTurn).toBe(beforeTurn + step + 1);
    }
    await expect(page.locator('.quiz-panel')).toBeHidden();
  });

  test('WR3-A1 — changed copy is plain text, labelled and readable', async ({
    page,
  }) => {
    await enterOrientationQuiz(page);
    const question = currentQuestion(await savedQuiz(page));
    const optionNodes = page.locator('.quiz-panel > div');
    expect(await optionNodes.count()).toBeGreaterThan(1);
    const nodeCount = await optionNodes.count();
    for (let index = 0; index < nodeCount; index += 1) {
      const node = optionNodes.nth(index);
      expect(await node.evaluate((element) => element.children.length)).toBe(0);
    }
    const optionTexts = await optionNodes.allTextContents();
    expect(
      optionTexts.some((text) => text.includes(question.options[0] ?? '')),
    ).toBe(true);

    await expect(page.getByRole('textbox', { name: 'Command' })).toBeVisible();
    const log = page.getByRole('log');
    await expect(log).toHaveAttribute('aria-live', 'polite');

    await page.setViewportSize({ width: 360, height: 740 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    await expect(page.locator('.quiz-panel')).toBeVisible();
    await page.setViewportSize({ width: 1280, height: 720 });
  });
});
