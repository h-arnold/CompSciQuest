// W7 browser evidence for the accepted V4 trace in docs/content/walkthrough.md.
// Non-quiz expectations are never weakened to match broken output.
import { expect, test, type Page } from 'playwright/test';
import { areas } from '../src/content/authored/areas';
import { rooms } from '../src/content/authored/rooms';
import {
  expectHazardOutcome,
  hazardAnnouncement,
} from './w7-hazard-assertions';
import type { Position } from '../src/types/domain';
import {
  SAVE_KEY,
  readStorage,
  seedStorage,
  startNewGame,
  submit,
  transcript,
  watchConsole,
} from './helpers';

test.beforeEach(async ({ page }) => {
  await seedStorage(page);
});

// Later-area traces begin after the accepted Assistance Ward orientation
// (docs/content/topics/assistance-ward.md §8/§10): hub east/north are gated on
// `tutorial-complete`, produced by puzzle-calibrate-assistance. Take a real New
// Game save so every authored room/item reference is present, add only that
// flag, then continue from it. Every trace step, expectation and assertion
// below stays unchanged.
async function continueFromCompletedWard(page: Page): Promise<void> {
  await startNewGame(page);
  await submit(page, 'save');
  await expect.poll(() => readStorage(page, SAVE_KEY)).not.toBeNull();
  const raw = await readStorage(page, SAVE_KEY);
  if (raw === null) throw new Error('New Game did not write a save');
  const envelope = JSON.parse(raw) as {
    readonly version: number;
    readonly savedAt: string;
    readonly state: Record<string, unknown>;
  };
  await seedStorage(page, {
    save: JSON.stringify({
      ...envelope,
      state: {
        ...envelope.state,
        flags: {
          'tutorial-complete': true,
          // The foreman's lift beat in this later-area trace is gated on the
          // switchyard quiz pass (topic-foreman-lift), so seed that prerequisite
          // too; the quiz itself stays out of scope for these non-quiz traces.
          'quiz-passed:quiz-switchyard': true,
        },
      },
    }),
  });
  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('.workspace')).toBeVisible();
}

interface PlayerView {
  readonly position: Position;
  readonly inventory: readonly string[];
  readonly lives: number;
}

type Owner = { readonly inventory: readonly string[] };

// prettier-ignore
interface SavedState {
  readonly player: PlayerView;
  readonly status: string;
  readonly flags: Readonly<Record<string, boolean>>;
  readonly rooms: Readonly<Record<string, Owner>>;
  readonly npcs: Readonly<Record<string, Owner>>;
  readonly puzzles: Readonly<Record<string, { readonly phase: string }>>;
  readonly progress: readonly {
    readonly worldId: string; readonly areaId: string;
    readonly visitedRooms: readonly string[]; readonly completedTopics: readonly string[];
    readonly earnedScore: number; readonly maxScore: number;
  }[];
}

interface TraceStep {
  readonly raw: string;
  readonly entry?: readonly [title: string, description: string, exits: string];
  readonly flags?: readonly string[];
  readonly puzzles?: readonly string[];
  readonly transfer?: string;
  readonly owner?: readonly [itemId: string, owners: readonly string[]];
  readonly singleOwner?: string;
  readonly rejected?: readonly string[];
  readonly item?: string;
  readonly position?: readonly [roomId: string, lives: number];
  readonly hazard?: string;
  readonly noHazard?: string;
  readonly blocked?: string;
  readonly topic?: string;
}

// prettier-ignore
const GATE_FLAGS = ['switches-set', 'hex-read', 'characters-matched', 'picture-built', 'sound-sampled', 'stacks-sorted'] as const;
// prettier-ignore
const NON_QUIZ_PUZZLES = ['puzzle-set-the-switches', 'puzzle-sort-the-data-types', 'puzzle-read-nibbles', 'puzzle-add-with-carries', 'puzzle-shift-the-row', 'puzzle-match-characters', 'puzzle-build-mosaic', 'puzzle-weigh-the-pixels', 'puzzle-tune-sampling', 'puzzle-stack-the-bytes', 'puzzle-pack-the-archive', 'puzzle-choose-the-compression', 'puzzle-check-the-overflow-register', 'puzzle-scale-the-badge', 'puzzle-count-the-bit-rate', 'puzzle-label-the-capacity'] as const;

