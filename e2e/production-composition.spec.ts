// UI-BOOT-18 — browser verification of the production composition root.
// These tests drive the shipped app only: no `check`, `dispatch`, `react`,
// `score` or `session` seam is injected, and every command is typed into the
// real Terminal. The crafted save below travels through the ordinary Import
// button; it is a fixture for state, never a replacement for phase 4.
import { expect, test } from 'playwright/test';
import { areas } from '../src/content/authored/areas';
import { hazards } from '../src/content/authored/hazards';
import { items } from '../src/content/authored/items';
import {
  makeState,
  SAVED_AT,
  scorePanel,
  seedStorage,
  START_ROOM_TITLE,
  startNewGame,
  submit,
  transcript,
  watchConsole,
} from './helpers';

const noConsoleErrors: () => readonly string[] = () => [];

// Targets the real authored hazard: repeatable (no `once`/`cooldownTurns`) and
// driven by a USE command, so the first reaction pass emits a non-message
// `hazard-triggered` event and the second pass is guaranteed to run.
const repeatableHazard = hazards.find(
  (hazard) =>
    hazard.trigger.kind === 'on-item-used' &&
    hazard.once !== true &&
    hazard.cooldownTurns === undefined,
);
if (
  repeatableHazard === undefined ||
  repeatableHazard.trigger.kind !== 'on-item-used'
) {
  throw new Error(
    'E2E-BOOT-18 needs a repeatable on-item-used authored hazard',
  );
}
const hazardItemId: string = repeatableHazard.trigger.itemId;

function occurrences(lines: readonly string[], needle: string): number {
  return lines.filter((line) => line === needle).length;
}

test.describe('production composition through the real browser', () => {
  let errors: () => readonly string[] = noConsoleErrors;

  test.beforeEach(async ({ page }) => {
    errors = watchConsole(page);
    await seedStorage(page, {});
  });

  test.afterEach(() => {
    expect(errors(), 'no console errors').toEqual([]);
  });

  test('E2E-BOOT-18 — a typed command resolves, checks, dispatches and runs phase 4', async ({
    page,
  }) => {
    await startNewGame(page);

    const before = await transcript(page);
    expect(before.length).toBeGreaterThan(0);
    expect(before.join('\n')).toContain('Exits:');

    await submit(page, 'look');

    const lines = await transcript(page);
    const echo = '> look';
    expect(occurrences(lines, echo)).toBe(1);
    const echoAt = lines.indexOf(echo);
    expect(
      lines
        .slice(echoAt + 1)
        .join('\n')
        .trim().length,
    ).toBeGreaterThan(0);
    // The room description is produced by the verb handler, not by the echo.
    expect(lines.slice(echoAt + 1).join('\n')).toContain(START_ROOM_TITLE);
    await expect(scorePanel(page)).toBeVisible();
    await expect(scorePanel(page)).toContainText('Score:');
  });

  test('E2E-BOOT-18 — consecutive ordinary commands yield one coherent batch each', async ({
    page,
  }) => {
    await startNewGame(page);

    const initialLines = await transcript(page);
    let previousCount = initialLines.length;
    for (const command of ['look', 'inventory', 'score', 'help']) {
      await submit(page, command);
      const lines = await transcript(page);
      const echo = `> ${command}`;
      expect(occurrences(lines, echo)).toBe(1);
      const echoAt = lines.indexOf(echo);
      expect(
        lines
          .slice(echoAt + 1)
          .join('\n')
          .trim().length,
      ).toBeGreaterThan(0);
      // Nothing from an earlier batch is replayed on a later turn.
      expect(lines.length).toBeGreaterThan(previousCount);
      previousCount = lines.length;
    }
    await expect(scorePanel(page)).toContainText('Lives:');
  });

  test('E2E-BOOT-18 — a repeatable authored hazard fires once across both reaction passes', async ({
    page,
  }) => {
    const item = items.find((entry) => entry.id === hazardItemId);
    if (item === undefined) {
      throw new Error(`Authored item ${hazardItemId} is missing`);
    }
    const roomId = item.initialRoom;
    const area = areas.find((entry) => entry.roomIds.includes(roomId));
    if (area === undefined) {
      throw new Error(`Authored area for ${roomId} is missing`);
    }
    const position = {
      worldId: area.worldId,
      areaId: area.id,
      roomId,
    };

    const state = makeState({ position });
    (state['rooms'] as Record<string, { inventory: string[] }>)[roomId] = {
      inventory: [item.id],
    };
    const save = JSON.stringify({ version: 1, savedAt: SAVED_AT, state });

    await startNewGame(page);
    const chooser = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Import', exact: true }).click();
    const fileChooser = await chooser;
    await fileChooser.setFiles({
      name: 'repeatable-hazard-save.json',
      mimeType: 'application/json',
      buffer: Buffer.from(save),
    });
    await expect(page.locator('.save-status')).toHaveText('Game imported.');

    const alias = item.aliases[0] ?? item.name;
    const noun = alias.trim().toLowerCase().split(/\s+/u).at(-1) ?? alias;
    await submit(page, `use ${noun}`);

    const lines = await transcript(page);
    expect(occurrences(lines, `> use ${noun}`)).toBe(1);
    expect(
      occurrences(
        lines,
        `Hazard ${repeatableHazard.id}: ${repeatableHazard.id}.`,
      ),
      'one hazard-triggered event even though the first pass emits a non-message event',
    ).toBe(1);
    const announcement = repeatableHazard.effects.find(
      (effect) => effect.kind === 'message',
    );
    if (announcement !== undefined && announcement.kind === 'message') {
      expect(occurrences(lines, announcement.text)).toBe(1);
    }
    expect(
      lines.filter((line) => /^Lives: \d+\.$/u.test(line)).length,
      'one lives-changed event for the hazard',
    ).toBe(1);
    expect(lines.join('\n').length).toBeGreaterThan(0);
  });
});
