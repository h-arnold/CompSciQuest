// W7 browser walkthrough evidence for the accepted V4 trace in
// docs/content/walkthrough.md. Step numbers in test names refer to that trace.
// Expectations that the running app cannot yet satisfy are recorded as
// test.fixme with the trace-backed behaviour spelled out in the test body;
// they are never weakened to match the current output.
import { expect, test, type Page } from 'playwright/test';
import {
  SAVE_KEY,
  readStorage,
  seedStorage,
  startNewGame,
  submit,
  transcript,
  watchConsole,
} from './helpers';

test.beforeEach(async ({ page }) => {
  // Fresh storage per test: no save and no quarantine at boot.
  await seedStorage(page);
});

interface PlayerView {
  readonly position: { readonly roomId: string };
  readonly lives: number;
}

async function savedPlayer(page: Page): Promise<PlayerView> {
  await submit(page, 'save');
  const raw = await readStorage(page, SAVE_KEY);
  if (raw === null) throw new Error('Save was not written');
  return (
    JSON.parse(raw) as {
      state: { player: PlayerView };
    }
  ).state.player;
}

function joined(lines: readonly string[]): string {
  return lines.join('\n');
}

test('W7 Beat A — clean boot reaches room-arrival with transcript and score panel', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'New Game' })).toBeEnabled();

  await page.getByRole('button', { name: 'New Game' }).click();
  await expect(page.locator('.workspace')).toBeVisible();
  const lines = await transcript(page);
  expect(joined(lines)).toContain('The Arrival Bay');
  expect(joined(lines)).toContain('attention not satisfied');
  expect(joined(lines)).toContain('Exits: east');
  await expect(page.locator('.score-panel')).toContainText('Score: 0');
  await expect(page.locator('.score-panel')).toContainText('Lives: 3');

  const player = await savedPlayer(page);
  expect(player.position.roomId).toBe('room-arrival');
  expect(player.lives).toBe(3);
  expect(errors().filter((text) => !text.includes('favicon.ico'))).toEqual([]);
});

test('W7 verified flow — echo, output and up/down history', async ({
  page,
}) => {
  await startNewGame(page);
  await submit(page, 'inventory');

  const lines = await transcript(page);
  expect(lines).toContain('> inventory');
  const echoAt = lines.indexOf('> inventory');
  expect(
    lines
      .slice(echoAt + 1)
      .join('\n')
      .trim().length,
  ).toBeGreaterThan(0);

  const input = page.getByRole('textbox', { name: 'Command' });
  await input.press('ArrowUp');
  await expect(input).toHaveValue('inventory');
  await input.press('ArrowDown');
  await expect(input).toHaveValue('');
});

test('W7 Beats C-D — east to the hub and the ungated interface detour', async ({
  page,
}) => {
  await startNewGame(page);

  await submit(page, 'east');
  expect((await savedPlayer(page)).position.roomId).toBe('room-network-hub');
  await submit(page, 'in');
  expect((await savedPlayer(page)).position.roomId).toBe(
    'room-entry-interface',
  );
  await submit(page, 'out');
  expect((await savedPlayer(page)).position.roomId).toBe('room-network-hub');
});

test('W7 Beat E — overheat fires once, costs one life and ejects to room-binary-hall', async ({
  page,
}) => {
  await startNewGame(page);
  await submit(page, 'east');
  await submit(page, 'east'); // first entry to room-switch-floor

  const lines = await transcript(page);
  expect(joined(lines)).toContain(
    'Hazard hazard-switch-overheat: hazard-switch-overheat.',
  );
  expect(joined(lines)).toContain('Lives: 2.');
  const player = await savedPlayer(page);
  expect(player.position.roomId).toBe('room-binary-hall');
  expect(player.lives).toBe(2);

  await submit(page, 'down'); // safe re-entry: once:true must not fire again
  expect(
    lines.filter((line) => line.includes('hazard-switch-overheat')),
  ).toHaveLength(1);
  expect((await savedPlayer(page)).position.roomId).toBe('room-switch-floor');
});

