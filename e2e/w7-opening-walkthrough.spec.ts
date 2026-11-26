// W7 browser evidence for the accepted V4 trace in docs/content/walkthrough.md.
// Quiz and hint integration is deferred by the user, so the complete authored
// win remains skipped. Non-quiz expectations are never weakened to match broken output.
import { expect, test, type Page } from 'playwright/test';
import { areas } from '../src/content/authored/areas';
import { rooms } from '../src/content/authored/rooms';
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
// prettier-ignore
const CONTROL_ORDER = ['Command', 'Save', 'Load', 'Download', 'Import', 'Restart', 'Download quarantined save'];

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

function expectFlag(lines: readonly string[], flag: string): void {
  expect(lines).toContain(`${flag} = true.`);
}

function expectPuzzle(lines: readonly string[], puzzleId: string): void {
  expect(
    lines.some((line) => line.startsWith(`Puzzle ${puzzleId} solved`)),
  ).toBe(true);
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

function expectTransfer(lines: readonly string[], itemName: string): void {
  expect(
    lines.filter((line) => line.includes(`${itemName} moved from player to`)),
  ).toHaveLength(1);
}

async function runStep(page: Page, step: TraceStep): Promise<string[]> {
  const lines = await command(page, step.raw);
  if (step.entry !== undefined) expectEntry(lines, ...step.entry);
  const flags = step.flags ?? [];
  const puzzles = step.puzzles ?? [];
  for (const flag of flags) expectFlag(lines, flag);
  for (const puzzleId of puzzles) expectPuzzle(lines, puzzleId);
  if (step.transfer !== undefined) expectTransfer(lines, step.transfer);
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
  if (step.hazard !== undefined)
    expect(
      lines.some((line) => line.startsWith(`Hazard ${step.hazard}:`)),
    ).toBe(true);
  if (step.noHazard !== undefined)
    expect(lines.some((line) => line.includes(step.noHazard ?? ''))).toBe(
      false,
    );
  if (step.blocked !== undefined) expect(joined(lines)).toContain(step.blocked);
  if (step.topic !== undefined) expect(lines).toContain(step.topic);
  return lines;
}

// prettier-ignore
async function expectAreaConsistency(page: Page, state: SavedState): Promise<void> {
  const areaById = new Map(areas.map((area) => [area.id, area]));
  for (const progress of state.progress) {
    const area = areaById.get(progress.areaId);
    if (area === undefined)
      throw new Error(`Unknown saved area ${progress.areaId}`);
    const visited = new Set(progress.visitedRooms);
    expect(visited.size).toBe(progress.visitedRooms.length);
    expect(visited.size).toBeLessThanOrEqual(area.roomIds.length);
    expect([...visited].every((roomId) => area.roomIds.includes(roomId))).toBe(
      true,
    );
    await expect(page.locator('.score-panel')).toContainText(
      `Rooms visited: ${visited.size} / ${area.roomIds.length}`,
    );
  }
  expect(rooms).toHaveLength(20);
}

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

// prettier-ignore
async function contrastColours(page: Page): Promise<Record<string, { foreground: string; background: string }>> {
  return page.evaluate(() => {
    const result: Record<string, { foreground: string; background: string }> =
      {};
    for (const selector of ['.output-log', '.score-panel', 'button']) {
      const element = document.querySelector(selector);
      if (element === null)
        throw new Error(`Missing contrast target ${selector}`);
      const ancestors: Element[] = [];
      let current: Element | null = element;
      while (current !== null) {
        ancestors.push(current);
        current = current.parentElement;
      }
      const background =
        ancestors
          .map((node) => getComputedStyle(node).backgroundColor)
          .find((colour) => {
            const alpha = Number((colour.match(/[\d.]+/gu) ?? []).at(-1));
            return colour !== 'transparent' && alpha !== 0;
          }) ?? 'rgb(255, 255, 255)';
      result[selector] = {
        foreground: getComputedStyle(element).color,
        background,
      };
    }
    return result;
  });
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
  await startNewGame(page);
  const hub = await enter(
    page,
    'east',
    'The Network Hub',
    'The hub copies every packet to every port',
    'west, east, in',
  );
  expect(joined(hub)).toContain('A port label on the east socket reads LIVE');
  expect(joined(hub)).not.toContain('switches-set');
  await expectPosition(page, 'room-network-hub', 3);
  const escape = await command(page, 'ask ai about escape');
  expect(joined(escape)).toContain('Two ports on the patch bay glow; the rest sit dark.');
  expect(joined(escape)).toContain("The east socket wears the record's LIVE; the north one wears a fresh paper label");
  expect(joined(escape)).toContain('Follow the routes, and let the work write the entry.');
  const whyAtHub = await command(page, 'ask ai about why here');
  expect(joined(whyAtHub)).not.toContain(
    'The classroom folded along its grid lines',
  );
  expect(joined(whyAtHub)).toContain('The pointer rests on the record');
  await enter(
    page,
    'in',
    'The Interface',
    'The arrow east points to the switch floor',
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
  await startNewGame(page);
  await command(page, 'east');
  const lines = await enter(
    page,
    'east',
    'The Switch Floor',
    'Heat haze shimmers off a belt of tiny black switches',
    'west, up',
  );
  expect(
    lines.some((line) => line.startsWith('Hazard hazard-switch-overheat:')),
  ).toBe(true);
  expect(lines).toContain('Lives: 2.');
  expect(lines.indexOf('The Switch Floor')).toBeLessThan(
    lines.findIndex((line) => line.startsWith('Hazard hazard-switch-overheat')),
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
  await expectPosition(page, 'room-switch-floor', 2);
  expect(errors()).toEqual([]);
});

// prettier-ignore
test('W7 non-quiz trace — room text, item actions and all six Binary Hall gates', async ({ page }) => {
  const errors = watchConsole(page);
  await startNewGame(page);
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
    { raw: 'north', blocked: 'That way is blocked: flag-set.', position: ['room-binary-hall', 2] },
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
  expect(allLines.filter((line) => line.startsWith('Hazard '))).toHaveLength(2);
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

// prettier-ignore
test('W7 accessibility — labels, live transcript, keyboard order, focus, contrast, reflow and reduced motion', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled();
  expect(
    await page.getByRole('button', { name: 'Continue' }).isDisabled(),
  ).toBe(true);
  await page.keyboard.press('Tab');
  expect(
    await page.evaluate(() => document.activeElement?.textContent?.trim()),
  ).toBe('New Game');
  await page.keyboard.press('Enter');
  await expect(page.locator('.workspace')).toBeVisible();
  const attributes = await page.evaluate(() => ({
    role: document.querySelector('.output-log')?.getAttribute('role'),
    live: document.querySelector('.output-log')?.getAttribute('aria-live'),
    label: document.querySelector('input')?.getAttribute('aria-label'),
  }));
  expect(attributes).toEqual({ role: 'log', live: 'polite', label: 'Command' });
  await page.keyboard.press('Tab');
  const order: string[] = [];
  for (let index = 0; index < CONTROL_ORDER.length; index += 1) {
    await page.keyboard.press('Tab');
    order.push(
      (await page.evaluate(
        () =>
          document.activeElement?.getAttribute('aria-label') ??
          document.activeElement?.textContent?.trim(),
      )) ?? '',
    );
  }
  expect(order).toEqual(CONTROL_ORDER);
  const focus = await page.evaluate(() => {
    const style = getComputedStyle(document.activeElement ?? document.body);
    return { style: style.outlineStyle, width: style.outlineWidth };
  });
  expect(focus.style).not.toBe('none');
  const colours = await contrastColours(page);
  for (const pair of Object.values(colours)) {
    expect(
      contrastRatio(pair.foreground, pair.background),
    ).toBeGreaterThanOrEqual(4.5);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  const widths = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.client);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const motion = await page.evaluate(() => ({
    matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
    durations: [
      ...document.querySelectorAll('.window, .output-log, button'),
    ].flatMap((element) => {
      const style = getComputedStyle(element);
      return [style.transitionDuration, style.animationDuration];
    }),
  }));
  expect(motion.matches).toBe(true);
  expect(motion.durations.every((duration) => duration === '0s')).toBe(true);
});

// prettier-ignore
test('W7 full authored win — DEFERRED by the user: quiz doors and hints are not integrated', async ({ page }, testInfo) => {
  // Retained V4 steps 1–18: clean authored commands; two hazard life losses;
  // six Binary Hall gates opened by switches-set, hex-read, characters-matched,
  // picture-built, sound-sampled and stacks-sorted; all USE/PUT/SHOW flags and
  // puzzles; one transfer per SHOW; passes for quiz-switchyard, quiz-data-types,
  // quiz-number-systems, quiz-character-representation, quiz-graphics-representation,
  // quiz-sound-representation, quiz-storage-units and quiz-data-compression;
  // all six hint ladders; eight covered topics; one life; one game-won with the
  // final score; no victory re-announcement after reload. Quiz, hint and win
  // behaviour is not implemented or claimed in this slice.
  testInfo.skip(true, 'Quiz and hint integration is deferred by the user.');
  await page.goto('./');
});
