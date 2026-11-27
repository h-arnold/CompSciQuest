// Browser coverage for WR4-C1-FIX-01..05 (out-of-room GIVE/SHOW feedback).
// Every command is driven through the real Command box; no event seam, injected
// handler, invented content ID or stub wording is used. Authority:
// .opencode/scratchpad/branch-matrix.md WR4-C1-FIX-*, application-and-ui.md §5,
// npcs.md §4 and the generated authored bundles. The restored hint strip after
// Continue (round 5 line 98) is out of scope and is not asserted here.
import { expect, test, type Page } from 'playwright/test';
import { items } from '../src/content/authored/items';
import { questions } from '../src/content/authored/questions';
import { quizzes } from '../src/content/authored/quizzes';
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

const ABSENCE = 'You cannot see that here.';
const UNKNOWN = "I don't understand that.";
const NOT_CARRIED = 'You do not have that.';
const HANDOVER = 'You hand the practice key to mateo.';
const KEY = 'item-assistance-practice-key';
const MATEO = 'npc-mateo';
const CABINET = 'item-assistance-practice-cabinet';
const BLOCK = 'item-assistance-practice-block';
const DEMONSTRATION = 'room-assistance-demonstration';
const QUIZ_ID = 'quiz-assistance-orientation';
const PLACEMENT = 'You put the practice block in the practice cabinet.';
const RETRIEVAL = 'You take the practice block from the practice cabinet.';
const UNLOCK_FLAG = `container-unlocked:${CABINET}`;
const OPEN_FLAG = `container-open:${CABINET}`;

// Reuse the accepted live-save pattern: all four authored recovery records are
// present, while every authored inventory, NPC and quiz record stays intact.
const RECOVERY_FLAGS = {
  'nia-observation-recovered': true,
  'mateo-reading-recovered': true,
  'priya-reasoning-recovered': true,
  'kofi-operation-recovered': true,
} as const;

interface QuizState {
  readonly activeQuizId?: string;
  readonly questionIds: readonly string[];
  readonly index: number;
  readonly correctCount: number;
  readonly answers: readonly number[];
}

interface SaveState {
  readonly turn: number;
  readonly status: string;
  readonly rngSeed?: number;
  readonly player: {
    readonly position: {
      readonly worldId: string;
      readonly areaId: string;
      readonly roomId: string;
    };
    readonly inventory: readonly string[];
    readonly lives: number;
  };
  readonly rooms: Record<string, { readonly inventory: readonly string[] }>;
  readonly npcs: Record<
    string,
    {
      readonly stateId: string;
      readonly knownTopics: readonly string[];
      readonly inventory: readonly string[];
      readonly topicUses: Record<string, number>;
    }
  >;
  readonly flags: Record<string, boolean>;
  readonly progress: readonly {
    readonly earnedScore: number;
    readonly completedTopics: readonly string[];
  }[];
  readonly quiz: QuizState;
}

interface SaveShape {
  readonly version: number;
  readonly savedAt: string;
  readonly state: SaveState;
}

type AuthoredQuestion = (typeof questions)[number];

async function persisted(page: Page): Promise<SaveShape> {
  await submit(page, 'save');
  await expect.poll(() => readStorage(page, SAVE_KEY)).not.toBeNull();
  const raw = await readStorage(page, SAVE_KEY);
  if (raw === null) throw new Error('Save command did not write storage');
  return JSON.parse(raw) as SaveShape;
}

// Every gameplay command advances the turn counter (and quiz shuffling may
// advance the RNG seed); invalid attempts must leave every other saved field
// alone, including one-owner inventories and NPC topic uses.
function gameplay(state: SaveState): Record<string, unknown> {
  const copy: Record<string, unknown> = { ...state };
  delete copy['turn'];
  delete copy['rngSeed'];
  return copy;
}

function owners(save: SaveShape, itemId: string): readonly string[] {
  const found: string[] = [];
  if (save.state.player.inventory.includes(itemId)) found.push('player');
  for (const [id, room] of Object.entries(save.state.rooms)) {
    if (room.inventory.includes(itemId)) found.push(id);
  }
  for (const [id, npc] of Object.entries(save.state.npcs)) {
    if (npc.inventory.includes(itemId)) found.push(id);
  }
  return found;
}

function scores(save: SaveShape): readonly number[] {
  return save.state.progress.map((row) => row.earnedScore);
}

// Visiting a new area adds a progress row, so assert every earned score is zero
// instead of pinning the number of rows.
function expectZeroScores(save: SaveShape): void {
  const values = scores(save);
  expect(values.length).toBeGreaterThan(0);
  expect(values.every((value) => value === 0)).toBe(true);
}

