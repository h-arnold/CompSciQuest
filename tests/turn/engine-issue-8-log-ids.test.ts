// ENG8-LOGID-01 — internal IDs must not leak into the player-facing log.
// Authority: ENGINE_ISSUES.md Batch E2 ("Suppress all internal-state lines in
// formatEvent"), issue #8, Group B, stream 2; PLAYTEST_ISSUES.md §8 verbatim
// leaks; src/core/events/GameEvent.ts is the canonical event union.
// Every collaborator is injected; no clock, storage, random source or DOM.
import { describe, expect, it } from 'vitest';
import type { GameEvent } from '../../src/core/events/GameEvent';
import { makeBundle } from '../fixtures/persistence';
import { loadFormatEvent } from '../fixtures/turn';

// The six event kinds owned by this slice. Their payloads use the leaked
// developer identifiers from PLAYTEST_ISSUES.md §8 verbatim.
const INTERNAL_STATE_EVENTS: readonly GameEvent[] = [
  {
    type: 'quiz-started',
    quizId: 'quiz-pattern-bureau',
    actorId: 'npc-loomwright',
  },
  {
    type: 'quiz-ended',
    quizId: 'quiz-pattern-bureau',
    passed: false,
    reason: 'the quiz was failed',
  },
  {
    type: 'hazard-triggered',
    hazardId: 'hazard-overheated',
    reason: 'overheated',
  },
  { type: 'conversation-started', actorId: 'npc-loomwright' },
  {
    type: 'conversation-ended',
    actorId: 'npc-loomwright',
    reason: 'left room',
  },
  { type: 'hint-penalty-applied', hintId: 'hint-pattern', delta: -1 },
];

// Player-facing controls retained by the settled decision. Wording owned by
// sibling issues (issue 5 score wording, issue 10 prefix, issue 22/28 puzzle
// and topic messages) is deliberately not asserted here.
const PLAYER_FACING_EVENTS: readonly GameEvent[] = [
  { type: 'message', text: 'A narrow corridor hums.' },
  {
    type: 'npc-spoke',
    actorId: 'npc-loomwright',
    text: 'The pattern repeats.',
  },
  {
    type: 'topic-suggested',
    actorId: 'npc-loomwright',
    text: 'Ask about loops.',
  },
  {
    type: 'hint-shown',
    hintId: 'hint-pattern',
    level: 1,
    text: 'Try the switch.',
  },
  {
    type: 'answer-evaluated',
    quizId: 'quiz-pattern-bureau',
    questionId: 'question-loops',
    correct: true,
    explanation: 'A loop repeats.',
  },
  {
    type: 'room-entered',
    room: {
      id: 'room-pattern-bureau',
      title: 'Pattern Bureau',
      description: 'A room of ticking switches.',
      exits: ['north'],
    },
  },
  {
    type: 'question-asked',
    quizId: 'quiz-pattern-bureau',
    questionId: 'question-loops',
    prompt: 'Which structure repeats?',
    options: ['A loop', 'A list'],
  },
  {
    type: 'score-changed',
    delta: 2,
    total: 5,
    reason: 'room:room-pattern-bureau',
  },
  { type: 'topic-completed', topicId: 'topic-1' },
  { type: 'lives-changed', lives: 2 },
  { type: 'game-over', reason: 'lives exhausted', finalScore: 5 },
  { type: 'game-won', finalScore: 9 },
];

// Bookkeeping events with the other two verbatim leaks in PLAYTEST_ISSUES.md §8.
const LEAKED_BOOKKEEPING_EVENTS: readonly GameEvent[] = [
  {
    type: 'node-entered',
    actorId: 'npc-loomwright',
    nodeId: 'node-loomwright-demonstration',
  },
  {
    type: 'actor-state-changed',
    actorId: 'npc-loomwright',
    stateId: 'actorstate-loomwright-witnessing',
  },
];

const INTERNAL_ID =
  /\b(?:node|actorstate|quiz|hazard|puzzle|npc|hint|question|room|item|flag|scheduled|event)-[a-z0-9-]+/i;

describe('formatEvent — ENG8-LOGID-01 (PLAYTEST_ISSUES.md §8)', () => {
  for (const event of INTERNAL_STATE_EVENTS) {
    it(`ENG8-LOGID-01: ${event.type} emits no player-facing transcript line`, async () => {
      const formatEvent = await loadFormatEvent();
      const bundle = makeBundle();

      expect(
        formatEvent(event, bundle),
        `${event.type} must emit no transcript line`,
      ).toEqual([]);
    });
  }

  it('ENG8-LOGID-01: player-facing controls still render their genuine game text', async () => {
    const formatEvent = await loadFormatEvent();
    const bundle = makeBundle();

    for (const event of PLAYER_FACING_EVENTS) {
      expect(
        formatEvent(event, bundle).length,
        `${event.type} must render player-facing text`,
      ).toBeGreaterThan(0);
    }

    // Text carried by the event itself is the contract, not formatter wording.
    const rendered = PLAYER_FACING_EVENTS.flatMap((event) =>
      formatEvent(event, bundle),
    ).join('\n');
    for (const text of [
      'A narrow corridor hums.',
      'The pattern repeats.',
      'Ask about loops.',
      'Try the switch.',
      'A loop repeats.',
      'Pattern Bureau',
      'A room of ticking switches.',
      'Exits:',
      'Which structure repeats?',
      '1. A loop',
      '2. A list',
    ]) {
      expect(rendered, `${text} must appear in player-facing output`).toContain(
        text,
      );
    }
  });

  it('ENG8-LOGID-01: a mixed batch interleaving internal and player-facing events leaks no internal IDs', async () => {
    const formatEvent = await loadFormatEvent();
    const bundle = makeBundle();
    const mixed: readonly GameEvent[] = [
      INTERNAL_STATE_EVENTS[0]!,
      PLAYER_FACING_EVENTS[0]!,
      LEAKED_BOOKKEEPING_EVENTS[0]!,
      INTERNAL_STATE_EVENTS[1]!,
      PLAYER_FACING_EVENTS[1]!,
      LEAKED_BOOKKEEPING_EVENTS[1]!,
      INTERNAL_STATE_EVENTS[2]!,
      PLAYER_FACING_EVENTS[5]!,
      INTERNAL_STATE_EVENTS[3]!,
      PLAYER_FACING_EVENTS[2]!,
      INTERNAL_STATE_EVENTS[4]!,
      PLAYER_FACING_EVENTS[6]!,
      INTERNAL_STATE_EVENTS[5]!,
      PLAYER_FACING_EVENTS[7]!,
    ];

    const renderedLines = mixed.flatMap((event) => formatEvent(event, bundle));
    const allLines = renderedLines.join('\n');

    for (const event of INTERNAL_STATE_EVENTS) {
      expect(
        formatEvent(event, bundle),
        `${event.type} must stay silent in a mixed batch`,
      ).toEqual([]);
    }
    expect(allLines).not.toMatch(INTERNAL_ID);
    for (const leak of [
      'Quiz quiz-pattern-bureau started.',
      'Quiz quiz-pattern-bureau failed:',
      'node-loomwright-demonstration',
      'actorstate-loomwright-witnessing',
    ]) {
      expect(allLines, `${leak} must not reach the log`).not.toContain(leak);
    }
    for (const text of [
      'A narrow corridor hums.',
      'The pattern repeats.',
      'Ask about loops.',
      'Pattern Bureau',
      'Which structure repeats?',
    ]) {
      expect(allLines, `${text} must remain in the log`).toContain(text);
    }
  });
});