async function savedGame(page: Page): Promise<SavedState> {
  await submit(page, 'save');
  await expect.poll(() => readStorage(page, SAVE_KEY)).not.toBeNull();
  const raw = await readStorage(page, SAVE_KEY);
  if (raw === null) throw new Error('Save was not written');
  return (JSON.parse(raw) as { state: SavedState }).state;
}

async function savedPlayer(page: Page): Promise<PlayerView> {
  const state = await savedGame(page);
  return state.player;
}

async function command(page: Page, raw: string): Promise<string[]> {
  const before = await page.locator('.output-log > div').count();
  await submit(page, raw);
  await page.waitForFunction(
    ({ commandText, lineCount }) => {
      const lines = [...document.querySelectorAll('.output-log > div')];
      return lines
        .slice(lineCount)
        .some((line) => line.textContent === `> ${commandText}`);
    },
    { commandText: raw, lineCount: before },
  );
  const lines = await transcript(page);
  return lines.slice(before);
}

function joined(lines: readonly string[]): string {
  return lines.join('\n');
}

// prettier-ignore
function expectEntry(lines: readonly string[], title: string, description: string, exits: string): void {
  const text = joined(lines);
  expect(text).toContain(title);
  expect(text).toContain(description);
  expect(text).toContain(`Exits: ${exits}`);
}

// prettier-ignore
async function enter(page: Page, direction: string, title: string, description: string, exits: string): Promise<string[]> {
  const lines = await command(page, direction);
  expectEntry(lines, title, description, exits);
  return lines;
}

// prettier-ignore
async function expectFlags(page: Page, flags: readonly string[]): Promise<void> {
  if (flags.length === 0) return;
  const state = await savedGame(page);
  for (const flag of flags) expect(state.flags[flag]).toBe(true);
}

function expectPuzzle(lines: readonly string[], puzzleId: string): void {
  // Issue 22 supersedes the old `Puzzle <id> solved` transcript line: the
  // solve is confirmed by the flags already checked in runStep, and the
  // friendly topic-completed line is the only completion wording now rendered.
  expect(
    lines.some((line) => line.startsWith(`Puzzle ${puzzleId} solved`)),
  ).toBe(false);
  expect(lines.some((line) => line.startsWith('Topic completed: '))).toBe(true);
}

// prettier-ignore
async function expectPosition(page: Page, roomId: string, lives?: number): Promise<void> {
  const player = await savedPlayer(page);
  expect(player.position.roomId).toBe(roomId);
  if (lives !== undefined) expect(player.lives).toBe(lives);
}

function ownersOf(state: SavedState, itemId: string): string[] {
  return [
    ...(state.player.inventory.includes(itemId) ? ['player'] : []),
    ...Object.entries(state.rooms)
      .filter(([, room]) => room.inventory.includes(itemId))
      .map(([roomId]) => roomId),
    ...Object.entries(state.npcs)
      .filter(([, npc]) => npc.inventory.includes(itemId))
      .map(([actorId]) => actorId),
  ];
}

// prettier-ignore
async function expectOwners(page: Page, itemId: string, expected: readonly string[]): Promise<void> {
  const state = await savedGame(page);
  expect(ownersOf(state, itemId)).toEqual(expected);
}

async function expectTransfer(page: Page, step: TraceStep): Promise<void> {
  if (step.transfer === undefined) return;
  const itemId = step.owner?.[0] ?? step.singleOwner;
  if (itemId === undefined) throw new Error(`No item ID for ${step.transfer}`);
  const owners = ownersOf(await savedGame(page), itemId);
  expect(owners).not.toContain('player');
  expect(owners).toHaveLength(1);
}