// The echo is a transcript line too: compare the lines after this command's
// echo so the count of canonical feedback lines is exact for this turn only.
async function newTurnLines(
  page: Page,
  raw: string,
): Promise<readonly string[]> {
  const lines = await transcript(page);
  const at = lines.lastIndexOf(`> ${raw}`);
  expect(at, `echo for ${raw}`).toBeGreaterThanOrEqual(0);
  return lines.slice(at + 1);
}

async function walkTo(
  page: Page,
  steps: readonly (readonly [string, string])[],
): Promise<void> {
  for (const [command, title] of steps) {
    await submit(page, command);
    await waitForLine(page, title);
  }
}

async function startInHub(page: Page): Promise<void> {
  await startNewGame(page);
  await walkTo(page, [['east', 'The Network Hub']]);
}

async function toDemonstration(page: Page): Promise<void> {
  await walkTo(page, [
    ['south', 'Intake Bay'],
    ['east', 'Demonstration Ward'],
  ]);
}

function authoredQuiz() {
  const quiz = quizzes.find((entry) => entry.id === QUIZ_ID);
  if (quiz === undefined) throw new Error(`No authored quiz ${QUIZ_ID}`);
  return quiz;
}

function authoredQuestion(id: string): AuthoredQuestion {
  const question = questions.find((entry) => entry.id === id);
  if (question === undefined) throw new Error(`No authored question ${id}`);
  return question;
}

function currentQuestion(state: QuizState): AuthoredQuestion {
  const id = state.questionIds[state.index];
  if (id === undefined) throw new Error('No current quiz question');
  return authoredQuestion(id);
}

function correctIndex(question: AuthoredQuestion): number {
  const index = question.correctOptionIds[0];
  if (index === undefined) throw new Error('Question has no correct option');
  return index;
}

function wrongIndex(question: AuthoredQuestion): number {
  const index = question.options.findIndex(
    (_option, position) => position !== correctIndex(question),
  );
  if (index === -1) throw new Error('Question has no wrong option');
  return index;
}

function authoredMessage(
  effects: readonly { readonly kind: string; readonly text?: string }[],
): string {
  const message = effects.find((effect) => effect.kind === 'message');
  if (message?.text === undefined)
    throw new Error('No authored message effect');
  return message.text;
}

function authoredDialText(): {
  readonly blocked: string;
  readonly success: string;
} {
  const useText = items.find(
    (item) => item.id === 'item-assistance-calibration-dial',
  )?.useText;
  if (useText === undefined || useText.blocked === undefined)
    throw new Error('No authored calibration dial useText');
  return { blocked: useText.blocked, success: useText.success };
}

const DIAL_TEXT = authoredDialText();

async function quizState(page: Page): Promise<QuizState> {
  const save = await persisted(page);
  return save.state.quiz;
}

async function startQuiz(page: Page): Promise<void> {
  await submit(page, 'ask ai about orientation');
  await expect(page.locator('.quiz-panel')).toBeVisible();
  const state = await quizState(page);
  expect(state.activeQuizId).toBe(QUIZ_ID);
}

// Quiz questions are shuffled per attempt, so always read the current question
// from the save written by the running engine rather than assuming an order.
async function answerAttempt(page: Page, mode: 'fail' | 'pass'): Promise<void> {
  for (let step = 0; step < authoredQuiz().questionIds.length; step += 1) {
    const state = await quizState(page);
    if (state.activeQuizId === undefined) break;
    const question = currentQuestion(state);
    const index =
      mode === 'fail' && step < 2
        ? wrongIndex(question)
        : correctIndex(question);
    let raw = `answer ${index + 1}`;
    if (mode === 'pass' && step === 1) {
      raw = String(index + 1); // bare N
    } else if (mode === 'pass' && step === 2) {
      raw = question.options[index] ?? raw; // displayed option verbatim
    }
    await submit(page, raw);
    await waitForLine(page, `> ${raw}`);
    // The first two answers of a failing attempt are wrong; all later ones
    // (and every answer of a passing attempt) are correct. §6.1 prefixes the
    // verbatim explanation with the canonical verdict.
    const verdict = mode === 'fail' && step < 2 ? 'Incorrect. ' : 'Correct. ';
    expect(await transcript(page)).toContain(
      `${verdict}${question.explanation}`,
    );
  }
}

test.beforeEach(async ({ page }) => {
  await seedStorage(page);
});

