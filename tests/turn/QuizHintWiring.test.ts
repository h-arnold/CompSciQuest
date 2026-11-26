// Production composition contract for QUIZ-HINT-01: real quiz command handling
// and the real hint reaction must join the existing ordered turn pipeline.
import { describe, expect, it } from 'vitest';
import type { GameStateDto } from '../../src/core/GameState';
import {
  authoredBundle,
  authoredGame,
  authoredState,
  eventTypes,
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

describe('production quiz and hint wiring', () => {
  it('QUIZ-HINT-01: all authored quizzes and hints resolve, phase 4 solves before hinting and quiz answers stay in the command batch', () => {
    // Whole-game accepted totals: HANDOFF §7, walkthrough §8.4.
    expect(authoredBundle.quizzes.all).toHaveLength(14);
    expect(authoredBundle.hints.all).toHaveLength(13);
    for (const quiz of authoredBundle.quizzes.all) {
      expect(authoredBundle.quizzes.getById(quiz.id)).toBe(quiz);
    }
    for (const hint of authoredBundle.hints.all) {
      expect(authoredBundle.hints.getById(hint.id)).toBe(hint);
    }

    const hintState = authoredState({
      roomId: 'room-hex-deck',
      flags: { 'switches-set': true, 'carry-cleared': true },
      counters: { 'turns-since:puzzle-set-the-switches': 3 },
      puzzles: { 'puzzle-set-the-switches': { phase: 'unsolved' } },
      progress: [switchyardProgress()],
    });
    const hintFixture = authoredGame({ state: hintState });
    const hintBatch = hintFixture.game.submit('hint');
    const types = eventTypes(hintBatch);
    expect(types).toContain('puzzle-solved');
    expect(types).toContain('hint-shown');
    expect(types.indexOf('hint-shown')).toBeGreaterThan(
      types.indexOf('puzzle-solved'),
    );
    expect(hintBatch).toContainEqual(
      expect.objectContaining({
        type: 'hint-shown',
        hintId: 'hint-number-systems',
        level: 1,
      }),
    );
    expect(hintFixture.bus.batches).toEqual([hintBatch]);

    const quizState = authoredState({
      roomId: 'room-switch-floor',
      flags: { 'switch-cooled': true },
      quiz: activeQuiz('quiz-switchyard'),
      progress: [switchyardProgress()],
    });
    const quizFixture = authoredGame({ state: quizState });
    const answerBatch = quizFixture.game.submit('answer 1');
    expect(answerBatch).toContainEqual(
      expect.objectContaining({
        type: 'answer-evaluated',
        quizId: 'quiz-switchyard',
        correct: true,
      }),
    );
    const saved = readSave(quizFixture.game, quizFixture.storage).dto.state;
    expect(saved.quiz.answers).toEqual([0]);
    expect(saved.quiz.index).toBe(1);
    expect(quizFixture.bus.batches[0]).toEqual(answerBatch);
  });
});