// prettier-ignore
async function runStep(page: Page, step: TraceStep): Promise<string[]> {
  const lines = await command(page, step.raw);
  if (step.entry !== undefined) expectEntry(lines, ...step.entry);
  await expectFlags(page, step.flags ?? []);
  const puzzles = step.puzzles ?? [];
  for (const puzzleId of puzzles) expectPuzzle(lines, puzzleId);
  await expectTransfer(page, step);
  if (step.owner !== undefined) await expectOwners(page, ...step.owner);
  if (step.singleOwner !== undefined) {
    const state = await savedGame(page);
    const owners = ownersOf(state, step.singleOwner);
    expect(owners).toHaveLength(1);
    expect(owners[0]).not.toBe('player');
  }
  if (step.rejected !== undefined) {
    const state = await savedGame(page);
    expect(lines.slice(1).some((line) => line.trim().length > 0)).toBe(true);
    for (const flag of step.rejected) expect(state.flags[flag]).not.toBe(true);
    expect(lines.some((line) => line.includes(' = true.'))).toBe(false);
    expect(lines.some((line) => line.includes(' moved '))).toBe(false);
    expect(lines.some((line) => line.startsWith('Puzzle '))).toBe(false);
    expect(lines.some((line) => line.startsWith('Score ('))).toBe(false);
  }
  if (step.item !== undefined) {
    const player = await savedPlayer(page);
    expect(player.inventory).toContain(step.item);
  }
  if (step.position !== undefined) await expectPosition(page, ...step.position);
  if (step.hazard !== undefined) expectHazardOutcome(lines, step);
  if (step.noHazard !== undefined) expect(lines.some((l) => l.includes(step.noHazard ?? ''))).toBe(false);
  if (step.blocked !== undefined) expect(joined(lines)).toContain(step.blocked);
  if (step.topic !== undefined) expect(lines).toContain(step.topic);
  return lines;
}

// prettier-ignore
async function expectAreaConsistency(page: Page, state: SavedState): Promise<void> {
  const areaById = new Map(areas.map((area) => [area.id, area]));
  for (const progress of state.progress) {
    const area = areaById.get(progress.areaId); if (area === undefined) throw new Error(`Unknown saved area ${progress.areaId}`);
    const visited = new Set(progress.visitedRooms);
    expect(visited.size).toBe(progress.visitedRooms.length);
    expect(visited.size).toBeLessThanOrEqual(area.roomIds.length);
    expect([...visited].every((roomId) => area.roomIds.includes(roomId))).toBe(true);
  }
  const current = state.progress.find((row) => row.areaId === state.player.position.areaId); if (current === undefined) throw new Error(`No saved progress for ${state.player.position.areaId}`);
  const currentArea = areaById.get(current.areaId); if (currentArea === undefined) throw new Error(`Unknown saved area ${current.areaId}`);
  const lines = await page.locator('.score-panel > div').allTextContents(); const shown = lines.filter((line) => areas.some((area) => line.endsWith(` — ${area.name}`)));
  expect(shown).toHaveLength(1); expect(shown[0]).toContain(currentArea.name);
  expect(lines.filter((line) => line === `Score: ${current.earnedScore} / ${current.maxScore}`)).toHaveLength(1);
  expect(lines.filter((line) => line.startsWith('Rooms visited:'))).toEqual([`Rooms visited: ${new Set(current.visitedRooms).size} / ${currentArea.roomIds.length}`]);
  expect(state.progress.filter((row) => row.areaId !== current.areaId).every((row) => shown.every((line) => !line.endsWith(` — ${areaById.get(row.areaId)?.name ?? ''}`)))).toBe(true);
  // The accepted Assistance Ward cards (docs/content/assistance-ward/rooms.yaml)
  // add three rooms to the 20-room network, so the generated bundle declares 23.
  expect(rooms).toHaveLength(23);
}

// prettier-ignore
test('W7 Beat A — clean boot reaches room-arrival with transcript and score panel', async ({ page }) => {
  const errors = watchConsole(page);
  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'New Game' })).toBeEnabled();
  await page.getByRole('button', { name: 'New Game' }).click();
  await expect(page.locator('.workspace')).toBeVisible();
  const lines = await transcript(page);
  expectEntry(lines, 'The Arrival Bay', 'attention not satisfied', 'east');
  expect(joined(lines)).toContain('An east route glows.');
  await expect(page.locator('.score-panel')).toContainText('Score: 0');
  await expect(page.locator('.score-panel')).toContainText('Lives: 3');
  const player = await savedPlayer(page);
  expect(player.position).toEqual({
    worldId: 'world-wjec-gcse-computer-science-2025-spec',
    areaId: 'area-entry-interface',
    roomId: 'room-arrival',
  });
  expect(player.inventory).toEqual([]);
  expect(player.lives).toBe(3);
  expect(errors()).toEqual([]);
});

