// Browser contract for ENG5-SCOREGAIN-01 (issue #5): the transcript shows a
// score line only on a real gain. Assertions are shape-based: the settled
// authority fixes no literal friendly wording (GAP-ENG5-01).
import { expect, test } from 'playwright/test';
import { rooms } from '../src/content/authored/rooms';
import {
  scorePanel,
  seedStorage,
  startNewGame,
  submit,
  transcript,
  watchConsole,
} from './helpers';

// Titles come from the generated authored room catalogue and are observed in
// the rendered transcript. No fabricated content or internal room ID is used.
const ROOM_TITLES = new Set(rooms.map((room) => room.title));
const SWITCH_FLOOR_TITLE = 'The Switch Floor';

function gainLines(lines: readonly string[]): readonly string[] {
  return lines.filter((line) =>
    /\b(?:earned|gained|awarded|points?)\b/i.test(line),
  );
}

function currentRoom(lines: readonly string[]): string | undefined {
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index];
    if (line !== undefined && ROOM_TITLES.has(line)) return line;
  }
  return undefined;
}

const noConsoleErrors: () => readonly string[] = () => [];

test.describe('ENG5-SCOREGAIN-01 — score lines in the transcript', () => {
  let errors: () => readonly string[] = noConsoleErrors;

  test.beforeEach(async ({ page }) => {
    errors = watchConsole(page);
    await seedStorage(page, {});
  });

  test.afterEach(() => {
    expect(errors(), 'no console errors').toEqual([]);
  });

  test('ordinary commands with no gain add no score line', async ({ page }) => {
    await startNewGame(page);

    const log = page.locator('[role="log"]');
    await expect(log).toHaveAttribute('aria-live', 'polite');
    await expect(page.getByRole('textbox', { name: 'Command' })).toBeVisible();

    const initial = await transcript(page);
    expect(gainLines(initial)).toEqual([]);

    for (const command of ['look', 'inventory', 'look']) {
      await submit(page, command);
    }

    const lines = await transcript(page);
    expect(lines).toContain('> look');
    expect(lines).toContain('> inventory');
    expect(lines.length).toBeGreaterThan(initial.length);
    expect(gainLines(lines)).toEqual([]);
    await expect(scorePanel(page)).toContainText('Score: 0');
  });

  test('moves between rooms with no gain add no score line', async ({
    page,
  }) => {
    await startNewGame(page);

    await submit(page, 'east');
    await submit(page, 'north');

    const lines = await transcript(page);
    expect(lines).toContain('> east');
    expect(lines).toContain('> north');
    expect(gainLines(lines)).toEqual([]);
    await expect(scorePanel(page)).toContainText('Score: 0');
  });

  test('a real gain adds exactly one friendly line with no internal ID', async ({
    page,
  }) => {
    await startNewGame(page);

    // Ordinary commands reach the switch floor. The first entry may trigger
    // the scripted heat hazard, which returns the player to the Binary Hall;
    // in that case the safe re-entry is used. No state is seeded.
    await submit(page, 'east');
    await submit(page, 'east');
    if (currentRoom(await transcript(page)) !== SWITCH_FLOOR_TITLE) {
      await submit(page, 'down');
    }
    await submit(page, 'take switch gauge');

    const beforeGain = await transcript(page);
    expect(currentRoom(beforeGain)).toBe(SWITCH_FLOOR_TITLE);
    expect(beforeGain).toContain('Taken.');
    expect(gainLines(beforeGain)).toEqual([]);

    await submit(page, 'use switch gauge on belt');

    const gains = gainLines(await transcript(page));
    expect(gains).toHaveLength(1);
    const line = gains[0] ?? '';
    expect(line).toMatch(/\d/);
    expect(line).not.toMatch(
      /room|puzzle|quiz|score-changed|reason|flag:|item-|:/i,
    );
    await expect(scorePanel(page)).toContainText('Score: 1');

    // Further no-gain commands do not repeat the line.
    await submit(page, 'look');
    expect(gainLines(await transcript(page))).toHaveLength(1);
  });
});
