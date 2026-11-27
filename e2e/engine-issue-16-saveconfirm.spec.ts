// ENG16-SAVECONFIRM-01 — sidebar Save/Download route through Game.submit, so
// the façade's existing log lines reach the transcript exactly as typed meta
// commands do (docs/developer/application-and-ui.md §4.1, §7.1, §7.2).
// Import/restart/quarantine remain covered by save-import.spec.ts and
// meta-and-endstates.spec.ts; this spec does not duplicate them.
import { readFile } from 'node:fs/promises';
import { expect, test, type Download, type Page } from 'playwright/test';
import {
  DOWNLOAD_NAME,
  readStorage,
  SAVE_KEY,
  seedStorage,
  startNewGame,
  statusText,
  submit,
  transcript,
  waitForLine,
  watchConsole,
} from './helpers';

const SAVED = 'Game saved.';
const DOWNLOADED = 'Save downloaded.';
const noConsoleErrors: () => readonly string[] = () => [];

function countExact(lines: readonly string[], text: string): number {
  return lines.filter((line) => line.trim() === text).length;
}

interface SaveEnvelope {
  version: number;
  savedAt: string;
  state: { turn: number; player: { lives: number } };
}

function expectSaveEnvelope(envelope: SaveEnvelope): void {
  expect(envelope.version).toBe(1);
  expect(envelope.savedAt).toMatch(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
  );
  expect(Number.isNaN(Date.parse(envelope.savedAt))).toBe(false);
  expect(envelope.state.turn).toBe(0);
  expect(envelope.state.player.lives).toBe(3);
}

async function downloadJson(download: Download): Promise<SaveEnvelope> {
  const path = await download.path();
  expect(path, 'download has a local path').not.toBeNull();
  return JSON.parse(await readFile(path as string, 'utf8')) as SaveEnvelope;
}

async function delta(
  page: Page,
  before: readonly string[],
): Promise<readonly string[]> {
  const after = await transcript(page);
  return after.slice(before.length);
}

test.describe('ENG16-SAVECONFIRM-01 — Save/Download log confirmation', () => {
  let errors: () => readonly string[] = noConsoleErrors;

  test.beforeEach(async ({ page }) => {
    errors = watchConsole(page);
    await seedStorage(page, {});
  });

  test.afterEach(() => {
    expect(errors(), 'no console errors').toEqual([]);
  });

  test('Save button appends Game saved. once, leaves status alone and writes a valid localStorage save', async ({
    page,
  }) => {
    await startNewGame(page);
    const before = await transcript(page);
    const statusBefore = await statusText(page);
    expect(countExact(before, SAVED)).toBe(0);

    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await waitForLine(page, SAVED);

    expect(await delta(page, before)).toEqual([SAVED]);
    expect(countExact(await transcript(page), SAVED)).toBe(1);
    expect(await statusText(page)).toBe(statusBefore);

    const raw = await readStorage(page, SAVE_KEY);
    expect(raw).not.toBeNull();
    expectSaveEnvelope(JSON.parse(raw as string) as SaveEnvelope);
  });

  test('Download button downloads real JSON and appends Save downloaded. once', async ({
    page,
  }) => {
    await startNewGame(page);
    const before = await transcript(page);
    const statusBefore = await statusText(page);

    const pending = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download', exact: true }).click();
    const download = await pending;
    expect(download.suggestedFilename()).toMatch(DOWNLOAD_NAME);
    expectSaveEnvelope(await downloadJson(download));

    await waitForLine(page, DOWNLOADED);
    expect(await delta(page, before)).toEqual([DOWNLOADED]);
    expect(countExact(await transcript(page), DOWNLOADED)).toBe(1);
    expect(await statusText(page)).toBe(statusBefore);
    expect(countExact(await transcript(page), SAVED)).toBe(0);
  });

  test('typed save/download produce the same confirmations as the buttons, with no invented wording', async ({
    page,
  }) => {
    await startNewGame(page);

    await submit(page, 'save');
    await waitForLine(page, SAVED);
    let lines = await transcript(page);
    expect(lines).toContain('> save');
    expect(countExact(lines, SAVED)).toBe(1);

    const pending = page.waitForEvent('download');
    await submit(page, 'download');
    const download = await pending;
    expect(download.suggestedFilename()).toMatch(DOWNLOAD_NAME);
    await waitForLine(page, DOWNLOADED);
    lines = await transcript(page);
    expect(lines).toContain('> download');
    expect(countExact(lines, DOWNLOADED)).toBe(1);

    // The button path must reuse exactly the same wording as the terminal.
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect
      .poll(async () => countExact(await transcript(page), SAVED))
      .toBe(2);
    const pendingButton = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download', exact: true }).click();
    const buttonDownload = await pendingButton;
    expect(buttonDownload.suggestedFilename()).toMatch(DOWNLOAD_NAME);
    await expect
      .poll(async () => countExact(await transcript(page), DOWNLOADED))
      .toBe(2);

    const finalLines = await transcript(page);
    const unexpected = finalLines.filter(
      (line) =>
        /saved|downloaded/i.test(line) &&
        line !== SAVED &&
        line !== DOWNLOADED &&
        !line.startsWith('>'),
    );
    expect(unexpected, 'no invented confirmation wording').toEqual([]);
  });
});
