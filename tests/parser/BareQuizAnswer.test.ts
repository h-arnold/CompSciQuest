// ENG9-BAREANSWER-01: the numbered options shown by QuizPanel are text, but a
// player may type the bare number instead of the undocumented `answer N` form
// (PLAYTEST_ISSUES.md §9). combat.md §3 step 4 owns the 1-based convention: the
// resolver must carry that number to QuizSystem, which converts it to 0-based.
// Letters stay unknown, no quiz means no answer, and an out-of-range number
// still reaches the quiz's own friendly rejection. The resolver is observed
// only through its returned Command (application-and-ui.md §5.2); no UI or
// content file is used.
import { describe, expect, it } from 'vitest';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { Command } from '../../src/core/commands/Command';
import type { GameState } from '../../src/core/GameState';
import { catalogueOf } from '../fixtures/persistence';
import { makeParserBundle, makeParserState } from '../fixtures/parser';
import { loadSeam } from '../fixtures/seams';

type GameCommandResolver = (
  raw: string,
  state: GameState,
  bundle: ContentBundle,
) => Command;

const QUIZ_ID = 'quiz-stub';
const QUESTION_ID = 'question-stub';
const OPTIONS: readonly string[] = [
  'Binary digits',
  'Decimal digits',
  'Hexadecimal digits',
  'Octal digits',
];

function loadResolver(): Promise<GameCommandResolver> {
  return loadSeam<GameCommandResolver>(
    '../../src/application/commandResolution',
    'resolveGameCommand',
    'ENGINE_ISSUES.md Batch E1 quiz answers; combat.md §3 step 4 (1-based option)',
  );
}

function quizBundle(): ContentBundle {
  const base = makeParserBundle();
  return {
    ...base,
    quizzes: catalogueOf([
      {
        id: QUIZ_ID,
        actorId: 'npc-1',
        topicId: 'topic-1',
        score: 0,
        questionIds: [QUESTION_ID],
        passMark: 1,
        onPass: [],
        onFail: [],
      },
    ]),
    questions: catalogueOf([
      {
        id: QUESTION_ID,
        prompt: 'Choose a number system.',
        options: OPTIONS,
        correctOptionIds: [0],
        explanation: 'Binary uses 0 and 1.',
      },
    ]),
  };
}

function activeQuizState(): GameState {
  return makeParserState({
    quiz: {
      activeQuizId: QUIZ_ID,
      questionIds: [QUESTION_ID],
      index: 0,
      correctCount: 0,
      answers: [],
    },
  });
}

function snapshot(state: GameState): string {
  return JSON.stringify(state);
}

describe('ENG9-BAREANSWER-01 bare quiz answers', () => {
  it('ENG9-BAREANSWER-01: a bare number resolves like answer N while answer text still works', async () => {
    const resolve = await loadResolver();
    const state = activeQuizState();
    const bundle = quizBundle();
    const before = snapshot(state);
    const expected: Command = { kind: 'answer', option: 2 };

    expect
      .soft(
        resolve('2', state, bundle),
        'a bare 2 must carry the same 1-based option as answer 2 (combat.md §3 step 4)',
      )
      .toEqual(expected);
    expect
      .soft(
        resolve('answer 2', state, bundle),
        'answer 2 must keep its existing 1-based option',
      )
      .toEqual(expected);
    expect
      .soft(
        resolve('answer   DECIMAL DIGITS  ', state, bundle),
        'the exact option text, trimmed and case-insensitive, is still an alias',
      )
      .toEqual(expected);
    expect.soft(snapshot(state)).toBe(before);
  });

  it('ENG9-BAREANSWER-01: bare numbers answer only inside a quiz and letters never answer', async () => {
    const resolve = await loadResolver();
    const bundle = quizBundle();
    const quiz = activeQuizState();
    const idle = makeParserState();
    const beforeQuiz = snapshot(quiz);
    const beforeIdle = snapshot(idle);

    expect
      .soft(
        resolve('4', quiz, bundle),
        'a bare 4 answers the active quiz with option 4',
      )
      .toEqual({ kind: 'answer', option: 4 });
    // `a`, `b`, `c` have no canonical alias; `d` is a canonical `go down`
    // shortcut and is therefore deliberately out of this quiz-shortcut check.
    for (const letter of ['a', 'b', 'c']) {
      expect
        .soft(
          resolve(letter, quiz, bundle),
          `${letter} is not an answer alias (ENGINE_ISSUES.md Batch E1 quiz answers)`,
        )
        .toEqual({ kind: 'unknown', raw: letter });
    }
    for (const raw of ['1', '2', 'a']) {
      expect
        .soft(
          resolve(raw, idle, bundle),
          `without an active quiz, ${raw} takes the friendly unknown path`,
        )
        .toEqual({ kind: 'unknown', raw });
    }
    expect.soft(snapshot(quiz)).toBe(beforeQuiz);
    expect.soft(snapshot(idle)).toBe(beforeIdle);
  });

  it('ENG9-BAREANSWER-01: an out-of-range bare number stays inside the quiz rejection', async () => {
    const resolve = await loadResolver();
    const state = activeQuizState();
    const bundle = quizBundle();
    const before = snapshot(state);
    const outOfRange: Command = {
      kind: 'answer',
      option: OPTIONS.length + 1,
    };

    expect
      .soft(
        resolve(String(OPTIONS.length + 1), state, bundle),
        'an out-of-range bare number must reach QuizSystem as an answer, not become unknown',
      )
      .toEqual(outOfRange);
    expect
      .soft(
        resolve(`answer ${OPTIONS.length + 1}`, state, bundle),
        'the explicit out-of-range answer keeps its existing option number',
      )
      .toEqual(outOfRange);
    // Resolution is read-only: the quiz's index and answers cannot advance here.
    expect.soft(snapshot(state)).toBe(before);
  });
});
