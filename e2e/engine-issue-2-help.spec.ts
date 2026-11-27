// Engine issue 2 / ENG2-HELP-01 (Batch E Group A). The player-facing help reply
// is generated from the canonical command table, so these checks assert the
// promised syntax and aliases through the browser rather than pinning content
// IDs. MD-HELP-01/02 (spec §6.3) changed the layout to six bold group headings,
// inline-code syntax and one allow-listed Pages footer link; the assertions
// below follow that contract without weakening the promised command coverage.
// Navigation uses Playwright's configured baseURL by default; CSQ_E2E_URL
// may point a local repro at another server.
import { expect, test, type Locator, type Page } from 'playwright/test';
import {
  seedStorage,
  START_ROOM_TITLE,
  submit,
  transcript,
  watchConsole,
} from './helpers';

const APP_URL = process.env['CSQ_E2E_URL'];

// The transcript accessor reads textContent, so Markdown markers are stripped:
// `**Reading the room**` is present in the DOM as a strong heading and read as
// "Reading the room". The legend bullet alongside it makes the match unique.
const HELP_LEAD = 'Reading the room';
const HELP_LEGEND = 'Bold marks something you can examine or use.';
const HELP_GROUPS = [
  'Reading the room',
  'Movement',
  'Looking and handling',
  'People',
  'Progress',
  'Saves',
] as const;
const PAGES_LINK = 'https://h-arnold.github.io/CompSciQuest/';
const PAGES_LINK_TEXT = 'CompSciQuest on GitHub Pages';

const noConsoleErrors: () => readonly string[] = () => [];

// Every row is a syntax/alias that the canonical table promises. The exact
// layout is generated, so only the promised substrings are pinned here.
const PROMISED = [
  'go <direction>',
  'n, s, e, w, u, d, in, out',
  'take <item>  (get, pick up)',
  'drop <item>  (put down)',
  'use <item> on <target>',
  'examine <target>  (x, look at)',
  'open <target>',
  'close <target>  (shut)',
  'unlock <item> <target>',
  'put <item> <target>',
  'look',
  'inventory  (i, inv)',
  'score',
  'help  (?)',
  'talk-to <npc>  (talk)',
  'ask <npc> about <topic>',
  'tell <npc> about <topic>',
  'give <npc> <item>',
  'show <npc> <item>',
  'bye  (goodbye)',
  'answer N',
  'hint [target]',
  // MD-HELP-01 replaced the old `Directions: north (n), …` prose line with the
  // inline-code direction names plus the canonical alias suffix on the `go`
  // row (spec §6.3). Both lists are pinned here so every direction name and
  // every short/long alias remains covered in the generated order.
  'go <direction> — or type a direction: north, south, east, west, up, down, in, out',
  '(n, s, e, w, u, d, in, out, north, south, east, west, up, down)',
] as const;

function helpEntry(lines: readonly string[]): string {
  const entry = lines.find(
    (line) => line.startsWith(HELP_LEAD) && line.includes(HELP_LEGEND),
  );
  expect(entry, 'a help entry is present in the transcript').toBeDefined();
  return entry as string;
}

// Scope DOM assertions to the one transcript wrapper whose leading strong
// node is the new `**Reading the room**` heading; the footer link lives there.
function helpBlock(page: Page): Locator {
  return page.locator('.output-log > div').filter({
    has: page.locator('p > strong', { hasText: HELP_LEAD }),
  });
}

async function bootNewGame(page: Page): Promise<void> {
  await page.goto(APP_URL ?? './');
  await page.getByRole('button', { name: 'New Game' }).click();
  await expect(page.locator('.workspace')).toBeVisible();
}

