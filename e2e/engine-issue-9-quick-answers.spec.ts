// Browser verification for engine issue 9 (ENG9-BAREANSWER-01 and
// ENG9-ASKINFER-01). All content IDs come from the generated authored bundles;
// the game is driven through the real Command box in Chromium. Feedback wording
// and pass marks belong to other issues and are deliberately not asserted.
import { expect, test, type Page } from 'playwright/test';
import { conversationTopics } from '../src/content/authored/conversation-topics';
import { nodes } from '../src/content/authored/nodes';
import {
  SAVE_KEY,
  readStorage,
  seedStorage,
  startNewGame,
  submit,
  transcript,
  waitForLine,
  watchConsole,
} from './helpers';

const UNKNOWN = "I don't understand that.";
const OUT_OF_RANGE = 'That answer is not one of the choices.';
const QUIZ_STARTED = 'Quiz quiz-switchyard started.';
const AI_ID = 'npc-the-ai';
const ARRIVAL_ANSWER = 'The classroom folded along its grid lines';
const BUREAU_ANSWER =
  "The five working shapes are stencilled in the counter's wood";

interface QuizState {
  readonly activeQuizId?: string;
  readonly questionIds: readonly string[];
  readonly index: number;
  readonly correctCount: number;
  readonly answers: readonly number[];
}

interface ConsoleWatch {
  readonly errors: () => readonly string[];
  readonly asset404s: () => number;
}

// A missing favicon is a static-asset issue owned by the UI slice; the existing
// content-generated.spec.ts makes the same distinction. Application errors and
// uncaught page errors are never filtered.
function watchAppConsole(page: Page): ConsoleWatch {
  const errors = watchConsole(page);
  let asset404s = 0;
  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      message.location().url.includes('favicon.ico')
    ) {
      asset404s += 1;
    }
  });
  return { errors, asset404s: () => asset404s };
}

// Candidate presence uses only the authored relations named in npcs.md §2 and
// shared-rules.md §3; this is a test oracle, not a copy of the production seam.
function candidateActors(roomId: string): readonly string[] {
  const actors = new Set<string>();
  for (const topic of [
    ...conversationTopics,
    ...nodes.flatMap((node) => node.topics),
  ]) {
    const scope = topic.isActive;
    const present =
      scope.kind === 'in-room'
        ? scope.roomId === roomId
        : scope.kind === 'all' &&
          scope.of.some((of) => of.kind === 'in-room' && of.roomId === roomId);
    if (present && topic.actorId !== undefined) actors.add(topic.actorId);
  }
  return [...actors];
}

async function savedQuiz(page: Page): Promise<QuizState> {
  await submit(page, 'save');
  await expect.poll(() => readStorage(page, SAVE_KEY)).not.toBeNull();
  const raw = await readStorage(page, SAVE_KEY);
  if (raw === null) throw new Error('Save was not written');
  return (JSON.parse(raw) as { state: { quiz: QuizState } }).state.quiz;
}

async function enterSwitchFloorQuiz(page: Page): Promise<void> {
  await startNewGame(page);
  await submit(page, 'east');
  await waitForLine(page, '> east');
  await submit(page, 'east');
  await waitForLine(page, 'The Switch Floor');
  await submit(page, 'ask foreman about switch-to-bit');
  await waitForLine(page, QUIZ_STARTED);
  await expect(page.locator('.quiz-panel')).toBeVisible();
}

function numberedOptions(lines: readonly string[]): readonly string[] {
  return lines
    .map((line) => /^\d+\. (.+)$/u.exec(line.trim())?.[1])
    .filter((option): option is string => option !== undefined);
}

async function panelLines(page: Page): Promise<string[]> {
  return page.locator('.quiz-panel > div').allTextContents();
}

