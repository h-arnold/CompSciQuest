// Engine issue 1 / Batch E1 onboarding slots (matrix ENG1-ONBOARD-01).
// Scope: title-screen copy slots, the "type help" prompt and the first two
// transcript lines. Command-table and parser behaviour belong to sibling issues.
// The app runs on 5201 in this slice because 5173 is occupied by another
// worktree; the committed config is unchanged.
import { expect, test, type Page } from 'playwright/test';
import {
  makeSave,
  readStorage,
  SAVE_KEY,
  seedStorage,
  START_ROOM_TITLE,
  transcript,
  watchConsole,
} from './helpers';

const APP_URL =
  process.env['CSQ_E2E_URL'] ?? 'http://localhost:5201/CompSciQuest/';

const OBJECTIVE = 'Objective copy to follow.';
const CONTROLS = 'Controls copy to follow.';
const HELP_PROMPT = 'Type help to see available commands.';

const noConsoleErrors: () => readonly string[] = () => [];

async function boot(page: Page): Promise<void> {
  await page.goto(APP_URL);
}

async function openSession(page: Page, button: 'New Game' | 'Continue') {
  await boot(page);
  await page.getByRole('button', { name: button }).click();
  await expect(page.locator('.workspace')).toBeVisible();
}

test.describe('engine issue 1 onboarding', () => {
  let errors: () => readonly string[] = noConsoleErrors;

  test.beforeEach(async ({ page }) => {
    errors = watchConsole(page);
    await seedStorage(page, {});
  });

  test.afterEach(() => {
    expect(errors(), 'no console errors').toEqual([]);
  });

  test('ENG1-ONBOARD-01 — clean boot exposes copy slots, prompt and disabled Continue', async ({
    page,
  }) => {
    await boot(page);

    await expect(page.locator('.window')).toBeVisible();
    await expect(page.locator('.title-overlay h1')).toHaveText('CompSciQuest');
    await expect(page.locator('.title-objective')).toHaveText(OBJECTIVE);
    await expect(page.locator('.title-controls')).toHaveText(CONTROLS);
    await expect(page.locator('.title-help-prompt')).toHaveText(HELP_PROMPT);
    await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'New Game' })).toBeEnabled();
    await expect(page.locator('.workspace')).toBeHidden();

    // The transcript is seeded before a session, so it is never empty when
    // the overlay is dismissed after the first published batch.
    expect(await transcript(page)).toEqual([OBJECTIVE, CONTROLS]);
    await expect(page.locator('.output-log')).toHaveAttribute('role', 'log');
    await expect(page.locator('.output-log')).toHaveAttribute(
      'aria-live',
      'polite',
    );
  });

  test('ENG1-ONBOARD-01 — New Game opens with objective and controls before the room output', async ({
    page,
  }) => {
    await boot(page);
    await expect(page.locator('.title-overlay')).toBeVisible();
    expect(await transcript(page)).toEqual([OBJECTIVE, CONTROLS]);

    await page.getByRole('button', { name: 'New Game' }).click();

    await expect(page.locator('.title-overlay')).toHaveCount(0);
    await expect(page.locator('.workspace')).toBeVisible();
    const lines = await transcript(page);
    expect(lines.slice(0, 2)).toEqual([OBJECTIVE, CONTROLS]);
    expect(lines.slice(2).join('\n')).toContain(START_ROOM_TITLE);
    expect(lines.slice(2).join('\n')).toContain('Exits:');
  });

  test('ENG1-ONBOARD-01 — Continue reopens the seeded transcript lines after reload', async ({
    page,
  }) => {
    await openSession(page, 'New Game');
    await page.getByRole('textbox', { name: 'Command' }).fill('save');
    await page.getByRole('textbox', { name: 'Command' }).press('Enter');
    expect(await transcript(page)).toContain('> save');

    const saved = await readStorage(page, SAVE_KEY);
    expect(saved).not.toBeNull();
    const envelope = JSON.parse(saved as string) as {
      version: number;
      savedAt: string;
    };
    expect(envelope.version).toBe(1);
    expect(envelope.savedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);

    await boot(page);
    await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled();
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.locator('.title-overlay')).toHaveCount(0);
    await expect(page.locator('.workspace')).toBeVisible();
    const lines = await transcript(page);
    expect(lines.slice(0, 2)).toEqual([OBJECTIVE, CONTROLS]);
    expect(lines.slice(2).join('\n')).toContain(START_ROOM_TITLE);
    expect(await readStorage(page, SAVE_KEY)).toBe(saved);
  });

  test('ENG1-ONBOARD-01 — a crafted valid save reaches the same first lines through Continue', async ({
    page,
  }) => {
    const saved = makeSave();
    await seedStorage(page, { save: saved });
    await boot(page);

    await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled();
    await page.getByRole('button', { name: 'Continue' }).click();

    const lines = await transcript(page);
    expect(lines.slice(0, 2)).toEqual([OBJECTIVE, CONTROLS]);
    expect(lines.slice(2).join('\n')).toContain(START_ROOM_TITLE);
    expect(await readStorage(page, SAVE_KEY)).toBe(saved);
  });
});
