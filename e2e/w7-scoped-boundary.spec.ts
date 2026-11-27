// W7R-BROWSER-02 — scoped boundary evidence for docs/content/walkthrough.md
// §8 steps 19–21. Quiz handoffs, hint ladders and the full authored win remain
// out of scope; no quiz/hint/win assertion is made here. Crafted saves use only
// real authored IDs (engine-level deterministic checks), never stub content.
import { expect, test, type Page } from 'playwright/test';
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

interface SaveState {
  player: {
    position: { worldId: string; areaId: string; roomId: string };
    inventory: string[];
    lives: number;
  };
  rooms: Record<string, { inventory: string[] }>;
  npcs: Record<string, unknown>;
  flags: Record<string, boolean>;
  progress: {
    worldId: string;
    areaId: string;
    visitedRooms: string[];
    completedTopics: string[];
    earnedScore: number;
    maxScore: number;
  }[];
  [key: string]: unknown;
}

// Later-area traces start after the accepted Assistance Ward orientation:
// `tutorial-complete` is the single flag produced by puzzle-calibrate-assistance
// and read by the hub east/north gates (docs/content/topics/assistance-ward.md
// §8/§10 and the network-hub room card). Passing it here changes setup only;
// every command, expectation and assertion in the traces is unchanged.
const WARD_COMPLETE_FLAGS = { 'tutorial-complete': true } as const;

function saveAt(
  state: SaveState,
  roomId: string,
  areaId: string,
  lives: number,
  flags: Readonly<Record<string, boolean>>,
): string {
  return JSON.stringify({
    version: 1,
    savedAt: '2026-11-24T12:06:00.000Z',
    state: {
      ...state,
      player: {
        ...state.player,
        position: { worldId: WORLD, areaId, roomId },
        lives,
      },
      flags: { ...flags },
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

test('W7 scoped — lives reset on both area changes into the concourse and the mill', async ({
  page,
}) => {
  const errors = watchConsole(page);
  const template = await liveSave(page);

  // Hub (2 lives) -> concourse: area change restores 3.
  const hub = saveAt(
    template,
    'room-network-hub',
    'area-network-hub',
    2,
    WARD_COMPLETE_FLAGS,
  );
  await continueFrom(page, hub);
  const toConcourse = await command(page, 'north');
  expect(toConcourse).toContain('The Rule Machine Concourse');
  expect(toConcourse).toContain('Lives: 3.');
  expect(toConcourse.join('\n')).toContain('Y Felin');

  // Concourse (2 lives) -> Pattern Mill: area change restores 3.
  const concourse = saveAt(
    template,
    'room-1-4-concourse',
    'area-1-4-concourse',
    2,
    WARD_COMPLETE_FLAGS,
  );
  await continueFrom(page, concourse);
  const toMill = await command(page, 'east');
  expect(toMill).toContain('The Pattern Bureau');
  expect(toMill).toContain('Lives: 3.');
  expect(toMill.join('\n')).toContain('UNTIL A DEMONSTRATION IS ON RECORD');
  expect(errors()).toEqual([]);
});

test('W7 scoped — Bureau beats render and the east door stays bolted before the quiz boundary', async ({
  page,
}) => {
  const errors = watchConsole(page);
  const template = await liveSave(page);
  const atBureau = saveAt(
    template,
    'room-pattern-bureau',
    'area-1-4-programming-constructs',
    3,
    {},
  );
  await continueFrom(page, atBureau);

  const welcome = await command(page, 'ask loomwright about hello');
  expect(welcome.join('\n')).toContain('Bore da — the morning word');
  const pseudocode = await command(
    page,
    'ask loomwright about algorithms and pseudocode',
  );
  expect(pseudocode.join('\n')).toContain(
    'A pattern is set down twice, so that either copy can be read aloud to the mill.',
  );
  expect(pseudocode.join('\n')).not.toContain(
    'You learned about Algorithms and pseudo-code.',
  );
  expect(pseudocode.join('\n')).not.toContain(
    'Entered conversation node node-loomwright-demonstration.',
  );
  const shapes = await command(page, 'ask loomwright about shapes');
  expect(shapes.join('\n')).toContain('The five working shapes are stencilled');
  expect(shapes.join('\n')).not.toContain('Left the conversation node.');
  // ENG8-LOGID-01: conversation-started/conversation-ended are internal-state
  // events; the NPC speech above must render without their debug framing.
  for (const line of [...welcome, ...pseudocode, ...shapes]) {
    expect(line).not.toMatch(
      /^(?:Conversation started with|Conversation ended)\b/u,
    );
    expect(line).not.toMatch(/\bactorstate-[a-z-]+/u);
  }

  // The ten §8.6 Zone A interaction rows all live behind this door; the scoped
  // walk stops here rather than handing off quiz-pattern-bureau.
  const bolted = await command(page, 'east');
  expect(bolted).toContain('> east');
  expect(bolted.join('\n')).toContain('That way is closed for now.');
  expect(errors()).toEqual([]);
});
