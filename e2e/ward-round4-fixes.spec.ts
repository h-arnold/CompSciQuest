// Browser coverage for ward round 4 (WR4-B1, WR4-B2). Every command is driven
// through the real Command box; no event seam is injected and no content ID or
// wording is invented. Authority: branch-matrix.md WR4-B1/WR4-B2,
// application-and-ui.md §5.1/§5.2 and the generated authored bundles.
// WR4-C1 (optional out-of-room GIVE feedback) is deliberately not covered: it
// is not implemented and is recorded as a reported limitation in the QA report.
import { expect, test, type Page } from 'playwright/test';
import {
  SAVE_KEY,
  readStorage,
  seedStorage,
  startNewGame,
  submit,
  transcript,
  waitForLine,
  watchConsole,
} from './helpers';

// Real IDs from the generated authored content bundles.
const BLOCK = 'item-assistance-practice-block';
const CABINET = 'item-assistance-practice-cabinet';
const INSTRUCTION_CARD = 'item-assistance-instruction-card';
const DEMONSTRATION = 'room-assistance-demonstration';

const UNLOCK_FLAG = `container-unlocked:${CABINET}`;
const OPEN_FLAG = `container-open:${CABINET}`;

const PLACEMENT = 'You put the practice block in the practice cabinet.';
const RETRIEVAL = 'You take the practice block from the practice cabinet.';
const UNKNOWN = "I don't understand that.";

interface SaveShape {
  readonly state: {
    readonly flags: Record<string, boolean>;
    readonly player: {
      readonly inventory: readonly string[];
      readonly lives: number;
    };
    readonly rooms: Record<string, { inventory: readonly string[] }>;
    readonly npcs: Record<string, { inventory: readonly string[] }>;
    readonly progress: readonly {
      readonly earnedScore: number;
      readonly completedTopics: readonly string[];
    }[];
  };
}

const DEMONSTRATION_ROUTE: readonly (readonly [string, string])[] = [
  ['east', 'The Network Hub'],
  ['south', 'Intake Bay'],
  ['east', 'Demonstration Ward'],
];

async function toDemonstration(page: Page): Promise<void> {
  for (const [command, title] of DEMONSTRATION_ROUTE) {
    await submit(page, command);
    await waitForLine(page, title);
  }
}

async function persisted(page: Page): Promise<SaveShape> {
  await submit(page, 'save');
  await expect.poll(() => readStorage(page, SAVE_KEY)).not.toBeNull();
  const raw = await readStorage(page, SAVE_KEY);
  if (raw === null) throw new Error('Save command did not write storage');
  return JSON.parse(raw) as SaveShape;
}

// Exactly one owner must hold the placed block under the one-owner invariant.
function blockOwners(save: SaveShape): readonly string[] {
  const owners: string[] = [];
  if (save.state.player.inventory.includes(BLOCK)) owners.push('player');
  for (const [id, room] of Object.entries(save.state.rooms)) {
    if (room.inventory?.includes(BLOCK)) owners.push(id);
  }
  for (const [id, npc] of Object.entries(save.state.npcs)) {
    if (npc.inventory?.includes(BLOCK)) owners.push(id);
  }
  return owners;
}

function stableState(save: SaveShape) {
  return {
    flags: save.state.flags,
    lives: save.state.player.lives,
    score: save.state.progress.map((progress) => progress.earnedScore),
    completedTopics: save.state.progress.map(
      (progress) => progress.completedTopics,
    ),
  };
}

// The accepted WR4-B1 route: clean New Game, walk to Demonstration, carry the
// block and key, turn the lock and open the door before placing the block.
async function toPlaced(page: Page): Promise<void> {
  await startNewGame(page);
  await toDemonstration(page);
  for (const command of ['take practice block', 'take practice key']) {
    await submit(page, command);
    await waitForLine(page, 'Taken.');
  }
  await submit(page, 'unlock practice key practice cabinet');
  await waitForLine(page, 'You unlock it.');
  await submit(page, 'open practice cabinet');
  await waitForLine(page, 'You open it.');
}

async function lastLines(page: Page): Promise<readonly string[]> {
  const lines = await transcript(page);
  return lines.slice(-2);
}

test.beforeEach(async ({ page }) => {
  await seedStorage(page);
});

