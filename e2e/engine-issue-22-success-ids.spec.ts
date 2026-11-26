// ENG22-SUCCESSIDS-01 — browser evidence that a solved puzzle or a passed quiz
// no longer prints implementation IDs in the player-facing transcript. All
// flows use the running app and real generated authored IDs/titles; no event
// seam is injected and no score expectation is weakened.
//
// Authority: ENGINE_ISSUES.md Batch E2 (line 50), issue #22 (line 84), Group B
// (124–127) and stream 2 (156); PLAYTEST_ISSUES.md §22 (227–241);
// docs/developer/application-and-ui.md §6.1 (suppressed puzzle-solved row),
// §9 and §10. The `puzzle-activated` wording (issue 28) and the
// `Correct.`/`Incorrect.` prefix (issue 10) are deliberately not asserted here.
import { expect, test, type Page } from 'playwright/test';
import {
  seedStorage,
  startNewGame,
  submit,
  transcript,
  watchConsole,
} from './helpers';

// IDs are real values from src/content/authored/{puzzles,quizzes,spec-topics}.ts.
const PUZZLE_ID = 'puzzle-sort-the-data-types';
const QUIZ_ID = 'quiz-switchyard';
const DATA_TYPES_TITLE = 'Data types';
const SWITCH_TITLE = 'Switch to bit';

// Verbatim implementation strings from PLAYTEST_ISSUES.md §22. Generic ID
// shapes are included so a new leak in another authored puzzle/quiz is caught.
const IMPLEMENTATION_PATTERNS: readonly RegExp[] = [
  new RegExp(PUZZLE_ID, 'u'),
  new RegExp(QUIZ_ID, 'u'),
  /puzzle-[a-z-]+ solved/u,
  /quiz-[a-z-]+ passed/u,
  /\b(?:puzzle-solved|topic-completed|quiz-ended|flag-changed|item-moved)\b/u,
  /\b\w[\w-]* = (?:true|false)\b/u,
];

// Issue 28 owns the "Puzzle <id> is now active." notice. This row makes no
// assertion about its wording, so it is excluded from the ID check rather than
// reported as a new leak by this spec.
const INHERITED_ACTIVATION = /^Puzzle \S+ is now active\.$/u;

function noImplementationStrings(lines: readonly string[]): void {
  const owned = lines.filter((line) => !INHERITED_ACTIVATION.test(line));
  for (const pattern of IMPLEMENTATION_PATTERNS) {
    expect(
      owned.filter((line) => pattern.test(line)),
      `no transcript line matching ${pattern.toString()}`,
    ).toEqual([]);
  }
}

function completionLines(lines: readonly string[]): readonly string[] {
  return lines.filter((line) => line.startsWith('Topic completed:'));
}

async function command(page: Page, raw: string): Promise<string[]> {
  const beforeLines = await transcript(page);
  const before = beforeLines.length;
  await submit(page, raw);
  await page.waitForFunction(
    ({ text, count }) =>
      [...document.querySelectorAll('.output-log > div')]
        .slice(count)
        .some((line) => line.textContent === `> ${text}`),
    { text: raw, count: before },
  );
  const afterLines = await transcript(page);
  return afterLines.slice(before);
}

test.beforeEach(async ({ page }) => {
  await seedStorage(page);
});

test('ENG22-SUCCESSIDS-01 — a passed quiz shows one friendly completion and no IDs', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await startNewGame(page);

  await command(page, 'east');
  await command(page, 'east');
  await command(page, 'down');
  const questions = await command(page, 'ask foreman about switch to bit');
  expect(
    questions.some((line) => /^\d+\. /u.test(line)),
    'numbered question options still render as inherited',
  ).toBe(true);

  const answers: string[] = [];
  for (let index = 0; index < 3; index += 1) {
    answers.push(...(await command(page, 'answer 1')));
  }

  // Player-facing feedback and the friendly outcome survive the suppression.
  expect(answers.join('\n')).toContain('The foreman flips the black switch');
  const completions = completionLines(answers);
  expect(completions, 'the completion outcome appears exactly once').toEqual([
    `Topic completed: ${SWITCH_TITLE}.`,
  ]);
  expect(completions.join('\n')).not.toContain('switch-to-bit');

  const full = await transcript(page);
  expect(completionLines(full)).toHaveLength(1);
  noImplementationStrings(answers);
  noImplementationStrings(full);
  expect(errors()).toEqual([]);
});

test('ENG22-SUCCESSIDS-01 — a solved puzzle drops the solved line and keeps the friendly outcome', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await startNewGame(page);

  // Two east moves reach the Binary Hall deterministically: the first entry
  // to the switch floor triggers the authored heat hazard and returns here.
  await command(page, 'east');
  await command(page, 'east');
  expect(await command(page, 'take sample')).toContain('Taken.');

  const solved = await command(page, 'put sample in real bin');
  expect(solved).toContain('You put it down.');
  expect(
    solved.filter((line) => /solved/u.test(line)),
    'puzzle-solved emits no transcript line',
  ).toEqual([]);
  noImplementationStrings(solved);

  const completions = completionLines(solved);
  expect(
    completions,
    'the completion outcome appears exactly once',
  ).toHaveLength(1);
  for (const line of completions) {
    expect(line).toContain(DATA_TYPES_TITLE);
    expect(line).not.toContain('data-types');
  }
  // A real gain still prints once; suppression is render-time only.
  expect(
    solved.filter((line) => /earned \d+ points\./u.test(line)),
  ).toHaveLength(1);
  await expect(page.locator('.score-panel')).toContainText('Score: 1');

  const afterLook = await command(page, 'look');
  expect(completionLines(afterLook)).toEqual([]);
  const full = await transcript(page);
  noImplementationStrings(full);
  expect(errors()).toEqual([]);
});
