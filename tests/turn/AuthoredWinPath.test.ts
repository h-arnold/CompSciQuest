// Authored completion and clean-start win acceptance for QUIZ-HINT-11/E2E-4.
// The run uses only generated catalogue data and submitted commands; its only
// save is the final observation of the persisted result.
import { describe, expect, it } from 'vitest';
import { createSaveManager } from '../../src/application/SaveManager';
import { createEffectApplier } from '../../src/core/effects/EffectApplier';
import type { GameEvent } from '../../src/core/events/GameEvent';
import { createSession } from '../../src/core/lifecycle/Session';
import { createScoreTracker } from '../../src/core/scoring/ScoreTracker';
import type { Direction } from '../../src/types/domain';
import {
  authoredBundle,
  authoredGame,
  authoredState,
  changedFlags,
  readSave,
  switchyardProgress,
} from '../fixtures/authored';
import { FakeRandom, FixedClock, MemoryStorage } from '../fixtures/persistence';

const TRACE_FLAGS: readonly string[] = [
  'switches-set',
  'hex-read',
  'characters-matched',
  'picture-built',
  'sound-sampled',
  'stacks-sorted',
];

function gateFlag(
  exit: (typeof authoredBundle.rooms.all)[number]['exits'][number],
): string {
  const condition = exit.preconditions.find(
    (candidate) => candidate.kind === 'flag-set',
  );
  return condition?.kind === 'flag-set' ? condition.flag : '';
}

function lastQuestion(
  batch: readonly GameEvent[],
): Extract<GameEvent, { type: 'question-asked' }> | undefined {
  for (let index = batch.length - 1; index >= 0; index -= 1) {
    const event = batch[index];
    if (event?.type === 'question-asked') return event;
  }
  return undefined;
}

function lastWinningBatch(
  batches: readonly GameEvent[][],
): readonly GameEvent[] | undefined {
  for (let index = batches.length - 1; index >= 0; index -= 1) {
    const batch = batches[index];
    if (batch?.some((event) => event.type === 'game-won')) return batch;
  }
  return undefined;
}

class AuthoredRun {
  readonly game: ReturnType<typeof authoredGame>['game'];
  readonly bus: ReturnType<typeof authoredGame>['bus'];
  readonly storage: ReturnType<typeof authoredGame>['storage'];
  readonly batches: GameEvent[][] = [];
  readonly flags = new Set<string>();
  readonly passedQuizzes = new Set<string>();
  readonly failures: string[] = [];

  constructor() {
    const fixture = authoredGame();
    this.game = fixture.game;
    this.bus = fixture.bus;
    this.storage = fixture.storage;
    this.game.newGame();
    this.batches.push([...(this.bus.batches.at(-1) ?? [])]);
  }

  private pathTo(targetRoomId: string): readonly Direction[] | undefined {
    const start = this.game.getViewData().position.roomId;
    if (start === targetRoomId) return [];
    const queue: Array<{
      readonly roomId: string;
      readonly path: readonly Direction[];
    }> = [{ roomId: start, path: [] }];
    const seen = new Set<string>([start]);
    while (queue.length > 0) {
      const current = queue.shift();
      if (current === undefined) break;
      const room = authoredBundle.rooms.getById(current.roomId);
      const exits = room?.exits ?? [];
      for (const exit of exits) {
        if (seen.has(exit.targetRoomId)) continue;
        const open = exit.preconditions.every(
          (condition) =>
            condition.kind !== 'flag-set' || this.flags.has(condition.flag),
        );
        if (!open) continue;
        const path = [...current.path, exit.direction];
        if (exit.targetRoomId === targetRoomId) return path;
        seen.add(exit.targetRoomId);
        queue.push({ roomId: exit.targetRoomId, path });
      }
    }
    return undefined;
  }

  private followPath(path: readonly Direction[]): boolean {
    for (const direction of path) {
      const expected = authoredBundle.rooms
        .getById(this.game.getViewData().position.roomId)
        ?.exits.find((exit) => exit.direction === direction)?.targetRoomId;
      this.submit(direction);
      if (
        expected !== undefined &&
        this.game.getViewData().position.roomId !== expected
      ) {
        return false;
      }
    }
    return true;
  }

  submit(raw: string): readonly GameEvent[] {
    const batch = this.game.submit(raw);
    this.batches.push([...batch]);
    for (const flag of changedFlags(batch)) this.flags.add(flag);
    for (const event of batch) {
      if (event.type === 'quiz-ended' && event.passed)
        this.passedQuizzes.add(event.quizId);
    }
    return batch;
  }

  travelTo(targetRoomId: string): void {
    for (let attempt = 0; attempt < 12; attempt += 1) {
      if (this.game.getViewData().position.roomId === targetRoomId) return;
      const path = this.pathTo(targetRoomId);
      if (path === undefined) {
        this.failures.push(`no authored route to ${targetRoomId}`);
        return;
      }
      if (!this.followPath(path)) continue;
    }
    this.failures.push(
      `travel to ${targetRoomId} did not settle after a hazard ejection`,
    );
  }

