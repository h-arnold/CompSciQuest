// Score-spam contract from ENGINE_ISSUES.md (Batch E2, issue #5) and the
// settled update to application-and-ui.md §6.1: internal-state events are
// silent, and score-changed prints only on a real gain, without a room ID.
import { describe, expect, it } from 'vitest';
import type { GameEvent } from '../../src/core/events/GameEvent';
import { makeBundle } from '../fixtures/persistence';
import { loadFormatEvent } from '../fixtures/turn';

const ROOM_ID = 'room-stub-start';
const ROOM_REASON = `room:${ROOM_ID}`;
const GAIN = 3;
const RUNNING_TOTAL = 11;

type ScoreChanged = Extract<GameEvent, { readonly type: 'score-changed' }>;

// ScoreTracker.announce() emits a score-changed event on every room entry even
// when award() skips the award: delta 0 is the spam case, negative is a penalty.
const NON_GAIN_EVENTS: readonly ScoreChanged[] = [
  { type: 'score-changed', delta: 0, total: 5, reason: ROOM_REASON },
  { type: 'score-changed', delta: -1, total: 4, reason: 'hint:hint-1' },
];

// The canonical GameEvent "bookkeeping" group. Sibling issues own their own
// replacements, so puzzle/quiz/inventory text is deliberately not asserted.
const INTERNAL_STATE_EVENTS: readonly GameEvent[] = [
  { type: 'flag-changed', flag: 'door-open:door-1', value: true },
  {
    type: 'item-moved',
    itemId: 'lamp',
    fromOwnerId: 'player',
    toOwnerId: 'room-stub-north',
  },
  { type: 'actor-state-changed', actorId: 'npc-1', stateId: 'idle' },
  { type: 'knowledge-gained', actorId: 'npc-1', topicId: 'topic-1' },
  { type: 'node-entered', actorId: 'npc-1', nodeId: 'node-1' },
  { type: 'node-exited', actorId: 'npc-1' },
  { type: 'scheduled', eventId: 'fuse-1', kind: 'fuse', remainingTurns: 2 },
];

const PLAYER_FACING_EVENTS: readonly GameEvent[] = [
  { type: 'message', text: 'A plain message.' },
  {
    type: 'room-entered',
    room: {
      id: ROOM_ID,
      title: 'Stub Hall',
      description: 'A small hall.',
      exits: ['north', 'west'],
    },
  },
  {
    type: 'question-asked',
    quizId: 'quiz-1',
    questionId: 'question-1',
    prompt: 'Which structure repeats?',
    options: ['A loop', 'A list'],
  },
  { type: 'topic-completed', topicId: 'topic-1' },
  { type: 'game-won', finalScore: RUNNING_TOTAL },
  { type: 'npc-spoke', actorId: 'npc-1', text: 'Hello there.' },
  {
    type: 'answer-evaluated',
    quizId: 'quiz-1',
    questionId: 'question-1',
    correct: true,
    explanation: 'A loop repeats.',
  },
  { type: 'hint-shown', hintId: 'hint-1', level: 1, text: 'Try the door.' },
];

describe('formatEvent score-gain contract', () => {
  it('ENG5-SCOREGAIN-01: a score-changed event with no gain emits no transcript lines', async () => {
    const formatEvent = await loadFormatEvent();
    const bundle = makeBundle();

    for (const event of NON_GAIN_EVENTS) {
      expect(
        formatEvent(event, bundle),
        `score-changed with delta ${event.delta} must be silent`,
      ).toEqual([]);
    }
  });

  it('ENG5-SCOREGAIN-01: a real gain emits exactly one friendly line with no room ID or reason', async () => {
    const formatEvent = await loadFormatEvent();
    const bundle = makeBundle();
    const event: ScoreChanged = {
      type: 'score-changed',
      delta: GAIN,
      total: RUNNING_TOTAL,
      reason: ROOM_REASON,
    };

    const lines = formatEvent(event, bundle);

    expect(lines).toHaveLength(1);
    const line = lines[0]!;
    expect(line).toContain(String(GAIN));
    expect(line).not.toContain(ROOM_ID);
    expect(line).not.toContain(event.reason);
  });

  it('ENG5-SCOREGAIN-01: internal-state bookkeeping events emit no transcript lines', async () => {
    const formatEvent = await loadFormatEvent();
    const bundle = makeBundle();

    for (const event of INTERNAL_STATE_EVENTS) {
      expect(
        formatEvent(event, bundle),
        `${event.type} must be silent`,
      ).toEqual([]);
    }
  });

  it('ENG5-SCOREGAIN-01: player-facing events still render transcript lines', async () => {
    const formatEvent = await loadFormatEvent();
    const bundle = makeBundle();

    for (const event of PLAYER_FACING_EVENTS) {
      expect(
        formatEvent(event, bundle).length,
        `${event.type} must render a line`,
      ).toBeGreaterThan(0);
    }
  });
});
