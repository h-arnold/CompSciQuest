// W7F-08 — exact multi-word AI keywords beat declaration order. Six fixture
// `special` topics are bound to the fixture AI; every assertion uses the
// selected topic ID (via topic uses), never authored response wording.
import { describe, expect, it } from 'vitest';
import { authoredGame } from '../fixtures/authored';
import {
  W7_AI_ID,
  W7_ANSWERS_TOPIC_ID,
  w7KeywordTopics,
  w7QuizBundle,
  w7QuizState,
} from '../fixtures/wardW7Fixes';

const CASES = [
  ['quiz answers', W7_ANSWERS_TOPIC_ID],
  ['practice test', W7_ANSWERS_TOPIC_ID],
  ['how to answer', 'topic-ai-ward-hints'],
  ['talk to', 'topic-ai-ward-conversation'],
  ['ask ai about save', 'topic-ai-ward-save'],
] as const;

describe('W7 multi-word AI keywords (content-bible.md §12)', () => {
  it.each(CASES)(
    'W7F-08: ask ai about %s selects the exact declared keyword topic',
    (phrase, expectedTopicId) => {
      const bundle = w7QuizBundle(w7KeywordTopics());
      const state = w7QuizState();
      const { game } = authoredGame({ bundle, state });

      const events = game.submit(`ask ai about ${phrase}`);

      const uses = state.npcs[W7_AI_ID]?.topicUses ?? {};
      expect(
        uses[expectedTopicId],
        `${phrase} must select ${expectedTopicId}`,
      ).toBe(1);
      expect(
        events.some((event) => event.type === 'npc-spoke'),
        'a selected topic must answer',
      ).toBe(true);
      expect(
        events.some(
          (event) =>
            event.type === 'message' &&
            /I don't understand that|parser error/iu.test(event.text),
        ),
      ).toBe(false);
    },
  );

  it('W7F-08: a single-word token on an earlier topic cannot win over the whole phrase', () => {
    // The first declared topic owns `quiz`; the answers topic owns the whole
    // phrase `quiz answers`. Declaration order must not decide the winner.
    const bundle = w7QuizBundle(w7KeywordTopics());
    const state = w7QuizState();
    const { game } = authoredGame({ bundle, state });

    game.submit('ask ai about quiz answers');

    const uses = state.npcs[W7_AI_ID]?.topicUses ?? {};
    expect(uses['topic-ai-ward-records']).toBeUndefined();
    expect(uses[W7_ANSWERS_TOPIC_ID]).toBe(1);
  });
});
