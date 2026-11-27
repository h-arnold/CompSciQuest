// W7 accessibility evidence, split from the opening walkthrough by domain.
// Covers disabled-state exposure, labels, live transcript, keyboard order,
// visible focus, contrast, narrow reflow and reduced motion.
import { expect, test, type Page } from 'playwright/test';
import { quizzes } from '../src/content/authored/quizzes';

// prettier-ignore
const CONTROL_ORDER = ['Command', 'Save', 'Load', 'Download', 'Import', 'Restart'];

function parseColour(value: string): number[] {
  return (value.match(/[\d.]+/gu) ?? []).map(Number);
}

// prettier-ignore
function luminance(rgb: readonly number[]): number {
  const channels = rgb.slice(0, 3).map((channel) => {
    const scaled = channel / 255;
    return scaled <= 0.04045 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * (channels[0] ?? 0) + 0.7152 * (channels[1] ?? 0) + 0.0722 * (channels[2] ?? 0);
}

function contrastRatio(foreground: string, background: string): number {
  const light = luminance(parseColour(foreground));
  const dark = luminance(parseColour(background));
  return (Math.max(light, dark) + 0.05) / (Math.min(light, dark) + 0.05);
}

// prettier-ignore
async function contrastColours(page: import('playwright/test').Page): Promise<Record<string, { foreground: string; background: string }>> {
  return page.evaluate(() => {
    const result: Record<string, { foreground: string; background: string }> =
      {};
    for (const selector of ['.output-log', '.score-panel', 'button']) {
      const element = document.querySelector(selector);
      if (element === null)
        throw new Error(`Missing contrast target ${selector}`);
      const ancestors: Element[] = [];
      let current: Element | null = element;
      while (current !== null) {
        ancestors.push(current);
        current = current.parentElement;
      }
      const background =
        ancestors
          .map((node) => getComputedStyle(node).backgroundColor)
          .find((colour) => {
            const alpha = Number((colour.match(/[\d.]+/gu) ?? []).at(-1));
            return colour !== 'transparent' && alpha !== 0;
          }) ?? 'rgb(255, 255, 255)';
      result[selector] = {
        foreground: getComputedStyle(element).color,
        background,
      };
    }
    return result;
  });
}

// prettier-ignore
test('W7 accessibility — labels, live transcript, keyboard order, focus, contrast, reflow and reduced motion', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled();
  expect(
    await page.getByRole('button', { name: 'Continue' }).isDisabled(),
  ).toBe(true);
  await page.keyboard.press('Tab');
  expect(
    await page.evaluate(() => document.activeElement?.textContent?.trim()),
  ).toBe('New Game');
  await page.keyboard.press('Enter');
  await expect(page.locator('.workspace')).toBeVisible();
  const attributes = await page.evaluate(() => ({
    role: document.querySelector('.output-log')?.getAttribute('role'),
    live: document.querySelector('.output-log')?.getAttribute('aria-live'),
    label: document.querySelector('input')?.getAttribute('aria-label'),
  }));
  expect(attributes).toEqual({ role: 'log', live: 'polite', label: 'Command' });
  await page.keyboard.press('Tab');
  const order: string[] = [];
  for (let index = 0; index < CONTROL_ORDER.length; index += 1) {
    await page.keyboard.press('Tab');
    order.push(
      (await page.evaluate(
        () =>
          document.activeElement?.getAttribute('aria-label') ??
          document.activeElement?.textContent?.trim(),
      )) ?? '',
    );
  }
  expect(order).toEqual(CONTROL_ORDER);
  const focus = await page.evaluate(() => {
    const style = getComputedStyle(document.activeElement ?? document.body);
    return { style: style.outlineStyle, width: style.outlineWidth };
  });
  expect(focus.style).not.toBe('none');
  const colours = await contrastColours(page);
  for (const pair of Object.values(colours)) {
    expect(
      contrastRatio(pair.foreground, pair.background),
    ).toBeGreaterThanOrEqual(4.5);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  const widths = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.client);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const motion = await page.evaluate(() => ({
    matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
    durations: [
      ...document.querySelectorAll('.window, .output-log, button'),
    ].flatMap((element) => {
      const style = getComputedStyle(element);
      return [style.transitionDuration, style.animationDuration];
    }),
  }));
  expect(motion.matches).toBe(true);
  expect(motion.durations.every((duration) => duration === '0s')).toBe(true);
});

// E2E-PASSMARK-A11Y-01..02 — the requirement line is a polite live region while
// an authored quiz is active, and no stale live-region node survives a fresh
// start. Values come from the generated authored quiz, never from prose copy.
function requirementNode(page: Page) {
  return page.locator('.quiz-panel > p');
}

async function accessibilityCommand(page: Page, raw: string): Promise<void> {
  await page.getByRole('textbox', { name: 'Command' }).fill(raw);
  await page.getByRole('textbox', { name: 'Command' }).press('Enter');
}

async function enterSwitchyardQuiz(page: Page): Promise<void> {
  await page.goto('./');
  await page.getByRole('button', { name: 'New Game' }).click();
  await expect(page.locator('.workspace')).toBeVisible();
  await accessibilityCommand(page, 'east');
  await accessibilityCommand(page, 'east');
  // Room-entry effects must settle before the quiz trigger (ENG10 correction).
  await expect(
    page.locator('.output-log > div', { hasText: 'The Binary Hall' }).first(),
  ).toBeVisible();
  await accessibilityCommand(page, 'ask foreman about switch-to-bit');
  await expect(page.locator('.quiz-panel')).toBeVisible();
}

test.describe('ENG30-PASSMARK-A11Y-01 — quiz requirement live region', () => {
  test('E2E-PASSMARK-A11Y-01 — the active quiz requirement is an aria-live polite paragraph with no console errors', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => {
      errors.push(String(error));
    });

    const quiz = quizzes.find((entry) => entry.id === 'quiz-switchyard');
    if (quiz === undefined) {
      throw new Error("Authored quiz 'quiz-switchyard' is missing");
    }
    await enterSwitchyardQuiz(page);

    const count = quiz.questionIds.length;
    const node = requirementNode(page);
    await expect(node).toHaveText(
      `Pass mark: ${quiz.passMark} correct of ${count}. Wrong answers allowed: ${count - quiz.passMark}.`,
    );
    await expect(node).toHaveAttribute('aria-live', 'polite');
    expect(await node.locator('*').count(), 'text-only live region').toBe(0);
    await expect(page.locator('.output-log')).toHaveAttribute(
      'aria-live',
      'polite',
    );
    expect(errors, 'no console errors').toEqual([]);
  });

  test('E2E-PASSMARK-A11Y-02 — a fresh start leaves no requirement live region and keeps the transcript one', async ({
    page,
  }) => {
    await enterSwitchyardQuiz(page);
    await expect(requirementNode(page)).toHaveCount(1);

    await page.reload();
    await page.getByRole('button', { name: 'New Game' }).click();
    await expect(page.locator('.workspace')).toBeVisible();
    await expect(page.locator('.quiz-panel')).toBeHidden();
    await expect(requirementNode(page)).toHaveCount(0);
    await expect(page.locator('.output-log')).toHaveAttribute(
      'aria-live',
      'polite',
    );
  });
});
