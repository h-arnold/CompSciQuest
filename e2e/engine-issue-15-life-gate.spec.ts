// ENG15-LIFEGATE-01 — browser evidence for ENGINE_ISSUES.md Batch E2 issue 15.
// On an area crossing, lives reset to the destination's declared value only
// when every quiz and puzzle of the DEPARTED area is solved. Saves are crafted
// from a live New Game save so only real authored IDs and real DTO shapes are
// used; the quiz flags and puzzle phases are the canonical persisted facts.
import { expect, test, type Page } from 'playwright/test';
import { areas } from '../src/content/authored/areas';
import { puzzles } from '../src/content/authored/puzzles';
import { quizzes } from '../src/content/authored/quizzes';
import { specTopics } from '../src/content/authored/spec-topics';
import {
  SAVE_KEY,
  readStorage,
  seedStorage,
  startNewGame,
  submit,
  transcript,
  watchConsole,
} from './helpers';

const WORLD = 'world-wjec-gcse-computer-science-2025-spec';
const HUB_ROOM = 'room-network-hub';
const SWITCHYARD_ROOM = 'room-binary-hall';

function switchyardArea(): (typeof areas)[number] {
  const area = areas.find(
    (entry) => entry.id === 'area-1-2-1-data-representation',
  );
  if (area === undefined)
    throw new Error('Authored Switchyard area is missing');
  return area;
}

function gateIds(): { quizzes: readonly string[]; puzzles: readonly string[] } {
  const area = switchyardArea();
  const topicIds = new Set(
    specTopics
      .filter((topic) =>
        topic.roomIds.some((roomId) => area.roomIds.includes(roomId)),
      )
      .map((topic) => topic.id),
  );
  return {
    quizzes: quizzes
      .filter((quiz) => topicIds.has(quiz.topicId))
      .map((quiz) => quiz.id),
    puzzles: puzzles
      .filter(
        (puzzle) =>
          puzzle.topicId !== undefined && topicIds.has(puzzle.topicId),
      )
      .map((puzzle) => puzzle.id),
  };
}

const GATE_IDS = gateIds();

function firstId(ids: readonly string[], label: string): string {
  const id = ids[0];
  if (id === undefined) throw new Error(`Authored ${label} ID is missing`);
  return id;
}

function secondId(ids: readonly string[], label: string): string {
  return ids[1] ?? firstId(ids, label);
}

interface SaveState {
  player: {
    position: { worldId: string; areaId: string; roomId: string };
    inventory: string[];
    lives: number;
  };
  rooms: Record<string, { inventory: string[] }>;
  npcs: Record<string, unknown>;
  hazards: Record<string, unknown>;
  flags: Record<string, boolean>;
  puzzles: Record<string, { phase: string }>;
  hints: Record<string, unknown>;
  quiz: {
    questionIds: string[];
    index: number;
    correctCount: number;
    answers: string[];
  };
  quizAttempts: Record<string, number>;
  progress: {
    worldId: string;
    areaId: string;
    visitedRooms: string[];
    completedTopics: string[];
    earnedScore: number;
    maxScore: number;
  }[];
  turn: number;
  status: string;
  schedule: unknown[];
  rngSeed: number;
  counters: Record<string, number>;
  [key: string]: unknown;
}

interface GateOverrides {
  readonly flags?: Readonly<Record<string, boolean>>;
  readonly puzzles?: Readonly<Record<string, { readonly phase: string }>>;
}

// Extends the scoped-boundary helper locally: flags are cleared rather than
// inherited, and puzzle phases can be set so the departed-area gate is exact.
function saveAt(
  state: SaveState,
  roomId: string,
  areaId: string,
  overrides: GateOverrides = {},
): string {
  return JSON.stringify({
    version: 1,
    savedAt: '2026-11-24T12:06:00.000Z',
    state: {
      ...state,
      player: {
        ...state.player,
        position: { worldId: WORLD, areaId, roomId },
        lives: 2,
      },
      flags: overrides.flags ?? {},
      puzzles: { ...state.puzzles, ...overrides.puzzles },
    },
  });
}

async function liveSave(page: Page): Promise<SaveState> {
  await startNewGame(page);
  await submit(page, 'save');
  await expect.poll(() => readStorage(page, SAVE_KEY)).not.toBeNull();
  const raw = await readStorage(page, SAVE_KEY);
  if (raw === null) throw new Error('New Game did not write a save');
  return (JSON.parse(raw) as { state: SaveState }).state;
}

async function continueFrom(page: Page, raw: string): Promise<void> {
  await seedStorage(page, { save: raw });
  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('.workspace')).toBeVisible();
}

async function command(page: Page, raw: string): Promise<string[]> {
  const before = await page.locator('.output-log > div').count();
  await submit(page, raw);
  await page.waitForFunction(
    ({ text, count }) =>
      [...document.querySelectorAll('.output-log > div')]
        .slice(count)
        .some((line) => line.textContent === `> ${text}`),
    { text: raw, count: before },
  );
  const lines = await transcript(page);
  return lines.slice(before);
}

