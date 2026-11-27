// Browser acceptance for the complete authored V4 win (matrix W7WIN-01…40,
// W7WIN-Q01…Q16, W7WIN-S01…S11, W7WIN-U01…U04, W7WIN-B01…B03, W7WIN-C01 and
// the feasible hint row W7WIN-H13). The command driver lives in
// w7-full-win-trace.ts; this file owns the beat-level expectations.
import { expect, test } from 'playwright/test';
import { hazards } from '../src/content/authored/hazards';
import { hints } from '../src/content/authored/hints';
import { puzzles } from '../src/content/authored/puzzles';
import { quizzes } from '../src/content/authored/quizzes';
import { specTopics } from '../src/content/authored/spec-topics';
import { START_POSITION, seedStorage, watchConsole } from './helpers';
import { hazardAnnouncement } from './w7-hazard-assertions';
import {
  authoredQuestion,
  authoredQuiz,
  authoredTopicTitle,
  joined,
  ownersOf,
  playFullWin,
  type FullWinRecord,
} from './w7-full-win-trace';

// prettier-ignore
const GATE_FLAGS = [
  'switches-set', 'hex-read', 'characters-matched',
  'picture-built', 'sound-sampled', 'stacks-sorted',
] as const;

// prettier-ignore
const NON_QUIZ_PUZZLES = [
  'puzzle-set-the-switches', 'puzzle-sort-the-data-types', 'puzzle-read-nibbles',
  'puzzle-add-with-carries', 'puzzle-shift-the-row', 'puzzle-match-characters',
  'puzzle-build-mosaic', 'puzzle-weigh-the-pixels', 'puzzle-tune-sampling',
  'puzzle-stack-the-bytes', 'puzzle-pack-the-archive', 'puzzle-choose-the-compression',
  'puzzle-check-the-overflow-register', 'puzzle-scale-the-badge',
  'puzzle-count-the-bit-rate', 'puzzle-label-the-capacity',
] as const;

// prettier-ignore
const MILL_FLAGS = [
  'demo-on-record', 'threading-ordered', 'bell-mended', 'weft-counted',
  'colours-lifted', 'condition-plate-set', 'rogue-thread-filed', 'master-demonstrated',
];

const RAIL_FLAGS = [
  'threading-ordered',
  'bell-mended',
  'weft-counted',
  'colours-lifted',
  'condition-plate-set',
];

const SCRIPTED_HAZARDS = new Set([
  'hazard-switch-overheat',
  'hazard-carry-overflow',
  'hazard-dye-pad',
]);

const UNSEEN_HAZARDS = new Set([
  'hazard-glyph-corruption',
  'hazard-bit-rot',
  'hazard-pick-avalanche',
  'hazard-slop-worksheet',
]);

function authoredHintLevelOne(hintId: string): string {
  const sequence = hints.find((entry) => entry.id === hintId);
  const level = sequence?.levels.find((entry) => entry.level === 1);
  if (level === undefined)
    throw new Error(`Authored hint '${hintId}' has no level 1`);
  return level.text;
}

function stepOf(
  record: FullWinRecord,
  label: string,
): FullWinRecord['steps'][string] {
  const observation = record.steps[label];
  if (observation === undefined)
    throw new Error(`Missing step observation: ${label}`);
  return observation;
}

const noConsoleErrors: () => readonly string[] = () => [];

