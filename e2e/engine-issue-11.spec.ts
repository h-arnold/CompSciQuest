// Browser coverage for ENG11-SIDEBAR-STATE-01 (ENGINE_ISSUES.md L63–64, L80).
// The sidebar renders only the area matching GameViewData.position, with that
// area's reconciled totals; issue-25 title/status lines remain and citations
// never appear. Playwright's configured baseURL is used by default; CSQ_E2E_URL
// may point a local repro at another server.
import { expect, test, type Page } from 'playwright/test';
import { areas } from '../src/content/authored/areas';
import { specTopics } from '../src/content/authored/spec-topics';
import { worlds } from '../src/content/authored/worlds';

const csqUrl = process.env['CSQ_E2E_URL'];
if (csqUrl !== undefined) test.use({ baseURL: csqUrl });

const worldId = worlds[0]?.id;
if (worldId === undefined) throw new Error('No authored world');
const worldName = worlds[0]?.name;
if (worldName === undefined) throw new Error('No authored world name');

const SAVE_KEY = 'compsciquest:save:v1';
const QUARANTINE_KEY = 'compsciquest:save:v1:corrupt';
const SHOTS = '.opencode/scratchpad/slices/engine-issue-11/screenshots';

function authoredArea(areaId: string) {
  const area = areas.find((candidate) => candidate.id === areaId);
  if (area === undefined) throw new Error(`Unknown authored area ${areaId}`);
  return area;
}

function areaHeaders(): string[] {
  return areas.map((area) => `${worldName} — ${area.name}`);
}

function headerFor(areaId: string): string {
  const area = authoredArea(areaId);
  return `${worldName} — ${area.name}`;
}

function consoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => {
    errors.push(String(error));
  });
  return errors;
}

async function panelLines(page: Page): Promise<string[]> {
  return page.locator('.score-panel > div').allTextContents();
}

// Exactly one area card: the current one. No stale card, no stale per-area
// totals, and headline score/lives are the current view-data values.
async function expectCurrentCard(
  page: Page,
  areaId: string,
  earned: number,
  max: number,
  visited: number,
  rooms: number,
  headlineScore: number,
  lives: number,
): Promise<void> {
  const lines = await panelLines(page);
  const headers = areaHeaders();
  const shown = lines.filter((line) => headers.includes(line));
  expect(shown).toEqual([headerFor(areaId)]);
  expect(lines[0]).toBe(`Score: ${headlineScore}`);
  expect(lines[1]).toBe(`Lives: ${lives}`);
  expect(
    lines.filter((line) => line === `Score: ${earned} / ${max}`),
  ).toHaveLength(1);
  expect(lines.filter((line) => line.startsWith('Rooms visited:'))).toEqual([
    `Rooms visited: ${visited} / ${rooms}`,
  ]);
  for (const other of areas) {
    if (other.id === areaId) continue;
    expect(lines.some((line) => line.endsWith(` — ${other.name}`))).toBe(false);
  }
}

function noCitation(text: string): void {
  expect(text).not.toMatch(/wjec-unit1\.md/iu);
  expect(text).not.toMatch(/\bL\d{2,}\b/u);
  expect(text).not.toMatch(/\b1\.\d\.\d\b/u);
}

async function submit(page: Page, raw: string): Promise<void> {
  const command = page.getByRole('textbox', { name: 'Command' });
  await command.fill(raw);
  await command.press('Enter');
  await expect(
    page.locator('.output-log > div', { hasText: `> ${raw}` }).last(),
  ).toBeVisible();
}

// Five authored areas in one valid v1 save: only the current one may render.
// Scores/totals are deliberately distinct so a stale card cannot pass by
// coincidence with the current card.
const PROGRESS = [
  {
    areaId: 'area-entry-interface',
    roomIds: ['room-arrival'],
    earnedScore: 0,
    maxScore: 0,
    completedTopics: [],
  },
  {
    areaId: 'area-network-hub',
    roomIds: ['room-network-hub'],
    earnedScore: 0,
    maxScore: 0,
    completedTopics: [],
  },
  {
    areaId: 'area-1-2-1-data-representation',
    roomIds: ['room-switch-floor', 'room-binary-hall'],
    earnedScore: 2,
    maxScore: 24,
    completedTopics: ['data-types'],
  },
  {
    areaId: 'area-1-4-concourse',
    roomIds: ['room-1-4-concourse'],
    earnedScore: 0,
    maxScore: 0,
    completedTopics: [],
  },
  {
    areaId: 'area-1-4-programming-constructs',
    roomIds: ['room-pattern-bureau'],
    earnedScore: 5,
    maxScore: 19,
    completedTopics: ['algorithms-and-pseudocode'],
  },
] as const;

const TOTAL_SCORE = PROGRESS.reduce((sum, row) => sum + row.earnedScore, 0);

function saveWithCurrentArea(areaId: string, roomId: string): string {
  return JSON.stringify({
    version: 1,
    savedAt: '2026-11-26T12:00:00.000Z',
    state: {
      player: {
        position: { worldId, areaId, roomId },
        inventory: [],
        lives: 3,
      },
      rooms: Object.fromEntries(
        PROGRESS.flatMap((row) =>
          row.roomIds.map((id) => [id, { inventory: [] }]),
        ),
      ),
      npcs: {},
      hazards: {},
      puzzles: {},
      hints: {},
      quiz: { questionIds: [], index: 0, correctCount: 0, answers: [] },
      quizAttempts: {},
      flags: {},
      progress: PROGRESS.map((row) => ({
        worldId,
        areaId: row.areaId,
        visitedRooms: [...row.roomIds],
        completedTopics: [...row.completedTopics],
        earnedScore: row.earnedScore,
        maxScore: row.maxScore,
      })),
      turn: 12,
      status: 'playing',
      schedule: [],
      rngSeed: 1,
      counters: {},
    },
  });
}

