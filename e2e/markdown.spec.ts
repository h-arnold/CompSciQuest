// MD-CSS-01–07 — browser evidence for transcript styling. The DOM injected
// here has the same shape as src/ui/markdown/renderMarkdown.ts output (real
// table/thead/tbody/th/td inside div.table-scroll, pre > code, ol/ul and
// blockquote); no source, stylesheet or content card is edited. Content IDs
// are not pinned: the only real command used is `help` for the Pages link.
import { expect, test, type Page } from 'playwright/test';
import { seedStorage, startNewGame, submit, watchConsole } from './helpers';

const RICH_ENTRY_ID = 'qa-rich-entry';
const WIDE_VIEWPORT = { width: 1440, height: 900 };
const NARROW_VIEWPORT = { width: 390, height: 844 };
const PAGES_URL = 'https://h-arnold.github.io/CompSciQuest/';

interface Layout {
  readonly pageScrollWidth: number;
  readonly pageClientWidth: number;
  readonly logClientWidth: number;
  readonly logRight: number;
  readonly logOverflowX: string;
  readonly entryRight: number;
  readonly wrapRight: number;
  readonly wrapClientWidth: number;
  readonly wrapScrollWidth: number;
  readonly wrapOverflowX: string;
  readonly preRight: number;
  readonly preClientWidth: number;
  readonly preScrollWidth: number;
  readonly preOverflowX: string;
  readonly preWhiteSpace: string;
  readonly codeWidth: number;
  readonly codeHeight: number;
  readonly codeLineHeight: number;
  readonly codeRects: number;
}

async function appendRichEntry(page: Page): Promise<void> {
  await page.evaluate((entryId) => {
    const log = document.querySelector('.output-log');
    if (log === null) throw new Error('Transcript log is missing');
    const entry = document.createElement('div');
    entry.id = entryId;

    const heading = document.createElement('h2');
    heading.textContent = 'Wide table and fenced code probe';
    entry.append(heading);
    const paragraph = document.createElement('p');
    paragraph.textContent = 'A paragraph inside the rendered entry.';
    entry.append(paragraph);

    const wrapper = document.createElement('div');
    wrapper.className = 'table-scroll';
    const table = document.createElement('table');
    const head = document.createElement('thead');
    const headRow = document.createElement('tr');
    for (const label of [
      'Topic',
      'Very long header column that must not widen the page',
    ]) {
      const cell = document.createElement('th');
      cell.setAttribute('scope', 'col');
      cell.textContent = label;
      headRow.append(cell);
    }
    head.append(headRow);
    table.append(head);
    const body = document.createElement('tbody');
    const rows: readonly (readonly [string, string])[] = [
      ['Algorithms', 'A'.repeat(120)],
      ['Programming', 'B'.repeat(120)],
    ];
    for (const [label, value] of rows) {
      const row = document.createElement('tr');
      for (const text of [label, value]) {
        const cell = document.createElement('td');
        cell.textContent = text;
        row.append(cell);
      }
      body.append(row);
    }
    table.append(body);
    wrapper.append(table);
    entry.append(wrapper);

    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.className = 'language-text';
    code.textContent = `const deliberatelyLongToken = ${'X'.repeat(180)};`;
    pre.append(code);
    entry.append(pre);

    const ordered = document.createElement('ol');
    const bullet = document.createElement('ul');
    for (const list of [ordered, bullet]) {
      for (const text of ['First item', 'Second item']) {
        const item = document.createElement('li');
        item.textContent = text;
        list.append(item);
      }
      entry.append(list);
    }
    const quote = document.createElement('blockquote');
    const quoteParagraph = document.createElement('p');
    quoteParagraph.textContent = 'A quoted line.';
    quote.append(quoteParagraph);
    entry.append(quote);

    log.append(entry);
  }, RICH_ENTRY_ID);
}

