// ENG13-INVENTORY-01 — browser evidence that the inventory reply names carried
// items from the catalogue and that bookkeeping never leaks a "moved from"
// debug fragment. Flows use the running app and real authored IDs; no event
// seam is injected.
import { expect, test, type Page } from 'playwright/test';
import {
  seedStorage,
  startNewGame,
  submit,
  transcript,
  watchConsole,
} from './helpers';

const CARTRIDGE_ID = 'item-comic-sans-cartridge';
const CARTRIDGE_NAME = 'comic sans cartridge';
const BINARY_HALL = 'The Binary Hall';

// Wordings reported in PLAYTEST_ISSUES #5/#8/#13 and settled for suppression.
// These must remain absent from the pickup batch and the later inventory reply.
const DEBUG_FRAGMENTS = [
  /moved from/u,
  /to player\./u,
  /item-moved/u,
  new RegExp(`${CARTRIDGE_ID} moved from`, 'u'),
];

test.beforeEach(async ({ page }) => {
  await seedStorage(page);
});

function noDebugFragments(lines: readonly string[]): void {
  for (const pattern of DEBUG_FRAGMENTS) {
    expect(
      lines.filter((line) => pattern.test(line)),
      `no transcript line matching ${pattern.toString()}`,
    ).toEqual([]);
  }
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
  return (await transcript(page)).slice(before);
}

test('ENG13-INVENTORY-01 — an empty inventory yields the friendly line', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled();
  await page.getByRole('button', { name: 'New Game' }).click();
  await expect(page.locator('.workspace')).toBeVisible();

  expect(await command(page, 'inventory')).toEqual([
    '> inventory',
    'You are carrying nothing.',
  ]);

  await expect(page.getByRole('log')).toHaveAttribute('aria-live', 'polite');
  await expect(page.getByRole('textbox', { name: 'Command' })).toBeVisible();
  expect(errors()).toEqual([]);
});

test('ENG13-INVENTORY-01 — the carried cartridge is named, never shown as an ID', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await startNewGame(page);

  expect(await command(page, 'inventory')).toContain(
    'You are carrying nothing.',
  );

  // The authored overheat hazard returns the player to the level start, so
  // two ordinary east moves land in the Binary Hall deterministically.
  const toHall = [
    ...(await command(page, 'east')),
    ...(await command(page, 'east')),
  ];
  expect(toHall.join('\n')).toContain(BINARY_HALL);

  const pickup = await command(page, 'take cartridge');
  expect(pickup).toContain('Taken.');
  noDebugFragments(pickup);

  const reply = await command(page, 'inventory');
  expect(reply).toEqual(['> inventory', `You are carrying ${CARTRIDGE_NAME}.`]);
  expect(reply.join('\n')).not.toContain(CARTRIDGE_ID);
  noDebugFragments(reply);

  const full = await transcript(page);
  noDebugFragments(full);
  expect(full.join('\n')).not.toContain(
    `${CARTRIDGE_NAME} moved from room-binary-hall to player.`,
  );

  await page.locator('.output-log').evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  await page.screenshot({
    path: '.opencode/scratchpad/slices/engine-issue-13/screenshots/e2e-inventory-with-item.png',
    fullPage: true,
  });

  expect(errors()).toEqual([]);
});

test('ENG13-INVENTORY-01 — transcript interface reflows without horizontal overflow', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await startNewGame(page);

  await expect(page.getByRole('log')).toHaveAttribute('role', 'log');
  await expect(page.getByRole('textbox', { name: 'Command' })).toBeVisible();

  await page.setViewportSize({ width: 375, height: 812 });
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
  expect(errors()).toEqual([]);
});