  attemptGates(): void {
    const gated = authoredBundle.rooms.all.flatMap((room) =>
      room.exits
        .filter((exit) =>
          exit.preconditions.some((condition) => condition.kind === 'flag-set'),
        )
        .map((exit) => ({ roomId: room.id, exit })),
    );
    const ordered = TRACE_FLAGS.flatMap((flag) =>
      gated.filter((entry) => gateFlag(entry.exit) === flag),
    );
    expect(ordered).toHaveLength(6);
    for (const { roomId, exit } of ordered) {
      this.travelTo(roomId);
      const before = this.game.getViewData();
      const batch = this.submit(exit.direction);
      const after = this.game.getViewData();
      if (batch.some((event) => event.type !== 'message')) {
        this.failures.push(
          `closed gate ${exit.direction} changed gameplay state`,
        );
      }
      if (
        after.position.roomId !== before.position.roomId ||
        after.lives !== before.lives ||
        after.score !== before.score
      ) {
        this.failures.push(
          `closed gate ${exit.direction} moved or penalised the player`,
        );
      }
      if (after.turn !== before.turn + 1) {
        this.failures.push(
          `closed gate ${exit.direction} did not advance exactly one turn`,
        );
      }
    }
  }

  startQuiz(raw: string, quizId: string): void {
    let batch = this.submit(raw);
    const started = batch.find((event) => event.type === 'quiz-started');
    if (started?.type !== 'quiz-started' || started.quizId !== quizId) {
      this.failures.push(`${raw} did not start ${quizId}`);
      return;
    }
    for (let guard = 0; guard < 10; guard += 1) {
      if (batch.some((event) => event.type === 'quiz-ended')) return;
      const asked = lastQuestion(batch);
      if (asked === undefined) {
        this.failures.push(`${quizId} did not ask its first question`);
        return;
      }
      const question = authoredBundle.questions.getById(asked.questionId);
      const option = question?.correctOptionIds[0];
      if (question === undefined || option === undefined) {
        this.failures.push(
          `${quizId} referenced a missing question or correct option`,
        );
        return;
      }
      batch = this.submit(`answer ${option + 1}`);
    }
    this.failures.push(
      `${quizId} did not finish within its authored question count`,
    );
  }
}

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

  it('E2E-4: the clean authored command path opens the six gates, loses exactly two hazard lives, passes eight quizzes and wins once', () => {
    const run = new AuthoredRun();
    run.travelTo('room-network-hub');
    run.travelTo('room-binary-hall');
    run.attemptGates();

    run.travelTo('room-switch-floor');
    run.submit('take switch gauge');
    run.submit('use switch gauge on belt');
    run.startQuiz('ask foreman about switches', 'quiz-switchyard');
    run.startQuiz('ask foreman about lift', 'quiz-data-types');

    run.travelTo('room-binary-hall');
    const sample = authoredBundle.items.all.find((item) =>
      item.name.toLowerCase().includes('decimal sample'),
    );
    if (sample === undefined) {
      run.failures.push('the authored decimal sample is missing');
    } else {
      run.submit('take decimal sample');
      run.submit('put decimal sample on real bin');
    }

    run.travelTo('room-hex-deck');
    run.submit('take nibble card');
    run.submit('use nibble card on carry lamp');
    run.submit('use nibble card on nibble groups');
    run.submit('use carry token on rightmost column');
    run.submit('use shift lever on row');
    run.submit('show foreman switch gauge');
    run.startQuiz('ask clerk about shifts', 'quiz-number-systems');

    run.travelTo('room-character-tiles');
    run.submit('take ascii stamp');
    run.submit('examine tiles');
    run.submit('use ascii stamp on tiles');
    run.startQuiz(
      'ask typesetter about unicode',
      'quiz-character-representation',
    );

    run.travelTo('room-picture-mosaic');
    run.submit('take pixel lens');
    run.submit('use pixel lens on mosaic');
    run.submit('use pixel lens on nibble card');
    run.submit('show foreman pixel lens');
    run.startQuiz('ask critic about storage', 'quiz-graphics-representation');

    run.travelTo('room-sound-choir');
    run.submit('take sample fork');
    run.submit('use sample fork on bit-rate desk');
    run.travelTo('room-storage-stacks');
    run.submit('use sample fork on unit ladder');
    run.submit('show foreman sample fork');
    run.submit('show foreman nibble card');
    run.startQuiz('ask choirmaster about storage', 'quiz-sound-representation');
    run.startQuiz('ask keeper about capacity', 'quiz-storage-units');

    run.travelTo('room-compression-press');
    run.submit('take compression die');
    run.submit('use compression die');
    run.submit('use compression die on ascii stamp');
    run.startQuiz('ask operator about ratio', 'quiz-data-compression');

    expect(run.failures).toEqual([]);
    const allEvents = run.batches.flat();
    const hazards = allEvents.filter(
      (event) => event.type === 'hazard-triggered',
    );
    expect(new Set(hazards.map((event) => event.hazardId))).toEqual(
      new Set(['hazard-switch-overheat', 'hazard-carry-overflow']),
    );
    expect(hazards).toHaveLength(2);
    expect(run.game.getViewData().lives).toBe(1);
    expect(run.game.getViewData().status).toBe('won');
    expect(run.passedQuizzes.size).toBe(8);
    for (const flag of TRACE_FLAGS) expect(run.flags.has(flag)).toBe(true);

    const wins = allEvents.filter((event) => event.type === 'game-won');
    expect(wins).toHaveLength(1);
    expect(lastWinningBatch(run.batches)).toBe(run.batches.at(-1));
    const saved = readSave(run.game, run.storage).dto.state;
    const completed = new Set(
      saved.progress.flatMap((entry) => entry.completedTopics),
    );
    expect(completed).toEqual(
      new Set(authoredBundle.quizzes.all.map((quiz) => quiz.topicId)),
    );
    const finalScore = saved.progress.reduce(
      (total, entry) => total + entry.earnedScore,
      0,
    );
    expect(wins).toEqual([{ type: 'game-won', finalScore }]);
  });
});