async function seed(page: Page, save?: string): Promise<void> {
  await page.addInitScript(
    ({ saveKey, quarantineKey, seeded }) => {
      localStorage.removeItem(saveKey);
      localStorage.removeItem(quarantineKey);
      if (seeded !== undefined) localStorage.setItem(saveKey, seeded);
    },
    { saveKey: SAVE_KEY, quarantineKey: QUARANTINE_KEY, seeded: save },
  );
}

test('ENG11-SIDEBAR-STATE-01: a multi-area save renders one current card with reconciled totals', async ({
  page,
}) => {
  const errors = consoleErrors(page);
  await seed(
    page,
    saveWithCurrentArea(
      'area-1-4-programming-constructs',
      'room-pattern-bureau',
    ),
  );
  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('.workspace')).toBeVisible();

  const mill = authoredArea('area-1-4-programming-constructs');
  await expectCurrentCard(
    page,
    mill.id,
    5,
    19,
    1,
    mill.roomIds.length,
    TOTAL_SCORE,
    3,
  );
  const topic = specTopics.find(
    (candidate) => candidate.id === 'algorithms-and-pseudocode',
  );
  expect(topic).toBeDefined();
  const lines = await panelLines(page);
  expect(lines).toContain(`${topic?.title} — ${topic?.status}`);
  expect(topic?.specReference.length).toBeGreaterThan(0);
  const text = lines.join('\n');
  expect(text).not.toContain(topic?.specReference ?? 'impossible-citation');
  noCitation(text);
  await page.screenshot({ path: `${SHOTS}/17-spec-one-current-card.png` });

  // Moving area replaces the card; old rows must not linger in the sidebar.
  await submit(page, 'west');
  await expectCurrentCard(
    page,
    'area-1-4-concourse',
    0,
    0,
    1,
    1,
    TOTAL_SCORE,
    3,
  );
  await page.screenshot({ path: `${SHOTS}/18-spec-after-moving-area.png` });

  await submit(page, 'east');
  await expectCurrentCard(
    page,
    mill.id,
    5,
    19,
    1,
    mill.roomIds.length,
    TOTAL_SCORE,
    3,
  );
  expect(errors).toEqual([]);
});

test('ENG11-SIDEBAR-STATE-01: ordinary play across four areas keeps only the current card', async ({
  page,
}) => {
  const errors = consoleErrors(page);
  await seed(page);
  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled();
  await page.getByRole('button', { name: 'New Game' }).click();
  await expect(page.locator('.workspace')).toBeVisible();

  const arrival = authoredArea('area-entry-interface');
  await expectCurrentCard(
    page,
    arrival.id,
    0,
    0,
    1,
    arrival.roomIds.length,
    0,
    3,
  );

  await submit(page, 'east');
  const hub = authoredArea('area-network-hub');
  await expectCurrentCard(page, hub.id, 0, 0, 1, hub.roomIds.length, 0, 3);

  await submit(page, 'east');
  const switchyard = authoredArea('area-1-2-1-data-representation');
  await expectCurrentCard(
    page,
    switchyard.id,
    0,
    24,
    2,
    switchyard.roomIds.length,
    0,
    2,
  );

  await submit(page, 'west');
  // The switchyard quiz is unsolved, so the gated area change carries the life
  // lost to the overheat hazard across the boundary (application-and-ui.md §3.2).
  await expectCurrentCard(page, hub.id, 0, 0, 1, hub.roomIds.length, 0, 2);

  await submit(page, 'north');
  const concourse = authoredArea('area-1-4-concourse');
  await expectCurrentCard(
    page,
    concourse.id,
    0,
    0,
    1,
    concourse.roomIds.length,
    0,
    3,
  );

  await submit(page, 'east');
  const mill = authoredArea('area-1-4-programming-constructs');
  await expectCurrentCard(page, mill.id, 0, 19, 1, mill.roomIds.length, 0, 3);

  // Four previous areas have progress rows now; none may produce a card.
  await submit(page, 'west');
  await expectCurrentCard(
    page,
    concourse.id,
    0,
    0,
    1,
    concourse.roomIds.length,
    0,
    3,
  );
  await submit(page, 'save');
  const raw = await page.evaluate((key) => localStorage.getItem(key), SAVE_KEY);
  expect(raw).not.toBeNull();
  // The persisted DTO deliberately omits the derived score; the view-data
  // headline is the sum of the saved progress rows (GameState.ts L36–41).
  const state = (
    JSON.parse(raw ?? '{}') as {
      state: {
        player: { lives: number };
        progress: readonly { earnedScore: number }[];
      };
    }
  ).state;
  const derivedScore = state.progress.reduce(
    (sum, row) => sum + row.earnedScore,
    0,
  );
  const lines = await panelLines(page);
  expect(lines[0]).toBe(`Score: ${derivedScore}`);
  expect(lines[1]).toBe(`Lives: ${state.player.lives}`);
  noCitation(lines.join('\n'));
  expect(errors).toEqual([]);
});
