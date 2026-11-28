// UI-LOGSCROLL-01/02/03 — browser E2E for OutputLog scroll behaviour on an
// overflowing `.output-log`. Pins observable scroll geometry and the
// `role="log"` / `aria-live="polite"` seam, not private internals; no generated
// copy is re-pinned. Confirmed by browser exploration QA and W7 playtest:
// .opencode/scratchpad/slices/ui-log-scroll*/qa-report.md,
// .opencode/scratchpad/slices/ui-log-scroll-resize/qa-report.md,
// PLAYTEST-issue1-arrival-ai-final2.md §Steps 8–12. Matrix IDs in test names.
import { expect, test, type Page } from 'playwright/test';
import {
  readStorage,
  SAVE_KEY,
  scorePanel,
  seedStorage,
  startNewGame,
  submit,
  watchConsole,
} from './helpers';

// PIN_TOLERANCE_PX in src/ui/OutputLog.ts: sub-pixel rounding in scroll range.
const PIN_TOLERANCE_PX = 2;

const WIDE = { width: 1280, height: 900 };
const NARROW = { width: 390, height: 844 };

interface ScrollGeometry {
  readonly scrollTop: number;
  readonly scrollHeight: number;
  readonly clientHeight: number;
  readonly distanceFromBottom: number;
  readonly overflowing: boolean;
}

async function scrollGeometry(page: Page): Promise<ScrollGeometry> {
  return page.locator('.output-log').evaluate((element) => {
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    return {
      scrollTop,
      scrollHeight,
      clientHeight,
      distanceFromBottom: scrollHeight - clientHeight - scrollTop,
      overflowing: scrollHeight > clientHeight,
    };
  });
}

async function expectLogSemantics(page: Page): Promise<void> {
  const log = page.locator('.output-log');
  await expect(log).toHaveAttribute('role', 'log');
  await expect(log).toHaveAttribute('aria-live', 'polite');
}

async function expectPinned(page: Page): Promise<void> {
  await expectLogSemantics(page);
  await expect
    .poll(
      async () => {
        const g = await scrollGeometry(page);
        return g.overflowing;
      },
      {
        message: '.output-log overflows',
      },
    )
    .toBe(true);
  await expect
    .poll(
      async () => {
        const g = await scrollGeometry(page);
        return Math.abs(g.distanceFromBottom);
      },
      {
        message: 'distance from bottom is 0 within PIN_TOLERANCE_PX',
      },
    )
    .toBeLessThanOrEqual(PIN_TOLERANCE_PX);
  const g = await scrollGeometry(page);
  expect(
    Math.abs(g.scrollTop - (g.scrollHeight - g.clientHeight)),
  ).toBeLessThanOrEqual(PIN_TOLERANCE_PX);
}

// Start a fresh New Game and submit ordinary `look` commands (no invented
// trigger/precondition; `look` produces fresh output and no save/score change)
// until the transcript overflows and the log is pinned to the newest line.
async function produceOverflowingPinnedLog(page: Page): Promise<void> {
  await startNewGame(page);
  await submit(page, 'look');
  await submit(page, 'look');
  await submit(page, 'look');
  await expectPinned(page);
}

// Deliberate scroll-back: move to an earlier position and leave the log idle.
async function scrollBack(page: Page): Promise<number> {
  await page.locator('.output-log').evaluate((element) => {
    element.scrollTop = 0;
  });
  await expect
    .poll(async () => {
      const g = await scrollGeometry(page);
      return g.scrollTop;
    })
    .toBe(0);
  const g = await scrollGeometry(page);
  return g.scrollTop;
}

interface StateSnapshot {
  readonly save: string | null;
  readonly score: string;
  readonly transcriptLength: number;
}

async function stateSnapshot(page: Page): Promise<StateSnapshot> {
  return {
    save: await readStorage(page, SAVE_KEY),
    score: (await scorePanel(page).textContent()) ?? '',
    transcriptLength: await page.locator('.output-log > div').count(),
  };
}

const noConsoleErrors: () => readonly string[] = () => [];

