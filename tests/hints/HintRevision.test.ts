// Revision-1 red tests for hint delivery and automatic cadence contracts in
// hints.md §3–§4, application-and-ui.md §9 and the branch-matrix rows
// E-HINT-05, QUIZ-HINT-07 and QUIZ-HINT-08. Existing tests are untouched.
import { describe, expect, it } from 'vitest';
import { catalogueOf } from '../../src/content/Catalogue';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { Command } from '../../src/core/commands/Command';
import type { GameStateDto } from '../../src/core/GameState';
import type { HintSequence } from '../../src/core/hints/HintSequence';
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

function hintLevelText(hintId: string, level: number): string {
  const definition = authoredBundle.hints
    .getById(hintId)
    ?.levels.find((entry) => entry.level === level);
  if (definition === undefined) {
    throw new Error(`Authored hint '${hintId}' has no level ${level}.`);
  }
  return definition.text;
}

describe('hint revision contracts', () => {
  it('QUIZ-HINT-07: a typed hint argument goes through the resolver; an unknown phrase acts as a bare hint', () => {
    const quizContext = authoredState({
      roomId: 'room-binary-hall',
      counters: { 'turns-since:puzzle-sort-the-data-types': 3 },
      quiz: activeQuiz('quiz-data-types'),
      progress: [switchyardProgress()],
    });
    const bare = authoredGame({ state: quizContext });
    const bareBatch = bare.game.submit('hint');
    expect(bareBatch).toContainEqual({
      type: 'hint-shown',
      hintId: 'hint-data-types',
      level: 1,
      text: hintLevelText('hint-data-types', 1),
    });

    const typed = authoredGame({
      state: authoredState({
        roomId: 'room-binary-hall',
        counters: { 'turns-since:puzzle-sort-the-data-types': 3 },
        quiz: activeQuiz('quiz-data-types'),
        progress: [switchyardProgress()],
      }),
    });
    const typedBatch = typed.game.submit('hint quiz-switchyard');
    expect(typedBatch).toContainEqual({
      type: 'hint-shown',
      hintId: 'hint-data-types',
      level: 1,
      text: hintLevelText('hint-data-types', 1),
    });
    expect(messageTexts(typedBatch)).not.toContain("I don't understand that.");

    const roomContext = authoredGame({
      state: authoredState({
        roomId: 'room-switch-floor',
        counters: { 'failed-attempts:quiz-switchyard': 1 },
        progress: [switchyardProgress()],
      }),
    });
    const roomBatch = roomContext.game.submit('hint wibble wobble');
    expect(roomBatch).toContainEqual({
      type: 'hint-shown',
      hintId: 'hint-switchyard',
      level: 1,
      text: hintLevelText('hint-switchyard', 1),
    });
    expect(messageTexts(roomBatch)).not.toContain("I don't understand that.");
  });

  it('E-HINT-05: a later turn with no new wrong answer delivers no further automatic level', () => {
    const { game, storage } = authoredGame({
      state: authoredState({
        roomId: 'room-switch-floor',
        counters: { 'failed-attempts:quiz-switchyard': 0 },
        quiz: activeQuiz('quiz-switchyard'),
        progress: [switchyardProgress()],
      }),
    });

    const firstWrong = game.submit('answer 2');
    expect(firstWrong).toContainEqual({
      type: 'hint-shown',
      hintId: 'hint-switchyard',
      level: 1,
      text: hintLevelText('hint-switchyard', 1),
    });

    const quietTurn = game.submit('look');
    expect(quietTurn.some((event) => event.type === 'hint-shown')).toBe(false);
    expect(
      readSave(game, storage).dto.state.hints['hint-switchyard']?.levelsShown,
    ).toEqual([1]);

    const secondWrong = game.submit('answer 2');
    expect(secondWrong).toContainEqual({
      type: 'hint-shown',
      hintId: 'hint-switchyard',
      level: 2,
      text: hintLevelText('hint-switchyard', 2),
    });
    expect(
      readSave(game, storage).dto.state.hints['hint-switchyard']?.levelsShown,
    ).toEqual([1, 2]);
  });

  it('E-HINT-05: the stuck-turn counter delivers once on the crossing turn only', () => {
    const { game, storage } = authoredGame({
      state: authoredState({
        roomId: 'room-binary-hall',
        counters: { 'turns-since:puzzle-sort-the-data-types': 1 },
        puzzles: { 'puzzle-sort-the-data-types': { phase: 'active' } },
        progress: [switchyardProgress()],
      }),
    });

    expect(
      game.submit('look').some((event) => event.type === 'hint-shown'),
    ).toBe(false);
    const crossing = game.submit('look');
    expect(crossing).toContainEqual({
      type: 'hint-shown',
      hintId: 'hint-data-types',
      level: 1,
      text: hintLevelText('hint-data-types', 1),
    });
    const quietTurn = game.submit('look');
    expect(quietTurn.some((event) => event.type === 'hint-shown')).toBe(false);
    expect(
      readSave(game, storage).dto.state.hints['hint-data-types']?.levelsShown,
    ).toEqual([1]);
  });

  it('QUIZ-HINT-08: a locked lower level is not skipped to reach an unlocked higher level', () => {
    const noSkip: HintSequence = {
      id: 'hint-no-skip',
      targets: ['quiz-no-skip'],
      levels: [
        {
          level: 1,
          text: 'Open the first drawer before the second.',
          unlock: { kind: 'flag-set', flag: 'level-one-open' },
        },
        {
          level: 2,
          text: 'The second drawer is already within reach.',
          unlock: { kind: 'all', of: [] },
        },
      ],
    };
    const bundle: ContentBundle = {
      ...authoredBundle,
      hints: catalogueOf([noSkip]),
    };
    const command: Command = { kind: 'hint', targetId: 'hint-no-skip' };

    const locked = authoredGame({
      state: authoredState({ roomId: 'room-arrival' }),
      bundle,
      overrides: { resolve: () => command },
    });
    const lockedBatch = locked.game.submit('hint');
    expect(lockedBatch.some((event) => event.type === 'hint-shown')).toBe(
      false,
    );
    expect(messageTexts(lockedBatch).some((text) => text.trim() !== '')).toBe(
      true,
    );
    expect(
      readSave(locked.game, locked.storage).dto.state.hints['hint-no-skip'],
    ).toBeUndefined();

    const unlocked = authoredGame({
      state: authoredState({
        roomId: 'room-arrival',
        flags: { 'level-one-open': true },
      }),
      bundle,
      overrides: { resolve: () => command },
    });
    expect(unlocked.game.submit('hint')).toContainEqual({
      type: 'hint-shown',
      hintId: 'hint-no-skip',
      level: 1,
      text: noSkip.levels[0]?.text,
    });
  });
});
