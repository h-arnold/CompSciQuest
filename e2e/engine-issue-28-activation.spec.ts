// ENG28-ACTIVATION-01 — browser evidence that an activated puzzle is silent in
// the player-facing transcript, including after unrelated commands and during
// a quiz, while the underlying puzzle state still advances normally.
//
// Authority: ENGINE_ISSUES.md Batch E2 (line 50), issue #28 (line 87),
// Group B (124–127) and stream 2 (156); PLAYTEST_ISSUES.md §28 (295–304);
// docs/developer/application-and-ui.md §6.1 (puzzle-activated suppressed at
// render time, ScorePanel via view data) and §9 (set-puzzle-active →
// puzzle-activated). No injected event seam is used: activation is driven by
// a crafted valid v1 save that carries one of the puzzle's real requirement
// flags, and state is observed through the game's own Save button.
import { expect, test, type Page } from 'playwright/test';
import {
  expectWorkspace,
  readStorage,
  SAVE_KEY,
  seedStorage,
  START_ROOM_TITLE,
  startNewGame,
  submit,
  transcript,
  watchConsole,
} from './helpers';

const SELVEDGE_PUZZLE = 'puzzle-close-the-selvedge';
const ROGUE_PUZZLE = 'puzzle-file-the-rogue-thread';
const SHED_PUZZLE = 'puzzle-lift-the-shed';

const ACTIVATION_NOTICE = /is now active/iu;
const INTERNAL_PUZZLE_ID = /\bpuzzle-[a-z][a-z\d-]*/iu;
const INTERNAL_EVENT_NAME =
  /\b(?:puzzle-activated|puzzle-solved|set-puzzle-active|flag-changed|item-moved)\b/iu;

interface State {
  flags: Record<string, unknown>;
  player: { position: unknown; inventory: string[] };
  rooms: Record<string, unknown>;
  progress: unknown[];
  puzzles: Record<string, { phase: string }>;
  counters: Record<string, number>;
}

function expectNoActivation(lines: readonly string[]): void {
  const notice = lines.filter((line) => ACTIVATION_NOTICE.test(line));
  expect(notice, 'no "Puzzle … is now active." notice').toEqual([]);

  const leakedIds = lines.filter(
    (line) =>
      line.includes(SELVEDGE_PUZZLE) ||
      line.includes(ROGUE_PUZZLE) ||
      line.includes(SHED_PUZZLE) ||
      INTERNAL_PUZZLE_ID.test(line),
  );
  expect(leakedIds, 'no internal puzzle ID in the transcript').toEqual([]);

  const eventNames = lines.filter((line) => INTERNAL_EVENT_NAME.test(line));
  expect(eventNames, 'no internal event name in the transcript').toEqual([]);
}

async function command(page: Page, raw: string): Promise<string[]> {
  const before = await page.locator('.output-log > div').count();
  await submit(page, raw);
  await page.waitForFunction(
    ({ raw, count }) =>
      [...document.querySelectorAll('.output-log > div')]
        .slice(count)
        .some((line) => line.textContent === `> ${raw}`),
    { raw, count: before },
  );
  const lines = await transcript(page);
  return lines.slice(before);
}

// Derive the crafted save from a real New Game save so NPC knowledge and all
// other authored initial state stay intact; only the named requirement flag
// (and, in the solve case, position/inventory) is added. This is a valid v1
// save, not a seam in the running game.
async function continueFromCraftedSave(
  page: Page,
  mutate: (state: State) => void,
): Promise<void> {
  await startNewGame(page);
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  const raw = await readStorage(page, SAVE_KEY);
  expect(raw, 'New Game wrote a valid save to browser storage').not.toBeNull();
  const parsed = JSON.parse(raw ?? '{}') as {
    version: number;
    savedAt: string;
    state: State;
  };
  expect(parsed.version).toBe(1);
  expect(parsed.savedAt).toBeTruthy();
  mutate(parsed.state);
  await seedStorage(page, { save: JSON.stringify(parsed) });
  await page.reload();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expectWorkspace(page);
}

async function savedState(page: Page): Promise<State> {
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  const raw = await readStorage(page, SAVE_KEY);
  expect(raw, 'Save button wrote the current state').not.toBeNull();
  return (JSON.parse(raw ?? '{}') as { state: State }).state;
}

test.beforeEach(async ({ page }) => {
  await seedStorage(page);
});