test.describe('UI-LOGSCROLL transcript scroll behaviour', () => {
  let errors: () => readonly string[] = noConsoleErrors;

  test.beforeEach(async ({ page }) => {
    errors = watchConsole(page);
    await seedStorage(page, {});
  });

  test.afterEach(() => {
    expect(errors(), 'no console errors').toEqual([]);
  });

  test('E2E-LOGSCROLL-01 / UI-LOGSCROLL-01 — fresh output on overflowing log pins to bottom', async ({
    page,
  }) => {
    await page.setViewportSize(WIDE);
    await produceOverflowingPinnedLog(page);

    // Submit one ordinary command producing fresh output; once the whole batch
    // is appended, distance = scrollHeight - clientHeight - scrollTop = 0.
    const beforeLength = await page.locator('.output-log > div').count();
    await submit(page, 'look');

    await expectPinned(page);
    await expect
      .poll(async () => page.locator('.output-log > div').count())
      .toBeGreaterThan(beforeLength);
    // Player-command echo `> <raw input>` is present; echo stays plain.
    await expect(
      page.locator('.output-log').getByText('> look', { exact: true }).last(),
    ).toBeVisible();
  });

  test('E2E-LOGSCROLL-02 / UI-LOGSCROLL-02 — echo + Markdown block output pins; idle scroll-back not yanked; no state change; fresh output re-pins', async ({
    page,
  }) => {
    await page.setViewportSize(WIDE);
    await produceOverflowingPinnedLog(page);

    // One ordinary command: player-command echo `> raw` plus Markdown block
    // output in the same turn finishes pinned; no save/load/import/download/
    // restart is involved.
    const beforeLength = await page.locator('.output-log > div').count();
    await submit(page, 'look');
    await expectPinned(page);
    await expect(
      page.locator('.output-log').getByText('> look', { exact: true }).last(),
    ).toBeVisible();
    // Markdown block output appended after the echo in the same turn.
    await expect
      .poll(async () => page.locator('.output-log > div').count())
      .toBeGreaterThan(beforeLength + 1);
    await expectLogSemantics(page);

    // Snapshot state before an idle scroll-back.
    const beforeIdle = await stateSnapshot(page);
    const scrolledTop = await scrollBack(page);

    // Idle scroll-back: no new output; the viewport is not moved back to
    // bottom while idle; no save/score/state change.
    await page.waitForFunction(
      () => document.querySelector('.output-log')!.scrollTop === 0,
    );
    const afterIdleGeometry = await scrollGeometry(page);
    expect(afterIdleGeometry.scrollTop).toBe(scrolledTop);
    expect(afterIdleGeometry.distanceFromBottom).toBeGreaterThan(
      PIN_TOLERANCE_PX,
    );
    expect(await stateSnapshot(page)).toEqual(beforeIdle);
    await expectLogSemantics(page);

    // Fresh output after scroll-back re-pins to the bottom.
    await submit(page, 'look');
    await expectPinned(page);
  });

  test('E2E-LOGSCROLL-03a / UI-LOGSCROLL-03 — pinned resize re-pins at new height', async ({
    page,
  }) => {
    await page.setViewportSize(WIDE);
    await produceOverflowingPinnedLog(page);

    // Starting pinned on an overflowing log; snapshot state. No new output,
    // no save/load/import/download/restart.
    const before = await stateSnapshot(page);
    const beforeResize = await scrollGeometry(page);
    expect(beforeResize.overflowing).toBe(true);
    expect(Math.abs(beforeResize.distanceFromBottom)).toBeLessThanOrEqual(
      PIN_TOLERANCE_PX,
    );

    // Resize 1280×900 → 390×844.
    await page.setViewportSize(NARROW);

    await expectPinned(page);
    // Re-pinned at the new height; no new output needed.
    const afterResize = await scrollGeometry(page);
    expect(afterResize.overflowing).toBe(true);
    expect(Math.abs(afterResize.distanceFromBottom)).toBeLessThanOrEqual(
      PIN_TOLERANCE_PX,
    );
    expect(await stateSnapshot(page)).toEqual(before);
    await expectLogSemantics(page);
  });

  test('E2E-LOGSCROLL-03b / UI-LOGSCROLL-03 — resize after idle scroll-back is not yanked to bottom', async ({
    page,
  }) => {
    await page.setViewportSize(WIDE);
    await produceOverflowingPinnedLog(page);

    // Deliberate scroll-back, then idle.
    await scrollBack(page);
    await page.waitForFunction(
      () => document.querySelector('.output-log')!.scrollTop === 0,
    );
    const before = await stateSnapshot(page);
    const beforeResize = await scrollGeometry(page);
    expect(beforeResize.scrollTop).toBe(0);
    expect(beforeResize.distanceFromBottom).toBeGreaterThan(PIN_TOLERANCE_PX);

    // Resize 1280×900 → 390×844 with no new output; scroll-back preserved,
    // not re-pinned. No save/load/import/download/restart.
    await page.setViewportSize(NARROW);

    await expectLogSemantics(page);
    await expect
      .poll(async () => {
        const g = await scrollGeometry(page);
        return g.overflowing;
      })
      .toBe(true);
    // Not yanked to bottom.
    await expect
      .poll(async () => {
        const g = await scrollGeometry(page);
        return Math.abs(g.distanceFromBottom);
      })
      .toBeGreaterThan(PIN_TOLERANCE_PX);
    const afterResize = await scrollGeometry(page);
    expect(afterResize.scrollTop).toBe(0);
    expect(await stateSnapshot(page)).toEqual(before);
  });
});
