// Quiz command-time contracts from combat.md §3–§8, application-and-ui.md §8/§9
// and the QUIZ-HINT-02..06 branch-matrix rows.
import { describe, expect, it } from 'vitest';
import { catalogueOf } from '../../src/content/Catalogue';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { Command } from '../../src/core/commands/Command';
import type { Effect } from '../../src/core/effects/Effect';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { GameStateDto } from '../../src/core/GameState';
import type { QuizQuestion } from '../../src/core/combat/QuizQuestion';
import {
  authoredBundle,
  authoredGame,
  authoredNpc,
  authoredState,
  eventTypes,
  FOREMAN_ID,
  gameplaySnapshot,
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

function questionFor(questionId: string): QuizQuestion {
  const question = authoredBundle.questions.getById(questionId);
  if (question === undefined) {
    throw new Error(
      `Authored question '${questionId}' is missing from the catalogue.`,
    );
  }
  return question;
}

function wrongAnswer(question: QuizQuestion): string {
  const option = question.correctOptionIds[0];
  if (option === undefined) {
    throw new Error(`Question '${question.id}' has no correct option.`);
  }
  return `answer ${((option + 1) % question.options.length) + 1}`;
}

function finishWithWrongAnswers(
  game: ReturnType<typeof authoredGame>['game'],
  storage: ReturnType<typeof authoredGame>['storage'],
): readonly GameEvent[] {
  let batch: readonly GameEvent[] = [];
  for (let guard = 0; guard < 10; guard += 1) {
    const saved = readSave(game, storage).dto.state;
    const quizId = saved.quiz.activeQuizId;
    if (quizId === undefined) return batch;
    const questionId = saved.quiz.questionIds[saved.quiz.index];
    if (questionId === undefined) {
      throw new Error(
        'An active quiz must have a current question before it can finish.',
      );
    }
    batch = game.submit(wrongAnswer(questionFor(questionId)));
    if (batch.every((event) => event.type !== 'answer-evaluated')) {
      throw new Error(
        `The answer command for '${questionId}' did not emit answer-evaluated.`,
      );
    }
  }
  throw new Error(
    'The quiz did not finish within its authored question count.',
  );
}

function startEffect(quizId: string): Effect {
  const quiz = authoredBundle.quizzes.getById(quizId);
  if (quiz === undefined) {
    throw new Error(`Authored quiz '${quizId}' is missing from the catalogue.`);
  }
  return { kind: 'start-quiz', quizId, actorId: quiz.actorId };
}

describe('authored quiz flow', () => {
  it('QUIZ-HINT-02: a topic start-quiz exits the node, increments the attempt and emits quiz-started then question-asked', () => {
    const state = authoredState({
      roomId: 'room-switch-floor',
      progress: [switchyardProgress()],
      npcs: {
        [FOREMAN_ID]: authoredNpc(FOREMAN_ID, {
          stateId: 'talking',
          activeNodeId: 'node-foreman-switch-lesson',
        }),
      },
    });
    const command: Command = {
      kind: 'ask',
      actorId: FOREMAN_ID,
      topic: 'switches',
    };
    const { game, storage, bus } = authoredGame({
      state,
      overrides: { resolve: () => command },
    });

    const batch = game.submit('ask foreman about switches');
    const types = eventTypes(batch);
    const exited = types.indexOf('node-exited');
    const started = types.indexOf('quiz-started');
    const asked = types.indexOf('question-asked');
    expect(exited).toBeGreaterThanOrEqual(0);
    expect(started).toBeGreaterThan(exited);
    expect(asked).toBeGreaterThan(started);
    expect(batch).toContainEqual({
      type: 'quiz-started',
      quizId: 'quiz-switchyard',
      actorId: FOREMAN_ID,
    });
    const saved = readSave(game, storage).dto.state;
    expect(saved.quizAttempts['quiz-switchyard']).toBe(1);
    expect(saved.quiz.activeQuizId).toBe('quiz-switchyard');
    expect(new Set(saved.quiz.questionIds)).toEqual(
      new Set(['q-dr-01', 'q-dr-02', 'q-dr-03']),
    );
    expect(saved.npcs[FOREMAN_ID]).not.toHaveProperty('activeNodeId');
    expect(bus.batches[0]).toEqual(batch);
  });

  it('QUIZ-HINT-03: answer is 1-based, records the choice and explanation, advances the question and rejects an out-of-range choice', () => {
    const state = authoredState({
      roomId: 'room-binary-hall',
      progress: [switchyardProgress()],
      quiz: activeQuiz('quiz-data-types'),
    });
    const { game, storage } = authoredGame({ state });

    const first = game.submit('answer 1');
    expect(first).toContainEqual({
      type: 'answer-evaluated',
      quizId: 'quiz-data-types',
      questionId: 'q-dr-04',
      correct: true,
      explanation: questionFor('q-dr-04').explanation,
    });
    expect(first).toContainEqual(
      expect.objectContaining({
        type: 'question-asked',
        questionId: 'q-dr-05',
      }),
    );
    const afterFirst = readSave(game, storage).dto.state;
    expect(afterFirst.quiz.index).toBe(1);
    expect(afterFirst.quiz.correctCount).toBe(1);
    expect(afterFirst.quiz.answers).toEqual([0]);

    const invalid = game.submit('answer 99');
    expect(messageTexts(invalid).some((text) => text.trim() !== '')).toBe(true);
    expect(invalid.some((event) => event.type === 'answer-evaluated')).toBe(
      false,
    );
    const afterInvalid = readSave(game, storage).dto.state;
    expect(afterInvalid.quiz.index).toBe(1);
    expect(afterInvalid.quiz.answers).toEqual([0]);
    expect(game.getViewData().turn).toBe(afterFirst.turn + 1);
  });

  it('QUIZ-HINT-04: exactly passMark correct answers passes, applies onPass once and resets the active attempt', () => {
    const state = authoredState({
      roomId: 'room-binary-hall',
      progress: [switchyardProgress()],
      quiz: activeQuiz('quiz-data-types'),
    });
    const { game, storage } = authoredGame({ state });
    const answers = ['answer 1', 'answer 2', 'answer 1', 'answer 1'];
    let batch: readonly GameEvent[] = [];
    for (const answer of answers) batch = game.submit(answer);

    const types = eventTypes(batch);
    expect(types).toContain('quiz-ended');
    expect(types).toContain('topic-completed');
    expect(types.indexOf('quiz-ended')).toBeLessThan(
      types.indexOf('topic-completed'),
    );
    expect(batch).toContainEqual({
      type: 'quiz-ended',
      quizId: 'quiz-data-types',
      passed: true,
      reason: expect.any(String),
    });
    expect(batch).toContainEqual({
      type: 'topic-completed',
      topicId: 'data-types',
    });
    expect(batch).toContainEqual({
      type: 'flag-changed',
      flag: 'quiz-passed:quiz-data-types',
      value: true,
    });
    expect(batch).toContainEqual({
      type: 'score-changed',
      delta: 1,
      total: 1,
      reason: 'quiz:quiz-data-types',
    });
    const saved = readSave(game, storage).dto.state;
    expect(saved.quiz).not.toHaveProperty('activeQuizId');
    expect(saved.quiz.index).toBe(0);
    expect(saved.quiz.correctCount).toBe(0);
    expect(saved.quiz.answers).toEqual([]);
    expect(saved.progress[0]?.completedTopics).toContain('data-types');
    expect(saved.progress[0]?.earnedScore).toBe(1);
  });

  it('QUIZ-HINT-05: failure costs one life, returns to the area start, preserves topic progress and restores the actor to ready', () => {
    for (const lives of [3, 1]) {
      const state = authoredState({
        roomId: 'room-compression-press',
        progress: [
          switchyardProgress({
            completedTopics: ['data-types'],
            earnedScore: 2,
          }),
        ],
        quiz: activeQuiz('quiz-data-compression'),
        npcs: {
          'npc-press-operator': authoredNpc('npc-press-operator', {
            stateId: 'talking',
          }),
        },
        player: {
          position: {
            worldId: 'world-wjec-gcse-computer-science-2025-spec',
            areaId: 'area-1-2-1-data-representation',
            roomId: 'room-compression-press',
          },
          inventory: [],
          lives,
        },
      });
      const { game, storage } = authoredGame({ state });
      const finalBatch = finishWithWrongAnswers(game, storage);
      expect(finalBatch).toContainEqual({
        type: 'quiz-ended',
        quizId: 'quiz-data-compression',
        passed: false,
        reason: expect.any(String),
      });
      const saved = readSave(game, storage).dto.state;
      expect(saved.player.lives).toBe(lives - 1);
      expect(saved.player.position.roomId).toBe('room-binary-hall');
      expect(saved.progress[0]?.completedTopics).toEqual(['data-types']);
      expect(saved.npcs['npc-press-operator']?.stateId).toBe(
        'actorstate-ready',
      );
      expect(finalBatch).toContainEqual(
        expect.objectContaining({
          type: 'room-entered',
          room: expect.objectContaining({ id: 'room-binary-hall' }),
        }),
      );
      if (lives !== 1) continue;
      expect(game.getViewData().status).toBe('lost');
      expect(finalBatch).toContainEqual({
        type: 'game-over',
        reason: 'lives exhausted',
        finalScore: 2,
      });
    }
  });

  it('QUIZ-HINT-06: the retry cap blocks at the limit, starts one below it and treats an omitted limit as unlimited', () => {
    const baseQuiz = authoredBundle.quizzes.getById('quiz-data-types');
    if (baseQuiz === undefined) {
      throw new Error('The authored data-types quiz is missing.');
    }
    const limitedBundle: ContentBundle = {
      ...authoredBundle,
      quizzes: catalogueOf([{ ...baseQuiz, attemptsAllowed: 2 }]),
    };
    const effect = startEffect('quiz-data-types');

    const blockedState = authoredState({
      roomId: 'room-binary-hall',
      progress: [switchyardProgress()],
      quizAttempts: { 'quiz-data-types': 2 },
    });
    const blocked = authoredGame({
      bundle: limitedBundle,
      state: blockedState,
      overrides: { dispatch: () => [effect] },
    });
    const before = readSave(blocked.game, blocked.storage).dto.state;
    blocked.bus.batches.length = 0;
    const blockedBatch = blocked.game.submit('look');
    const after = readSave(blocked.game, blocked.storage).dto.state;
    expect(messageTexts(blockedBatch).some((text) => text.trim() !== '')).toBe(
      true,
    );
    expect(blockedBatch.some((event) => event.type === 'quiz-started')).toBe(
      false,
    );
    expect(gameplaySnapshot(after)).toBe(gameplaySnapshot(before));
    expect(blocked.game.getViewData().turn).toBe(before.turn + 1);

    const allowedState = authoredState({
      roomId: 'room-binary-hall',
      progress: [switchyardProgress()],
      quizAttempts: { 'quiz-data-types': 1 },
    });
    const allowed = authoredGame({
      bundle: limitedBundle,
      state: allowedState,
      overrides: { dispatch: () => [effect] },
    });
    const allowedBatch = allowed.game.submit('look');
    expect(allowedBatch).toContainEqual(
      expect.objectContaining({ type: 'quiz-started' }),
    );
    expect(allowedBatch).toContainEqual(
      expect.objectContaining({ type: 'question-asked' }),
    );
    expect(
      readSave(allowed.game, allowed.storage).dto.state.quizAttempts[
        'quiz-data-types'
      ],
    ).toBe(2);

    const unlimitedState = authoredState({
      roomId: 'room-switch-floor',
      progress: [switchyardProgress()],
      quizAttempts: { 'quiz-switchyard': 99 },
    });
    const unlimited = authoredGame({
      state: unlimitedState,
      overrides: { dispatch: () => [startEffect('quiz-switchyard')] },
    });
    expect(unlimited.game.submit('look')).toContainEqual(
      expect.objectContaining({ type: 'quiz-started' }),
    );
    expect(
      readSave(unlimited.game, unlimited.storage).dto.state.quizAttempts[
        'quiz-switchyard'
      ],
    ).toBe(100);
  });
});