async function readLayout(page: Page): Promise<Layout> {
  return page.evaluate((entryId) => {
    const find = (selector: string): HTMLElement => {
      const element = document.querySelector<HTMLElement>(selector);
      if (element === null) throw new Error(`Missing ${selector}`);
      return element;
    };
    const log = find('.output-log');
    const entry = find(`#${entryId}`);
    const wrap = find(`#${entryId} .table-scroll`);
    const pre = find(`#${entryId} pre`);
    const code = find(`#${entryId} pre code`);
    const codeStyle = getComputedStyle(code);
    return {
      pageScrollWidth: document.documentElement.scrollWidth,
      pageClientWidth: document.documentElement.clientWidth,
      logClientWidth: log.clientWidth,
      logRight: log.getBoundingClientRect().right,
      logOverflowX: getComputedStyle(log).overflowX,
      entryRight: entry.getBoundingClientRect().right,
      wrapRight: wrap.getBoundingClientRect().right,
      wrapClientWidth: wrap.clientWidth,
      wrapScrollWidth: wrap.scrollWidth,
      wrapOverflowX: getComputedStyle(wrap).overflowX,
      preRight: pre.getBoundingClientRect().right,
      preClientWidth: pre.clientWidth,
      preScrollWidth: pre.scrollWidth,
      preOverflowX: getComputedStyle(pre).overflowX,
      preWhiteSpace: getComputedStyle(pre).whiteSpace,
      codeWidth: code.getBoundingClientRect().width,
      codeHeight: code.getBoundingClientRect().height,
      codeLineHeight: Number(codeStyle.lineHeight.replace('px', '')),
      codeRects: code.getClientRects().length,
    };
  }, RICH_ENTRY_ID);
}

// prettier-ignore
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

