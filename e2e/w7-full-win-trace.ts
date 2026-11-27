// Command driver and authored-catalogue lookups for the complete V4 win path.
// The browser plays only ordinary commands; this file never seeds state. Each
// observation comes from the transcript or a read-only save (`save` command).
import { expect, type Page } from 'playwright/test';
import { questions } from '../src/content/authored/questions';
import { quizzes } from '../src/content/authored/quizzes';
import { specTopics } from '../src/content/authored/spec-topics';
import type { Position } from '../src/types/domain';
import { expectWorkspace } from './helpers';
import { hazardAnnouncement } from './w7-hazard-assertions';
import {
  playWardCheckpoint,
  runStep,
  savedGame,
  type StepObservation,
  type StepOptions,
  type WardObservation,
} from './w7-full-win/ward-checkpoint';

export { ownersOf } from './w7-full-win/ward-checkpoint';

export interface SavedState {
  readonly player: {
    readonly position: Position;
    readonly inventory: readonly string[];
    readonly lives: number;
  };
  readonly status: string;
  readonly turn: number;
  readonly rngSeed: number;
  readonly flags: Readonly<Record<string, boolean>>;
  readonly rooms: Readonly<
    Record<string, { readonly inventory: readonly string[] }>
  >;
  readonly npcs: Readonly<
    Record<
      string,
      {
        readonly inventory: readonly string[];
        readonly knownTopics: readonly string[];
      }
    >
  >;
  readonly puzzles: Readonly<Record<string, { readonly phase: string }>>;
  readonly counters: Readonly<Record<string, number>>;
  readonly progress: readonly {
    readonly worldId: string;
    readonly areaId: string;
    readonly visitedRooms: readonly string[];
    readonly completedTopics: readonly string[];
    readonly earnedScore: number;
    readonly maxScore: number;
  }[];
}

interface SaveEnvelope {
  readonly version: number;
  readonly savedAt: string;
  readonly state: SavedState;
}

export interface GateObservation {
  readonly direction: string;
  readonly before: SavedState;
  readonly after: SavedState;
  readonly added: readonly string[];
}

export interface QuizObservation {
  readonly quizId: string;
  readonly topicId: string;
  readonly requirement: string;
  readonly prompts: readonly string[];
  readonly lines: readonly string[];
}

export interface HintObservation {
  readonly label: string;
  readonly panel: string;
  readonly lines: readonly string[];
}

export interface PostWinObservation {
  readonly gatedLines: readonly string[];
  readonly envelopeBefore: SaveEnvelope;
  readonly envelopeAfter: SaveEnvelope;
  readonly accepted: readonly {
    readonly raw: string;
    readonly lines: readonly string[];
  }[];
  readonly importLines: readonly string[];
  readonly importedEnvelope: SaveEnvelope;
  readonly importedScore: string;
  readonly reloadedLines: readonly string[];
  readonly reloadedScore: string;
}

export interface FullWinRecord {
  readonly arrivalLines: readonly string[];
  readonly arrivalScorePanel: string;
  readonly boot: SavedState;
  readonly steps: Readonly<Record<string, StepObservation>>;
  readonly ward: WardObservation;
  readonly gates: readonly GateObservation[];
  readonly quizzes: readonly QuizObservation[];
  readonly hints: readonly HintObservation[];
  readonly milestoneLines: readonly string[];
  readonly milestone: StepObservation;
  readonly areaChanges: readonly StepObservation[];
  readonly dyePad: StepObservation;
  readonly final: SavedState;
  readonly envelope: SaveEnvelope;
  readonly finalLines: readonly string[];
  readonly finalScorePanel: string;
  readonly bootQuarantine: string | null;
  readonly finalQuarantine: string | null;
  readonly postWin: PostWinObservation;
}

type AuthoredQuiz = (typeof quizzes)[number];
type AuthoredQuestion = (typeof questions)[number];

export function authoredQuiz(quizId: string): AuthoredQuiz {
  const quiz = quizzes.find((entry) => entry.id === quizId);
  if (quiz === undefined)
    throw new Error(`Authored quiz '${quizId}' is missing`);
  return quiz;
}

