// Authored completion and clean-start win acceptance for QUIZ-HINT-11/E2E-4.
// The run uses only generated catalogue data and submitted commands; its only
// save is the final observation of the persisted result. The command path is
// the accepted whole-game V4 trace in docs/content/walkthrough.md §2 and §8
// steps 1–30, including its teaching ladders and scripted hazard lifetimes.
import { describe, expect, it } from 'vitest';
import { createSaveManager } from '../../src/application/SaveManager';
import { createEffectApplier } from '../../src/core/effects/EffectApplier';
import type { GameEvent } from '../../src/core/events/GameEvent';
import { createSession } from '../../src/core/lifecycle/Session';
import { createScoreTracker } from '../../src/core/scoring/ScoreTracker';
import {
  authoredBundle,
  authoredState,
  readSave,
  switchyardProgress,
} from '../fixtures/authored';
import { FakeRandom, FixedClock, MemoryStorage } from '../fixtures/persistence';
import {
  AuthoredRun,
  MILL_FLAGS,
  TRACE_FLAGS,
  lastWinningBatch,
} from './AuthoredWinPathRun';

describe('authored win transition', () => {
  it('QUIZ-HINT-11: all eight authored completion sources win once with the final score and restore derives the end state without an event', () => {
    const state = authoredState({
      roomId: 'room-binary-hall',
      progress: [switchyardProgress()],
    });
    const random = new FakeRandom([0]);
    const dependencies = { random, bundle: authoredBundle };
    const applier = createEffectApplier(state, dependencies);
    const achievements: GameEvent[] = [];
    for (const puzzle of authoredBundle.puzzles.all) {
      achievements.push(
        ...applier.apply({ kind: 'set-puzzle-solved', puzzleId: puzzle.id }),
      );
    }
    for (const quiz of authoredBundle.quizzes.all) {
      achievements.push({
        type: 'quiz-ended',
        quizId: quiz.id,
        passed: true,
        reason: 'authored pass effects applied',
      });
    }
    const completionEffects = [
      ...authoredBundle.quizzes.all.flatMap((quiz) => quiz.onPass),
      ...authoredBundle.puzzles.all.flatMap((puzzle) => puzzle.onSolve),
    ].filter((effect) => effect.kind === 'complete-topic');
    for (const effect of completionEffects)
      achievements.push(...applier.apply(effect));

    const score = createScoreTracker(state, { bundle: authoredBundle });
    const scored = score.observe(achievements);
    const session = createSession(state, authoredBundle);
    const finalBatch = session.observe(scored);
    const wins = finalBatch.filter((event) => event.type === 'game-won');
    expect(wins).toEqual([{ type: 'game-won', finalScore: score.getTotal() }]);
    expect(state.status).toBe('won');

    const storage = new MemoryStorage();
    const manager = createSaveManager({
      storage,
      clock: new FixedClock(),
      bundle: authoredBundle,
    });
    const playingDto = manager.buildDto(state);
    const restored = manager.restore({
      ...playingDto,
      state: { ...playingDto.state, status: 'playing' },
    });
    expect(restored.status).toBe('won');
    expect(restored.score).toBe(score.getTotal());
    expect(createSession(restored, authoredBundle).observe([])).toEqual([]);
  });

  it('W7R-QUIZ-01: E2E-4 follows walkthrough §8 steps 1–30, including teaching beats, two zone-one hazard lives, fourteen quiz handoffs, ten completed topics and one game-won', () => {
    const run = new AuthoredRun();
    // Fixture precondition only: the mandatory Assistance Ward checkpoint is
    // already complete, so the hub's teaching-port gates are open before this
    // downstream trace starts (walkthrough §2 C2.10–C2.12, §3 gate table).
    // The recorded orientation pass is part of that completed checkpoint and
    // satisfies the win check without adding tutorial-mechanics to the ten-topic
    // set. No ward command is added here and no runtime producer is invented.
    run.game.continueGame(
      createSaveManager({
        storage: run.storage,
        clock: new FixedClock(),
        bundle: authoredBundle,
      }).buildDto(
        authoredState({
          flags: {
            'tutorial-complete': true,
            'quiz-passed:quiz-assistance-orientation': true,
          },
        }),
      ),
    );

    // Opening beats A–C (walkthrough §2): the verdict, the scoped AI topics
    // and the hub's two live ports before the Switchyard is entered.
    run.submit('ask ai about verdict');
    run.submit('ask ai about why here');
    run.submit('ask ai about failure');
    run.submit('east');
    run.expectRoom('the east route', 'room-network-hub');
    run.submit('ask ai about escape');

    // Beat E: the first switch-floor entry overheats and ejects to the hall.
    run.expectHazard('east', 'hazard-switch-overheat');
    run.expectRoom('the overheat ejection', 'room-binary-hall');

    // Steps 1–5: read the bins, prove the six closed gates, then set the
    // switches and pass the foreman's two handoffs.
    run.attemptGates();
    run.submit('down');
    run.expectRoom('the safe switch-floor re-entry', 'room-switch-floor');
    run.step('take switch gauge');
    run.step('use switch gauge on belt', 'switch-cooled', 'switches-set');
    run.startQuiz('ask foreman about switches', 'quiz-switchyard');
    run.startQuiz('ask foreman about lift', 'quiz-data-types', 'stacks-sealed');
    run.submit('up');
    run.expectRoom('step 4', 'room-binary-hall');
    run.step('take decimal sample');
    run.step('put decimal sample on real bin', 'types-sorted');

    // Step 6: the first hex-deck entry overflows and ejects to the hall.
    run.expectHazard('north', 'hazard-carry-overflow');
    run.expectRoom('the overflow ejection', 'room-binary-hall');
    run.submit('north');
    run.expectRoom('the safe hex-deck re-entry', 'room-hex-deck');
    run.step('take nibble card');

    // Step 7: nibble counterplay, the clerk's teaching ladder, then the audit.
    run.step('use nibble card on carry lamp', 'carry-cleared');
    run.step('use nibble card on nibble groups', 'hex-read');
    run.submit('ask clerk about bases');
    run.step('ask clerk about carries', 'clerk-carry-heard');
    run.submit('ask clerk about the back'); // topic-clerk-bases-known
    run.step('use carry token on rightmost column', 'carries-added');
    run.step('use shift lever on row', 'row-shifted');
    run.step('show foreman switch gauge', 'overflow-checked');
    run.startQuiz('ask clerk about shifts', 'quiz-number-systems');

    // Steps 8–9: the character case, tiles verified before the stamp, and
    // the typesetter's ascii → unicode ladder.
    run.submit('south');
    run.submit('east');
    run.expectRoom('step 8', 'room-character-tiles');
    run.step('take ascii stamp');
    run.step('examine tiles', 'tiles-verified');
    run.step('use ascii stamp on tiles', 'characters-matched');
    run.submit('ask typesetter about ascii');
    run.startQuiz(
      'ask typesetter about unicode',
      'quiz-character-representation',
    );

    // Steps 10–11: mosaic, leaf actions, and the critic's depth ladder.
    run.submit('west');
    run.submit('south');
    run.expectRoom('step 10', 'room-picture-mosaic');
    run.step('take pixel lens');
    run.step('use pixel lens on mosaic', 'picture-built');
    run.step('use pixel lens on nibble card', 'pixels-weighed');
    run.step('show foreman pixel lens', 'badge-scaled');
    run.submit('ask critic about vectors');
    run.step('ask critic about depth', 'critic-depth-heard');
    run.startQuiz('ask critic about storage', 'quiz-graphics-representation');

    // Steps 12–13: sample first; the audio quiz waits for step 15's SHOW.
    run.submit('north');
    run.submit('up');
    run.expectRoom('step 12', 'room-sound-choir');
    run.step('take sample fork');
    run.step('use sample fork on bit-rate desk', 'sound-sampled');
    run.submit('ask choirmaster about samples');
    run.step('ask choirmaster about depth', 'conductor-depth-heard');

    // Steps 14–15: stacks sorted, fork SHOW, audio quiz, capacity SHOW and
    // the keeper's unit ladder before the capacity quiz.
    run.submit('down');
    run.submit('in');
    run.expectRoom('step 14', 'room-storage-stacks');
    run.step('use sample fork on unit ladder', 'stacks-sorted');
    run.step('show foreman sample fork', 'bit-rate-counted');
    run.startQuiz('ask choirmaster about storage', 'quiz-sound-representation');
    run.step('show foreman nibble card', 'capacity-labelled');
    run.submit('ask keeper about units');
    run.startQuiz('ask keeper about capacity', 'quiz-storage-units');

    // Steps 16–18: lossy teaching before the die uses, then the ratio quiz.
    run.submit('out');
    run.submit('out');
    run.expectRoom('step 16', 'room-compression-press');
    run.step('take compression die');
    run.submit('ask operator about lossy');
    run.step('use compression die', 'archive-packed');
    run.step('use compression die on ascii stamp', 'compression-chosen');
    run.startQuiz('ask operator about ratio', 'quiz-data-compression');

    // The zone-one milestone at step 18: two lives lost, eight topics and
    // eight quizzes complete, and no end event yet.
    // The eight canonical Zone A topics from walkthrough §1, not a slice of
    // the quiz catalogue: the non-assessed ward orientation quiz now precedes
    // them in declaration order.
    const zoneOneTopics = new Set([
      'switch-to-bit',
      'data-types',
      'number-conversion',
      'character-representation',
      'graphics-representation',
      'sound-representation',
      'data-storage-units',
      'data-compression',
    ]);
    const completedAt18 = new Set(
      readSave(run.game, run.storage).dto.state.progress.flatMap(
        (entry) => entry.completedTopics,
      ),
    );
    expect(completedAt18).toEqual(zoneOneTopics);
    expect(run.passedQuizzes.size).toBe(8);
    run.expectLives('step 18', 1);
    expect(run.game.getViewData().lives).toBe(1);
    expect(
      run.events
        .filter((event) => event.type === 'hazard-triggered')
        .map((event) =>
          event.type === 'hazard-triggered' ? event.hazardId : '',
        ),
    ).toEqual(['hazard-switch-overheat', 'hazard-carry-overflow']);
    expect(run.events.filter((event) => event.type === 'game-won')).toEqual([]);

    // Step 19–20: back through the hall to the hub, then north to the
    // concourse; step 21 enters the mill at its start room.
    run.submit('in');
    run.expectRoom('step 19 hall return', 'room-binary-hall');
    run.submit('west');
    run.expectRoom('step 19 hub return', 'room-network-hub');
    run.submit('north');
    run.expectRoom('step 20', 'room-1-4-concourse');
    run.expectLives('step 20 area-change reset', 3);
    run.submit('east');
    run.expectRoom('step 21', 'room-pattern-bureau');
    run.expectLives('step 21 area-change reset', 3);

    // Step 21: welcome, pseudo-code, shapes and the Bureau demonstration.
    run.submit('ask loomwright about hello');
    run.submit('ask loomwright about pseudocode');
    run.submit('ask loomwright about shapes');
    run.startQuiz('ask loomwright about demonstration', 'quiz-pattern-bureau');

    // Step 22–23: the warp walk, the dressing ladder, the give and P1.
    run.step('east', 'demo-on-record');
    run.expectRoom('step 22', 'room-warp-walk');
    run.submit('north');
    run.expectRoom('step 23', 'room-threading-order');
    run.submit('ask warp dresser about constructs');
    run.submit('ask warp dresser about order'); // the keyword middle beat
    run.startQuiz(
      'ask warp dresser about demonstration',
      'quiz-threading-order',
    );
    run.step('give warp dresser sequence card', 'card-sequence-given');
    run.step('put shade cards on step hangers', 'dressing-re-ordered');
    run.expectFlag('threading-ordered', 'puzzle-dress-the-warp');
    run.step('take else plate');

    // Step 24: the shed plate and the addressing plate's letter rack (P2).
    run.submit('south');
    run.submit('out');
    run.expectRoom('step 24', 'room-bobbin-window');
    run.step('take shed plate');
    run.step('use addressing plate', 'addressing-plate-re-lettered');

    // Step 25: the scripted dye-pad life, the tally ladders, the count quiz,
    // the give and the ratchet's two actions (P7/P8).
    run.submit('in');
    run.expectHazard('south', 'hazard-dye-pad');
    run.expectRoom('the dye-pad ejection', 'room-pattern-bureau');
    run.expectLives('the dye-pad loss', 2);
    run.submit('east');
    run.submit('south');
    run.expectRoom('the safe weft-counter re-entry', 'room-weft-counter');
    run.submit('ask weft tally about constructs');
    run.step('ask weft tally about dye pad', 'pad-checked');
    run.step('ask weft tally about constructs', 'weft-ratchet-heard');
    run.step('ask weft tally about ratchet', 'pass-count-predicted');
    run.startQuiz('ask weft tally about demonstration', 'quiz-weft-tally');
    run.step('give weft tally count card', 'card-count-given');
    run.step('use slip tooth on counting ratchet', 'slip-tooth-pried');
    run.step('use counting ratchet', 'counting-ratchet-reseated');
    run.expectFlag('weft-counted', 'puzzle-seat-the-ratchet');
    run.step('take bell wire');

    // Step 26–27: the bell wire (P3), then the selection ladder, give and
    // the three plates/trolley actions (P4/P5/P6).
    run.submit('north');
    run.submit('out');
    run.expectRoom('step 26', 'room-bobbin-window');
    run.step('use bell wire on intake bell', 'bell-wire-seated');
    run.expectFlag('bell-mended', 'puzzle-mend-the-bell');
    run.submit('in');
    run.submit('in');
    run.expectRoom('step 27', 'room-colour-court');
    run.submit('ask shed opener about constructs');
    run.submit('ask shed opener about shed'); // the keyword middle beat
    run.startQuiz('ask shed opener about demonstration', 'quiz-colour-court');
    run.step('give shed opener selection card', 'card-selection-given');
    run.step('put shed plate in plate frame', 'shed-plate-returned');
    run.step('put else plate in plate frame', 'else-plate-restored');
    run.step('use pick trolley', 'tray-routed-by-condition');
    run.expectFlag('colours-lifted', 'puzzle-lift-the-shed');

    // Step 28: the until ladder, give and the exit frame/drawer (P9/P10).
    run.submit('out');
    run.submit('down');
    run.expectRoom('step 28', 'room-endless-selvedge');
    run.submit('ask selvedge warden about constructs');
    run.submit('ask selvedge warden about next'); // the keyword middle beat
    run.startQuiz('ask selvedge warden about demonstration', 'quiz-selvedge');
    run.step('give selvedge warden condition card', 'card-condition-given');
    run.step('put until plate on exit frame', 'until-clause-restored');
    run.expectFlag('condition-plate-set', 'puzzle-close-the-selvedge');
    run.step(
      'put rogue thread in counterfoil drawer',
      'rogue-thread-in-drawer',
    );
    run.expectFlag('rogue-thread-filed', 'puzzle-file-the-rogue-thread');

    // Steps 29–30: all four section lights open the rail; the audit is the
    // last of the fourteen quizzes and fires game-won in its own batch.
    run.submit('up');
    run.expectRoom('step 29 warp walk', 'room-warp-walk');
    run.step('east');
    run.expectRoom('step 29 rail', 'room-finished-rail');
    run.startQuiz('ask loomwright about audit', 'quiz-finished-rail');
    run.expectFlag('master-demonstrated', 'quiz-finished-rail');

    expect(run.failures).toEqual([]);
    const allEvents = run.events;
    const hazards = allEvents.filter(
      (event) => event.type === 'hazard-triggered',
    );
    expect(new Set(hazards.map((event) => event.hazardId))).toEqual(
      new Set([
        'hazard-switch-overheat',
        'hazard-carry-overflow',
        'hazard-dye-pad',
      ]),
    );
    expect(hazards).toHaveLength(3);
    expect(run.game.getViewData().lives).toBe(2);
    expect(run.game.getViewData().status).toBe('won');
    expect(run.passedQuizzes.size).toBe(14);
    expect(run.passedQuizzes).toEqual(
      new Set(
        authoredBundle.quizzes.all
          .filter((quiz) => quiz.id !== 'quiz-assistance-orientation')
          .map((quiz) => quiz.id),
      ),
    );
    for (const flag of [...TRACE_FLAGS, ...MILL_FLAGS])
      expect(run.flags.has(flag)).toBe(true);
    const solved = allEvents.filter((event) => event.type === 'puzzle-solved');
    expect(solved).toHaveLength(23);
    expect(new Set(solved.map((event) => event.puzzleId))).toEqual(
      new Set(
        authoredBundle.puzzles.all
          .filter((puzzle) => puzzle.id !== 'puzzle-calibrate-assistance')
          .map((puzzle) => puzzle.id),
      ),
    );

    const wins = allEvents.filter((event) => event.type === 'game-won');
    expect(wins).toHaveLength(1);
    expect(lastWinningBatch(run.batches)).toBe(run.batches.at(-1));
    const savedDto = readSave(run.game, run.storage).dto;
    const saved = savedDto.state;
    const completed = new Set(
      saved.progress.flatMap((entry) => entry.completedTopics),
    );
    expect(completed).toEqual(
      new Set(
        authoredBundle.quizzes.all
          .filter((quiz) => quiz.topicId !== 'tutorial-mechanics')
          .map((quiz) => quiz.topicId),
      ),
    );
    expect(completed.size).toBe(10);
    expect(completed).toEqual(
      new Set(
        authoredBundle.areas.all.flatMap((area) =>
          authoredBundle.specTopics
            .getByAreaId(area.worldId, area.id)
            .filter((topic) => topic.status === 'covered' && topic.evidence)
            .map((topic) => topic.id),
        ),
      ),
    );
    const finalScore = saved.progress.reduce(
      (total, entry) => total + entry.earnedScore,
      0,
    );
    expect(finalScore).toBe(43);
    expect(wins).toEqual([{ type: 'game-won', finalScore }]);

    const manager = createSaveManager({
      storage: run.storage,
      clock: new FixedClock(),
      bundle: authoredBundle,
    });
    const restored = manager.restore(savedDto);
    expect(restored.status).toBe('won');
    expect(restored.score).toBe(43);
    expect(createSession(restored, authoredBundle).observe([])).toEqual([]);
  });
});
