// ENG6-FAVICON-01 (part c) — the page icon in a real browser.
// Parts (a) and (b) are covered by tests/static/Favicon.test.ts; these checks
// verify that the declared icon resolves in the served app and that the first
// load produces no missing-resource response or console error.
import { expect, test } from 'playwright/test';
import { seedStorage, watchConsole } from './helpers';

const ICON_MIME = 'image/svg+xml';
const ICON_REQUEST = /favicon|\.ico/iu;
const noConsoleErrors: () => readonly string[] = () => [];

test.describe('static page icon', () => {
  let errors: () => readonly string[] = noConsoleErrors;
  let failedIconResponses: string[] = [];

  test.beforeEach(async ({ page }) => {
    errors = watchConsole(page);
    failedIconResponses = [];
    page.on('response', (response) => {
      if (ICON_REQUEST.test(response.url()) && response.status() >= 400) {
        failedIconResponses.push(`${response.status()} ${response.url()}`);
      }
    });
    await seedStorage(page, {});
    await page.goto('./');
  });

  test.afterEach(() => {
    expect(errors(), 'no console errors').toEqual([]);
    expect(failedIconResponses, 'no failing icon responses').toEqual([]);
  });

  test('ENG6-FAVICON-01 — the page icon link resolves to a parseable SVG', async ({
    page,
  }) => {
    const icon = page.locator('link[rel~="icon"]');
    await expect(icon).toHaveCount(1);
    await expect(icon).toHaveAttribute('type', ICON_MIME);

    const href = await icon.getAttribute('href');
    expect(href).toBeTruthy();
    // Vite rebases the root-absolute href onto the Pages base path. Querying
    // through the page URL keeps this valid in dev and in the built site
    // without pinning the generated asset hash.
    expect(href).toContain('/CompSciQuest/');

    const iconUrl = new URL(href as string, page.url()).href;
    const response = await page.request.get(iconUrl);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain(ICON_MIME);

    const svg = await response.text();
    const parsed = await page.evaluate((text: string) => {
      const svgDocument = new DOMParser().parseFromString(
        text,
        'image/svg+xml',
      );
      return {
        root: svgDocument.documentElement.tagName,
        parseError: svgDocument.querySelector('parsererror') !== null,
        viewBox: svgDocument.documentElement.getAttribute('viewBox'),
      };
    }, svg);
    expect(parsed.root).toBe('svg');
    expect(parsed.parseError).toBe(false);
    expect(parsed.viewBox).toBeTruthy();
  });
});
