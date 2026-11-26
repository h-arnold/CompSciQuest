// ENG28-ACTIVATION-01 — render-time suppression of the `puzzle-activated`
// transcript notice. Authority: branch matrix row ENG28-ACTIVATION-01
// (SPECIFIED); ENGINE_ISSUES.md Batch E2 decision (line 50), issue #28
// (line 87), Group B (lines 124–127) and stream 2 (line 156);
// PLAYTEST_ISSUES.md §28 (lines 295–304); docs/developer/application-and-ui.md
// §6.1 and §9 (the effect → event mapping is unchanged).
// Every collaborator is an injected fake: no clock, storage, random source,
// DOM or network is used.
import { describe, expect, it } from 'vitest';
import { createEffectApplier } from '../../src/core/effects/EffectApplier';
import type { GameEvent } from '../../src/core/events/GameEvent';
import {
  FakeRandom,
  makeBundle,
  makeRuntimeState,
} from '../fixtures/persistence';
import { loadFormatEvent } from '../fixtures/turn';

// Real authored IDs from src/content/authored/puzzles.ts, quoted verbatim in
// the playtest observations in PLAYTEST_ISSUES.md §28.
const ACTIVATED_PUZZLE_IDS = [
  'puzzle-lift-the-shed',
  'puzzle-close-the-selvedge',
] as const;

// An internal-ID shape must never appear in player-facing transcript text.
const INTERNAL_ID =
  /\b(?:puzzle|node|actorstate|quiz|hazard|npc|hint|question|room|item|flag|scheduled|event)-[a-z0-9-]+/i;

