// E2E-LOADCONFIRM-01..03 — typed `load` and the sidebar Load button converge on
// one façade seam and log exactly one friendly "Game loaded." line; a failed
// load logs only the existing failure copy and leaves state untouched.
// Canonical nodes: Game.loadMeta(), GameWindow.makeActions()/handleCommand(),
// SaveActions, OutputLog, LoadResult (application-and-ui.md §4.1, §7.1).
import { expect, test, type Page } from 'playwright/test';
import {
  makeSave,
  readStorage,
  SAVE_KEY,
  scorePanel,
  seedStorage,
  startNewGame,
  statusText,
  submit,
  transcript,
  waitForLine,
  watchConsole,
} from './helpers';

const LOADED = 'Game loaded.';
const FAILED = 'No saved game could be loaded.';

function countExact(lines: readonly string[], text: string): number {
  return lines.filter((line) => line.trim() === text).length;
}

async function liveTurn(page: Page): Promise<number> {
  const raw = await readStorage(page, SAVE_KEY);
  expect(raw, 'a live save exists').not.toBeNull();
  return (JSON.parse(raw as string) as { state: { turn: number } }).state.turn;
}

async function continueSavedGame(page: Page, turn: number): Promise<void> {
  await seedStorage(page, { save: makeSave({ turn }) });
  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('.workspace')).toBeVisible();
}

function unexpectedConfirmation(lines: readonly string[]): string[] {
  return lines.filter(
    (line) =>
      /\b(loaded|saved|imported)\b/iu.test(line) &&
      line !== LOADED &&
      line !== FAILED &&
      !line.startsWith('>'),
  );
}

test.describe('ENG-LOADCONFIRM-01 — one friendly confirmation from both load paths', () => {
  let errors: () => readonly string[];

  test.beforeEach(async ({ page }) => {
    errors = watchConsole(page);
    await seedStorage(page, {});
  });

  test.afterEach(() => {
    expect(errors(), 'no console errors during the load flow').toEqual([]);
  });

  test('E2E-LOADCONFIRM-01 — typed load echoes the command, appends Game loaded. once and leaves turn and score unchanged', async ({
    page,
  }) => {
    await continueSavedGame(page, 7);
    const turnBefore = await liveTurn(page);
    expect(turnBefore).toBe(7);
    const scoreBefore = await scorePanel(page).textContent();
    const statusBefore = await statusText(page);
    const before = await transcript(page);

    await submit(page, 'load');
    await waitForLine(page, LOADED);

    const lines = await transcript(page);
    const added = lines.slice(before.length);
    expect(added[0], 'the raw command is echoed first').toBe('> load');
    expect(added.at(-1), 'the confirmation is the final rendered line').toBe(
      LOADED,
    );
    expect(countExact(added, LOADED), 'exactly one success line').toBe(1);
    expect(unexpectedConfirmation(added), 'no invented wording').toEqual([]);
    expect(countExact(lines, FAILED)).toBe(0);

    expect(await liveTurn(page), 'turn is not advanced by a meta load').toBe(
      turnBefore,
    );
    expect(await scorePanel(page).textContent()).toBe(scoreBefore);
    expect(await statusText(page)).toBe(statusBefore);
  });

  test('E2E-LOADCONFIRM-02 — the sidebar Load button and typed load produce the same single confirmation', async ({
    page,
  }) => {
    await continueSavedGame(page, 4);
    const before = await transcript(page);

    await page.getByRole('button', { name: 'Load', exact: true }).click();
    await waitForLine(page, LOADED);

    let lines = await transcript(page);
    let added = lines.slice(before.length);
    expect(
      added.some((line) => line.startsWith('>')),
      'a button press adds no command echo',
    ).toBe(false);
    expect(added.at(-1)).toBe(LOADED);
    expect(countExact(added, LOADED)).toBe(1);
    expect(unexpectedConfirmation(added)).toEqual([]);

    // Both input paths converge on Game.submit('load'), so typing after the
    // button adds the very same line and nothing else.
    await submit(page, 'load');
    await expect
      .poll(async () => countExact(await transcript(page), LOADED))
      .toBe(2);
    lines = await transcript(page);
    expect(lines).toContain('> load');
    added = lines.slice(before.length);
    expect(countExact(added, LOADED)).toBe(2);
    expect(unexpectedConfirmation(added)).toEqual([]);
    expect(countExact(lines, FAILED)).toBe(0);
  });

  test('E2E-LOADCONFIRM-03 — a failed load shows only the friendly failure copy with state unchanged', async ({
    page,
  }) => {
    await startNewGame(page);
    // New Game writes a fresh save, so remove it to reach the failure branch.
    await page.evaluate((key) => localStorage.removeItem(key), SAVE_KEY);
    const before = await transcript(page);
    const scoreBefore = await scorePanel(page).textContent();

    await submit(page, 'load');
    await waitForLine(page, FAILED);
    let lines = await transcript(page);
    expect(lines).toContain('> load');
    expect(countExact(lines, FAILED)).toBe(1);
    expect(countExact(lines, LOADED)).toBe(0);

    await page.getByRole('button', { name: 'Load', exact: true }).click();
    await expect
      .poll(async () => countExact(await transcript(page), FAILED))
      .toBe(2);
    lines = await transcript(page);
    expect(lines.slice(before.length)).toEqual(['> load', FAILED, FAILED]);
    expect(countExact(lines, LOADED), 'no success line anywhere').toBe(0);
    expect(unexpectedConfirmation(lines)).toEqual([]);
    expect(await scorePanel(page).textContent(), 'score panel unchanged').toBe(
      scoreBefore,
    );
  });
});