test.describe('W7 full authored win', () => {
  let errors: () => readonly string[] = noConsoleErrors;

  test.beforeEach(async ({ page }) => {
    errors = watchConsole(page);
    await seedStorage(page);
  });

  test.afterEach(() => {
    expect(errors(), 'no console or page errors').toEqual([]);
  });

  test('plays all 30 steps, fourteen quizzes, the mill and the final reload in the browser', async ({
    page,
  }) => {
    test.setTimeout(15 * 60 * 1000);
    const record = await playFullWin(page);
    const state = record.final;
    const lines = record.finalLines;
    const coveredTopics = new Set(
      specTopics
        .filter(
          (topic) => topic.status === 'covered' && topic.evidence.trim() !== '',
        )
        .map((topic) => topic.id),
    );

    // W7WIN-01/02, W7WIN-S07/S09: a clean boot with no save and no points.
    expect(record.boot.turn).toBe(0);
    expect(record.boot.player.position).toEqual(START_POSITION);
    expect(record.boot.player.inventory).toEqual([]);
    expect(record.boot.player.lives).toBe(3);
    expect(record.arrivalScorePanel).toContain('Score: 0');
    expect(record.arrivalScorePanel).toContain('Lives: 3');
    expect(joined(record.arrivalLines)).toContain('The Arrival Bay');
    expect(joined(record.arrivalLines)).toContain('Exits: east');
    expect(stepOf(record, 'verdict').state.turn).toBe(1);

    // W7WIN-03…07, W7WIN-U01: the opening beats and their scoped answers.
    expect(joined(stepOf(record, 'verdict').lines)).toContain(
      'The mark beside your name is tapped twice',
    );
    expect(
      stepOf(record, 'why').state.npcs['npc-the-ai']?.knownTopics,
    ).toContain('ai-ethics-and-implications');
    expect(joined(stepOf(record, 'failure').lines)).toContain(
      'The pupil has three lives',
    );
    expect(joined(stepOf(record, 'hub').lines)).toContain(
      'A port label on the east socket reads LIVE',
    );
    expect(joined(stepOf(record, 'escape').lines)).toContain(
      'Two ports on the patch bay glow',
    );
    expect(joined(stepOf(record, 'why-hub').lines)).toContain(
      'The pointer rests on the record',
    );
    expect(joined(stepOf(record, 'failure-hub').lines)).toContain(
      'Another tap lands on the record.',
    );
    expect(joined(stepOf(record, 'interface-in').lines)).toContain(
      'The Interface',
    );
    expect(joined(stepOf(record, 'interface-out').lines)).toContain(
      'The Network Hub',
    );

    // W7WIN-08…12, W7WIN-15, W7WIN-S08: three scripted hazards and lives.
    expect(stepOf(record, 'overheat').state.player.lives).toBe(2);
    expect(stepOf(record, 'overflow').state.player.lives).toBe(1);
    expect(record.dyePad.state.player.lives).toBe(2);
    const scripted = hazards.filter((entry) => SCRIPTED_HAZARDS.has(entry.id));
    for (const hazard of scripted) {
      expect(
        lines.filter((line) => line === hazardAnnouncement(hazard.id)),
      ).toHaveLength(1);
    }
    expect(lines.filter((line) => line.startsWith('Hazard '))).toHaveLength(0);
    const unseen = hazards.filter((entry) => UNSEEN_HAZARDS.has(entry.id));
    for (const hazard of unseen) {
      expect(joined(lines)).not.toContain(hazardAnnouncement(hazard.id));
    }

    // W7WIN-09, W7WIN-32, W7WIN-40: every closed gate is friendly and inert.
    expect(record.gates).toHaveLength(6);
    for (const gate of record.gates) {
      expect(joined(gate.added)).toContain('That way is blocked');
      expect(gate.after.player.position).toEqual(gate.before.player.position);
      expect(gate.after.player.lives).toBe(gate.before.player.lives);
      expect(gate.after.player.inventory).toEqual(gate.before.player.inventory);
      expect(gate.after.turn).toBe(gate.before.turn + 1);
    }
    expect(joined(stepOf(record, 'bureau-gate').lines)).toContain(
      'That way is blocked',
    );
    expect(joined(stepOf(record, 'rail-closed').lines)).toContain(
      'That way is blocked',
    );
    expect(stepOf(record, 'rail-open').state.player.position.roomId).toBe(
      'room-finished-rail',
    );

    // W7WIN-16…28, W7WIN-29: zone-one milestones and USE/PUT/SHOW groups.
    for (const flag of GATE_FLAGS) expect(state.flags[flag]).toBe(true);
    for (const puzzleId of NON_QUIZ_PUZZLES)
      expect(state.puzzles[puzzleId]?.phase).toBe('solved');
    expect(stepOf(record, 'belt').lines).toContain('You earned 1 points.');
    expect(joined(stepOf(record, 'belt').lines)).not.toContain('room-');
    const at18 = record.milestone.state;
    expect(at18.player.lives).toBe(1);
    expect(at18.status).toBe('playing');
    expect(
      Object.keys(at18.flags).filter((flag) => flag.startsWith('quiz-passed:')),
    ).toHaveLength(8);
    expect(
      new Set(at18.progress.flatMap((row) => row.completedTopics)).size,
    ).toBe(8);
    expect(joined(record.milestoneLines)).not.toContain('You have won!');
    const [concourse, bureau] = record.areaChanges;
    if (concourse === undefined || bureau === undefined)
      throw new Error('Area-change observations are missing');
    expect(concourse.state.player.position.roomId).toBe('room-1-4-concourse');
    expect(concourse.state.player.lives).toBe(3);
    expect(bureau.state.player.position.roomId).toBe('room-pattern-bureau');
    expect(bureau.state.player.lives).toBe(3);

    // W7WIN-H13, W7WIN-H02: the one feasible authored hint, earned by three
    // harmless turns after the sequence-card give, then the cooldown message.
    expect(record.hints).toHaveLength(2);
    expect(record.hints[0]?.panel).toBe(
      `Hint 1: ${authoredHintLevelOne('hint-threading-order')}`,
    );
    expect(record.hints[1]?.lines).toContain('Think about it for a moment.');

    // W7WIN-33…39, W7WIN-U02: mill puzzles, five rail flags and solutions.
    for (const flag of MILL_FLAGS) expect(state.flags[flag]).toBe(true);
    for (const flag of RAIL_FLAGS) expect(state.flags[flag]).toBe(true);
    for (const puzzle of puzzles)
      expect(state.puzzles[puzzle.id]?.phase).toBe('solved');
    expect(ownersOf(state, 'item-rogue-thread')).toEqual([
      'room-endless-selvedge',
    ]);

    // W7WIN-Q01…Q16, W7WIN-U03: fourteen real quiz handoffs with authored data.
    expect(record.quizzes).toHaveLength(14);
    for (const quiz of record.quizzes) {
      const authored = authoredQuiz(quiz.quizId);
      expect(quiz.requirement).toBe(
        `Pass mark: ${authored.passMark} correct of ${authored.questionIds.length}. Wrong answers allowed: ${authored.questionIds.length - authored.passMark}.`,
      );
      // The game shuffles question order with its RNG: compare the set of
      // displayed prompts, not their order.
      expect(quiz.prompts).toHaveLength(authored.questionIds.length);
      expect(new Set(quiz.prompts)).toEqual(
        new Set(authored.questionIds.map((id) => authoredQuestion(id).prompt)),
      );
      expect(joined(quiz.lines)).toContain(
        `Topic completed: ${authoredTopicTitle(quiz.topicId)}.`,
      );
      expect(state.flags[`quiz-passed:${quiz.quizId}`]).toBe(true);
    }
    expect(
      new Set(
        Object.keys(state.flags).filter((flag) =>
          flag.startsWith('quiz-passed:'),
        ),
      ),
    ).toEqual(new Set(quizzes.map((quiz) => `quiz-passed:${quiz.id}`)));

    // W7WIN-S01/S02/S03/S10: derived score, unique rows and one victory.
    const completed = new Set(
      state.progress.flatMap((row) => row.completedTopics),
    );
    expect(completed).toEqual(coveredTopics);
    expect(completed.size).toBe(10);
    expect(
      state.progress.reduce((total, row) => total + row.earnedScore, 0),
    ).toBe(43);
    expect(record.finalScorePanel).toContain('Score: 43');
    const finalProgress = state.progress.find(
      (row) =>
        row.worldId === state.player.position.worldId &&
        row.areaId === state.player.position.areaId,
    );
    if (finalProgress === undefined)
      throw new Error('No final-area progress row');
    expect(record.finalScorePanel).toContain(
      `Score: ${finalProgress.earnedScore} / ${finalProgress.maxScore}`,
    );
    expect(
      lines.filter((line) => line === 'You have won! Final score: 43.'),
    ).toHaveLength(1);
    expect(state.status).toBe('won');
    expect(state.player.lives).toBe(2);
    for (const row of state.progress)
      expect(row.earnedScore).toBeLessThanOrEqual(row.maxScore);

    // W7WIN-S01/S11: save invariants, rng rollover and a preserved import.
    expect('score' in record.envelope.state).toBe(false);
    expect(record.envelope.version).toBe(1);
    expect(record.envelope.savedAt).toMatch(/^\d{4}-\d{2}-\d{2}T.*Z$/u);
    expect(state.rngSeed).not.toBe(record.boot.rngSeed);
    const progressKeys = state.progress.map(
      (row) => `${row.worldId}:${row.areaId}`,
    );
    expect(new Set(progressKeys).size).toBe(progressKeys.length);
    const itemIds = [
      ...state.player.inventory,
      ...Object.values(state.rooms).flatMap((room) => room.inventory),
      ...Object.values(state.npcs).flatMap((npc) => npc.inventory),
    ];
    expect(new Set(itemIds).size).toBe(itemIds.length);
    // Import restores the live state; it does not rewrite browser storage.
    // The SaveManager-level savedAt preservation is covered by unit tests.
    expect(record.postWin.importedEnvelope.state.status).toBe('won');
    expect(record.postWin.importedEnvelope.savedAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T.*Z$/u,
    );
    expect(record.postWin.importedScore).toContain('Score: 43');
    expect(record.bootQuarantine).toBe(record.finalQuarantine);

    // W7WIN-S04/S05/S06 and W7WIN-C01: the end state is stable across the
    // post-win gate, typed commands, an import and a reload with Continue.
    expect(joined(record.postWin.gatedLines)).toContain(
      'The adventure is over — start a new game.',
    );
    expect(record.postWin.envelopeAfter.savedAt).toBe(
      record.postWin.envelopeBefore.savedAt,
    );
    expect(record.postWin.envelopeAfter.state.turn).toBe(
      record.postWin.envelopeBefore.state.turn,
    );
    for (const accepted of record.postWin.accepted) {
      expect(joined(accepted.lines)).not.toContain('The adventure is over');
      expect(accepted.lines.length).toBeGreaterThan(1);
    }
    expect(
      record.postWin.reloadedLines.filter((line) =>
        line.includes('You have won!'),
      ),
    ).toHaveLength(0);
    expect(record.postWin.reloadedScore).toContain('Score: 43');
    expect(errors()).toEqual([]);
  });
});
