// Red tests for ENG-HINTRETRY-01. Canonical contracts:
// docs/developer/hints.md §3 (L49–87), §4 (L89–111), §5 (L113–118);
// docs/developer/combat.md §3 (L54–91), §4 (L93–113), §5 (L115–123);
// docs/developer/storage-schema.md §3.2 (L111–114), §5 (L171–177);
// docs/developer/application-and-ui.md §4 (L235–239), §6.1 (L562),
// §7.1 (L599), §7.2 (L654–670). Graph owners: Game (src/application/Game.ts:L45),
// GameEvent quiz-started (src/core/events/GameEvent.ts:L60), HintPanel
// (src/ui/HintPanel.ts:L6) and HintSystem (src/core/hints/HintSystem.ts:L13).
// C-HINTRETRY-02 GAP resolved by the user's explicit decision: a retry clears
// the transient hint VIEW when `quiz-started` is published. Persisted
// state.hints, penalties, cooldowns and quiz scoring are untouched.
import { afterEach, describe, expect, it } from 'vitest';
import { resolveGameCommand } from '../../src/application/commandResolution';
import { catalogueOf } from '../../src/content/Catalogue';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { Game } from '../../src/application/Game';
import type { GameStateDto } from '../../src/core/GameState';
import type { QuizQuestion } from '../../src/core/combat/QuizQuestion';
import { HintPanel } from '../../src/ui/HintPanel';
import {
  authoredBundle,
  authoredGame,
  authoredNpc,
  authoredState,
  eventTypes,
  FOREMAN_ID,
  messageTexts,
  readSave,
  switchyardProgress,
} from '../fixtures/authored';
import { makeEnvelope } from '../fixtures/persistence';
import { installFakeDocument, restoreDocument } from '../fixtures/ui';

type AuthoredFixture = ReturnType<typeof authoredGame>;

const STALE_HINTS: GameStateDto['hints'] = {
  'hint-switchyard': { levelsShown: [1], lastShownTurn: 1 },
  'hint-data-types': { levelsShown: [1], lastShownTurn: 2 },
};

function authoredLevelOneHintText(hintId: string): string {
  const definition = authoredBundle.hints
    .getById(hintId)
    ?.levels.find((entry) => entry.level === 1);
  if (definition === undefined) {
    throw new Error(`Authored hint '${hintId}' has no level 1.`);
  }
  return definition.text;
}

