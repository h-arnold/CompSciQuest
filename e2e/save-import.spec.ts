// Download, import, corruption, quarantine and text-only rendering.
// Matrix: E2E-BOOT-05…07, E2E-BOOT-10, UI-BOOT-10, S-PERSIST-27.
import { readFile } from 'node:fs/promises';
import { expect, test, type Download, type Page } from 'playwright/test';
import {
  DOWNLOAD_NAME,
  makeQuarantine,
  makeSave,
  QUARANTINE_KEY,
  readStorage,
  SAVE_KEY,
  scorePanel,
  seedStorage,
  startNewGame,
  statusText,
  submit,
  transcript,
  watchConsole,
} from './helpers';

const MARKUP = '<img src=x onerror="window.__csqXss=1">';
const noConsoleErrors: () => readonly string[] = () => [];

async function importText(page: Page, text: string): Promise<void> {
  const chooser = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Import' }).click();
  const fileChooser = await chooser;
  await fileChooser.setFiles({
    name: 'save.json',
    mimeType: 'application/json',
    buffer: Buffer.from(text),
  });
  await expect(page.locator('.save-status')).not.toBeEmpty();
}

async function downloadText(download: Download): Promise<string> {
  const path = await download.path();
  expect(path, 'download has a local path').not.toBeNull();
  return readFile(path as string, 'utf8');
}

test.describe('save, import and quarantine', () => {
  let errors: () => readonly string[] = noConsoleErrors;

  test.beforeEach(async ({ page }) => {
    errors = watchConsole(page);
    await seedStorage(page, {});
  });

  test.afterEach(() => {
    expect(errors(), 'no console errors').toEqual([]);
  });

  test('E2E-BOOT-05 — a downloaded save is valid JSON and importing it restores state', async ({
    page,
  }) => {
    await startNewGame(page);

    const pending = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download', exact: true }).click();
    const download = await pending;
    expect(download.suggestedFilename()).toMatch(DOWNLOAD_NAME);

    const text = await downloadText(download);
    const envelope = JSON.parse(text) as {
      version: number;
      savedAt: string;
      state: { turn: number; player: { lives: number } };
    };
    expect(envelope.version).toBe(1);
    expect(envelope.savedAt).toMatch(/^\d{4}-\d{2}-\d{2}T.*Z$/);
    expect(envelope.state.turn).toBe(0);
    expect(envelope.state.player.lives).toBe(3);

    await importText(page, text);
    expect(await statusText(page)).toBe('Game imported.');
    expect(await transcript(page)).toContain('Game imported.');
    await expect(scorePanel(page)).toContainText('Score: 0');
    await expect(scorePanel(page)).toContainText('Lives: 3');
  });

  test('E2E-BOOT-06 — a corrupt import shows its distinct error and leaves the live save intact', async ({
    page,
  }) => {
    const live = makeSave({ earnedScore: 5 });
    await seedStorage(page, { save: live });
    await page.goto('./');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(scorePanel(page)).toContainText('Score: 5');

    await importText(page, '{ not json');

    expect(await statusText(page)).toBe('That save file is not valid JSON.');
    expect(await readStorage(page, SAVE_KEY)).toBe(live);
    await expect(scorePanel(page)).toContainText('Score: 5');
  });

  test('E2E-BOOT-07 — a corrupt live save is quarantined, disables Continue and keeps the raw text in storage', async ({
    page,
  }) => {
    const raw = '{ not json';
    await seedStorage(page, { save: raw });
    await page.goto('./');

    await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled();

    const quarantine = await readStorage(page, QUARANTINE_KEY);
    expect(quarantine).not.toBeNull();
    const record = JSON.parse(quarantine as string) as {
      reason: string;
      raw: string;
      quarantinedAt: string;
    };
    expect(record.reason).toBe('invalid-json');
    expect(record.raw).toBe(raw);
    expect(record.quarantinedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);

    // Issue 31 removes the UI download action but not the recovery record.
    // Start a session so SaveControls is visible, then check the stored raw
    // text survives and no quarantine download action is offered (§9).
    await page.getByRole('button', { name: 'New Game' }).click();
    await expect(page.locator('.workspace')).toBeVisible();
    expect(await readStorage(page, QUARANTINE_KEY)).toBe(quarantine);
    expect(JSON.parse(quarantine as string).raw).toBe(raw);
    await expect(
      page.getByRole('button', { name: 'Download quarantined save' }),
    ).toHaveCount(0);
    await expect(page.getByRole('button', { name: /quarantine/i })).toHaveCount(
      0,
    );
  });

  test('UI-BOOT-10 — a quarantined save alone disables Continue and keeps its raw text in storage', async ({
    page,
  }) => {
    const raw = makeSave({ earnedScore: 2 });
    const quarantine = makeQuarantine(raw, 'invalid-content');
    await seedStorage(page, { quarantine });
    await page.goto('./');

    await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled();
    expect(await readStorage(page, SAVE_KEY)).toBeNull();

    // SaveControls sits in the workspace (§7.1). Reveal it to confirm the
    // button is gone while the stored recovery copy is untouched (§9).
    await page.getByRole('button', { name: 'New Game' }).click();
    await expect(page.locator('.workspace')).toBeVisible();
    expect(await readStorage(page, QUARANTINE_KEY)).toBe(quarantine);
    expect(JSON.parse(quarantine).raw).toBe(raw);
    expect(JSON.parse(quarantine).reason).toBe('invalid-content');
    await expect(page.getByRole('button', { name: /quarantine/i })).toHaveCount(
      0,
    );
  });

  test('E2E-BOOT-10 — HTML-like text is displayed as literal transcript text', async ({
    page,
  }) => {
    await startNewGame(page);

    await submit(page, MARKUP);

    expect(await transcript(page)).toContain(`> ${MARKUP}`);
    await expect(page.locator('.output-log img')).toHaveCount(0);
    expect(
      await page.evaluate(() => Reflect.get(globalThis, '__csqXss')),
    ).toBeUndefined();
    await expect(page.locator('.window')).toBeVisible();
  });

  test('S-PERSIST-27 — HTML-like strings in an imported save are never rendered as HTML', async ({
    page,
  }) => {
    await startNewGame(page);

    const text = JSON.stringify({
      version: 1,
      savedAt: MARKUP,
      state: JSON.parse(makeSave({ earnedScore: 4 })).state,
      counters: { [MARKUP]: 1 },
    });
    await importText(page, text);

    expect(await statusText(page)).toBe('Game imported.');
    await expect(scorePanel(page)).toContainText('Score: 4');
    await expect(page.locator('img')).toHaveCount(0);
    // Vite injects its own module scripts, so scope the assertion to markup
    // mounted under #app and to script text derived from the imported string.
    await expect(page.locator('#app script')).toHaveCount(0);
    const scriptTexts = await page.locator('script').allTextContents();
    expect(scriptTexts.join('\n')).not.toContain(MARKUP);
    expect(
      await page.evaluate(() => Reflect.get(globalThis, '__csqXss')),
    ).toBeUndefined();
  });
});
