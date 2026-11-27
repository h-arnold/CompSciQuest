// Issue 24 autosave: an accepted core command rewrites only the live save,
// and the intervening progress survives a reload via Continue.
// Matrix: ENG24-AUTOSAVE-01.
import { expect, test } from 'playwright/test';
import { rooms } from '../src/content/authored/rooms';
import {
  expectWorkspace,
  makeQuarantine,
  QUARANTINE_KEY,
  readStorage,
  SAVE_KEY,
  scorePanel,
  seedStorage,
  START_POSITION,
  startNewGame,
  submit,
  transcript,
  watchConsole,
} from './helpers';

interface LiveEnvelope {
  readonly version: number;
  readonly savedAt: string;
  readonly state: {
    readonly turn: number;
    readonly player: { readonly position: { readonly roomId: string } };
  };
}

const noConsoleErrors: () => readonly string[] = () => [];

async function liveEnvelope(page: import('playwright/test').Page) {
  const text = await readStorage(page, SAVE_KEY);
  expect(text, 'live save exists').not.toBeNull();
  return {
    text: text as string,
    dto: JSON.parse(text as string) as LiveEnvelope,
  };
}

test.describe('autosave on accepted commands', () => {
  let errors: () => readonly string[] = noConsoleErrors;

  test.beforeEach(async ({ page }) => {
    errors = watchConsole(page);
    await seedStorage(page, {});
  });

  test.afterEach(() => {
    expect(errors(), 'no console errors').toEqual([]);
  });

  test('ENG24-AUTOSAVE-01 — the first command writes the post-command save and leaves quarantine intact', async ({
    page,
  }) => {
    const quarantine = makeQuarantine('{ not json');
    await seedStorage(page, { quarantine });
    await page.goto('./');
    await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled();
    await page.getByRole('button', { name: 'New Game' }).click();
    await expectWorkspace(page);
    // Fresh start persists immediately (ENG24-FRESHSTART-01): the live save
    // exists before the first command, holding turn 0 at the start position.
    const fresh = await liveEnvelope(page);
    expect(fresh.dto.version).toBe(1);
    expect(fresh.dto.state.turn).toBe(0);
    expect(fresh.dto.state.player.position).toEqual(START_POSITION);

    await submit(page, 'look');

    const { dto } = await liveEnvelope(page);
    expect(dto.version).toBe(1);
    expect(dto.savedAt).toMatch(/^\d{4}-\d{2}-\d{2}T.*Z$/);
    expect(dto.state.turn).toBe(1);
    expect(dto.state.player.position).toEqual(START_POSITION);
    expect(await readStorage(page, QUARANTINE_KEY)).toBe(quarantine);
    expect(JSON.parse(quarantine).raw).toBe('{ not json');

    // A meta alias is not a core command: it adds no turn and no extra autosave.
    await submit(page, 'save');
    const afterMeta = await liveEnvelope(page);
    expect(afterMeta.dto.state.turn).toBe(1);
    expect(await transcript(page)).toContain('Game saved.');
  });

  test('ENG24-AUTOSAVE-01 — progress after an explicit Save survives reload and Continue', async ({
    page,
  }) => {
    await startNewGame(page);
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    const manual = await liveEnvelope(page);
    expect(manual.dto.state.turn).toBe(0);
    expect(manual.dto.state.player.position).toEqual(START_POSITION);

    await submit(page, 'east');
    const progressed = await liveEnvelope(page);
    expect(progressed.dto.state.turn).toBe(1);
    expect(progressed.dto.state.player.position.roomId).not.toBe(
      START_POSITION.roomId,
    );
    expect(await readStorage(page, QUARANTINE_KEY)).toBeNull();

    // The room title comes from the generated authored bundle, not a fixture.
    const movedRoom = rooms.find(
      (room) => room.id === progressed.dto.state.player.position.roomId,
    );
    expect(movedRoom).toBeDefined();

    await page.reload();
    await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expectWorkspace(page);
    await expect(scorePanel(page)).toContainText(movedRoom?.title ?? '');
    expect(await transcript(page)).toContain(movedRoom?.title ?? '');
    expect(await readStorage(page, SAVE_KEY)).toBe(progressed.text);
    expect(await readStorage(page, QUARANTINE_KEY)).toBeNull();
  });
});