test.describe('markdown transcript styling (MD-CSS-01–07)', () => {
  let errors: () => readonly string[];

  test.beforeEach(async ({ page }) => {
    errors = watchConsole(page);
    await seedStorage(page, {});
    await startNewGame(page);
  });

  test.afterEach(() => {
    expect(errors(), 'no console errors during markdown styling flows').toEqual(
      [],
    );
  });

  test('MD-CSS-01 — a wide table scrolls in its entry without a page scrollbar', async ({
    page,
  }) => {
    await page.setViewportSize(WIDE_VIEWPORT);
    await appendRichEntry(page);
    const layout = await readLayout(page);

    expect(layout.wrapOverflowX).toBe('auto');
    expect(layout.wrapScrollWidth).toBeGreaterThan(layout.wrapClientWidth);
    expect(layout.pageScrollWidth).toBeLessThanOrEqual(layout.pageClientWidth);
    expect(layout.wrapRight).toBeLessThanOrEqual(layout.logRight);
    expect(layout.entryRight).toBeLessThanOrEqual(layout.logRight);
    const scrolled = await page.evaluate((entryId) => {
      const wrap = document.querySelector(`#${entryId} .table-scroll`);
      if (wrap === null) throw new Error('Table wrapper is missing');
      wrap.scrollLeft = 99_999;
      return wrap.scrollLeft;
    }, RICH_ENTRY_ID);
    expect(scrolled).toBeGreaterThan(0);
    await expect(
      page.locator(`#${RICH_ENTRY_ID} .table-scroll th`),
    ).toHaveCount(2);
  });

  test('MD-CSS-02 — a long fenced line scrolls in pre without wrapping mid-token', async ({
    page,
  }) => {
    await page.setViewportSize(WIDE_VIEWPORT);
    await appendRichEntry(page);
    const layout = await readLayout(page);

    expect(layout.preOverflowX).toBe('auto');
    expect(layout.preWhiteSpace).toBe('pre');
    expect(layout.preScrollWidth).toBeGreaterThan(layout.preClientWidth);
    expect(layout.codeWidth).toBeGreaterThan(layout.preClientWidth);
    expect(layout.codeRects).toBe(1);
    expect(layout.codeHeight).toBeLessThanOrEqual(layout.codeLineHeight + 1);
    expect(layout.preRight).toBeLessThanOrEqual(layout.logRight);
    expect(layout.pageScrollWidth).toBeLessThanOrEqual(layout.pageClientWidth);
    const scrolled = await page.evaluate((entryId) => {
      const pre = document.querySelector(`#${entryId} pre`);
      if (pre === null) throw new Error('Fence is missing');
      pre.scrollLeft = 99_999;
      return pre.scrollLeft;
    }, RICH_ENTRY_ID);
    expect(scrolled).toBeGreaterThan(0);
  });

  test('MD-CSS-03 — narrow viewport keeps table, fence and lists inside the transcript', async ({
    page,
  }) => {
    await page.setViewportSize(NARROW_VIEWPORT);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await appendRichEntry(page);
    const layout = await readLayout(page);

    expect(layout.pageScrollWidth).toBeLessThanOrEqual(layout.pageClientWidth);
    expect(layout.logOverflowX).toBe('hidden');
    expect(layout.entryRight).toBeLessThanOrEqual(layout.logRight);
    expect(layout.wrapRight).toBeLessThanOrEqual(layout.logRight);
    expect(layout.preRight).toBeLessThanOrEqual(layout.logRight);
    expect(layout.wrapScrollWidth).toBeGreaterThan(layout.wrapClientWidth);
    expect(layout.preScrollWidth).toBeGreaterThan(layout.preClientWidth);
    await expect(page.locator(`#${RICH_ENTRY_ID} ol li`)).toHaveCount(2);
    await expect(page.locator(`#${RICH_ENTRY_ID} ul li`)).toHaveCount(2);
    const motion = await page.evaluate(() => ({
      matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
      durations: [
        ...document.querySelectorAll('.window, .output-log, a, button'),
      ].flatMap((element) => {
        const style = getComputedStyle(element);
        return [style.transitionDuration, style.animationDuration];
      }),
    }));
    expect(motion.matches).toBe(true);
    expect(motion.durations.every((duration) => duration === '0s')).toBe(true);
  });

  test('MD-CSS-04 — the Pages link is focusable, safe, high-contrast and opens a new tab', async ({
    page,
  }) => {
    await page.setViewportSize(WIDE_VIEWPORT);
    await submit(page, 'help');
    const link = page.locator('.output-log a');
    await expect(link).toHaveCount(1);
    await expect(link).toHaveText('CompSciQuest on GitHub Pages');
    await expect(link).toHaveAttribute('href', PAGES_URL);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');

    const style = await page.evaluate(() => {
      const anchor = document.querySelector('.output-log a');
      if (anchor === null) throw new Error('Pages link is missing');
      const anchorStyle = getComputedStyle(anchor);
      const logStyle = getComputedStyle(
        document.querySelector('.output-log') as Element,
      );
      return {
        underline: anchorStyle.textDecorationLine,
        foreground: anchorStyle.color,
        background: logStyle.backgroundColor,
      };
    });
    expect(style.underline).toContain('underline');
    expect(
      contrastRatio(style.foreground, style.background),
    ).toBeGreaterThanOrEqual(4.5);

    await page.getByRole('textbox', { name: 'Command' }).focus();
    await page.keyboard.press('Shift+Tab');
    const focus = await page.evaluate(() => {
      const anchor = document.querySelector('.output-log a');
      if (anchor === null) throw new Error('Pages link is missing');
      const focusStyle = getComputedStyle(anchor);
      return {
        focused: document.activeElement === anchor,
        visible: anchor.matches(':focus-visible'),
        outline: focusStyle.outlineStyle,
        width: Number(focusStyle.outlineWidth.replace('px', '')),
        offset: focusStyle.outlineOffset,
      };
    });
    expect(focus.focused).toBe(true);
    expect(focus.visible).toBe(true);
    expect(focus.outline).not.toBe('none');
    expect(focus.width).toBeGreaterThanOrEqual(2);
    expect(focus.offset).not.toBe('0px');

    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      link.click(),
    ]);
    expect(popup.url()).toBe(PAGES_URL);
    await popup.close();
  });

  test('MD-CSS-05 — transcript rhythm, heading scale and list indentation are readable', async ({
    page,
  }) => {
    await page.setViewportSize(WIDE_VIEWPORT);
    await appendRichEntry(page);
    const typography = await page.evaluate((entryId) => {
      const find = (selector: string): HTMLElement => {
        const element = document.querySelector(selector);
        if (!(element instanceof HTMLElement)) {
          throw new TypeError(`Missing typography target ${selector}`);
        }
        return element;
      };
      const log = find('.output-log');
      const entry = find(`#${entryId}`);
      const logStyle = getComputedStyle(log);
      const paragraphStyle = getComputedStyle(find(`#${entryId} p`));
      const headingStyle = getComputedStyle(find(`#${entryId} h2`));
      const orderedStyle = getComputedStyle(find(`#${entryId} ol`));
      const bulletStyle = getComputedStyle(find(`#${entryId} ul`));
      const empty = document.querySelector<HTMLElement>(
        '.output-log > div:empty',
      );
      if (empty === null) throw new Error('Empty entry is missing');
      return {
        fontSize: Number(logStyle.fontSize.replace('px', '')),
        lineHeight: Number(logStyle.lineHeight.replace('px', '')),
        paragraphSpacing: Number(paragraphStyle.marginBottom.replace('px', '')),
        entrySpacing: Number(
          getComputedStyle(entry).marginTop.replace('px', ''),
        ),
        emptyMinHeight: Number(
          getComputedStyle(empty).minHeight.replace('px', ''),
        ),
        headingSize: Number(headingStyle.fontSize.replace('px', '')),
        headingWeight: Number(headingStyle.fontWeight),
        orderedIndent: Number(orderedStyle.paddingLeft.replace('px', '')),
        bulletIndent: Number(bulletStyle.paddingLeft.replace('px', '')),
      };
    }, RICH_ENTRY_ID);

    expect(typography.lineHeight / typography.fontSize).toBeGreaterThanOrEqual(
      1.4,
    );
    expect(typography.paragraphSpacing).toBeGreaterThanOrEqual(4);
    expect(typography.entrySpacing).toBeLessThan(typography.paragraphSpacing);
    expect(typography.emptyMinHeight).toBeGreaterThanOrEqual(
      typography.lineHeight,
    );
    expect(typography.headingSize).toBeLessThanOrEqual(
      typography.fontSize * 1.3,
    );
    expect(typography.headingWeight).toBeGreaterThanOrEqual(600);
    expect(typography.orderedIndent).toBeGreaterThanOrEqual(16);
    expect(typography.bulletIndent).toBeGreaterThanOrEqual(16);
  });

  test('MD-CSS-06 — real table, list and fence elements carry structure without inline styles', async ({
    page,
  }) => {
    await page.setViewportSize(WIDE_VIEWPORT);
    await appendRichEntry(page);
    await submit(page, 'help');
    const semantics = await page.evaluate((entryId) => {
      const find = (selector: string): HTMLElement => {
        const element = document.querySelector(selector);
        if (!element) throw new Error(`Missing semantic target ${selector}`);
        return element as HTMLElement;
      };
      const entry = find(`#${entryId}`);
      const table = find(`#${entryId} .table-scroll table`);
      const code = find(`#${entryId} pre code`);
      const styleAttributes = [...document.querySelectorAll('.output-log *')]
        .filter((element) => element.hasAttribute('style'))
        .map((element) => element.outerHTML);
      return {
        tags: {
          table: table.tagName,
          thead: find(`#${entryId} thead`).tagName,
          tbody: find(`#${entryId} tbody`).tagName,
          th: find(`#${entryId} th`).tagName,
          td: find(`#${entryId} td`).tagName,
          ol: find(`#${entryId} ol`).tagName,
          ul: find(`#${entryId} ul`).tagName,
          pre: find(`#${entryId} pre`).tagName,
          code: code.tagName,
        },
        scope: find(`#${entryId} th`).getAttribute('scope'),
        codeParent: code.parentElement?.tagName,
        listStyle: getComputedStyle(find(`#${entryId} ul`)).listStyleType,
        headWeight: Number(getComputedStyle(find(`#${entryId} th`)).fontWeight),
        quoteBorder: Number(
          getComputedStyle(
            find(`#${entryId} blockquote`),
          ).borderLeftWidth.replace('px', ''),
        ),
        inlineBackground: getComputedStyle(find('.output-log li code'))
          .backgroundColor,
        styleAttributes,
        entryTag: entry.tagName,
      };
    }, RICH_ENTRY_ID);

    expect(semantics.tags).toEqual({
      table: 'TABLE',
      thead: 'THEAD',
      tbody: 'TBODY',
      th: 'TH',
      td: 'TD',
      ol: 'OL',
      ul: 'UL',
      pre: 'PRE',
      code: 'CODE',
    });
    expect(semantics.scope).toBe('col');
    expect(semantics.codeParent).toBe('PRE');
    expect(semantics.listStyle).not.toBe('none');
    expect(semantics.headWeight).toBeGreaterThanOrEqual(600);
    expect(semantics.quoteBorder).toBeGreaterThan(0);
    expect(semantics.inlineBackground).not.toBe('rgba(0, 0, 0, 0)');
    expect(semantics.styleAttributes).toEqual([]);
  });

  test('MD-CSS-07 — the live transcript still accepts and exposes a line after rich content', async ({
    page,
  }) => {
    await page.setViewportSize(NARROW_VIEWPORT);
    await appendRichEntry(page);
    const log = page.locator('.output-log');
    await expect(log).toHaveAttribute('role', 'log');
    await expect(log).toHaveAttribute('aria-live', 'polite');
    const widthBefore = await page.evaluate(
      () => document.querySelector('.output-log')?.clientWidth,
    );

    await submit(page, 'score');
    const echoed = log.locator(':scope > div', { hasText: '> score' });
    await expect(echoed).toHaveCount(1);
    await expect(echoed).toBeVisible();
    const appended = log.locator(':scope > div').last();
    await expect(appended).toContainText('Your score is 0.');
    const boundary = await page.evaluate(() => {
      const transcript = document.querySelector('.output-log');
      if (transcript === null) throw new Error('Transcript is missing');
      const last = transcript.lastElementChild;
      if (last === null) throw new Error('No appended entry');
      transcript.scrollTop = transcript.scrollHeight;
      const logRect = transcript.getBoundingClientRect();
      const entryRect = last.getBoundingClientRect();
      return {
        role: transcript.getAttribute('role'),
        live: transcript.getAttribute('aria-live'),
        text: last.textContent,
        echoPresent: [...transcript.children].some((node) =>
          (node.textContent ?? '').includes('> score'),
        ),
        inViewport:
          entryRect.top >= logRect.top && entryRect.bottom <= logRect.bottom,
        clientWidth: transcript.clientWidth,
        pageScrollWidth: document.documentElement.scrollWidth,
        pageClientWidth: document.documentElement.clientWidth,
      };
    });
    expect(boundary.role).toBe('log');
    expect(boundary.live).toBe('polite');
    expect(boundary.text).toContain('Your score is 0.');
    expect(boundary.echoPresent).toBe(true);
    expect(boundary.inViewport).toBe(true);
    expect(boundary.clientWidth).toBe(widthBefore);
    expect(boundary.pageScrollWidth).toBeLessThanOrEqual(
      boundary.pageClientWidth,
    );
    await submit(page, 'help');
    await expect(
      log.locator('a', { hasText: 'CompSciQuest on GitHub Pages' }),
    ).toBeVisible();
  });
});
