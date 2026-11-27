// Meta-action parity and deterministic end states.
// Matrix: E2E-BOOT-08, E2E-BOOT-09.
import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from 'playwright/test';
import {
  DOWNLOAD_NAME,
  makeSave,
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

const GATED = 'The adventure is over — start a new game.';
const noConsoleErrors: () => readonly string[] = () => [];

async function persistedTurn(page: Page): Promise<number> {
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  const raw = await readStorage(page, SAVE_KEY);
  expect(raw).not.toBeNull();
  return (JSON.parse(raw as string) as { state: { turn: number } }).state.turn;
}

async function countLines(page: Page, text: string): Promise<number> {
  const lines = await transcript(page);
  return lines.filter((line) => line.includes(text)).length;
}

test.describe('meta actions and end states', () => {
  let errors: () => readonly string[] = noConsoleErrors;

  test.beforeEach(async ({ page }) => {
    errors = watchConsole(page);
    await seedStorage(page, {});
  });

  test.afterEach(() => {
    expect(errors(), 'no console errors').toEqual([]);
  });

  test('E2E-BOOT-08 — every SaveControls button and typed alias behave identically without advancing the turn', async ({
    page,
  }) => {
    await startNewGame(page);
    expect(await persistedTurn(page)).toBe(0);

    // Save / "save" — both routes must write a valid live save without
    // advancing the turn (§4, §4.1; matrix E2E-BOOT-08). §7.2 pins copy only
    // for LoadFailureReason, so success wording is not asserted here.
    for (const route of ['button', 'typed'] as const) {
      await page.evaluate((key) => localStorage.removeItem(key), SAVE_KEY);
      if (route === 'button') {
        await page.getByRole('button', { name: 'Save', exact: true }).click();
      } else {
        await submit(page, 'save');
      }
      const raw = await readStorage(page, SAVE_KEY);
      expect(raw, `${route} save wrote the live save`).not.toBeNull();
      const envelope = JSON.parse(raw as string) as {
        version: number;
        state: { turn: number };
      };
      expect(envelope.version).toBe(1);
      expect(envelope.state.turn).toBe(0);
    }

    // Load / "load" — both restore the same live save.
    const beforeLoad = await transcript(page);
    await page.getByRole('button', { name: 'Load', exact: true }).click();
    const afterButton = await transcript(page);
    expect(afterButton.length).toBeGreaterThan(beforeLoad.length);
    await submit(page, 'load');
    const afterTyped = await transcript(page);
    expect(afterTyped.length).toBeGreaterThan(afterButton.length);
    expect(await persistedTurn(page)).toBe(0);

    // Download / "download" — identical filename shape and identical JSON.
    const buttonDownload = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download', exact: true }).click();
    const buttonFile = await buttonDownload;
    expect(buttonFile.suggestedFilename()).toMatch(DOWNLOAD_NAME);
    const typedDownload = page.waitForEvent('download');
    await submit(page, 'download');
    const typedFile = await typedDownload;
    expect(typedFile.suggestedFilename()).toMatch(DOWNLOAD_NAME);
    const buttonPath = await buttonFile.path();
    const typedPath = await typedFile.path();
    expect(buttonPath).not.toBeNull();
    expect(typedPath).not.toBeNull();
    interface DownloadedSave {
      version: number;
      savedAt: string;
      state: { counters: Readonly<Record<string, number>>; turn: number };
    }
    const buttonSave = JSON.parse(
      await readFile(buttonPath as string, 'utf8'),
    ) as DownloadedSave;
    const typedSave = JSON.parse(
      await readFile(typedPath as string, 'utf8'),
    ) as DownloadedSave;
    // The two downloads are taken at different real-clock moments, so their
    // savedAt differs while every persisted field is identical. §4/§4.1 pin
    // parity of behaviour, not wall-clock equality: compare version, state and
    // counters, and require both timestamps to be well-formed ISO values.
    const isoShape = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    expect(buttonSave.version).toBe(1);
    expect(buttonSave.version).toBe(typedSave.version);
    expect(buttonSave.savedAt).toMatch(isoShape);
    expect(typedSave.savedAt).toMatch(isoShape);
    expect(buttonSave.state).toEqual(typedSave.state);
    expect(buttonSave.state.counters).toEqual(typedSave.state.counters);
    // §4 pins the dated JSON download, not a success message; the equal saved
    // states above are the parity assertion, plus the documented echo (§6.1).
    expect(await transcript(page)).toContain('> download');
    expect(await persistedTurn(page)).toBe(0);

    // Import / "import" — both routes report the same friendly status.
    const text = makeSave({ earnedScore: 6 });
    for (const route of ['button', 'typed'] as const) {
      const before = await countLines(page, 'Game imported.');
      const chooser = page.waitForEvent('filechooser');
      if (route === 'button') {
        await page.getByRole('button', { name: 'Import', exact: true }).click();
      } else {
        await submit(page, 'import');
      }
      const fileChooser = await chooser;
      await fileChooser.setFiles({
        name: 'save.json',
        mimeType: 'application/json',
        buffer: Buffer.from(text),
      });
      await expect(page.locator('.save-status')).toHaveText('Game imported.');
      await expect
        .poll(async () => countLines(page, 'Game imported.'))
        .toBe(before + 1);
    }
    await expect(scorePanel(page)).toContainText('Score: 6');
    expect(await persistedTurn(page)).toBe(0);

    // Restart / "restart" — both reset to the initial state.
    await page.getByRole('button', { name: 'Restart', exact: true }).click();
    await expect(scorePanel(page)).toContainText('Score: 0');
    const chooser = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Import', exact: true }).click();
    const fileChooser = await chooser;
    await fileChooser.setFiles({
      name: 'save.json',
      mimeType: 'application/json',
      buffer: Buffer.from(text),
    });
    await expect(scorePanel(page)).toContainText('Score: 6');
    await submit(page, 'restart');
    await expect(scorePanel(page)).toContainText('Score: 0');
    expect(await persistedTurn(page)).toBe(0);

    // Issue 31 removes the quarantine download button; the stored recovery
    // copy is still asserted in save-import.spec.ts (E2E-BOOT-07/UI-BOOT-10).
    await expect(page.getByRole('button', { name: /quarantine/i })).toHaveCount(
      0,
    );
  });

  for (const status of ['won', 'lost'] as const) {
    test(`E2E-BOOT-09 — ${status} state gates commands and restarts without re-announcing the ending`, async ({
      page,
    }) => {
      await seedStorage(page, { save: makeSave({ status, earnedScore: 5 }) });
      await page.goto('./');

      await expect(
        page.getByRole('button', { name: 'Continue' }),
      ).toBeEnabled();
      await page.getByRole('button', { name: 'Continue' }).click();
      await expect(page.locator('.workspace')).toBeVisible();
      await expect(scorePanel(page)).toContainText('Score: 5');

      // A reloaded end state does not replay its ending event.
      const bootLines = await transcript(page);
      expect(bootLines.join('\n')).not.toContain('You have won!');
      expect(bootLines.join('\n')).not.toContain('Game over —');

      await submit(page, 'north');
      expect(await countLines(page, GATED)).toBe(1);

      // Look/score/help/inventory/examine remain allowed in an end state.
      const beforeLookLines = await transcript(page);
      const beforeLook = beforeLookLines.length;
      await submit(page, 'look');
      const afterLookLines = await transcript(page);
      expect(afterLookLines.length).toBeGreaterThan(beforeLook);
      expect(await countLines(page, GATED)).toBe(1);

      // Restart follows the same path as New Game. §4 clears transient view
      // state but does not pin transcript retention, so assert that no NEW
      // gated line appears after restart rather than requiring a wipe.
      await page.getByRole('button', { name: 'Restart', exact: true }).click();
      await expect(scorePanel(page)).toContainText('Score: 0');
      expect(await countLines(page, 'Exits:')).toBeGreaterThan(0);
      const gatedBeforeMove = await countLines(page, GATED);
      await submit(page, 'north');
      expect(await countLines(page, GATED)).toBe(gatedBeforeMove);
      expect(await statusText(page)).not.toContain(GATED);
    });
  }
});