function questionFor(questionId: string): QuizQuestion {
  const question = authoredBundle.questions.getById(questionId);
  if (question === undefined) {
    throw new Error(`Authored question '${questionId}' is missing.`);
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
  game: Game,
  storage: AuthoredFixture['storage'],
): void {
  for (let guard = 0; guard < 10; guard += 1) {
    const saved = readSave(game, storage).dto.state;
    const quizId = saved.quiz.activeQuizId;
    if (quizId === undefined) return;
    const questionId = saved.quiz.questionIds[saved.quiz.index];
    if (questionId === undefined) {
      throw new Error('An active quiz must have a current question.');
    }
    game.submit(wrongAnswer(questionFor(questionId)));
  }
  throw new Error(
    'The quiz did not finish within its authored question count.',
  );
}

// A state representing "quiz 1 has failed, and its hint is still visible".
// Both hint records are persisted; only the transient VIEW may be cleared.
function retryState(
  hints: GameStateDto['hints'] = STALE_HINTS,
): ReturnType<typeof authoredState> {
  return authoredState({
    roomId: 'room-switch-floor',
    progress: [switchyardProgress()],
    quizAttempts: { 'quiz-switchyard': 1 },
    hints,
    npcs: {
      [FOREMAN_ID]: authoredNpc(FOREMAN_ID, {
        stateId: 'talking',
        activeNodeId: 'node-foreman-switch-lesson',
      }),
    },
  });
}

function retryFixture(
  hints: GameStateDto['hints'] = STALE_HINTS,
): AuthoredFixture {
  return authoredGame({
    state: retryState(hints),
    overrides: {
      resolve: () => ({ kind: 'ask', actorId: FOREMAN_ID, topic: 'switches' }),
    },
  });
}

function hintCounters(dto: GameStateDto): Readonly<Record<string, number>> {
  return Object.fromEntries(
    Object.entries(dto.counters).filter(
      ([key]) =>
        key.startsWith('hints-shown:') || key.startsWith('failed-attempts:'),
    ),
  );
}

function staleHintGame(): AuthoredFixture {
  return authoredGame({
    state: authoredState({
      roomId: 'room-switch-floor',
      progress: [switchyardProgress()],
      hints: { 'hint-switchyard': { levelsShown: [1], lastShownTurn: 1 } },
    }),
  });
}

afterEach(() => {
  restoreDocument();
});

describe('ENG-HINTRETRY-01: hint delivery and quiz failure (hints.md §3, §5; combat.md §3)', () => {
  it('E-HINTRETRY-01: a hint during quiz 1 emits both canonical events and persists the shown level', () => {
    const { game, storage, bus } = authoredGame({
      state: authoredState({
        roomId: 'room-binary-hall',
        progress: [switchyardProgress()],
        quiz: {
          activeQuizId: 'quiz-data-types',
          questionIds: [
            ...(authoredBundle.quizzes.getById('quiz-data-types')
              ?.questionIds ?? []),
          ],
          index: 0,
          correctCount: 0,
          answers: [],
        },
        counters: { 'turns-since:puzzle-sort-the-data-types': 3 },
      }),
    });

    const batch = game.submit('hint');

    expect(batch).toContainEqual({
      type: 'hint-shown',
      hintId: 'hint-data-types',
      level: 1,
      text: authoredLevelOneHintText('hint-data-types'),
    });
    expect(batch).toContainEqual({
      type: 'hint-penalty-applied',
      hintId: 'hint-data-types',
      delta: 0,
    });
    const saved = readSave(game, storage).dto.state;
    expect(saved.hints['hint-data-types']).toEqual({
      levelsShown: [1],
      lastShownTurn: game.getViewData().turn,
    });
    expect(bus.batches.at(-1)).toEqual(batch);
  });

  it('UI-HINTRETRY-01: the delivered hint is visible in view data and in the HintPanel', () => {
    installFakeDocument();
    const { game } = authoredGame({
      state: authoredState({
        roomId: 'room-binary-hall',
        progress: [switchyardProgress()],
        quiz: {
          activeQuizId: 'quiz-data-types',
          questionIds: [
            ...(authoredBundle.quizzes.getById('quiz-data-types')
              ?.questionIds ?? []),
          ],
          index: 0,
          correctCount: 0,
          answers: [],
        },
        counters: { 'turns-since:puzzle-sort-the-data-types': 3 },
      }),
    });

    game.submit('hint');

    const expected = {
      hintId: 'hint-data-types',
      level: 1,
      text: authoredLevelOneHintText('hint-data-types'),
    };
    expect(game.getViewData().hints).toContainEqual(expected);
    const panel = new HintPanel();
    panel.refresh(game.getViewData());
    expect(panel.element.hidden).toBe(false);
    expect(panel.element.textContent).toContain(expected.text);
  });

  it('C-HINTRETRY-01: a failed quiz ends with passed false and applies only the authored fail effects', () => {
    const initial = authoredState({
      roomId: 'room-compression-press',
      progress: [
        switchyardProgress({
          completedTopics: ['data-types'],
          earnedScore: 2,
        }),
      ],
      quiz: {
        activeQuizId: 'quiz-data-compression',
        questionIds: [
          ...(authoredBundle.quizzes.getById('quiz-data-compression')
            ?.questionIds ?? []),
        ],
        index: 0,
        correctCount: 0,
        answers: [],
      },
      player: {
        position: {
          worldId: 'world-wjec-gcse-computer-science-2025-spec',
          areaId: 'area-1-2-1-data-representation',
          roomId: 'room-compression-press',
        },
        inventory: [],
        lives: 3,
      },
    });
    const { game, storage, bus } = authoredGame({ state: initial });
    const before = readSave(game, storage).dto.state;
    bus.batches.length = 0;

    finishWithWrongAnswers(game, storage);

    const ended = bus.batches
      .flat()
      .find((event) => event.type === 'quiz-ended');
    expect(ended).toMatchObject({
      type: 'quiz-ended',
      quizId: 'quiz-data-compression',
      passed: false,
    });
    const after = readSave(game, storage).dto.state;
    expect(after.quiz).not.toHaveProperty('activeQuizId');
    expect(after.quiz.index).toBe(0);
    expect(after.quiz.correctCount).toBe(0);
    expect(after.quiz.answers).toEqual([]);
    expect(after.player.lives).toBe(before.player.lives - 1);
    expect(after.player.position.roomId).toBe('room-binary-hall');
    expect(after.progress[0]?.completedTopics).toEqual(['data-types']);
  });
});

describe('ENG-HINTRETRY-01: retry seam (combat.md §3, §5; hints.md §3, §4)', () => {
  it('C-HINTRETRY-02: quiz-started for a retry clears the stale hint from the view only', () => {
    const { game, storage, bus } = retryFixture();
    const before = readSave(game, storage).dto.state;
    expect(game.getViewData().hints).toContainEqual({
      hintId: 'hint-switchyard',
      level: 1,
      text: authoredLevelOneHintText('hint-switchyard'),
    });
    bus.batches.length = 0;

    const batch = game.submit('ask foreman about switches');

    expect(batch).toContainEqual({
      type: 'quiz-started',
      quizId: 'quiz-switchyard',
      actorId: FOREMAN_ID,
    });
    expect(game.getViewData().hints).toEqual([]);
    const after = readSave(game, storage).dto.state;
    expect(after.hints).toEqual(before.hints);
    expect(hintCounters(after)).toEqual(hintCounters(before));
  });

  it('UI-HINTRETRY-02: the retry renders no hint until a fresh hint-shown arrives', () => {
    installFakeDocument();
    // Only quiz 1's hint is visible immediately before the retry, so the
    // panel precondition is unambiguous.
    const { game, storage } = retryFixture({
      'hint-switchyard': { levelsShown: [1], lastShownTurn: 1 },
    });
    const before = readSave(game, storage).dto.state;
    const panel = new HintPanel();
    panel.refresh(game.getViewData());
    expect(panel.element.hidden).toBe(false);
    expect(panel.element.textContent).toContain(
      authoredLevelOneHintText('hint-switchyard'),
    );

    game.submit('ask foreman about switches');
    panel.refresh(game.getViewData());

    expect(panel.element.hidden).toBe(true);
    expect(panel.element.textContent).toBe('');
    expect(readSave(game, storage).dto.state.hints).toEqual(before.hints);
  });

  it('E-HINTRETRY-02: a fresh hint in quiz 2 emits the normal events after the retry', () => {
    const state = authoredState({
      roomId: 'room-switch-floor',
      progress: [switchyardProgress()],
      flags: { 'quiz-passed:quiz-switchyard': true, 'switches-set': true },
      quizAttempts: { 'quiz-data-types': 1 },
      hints: { 'hint-switchyard': { levelsShown: [1], lastShownTurn: 1 } },
      counters: { 'turns-since:puzzle-sort-the-data-types': 3 },
      npcs: {
        [FOREMAN_ID]: authoredNpc(FOREMAN_ID, {
          stateId: 'talking',
          activeNodeId: 'node-foreman-switch-lesson',
        }),
      },
    });
    const retryRaw = 'ask foreman about data types';
    const { game, storage } = authoredGame({
      state,
      overrides: {
        resolve: (raw) =>
          raw === retryRaw
            ? { kind: 'ask', actorId: FOREMAN_ID, topic: 'data-types' }
            : resolveGameCommand(raw, state, authoredBundle),
      },
    });

    const retry = game.submit(retryRaw);
    expect(retry).toContainEqual(
      expect.objectContaining({
        type: 'quiz-started',
        quizId: 'quiz-data-types',
      }),
    );
    expect(game.getViewData().hints).toEqual([]);

    const batch = game.submit('hint');

    expect(batch).toContainEqual({
      type: 'hint-shown',
      hintId: 'hint-data-types',
      level: 1,
      text: authoredLevelOneHintText('hint-data-types'),
    });
    expect(batch).toContainEqual({
      type: 'hint-penalty-applied',
      hintId: 'hint-data-types',
      delta: 0,
    });
    expect(game.getViewData().hints).toContainEqual({
      hintId: 'hint-data-types',
      level: 1,
      text: authoredLevelOneHintText('hint-data-types'),
    });
    const saved = readSave(game, storage).dto.state;
    expect(saved.hints['hint-switchyard']).toEqual({
      levelsShown: [1],
      lastShownTurn: 1,
    });
    expect(saved.hints['hint-data-types']?.levelsShown).toEqual([1]);
  });

  it('S-HINTRETRY-01: the clear touches no persisted HintStateDto entry', () => {
    const { game, storage } = retryFixture();
    const before = readSave(game, storage).dto.state;

    game.submit('ask foreman about switches');

    const after = readSave(game, storage).dto.state;
    expect(after.hints).toEqual(before.hints);
    expect(after.hints['hint-data-types']).toEqual(
      before.hints['hint-data-types'],
    );
    expect(hintCounters(after)).toEqual(hintCounters(before));
    expect(game.getViewData().hints).toEqual([]);
  });

  it('C-HINTRETRY-03: a blocked retry emits a message, starts nothing and leaves the hint view intact', () => {
    const baseQuiz = authoredBundle.quizzes.getById('quiz-data-types');
    if (baseQuiz === undefined) {
      throw new Error('The authored data-types quiz is missing.');
    }
    const limitedBundle: ContentBundle = {
      ...authoredBundle,
      quizzes: catalogueOf([{ ...baseQuiz, attemptsAllowed: 2 }]),
    };
    const { game, storage, bus } = authoredGame({
      bundle: limitedBundle,
      state: authoredState({
        roomId: 'room-binary-hall',
        progress: [switchyardProgress()],
        quizAttempts: { 'quiz-data-types': 2 },
        hints: { 'hint-data-types': { levelsShown: [1], lastShownTurn: 1 } },
      }),
      overrides: {
        dispatch: () => [
          {
            kind: 'start-quiz',
            quizId: 'quiz-data-types',
            actorId: FOREMAN_ID,
          },
        ],
      },
    });
    const before = readSave(game, storage).dto.state;
    const beforeView = game.getViewData().hints;
    expect(beforeView).toHaveLength(1);
    bus.batches.length = 0;

    const batch = game.submit('look');

    expect(messageTexts(batch).some((text) => text.trim() !== '')).toBe(true);
    expect(eventTypes(batch)).not.toContain('quiz-started');
    expect(
      bus.batches.some((events) =>
        events.some((event) => event.type === 'quiz-started'),
      ),
    ).toBe(false);
    const after = readSave(game, storage).dto.state;
    expect(after.quizAttempts).toEqual(before.quizAttempts);
    expect(after.quiz).toEqual(before.quiz);
    expect(after.hints).toEqual(before.hints);
    expect(game.getViewData().hints).toEqual(beforeView);
  });

  it('S-HINTRETRY-02: newGame, continueGame and restart still clear transient views', () => {
    const fresh = staleHintGame();
    expect(fresh.game.getViewData().hints).toHaveLength(1);
    fresh.game.newGame();
    expect(fresh.game.getViewData().hints).toEqual([]);

    const continued = staleHintGame();
    expect(continued.game.getViewData().hints).toHaveLength(1);
    const saved = readSave(continued.game, continued.storage).dto.state;
    continued.game.continueGame(makeEnvelope({ ...saved, hints: {} }));
    expect(continued.game.getViewData().hints).toEqual([]);

    const restarted = staleHintGame();
    expect(restarted.game.getViewData().hints).toHaveLength(1);
    restarted.game.restart();
    expect(restarted.game.getViewData().hints).toEqual([]);
  });
});
