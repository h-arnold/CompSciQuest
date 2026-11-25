// Hint context, cooldown, adaptive delivery, persistence and penalty contracts
// from hints.md §2–§6 and QUIZ-HINT-07..10.
import { describe, expect, it } from 'vitest';
import { catalogueOf } from '../../src/content/Catalogue';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { Command } from '../../src/core/commands/Command';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { GameStateDto } from '../../src/core/GameState';
import type {
  HintLevel,
  HintSequence,
} from '../../src/core/hints/HintSequence';
import type { ScoreTracker } from '../../src/core/scoring/ScoreTracker';
import {
  authoredBundle,
  authoredGame,
  authoredState,
  messageTexts,
  readSave,
  switchyardProgress,
} from '../fixtures/authored';

function activeQuiz(quizId: string): GameStateDto['quiz'] {
  const quiz = authoredBundle.quizzes.getById(quizId);
  if (quiz === undefined) {
    throw new Error(`Authored quiz '${quizId}' is missing from the catalogue.`);
  }
  return {
    activeQuizId: quizId,
    questionIds: [...quiz.questionIds],
    index: 0,
    correctCount: 0,
    answers: [],
  };
}

function levelOf(
  bundle: ContentBundle,
  hintId: string,
  level: number,
): HintLevel {
  const definition = bundle.hints
    .getById(hintId)
    ?.levels.find((entry) => entry.level === level);
  if (definition === undefined) {
    throw new Error(`Authored hint '${hintId}' has no level ${level}.`);
  }
  return definition;
}

function hintFixture(
  command: Command,
  state: ReturnType<typeof authoredState>,
  bundle: ContentBundle = authoredBundle,
  score?: ScoreTracker,
) {
  return authoredGame({
    bundle,
    state,
    overrides: {
      resolve: () => command,
      ...(score && { score }),
    },
  });
}