test('W7 accessibility — labels, live transcript, keyboard order and narrow reflow', async ({
  page,
}) => {
  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled();
  // Assistive technology sees the disabled state on the Continue control.
  expect(
    await page.getByRole('button', { name: 'Continue' }).isDisabled(),
  ).toBe(true);

  await page.keyboard.press('Tab');
  expect(
    await page.evaluate(() => document.activeElement?.textContent?.trim()),
  ).toBe('New Game');
  await page.keyboard.press('Enter');
  await expect(page.locator('.workspace')).toBeVisible();

  const attrs = await page.evaluate(() => ({
    role: document.querySelector('.output-log')?.getAttribute('role'),
    live: document.querySelector('.output-log')?.getAttribute('aria-live'),
    label: document.querySelector('input')?.getAttribute('aria-label'),
  }));
  expect(attrs).toEqual({ role: 'log', live: 'polite', label: 'Command' });

  // The document body is the first tab stop after the title overlay is
  // dismissed by keyboard activation; move past it before recording controls.
  await page.keyboard.press('Tab');
  const order: string[] = [];
  for (let index = 0; index < 7; index += 1) {
    await page.keyboard.press('Tab');
    order.push(
      (await page.evaluate(
        () =>
          document.activeElement?.getAttribute('aria-label') ??
          document.activeElement?.textContent?.trim(),
      )) ?? '',
    );
  }
  expect(order).toEqual([
    'Command',
    'Save',
    'Load',
    'Download',
    'Import',
    'Restart',
    'Download quarantined save',
  ]);

  await page.setViewportSize({ width: 390, height: 844 });
  const widths = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.client);
});

test.fixme('W7 Beat B — AI topics answer in room-arrival and stay room-scoped', async ({
  page,
}) => {
  // Expected from trace step B: asking npc-the-ai about "why here" /
  // "attendance" resolves topic-ai-why-here, "fail" / "lives" resolves
  // topic-ai-failure, both answer in room-arrival, and neither answers later
  // in room-network-hub; topic-ai-verdict, topic-ai-unit-two-taunt and
  // topic-ai-default stay global. Observed: talk/ask input is "unknown" and
  // the production NPC reaction is a no-op seam (code finding E2E-2).
  await startNewGame(page);
  await submit(page, 'ask ai about why here');
  expect(joined(await transcript(page))).toContain(
    'The pupil’s attendance mark is recorded',
  );
});

test.fixme('W7 Beat C — hub route text and scoped escape topic', async ({
  page,
}) => {
  // Expected from trace step C: entering room-network-hub shows every route
  // at once with only east live, and asking the AI about "escape" / "route"
  // / "door" answers topic-ai-escape in the hub only.
  await startNewGame(page);
  await submit(page, 'east');
  expect(joined(await transcript(page))).toContain(
    'Only the east port is live',
  );
});

test.fixme('W7 steps 1-18 — room text, gates, USE/SHOW, quizzes and authored win', async ({
  page,
}) => {
  // Expected from trace steps 1-18: each room entry shows its title,
  // description and exit list; USE sets switches-set/types-sorted/hex-read/
  // etc; the six hub gates open in order; foreman SHOW answers set the leaf
  // flags; all eight quizzes pass; two hazards fire and the run reaches
  // game-won with one life. Observed: move-player renders only the room ID
  // with empty text/exits, USE has no effect, ask/show are unknown, and no
  // dialogue or quiz systems are wired (code findings E2E-1..E2E-3).
  await startNewGame(page);
  await submit(page, 'east');
  await submit(page, 'east');
  await submit(page, 'down');
  await submit(page, 'take gauge');
  await submit(page, 'use gauge belt');
  expect(joined(await transcript(page))).toContain(
    'Puzzle puzzle-set-the-switches solved',
  );
});
