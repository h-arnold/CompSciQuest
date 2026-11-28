// W7F-09/W7F-13 — explicit, idempotent quiz starts
// (assistance-ward.md §§7.1, 9.1). The answers keyword must never start or reset
// an attempt; every collaborator is an injected fake.
import { describe, expect, it } from 'vitest';
import type { Effect } from '../../src/core/effects/Effect';
import { createEffectApplier } from '../../src/core/effects/EffectApplier';
import { authoredGame } from '../fixtures/authored';
import { catalogueOf, FakeRandom } from '../fixtures/persistence';
import {
  W7_AI_ID,
  W7_ANSWERS_TOPIC_ID,
  W7_EXPLICIT_TOPIC_ID,
  W7_QUIZ_ID,
  w7ExplicitTopics,
  w7KeywordTopics,
  w7QuizBundle,
  w7QuizState,
} from '../fixtures/wardW7Fixes';

const START: Effect = {
  kind: 'start-quiz',
  quizId: W7_QUIZ_ID,
  actorId: W7_AI_ID,
};

function startEvents(
  state: ReturnType<typeof w7QuizState>,
  effect: Effect = START,
): readonly { readonly type: string }[] {
  const bundle = w7QuizBundle(w7KeywordTopics());
  return createEffectApplier(state, {
    bundle,
    random: new FakeRandom([0]),
  }).apply(effect);
}

function quizSnapshot(state: ReturnType<typeof w7QuizState>): string {
  return JSON.stringify({ quiz: state.quiz, quizAttempts: state.quizAttempts });
}

describe('W7 quiz start contract (assistance-ward.md §9.1)', () => {
  it('W7F-09: re-applying start-quiz while an attempt is active changes nothing', () => {
    const state = w7QuizState({ activeQuizId: W7_QUIZ_ID });
    const before = quizSnapshot(state);

    const events = startEvents(state);

    expect(events.some((event) => event.type === 'quiz-started')).toBe(false);
    expect(events.some((event) => event.type === 'question-asked')).toBe(false);
    expect(quizSnapshot(state)).toBe(before);
  });

  it('W7F-09: after end-quiz the same quiz starts once with a fresh question', () => {
    const state = w7QuizState({ activeQuizId: W7_QUIZ_ID });
    startEvents(state, {
      kind: 'end-quiz',
      quizId: W7_QUIZ_ID,
      passed: false,
      reason: 'Fixture end of attempt.',
    });

    const events = startEvents(state);

    expect(
      events.filter((event) => event.type === 'quiz-started'),
    ).toHaveLength(1);
    expect(
      events.filter((event) => event.type === 'question-asked'),
    ).toHaveLength(1);
    expect(state.quizAttempts[W7_QUIZ_ID]).toBe(2);
    expect(state.quiz.index).toBe(0);
    expect(state.quiz.answers).toEqual([]);
  });

  it('W7F-13: quiz answers does not start a quiz or increment attempts', () => {
    const bundle = w7QuizBundle(w7ExplicitTopics());
    const state = w7QuizState();
    const { game } = authoredGame({ bundle, state });

    const events = game.submit('ask ai about quiz answers');

    expect(state.npcs[W7_AI_ID]?.topicUses[W7_ANSWERS_TOPIC_ID]).toBe(1);
    expect(events.some((event) => event.type === 'quiz-started')).toBe(false);
    expect(events.some((event) => event.type === 'question-asked')).toBe(false);
    expect(state.quiz.activeQuizId).toBeUndefined();
    expect(state.quizAttempts[W7_QUIZ_ID]).toBeUndefined();
  });

  it.each(['orientation', 'audit', 'test', 'practice test'] as const)(
    'W7F-13: explicit %s still starts quiz-assistance-orientation',
    (phrase) => {
      const bundle = w7QuizBundle(w7ExplicitTopics());
      const state = w7QuizState();
      const { game } = authoredGame({ bundle, state });

      const events = game.submit(`ask ai about ${phrase}`);

      expect(
        events.filter((event) => event.type === 'quiz-started'),
      ).toHaveLength(1);
      expect(events).toContainEqual({
        type: 'quiz-started',
        quizId: W7_QUIZ_ID,
        actorId: W7_AI_ID,
      });
      expect(
        events.filter((event) => event.type === 'question-asked'),
      ).toHaveLength(1);
      expect(state.quiz.activeQuizId).toBe(W7_QUIZ_ID);
      expect(state.quizAttempts[W7_QUIZ_ID]).toBe(1);
    },
  );

  it('W7F-09: an ignored start keeps the active node, while a fresh start still exits it', () => {
    const nodeId = 'node-fixture-ward';
    const nodeBundle = {
      ...w7QuizBundle(w7ExplicitTopics()),
      nodes: catalogueOf([
        {
          id: nodeId,
          // Sticky keeps the normal one-turn node expiry out of this guard
          // test: only the start-quiz effect may exit the node.
          isSticky: true,
          topics: [],
          defaultTopicId: W7_EXPLICIT_TOPIC_ID,
        },
      ]),
    };

    // A live attempt makes the start-quiz effect a no-op: its node must survive.
    const liveState = w7QuizState({
      activeQuizId: W7_QUIZ_ID,
      activeNodeId: nodeId,
    });
    const liveGame = authoredGame({ bundle: nodeBundle, state: liveState });
    const ignored = liveGame.game.submit('ask ai about orientation');

    expect(liveState.npcs[W7_AI_ID]?.activeNodeId).toBe(nodeId);
    expect(ignored.some((event) => event.type === 'node-exited')).toBe(false);
    expect(ignored.some((event) => event.type === 'quiz-started')).toBe(false);

    // With no live attempt the same topic starts the quiz and exits the node.
    const freshState = w7QuizState({ activeNodeId: nodeId });
    const freshGame = authoredGame({ bundle: nodeBundle, state: freshState });
    const started = freshGame.game.submit('ask ai about orientation');

    expect(freshState.npcs[W7_AI_ID]?.activeNodeId).toBeUndefined();
    expect(started.some((event) => event.type === 'node-exited')).toBe(true);
    expect(
      started.filter((event) => event.type === 'quiz-started'),
    ).toHaveLength(1);
  });
});
