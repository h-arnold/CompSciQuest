// Deterministic fixtures for the browser flows. Position and room records are
// derived from the committed authored catalogues so they pass
// SaveManager.validate()'s content-reference checks after C1 regeneration;
// items, NPCs, quizzes and spec topics stay empty. No real clock/random value.
import { expect, type Locator, type Page } from 'playwright/test';
import { areas } from '../src/content/authored/areas';
import { rooms } from '../src/content/authored/rooms';
import { worlds } from '../src/content/authored/worlds';

export const SAVE_KEY = 'compsciquest:save:v1';
export const QUARANTINE_KEY = 'compsciquest:save:v1:corrupt';

export const SAVED_AT = '2026-11-24T12:06:00.000Z';

export interface StateSeed {
  readonly position?: {
    readonly worldId: string;
    readonly areaId: string;
    readonly roomId: string;
  };
  readonly earnedScore?: number;
  readonly lives?: number;
  readonly status?: 'playing' | 'won' | 'lost';
  readonly turn?: number;
  readonly counters?: Readonly<Record<string, number>>;
}

export interface StorageSeed {
  readonly save?: string | null;
  readonly quarantine?: string | null;
}

function firstEntry<T>(entries: readonly T[], label: string): T {
  const entry = entries[0];
  if (entry === undefined)
    throw new Error(`Authored ${label} catalogue is empty`);
  return entry;
}

function requireById<T extends { id: string }>(
  entries: readonly T[],
  id: string,
  label: string,
): T {
  const found = entries.find((entry) => entry.id === id);
  if (found === undefined)
    throw new Error(`Authored ${label} '${id}' not found`);
  return found;
}

// Start location comes from the world's startAreaId and that area's
// startRoomId, resolved by ID rather than array position (walkthrough.md §2
// boot chain). The authored bundles are the only source of these IDs.
const authoredWorld = firstEntry(worlds, 'worlds');
const authoredArea = requireById(
  areas,
  authoredWorld.startAreaId,
  'start area',
);
const authoredStartRoom = requireById(
  rooms,
  authoredArea.startRoomId,
  'start room',
);

export const START_POSITION = {
  worldId: authoredWorld.id,
  areaId: authoredArea.id,
  roomId: authoredStartRoom.id,
};

export const START_ROOM_TITLE = authoredStartRoom.title;

// A second real room id from the authored start room's exits keeps the
// multi-room fixture valid without pinning any generated content ID.
const adjacentRoomId = authoredStartRoom.exits[0]?.targetRoomId;

// A complete, schema-valid v1 state using real authored IDs for every
// reference-checked field; items, NPCs, quizzes and topics stay empty.
export function makeState(seed: StateSeed = {}): Record<string, unknown> {
  const roomIds = [
    authoredStartRoom.id,
    ...(adjacentRoomId === undefined ? [] : [adjacentRoomId]),
  ];
  return {
    player: {
      position: seed.position ?? START_POSITION,
      inventory: [],
      lives: seed.lives ?? 3,
    },
    rooms: Object.fromEntries(roomIds.map((id) => [id, { inventory: [] }])),
    npcs: {},
    hazards: {},
    puzzles: {},
    hints: {},
    quiz: { questionIds: [], index: 0, correctCount: 0, answers: [] },
    quizAttempts: {},
    flags: {},
    progress: [
      {
        worldId: authoredWorld.id,
        areaId: authoredArea.id,
        visitedRooms: [authoredStartRoom.id],
        completedTopics: [],
        earnedScore: seed.earnedScore ?? 0,
        maxScore: 0,
      },
    ],
    turn: seed.turn ?? 0,
    status: seed.status ?? 'playing',
    schedule: [],
    rngSeed: 1,
    counters: seed.counters ?? {},
  };
}

export function makeSave(
  seed: StateSeed = {},
  savedAt: string = SAVED_AT,
): string {
  return JSON.stringify({
    version: 1,
    savedAt,
    state: makeState(seed),
  });
}

export function makeQuarantine(raw: string, reason = 'invalid-json'): string {
  return JSON.stringify({
    quarantinedAt: SAVED_AT,
    reason,
    raw,
  });
}

// Each addInitScript is one-shot per tab (sessionStorage survives reload), so
// a seed is installed before the first boot and never overwrites a save written
// later. A distinct flag per call lets a test-specific seed supersede the
// default empty seed installed by beforeEach: scripts run in registration
// order, so the last registered seed wins on the first navigation only. Counts
// are keyed by page in a WeakMap so no module-scope variable is reassigned from
// inside a function.
const seedCounts = new WeakMap<Page, number>();

export async function seedStorage(
  page: Page,
  seed: StorageSeed = {},
): Promise<void> {
  const nextCount = (seedCounts.get(page) ?? 0) + 1;
  seedCounts.set(page, nextCount);
  const flag = `__csq_seeded_${nextCount}`;
  await page.addInitScript(
    ({ save, quarantine, saveKey, quarantineKey, seedFlag }) => {
      if (sessionStorage.getItem(seedFlag) === '1') return;
      sessionStorage.setItem(seedFlag, '1');
      localStorage.removeItem(saveKey);
      localStorage.removeItem(quarantineKey);
      if (typeof save === 'string') localStorage.setItem(saveKey, save);
      if (typeof quarantine === 'string') {
        localStorage.setItem(quarantineKey, quarantine);
      }
    },
    {
      save: seed.save ?? undefined,
      quarantine: seed.quarantine ?? undefined,
      saveKey: SAVE_KEY,
      quarantineKey: QUARANTINE_KEY,
      seedFlag: flag,
    },
  );
}

export async function readStorage(
  page: Page,
  key: string,
): Promise<string | null> {
  return page.evaluate((storageKey) => localStorage.getItem(storageKey), key);
}

export function transcript(page: Page): Promise<string[]> {
  return page.locator('.output-log > div').allTextContents();
}

export async function statusText(page: Page): Promise<string> {
  return (await page.locator('.save-status').textContent()) ?? '';
}

export async function expectWorkspace(page: Page): Promise<void> {
  await expect(page.locator('.workspace')).toBeVisible();
}

export async function startNewGame(page: Page): Promise<void> {
  await page.goto('./');
  await page.getByRole('button', { name: 'New Game' }).click();
  await expectWorkspace(page);
}

export async function submit(page: Page, raw: string): Promise<void> {
  await page.getByRole('textbox', { name: 'Command' }).fill(raw);
  await page.getByRole('textbox', { name: 'Command' }).press('Enter');
}

export async function waitForLine(page: Page, text: string): Promise<void> {
  await expect(
    page.locator('.output-log > div', { hasText: text }).first(),
  ).toBeVisible();
}

export function scorePanel(page: Page): Locator {
  return page.locator('.score-panel');
}

// No console errors are permitted during any verified flow.
export function watchConsole(page: Page): () => readonly string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => {
    errors.push(String(error));
  });
  return () => errors;
}

export const DOWNLOAD_NAME =
  /^compsciquest-save-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z\.json$/;

export const QUARANTINE_DOWNLOAD_NAME =
  /^compsciquest-quarantine-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z\.json$/;