// prettier-ignore
test('W7 verified flow — echo, output and up/down history', async ({ page }) => {
  await startNewGame(page);
  await submit(page, 'inventory');
  const lines = await transcript(page);
  expect(lines).toContain('> inventory');
  const echoAt = lines.indexOf('> inventory');
  expect(
    lines
      .slice(echoAt + 1)
      .join('\n')
      .trim().length,
  ).toBeGreaterThan(0);
  const input = page.getByRole('textbox', { name: 'Command' });
  await input.press('ArrowUp');
  await expect(input).toHaveValue('inventory');
  await input.press('ArrowDown');
  await expect(input).toHaveValue('');
});

// prettier-ignore
test('W7 Beat B — AI topics answer in room-arrival and stay room-scoped', async ({ page }) => {
  const errors = watchConsole(page);
  await startNewGame(page);
  const why = await command(page, 'ask ai about why here');
  expect(joined(why)).toContain('The classroom folded along its grid lines');
  expect(joined(why)).toContain("The pupil's attendance mark is recorded");
  await expect(page.locator('.conversation-panel')).toBeVisible();
  await expect(page.locator('.conversation-panel')).toContainText(
    'Talking with',
  );
  const failure = await command(page, 'ask ai about fail');
  expect(joined(failure)).toContain('Failure is deletion');
  expect(joined(failure)).toContain('The pupil has three lives');
  const verdict = await command(page, 'ask ai about verdict');
  expect(joined(verdict)).toContain(
    'The mark beside your name is tapped twice',
  );
  await command(page, 'east');
  await expect(page.locator('.conversation-panel')).toBeHidden();
  const whyAtHub = await command(page, 'ask ai about why here');
  expect(joined(whyAtHub)).not.toContain(
    'The classroom folded along its grid lines',
  );
  expect(joined(whyAtHub)).toContain('The pointer rests on the record');
  const failureAtHub = await command(page, 'ask ai about fail');
  expect(joined(failureAtHub)).not.toContain('Failure is deletion');
  expect(joined(failureAtHub)).toContain(
    'Another tap lands on the record. Ask about the attendance mark, what failure means, or the route out.',
  );
  const globalTopic = await command(page, 'ask ai about unit two');
  expect(joined(globalTopic)).toContain('A fresh sheet in the record');
  expect(errors()).toEqual([]);
});

// prettier-ignore
test('W7 Beat C — hub route text, scoped escape topic and interface detour', async ({ page }) => {
  const errors = watchConsole(page);
  await continueFromCompletedWard(page);
  const hub = await enter(
    page,
    'east',
    'The Network Hub',
    'The hub copies every packet to every port',
    'west, east, in',
  );
  expect(joined(hub)).toContain('A port label clings to the east socket');
  expect(joined(hub)).not.toContain('switches-set');
  await expectPosition(page, 'room-network-hub', 3);
  const escape = await command(page, 'ask ai about escape');
  expect(joined(escape)).toContain('The south route is always open. It leads into the Assistance Ward, a safe checkpoint');
  expect(joined(escape)).toContain("The east and north teaching ports wait for the ward's completion mark.");
  expect(joined(escape)).toContain('Take south. Let the ward write the mark.');
  const whyAtHub = await command(page, 'ask ai about why here');
  expect(joined(whyAtHub)).not.toContain(
    'The classroom folded along its grid lines',
  );
  expect(joined(whyAtHub)).toContain('The pointer rests on the record');
  await enter(
    page,
    'in',
    'The Interface',
    "The east arrow is dark until the Assistance Ward's calibration mark is on record and live once it is; the opening behind you still returns to the hub",
    'east, out',
  );
  await expectPosition(page, 'room-entry-interface', 3);
  await enter(
    page,
    'out',
    'The Network Hub',
    'The hub copies every packet to every port',
    'west, east, in',
  );
  await expectPosition(page, 'room-network-hub', 3);
  expect(errors()).toEqual([]);
});

