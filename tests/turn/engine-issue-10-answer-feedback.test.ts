// ENG10-FEEDBACK-01: quiz answer feedback in the transcript log. Fixed engine
// copy ("Correct." / "Incorrect.") comes from ENGINE_ISSUES.md Batch E2 (L52,
// L79, L129-133), PLAYTEST_ISSUES.md §10 and application-and-ui.md §6.1
// (L553). The explanation is rendered unchanged; hint-penalty-applied stays
// suppressed from the Wave 1 issue 8 stream. No private state is asserted.
import { describe, expect, it } from 'vitest';
import type { GameEvent } from '../../src/core/events/GameEvent';
import { makeBundle } from '../fixtures/persistence';
import { loadFormatEvent } from '../fixtures/turn';

const EXPLANATION =
  'A loop repeats the same block while its condition holds — not just the header.';
const QUIZ_ID = 'quiz-pattern-bureau';
const QUESTION_ID = 'question-loops-repeat';

function answerEvent(isCorrect: boolean): GameEvent {
  return {
    type: 'answer-evaluated',
    quizId: QUIZ_ID,
    questionId: QUESTION_ID,
    correct: isCorrect,
    explanation: EXPLANATION,
  };
}

describe('ENG10-FEEDBACK-01: quiz answer feedback in formatEvent', () => {
  it('ENG10-FEEDBACK-01: a correct answer returns one line with "Correct. " and the verbatim explanation', async () => {
    const formatEvent = await loadFormatEvent();
    const bundle = makeBundle();

    const lines = formatEvent(answerEvent(true), bundle);

    expect(lines).toEqual([`Correct. ${EXPLANATION}`]);
    expect(lines.join('\n')).not.toContain(QUIZ_ID);
    expect(lines.join('\n')).not.toContain(QUESTION_ID);
  });

  it('ENG10-FEEDBACK-01: an incorrect answer returns one line with "Incorrect. " and the verbatim explanation', async () => {
    const formatEvent = await loadFormatEvent();
    const bundle = makeBundle();

    const lines = formatEvent(answerEvent(false), bundle);

    expect(lines).toEqual([`Incorrect. ${EXPLANATION}`]);
    expect(lines.join('\n')).not.toContain(QUIZ_ID);
    expect(lines.join('\n')).not.toContain(QUESTION_ID);
  });

  it('ENG10-FEEDBACK-01: a zero-delta hint penalty still returns no line', async () => {
    const formatEvent = await loadFormatEvent();
    const bundle = makeBundle();
    const event: GameEvent = {
      type: 'hint-penalty-applied',
      hintId: 'hint-number-systems',
      delta: 0,
    };

    expect(formatEvent(event, bundle)).toEqual([]);
  });

  it('ENG10-FEEDBACK-01: other event arms stay inherited', async () => {
    const formatEvent = await loadFormatEvent();
    const bundle = makeBundle();

    expect(
      formatEvent({ type: 'message', text: 'A plain message.' }, bundle),
    ).toEqual(['A plain message.']);
    expect(
      formatEvent(
        { type: 'score-changed', delta: 2, total: 7, reason: 'stub award' },
        bundle,
      ),
    ).toEqual(['You earned **2** points.']);
    expect(
      formatEvent(
        { type: 'puzzle-activated', puzzleId: 'puzzle-lift-the-shed' },
        bundle,
      ),
    ).toEqual([]);
    expect(
      formatEvent(
        { type: 'puzzle-solved', puzzleId: 'puzzle-lift-the-shed' },
        bundle,
      ),
    ).toEqual([]);
  });
});