export function authoredQuestion(questionId: string): AuthoredQuestion {
  const question = questions.find((entry) => entry.id === questionId);
  if (question === undefined)
    throw new Error(`Authored question '${questionId}' is missing`);
  return question;
}

export function authoredTopicTitle(topicId: string): string {
  const topic = specTopics.find((entry) => entry.id === topicId);
  if (topic === undefined)
    throw new Error(`Authored spec topic '${topicId}' is missing`);
  return topic.title;
}

export function joined(lines: readonly string[]): string {
  return lines.join('\n');
}

export async function envelope(page: Page): Promise<SaveEnvelope> {
  const raw = await page.evaluate(
    (key) => localStorage.getItem(key),
    'compsciquest:save:v1',
  );
  if (raw === null) throw new Error('Save was not written');
  return JSON.parse(raw) as SaveEnvelope;
}

export async function command(page: Page, raw: string): Promise<string[]> {
  const before = await page.locator('.output-log > div').count();
  await page.getByRole('textbox', { name: 'Command' }).fill(raw);
  await page.getByRole('textbox', { name: 'Command' }).press('Enter');
  await page.waitForFunction(
    ({ text, count }) =>
      [...document.querySelectorAll('.output-log > div')]
        .slice(count)
        .some((line) => line.textContent === `> ${text}`),
    { text: raw, count: before },
  );
  const contents = await page.locator('.output-log > div').allTextContents();
  return contents.slice(before);
}

function numberedOptions(lines: readonly string[]): readonly string[] {
  return lines.map((line) => {
    const match = /^\d+\. (.+)$/u.exec(line.trim());
    if (match?.[1] === undefined)
      throw new Error(`Not a numbered option: ${line}`);
    return match[1];
  });
}

// A quiz is driven by its displayed prompt, never by a seeded answer. The
// authored correct option index is read from the generated question catalogue.
export async function playQuiz(
  page: Page,
  raw: string,
  quizId: string,
): Promise<QuizObservation> {
  const quiz = authoredQuiz(quizId);
  const lines = [...(await command(page, raw))];
  await expect(page.locator('.quiz-panel')).toBeVisible();
  const requirement = await page
    .locator('.quiz-panel > p[aria-live="polite"]')
    .textContent();
  expect(requirement).toBe(
    `Pass mark: ${quiz.passMark} correct of ${quiz.questionIds.length}. Wrong answers allowed: ${quiz.questionIds.length - quiz.passMark}.`,
  );
  const panel = page.locator('.quiz-panel');
  expect(
    await page
      .locator('.quiz-panel > p[aria-live="polite"]')
      .locator('*')
      .count(),
  ).toBe(0);
  expect(
    await panel.locator('button, a, input, select, textarea').count(),
  ).toBe(0);
  const prompts: string[] = [];
  for (let index = 0; index < quiz.questionIds.length; index += 1) {
    // Options stay on the div channel; the prompt is the first direct
    // paragraph and the requirement is a separate polite live region.
    const promptLine = await page
      .locator('.quiz-panel > p')
      .first()
      .textContent();
    const prompt = (promptLine ?? '').replace(/^Question \d+ of \d+: /u, '');
    const panelLines = await page
      .locator('.quiz-panel > div')
      .allTextContents();
    // Question order is randomised by the game RNG: resolve by displayed
    // prompt against this quiz's authored entries, never by catalogue index.
    const question = quiz.questionIds
      .map((id) => authoredQuestion(id))
      .find((entry) => entry.prompt === prompt);
    if (question === undefined)
      throw new Error(`No authored question for prompt: ${prompt}`);
    expect(numberedOptions(panelLines)).toEqual(question.options);
    prompts.push(prompt);
    const correct = question.correctOptionIds[0];
    if (correct === undefined)
      throw new Error(`No correct option for ${prompt}`);
    lines.push(...(await command(page, `answer ${correct + 1}`)));
  }
  await expect(panel).toBeHidden();
  const state = await savedGame(page);
  expect(state.flags[`quiz-passed:${quizId}`]).toBe(true);
  const feedback = lines.filter(
    (line) => line.startsWith('Correct.') || line.startsWith('Incorrect.'),
  );
  expect(feedback).toHaveLength(quiz.questionIds.length);
  expect(feedback.every((line) => line.startsWith('Correct.'))).toBe(true);
  expect(lines).toContain(
    `Topic completed: ${authoredTopicTitle(quiz.topicId)}.`,
  );
  return {
    quizId,
    topicId: quiz.topicId,
    requirement: requirement ?? '',
    prompts,
    lines,
  };
}

