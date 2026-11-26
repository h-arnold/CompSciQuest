// W7 accessibility evidence, split from the opening walkthrough by domain.
// Covers disabled-state exposure, labels, live transcript, keyboard order,
// visible focus, contrast, narrow reflow and reduced motion.
import { expect, test } from 'playwright/test';

// prettier-ignore
const CONTROL_ORDER = ['Command', 'Save', 'Load', 'Download', 'Import', 'Restart', 'Download quarantined save'];

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