describe('authored hint delivery', () => {
  it('QUIZ-HINT-07: explicit target beats active quiz, then quiz beats room context, and no match gives a friendly message', () => {
    const scenarios: readonly {
      readonly command: Command;
      readonly state: ReturnType<typeof authoredState>;
      readonly hintId?: string;
    }[] = [
      {
        command: { kind: 'hint', targetId: 'quiz-switchyard' },
        state: authoredState({
          roomId: 'room-hex-deck',
          flags: { 'carry-cleared': true },
          counters: {
            'failed-attempts:quiz-switchyard': 1,
            'turns-since:puzzle-sort-the-data-types': 3,
            'turns-since:puzzle-set-the-switches': 3,
          },
          quiz: activeQuiz('quiz-data-types'),
          progress: [switchyardProgress()],
        }),
        hintId: 'hint-switchyard',
      },
      {
        command: { kind: 'hint' },
        state: authoredState({
          roomId: 'room-hex-deck',
          flags: { 'carry-cleared': true },
          counters: { 'turns-since:puzzle-sort-the-data-types': 3 },
          quiz: activeQuiz('quiz-data-types'),
          progress: [switchyardProgress()],
        }),
        hintId: 'hint-data-types',
      },
      {
        command: { kind: 'hint' },
        state: authoredState({
          roomId: 'room-hex-deck',
          flags: { 'carry-cleared': true },
          counters: { 'turns-since:puzzle-set-the-switches': 3 },
          progress: [switchyardProgress()],
        }),
        hintId: 'hint-number-systems',
      },
      {
        command: { kind: 'hint', targetId: 'missing-target' },
        state: authoredState({ roomId: 'room-arrival' }),
      },
    ];

    for (const scenario of scenarios) {
      const { game, storage } = hintFixture(scenario.command, scenario.state);
      const batch = game.submit('hint');
      const shown = batch.filter((event) => event.type === 'hint-shown');
      if (scenario.hintId === undefined) {
        expect(
          messageTexts(batch).some((text) =>
            /no hints available here/iu.test(text),
          ),
        ).toBe(true);
        expect(shown).toEqual([]);
      } else {
        expect(shown).toEqual([
          {
            type: 'hint-shown',
            hintId: scenario.hintId,
            level: 1,
            text: levelOf(authoredBundle, scenario.hintId, 1).text,
          },
        ]);
        const saved = readSave(game, storage).dto.state;
        expect(saved.hints[scenario.hintId]).toEqual({
          levelsShown: [1],
          lastShownTurn: saved.turn,
        });
      }
    }
  });

  it('QUIZ-HINT-08: unlocked levels ascend without skipping, cooldown blocks early repeats and allows the boundary', () => {
    const state = authoredState({
      roomId: 'room-switch-floor',
      turn: 6,
      flags: { 'switch-cooled': true },
      counters: {
        'failed-attempts:quiz-switchyard': 1,
        'hints-shown:hint-switchyard': 1,
      },
      progress: [switchyardProgress()],
    });
    const command: Command = { kind: 'hint', targetId: 'quiz-switchyard' };
    const { game, storage, bus } = hintFixture(command, state);
    const puzzlesBefore = state.puzzles;
    const quizBefore = state.quiz;

    const first = game.submit('hint');
    expect(first).toContainEqual({
      type: 'hint-shown',
      hintId: 'hint-switchyard',
      level: 1,
      text: levelOf(authoredBundle, 'hint-switchyard', 1).text,
    });
    const afterFirst = readSave(game, storage).dto;
    expect(afterFirst.state.hints['hint-switchyard']).toEqual({
      levelsShown: [1],
      lastShownTurn: 7,
    });
    expect(afterFirst.state.counters['hints-shown:hint-switchyard']).toBe(2);

    game.continueGame({
      ...afterFirst,
      state: { ...afterFirst.state, turn: 7 },
    });
    bus.batches.length = 0;
    const early = game.submit('hint');
    expect(
      messageTexts(early).some((text) =>
        /think about it for a moment/iu.test(text),
      ),
    ).toBe(true);
    expect(early.some((event) => event.type === 'hint-shown')).toBe(false);
    const afterEarly = readSave(game, storage).dto.state;
    expect(afterEarly.hints['hint-switchyard']).toEqual(
      afterFirst.state.hints['hint-switchyard'],
    );

    game.continueGame({
      ...afterFirst,
      state: { ...afterEarly, turn: 8 },
    });
    bus.batches.length = 0;
    const boundary = game.submit('hint');
    expect(boundary).toContainEqual({
      type: 'hint-shown',
      hintId: 'hint-switchyard',
      level: 2,
      text: levelOf(authoredBundle, 'hint-switchyard', 2).text,
    });
    expect(bus.batches).toEqual([boundary]);
    const afterBoundary = readSave(game, storage).dto.state;
    expect(afterBoundary.hints['hint-switchyard']).toEqual({
      levelsShown: [1, 2],
      lastShownTurn: 9,
    });
    expect(afterBoundary.puzzles).toEqual(puzzlesBefore);
    expect(afterBoundary.quiz).toEqual(quizBefore);
  });

  it('QUIZ-HINT-09: automatic hints wait for the wrong-answer or stuck-turn threshold and never consume the answer', () => {
    const quizState = authoredState({
      roomId: 'room-switch-floor',
      flags: { 'switch-cooled': true },
      counters: { 'failed-attempts:quiz-switchyard': 0 },
      quiz: activeQuiz('quiz-switchyard'),
      progress: [switchyardProgress()],
    });
    const quizFixture = authoredGame({ state: quizState });
    expect(
      quizFixture.game
        .submit('look')
        .some((event) => event.type === 'hint-shown'),
    ).toBe(false);
    const wrong = quizFixture.game.submit('answer 2');
    expect(wrong).toContainEqual(
      expect.objectContaining({ type: 'answer-evaluated', correct: false }),
    );
    const shown = wrong.find((event) => event.type === 'hint-shown');
    expect(shown).toEqual({
      type: 'hint-shown',
      hintId: 'hint-switchyard',
      level: 1,
      text: levelOf(authoredBundle, 'hint-switchyard', 1).text,
    });
    const afterWrong = readSave(quizFixture.game, quizFixture.storage).dto
      .state;
    expect(afterWrong.counters['failed-attempts:quiz-switchyard']).toBe(1);
    expect(afterWrong.quiz.index).toBe(1);
    expect(afterWrong.quiz.correctCount).toBe(0);
    expect(afterWrong.quiz.answers).toEqual([1]);
    const question = authoredBundle.questions.getById('q-dr-01');
    if (question !== undefined && shown?.type === 'hint-shown') {
      expect(shown.text).not.toContain(question.options[0] ?? '');
    }

    const stuckState = authoredState({
      roomId: 'room-binary-hall',
      counters: { 'turns-since:puzzle-sort-the-data-types': 1 },
      puzzles: { 'puzzle-sort-the-data-types': { phase: 'active' } },
      progress: [switchyardProgress()],
    });
    const stuck = authoredGame({ state: stuckState });
    expect(
      stuck.game.submit('look').some((event) => event.type === 'hint-shown'),
    ).toBe(false);
    const threshold = stuck.game.submit('look');
    expect(threshold).toContainEqual({
      type: 'hint-shown',
      hintId: 'hint-data-types',
      level: 1,
      text: levelOf(authoredBundle, 'hint-data-types', 1).text,
    });
    expect(
      readSave(stuck.game, stuck.storage).dto.state.counters[
        'turns-since:puzzle-sort-the-data-types'
      ],
    ).toBe(3);
  });
});