test.describe('engine issue 2 help output', () => {
  let errors: () => readonly string[] = noConsoleErrors;

  test.beforeEach(async ({ page }) => {
    errors = watchConsole(page);
    await seedStorage(page, {});
  });

  test.afterEach(() => {
    expect(errors(), 'no console errors during help flows').toEqual([]);
  });

  test('ENG2-HELP-01 — help renders the generated list of every verb, syntax and alias', async ({
    page,
  }) => {
    await bootNewGame(page);
    await submit(page, 'help');

    const lines = await transcript(page);
    expect(lines).toContain('> help');
    const help = helpEntry(lines);
    for (const promised of PROMISED) {
      expect(help, `help promises ${promised}`).toContain(promised);
    }

    // The generated string is rendered as block/list nodes, so the old count
    // of literal newlines is now a count of logical paragraphs and list items.
    const block = helpBlock(page);
    await expect(
      block,
      'one generated help block in the transcript',
    ).toHaveCount(1);
    await expect(
      block.locator('p > strong'),
      'bold grouped sections',
    ).toHaveText([...HELP_GROUPS]);
    expect(
      await block.locator('p, li').count(),
      'help still exposes at least 23 rendered logical lines',
    ).toBeGreaterThanOrEqual(23);

    await submit(page, '?');
    const aliasLines = await transcript(page);
    expect(aliasLines).toContain('> ?');
    expect(helpEntry(aliasLines), '? prints the same static list as help').toBe(
      help,
    );
  });

  test('MD-HELP-02 — help has one allow-listed Pages footer link with safe attributes', async ({
    page,
  }) => {
    await bootNewGame(page);
    await submit(page, 'help');

    const block = helpBlock(page);
    await expect(block, 'the generated help block').toHaveCount(1);
    const link = block.locator('a');
    await expect(link, 'a single footer link in the help block').toHaveCount(1);
    await expect(link).toHaveText(PAGES_LINK_TEXT);
    await expect(link).toHaveAttribute('href', PAGES_LINK);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(
      page.locator('.output-log a'),
      'no other link in the rendered transcript',
    ).toHaveCount(1);

    const help = helpEntry(await transcript(page));
    expect(help.endsWith(PAGES_LINK_TEXT), 'the link is the help footer').toBe(
      true,
    );
  });

  test('ENG2-HELP-01 — a full verb and a short alias from the list work in play', async ({
    page,
  }) => {
    await bootNewGame(page);

    await submit(page, 'look');
    const afterLook = await transcript(page);
    expect(afterLook).toContain('> look');
    expect(
      afterLook.filter((line) => line.includes(START_ROOM_TITLE)).length,
      'look re-describes the current room',
    ).toBeGreaterThan(1);

    await submit(page, 'i');
    const afterAlias = await transcript(page);
    expect(afterAlias).toContain('> i');
    expect(afterAlias).toContain('You are carrying nothing.');

    await submit(page, '?');
    expect(helpEntry(await transcript(page))).toContain('inventory  (i, inv)');
  });

  test('ENG2-HELP-01 — the help transcript stays accessible and the input stays usable', async ({
    page,
  }) => {
    await page.goto(APP_URL ?? './');
    await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled();

    await page.getByRole('button', { name: 'New Game' }).click();
    const log = page.locator('.output-log');
    await expect(log).toHaveAttribute('role', 'log');
    await expect(log).toHaveAttribute('aria-live', 'polite');

    const command = page.getByRole('textbox', { name: 'Command' });
    await command.focus();
    await page.keyboard.type('help');
    await page.keyboard.press('Enter');

    const afterHelp = await transcript(page);
    expect(afterHelp).toContain('> help');
    expect(helpEntry(afterHelp)).toContain(PROMISED[0]);
    expect(helpEntry(afterHelp).endsWith(PAGES_LINK_TEXT)).toBe(true);

    await submit(page, 'score');
    const afterScore = await transcript(page);
    expect(afterScore).toContain('> score');
    expect(afterScore).toContain('Your score is 0.');
    expect(helpEntry(afterScore)).toBe(helpEntry(afterHelp));
    await expect(command).toBeVisible();
    await expect(command).toBeEditable();
  });

  test('ENG9-ASKINFER-01 — browser help lists ask about <topic> and the NPC-inference wording', async ({
    page,
  }) => {
    await bootNewGame(page);
    await submit(page, 'help');

    const lines = await transcript(page);
    expect(lines).toContain('> help');
    const help = helpEntry(lines);
    expect(help, 'help keeps the explicit ask form').toContain(
      'ask <npc> about <topic>',
    );
    expect(help, 'help lists the inferred ask about <topic> form').toContain(
      'ask about <topic>',
    );
    expect(help.toLowerCase(), 'help explains NPC inference').toContain(
      'infer',
    );
    expect(
      help.toLowerCase(),
      'help says inference applies when exactly one NPC is present',
    ).toContain('exactly one');
  });

  test('ENG9-BAREANSWER-01 — browser help lists the bare quiz number forms 1, 2, …', async ({
    page,
  }) => {
    await bootNewGame(page);
    await submit(page, '?');

    const lines = await transcript(page);
    expect(lines).toContain('> ?');
    const help = helpEntry(lines);
    expect(help, 'help keeps the canonical answer form').toContain('answer N');
    expect(help, 'help lists the accepted bare quiz numbers').toContain(
      '1, 2, …',
    );
    expect(
      help.toLowerCase(),
      'help describes bare numbers as an accepted answer form',
    ).toContain('bare quiz numbers');
  });
});