// Inherited player-facing arms. The settled Batch E2 decision leaves all of
// these exactly as they were; only `puzzle-activated` changes in this slice.
const PLAYER_FACING_EVENTS: readonly GameEvent[] = [
  { type: 'message', text: 'A narrow corridor hums.' },
  { type: 'npc-spoke', actorId: 'npc-1', text: 'The pattern repeats.' },
  { type: 'topic-suggested', actorId: 'npc-1', text: 'Ask about loops.' },
  {
    type: 'hint-shown',
    hintId: 'hint-1',
    level: 1,
    text: 'Try the switch.',
  },
  {
    type: 'answer-evaluated',
    quizId: 'quiz-1',
    questionId: 'question-1',
    correct: true,
    explanation: 'A loop repeats.',
  },
  {
    type: 'room-entered',
    room: {
      id: 'room-stub-start',
      title: 'Pattern Bureau',
      description: 'A room of ticking switches.',
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
  { type: 'lives-changed', lives: 2 },
  { type: 'game-over', reason: 'lives exhausted', finalScore: 5 },
  { type: 'game-won', finalScore: 9 },
];

// `puzzle-solved` is suppressed by issue 22; both payload shapes stay silent.
const PUZZLE_SOLVED_EVENTS: readonly GameEvent[] = [
  {
    type: 'puzzle-solved',
    puzzleId: 'puzzle-sort-the-data-types',
    topicId: 'topic-1',
  },
  { type: 'puzzle-solved', puzzleId: 'puzzle-sort-the-data-types' },
];

// Bookkeeping/internal-state arms from the canonical GameEvent union. Their
// state reaches panels through GameViewData, never the transcript.
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
  { type: 'quiz-started', quizId: 'quiz-1', actorId: 'npc-1' },
  {
    type: 'quiz-ended',
    quizId: 'quiz-1',
    passed: true,
    reason: 'pass mark reached',
  },
  { type: 'hazard-triggered', hazardId: 'hazard-1', reason: 'overheated' },
  { type: 'conversation-started', actorId: 'npc-1' },
  { type: 'conversation-ended', actorId: 'npc-1', reason: 'left room' },
  { type: 'hint-penalty-applied', hintId: 'hint-1', delta: -1 },
];

const NO_GAIN_SCORES: readonly Extract<
  GameEvent,
  { readonly type: 'score-changed' }
>[] = [
  { type: 'score-changed', delta: 0, total: 5, reason: 'room:room-stub-start' },
  { type: 'score-changed', delta: -1, total: 4, reason: 'hint:hint-1' },
];

describe('formatEvent — ENG28-ACTIVATION-01 (PLAYTEST_ISSUES.md §28)', () => {
  for (const puzzleId of ACTIVATED_PUZZLE_IDS) {
    it(`ENG28-ACTIVATION-01: puzzle-activated for ${puzzleId} emits no transcript line`, async () => {
      const formatEvent = await loadFormatEvent();
      const bundle = makeBundle();

      const lines = formatEvent({ type: 'puzzle-activated', puzzleId }, bundle);
      const rendered = lines.join('\n');

      // Soft assertions surface every leak in the red output; the final hard
      // assertion is the primary contract (no transcript line at all).
      expect
        .soft(
          rendered,
          `${puzzleId}: no "is now active" notice may reach the log`,
        )
        .not.toMatch(/is now active\./);
      expect
        .soft(
          rendered,
          `${puzzleId}: the internal puzzle ID must not reach the log`,
        )
        .not.toContain(puzzleId);
      expect
        .soft(rendered, `${puzzleId}: no internal-ID shape may reach the log`)
        .not.toMatch(INTERNAL_ID);
      expect(
        lines,
        `${puzzleId}: puzzle-activated must emit no transcript line`,
      ).toEqual([]);
    });
  }

  it('ENG28-ACTIVATION-01: a mixed quiz-in-progress batch shows no activation notice but keeps genuine player text', async () => {
    const formatEvent = await loadFormatEvent();
    const bundle = makeBundle();

    // The playtest saw the notice after unrelated commands and during a quiz.
    const batch: readonly GameEvent[] = [
      { type: 'message', text: 'The corridor loom clatters on.' },
      { type: 'puzzle-activated', puzzleId: 'puzzle-lift-the-shed' },
      {
        type: 'question-asked',
        quizId: 'quiz-1',
        questionId: 'question-1',
        prompt: 'Which structure repeats?',
        options: ['A loop', 'A list'],
      },
      { type: 'puzzle-activated', puzzleId: 'puzzle-close-the-selvedge' },
      {
        type: 'answer-evaluated',
        quizId: 'quiz-1',
        questionId: 'question-1',
        correct: true,
        explanation: 'A loop repeats.',
      },
      {
        type: 'puzzle-solved',
        puzzleId: 'puzzle-lift-the-shed',
        topicId: 'topic-1',
      },
      {
        type: 'score-changed',
        delta: 2,
        total: 5,
        reason: 'puzzle:puzzle-lift-the-shed',
      },
      { type: 'topic-completed', topicId: 'topic-1' },
      { type: 'message', text: 'The loom stops.' },
    ];

    const rendered = batch
      .flatMap((event) => formatEvent(event, bundle))
      .join('\n');

    expect
      .soft(rendered, 'no activation notice in the rendered batch')
      .not.toMatch(/Puzzle .* is now active\./);
    for (const puzzleId of ACTIVATED_PUZZLE_IDS) {
      expect
        .soft(rendered, `no repeated ${puzzleId} notice in the rendered batch`)
        .not.toContain(puzzleId);
    }
    expect
      .soft(rendered, 'no internal-ID shape in the rendered batch')
      .not.toMatch(INTERNAL_ID);

    // These genuinely player-facing lines must survive the whole batch.
    for (const text of [
      'The corridor loom clatters on.',
      'Which structure repeats?',
      '1. A loop',
      '2. A list',
      'A loop repeats.',
      'The loom stops.',
    ]) {
      expect(rendered, `${text} must remain in the log`).toContain(text);
    }
  });

  it('ENG28-ACTIVATION-01: set-puzzle-active still emits one puzzle-activated event and marks the puzzle active', () => {
    // Guard against "fixing" the leak in the effect or event pipeline: this is
    // render-time suppression only (application-and-ui.md §9).
    const state = makeRuntimeState();
    const applier = createEffectApplier(state, {
      random: new FakeRandom([0]),
    });

    const events = applier.apply({
      kind: 'set-puzzle-active',
      puzzleId: 'puzzle-lift-the-shed',
    });

    expect(events).toEqual([
      { type: 'puzzle-activated', puzzleId: 'puzzle-lift-the-shed' },
    ]);
    expect(state.puzzles['puzzle-lift-the-shed']?.phase).toBe('active');
  });

  it('ENG28-ACTIVATION-01: inherited player-facing arms still render their genuine text', async () => {
    const formatEvent = await loadFormatEvent();
    const bundle = makeBundle();

    for (const event of PLAYER_FACING_EVENTS) {
      expect(
        formatEvent(event, bundle).length,
        `${event.type} must still render a player-facing line`,
      ).toBeGreaterThan(0);
    }

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
      expect(rendered, `${text} must remain in the log`).toContain(text);
    }
  });

  it('ENG28-ACTIVATION-01: puzzle-solved with and without topicId stays suppressed', async () => {
    const formatEvent = await loadFormatEvent();
    const bundle = makeBundle();

    for (const event of PUZZLE_SOLVED_EVENTS) {
      expect(
        formatEvent(event, bundle),
        `${event.type} must emit no transcript line`,
      ).toEqual([]);
    }
  });

  it('ENG28-ACTIVATION-01: topic-completed still yields one friendly line and no internal ID', async () => {
    const formatEvent = await loadFormatEvent();
    const bundle = makeBundle();

    const lines = formatEvent(
      { type: 'topic-completed', topicId: 'topic-1' },
      bundle,
    );

    expect(lines).toHaveLength(1);
    expect(lines[0]?.length ?? 0).toBeGreaterThan(0);
    expect(lines[0]).not.toContain('topic-1');
  });

  it('ENG28-ACTIVATION-01: score-changed prints one gain line only on a real gain', async () => {
    const formatEvent = await loadFormatEvent();
    const bundle = makeBundle();

    const gain = formatEvent(
      {
        type: 'score-changed',
        delta: 2,
        total: 5,
        reason: 'room:room-stub-start',
      },
      bundle,
    );
    expect(gain).toHaveLength(1);
    expect(gain[0]).toContain('2');
    expect(gain[0]).not.toContain('room:room-stub-start');

    for (const event of NO_GAIN_SCORES) {
      expect(
        formatEvent(event, bundle),
        `score-changed with delta ${event.delta} must emit no line`,
      ).toEqual([]);
    }
  });

  it('ENG28-ACTIVATION-01: all bookkeeping and internal-state arms stay silent', async () => {
    const formatEvent = await loadFormatEvent();
    const bundle = makeBundle();

    for (const event of INTERNAL_STATE_EVENTS) {
      expect(
        formatEvent(event, bundle),
        `${event.type} must emit no transcript line`,
      ).toEqual([]);
    }
  });
});
