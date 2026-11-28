// Browser coverage for the accepted round-2 ward fixes (WR2-B1, WR2-B2,
// WR2-E1) and the round-2 card copy. Every command is driven through the real
// Command box; no event seam is injected and no content ID or wording is
// invented. Authority: docs/content/topics/assistance-ward.md (§6, §9.1, §10),
// docs/content/assistance-ward/{rooms,npcs}.yaml and
// docs/content/entry-interface/rooms.yaml.
import { expect, test, type Page } from 'playwright/test';
import {
  SAVE_KEY,
  readStorage,
  seedStorage,
  startFromLiveSave,
  startNewGame,
  submit,
  transcript,
  waitForLine,
  watchConsole,
} from './helpers';

const REFUSAL =
  'The practice cabinet stays in place; turn its lock with the practice key instead.';
const MISSING_KEY =
  'You need the practice key in hand before it will turn in the practice cabinet.';
const SCENERY =
  'The register lies open, a mark beside your name. The AI reads it in the flat voice of a machine that has read it a thousand times: attention not satisfied.';
const DIAL_BLOCKED =
  "The dial does not move. Lit sockets show records already entered; dark ones still need attention. OBSERVE needs Nia's observation card, READ needs Mateo's instruction card, REASON needs Priya's reason, OPERATE needs Kofi's practice cycle, and ORIENTATION PASS needs the practice quiz. Fill any remaining sockets, then try again.";
const SAVING_REPLY =
  "'Save and load use the browser's own storage. Download creates a portable save file; import restores one. Restart replaces the current game,' the AI recites. 'No ward progress depends on using a destructive control or opening a file picker.'";
const UNLOCK_FLAG = 'container-unlocked:item-assistance-practice-cabinet';

const DEMONSTRATION_ROUTE: readonly (readonly [string, string])[] = [
  ['east', 'The Network Hub'],
  ['south', 'Intake Bay'],
  ['east', 'Demonstration Ward'],
];

async function walkTo(
  page: Page,
  steps: readonly (readonly [string, string])[],
) {
  for (const [command, title] of steps) {
    await submit(page, command);
    await waitForLine(page, title);
  }
}

async function toDemonstration(page: Page): Promise<void> {
  await walkTo(page, DEMONSTRATION_ROUTE);
}

async function toRecords(page: Page): Promise<void> {
  await walkTo(page, [...DEMONSTRATION_ROUTE, ['north', 'Records Office']]);
}

async function takePracticeKey(page: Page): Promise<void> {
  await submit(page, 'take practice key');
  await waitForLine(page, 'Taken.');
}

interface SaveShape {
  readonly state: {
    readonly flags: Record<string, boolean>;
    readonly player: {
      readonly inventory: readonly string[];
      readonly lives: number;
    };
    readonly rooms: Record<string, { inventory: readonly string[] }>;
    readonly progress: { readonly earnedScore: number }[];
  };
}

async function persisted(page: Page): Promise<SaveShape> {
  await submit(page, 'save');
  await expect.poll(() => readStorage(page, SAVE_KEY)).not.toBeNull();
  const raw = await readStorage(page, SAVE_KEY);
  if (raw === null) throw new Error('Save command did not write storage');
  return JSON.parse(raw) as SaveShape;
}

function stableState(save: SaveShape) {
  return {
    flags: save.state.flags,
    inventory: save.state.player.inventory,
    lives: save.state.player.lives,
    rooms: save.state.rooms,
    score: save.state.progress[0]?.earnedScore,
  };
}

test.beforeEach(async ({ page }) => {
  await seedStorage(page);
});

test('WR2-B1 — wrong-order unlock is one in-world line and changes no state', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await startFromLiveSave(page, {});
  await toDemonstration(page);
  await takePracticeKey(page);

  const before = stableState(await persisted(page));
  await submit(page, 'unlock practice cabinet with practice key');
  const refusalLines = await transcript(page);
  expect(refusalLines.slice(-2)).toEqual([
    '> unlock practice cabinet with practice key',
    REFUSAL,
  ]);
  expect(stableState(await persisted(page))).toEqual(before);
  expect(errors()).toEqual([]);
});

for (const [index, command] of [
  'unlock practice key with practice cabinet',
  'unlock practice key practice cabinet',
].entries()) {
  test(`WR2-B2 — authorised item-first form ${index + 1} unlocks the cabinet`, async ({
    page,
  }) => {
    const errors = watchConsole(page);
    await startFromLiveSave(page, {});
    await toDemonstration(page);
    await takePracticeKey(page);

    await submit(page, command);
    const unlockLines = await transcript(page);
    expect(unlockLines.slice(-2)).toEqual([`> ${command}`, 'You unlock it.']);
    const save = await persisted(page);
    expect(save.state.flags[UNLOCK_FLAG]).toBe(true);
    expect(errors()).toEqual([]);
  });
}

test('WR2-B1 — a genuinely missing key keeps its existing message', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await startFromLiveSave(page, {});
  await toDemonstration(page);

  await submit(page, 'unlock practice key with practice cabinet');
  const missingLines = await transcript(page);
  expect(missingLines.slice(-2)).toEqual([
    '> unlock practice key with practice cabinet',
    MISSING_KEY,
  ]);
  expect(errors()).toEqual([]);
});

test('WR2-E1 — all four arrival phrasings return the accepted scenery prose', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await startNewGame(page);

  for (const command of [
    'examine register',
    'examine attendance record',
    'look at the record',
    'examine the mark',
  ]) {
    await submit(page, command);
    await waitForLine(page, `> ${command}`);
    const sceneryLines = await transcript(page);
    expect(sceneryLines.slice(-2)).toEqual([`> ${command}`, SCENERY]);
  }
  const allLines = await transcript(page);
  expect(
    allLines.filter((line) => line.includes("I don't understand that.")),
  ).toEqual([]);
  expect(errors()).toEqual([]);
});

test('round-2 card — blocked dial copy names lit and dark sockets', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await startFromLiveSave(page, {
    'nia-observation-recovered': true,
    'mateo-reading-recovered': true,
    'priya-reasoning-recovered': true,
    'kofi-operation-recovered': true,
  });
  await toRecords(page);

  await submit(page, 'use dial');
  const dialLines = await transcript(page);
  expect(dialLines.slice(-2)).toEqual(['> use dial', DIAL_BLOCKED]);
  expect(errors()).toEqual([]);
});

test('round-2 card — saving is its own Records AI keyword', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await startFromLiveSave(page, {});
  await toRecords(page);

  await submit(page, 'ask ai about saving');
  expect(await transcript(page)).toContain(SAVING_REPLY);
  expect(errors()).toEqual([]);
});
