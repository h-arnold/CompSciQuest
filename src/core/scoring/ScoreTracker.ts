// Canonical signature from application-and-ui.md §8.
// ScoreTracker is the sole writer of AreaProgress.earnedScore.
import type { ContentBundle } from '../../content/ContentBundle';
import type { GameState } from '../GameState';
import type { GameEvent } from '../events/GameEvent';
import {
  areaPairForRoom,
  areaPairForTopic,
  ensureProgressRow,
} from '../AreaProgress';

export interface ScoreTracker {
  observe(events: readonly GameEvent[]): readonly GameEvent[];
  getTotal(): number;
}

export interface ScoreTrackerDependencies {
  readonly bundle?: ContentBundle;
}

type Announce = (delta: number, reason: string) => void;
type AreaPair = { readonly worldId: string; readonly areaId: string };

function positionPair(state: GameState): AreaPair {
  return {
    worldId: state.player.position.worldId,
    areaId: state.player.position.areaId,
  };
}

function pairForReason(
  state: GameState,
  bundle: ContentBundle | undefined,
  reason: string,
): AreaPair {
  if (reason.startsWith('room:'))
    return (
      areaPairForRoom(bundle, reason.slice('room:'.length)) ??
      positionPair(state)
    );
  if (reason.startsWith('puzzle:')) {
    const puzzle = bundle?.puzzles.getById(reason.slice('puzzle:'.length));
    return areaPairForTopic(bundle, puzzle?.topicId) ?? positionPair(state);
  }
  if (reason.startsWith('quiz:')) {
    const quiz = bundle?.quizzes.getById(reason.slice('quiz:'.length));
    return areaPairForTopic(bundle, quiz?.topicId) ?? positionPair(state);
  }
  return positionPair(state);
}

function award(
  state: GameState,
  bundle: ContentBundle | undefined,
  delta: number,
  reason: string,
): void {
  if (delta === 0) return;
  const pair = pairForReason(state, bundle, reason);
  ensureProgressRow(state, bundle, pair.worldId, pair.areaId).earnedScore +=
    delta;
}

function totalOf(state: GameState): number {
  return state.progress.reduce((total, entry) => total + entry.earnedScore, 0);
}

function hasScoreFor(events: readonly GameEvent[], reason: string): boolean {
  return events.some(
    (event) => event.type === 'score-changed' && event.reason === reason,
  );
}

function hasTopicCompletion(
  events: readonly GameEvent[],
  topicId: string,
): boolean {
  return events.some(
    (event) => event.type === 'topic-completed' && event.topicId === topicId,
  );
}

function roomEntered(
  state: GameState,
  bundle: ContentBundle | undefined,
  event: Extract<GameEvent, { type: 'room-entered' }>,
  announce: Announce,
): void {
  const pair = areaPairForRoom(bundle, event.room.id) ?? positionPair(state);
  const entry = ensureProgressRow(state, bundle, pair.worldId, pair.areaId);
  if (entry.visitedRooms.includes(event.room.id)) return;
  entry.visitedRooms.push(event.room.id);
  announce(
    bundle?.rooms.getById(event.room.id)?.score ?? 0,
    `room:${event.room.id}`,
  );
}

// Per-puzzle scoring: the declared score is awarded only for a scoreable
// spec topic (application-and-ui.md §10). The puzzle's phase is already solved
// when its event is observed, so the reason also gives idempotency.
function puzzleSolved(
  state: GameState,
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
  // A real solve arrives after the applier has set the phase to `solved`, with
  // its `topic-completed` achievement in the same batch. A replayed bare
  // `puzzle-solved` event on an already-solved puzzle has no such batch marker.
  if (
    state.puzzles[event.puzzleId]?.phase === 'solved' &&
    !hasTopicCompletion(emitted, topicId)
  ) {
    return;
  }
  announce(definition.score, reason);
}

function quizEnded(
  state: GameState,
  bundle: ContentBundle | undefined,
  event: Extract<GameEvent, { type: 'quiz-ended' }>,
  emitted: readonly GameEvent[],
  lastObserved: ReadonlyMap<string, boolean>,
  announce: Announce,
): void {
  if (!event.passed) return;
  const reason = `quiz:${event.quizId}`;
  if (hasScoreFor(emitted, reason)) return;
  const flag = `quiz-passed:${event.quizId}`;
  // `set-flag` applies before ScoreTracker observes, so the live state alone
  // cannot tell a first pass from a retry that re-sets an already-true flag
  // (application-and-ui.md §10). Compare with the value last observed: a pass
  // that was already true is a retry and scores nothing. A false→true
  // transition scores once, and so does a direct-achievement pass whose flag
  // is still false on the batch.
  const wasPassed = lastObserved.get(flag) === true;
  const isPassed = state.flags[flag] === true;
  if (isPassed && wasPassed) return;
  announce(bundle?.quizzes.getById(event.quizId)?.score ?? 0, reason);
}

function processEvent(
  state: GameState,
  bundle: ContentBundle | undefined,
  event: GameEvent,
  emitted: readonly GameEvent[],
  lastObserved: ReadonlyMap<string, boolean>,
  announce: Announce,
): void {
  if (event.type === 'score-changed') {
    award(state, bundle, event.delta, event.reason);
    return;
  }
  if (event.type === 'room-entered') {
    roomEntered(state, bundle, event, announce);
    return;
  }
  if (event.type === 'puzzle-solved') {
    puzzleSolved(state, bundle, event, emitted, announce);
    return;
  }
  if (event.type === 'quiz-ended') {
    quizEnded(state, bundle, event, emitted, lastObserved, announce);
    return;
  }
  if (event.type === 'hint-penalty-applied') {
    award(state, bundle, event.delta, `hint:${event.hintId}`);
  }
}

export function createScoreTracker(
  state: GameState,
  dependencies: ScoreTrackerDependencies = {},
): ScoreTracker {
  const { bundle } = dependencies;
  let emittedEvents: GameEvent[] = [];
  // Flag values observed so far, seeded from the live state when the tracker is
  // created (and therefore again on every rebind after a load). This is runtime
  // bookkeeping only: application-and-ui.md §10 adds no persisted field.
  let lastObserved: Map<string, boolean> = new Map(Object.entries(state.flags));
  const announce: Announce = (delta, reason): void => {
    award(state, bundle, delta, reason);
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
        processEvent(
          state,
          bundle,
          event,
          emittedEvents,
          lastObserved,
          announce,
        );
      }
      // Record this turn's flag values so the next turn compares against them.
      lastObserved = new Map(Object.entries(state.flags));
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