// prettier-ignore
test('W7 Beat E — overheat follows room text, fires once and safe re-entry is calm', async ({ page }) => {
  const errors = watchConsole(page);
  await continueFromCompletedWard(page);
  await command(page, 'east');
  const lines = await enter(
    page,
    'east',
    'The Switch Floor',
    'Heat haze shimmers off a belt of tiny black switches',
    'west, up',
  );
  const overheatAnnouncement = hazardAnnouncement('hazard-switch-overheat');
  expect(lines.some((line) => line.startsWith('Hazard hazard-switch-overheat:'))).toBe(false);
  expect(lines.some((line) => line.startsWith('Hazard '))).toBe(false);
  expect(lines).toContain(overheatAnnouncement);
  expect(lines).toContain('Lives: 2.');
  expect(lines.indexOf('The Switch Floor')).toBeLessThan(
    lines.indexOf(overheatAnnouncement),
  );
  await expectPosition(page, 'room-binary-hall', 2);
  const reentry = await enter(
    page,
    'down',
    'The Switch Floor',
    'Heat haze shimmers off a belt of tiny black switches',
    'west, up',
  );
  expect(reentry.some((line) => line.includes('hazard-switch-overheat'))).toBe(
    false,
  );
  expect(reentry).not.toContain(overheatAnnouncement);
  await expectPosition(page, 'room-switch-floor', 2);
  expect(errors()).toEqual([]);
});