type ScriptItem = readonly [label: string, raw: string, options?: StepOptions];
const quiz = (quizId: string, raw: string): ScriptItem => [
  `quiz:${quizId}`,
  raw,
];

// The canonical command order from tests/turn/AuthoredWinPath.test.ts. Extra
// entries are ordinary commands only: six closed-gate probes, the interface
// detour, scoped AI follow-ups, the feasible hint ladder and end-state probes.
// No state is injected at any point.
// prettier-ignore
const OPENING: readonly ScriptItem[] = [
  ['verdict','ask ai about verdict'], ['why','ask ai about why here'],
  ['failure','ask ai about failure'], ['hub','east',{position:['room-network-hub',3]}],
  ['escape','ask ai about escape'], ['why-hub','ask ai about why here'],
  ['failure-hub','ask ai about failure'], ['interface-in','in',{position:['room-entry-interface',3]}],
  ['interface-out','out',{position:['room-network-hub',3]}],
  ['overheat','east',{hazard:'hazard-switch-overheat',position:['room-binary-hall',2]}],
];

// prettier-ignore
const MAIN: readonly ScriptItem[] = [
  ['safe-switch-floor','down',{position:['room-switch-floor',2],noHazard:'hazard-switch-overheat'}],
  ['take-gauge','take switch gauge',{item:'item-switch-gauge'}],
  ['belt','use switch gauge on belt',{flags:['switch-cooled','switches-set'],puzzles:['puzzle-set-the-switches']}],
  quiz('quiz-switchyard','ask foreman about switches'), quiz('quiz-data-types','ask foreman about lift'),
  ['up-to-hall','up',{position:['room-binary-hall',2]}], ['take-sample','take decimal sample',{item:'item-decimal-sample'}],
  ['sort-types','put decimal sample on real bin',{flags:['types-sorted'],puzzles:['puzzle-sort-the-data-types'],singleOwner:'item-decimal-sample'}],
  ['overflow','north',{hazard:'hazard-carry-overflow',position:['room-binary-hall',1]}],
  ['safe-hex-deck','north',{position:['room-hex-deck',1],noHazard:'hazard-carry-overflow'}],
  ['take-card','take nibble card',{item:'item-hex-nibble-card'}],
  ['lamp','use nibble card on carry lamp',{flags:['carry-cleared']}],
  ['nibbles','use nibble card on nibble groups',{flags:['hex-read'],puzzles:['puzzle-read-nibbles']}],
  ['clerk-bases','ask clerk about bases'], ['clerk-carries','ask clerk about carries',{flags:['clerk-carry-heard']}],
  ['clerk-back','ask clerk about the back'],
  ['carries','use carry token on rightmost column',{flags:['carries-added'],puzzles:['puzzle-add-with-carries']}],
  ['shift','use shift lever on row',{flags:['row-shifted'],puzzles:['puzzle-shift-the-row']}],
  ['show-gauge','show foreman switch gauge',{flags:['overflow-checked'],puzzles:['puzzle-check-the-overflow-register'],owner:['item-switch-gauge',['npc-the-foreman']]}],
  quiz('quiz-number-systems','ask clerk about shifts'), ['to-tiles','south'],
  ['tiles-room','east',{position:['room-character-tiles',1]}], ['take-stamp','take ascii stamp',{item:'item-ascii-stamp'}],
  ['examine-tiles','examine tiles',{flags:['tiles-verified']}],
  ['match-tiles','use ascii stamp on tiles',{flags:['characters-matched'],puzzles:['puzzle-match-characters'],noHazard:'hazard-glyph-corruption'}],
  ['setter-ascii','ask typesetter about ascii'],
  quiz('quiz-character-representation','ask typesetter about unicode'),
  ['to-mosaic','west'], ['mosaic-room','south',{position:['room-picture-mosaic',1]}],
  ['take-lens','take pixel lens',{item:'item-pixel-lens'}],
  ['mosaic','use pixel lens on mosaic',{flags:['picture-built'],puzzles:['puzzle-build-mosaic']}],
  ['pixels','use pixel lens on nibble card',{flags:['pixels-weighed'],puzzles:['puzzle-weigh-the-pixels']}],
  ['show-lens','show foreman pixel lens',{flags:['badge-scaled'],puzzles:['puzzle-scale-the-badge'],owner:['item-pixel-lens',['npc-the-foreman']]}],
  ['critic-vectors','ask critic about vectors'], ['critic-depth','ask critic about depth',{flags:['critic-depth-heard']}],
  quiz('quiz-graphics-representation','ask critic about storage'),
  ['to-choir','north'], ['choir-room','up',{position:['room-sound-choir',1]}],
  ['take-fork','take sample fork',{item:'item-sample-fork'}],
  ['bit-rate','use sample fork on bit-rate desk',{flags:['sound-sampled'],puzzles:['puzzle-tune-sampling']}],
  ['samples','ask choirmaster about samples'], ['conductor-depth','ask choirmaster about depth',{flags:['conductor-depth-heard']}],
  ['to-stacks','down'], ['stacks-room','in',{position:['room-storage-stacks',1],noHazard:'hazard-bit-rot'}],
  ['stack-bytes','use sample fork on unit ladder',{flags:['stacks-sorted'],puzzles:['puzzle-stack-the-bytes']}],
  ['show-fork','show foreman sample fork',{flags:['bit-rate-counted'],puzzles:['puzzle-count-the-bit-rate'],owner:['item-sample-fork',['npc-the-foreman']]}],
  quiz('quiz-sound-representation','ask choirmaster about storage'),
  ['show-nibble','show foreman nibble card',{flags:['capacity-labelled'],puzzles:['puzzle-label-the-capacity'],owner:['item-hex-nibble-card',['npc-the-foreman']]}],
  ['keeper-units','ask keeper about units'], quiz('quiz-storage-units','ask keeper about capacity'),
  ['out-press','out'], ['press-room','out',{position:['room-compression-press',1]}],
  ['take-die','take compression die',{item:'item-compression-die'}], ['lossy','ask operator about lossy'],
  ['archive','use compression die',{flags:['archive-packed'],puzzles:['puzzle-pack-the-archive']}],
  ['compression','use compression die on ascii stamp',{flags:['compression-chosen'],puzzles:['puzzle-choose-the-compression']}],
  quiz('quiz-data-compression','ask operator about ratio'),
  ['milestone','save'],
  ['hall-return','in',{position:['room-binary-hall',1]}], ['hub-return','west',{position:['room-network-hub',3]}],
  ['concourse','north',{position:['room-1-4-concourse',3]}], ['bureau','east',{position:['room-pattern-bureau',3]}],
  ['bureau-gate','east',{blocked:'That way is closed for now.',position:['room-pattern-bureau',3]}],
  ['welcome','ask loomwright about hello'], ['pseudocode','ask loomwright about pseudocode'],
  ['shapes','ask loomwright about shapes'], quiz('quiz-pattern-bureau','ask loomwright about demonstration'),
  ['warp-walk','east',{position:['room-warp-walk',3]}],
  ['rail-closed','east',{blocked:'That way is closed for now.',position:['room-warp-walk',3]}],
  ['threading-room','north',{position:['room-threading-order',3]}],
  ['constructs-dresser','ask warp dresser about constructs'], ['order','ask warp dresser about order'],
  quiz('quiz-threading-order','ask warp dresser about demonstration'),
  ['give-sequence','give warp dresser sequence card',{flags:['card-sequence-given'],owner:['item-pattern-card-sequence',['npc-the-warp-dresser']]}],
  ['hint-turn-one','look'], ['hint-turn-two','inventory'], ['hint-turn-three','examine shade cards'],
  ['hint:threading-order','hint'], ['hint:cooldown','hint'],
  ['dress-warp','put shade cards on step hangers',{flags:['dressing-re-ordered','threading-ordered'],solvedPuzzles:['puzzle-dress-the-warp']}],
  ['take-else','take else plate',{item:'item-else-plate'}],
  ['window-approach','south'], ['bobbin-window','out',{position:['room-bobbin-window',3]}],
  ['take-shed','take shed plate',{item:'item-shed-plate'}],
  ['addressing','use addressing plate',{flags:['addressing-plate-re-lettered']}],
  ['into-counter','in'], ['dye-pad','south',{hazard:'hazard-dye-pad',position:['room-pattern-bureau',2]}],
  ['back-to-weft','east'], ['weft-counter','south',{position:['room-weft-counter',2],noHazard:'hazard-dye-pad'}],
  ['tally-constructs','ask weft tally about constructs'],
  ['pad-checked','ask weft tally about dye pad',{flags:['pad-checked']}],
  ['ratchet-heard','ask weft tally about constructs',{flags:['weft-ratchet-heard']}],
  ['prediction','ask weft tally about ratchet',{flags:['pass-count-predicted']}],
  quiz('quiz-weft-tally','ask weft tally about demonstration'),
  ['give-count','give weft tally count card',{flags:['card-count-given'],owner:['item-pattern-card-count-iteration',['npc-the-weft-tally']]}],
  ['pry-tooth','use slip tooth on counting ratchet',{flags:['slip-tooth-pried']}],
  ['seat-ratchet','use counting ratchet',{flags:['counting-ratchet-reseated','weft-counted'],solvedPuzzles:['puzzle-seat-the-ratchet']}],
  ['take-wire','take bell wire',{item:'item-bell-wire'}],
  ['window-return','north'], ['bell-room','out',{position:['room-bobbin-window',2]}],
  ['bell-seated','use bell wire on intake bell',{flags:['bell-wire-seated','bell-mended'],solvedPuzzles:['puzzle-mend-the-bell']}],
  ['court-approach','in'], ['colour-court','in',{position:['room-colour-court',2]}],
  ['constructs-court','ask shed opener about constructs'], ['selection','ask shed opener about shed'],
  quiz('quiz-colour-court','ask shed opener about demonstration'),
  ['give-selection','give shed opener selection card',{flags:['card-selection-given'],owner:['item-pattern-card-selection',['npc-the-shed-opener']]}],
  ['shed-plate','put shed plate in plate frame',{flags:['shed-plate-returned']}],
  ['else-plate','put else plate in plate frame',{flags:['else-plate-restored']}],
  ['pick-trolley','use pick trolley',{flags:['tray-routed-by-condition','colours-lifted'],solvedPuzzles:['puzzle-lift-the-shed']}],
  ['selvedge-approach','out'], ['selvedge-room','down',{position:['room-endless-selvedge',2]}],
  ['constructs-warden','ask selvedge warden about constructs'], ['until-beat','ask selvedge warden about next'],
  quiz('quiz-selvedge','ask selvedge warden about demonstration'),
  ['give-condition','give selvedge warden condition card',{flags:['card-condition-given'],owner:['item-pattern-card-condition-iteration',['npc-the-selvedge-warden']]}],
  ['until-plate','put until plate on exit frame',{flags:['until-clause-restored','condition-plate-set'],solvedPuzzles:['puzzle-close-the-selvedge']}],
  ['rogue-thread','put rogue thread in counterfoil drawer',{flags:['rogue-thread-in-drawer','rogue-thread-filed'],solvedPuzzles:['puzzle-file-the-rogue-thread'],singleOwner:'item-rogue-thread'}],
  ['rail-approach','up',{position:['room-warp-walk',2]}], ['rail-open','east',{position:['room-finished-rail',2]}],
  quiz('quiz-finished-rail','ask loomwright about audit'),
];

