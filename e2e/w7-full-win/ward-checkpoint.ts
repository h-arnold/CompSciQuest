// Shared command/assertion seam and the mandatory Assistance Ward checkpoint
// for the complete V4 win. The seam is used by both the opening and main
// scripts; the ward prelude owns its route, quiz and calibration beats here.
// Every command is ordinary and no state is seeded.
import { expect, type Page } from 'playwright/test';
import { expectHazardOutcome } from '../w7-hazard-assertions';
import {
  command,
  envelope,
  joined,
  playQuiz,
  type QuizObservation,
  type SavedState,
} from '../w7-full-win-trace';

export interface StepObservation {
  readonly lines: readonly string[];
  readonly state: SavedState;
}

export interface StepOptions {
  readonly flags?: readonly string[];
  readonly puzzles?: readonly string[];
  readonly solvedPuzzles?: readonly string[];
  readonly item?: string;
  readonly owner?: readonly [string, readonly string[]];
  readonly singleOwner?: string;
  readonly position?: readonly [string, number];
  readonly hazard?: string;
  readonly noHazard?: string;
  readonly blocked?: string;
}

export interface WardObservation {
  readonly steps: Readonly<Record<string, StepObservation>>;
  readonly quiz: QuizObservation;
  readonly lines: readonly string[];
  readonly scorePanel: string;
}

export async function savedGame(page: Page): Promise<SavedState> {
  await command(page, 'save');
  const saved = await envelope(page);
  return saved.state;
}

export function ownersOf(state: SavedState, itemId: string): string[] {
  return [
    ...(state.player.inventory.includes(itemId) ? ['player'] : []),
    ...Object.entries(state.rooms)
      .filter(([, room]) => room.inventory.includes(itemId))
      .map(([id]) => id),
    ...Object.entries(state.npcs)
      .filter(([, npc]) => npc.inventory.includes(itemId))
      .map(([id]) => id),
  ];
}

// prettier-ignore
function expectHazardIfRequested(lines: readonly string[], hazard: string | undefined, position: StepOptions['position']): void {
  if (hazard === undefined) return;
  expectHazardOutcome(lines, position === undefined ? { hazard } : { hazard, position });
}

async function assertOutcome(
  lines: readonly string[],
  options: StepOptions,
): Promise<void> {
  const hazard = options.hazard;
  expectHazardIfRequested(lines, hazard, options.position);
  if (options.noHazard !== undefined)
    expect(joined(lines)).not.toContain(options.noHazard);
  if (options.blocked !== undefined)
    expect(joined(lines)).toContain(options.blocked);
  const puzzles = options.puzzles ?? [];
  for (const puzzleId of puzzles) {
    expect(
      lines.some((line) => line.startsWith(`Puzzle ${puzzleId} solved`)),
    ).toBe(false);
    expect(lines.some((line) => line.startsWith('Topic completed: '))).toBe(
      true,
    );
  }
}

async function assertState(page: Page, options: StepOptions): Promise<void> {
  const state = await savedGame(page);
  const flags = options.flags ?? [];
  for (const flag of flags) expect(state.flags[flag]).toBe(true);
  const solved = options.solvedPuzzles ?? [];
  for (const puzzleId of solved)
    expect(state.puzzles[puzzleId]?.phase).toBe('solved');
  const item = options.item;
  if (item !== undefined) expect(state.player.inventory).toContain(item);
  const owner = options.owner;
  if (owner !== undefined)
    expect(ownersOf(state, owner[0])).toEqual([...owner[1]]);
  const single = options.singleOwner;
  if (single !== undefined) {
    const owners = ownersOf(state, single);
    expect(owners).toHaveLength(1);
    expect(owners[0]).not.toBe('player');
  }
  const position = options.position;
  if (position === undefined || options.hazard !== undefined) return;
  expect(state.player.position.roomId).toBe(position[0]);
  expect(state.player.lives).toBe(position[1]);
}

