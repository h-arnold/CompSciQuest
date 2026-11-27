// ENG8-LOGID-01 — browser evidence that internal-state events emit no
// transcript line while genuine player-facing output still renders. All flows
// use the running app and real authored IDs; no event seam is injected.
import { expect, test, type Page } from 'playwright/test';
import { hazards } from '../src/content/authored/hazards';
import {
  seedStorage,
  startFromLiveSave,
  startNewGame,
  submit,
  transcript,
  watchConsole,
} from './helpers';

test.beforeEach(async ({ page }) => {
  await seedStorage(page);
});

// These wordings are exactly the debug strings reported in PLAYTEST_ISSUES #8
// and settled for suppression in ENGINE_ISSUES Batch E2.
const INTERNAL_LINE_PATTERNS = [
  /^Hazard hazard-[^:]*: /u,
  /^Quiz quiz-[^ ]+ (?:started|failed)/u,
  /^Conversation started with /u,
  /^Conversation ended /u,
  /^Entered conversation node /u,
  /^Left the conversation node\./u,
  /actorstate-[a-z-]+/u,
  /^Hint penalty: /u,
];

function noInternalLeaks(lines: readonly string[]): void {
  for (const pattern of INTERNAL_LINE_PATTERNS) {
    expect(
      lines.filter((line) => pattern.test(line)),
      `no transcript line matching ${pattern.toString()}`,
    ).toEqual([]);
  }
}

function overheatMessage(): string {
  const hazard = hazards.find((entry) => entry.id === 'hazard-switch-overheat');
  if (hazard === undefined) {
    throw new Error('Unknown authored hazard hazard-switch-overheat');
  }
  const message = hazard.effects.find((effect) => effect.kind === 'message');
  if (message === undefined || message.kind !== 'message') {
    throw new Error(
      'Authored hazard hazard-switch-overheat has no message effect',
    );
  }
  return message.text;
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

test('ENG8-LOGID-01 — hazard, conversation and quiz-pass flows keep the log player-facing', async ({
  page,
}) => {
  const errors = watchConsole(page);
  // Seed the accepted hub-card precondition so the ordinary east route reaches
  // the authored overheat hazard and the same no-debug-line assertions apply.
  await startFromLiveSave(page, { 'tutorial-complete': true });

  const question = await command(page, 'ask ai about why here');
  expect(question.join('\n')).toContain(
    'The classroom folded along its grid lines',
  );
  noInternalLeaks(question);

  await command(page, 'east');
  const hazard = await command(page, 'east');
  expect(hazard).toContain(overheatMessage());
  expect(hazard).toContain('Lives: 2.');
  expect(hazard.indexOf('The Switch Floor')).toBeLessThan(
    hazard.indexOf(overheatMessage()),
  );
  noInternalLeaks(hazard);

  await command(page, 'down');
  const quizStart = await command(page, 'ask foreman about switch to bit');
  expect(
    quizStart.some((line) => /^\d+\. /u.test(line)),
    'numbered quiz options still render',
  ).toBe(true);
  noInternalLeaks(quizStart);

  const answers: string[] = [];
  for (let index = 0; index < 3; index += 1) {
    answers.push(...(await command(page, 'answer 1')));
  }
  expect(
    answers.some((line) =>
      line.startsWith('The foreman flips the black switch'),
    ),
    'explanation text still renders',
  ).toBe(true);
  expect(answers).toContain('Topic completed: Switch to bit.');
  noInternalLeaks(answers);

  const farewell = await command(page, 'bye');
  noInternalLeaks(farewell);
  noInternalLeaks(await transcript(page));
  expect(errors()).toEqual([]);
});

test('ENG8-LOGID-01 — a failed quiz shows its outcome without a debug line', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await startNewGame(page);
  await command(page, 'east');
  await command(page, 'east');
  await command(page, 'down');

  const quizStart = await command(page, 'ask foreman about switch to bit');
  expect(
    quizStart.some((line) =>
      line.startsWith('1. a transistor used as a switch'),
    ),
  ).toBe(true);

  const answers: string[] = [];
  for (let index = 0; index < 3; index += 1) {
    answers.push(...(await command(page, 'answer 4')));
  }
  expect(answers).toContain('Lives: 2.');
  expect(answers.join('\n')).toContain('The Switch Floor');
  expect(answers.join('\n')).toContain("'Again, when you're ready.'");
  noInternalLeaks(answers);
  noInternalLeaks(await transcript(page));
  expect(errors()).toEqual([]);
});
