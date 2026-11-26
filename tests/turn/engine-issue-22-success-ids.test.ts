// ENG22-SUCCESSIDS-01 — puzzle success events must not leak implementation
// strings into the player-facing transcript, and the completion outcome must
// appear exactly once, from topic-completed alone.
//
// Authority:
//   .opencode/scratchpad/branch-matrix.md row ENG22-SUCCESSIDS-01.
//   ENGINE_ISSUES.md: Batch E2 decisions table (line 50), issue #22 (line 84),
//   Group B (lines 124-127) and parallel-execution stream 2 (line 156).
//   PLAYTEST_ISSUES.md §22 (lines 227-241) for the verbatim leaked lines.
//   docs/developer/application-and-ui.md §6.1 (suppressed puzzle-solved row),
//   §9 (set-puzzle-solved → puzzle-solved) and §10 (topic-completed scores no
//   points). Suppression is render-time only; scoring is untouched here.
//
// Every collaborator is an in-memory fake: no clock, storage, random source,
// network, file system or DOM is used. No wording outside this row's contract
// is asserted — puzzle-activated belongs to issue 28 and topic-completed
// wording is not prescribed. The answer-evaluated arm now carries the fixed
// `Correct. `/`Incorrect. ` verdict prefix settled by issue 10 / §6.1; the
// other player-facing arms below stay exactly as inherited.
import { describe, expect, it } from 'vitest';
import type { GameEvent } from '../../src/core/events/GameEvent';
import { makeBundle, makeTopic } from '../fixtures/persistence';
import { loadFormatEvent } from '../fixtures/turn';

const PUZZLE_ID = 'puzzle-sort-the-data-types';
const TOPIC_ID = 'topic-data-types';
const TOPIC_TITLE = 'Data types';

const BUNDLE = makeBundle({
  topics: [makeTopic({ id: TOPIC_ID, title: TOPIC_TITLE })],
});

const SOLVED_WITH_TOPIC: GameEvent = {
  type: 'puzzle-solved',
  puzzleId: PUZZLE_ID,
  topicId: TOPIC_ID,
};
const SOLVED_WITHOUT_TOPIC: GameEvent = {
  type: 'puzzle-solved',
  puzzleId: PUZZLE_ID,
};
const COMPLETED: GameEvent = { type: 'topic-completed', topicId: TOPIC_ID };