test('WR4-B1 — place names the cabinet, moves the block there and changes no score, flag or life', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await toPlaced(page);

  const before = stableState(await persisted(page));
  expect(before.flags).toEqual({
    [UNLOCK_FLAG]: true,
    [OPEN_FLAG]: true,
  });

  await submit(page, 'place practice block in practice cabinet');
  expect(await lastLines(page)).toEqual([
    '> place practice block in practice cabinet',
    PLACEMENT,
  ]);

  const after = await persisted(page);
  expect(blockOwners(after)).toEqual([CABINET]);
  expect(after.state.rooms[CABINET]?.inventory).toEqual([BLOCK]);
  expect(stableState(after)).toEqual(before);
  expect(errors()).toEqual([]);
});

test('WR4-B1 — examine locates the block in the cabinet', async ({ page }) => {
  const errors = watchConsole(page);
  await toPlaced(page);
  await submit(page, 'place practice block in practice cabinet');
  await waitForLine(page, PLACEMENT);

  await submit(page, 'examine practice block');
  const lines = await transcript(page);
  expect(lines.slice(-2)).toEqual([
    '> examine practice block',
    expect.stringContaining('It is in the practice cabinet.'),
  ]);
  expect(lines.at(-1)).not.toContain(UNKNOWN);
  expect(errors()).toEqual([]);
});

for (const [index, command] of [
  'take practice block',
  'get practice block',
  'take block',
].entries()) {
  test(`WR4-B1 — retrieval form ${index + 1} (${command}) returns the block to the player`, async ({
    page,
  }) => {
    const errors = watchConsole(page);
    await toPlaced(page);
    await submit(page, 'place practice block in practice cabinet');
    await waitForLine(page, PLACEMENT);

    await submit(page, command);
    expect(await lastLines(page)).toEqual([`> ${command}`, RETRIEVAL]);
    const save = await persisted(page);
    expect(blockOwners(save)).toEqual(['player']);
    expect(save.state.player.inventory).toContain(BLOCK);
    expect(save.state.flags).toEqual({
      [UNLOCK_FLAG]: true,
      [OPEN_FLAG]: true,
    });
    expect(save.state.player.lives).toBe(3);
    expect(save.state.progress.map((entry) => entry.earnedScore)).toEqual([
      0, 0, 0,
    ]);
    expect(errors()).toEqual([]);
  });
}

test('WR4-B1 — look no longer claims the block sits on top of the cabinet', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await startNewGame(page);
  await toDemonstration(page);

  await submit(page, 'look');
  // §6.1: look emits the four-part room-entry shape, so the location title is
  // its own level-two heading entry rather than a prefix to the description.
  // Scope to the entry produced by this look, not the earlier arrival heading.
  const lookOutput = page.locator('.output-log > div').last();
  await expect(
    lookOutput.getByRole('heading', { name: 'Demonstration Ward', level: 2 }),
  ).toBeVisible();
  const lines = await transcript(page);
  const description = lines.at(-1) ?? '';
  expect(description).toContain('a practice block is part of the bench set');
  expect(description.toLowerCase()).not.toContain('on top');
  expect(errors()).toEqual([]);
});

test('WR4-B2 — put form, open/close, bell and plain take/drop keep their accepted feedback', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await toPlaced(page);

  await submit(page, 'put practice block in practice cabinet');
  expect(await lastLines(page)).toEqual([
    '> put practice block in practice cabinet',
    PLACEMENT,
  ]);

  await submit(page, 'take practice block');
  expect(await lastLines(page)).toEqual(['> take practice block', RETRIEVAL]);
  await submit(page, 'drop practice block');
  expect(await lastLines(page)).toEqual(['> drop practice block', 'Dropped.']);
  expect(blockOwners(await persisted(page))).toEqual([DEMONSTRATION]);
  await submit(page, 'take practice block');
  expect(await lastLines(page)).toEqual(['> take practice block', 'Taken.']);

  await submit(page, 'use practice bell');
  const lines = await transcript(page);
  const bell = lines.at(-1) ?? '';
  expect(bell).toContain('HARMLESS PRACTICE');
  expect(bell).not.toContain(UNKNOWN);

  await submit(page, 'close practice cabinet');
  expect(await lastLines(page)).toEqual([
    '> close practice cabinet',
    'You close it.',
  ]);
  await submit(page, 'open practice cabinet');
  expect(await lastLines(page)).toEqual([
    '> open practice cabinet',
    'You open it.',
  ]);

  const beforeScenery = await persisted(page);
  await submit(page, 'put practice block on instruction card');
  expect(await lastLines(page)).toEqual([
    '> put practice block on instruction card',
    'You put it down.',
  ]);
  const afterScenery = await persisted(page);
  expect(blockOwners(afterScenery)).toEqual([INSTRUCTION_CARD]);
  expect(stableState(afterScenery)).toEqual(stableState(beforeScenery));
  expect(errors()).toEqual([]);
});
