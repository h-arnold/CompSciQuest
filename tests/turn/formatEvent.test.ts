// Event formatting contract from application-and-ui.md §6.1: every event kind
// yields at least one transcript line, with exits and numbered options shown.
import { describe, expect, it } from 'vitest';
import type { GameEvent } from '../../src/core/events/GameEvent';
import { makeBundle } from '../fixtures/persistence';
import { loadFormatEvent } from '../fixtures/turn';

const EVENTS: readonly GameEvent[] = [
  { type: 'message', text: 'A plain message.' },
  {
    type: 'room-entered',
    room: {
      id: 'room-stub-start',
      title: 'Stub Hall',
      description: 'A small hall.',
      exits: ['north', 'west'],
    },
  },
  {
    type: 'score-changed',
    delta: 2,
    total: 5,
    reason: 'stub award',
  },
  { type: 'topic-completed', topicId: 'topic-1' },
  { type: 'lives-changed', lives: 2 },
  { type: 'game-over', reason: 'lives exhausted', finalScore: 5 },
  { type: 'game-won', finalScore: 5 },
  { type: 'conversation-started', actorId: 'npc-1' },
  { type: 'npc-spoke', actorId: 'npc-1', text: 'Hello there.' },
  { type: 'conversation-ended', actorId: 'npc-1', reason: 'left room' },
  { type: 'topic-suggested', actorId: 'npc-1', text: 'Ask about loops.' },
  { type: 'hazard-triggered', hazardId: 'hazard-1', reason: 'test hazard' },
  { type: 'puzzle-activated', puzzleId: 'puzzle-1' },
  { type: 'puzzle-solved', puzzleId: 'puzzle-1', topicId: 'topic-1' },
  { type: 'quiz-started', quizId: 'quiz-1', actorId: 'npc-1' },
  {
    type: 'question-asked',
    quizId: 'quiz-1',
    questionId: 'question-1',
    prompt: 'Which structure repeats?',
    options: ['A loop', 'A list'],
  },
  {
    type: 'answer-evaluated',
    quizId: 'quiz-1',
    questionId: 'question-1',
    correct: true,
    explanation: 'A loop repeats.',
  },
  {
    type: 'quiz-ended',
    quizId: 'quiz-1',
    passed: true,
    reason: 'pass mark reached',
  },
  { type: 'hint-shown', hintId: 'hint-1', level: 1, text: 'Try the door.' },
  { type: 'hint-penalty-applied', hintId: 'hint-1', delta: -1 },
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
  {
    type: 'scheduled',
    eventId: 'fuse-1',
    kind: 'fuse',
    remainingTurns: 2,
  },
];

describe('formatEvent', () => {
  it('P-TURN-11: every event kind yields a line; rooms show exits and questions show numbered options', async () => {
    const formatEvent = await loadFormatEvent();
    const bundle = makeBundle();

    for (const event of EVENTS) {
      expect(
        formatEvent(event, bundle).length,
        `${event.type} must render a line`,
      ).toBeGreaterThan(0);
    }

    const roomLines = formatEvent(EVENTS[1]!, bundle).join('\n');
    expect(roomLines).toContain('Stub Hall');
    expect(roomLines).toContain('A small hall.');
    expect(roomLines).toContain('Exits:');
    expect(roomLines).toContain('north');
    expect(roomLines).toContain('west');

    const questionLines = formatEvent(EVENTS[15]!, bundle).join('\n');
    expect(questionLines).toContain('1. A loop');
    expect(questionLines).toContain('2. A list');
  });
});
