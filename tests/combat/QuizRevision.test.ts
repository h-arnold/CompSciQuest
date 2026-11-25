// Revision-1 red tests for the quiz contracts in combat.md §3–§5, §7,
// application-and-ui.md §9–§10, shared-rules.md §5/§7 and the branch-matrix
// rows E-QUIZ-02, E-QUIZ-05, P-QUIZ-05, P-QUIZ-07, P-QUIZ-12, S-QUIZ-01,
// QUIZ-HINT-02. No committed expectation is altered; these are appended tests.
import { describe, expect, it } from 'vitest';
import type { Game } from '../../src/application/Game';
import type { Command } from '../../src/core/commands/Command';
import { createQuizSystem } from '../../src/core/combat/QuizSystem';
import type { Effect } from '../../src/core/effects/Effect';
import { createEffectApplier } from '../../src/core/effects/EffectApplier';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { GameStateDto } from '../../src/core/GameState';
import type { Random } from '../../src/core/Random';
import { createScoreTracker } from '../../src/core/scoring/ScoreTracker';
import type { TurnContext } from '../../src/core/TurnContext';
import {
  authoredBundle,
  authoredGame,
  authoredNpc,
  authoredState,
  FOREMAN_ID,
  gameplaySnapshot,
  messageTexts,
  readSave,
  switchyardProgress,
} from '../fixtures/authored';
import { FakeRandom, type MemoryStorage } from '../fixtures/persistence';

const START_SEED = 123_456_789;
const DATA_TYPES_QUIZ = 'quiz-data-types';
const SWITCHYARD_QUIZ = 'quiz-switchyard';

// Local test-only port for the amended Random contract (shared-rules.md §7):
// the production port gains optional `seed`/`setSeed`, so this fake carries
// them without editing src or forcing a type through `as any`.
interface SeededRandomPort extends Random {
  seed: number;
  setSeed(seed: number): void;
}

class SeededRandom implements SeededRandomPort {
  seed: number;

  constructor(seed: number) {
    this.seed = seed >>> 0;
  }

  nextInt(maxExclusive: number): number {
    if (maxExclusive <= 0) return 0;
    this.seed = (Math.imul(this.seed, 1_664_525) + 1_013_904_223) >>> 0;
    return this.seed % maxExclusive;
  }

  setSeed(seed: number): void {
    this.seed = seed >>> 0;
  }
}

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

function startEffect(quizId: string): Effect {
  const quiz = authoredBundle.quizzes.getById(quizId);
  if (quiz === undefined) {
    throw new Error(`Authored quiz '${quizId}' is missing from the catalogue.`);
  }
  return { kind: 'start-quiz', quizId, actorId: quiz.actorId };
}

function quizState(): ReturnType<typeof authoredState> {
  return authoredState({
    roomId: 'room-binary-hall',
    progress: [switchyardProgress()],
    quiz: activeQuiz(DATA_TYPES_QUIZ),
  });
}

function answerCorrectly(
  game: Game,
  storage: MemoryStorage,
): readonly GameEvent[] {
  let batch: readonly GameEvent[] = [];
  for (let guard = 0; guard < 10; guard += 1) {
    const quiz = readSave(game, storage).dto.state.quiz;
    if (quiz.activeQuizId === undefined) return batch;
    const questionId = quiz.questionIds[quiz.index];
    if (questionId === undefined) {
      throw new Error('An active quiz must have a current question.');
    }
    const question = authoredBundle.questions.getById(questionId);
    if (question === undefined) {
      throw new Error(`Authored question '${questionId}' is missing.`);
    }
    const option = question.correctOptionIds[0];
    if (option === undefined) {
      throw new Error(`Question '${questionId}' has no correct option.`);
    }
    batch = game.submit(`answer ${option + 1}`);
    if (batch.every((event) => event.type !== 'answer-evaluated')) {
      throw new Error(`The answer for '${questionId}' was not evaluated.`);
    }
  }
  throw new Error('The quiz did not finish within its question count.');
}

function quizDispatch(
  byCommand: Readonly<Partial<Record<Command['kind'], string>>>,
) {
  const quizSystem = createQuizSystem({ bundle: authoredBundle });
  return (command: Command, context: TurnContext): readonly Effect[] => {
    if (command.kind === 'answer') {
      return quizSystem.handle(command, context.state);
    }
    const quizId = byCommand[command.kind];
    return quizId === undefined ? [] : [startEffect(quizId)];
  };
}

