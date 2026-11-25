// Boot, title screen and the first active session.
// Matrix: E2E-BOOT-01…04.
import { expect, test } from 'playwright/test';
import {
  makeSave,
  readStorage,
  SAVE_KEY,
  scorePanel,
  seedStorage,
  START_ROOM_TITLE,
  startNewGame,
  submit,
  transcript,
  watchConsole,
} from './helpers';

const noConsoleErrors: () => readonly string[] = () => [];

test.describe('title screen and session boot', () => {
  let errors: () => readonly string[] = noConsoleErrors;

  test.beforeEach(async ({ page }) => {
    errors = watchConsole(page);
    await seedStorage(page, {});
  });

  test.afterEach(() => {
    expect(errors(), 'no console errors').toEqual([]);
  });

  test('E2E-BOOT-01 — clean boot shows the title screen with Continue disabled', async ({
    page,
  }) => {
    await page.goto('./');

    await expect(page.locator('.window')).toBeVisible();
    await expect(page.locator('.titlebar')).toContainText('CompSciQuest');
    await expect(page.locator('.title-overlay h1')).toHaveText('CompSciQuest');
    await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'New Game' })).toBeEnabled();
    await expect(page.locator('.workspace')).toBeHidden();
    expect(await readStorage(page, SAVE_KEY)).toBeNull();
  });

  test('E2E-BOOT-02 — New Game enters the initial room with output and score panel', async ({
    page,
  }) => {
    await startNewGame(page);

    await expect(page.locator('.title-overlay')).toHaveCount(0);
    await expect(page.locator('.workspace')).toBeVisible();
    const lines = await transcript(page);
    expect(lines.length).toBeGreaterThan(0);
    // The room title comes from the authored catalogue, so this stays valid
    // across regenerations; the exits line remains a generic shape check.
    expect(lines.join('\n')).toContain(START_ROOM_TITLE);
    expect(lines.join('\n')).toContain('Exits:');
    await expect(scorePanel(page)).toBeVisible();
    await expect(scorePanel(page)).toContainText('Score: 0');
    await expect(scorePanel(page)).toContainText('Lives: 3');
  });

  test('E2E-BOOT-03 — a typed command echoes, produces output, refreshes the score panel and enters history', async ({
    page,
  }) => {
    // Re-seed before navigation: Continue must read a valid save with score 7
    // while New Game starts at score 0, so the panel change is observable.
    const seeded = makeSave({ earnedScore: 7 });
    await page.addInitScript((text: string) => {
      localStorage.setItem('compsciquest:save:v1', text);
    }, seeded);
    await page.goto('./');
    await page.getByRole('button', { name: 'New Game' }).click();
    await expect(scorePanel(page)).toContainText('Score: 0');

    await submit(page, 'load');

    expect(await transcript(page)).toContain('> load');
    await expect(scorePanel(page)).toContainText('Score: 7');

    const input = page.getByRole('textbox', { name: 'Command' });
    await submit(page, 'look');
    expect(await transcript(page)).toContain('> look');
    await input.press('ArrowUp');
    await expect(input).toHaveValue('look');
    await input.press('ArrowDown');
    await expect(input).toHaveValue('');
  });

  test('E2E-BOOT-04 — a save survives reload and boot offers Continue', async ({
    page,
  }) => {
    await startNewGame(page);
    await submit(page, 'save');
    // §7.2 pins copy only for LoadFailureReason. The save contract is the
    // live-save envelope asserted below, plus the documented echo (§6.1).
    expect(await transcript(page)).toContain('> save');

    const saved = await readStorage(page, SAVE_KEY);
    expect(saved).not.toBeNull();
    const envelope = JSON.parse(saved as string) as {
      version: number;
      savedAt: string;
      state: { turn: number };
    };
    expect(envelope.version).toBe(1);
    expect(envelope.savedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(envelope.state.turn).toBe(0);

    await page.reload();

    await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.locator('.workspace')).toBeVisible();
    const continuedLines = await transcript(page);
    expect(continuedLines.join('\n')).toContain('Exits:');
    await expect(scorePanel(page)).toContainText('Score: 0');
  });

  test('E2E-BOOT-04 — a crafted valid save restores exact state through Continue', async ({
    page,
  }) => {
    // Deliberately deterministic: no wall clock or authored content involved.
    await seedStorage(page, { save: makeSave({ earnedScore: 3, turn: 4 }) });
    await page.goto('./');

    await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(scorePanel(page)).toContainText('Score: 3');
    // No documented contract pins a save-success status message on Continue
    // (§4/§4.1/§7.2). `.save-status` is an empty span, so assert the element's
    // presence rather than visibility; the score and preserved savedAt above
    // and below carry the real contract for this row (matrix E2E-BOOT-04).
    await expect(page.locator('.save-status')).toHaveCount(1);
    expect((await readStorage(page, SAVE_KEY)) as string).toContain(
      '"savedAt":"2026-11-24T12:06:00.000Z"',
    );
  });
});