// prettier-ignore
test('W7 non-quiz trace — room text, item actions and all six Binary Hall gates', async ({ page }) => {
  const errors = watchConsole(page);
  await continueFromCompletedWard(page);
  await command(page, 'east');
  const overheat = await runStep(page, {
    raw: 'east',
    entry: [
      'The Binary Hall',
      'A painted route diagram names each gate',
      'down, west, north, east, south, up, in, out',
    ],
    hazard: 'hazard-switch-overheat',
    position: ['room-binary-hall', 2],
  });
  for (const clue of [
    'north switches-set',
    'east hex-read',
    'south characters-matched',
    'up picture-built',
    'in sound-sampled',
    'out stacks-sorted',
    'switches, nibbles, tiles, image, sound, stacks',
  ]) {
    expect(joined(overheat)).toContain(clue);
  }
  // prettier-ignore
  const steps: readonly TraceStep[] = [
    { raw: 'north', blocked: 'That way is closed for now.', position: ['room-binary-hall', 2] },
    { raw: 'down', entry: ['The Switch Floor', 'Heat haze shimmers', 'west, up'], noHazard: 'hazard-switch-overheat' },
    { raw: 'take switch gauge', item: 'item-switch-gauge' },
    { raw: 'use switch gauge on mosaic', rejected: ['switch-cooled', 'switches-set'], position: ['room-switch-floor', 2] },
    { raw: 'use switch gauge on belt', flags: ['switch-cooled', 'switches-set'], puzzles: ['puzzle-set-the-switches'], topic: 'Topic completed: Number conversion.' },
    { raw: 'ask foreman about data types', flags: ['stacks-sealed'] },
    { raw: 'bye' },
    { raw: 'up' },
    { raw: 'take decimal sample', item: 'item-decimal-sample' },
    { raw: 'put decimal sample on real bin', flags: ['types-sorted'], puzzles: ['puzzle-sort-the-data-types'], transfer: 'decimal sample', singleOwner: 'item-decimal-sample' },
    { raw: 'north', entry: ['The Hex Deck', 'A stuck carry lamp drips', 'south'], hazard: 'hazard-carry-overflow', position: ['room-binary-hall', 1] },
    { raw: 'north', entry: ['The Hex Deck', 'A carry track reads', 'south'], noHazard: 'hazard-carry-overflow' },
    { raw: 'take nibble card', item: 'item-hex-nibble-card' },
    { raw: 'use nibble card on carry lamp', flags: ['carry-cleared'] },
    { raw: 'use nibble card on nibble groups', flags: ['hex-read'], puzzles: ['puzzle-read-nibbles'] },
    { raw: 'use carry token on rightmost column', flags: ['carries-added'], puzzles: ['puzzle-add-with-carries'] },
    { raw: 'use shift lever on row', flags: ['row-shifted'], puzzles: ['puzzle-shift-the-row'] },
    { raw: 'show foreman switch gauge', flags: ['overflow-checked'], puzzles: ['puzzle-check-the-overflow-register'], transfer: 'switch gauge', owner: ['item-switch-gauge', ['npc-the-foreman']] },
    { raw: 'south' },
    { raw: 'east', entry: ['The Character Tiles', 'A character case lies open', 'west'] },
    { raw: 'take ascii stamp', item: 'item-ascii-stamp' },
    { raw: 'examine tiles', flags: ['tiles-verified'] },
    { raw: 'use ascii stamp on tiles', flags: ['characters-matched'], puzzles: ['puzzle-match-characters'], noHazard: 'hazard-glyph-corruption' },
    { raw: 'west' },
    { raw: 'south', entry: ['The Picture Mosaic', 'A pixel mosaic covers one wall', 'north'] },
    { raw: 'take pixel lens', item: 'item-pixel-lens' },
    { raw: 'use pixel lens on mosaic', flags: ['picture-built'], puzzles: ['puzzle-build-mosaic'] },
    { raw: 'use pixel lens on nibble card', flags: ['pixels-weighed'], puzzles: ['puzzle-weigh-the-pixels'] },
    { raw: 'show foreman pixel lens', flags: ['badge-scaled'], puzzles: ['puzzle-scale-the-badge'], transfer: 'pixel lens', owner: ['item-pixel-lens', ['npc-the-foreman']] },
    { raw: 'north' },
    { raw: 'up', entry: ['The Sound Choir', 'A choir of glass pipes sings', 'down'] },
    { raw: 'take sample fork', item: 'item-sample-fork' },
    { raw: 'use sample fork on bit-rate desk', flags: ['sound-sampled'], puzzles: ['puzzle-tune-sampling'] },
    { raw: 'down' },
    { raw: 'in', entry: ['The Storage Stacks', 'A unit ladder rises in eight rungs', 'out'], noHazard: 'hazard-bit-rot' },
    { raw: 'use sample fork on unit ladder', flags: ['stacks-sorted'], puzzles: ['puzzle-stack-the-bytes'] },
    { raw: 'show foreman sample fork', flags: ['bit-rate-counted'], puzzles: ['puzzle-count-the-bit-rate'], transfer: 'sample fork', owner: ['item-sample-fork', ['npc-the-foreman']] },
    { raw: 'show foreman nibble card', flags: ['capacity-labelled'], puzzles: ['puzzle-label-the-capacity'], transfer: 'nibble card', owner: ['item-hex-nibble-card', ['npc-the-foreman']] },
    { raw: 'out' },
    { raw: 'out', entry: ['The Compression Press', 'Two trays feed a press with a glass ratio window', 'in'] },
    { raw: 'take compression die', item: 'item-compression-die' },
    { raw: 'use compression die', flags: ['archive-packed'], puzzles: ['puzzle-pack-the-archive'] },
    { raw: 'use compression die on ascii stamp', flags: ['compression-chosen'], puzzles: ['puzzle-choose-the-compression'] },
  ];
  for (const step of steps) await runStep(page, step);
  const state = await savedGame(page);
  expect(state.status).toBe('playing');
  expect(state.player.lives).toBe(1);
  expect(state.player.position.areaId).toBe('area-1-2-1-data-representation');
  expect(state.player.position.roomId).toBe('room-compression-press');
  for (const flag of GATE_FLAGS) expect(state.flags[flag]).toBe(true);
  for (const puzzleId of NON_QUIZ_PUZZLES)
    expect(state.puzzles[puzzleId]?.phase).toBe('solved');
  const allLines = await transcript(page);
  expect(allLines.filter((line) => line.startsWith('Hazard '))).toHaveLength(0);
  for (const hazardId of [
    'hazard-switch-overheat',
    'hazard-carry-overflow',
  ] as const) {
    expect(
      allLines.filter((line) => line === hazardAnnouncement(hazardId)),
      `${hazardId} still announces its player-facing outcome once`,
    ).toHaveLength(1);
  }
  expect(
    allLines.filter((line) => /^Lives: \d+\.$/u.test(line)).length,
  ).toBeGreaterThanOrEqual(2);
  expect(joined(allLines)).not.toContain('You have won!');
  const total = state.progress.reduce(
    (sum, entry) => sum + entry.earnedScore,
    0,
  );
  await expect(page.locator('.score-panel')).toContainText(`Score: ${total}`);
  await expectAreaConsistency(page, state);
  await page.locator('.output-log').evaluate((log) => { log.scrollTop = log.scrollHeight; });
  await expect(page.locator('.output-log > div').last()).toBeInViewport();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expectPosition(page, 'room-compression-press', 1);
  expect(errors()).toEqual([]);
});