test.describe('engine issue 9 — quick quiz answers and inferred ask', () => {
  let consoleWatch: ConsoleWatch;

  test.beforeEach(async ({ page }) => {
    consoleWatch = watchAppConsole(page);
    await seedStorage(page, {});
  });

  test.afterEach(() => {
    expect(
      consoleWatch.errors(),
      'only the favicon static-asset 404 may appear in the console',
    ).toHaveLength(consoleWatch.asset404s());
  });

  test('ENG9-BAREANSWER-01 — a bare number answers the displayed option and records the choice', async ({
    page,
  }) => {
    await enterSwitchFloorQuiz(page);
    const panel = page.locator('.quiz-panel');
    const before = await panel.textContent();
    expect(before).toContain('Question 1 of 3');

    await submit(page, '1');
    await waitForLine(page, '> 1');

    await expect(panel).toContainText('Question 2 of 3');
    expect(
      await panel.textContent(),
      'the quiz advances after a bare number',
    ).not.toBe(before);
    expect(await transcript(page)).toContain('> 1');

    const quiz = await savedQuiz(page);
    expect(quiz.activeQuizId).toBe('quiz-switchyard');
    expect(quiz.index, 'the next question is shown').toBe(1);
    expect(quiz.answers, 'the chosen option was recorded').toEqual([0]);
  });

  test('ENG9-BAREANSWER-01 — answer N and exact option text still work, letters and out-of-range do not', async ({
    page,
  }) => {
    await enterSwitchFloorQuiz(page);
    const panel = page.locator('.quiz-panel');
    const before = await panel.textContent();

    for (const letter of ['a', 'b', 'c']) {
      await submit(page, letter);
      await waitForLine(page, `> ${letter}`);
      expect(
        await transcript(page),
        `${letter} is not a quiz answer`,
      ).toContain(UNKNOWN);
      expect(await panel.textContent(), 'the quiz did not advance').toBe(
        before,
      );
    }

    await submit(page, '9');
    await waitForLine(page, '> 9');
    expect(await transcript(page)).toContain(OUT_OF_RANGE);
    expect(await panel.textContent(), 'out of range did not advance').toBe(
      before,
    );

    await submit(page, 'answer 1');
    await waitForLine(page, '> answer 1');
    await expect(panel).toContainText('Question 2 of 3');

    const plainOption = numberedOptions(await panelLines(page)).find((option) =>
      /^[a-z ]+$/u.test(option),
    );
    expect(
      plainOption,
      'a plain option is shown for the text alias',
    ).toBeDefined();
    const typed = `  answer   ${(plainOption as string).toLocaleUpperCase('en-GB')}  `;
    await submit(page, typed);
    await waitForLine(page, `> ${typed}`);
    await expect(panel).toContainText('Question 3 of 3');

    const quiz = await savedQuiz(page);
    expect(quiz.index, 'both accepted forms advanced the quiz').toBe(2);
    expect(quiz.answers).toHaveLength(2);
  });

  test('ENG9-BAREANSWER-01 — a bare number outside a quiz takes the friendly unknown path', async ({
    page,
  }) => {
    await startNewGame(page);
    for (const raw of ['1', '2']) {
      await submit(page, raw);
      await waitForLine(page, `> ${raw}`);
    }
    const lines = await transcript(page);
    expect(lines.filter((line) => line === UNKNOWN)).toHaveLength(2);
    await expect(page.locator('.quiz-panel')).toBeHidden();

    const quiz = await savedQuiz(page);
    expect(quiz.activeQuizId).toBeUndefined();
    expect(quiz.answers).toEqual([]);
  });

  test('ENG9-ASKINFER-01 — ask about <topic> infers the only present actor', async ({
    page,
  }) => {
    expect(candidateActors('room-arrival')).toEqual([AI_ID]);
    await startNewGame(page);
    await submit(page, 'ask about why here');
    await waitForLine(page, '> ask about why here');

    const lines = await transcript(page);
    expect(lines.join('\n')).toContain(ARRIVAL_ANSWER);
    await expect(page.locator('.conversation-panel')).toContainText(
      'Talking with',
    );
  });

  test('ENG9-ASKINFER-01 — explicit ask <npc> about <topic> still works', async ({
    page,
  }) => {
    await startNewGame(page);
    await submit(page, 'ask ai about why here');
    await waitForLine(page, '> ask ai about why here');

    const lines = await transcript(page);
    expect(lines.join('\n')).toContain(ARRIVAL_ANSWER);
    await expect(page.locator('.conversation-panel')).toContainText(
      'Talking with',
    );
  });

  test('ENG9-ASKINFER-01 — no present actor takes the unknown path with no guess', async ({
    page,
  }) => {
    expect(candidateActors('room-entry-interface')).toEqual([]);
    await startNewGame(page);
    await submit(page, 'east');
    await waitForLine(page, '> east');
    await submit(page, 'in');
    await waitForLine(page, '> in');

    const before = await transcript(page);
    await submit(page, 'ask about why here');
    await waitForLine(page, '> ask about why here');
    const after = await transcript(page);
    expect(after.slice(before.length)).toEqual([
      '> ask about why here',
      UNKNOWN,
    ]);
    await expect(page.locator('.conversation-panel')).toBeHidden();
  });

  test('ENG9-ASKINFER-01 — several present actors take the unknown path without a disambiguation prompt', async ({
    page,
  }) => {
    expect(candidateActors('room-pattern-bureau').length).toBeGreaterThan(1);
    await startNewGame(page);
    for (const raw of ['east', 'north', 'east']) {
      await submit(page, raw);
      await waitForLine(page, `> ${raw}`);
    }

    const before = await transcript(page);
    await submit(page, 'ask about paperwork');
    await waitForLine(page, '> ask about paperwork');
    const after = await transcript(page);
    expect(after.slice(before.length)).toEqual([
      '> ask about paperwork',
      UNKNOWN,
    ]);
    await expect(page.locator('.conversation-panel')).toBeHidden();

    await submit(page, 'ask loomwright about shapes');
    await waitForLine(page, '> ask loomwright about shapes');
    const lines = await transcript(page);
    expect(lines.join('\n')).toContain(BUREAU_ANSWER);
    await expect(page.locator('.conversation-panel')).toContainText(
      'Talking with',
    );
  });
});