interface SolvedGate {
  readonly flags: Readonly<Record<string, boolean>>;
  readonly puzzles: Readonly<Record<string, { readonly phase: string }>>;
}

function allSolved(): SolvedGate {
  return {
    flags: Object.fromEntries(
      GATE_IDS.quizzes.map((id) => [`quiz-passed:${id}`, true]),
    ),
    puzzles: Object.fromEntries(
      GATE_IDS.puzzles.map((id) => [id, { phase: 'solved' }]),
    ),
  };
}

async function savedState(page: Page): Promise<SaveState> {
  await command(page, 'save');
  const raw = await readStorage(page, SAVE_KEY);
  if (raw === null) throw new Error('Save was not written after the crossing');
  return (JSON.parse(raw) as { state: SaveState }).state;
}

test.beforeEach(async ({ page }) => {
  await seedStorage(page);
});

test('ENG15-LIFEGATE-01 — an unsolved Switchyard quiz and puzzle carry lives across west into the hub', async ({
  page,
}) => {
  const errors = watchConsole(page);
  expect(GATE_IDS.quizzes.length).toBeGreaterThan(0);
  expect(GATE_IDS.puzzles.length).toBeGreaterThan(0);
  const template = await liveSave(page);
  const raw = saveAt(template, SWITCHYARD_ROOM, switchyardArea().id, {
    flags: { [`quiz-passed:${firstId(GATE_IDS.quizzes, 'quiz')}`]: false },
    puzzles: { [firstId(GATE_IDS.puzzles, 'puzzle')]: { phase: 'active' } },
  });
  await continueFrom(page, raw);

  const lines = await command(page, 'west');
  expect(lines).toContain('> west');
  expect(lines).toContain('The Network Hub');
  expect(lines.filter((line) => line.startsWith('Lives: '))).toEqual([]);
  await expect(page.locator('.score-panel')).toContainText('Lives: 2');

  const state = await savedState(page);
  expect(state.player.lives).toBe(2);
  expect(state.player.position).toEqual({
    worldId: WORLD,
    areaId: 'area-network-hub',
    roomId: HUB_ROOM,
  });
  expect(errors()).toEqual([]);
});

test('ENG15-LIFEGATE-01 — all quizzes passed but one puzzle unsolved still carries lives across', async ({
  page,
}) => {
  const errors = watchConsole(page);
  const template = await liveSave(page);
  const solved = allSolved();
  const withUnsolvedPuzzle: GateOverrides = {
    flags: solved.flags,
    puzzles: {
      ...solved.puzzles,
      [secondId(GATE_IDS.puzzles, 'puzzle')]: { phase: 'unsolved' },
    },
  };
  await continueFrom(
    page,
    saveAt(template, SWITCHYARD_ROOM, switchyardArea().id, withUnsolvedPuzzle),
  );

  const lines = await command(page, 'west');
  expect(lines).toContain('The Network Hub');
  expect(lines.filter((line) => line.startsWith('Lives: '))).toEqual([]);
  await expect(page.locator('.score-panel')).toContainText('Lives: 2');
  const partialState = await savedState(page);
  expect(partialState.player.lives).toBe(2);
  expect(errors()).toEqual([]);
});

test('ENG15-LIFEGATE-01 — every Switchyard quiz and puzzle solved permits the life reset to 3', async ({
  page,
}) => {
  const errors = watchConsole(page);
  const template = await liveSave(page);
  await continueFrom(
    page,
    saveAt(template, SWITCHYARD_ROOM, switchyardArea().id, allSolved()),
  );

  const lines = await command(page, 'west');
  expect(lines).toContain('> west');
  expect(lines).toContain('The Network Hub');
  expect(lines).toContain('Lives: 3.');
  await expect(page.locator('.score-panel')).toContainText('Lives: 3');

  const state = await savedState(page);
  expect(state.player.lives).toBe(3);
  expect(state.player.position.roomId).toBe(HUB_ROOM);
  expect(errors()).toEqual([]);
});

test('ENG15-LIFEGATE-01 — the hub satisfies the gate vacuously when heading north to the concourse', async ({
  page,
}) => {
  const errors = watchConsole(page);
  const template = await liveSave(page);
  await continueFrom(page, saveAt(template, HUB_ROOM, 'area-network-hub'));

  const lines = await command(page, 'north');
  expect(lines).toContain('> north');
  expect(lines).toContain('The Rule Machine Concourse');
  expect(lines).toContain('Lives: 3.');
  await expect(page.locator('.score-panel')).toContainText('Lives: 3');

  const state = await savedState(page);
  expect(state.player.lives).toBe(3);
  expect(state.player.position.areaId).toBe('area-1-4-concourse');
  expect(errors()).toEqual([]);
});