describe('formatEvent — ENG22-SUCCESSIDS-01 (PLAYTEST_ISSUES.md §22)', () => {
  it('ENG22-SUCCESSIDS-01: puzzle-solved with a topicId emits no transcript line', async () => {
    const formatEvent = await loadFormatEvent();

    const lines = formatEvent(SOLVED_WITH_TOPIC, BUNDLE);

    expect(lines, 'puzzle-solved must emit no line').toEqual([]);
    const rendered = lines.join('\n');
    expect(rendered).not.toContain(PUZZLE_ID);
    expect(rendered).not.toContain(TOPIC_ID);
    expect(rendered).not.toMatch(/\bPuzzle\b/);
    expect(rendered.toLowerCase()).not.toContain('completed');
  });

  it('ENG22-SUCCESSIDS-01: puzzle-solved without a topicId emits no transcript line', async () => {
    const formatEvent = await loadFormatEvent();

    const lines = formatEvent(SOLVED_WITHOUT_TOPIC, BUNDLE);

    expect(lines, 'puzzle-solved must emit no line').toEqual([]);
    const rendered = lines.join('\n');
    expect(rendered).not.toContain(PUZZLE_ID);
    expect(rendered).not.toMatch(/\bPuzzle\b/);
    expect(rendered.toLowerCase()).not.toContain('completed');
  });

  it('ENG22-SUCCESSIDS-01: a puzzle-solved and topic-completed batch shows the friendly completion outcome once', async () => {
    const formatEvent = await loadFormatEvent();
    const completionLines = formatEvent(COMPLETED, BUNDLE);

    const lines = [SOLVED_WITH_TOPIC, COMPLETED].flatMap((event) =>
      formatEvent(event, BUNDLE),
    );

    expect(lines, 'the batch must show only the topic-completed line').toEqual(
      completionLines,
    );
    expect(lines, 'the outcome must be rendered exactly once').toHaveLength(1);
    const rendered = lines.join('\n');
    expect(rendered, 'the friendly topic title must be shown').toContain(
      TOPIC_TITLE,
    );
    expect(rendered).not.toContain(TOPIC_ID);
    expect(rendered).not.toContain(PUZZLE_ID);
    expect(rendered).not.toMatch(/\bPuzzle\b/);
  });

  it('ENG22-SUCCESSIDS-01: player-facing text arms keep their contracted transcript lines', async () => {
    const formatEvent = await loadFormatEvent();
    const cases: readonly (readonly [GameEvent, readonly string[]])[] = [
      [
        { type: 'message', text: 'A narrow corridor hums.' },
        ['A narrow corridor hums.'],
      ],
      [
        {
          type: 'npc-spoke',
          actorId: 'npc-loomwright',
          text: 'The pattern repeats.',
        },
        ['The pattern repeats.'],
      ],
      [
        {
          type: 'topic-suggested',
          actorId: 'npc-loomwright',
          text: 'Ask about loops.',
        },
        ['Ask about loops.'],
      ],
      [
        {
          type: 'hint-shown',
          hintId: 'hint-pattern',
          level: 1,
          text: 'Try the switch.',
        },
        ['Try the switch.'],
      ],
      // Issue 10 / §6.1: verdict prefix is fixed copy; the explanation is verbatim.
      [
        {
          type: 'answer-evaluated',
          quizId: 'quiz-pattern-bureau',
          questionId: 'question-loops',
          correct: true,
          explanation: 'A loop repeats.',
        },
        ['Correct. A loop repeats.'],
      ],
    ];

    for (const [event, expected] of cases) {
      expect(
        formatEvent(event, BUNDLE),
        `${event.type} must keep its contracted transcript line`,
      ).toEqual(expected);
    }
  });

  it('ENG22-SUCCESSIDS-01: room-entered and question-asked stay exactly as inherited', async () => {
    const formatEvent = await loadFormatEvent();
    const room: GameEvent = {
      type: 'room-entered',
      room: {
        id: 'room-pattern-bureau',
        title: 'Pattern Bureau',
        description: 'A room of ticking switches.',
        exits: ['north', 'west'],
      },
    };
    const question: GameEvent = {
      type: 'question-asked',
      quizId: 'quiz-pattern-bureau',
      questionId: 'question-loops',
      prompt: 'Which structure repeats?',
      options: ['A loop', 'A list'],
    };

    expect(formatEvent(room, BUNDLE)).toEqual([
      'Pattern Bureau',
      '',
      'A room of ticking switches.',
      'Exits: north, west',
    ]);
    expect(formatEvent(question, BUNDLE)).toEqual([
      'Which structure repeats?',
      '1. A loop',
      '2. A list',
    ]);
  });

  it('ENG22-SUCCESSIDS-01: score-changed prints one friendly line only on a positive delta', async () => {
    const formatEvent = await loadFormatEvent();
    const gain: GameEvent = {
      type: 'score-changed',
      delta: 2,
      total: 5,
      reason: 'room:room-pattern-bureau',
    };

    expect(formatEvent(gain, BUNDLE)).toEqual(['You earned 2 points.']);

    for (const delta of [0, -1]) {
      const noGain: GameEvent = {
        type: 'score-changed',
        delta,
        total: 5,
        reason: 'hint:hint-pattern',
      };
      expect(
        formatEvent(noGain, BUNDLE),
        `score-changed with delta ${delta} must stay silent`,
      ).toEqual([]);
    }
  });

  it('ENG22-SUCCESSIDS-01: lives-changed, game-over and game-won stay exactly as inherited', async () => {
    const formatEvent = await loadFormatEvent();

    expect(formatEvent({ type: 'lives-changed', lives: 2 }, BUNDLE)).toEqual([
      'Lives: 2.',
    ]);
    expect(
      formatEvent(
        { type: 'game-over', reason: 'lives exhausted', finalScore: 5 },
        BUNDLE,
      ),
    ).toEqual(['Game over — lives exhausted. Final score: 5.']);
    expect(formatEvent({ type: 'game-won', finalScore: 9 }, BUNDLE)).toEqual([
      'You have won! Final score: 9.',
    ]);
  });

  // Re-anchored to ENG28-ACTIVATION-01: ENGINE_ISSUES.md issue #28 (line 87)
  // and the Batch E2 decision (line 50) suppress the activation notice entirely.
  // The owning contract is tests/turn/engine-issue-28-activation.test.ts.
  it('ENG28-ACTIVATION-01: puzzle-activated is suppressed, not kept as inherited', async () => {
    const formatEvent = await loadFormatEvent();

    expect(
      formatEvent({ type: 'puzzle-activated', puzzleId: PUZZLE_ID }, BUNDLE),
    ).toEqual([]);
  });

  it('ENG22-SUCCESSIDS-01: internal-state and bookkeeping arms remain suppressed', async () => {
    const formatEvent = await loadFormatEvent();
    const suppressedEvents: readonly GameEvent[] = [
      { type: 'quiz-started', quizId: 'quiz-pattern-bureau', actorId: 'npc-1' },
      {
        type: 'quiz-ended',
        quizId: 'quiz-pattern-bureau',
        passed: true,
        reason: 'pass mark reached',
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
      { type: 'flag-changed', flag: 'door-open:door-1', value: true },
      {
        type: 'item-moved',
        itemId: 'lamp',
        fromOwnerId: 'player',
        toOwnerId: 'room-stub-north',
      },
      {
        type: 'actor-state-changed',
        actorId: 'npc-loomwright',
        stateId: 'idle',
      },
      {
        type: 'knowledge-gained',
        actorId: 'npc-loomwright',
        topicId: TOPIC_ID,
      },
      {
        type: 'node-entered',
        actorId: 'npc-loomwright',
        nodeId: 'node-loomwright-demonstration',
      },
      { type: 'node-exited', actorId: 'npc-loomwright' },
      {
        type: 'scheduled',
        eventId: 'fuse-1',
        kind: 'fuse',
        remainingTurns: 2,
      },
    ];

    for (const event of suppressedEvents) {
      expect(
        formatEvent(event, BUNDLE),
        `${event.type} must remain suppressed`,
      ).toEqual([]);
    }
  });
});