// The single command seam: submit, observe added transcript, then a read-only
// `save` snapshot. Options assert flags, owners, items, lives and hazards.
export async function runStep(
  page: Page,
  raw: string,
  options: StepOptions,
): Promise<StepObservation> {
  const lines = await command(page, raw);
  await assertOutcome(lines, options);
  await assertState(page, options);
  return { lines, state: await savedGame(page) };
}

type WardItem = readonly [label: string, raw: string, options?: StepOptions];

// The accepted V4 Assistance Ward route (walkthrough.md §2, C2.1–C2.7).
// prettier-ignore
const WARD_ROUTE: readonly WardItem[] = [
  ['ward-intake','south',{position:['room-assistance-intake',3]}],
  ['ward-nia','ask nia about observation card',{flags:['nia-observation-recovered']}],
  ['ward-demonstration','east',{position:['room-assistance-demonstration',3]}],
  ['ward-take-key','take practice key',{item:'item-assistance-practice-key'}],
  ['ward-unlock','unlock practice key with practice cabinet'],
  ['ward-open','open practice cabinet'],
  ['ward-take-block','take practice block',{item:'item-assistance-practice-block'}],
  ['ward-put-block','put practice block in practice cabinet'],
  ['ward-bell','use practice bell'],
  ['ward-mateo','ask mateo about instruction card',{flags:['mateo-reading-recovered']}],
  ['ward-kofi','ask kofi about practice crank',{flags:['kofi-operation-recovered']}],
  ['ward-records','north',{position:['room-assistance-records',3]}],
  ['ward-priya-card','ask priya about audit card'],
  ['ward-priya-choice','ask priya checked'],
  ['ward-priya-reason','tell priya what I checked and what it showed',{flags:['priya-reasoning-recovered']}],
];

function expectWardOnboarding(
  steps: Readonly<Record<string, StepObservation>>,
  scorePanel: string,
): void {
  // Onboarding costs no life, no points and fires no hazard at any beat.
  for (const step of Object.values(steps)) {
    expect(step.state.player.lives).toBe(3);
    for (const row of step.state.progress) expect(row.earnedScore).toBe(0);
    expect(joined(step.lines)).not.toContain('Hazard ');
  }
  expect(scorePanel).toContain('Score: 0');
  expect(scorePanel).toContain('Lives: 3');
  expect(steps['ward-dial']?.state.flags['tutorial-complete']).toBe(true);
}

// The hub's east socket is gated on tutorial-complete, so the checkpoint is
// earned in the world before that first east.
export async function playWardCheckpoint(
  page: Page,
  quizzesPlayed: QuizObservation[],
): Promise<WardObservation> {
  const steps: Record<string, StepObservation> = {};
  const lines: string[] = [];
  const run = async (label: string, raw: string, options: StepOptions) => {
    const observation = await runStep(page, raw, options);
    steps[label] = observation;
    lines.push(...observation.lines);
  };

  for (const [label, raw, options] of WARD_ROUTE)
    await run(label, raw, options ?? {});

  const quiz = await playQuiz(
    page,
    'ask ai about orientation',
    'quiz-assistance-orientation',
  );
  quizzesPlayed.push(quiz);
  lines.push(...quiz.lines);
  steps['ward-quiz'] = { lines: quiz.lines, state: await savedGame(page) };

  await run('ward-dial', 'use assistance dial', {
    flags: ['assistance-dial-calibrated', 'tutorial-complete'],
    puzzles: ['puzzle-calibrate-assistance'],
    solvedPuzzles: ['puzzle-calibrate-assistance'],
    position: ['room-assistance-records', 3],
  });
  const scorePanel = (await page.locator('.score-panel').textContent()) ?? '';
  await run('ward-hub-return', 'west', {
    position: ['room-network-hub', 3],
  });

  expectWardOnboarding(steps, scorePanel);
  return { steps, quiz, lines, scorePanel };
}