async function runOpening(
  page: Page,
  steps: Record<string, StepObservation>,
  quizzesPlayed: QuizObservation[],
): Promise<WardObservation> {
  let ward: WardObservation | undefined;
  for (const [label, raw, options] of OPENING) {
    const observation = await runStep(page, raw, options ?? {});
    steps[label] = observation;
    if (label === 'interface-out')
      ward = await playWardCheckpoint(page, quizzesPlayed);
    if (label !== 'overheat') continue;
    const announcement = hazardAnnouncement('hazard-switch-overheat');
    expect(observation.lines).toContain(announcement);
    expect(observation.lines.indexOf(announcement)).toBeLessThan(
      observation.lines.indexOf('The Binary Hall'),
    );
  }
  if (ward === undefined)
    throw new Error('Ward checkpoint observation is missing');
  return ward;
}

export async function playFullWin(page: Page): Promise<FullWinRecord> {
  const steps: Record<string, StepObservation> = {};
  const gates: GateObservation[] = [];
  const quizzesPlayed: QuizObservation[] = [];
  const hintViews: HintObservation[] = [];
  const areaChanges: StepObservation[] = [];

  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'New Game' })).toBeEnabled();
  const bootQuarantine = await page.evaluate(
    (key) => localStorage.getItem(key),
    'compsciquest:save:v1:corrupt',
  );
  await page.getByRole('button', { name: 'New Game' }).click();
  await expectWorkspace(page);
  const arrivalLines = await page
    .locator('.output-log > div')
    .allTextContents();
  const arrivalScorePanel =
    (await page.locator('.score-panel').textContent()) ?? '';
  const boot = await savedGame(page);

  const ward = await runOpening(page, steps, quizzesPlayed);
  for (const direction of [
    'north',
    'east',
    'south',
    'up',
    'in',
    'out',
  ] as const) {
    const before = await savedGame(page);
    const added = await command(page, direction);
    gates.push({ direction, before, after: await savedGame(page), added });
  }

  let milestoneLines: readonly string[] = [];
  let dyePad: StepObservation | undefined;
  for (const [label, raw, options] of MAIN) {
    if (label.startsWith('quiz:')) {
      quizzesPlayed.push(
        await playQuiz(page, raw, label.slice('quiz:'.length)),
      );
      continue;
    }
    if (label === 'milestone')
      milestoneLines = await page
        .locator('.output-log > div')
        .allTextContents();
    const observation = await runStep(page, raw, options ?? {});
    steps[label] = observation;
    if (label === 'concourse' || label === 'bureau')
      areaChanges.push(observation);
    else if (label === 'dye-pad') dyePad = observation;
    else if (label.startsWith('hint:')) {
      hintViews.push({
        label: label.slice('hint:'.length),
        panel: (await page.locator('.hint-panel').textContent()) ?? '',
        lines: observation.lines,
      });
    }
  }
  if (dyePad === undefined) throw new Error('Dye-pad observation is missing');

  const final = await savedGame(page);
  const winEnvelope = await envelope(page);
  const finalLines = await page.locator('.output-log > div').allTextContents();
  const finalScorePanel =
    (await page.locator('.score-panel').textContent()) ?? '';
  const finalQuarantine = await page.evaluate(
    (key) => localStorage.getItem(key),
    'compsciquest:save:v1:corrupt',
  );

  const envelopeBefore = await envelope(page);
  const gatedLines = await command(page, 'east');
  const envelopeAfter = await envelope(page);
  const accepted: {
    readonly raw: string;
    readonly lines: readonly string[];
  }[] = [];
  for (const raw of [
    'look',
    'inventory',
    'score',
    'help',
    'examine rota board',
  ]) {
    accepted.push({ raw, lines: await command(page, raw) });
  }
  const chooser = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Import', exact: true }).click();
  const fileChooser = await chooser;
  await fileChooser.setFiles({
    name: 'full-win-save.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(winEnvelope)),
  });
  await expect(page.locator('.save-status')).toHaveText('Game imported.');
  const importedEnvelope = await envelope(page);
  const importLines = await command(page, 'look');
  const importedScore =
    (await page.locator('.score-panel').textContent()) ?? '';
  await page.reload();
  await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expectWorkspace(page);
  const reloadedLines = await page
    .locator('.output-log > div')
    .allTextContents();
  const reloadedScore =
    (await page.locator('.score-panel').textContent()) ?? '';

  return {
    arrivalLines,
    arrivalScorePanel,
    boot,
    steps,
    ward,
    gates,
    quizzes: quizzesPlayed,
    hints: hintViews,
    milestoneLines,
    milestone: steps['milestone'] as StepObservation,
    areaChanges,
    dyePad,
    final,
    envelope: winEnvelope,
    finalLines,
    finalScorePanel,
    bootQuarantine,
    finalQuarantine,
    postWin: {
      gatedLines,
      envelopeBefore,
      envelopeAfter,
      accepted,
      importLines,
      importedEnvelope,
      importedScore,
      reloadedLines,
      reloadedScore,
    },
  };
}