describe('quiz revision contracts', () => {
  it('E-QUIZ-05: the seed advances on a draw, is saved, and a restore continues the sequence', () => {
    const startingSeed = START_SEED;
    const controlRandom = new SeededRandom(startingSeed);
    const dispatch = quizDispatch({
      look: SWITCHYARD_QUIZ,
      inventory: DATA_TYPES_QUIZ,
    });
    const control = authoredGame({
      state: authoredState({
        roomId: 'room-binary-hall',
        rngSeed: startingSeed,
        progress: [switchyardProgress()],
      }),
      random: controlRandom,
      overrides: { dispatch },
    });

    // One quiz start draws twice for its three-question shuffle.
    expect(control.game.submit('look')).toContainEqual(
      expect.objectContaining({ type: 'quiz-started' }),
    );
    const saved = readSave(control.game, control.storage).dto;
    expect(saved.state.rngSeed).toBe(controlRandom.seed);
    expect(saved.state.rngSeed).not.toBe(startingSeed);

    answerCorrectly(control.game, control.storage);
    control.game.submit('inventory');
    const controlOrder = readSave(control.game, control.storage).dto.state.quiz
      .questionIds;

    const reloadRandom = new SeededRandom(987_654_321);
    const reload = authoredGame({
      state: authoredState({ roomId: 'room-arrival' }),
      random: reloadRandom,
      overrides: { dispatch },
    });
    reload.game.continueGame(saved);
    expect(reloadRandom.seed).toBe(saved.state.rngSeed);

    const restoredQuiz = readSave(reload.game, reload.storage).dto.state.quiz;
    expect(restoredQuiz.questionIds).toEqual(saved.state.quiz.questionIds);

    answerCorrectly(reload.game, reload.storage);
    reload.game.submit('inventory');
    const reloadOrder = readSave(reload.game, reload.storage).dto.state.quiz
      .questionIds;

    expect(reloadOrder).toEqual(controlOrder);
    const contentOrder =
      authoredBundle.quizzes.getById(DATA_TYPES_QUIZ)?.questionIds;
    if (contentOrder === undefined) {
      throw new Error('The authored data-types quiz is missing.');
    }
    expect(new Set(reloadOrder)).toEqual(new Set(contentOrder));
  });

  it('E-QUIZ-02: passing the same quiz twice awards its score exactly once', () => {
    const dispatch = quizDispatch({ look: DATA_TYPES_QUIZ });
    const { game, storage } = authoredGame({
      state: authoredState({
        roomId: 'room-binary-hall',
        progress: [switchyardProgress()],
      }),
      overrides: { dispatch },
    });

    game.submit('look');
    const firstPass = answerCorrectly(game, storage);
    expect(firstPass).toContainEqual(
      expect.objectContaining({ type: 'quiz-ended', passed: true }),
    );
    expect(
      readSave(game, storage).dto.state.flags[`quiz-passed:${DATA_TYPES_QUIZ}`],
    ).toBe(true);

    expect(game.submit('look')).toContainEqual(
      expect.objectContaining({
        type: 'quiz-started',
        quizId: DATA_TYPES_QUIZ,
      }),
    );
    const retryPass = answerCorrectly(game, storage);

    const awards = [...firstPass, ...retryPass].filter(
      (event) =>
        event.type === 'score-changed' &&
        event.reason === `quiz:${DATA_TYPES_QUIZ}`,
    );
    expect(awards).toHaveLength(1);
    expect(
      retryPass.some(
        (event) =>
          event.type === 'score-changed' &&
          event.reason === `quiz:${DATA_TYPES_QUIZ}`,
      ),
    ).toBe(false);
    const after = readSave(game, storage).dto.state;
    expect(after.progress[0]?.earnedScore).toBe(1);
    expect(after.flags[`quiz-passed:${DATA_TYPES_QUIZ}`]).toBe(true);
  });

  it('E-QUIZ-02: a pass already recorded in the restored state does not score again', () => {
    const passEvents: readonly GameEvent[] = [
      {
        type: 'quiz-ended',
        quizId: DATA_TYPES_QUIZ,
        passed: true,
        reason: 'the type test is retaken',
      },
      {
        type: 'flag-changed',
        flag: `quiz-passed:${DATA_TYPES_QUIZ}`,
        value: true,
      },
    ];

    // Restored state from a save taken after the first pass: the flag is
    // already true, and the retry re-sets it (shared-rules.md §5 still emits
    // flag-changed). That re-set is not a transition, so it scores nothing.
    const restored = authoredState({
      flags: { 'quiz-passed:quiz-data-types': true },
      progress: [switchyardProgress()],
    });
    const restoredTracker = createScoreTracker(restored, {
      bundle: authoredBundle,
    });
    const replayed = restoredTracker.observe(passEvents);
    expect(
      replayed.some(
        (event) =>
          event.type === 'score-changed' &&
          event.reason === `quiz:${DATA_TYPES_QUIZ}`,
      ),
    ).toBe(false);
    expect(restored.progress[0]?.earnedScore).toBe(0);
    expect(restoredTracker.getTotal()).toBe(0);

    // The same construction with the flag still false is the first pass, so
    // the guard is a transition, not a blanket block on quiz-ended.
    const fresh = authoredState({ progress: [switchyardProgress()] });
    const freshTracker = createScoreTracker(fresh, { bundle: authoredBundle });
    const firstPass = freshTracker.observe(passEvents);
    expect(
      firstPass.filter(
        (event) =>
          event.type === 'score-changed' &&
          event.reason === `quiz:${DATA_TYPES_QUIZ}`,
      ),
    ).toHaveLength(1);
    expect(fresh.progress[0]?.earnedScore).toBe(1);
  });

  it('E-QUIZ-02: a re-set flag still emits and is not a score transition', () => {
    const state = authoredState({
      flags: { 'quiz-passed:quiz-data-types': true },
      progress: [switchyardProgress()],
    });
    const applier = createEffectApplier(state, { random: new FakeRandom([0]) });

    const repeated = applier.apply({
      kind: 'set-flag',
      flag: 'quiz-passed:quiz-data-types',
      value: true,
    });
    expect(repeated).toEqual([
      {
        type: 'flag-changed',
        flag: 'quiz-passed:quiz-data-types',
        value: true,
      },
    ]);
    expect(state.flags['quiz-passed:quiz-data-types']).toBe(true);

    const tracker = createScoreTracker(state, { bundle: authoredBundle });
    expect(
      tracker.observe(repeated).some((event) => event.type === 'score-changed'),
    ).toBe(false);
    expect(state.progress[0]?.earnedScore).toBe(0);
  });

  it('P-QUIZ-05: option-text aliases evaluate the matching 0-based option', () => {
    const exact = authoredGame({ state: quizState() });
    const exactBatch = exact.game.submit('answer integer');
    expect(exactBatch).toContainEqual(
      expect.objectContaining({
        type: 'answer-evaluated',
        quizId: DATA_TYPES_QUIZ,
        questionId: 'q-dr-04',
        correct: true,
      }),
    );
    const exactQuiz = readSave(exact.game, exact.storage).dto.state.quiz;
    expect(exactQuiz.answers).toEqual([0]);
    expect(exactQuiz.index).toBe(1);

    const mixed = authoredGame({ state: quizState() });
    const mixedBatch = mixed.game.submit('  AnSwEr   InTeGeR  ');
    expect(mixedBatch).toContainEqual(
      expect.objectContaining({
        type: 'answer-evaluated',
        questionId: 'q-dr-04',
        correct: true,
      }),
    );
    expect(readSave(mixed.game, mixed.storage).dto.state.quiz.answers).toEqual([
      0,
    ]);

    const unmatched = authoredGame({ state: quizState() });
    const beforeState = readSave(unmatched.game, unmatched.storage).dto.state;
    const beforeQuiz = beforeState.quiz;
    const unmatchedBatch = unmatched.game.submit('answer purple elephant');
    expect(
      messageTexts(unmatchedBatch).some((text) => text.trim() !== ''),
    ).toBe(true);
    expect(
      unmatchedBatch.some((event) => event.type === 'answer-evaluated'),
    ).toBe(false);
    expect(messageTexts(unmatchedBatch)).not.toContain(
      "I don't understand that.",
    );
    expect(readSave(unmatched.game, unmatched.storage).dto.state.quiz).toEqual(
      beforeQuiz,
    );
    expect(unmatched.game.getViewData().turn).toBe(beforeState.turn + 1);

    const numeric = authoredGame({ state: quizState() });
    const numericBatch = numeric.game.submit('answer 1');
    expect(numericBatch).toContainEqual(
      expect.objectContaining({
        type: 'answer-evaluated',
        questionId: 'q-dr-04',
        correct: true,
      }),
    );
    expect(
      readSave(numeric.game, numeric.storage).dto.state.quiz.answers,
    ).toEqual([0]);
  });

  it('P-QUIZ-07: answer outside a quiz gives the friendly message and changes no state', () => {
    for (const raw of ['answer', 'answer 1'] as const) {
      const { game, storage } = authoredGame({
        state: authoredState({
          roomId: 'room-binary-hall',
          progress: [switchyardProgress()],
        }),
      });
      const before = readSave(game, storage).dto.state;
      const batch = game.submit(raw);

      expect(messageTexts(batch)).toEqual(['Nobody asked you anything.']);
      expect(batch.filter((event) => event.type === 'message')).toHaveLength(1);
      const after = readSave(game, storage).dto.state;
      expect(gameplaySnapshot(after)).toBe(gameplaySnapshot(before));
      expect(game.getViewData().turn).toBe(before.turn + 1);
    }
  });

  it('P-QUIZ-12: the pass path emits quiz-ended, topic-completed and actor-state-changed', () => {
    const { game, storage } = authoredGame({
      state: quizState(),
    });
    const finalBatch = answerCorrectly(game, storage);
    const readyState = authoredNpc(FOREMAN_ID).stateId;

    expect(finalBatch).toContainEqual(
      expect.objectContaining({
        type: 'quiz-ended',
        quizId: DATA_TYPES_QUIZ,
        passed: true,
      }),
    );
    expect(finalBatch).toContainEqual({
      type: 'topic-completed',
      topicId: 'data-types',
    });
    expect(finalBatch).toContainEqual({
      type: 'actor-state-changed',
      actorId: FOREMAN_ID,
      stateId: readyState,
    });
    expect(readSave(game, storage).dto.state.npcs[FOREMAN_ID]?.stateId).toBe(
      readyState,
    );
  });

  it('S-QUIZ-01: a mid-quiz save round-trips every active-quiz field', () => {
    const midQuiz: GameStateDto['quiz'] = {
      activeQuizId: DATA_TYPES_QUIZ,
      questionIds: ['q-dr-05', 'q-dr-04', 'q-dr-07', 'q-dr-06'],
      index: 2,
      correctCount: 1,
      answers: [0, 1],
    };
    const { game, storage } = authoredGame({
      state: authoredState({
        roomId: 'room-binary-hall',
        progress: [switchyardProgress()],
        quiz: midQuiz,
      }),
    });
    const saved = readSave(game, storage).dto;

    const restored = authoredGame({ state: authoredState() });
    restored.game.continueGame(saved);
    const restoredQuiz = readSave(restored.game, restored.storage).dto.state
      .quiz;

    expect(restoredQuiz).toEqual(midQuiz);
    expect(restored.game.getViewData().activeQuiz).toMatchObject({
      quizId: DATA_TYPES_QUIZ,
      questionNumber: 3,
      questionCount: 4,
    });
  });

  it('QUIZ-HINT-02: the same fixed random draws the same question order, not merely a set', () => {
    const contentOrder =
      authoredBundle.quizzes.getById(SWITCHYARD_QUIZ)?.questionIds;
    if (contentOrder === undefined) {
      throw new Error('The authored switchyard quiz is missing.');
    }
    const first = authoredGame({
      state: authoredState({
        roomId: 'room-switch-floor',
        progress: [switchyardProgress()],
      }),
      random: new FakeRandom([1, 0]),
      overrides: { dispatch: () => [startEffect(SWITCHYARD_QUIZ)] },
    });
    const second = authoredGame({
      state: authoredState({
        roomId: 'room-switch-floor',
        progress: [switchyardProgress()],
      }),
      random: new FakeRandom([1, 0]),
      overrides: { dispatch: () => [startEffect(SWITCHYARD_QUIZ)] },
    });

    first.game.submit('look');
    second.game.submit('look');
    const firstOrder = readSave(first.game, first.storage).dto.state.quiz
      .questionIds;
    const secondOrder = readSave(second.game, second.storage).dto.state.quiz
      .questionIds;

    expect(firstOrder).toEqual(secondOrder);
    expect(firstOrder).not.toEqual(contentOrder);
    expect(new Set(firstOrder)).toEqual(new Set(contentOrder));
  });
});