test('ENG28-ACTIVATION-01 — activation and repeated unrelated commands stay silent', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await continueFromCraftedSave(page, (state) => {
    state.flags['card-condition-given'] = true;
  });

  // The first turn after loading the partial flag activates both real puzzles.
  // MD-STATUS-01/02 (spec §6.1) render room entry and `look` as a four-part
  // shape headed by `## <title>`. textContent strips the `##`, so inspect the
  // heading node: the new h2 after the initial room entry must be the look
  // transcript's location heading, not the old bare "The Arrival Bay." line.
  const headingsBefore = await page.locator('.output-log h2').count();
  const activation = await command(page, 'look');
  expect(activation).toContain('> look');
  expect(
    await page.locator('.output-log h2').count(),
    'look adds a location heading to the transcript',
  ).toBe(headingsBefore + 1);
  await expect(page.locator('.output-log h2').nth(headingsBefore)).toHaveText(
    START_ROOM_TITLE,
  );
  const lookEntry = page
    .locator('.output-log > div')
    .filter({ has: page.locator('h2', { hasText: START_ROOM_TITLE }) })
    .last();
  await expect(lookEntry, 'look keeps the four-part room shape').toContainText(
    'Exits:',
  );
  expectNoActivation(activation);

  for (const raw of ['look', 'inventory', 'look']) {
    const batch = await command(page, raw);
    expect(batch).toContain(`> ${raw}`);
    expectNoActivation(batch);
  }
  expect(await command(page, 'inventory')).toContain(
    'You are carrying nothing.',
  );

  // Game rules still ran: the save — a documented state indicator written by
  // the real Save button — shows both puzzles active and their turn counters
  // advancing on subsequent turns.
  const state = await savedState(page);
  expect(state.puzzles[SELVEDGE_PUZZLE]?.phase).toBe('active');
  expect(state.puzzles[ROGUE_PUZZLE]?.phase).toBe('active');
  expect(state.counters[`turns-since:${SELVEDGE_PUZZLE}`]).toBeGreaterThan(0);
  expectNoActivation(await transcript(page));
  expect(errors()).toEqual([]);
});

test('ENG28-ACTIVATION-01 — the activated puzzle still solves with its friendly completion', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await continueFromCraftedSave(page, (state) => {
    state.flags['card-condition-given'] = true;
    state.player.position = {
      worldId: 'world-wjec-gcse-computer-science-2025-spec',
      areaId: 'area-1-4-programming-constructs',
      roomId: 'room-endless-selvedge',
    };
    state.player.inventory = ['item-condition-plate'];
    state.rooms = { 'room-endless-selvedge': { inventory: [] } };
    state.progress = [
      {
        worldId: 'world-wjec-gcse-computer-science-2025-spec',
        areaId: 'area-1-4-programming-constructs',
        visitedRooms: ['room-endless-selvedge'],
        completedTopics: [],
        earnedScore: 0,
        maxScore: 0,
      },
    ];
  });

  const activation = await command(page, 'look');
  expectNoActivation(activation);
  const activeState = await savedState(page);
  expect(activeState.puzzles[SELVEDGE_PUZZLE]?.phase).toBe('active');

  const solved = await command(page, 'put condition plate in exit frame');
  expect(solved).toContain('> put condition plate in exit frame');
  expect(solved).toContain('You put it down.');
  expect(solved).toContain('Topic completed: Programming constructs.');
  expect(solved.join('\n')).toContain(
    'The until plate goes up on the exit gate',
  );
  expect(
    solved.filter((line) => /earned \d+ points\./iu.test(line)),
  ).toHaveLength(1);
  expectNoActivation(solved);

  const solvedState = await savedState(page);
  expect(solvedState.puzzles[SELVEDGE_PUZZLE]?.phase).toBe('solved');
  expect(solvedState.flags['condition-plate-set']).toBe(true);
  await expect(page.locator('.score-panel')).toContainText('Score: 1');
  expectNoActivation(await transcript(page));
  expect(errors()).toEqual([]);
});

test('ENG28-ACTIVATION-01 — no activation notice while a quiz is in progress', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await continueFromCraftedSave(page, (state) => {
    state.flags['card-condition-given'] = true;
  });

  await command(page, 'ask ai about why here');
  await command(page, 'east');
  await command(page, 'east');
  await command(page, 'down');
  const questions = await command(page, 'ask foreman about switch to bit');
  expect(questions.join('\n')).toContain('Bore da.');
  expect(questions.some((line) => /^\d+\. /u.test(line))).toBe(true);
  expectNoActivation(questions);

  for (let index = 0; index < 3; index += 1) {
    const answer = await command(page, 'answer 1');
    expect(answer).toContain('> answer 1');
    expect(answer.length).toBeGreaterThan(1);
    expectNoActivation(answer);
  }
  const afterQuiz = await command(page, 'look');
  expect(afterQuiz).toContain('> look');
  expectNoActivation(afterQuiz);

  const fullTranscript = await transcript(page);
  expect(fullTranscript.join('\n')).toContain(
    'Topic completed: Switch to bit.',
  );
  expectNoActivation(fullTranscript);
  expect(errors()).toEqual([]);
});