describe('authored hint persistence and score separation', () => {
  it('QUIZ-HINT-10: hint state and counters round-trip, shown levels are not repeated and ScoreTracker alone applies the penalty', () => {
    const penalised: HintSequence = {
      id: 'hint-test',
      targets: ['quiz-test'],
      levels: [
        {
          level: 1,
          text: 'Compare the first clue with the marked row.',
          unlock: { kind: 'all', of: [] },
          scorePenalty: -2,
        },
      ],
      cooldownTurns: 2,
    };
    const bundle: ContentBundle = {
      ...authoredBundle,
      hints: catalogueOf([penalised]),
    };
    const state = authoredState({
      roomId: 'room-switch-floor',
      turn: 4,
      flags: { 'switch-cooled': true },
      progress: [switchyardProgress({ earnedScore: 5 })],
    });
    const command: Command = { kind: 'hint', targetId: 'hint-test' };
    const fixture = hintFixture(command, state, bundle);
    const batch = fixture.game.submit('hint');
    expect(batch).toContainEqual({
      type: 'hint-penalty-applied',
      hintId: 'hint-test',
      delta: -2,
    });
    const saved = readSave(fixture.game, fixture.storage).dto;
    expect(saved.state.hints['hint-test']).toEqual({
      levelsShown: [1],
      lastShownTurn: 5,
    });
    expect(saved.state.counters['hints-shown:hint-test']).toBe(1);
    expect(saved.state.progress[0]?.earnedScore).toBe(3);

    fixture.game.continueGame({ ...saved, state: { ...saved.state, turn: 6 } });
    fixture.bus.batches.length = 0;
    const repeated = fixture.game.submit('hint');
    expect(repeated.some((event) => event.type === 'hint-shown')).toBe(false);
    expect(messageTexts(repeated).some((text) => text.trim() !== '')).toBe(
      true,
    );
    const afterReload = readSave(fixture.game, fixture.storage).dto.state;
    expect(afterReload.hints['hint-test']).toEqual(
      saved.state.hints['hint-test'],
    );
    expect(afterReload.counters['hints-shown:hint-test']).toBe(1);
    expect(afterReload.progress[0]?.earnedScore).toBe(3);

    const passThrough: ScoreTracker = {
      observe(events: readonly GameEvent[]): readonly GameEvent[] {
        return events;
      },
      getTotal(): number {
        return 5;
      },
    };
    const separated = hintFixture(command, state, bundle, passThrough);
    const separatedBatch = separated.game.submit('hint');
    expect(separatedBatch).toContainEqual({
      type: 'hint-penalty-applied',
      hintId: 'hint-test',
      delta: -2,
    });
    expect(
      readSave(separated.game, separated.storage).dto.state.progress[0]
        ?.earnedScore,
    ).toBe(5);

    const defaultSequence: HintSequence = {
      ...penalised,
      id: 'hint-default-penalty',
      levels: [
        {
          level: 1,
          text: 'Start with the labelled row.',
          unlock: { kind: 'all', of: [] },
        },
      ],
    };
    const defaultBundle: ContentBundle = {
      ...authoredBundle,
      hints: catalogueOf([defaultSequence]),
    };
    const defaultFixture = hintFixture(
      { kind: 'hint', targetId: 'hint-default-penalty' },
      state,
      defaultBundle,
    );
    const defaultBatch = defaultFixture.game.submit('hint');
    expect(defaultBatch).toContainEqual({
      type: 'hint-penalty-applied',
      hintId: 'hint-default-penalty',
      delta: 0,
    });
    expect(
      readSave(defaultFixture.game, defaultFixture.storage).dto.state
        .progress[0]?.earnedScore,
    ).toBe(5);
  });
});
