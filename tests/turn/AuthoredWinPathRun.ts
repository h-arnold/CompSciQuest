// Command driver for the deterministic whole-game authored run: it submits
// only generated catalogue commands and records observable flags, events,
// quiz passes and failures. No production module is modified or shimmed.
import { expect } from 'vitest';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { Direction } from '../../src/types/domain';
import {
  authoredBundle,
  authoredGame,
  changedFlags,
} from '../fixtures/authored';

export const TRACE_FLAGS: readonly string[] = [
  'switches-set',
  'hex-read',
  'characters-matched',
  'picture-built',
  'sound-sampled',
  'stacks-sorted',
];

// Walkthrough §8 steps 21–30: the mill's quiz, puzzle and end-state flags.
export const MILL_FLAGS: readonly string[] = [
  'demo-on-record',
  'threading-ordered',
  'bell-mended',
  'weft-counted',
  'colours-lifted',
  'condition-plate-set',
  'rogue-thread-filed',
  'master-demonstrated',
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

export function lastWinningBatch(
  batches: readonly GameEvent[][],
): readonly GameEvent[] | undefined {
  for (let index = batches.length - 1; index >= 0; index -= 1) {
    const batch = batches[index];
    if (batch?.some((event) => event.type === 'game-won')) return batch;
  }
  return undefined;
}

export class AuthoredRun {
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

  get events(): readonly GameEvent[] {
    return this.batches.flat();
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

  // A trace step whose observable contract is one or more authored flags.
  step(raw: string, ...flags: readonly string[]): void {
    this.submit(raw);
    for (const flag of flags) {
      if (!this.flags.has(flag))
        this.failures.push(`${raw} did not set ${flag}`);
    }
  }

  expectFlag(flag: string, after: string): void {
    if (!this.flags.has(flag))
      this.failures.push(`${after} did not set ${flag}`);
  }

  expectRoom(after: string, roomId: string): void {
    const actual = this.game.getViewData().position.roomId;
    if (actual !== roomId)
      this.failures.push(`${after} reached ${actual}, not ${roomId}`);
  }

  expectLives(after: string, lives: number): void {
    const actual = this.game.getViewData().lives;
    if (actual !== lives)
      this.failures.push(`${after} had ${actual} lives, not ${lives}`);
  }

  // Scripted first-entry hazards must fire on that exact command and eject.
  expectHazard(raw: string, hazardId: string): void {
    const batch = this.submit(raw);
    if (
      batch.some(
        (event) =>
          event.type === 'hazard-triggered' && event.hazardId === hazardId,
      )
    )
      return;
    this.failures.push(`${raw} did not trigger ${hazardId}`);
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

  startQuiz(raw: string, quizId: string, ...flags: readonly string[]): void {
    let batch = this.submit(raw);
    for (const flag of flags) this.expectFlag(flag, raw);
    const started = batch.find((event) => event.type === 'quiz-started');
    if (started?.type !== 'quiz-started' || started.quizId !== quizId) {
      this.failures.push(`${raw} did not start ${quizId}`);
      return;
    }
    for (let guard = 0; guard < 10; guard += 1) {
      if (batch.some((event) => event.type === 'quiz-ended')) {
        const ended = batch.find((event) => event.type === 'quiz-ended');
        if (ended?.type !== 'quiz-ended' || !ended.passed)
          this.failures.push(`${quizId} did not pass`);
        return;
      }
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
