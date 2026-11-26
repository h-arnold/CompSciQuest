// Engine issue 2 / ENG2-HELP-01 (Batch E Group A). The player-facing help reply
// is generated from the canonical command table, so these checks assert the
// promised syntax and aliases through the browser rather than pinning content
// IDs. The dev server for this slice runs on 5202; 5173 belongs to another
// worktree and the committed Playwright config is unchanged.
import { expect, test, type Page } from 'playwright/test';
import {
  seedStorage,
  START_ROOM_TITLE,
  submit,
  transcript,
  watchConsole,
} from './helpers';

const APP_URL =
  process.env['CSQ_E2E_URL'] ?? 'http://localhost:5202/CompSciQuest/';

const HELP_LEAD = 'Available commands:';

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
  'Directions: north (n), south (s), east (e), west (w), up (u), down (d), in (in), out (out).',
] as const;

function helpEntry(lines: readonly string[]): string {
  const entry = lines.find((line) => line.startsWith(HELP_LEAD));
  expect(entry, 'a help entry is present in the transcript').toBeDefined();
  return entry as string;
}

async function bootNewGame(page: Page): Promise<void> {
  await page.goto(APP_URL);
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
    expect(help.split('\n').length).toBeGreaterThanOrEqual(23);

    await submit(page, '?');
    const aliasLines = await transcript(page);
    expect(aliasLines).toContain('> ?');
    expect(helpEntry(aliasLines), '? prints the same static list as help').toBe(
      help,
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
    await page.goto(APP_URL);
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
    expect(helpEntry(afterHelp)).toContain('Available commands:');

    await submit(page, 'score');
    const afterScore = await transcript(page);
    expect(afterScore).toContain('> score');
    expect(afterScore).toContain('Your score is 0.');
    expect(helpEntry(afterScore)).toBe(helpEntry(afterHelp));
    await expect(command).toBeVisible();
    await expect(command).toBeEditable();
  });
});
