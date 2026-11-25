// Canonical signature from application-and-ui.md §8.
// ScoreTracker is the sole writer of AreaProgress.earnedScore.
import type { ContentBundle } from '../../content/ContentBundle';
import type { AreaProgress, GameState } from '../GameState';
import type { GameEvent } from '../events/GameEvent';

export interface ScoreTracker {
  observe(events: readonly GameEvent[]): readonly GameEvent[];
  getTotal(): number;
}

export interface ScoreTrackerDependencies {
  readonly bundle?: ContentBundle;
}

type Announce = (delta: number, reason: string) => void;

function progressEntry(state: GameState): AreaProgress | undefined {
  return state.progress[0];
}

function award(state: GameState, delta: number): void {
  if (delta === 0) return;
  const entry = progressEntry(state);
  if (entry === undefined) return;
  (entry as { earnedScore: number }).earnedScore += delta;
}

function totalOf(state: GameState): number {
  return state.progress.reduce((total, entry) => total + entry.earnedScore, 0);
}

function hasScoreFor(events: readonly GameEvent[], reason: string): boolean {
  return events.some(
    (event) => event.type === 'score-changed' && event.reason === reason,
  );
}

function roomEntered(
  state: GameState,
  bundle: ContentBundle | undefined,
  event: Extract<GameEvent, { type: 'room-entered' }>,
  announce: Announce,
): void {
  const entry = progressEntry(state);
  if (entry === undefined || entry.visitedRooms.includes(event.room.id)) return;
  (entry as unknown as { visitedRooms: string[] }).visitedRooms.push(
    event.room.id,
  );
  announce(
    bundle?.rooms.getById(event.room.id)?.score ?? 0,
    `room:${event.room.id}`,
  );
}

// Per-puzzle scoring: the declared score is awarded only for a scoreable
// spec topic (application-and-ui.md §10). The puzzle's phase is already solved
// when its event is observed, so the reason also gives idempotency.
function puzzleSolved(
  bundle: ContentBundle | undefined,
  event: Extract<GameEvent, { type: 'puzzle-solved' }>,
  emitted: readonly GameEvent[],
  announce: Announce,
): void {
  const definition = bundle?.puzzles.getById(event.puzzleId);
  if (definition === undefined || definition.score === 0) return;
  const topicId = definition.topicId;
  if (topicId === undefined) return;
  const topic = bundle?.specTopics.getById(topicId);
  if (
    topic === undefined ||
    topic.status !== 'covered' ||
    topic.evidence.trim().length === 0
  ) {
    return;
  }
  const reason = `puzzle:${event.puzzleId}`;
  if (hasScoreFor(emitted, reason)) return;
  announce(definition.score, reason);
}

function quizEnded(
  bundle: ContentBundle | undefined,
  event: Extract<GameEvent, { type: 'quiz-ended' }>,
  emitted: readonly GameEvent[],
  announce: Announce,
): void {
  if (!event.passed) return;
  const reason = `quiz:${event.quizId}`;
  if (hasScoreFor(emitted, reason)) return;
  announce(bundle?.quizzes.getById(event.quizId)?.score ?? 0, reason);
}

function processEvent(
  state: GameState,
  bundle: ContentBundle | undefined,
  event: GameEvent,
  emitted: readonly GameEvent[],
  announce: Announce,
): void {
  if (event.type === 'score-changed') {
    award(state, event.delta);
    return;
  }
  if (event.type === 'room-entered') {
    roomEntered(state, bundle, event, announce);
    return;
  }
  if (event.type === 'puzzle-solved') {
    puzzleSolved(bundle, event, emitted, announce);
    return;
  }
  if (event.type === 'quiz-ended') {
    quizEnded(bundle, event, emitted, announce);
    return;
  }
  if (event.type === 'hint-penalty-applied') award(state, event.delta);
}

export function createScoreTracker(
  state: GameState,
  dependencies: ScoreTrackerDependencies = {},
): ScoreTracker {
  const { bundle } = dependencies;
  let emittedEvents: GameEvent[] = [];
  const announce: Announce = (delta, reason): void => {
    award(state, delta);
    const event: GameEvent = {
      type: 'score-changed',
      delta,
      total: totalOf(state),
      reason,
    };
    emittedEvents.push(event);
  };
  return {
    observe(events): readonly GameEvent[] {
      emittedEvents = [...events];
      for (const event of events) {
        processEvent(state, bundle, event, emittedEvents, announce);
      }
      // Every score event in the published batch reports the running total
      // after the whole batch has been awarded, not a mid-batch snapshot.
      const finalTotal = totalOf(state);
      return emittedEvents.map((event) =>
        event.type === 'score-changed'
          ? { ...event, total: finalTotal }
          : event,
      );
    },
    getTotal(): number {
      return totalOf(state);
    },
  };
}