test('WR4-C1-FIX-01 — out-of-room GIVE gives one absence line and no state delta', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await startInHub(page);
  const before = await persisted(page);

  const raw = 'give mateo practice key';
  await submit(page, raw);
  expect(await newTurnLines(page, raw)).toEqual([ABSENCE]);

  const after = await persisted(page);
  expect(gameplay(after.state)).toEqual(gameplay(before.state));
  expect(owners(after, KEY)).toEqual(owners(before, KEY));
  expect(after.state.player.position.roomId).toBe('room-network-hub');
  expect(after.state.player.lives).toBe(3);
  expectZeroScores(after);
  expect(errors()).toEqual([]);
});

test('WR4-C1-FIX-02 — out-of-room SHOW shares the line with no transfer', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await startInHub(page);
  const before = await persisted(page);

  const raw = 'show mateo practice key';
  await submit(page, raw);
  expect(await newTurnLines(page, raw)).toEqual([ABSENCE]);

  const after = await persisted(page);
  expect(gameplay(after.state)).toEqual(gameplay(before.state));
  expect(owners(after, KEY)).toEqual(owners(before, KEY));
  expect(after.state.npcs[MATEO]?.inventory).toEqual([]);
  expect(errors()).toEqual([]);
});

test('WR4-C1-FIX-03 — out-of-room ASK still gives one absence line, no lesson or topic use', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await startInHub(page);
  // Enter the conversation first so the canonical start line is not part of
  // the measured turn; out-of-room ask itself must add only the absence line.
  await submit(page, 'talk to mateo');
  await expect(page.locator('.conversation-panel')).toContainText(
    'Talking with Mateo.',
  );
  const before = await persisted(page);

  const raw = 'ask mateo about instruction card';
  await submit(page, raw);
  expect(await newTurnLines(page, raw)).toEqual([ABSENCE]);

  const after = await persisted(page);
  expect(gameplay(after.state)).toEqual(gameplay(before.state));
  expect(after.state.npcs[MATEO]?.topicUses).toEqual({});
  expect(after.state.flags['mateo-reading-recovered']).toBeUndefined();
  expect(errors()).toEqual([]);
});

test('WR4-C1-FIX-04 — in-room carried GIVE transfers once and announces the hand-over', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await startInHub(page);
  await toDemonstration(page);
  await submit(page, 'take practice key');
  await waitForLine(page, 'Taken.');
  const before = await persisted(page);
  expect(owners(before, KEY)).toEqual(['player']);

  const raw = 'give mateo practice key';
  await submit(page, raw);
  const lines = await newTurnLines(page, raw);
  expect(lines.filter((line) => line === HANDOVER)).toEqual([HANDOVER]);
  expect(lines).not.toContain(ABSENCE);
  expect(lines).not.toContain(UNKNOWN);

  const after = await persisted(page);
  expect(owners(after, KEY)).toEqual([MATEO]);
  expect(after.state.npcs[MATEO]?.inventory).toEqual([KEY]);
  expect(after.state.player.inventory).not.toContain(KEY);
  expect(after.state.player.lives).toBe(3);
  expectZeroScores(after);
  expect(errors()).toEqual([]);
});

test('WR4-C1-FIX-04 — in-room visible but uncarried GIVE keeps the friendly refusal', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await startInHub(page);
  await toDemonstration(page);
  const before = await persisted(page);
  expect(owners(before, KEY)).toEqual([DEMONSTRATION]);

  const raw = 'give mateo practice key';
  await submit(page, raw);
  expect(await newTurnLines(page, raw)).toEqual([NOT_CARRIED]);

  const after = await persisted(page);
  expect(gameplay(after.state)).toEqual(gameplay(before.state));
  expect(owners(after, KEY)).toEqual([DEMONSTRATION]);
  expect(errors()).toEqual([]);
});

test('WR4-C1-FIX-04 — a wholly unknown phrase still uses the fixed unknown line', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await startInHub(page);
  const before = await persisted(page);

  const raw = 'flibbertigibbet wobble';
  await submit(page, raw);
  expect(await newTurnLines(page, raw)).toEqual([UNKNOWN]);

  const after = await persisted(page);
  expect(gameplay(after.state)).toEqual(gameplay(before.state));
  expect(errors()).toEqual([]);
});

async function checkWardMechanics(
  page: Page,
  unlockCommand: string,
): Promise<void> {
  await startInHub(page);
  for (const raw of ['give mateo practice key', 'show mateo practice key']) {
    await submit(page, raw);
    expect(await newTurnLines(page, raw)).toEqual([ABSENCE]);
  }
  await toDemonstration(page);

  await submit(page, 'use practice bell');
  const bellLines = await newTurnLines(page, 'use practice bell');
  expect(bellLines.at(-1)).toContain('HARMLESS PRACTICE');

  await submit(page, 'take practice key');
  await waitForLine(page, 'Taken.');
  await submit(page, unlockCommand);
  expect(await newTurnLines(page, unlockCommand)).toEqual(['You unlock it.']);
  await submit(page, 'open practice cabinet');
  expect(await newTurnLines(page, 'open practice cabinet')).toEqual([
    'You open it.',
  ]);

  await submit(page, 'take practice block');
  await waitForLine(page, 'Taken.');
  await submit(page, 'put practice block in practice cabinet');
  expect(
    await newTurnLines(page, 'put practice block in practice cabinet'),
  ).toEqual([PLACEMENT]);
  await submit(page, 'place practice block in practice cabinet');
  expect(
    await newTurnLines(page, 'place practice block in practice cabinet'),
  ).toEqual([PLACEMENT]);
  await submit(page, 'take practice block');
  expect(await newTurnLines(page, 'take practice block')).toEqual([RETRIEVAL]);
  await submit(page, 'close practice cabinet');
  expect(await newTurnLines(page, 'close practice cabinet')).toEqual([
    'You close it.',
  ]);

  const save = await persisted(page);
  expect(owners(save, BLOCK)).toEqual(['player']);
  expect(save.state.flags[UNLOCK_FLAG]).toBe(true);
  // Closing writes the open flag as false; opening earlier in the route set it.
  expect(save.state.flags[OPEN_FLAG]).toBe(false);
  expect(save.state.player.lives).toBe(3);
  expectZeroScores(save);
}

for (const unlockCommand of [
  'unlock practice key with practice cabinet',
  'unlock practice key practice cabinet',
]) {
  test(`WR4-C1-FIX-05 — ward mechanics (${unlockCommand}) keep score 0 and three lives`, async ({
    page,
  }) => {
    const errors = watchConsole(page);
    await checkWardMechanics(page, unlockCommand);
    expect(errors()).toEqual([]);
  });
}

test('WR4-C1-FIX-05 — quiz fail, retry, dial and calibration stay at score 0', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await startFromLiveSave(page, RECOVERY_FLAGS);
  await walkTo(page, [
    ['east', 'The Network Hub'],
    ['south', 'Intake Bay'],
    ['east', 'Demonstration Ward'],
    ['north', 'Records Office'],
  ]);
  const early = await persisted(page);
  expect(early.state.flags['assistance-dial-calibrated']).toBeUndefined();

  const blocked = 'use assistance dial';
  await submit(page, blocked);
  expect(await newTurnLines(page, blocked)).toEqual([DIAL_TEXT.blocked]);

  await startQuiz(page);
  await answerAttempt(page, 'fail');
  await expect(page.locator('.quiz-panel')).toBeHidden();
  const failed = await persisted(page);
  expect(await transcript(page)).toContain(
    authoredMessage(authoredQuiz().onFail),
  );
  expect(failed.state.flags[`quiz-passed:${QUIZ_ID}`]).toBeUndefined();
  expect(failed.state.player.lives).toBe(3);
  expect(failed.state.player.position.roomId).toBe('room-assistance-records');
  expectZeroScores(failed);

  await startQuiz(page); // unlimited retries at score 0
  await answerAttempt(page, 'pass');
  await expect(page.locator('.quiz-panel')).toBeHidden();
  const passed = await persisted(page);
  expect(await transcript(page)).toContain(
    authoredMessage(authoredQuiz().onPass),
  );
  expect(passed.state.flags[`quiz-passed:${QUIZ_ID}`]).toBe(true);
  expect(
    passed.state.progress.some((row) =>
      row.completedTopics.includes('tutorial-mechanics'),
    ),
  ).toBe(true);
  expect(passed.state.player.lives).toBe(3);
  expectZeroScores(passed);

  const raw = 'use assistance dial';
  await submit(page, raw);
  const dialLines = await newTurnLines(page, raw);
  expect(dialLines).toContain(DIAL_TEXT.success);
  expect(dialLines).toContain('Topic completed: Game orientation.');
  expect(dialLines).not.toContain(UNKNOWN);

  const calibrated = await persisted(page);
  expect(calibrated.state.flags['assistance-dial-calibrated']).toBe(true);
  expect(calibrated.state.flags['tutorial-complete']).toBe(true);
  expect(
    calibrated.state.progress.some((row) =>
      row.completedTopics.includes('tutorial-mechanics'),
    ),
  ).toBe(true);
  expect(calibrated.state.player.lives).toBe(3);
  expectZeroScores(calibrated);
  expect(errors()).toEqual([]);
});
