// quiz-content gate (content-rules.md §7, §4.4): marks, options, AOs and the
// pass/fail effect contract.

import type { Finding, ParsedCardSet } from '../contracts.ts';
import {
  asNumber,
  asObjectArray,
  asRecord,
  asText,
  collection,
  finding,
  idsOf,
  stringList,
  type CardEntry,
} from './common.ts';

const AO_TAGS: ReadonlySet<string> = new Set(['AO1', 'AO2', 'AO3']);

function hasEffect(
  effects: readonly Record<string, unknown>[],
  kind: string,
  isMatch: (effect: Record<string, unknown>) => boolean = () => true,
): boolean {
  return effects.some(
    (effect) => asText(effect['kind']) === kind && isMatch(effect),
  );
}

function questionFindings(question: CardEntry): readonly Finding[] {
  const found: Finding[] = [];
  const optionCount = Array.isArray(question.data['options'])
    ? question.data['options'].length
    : 0;
  const correct = stringList(question.data['correctOptionIds']);
  const hasCorrect = correct.some((value) => {
    const index = Number(value);
    return Number.isSafeInteger(index) && index >= 0 && index < optionCount;
  });
  if (!hasCorrect) {
    found.push(
      finding(
        question.path,
        question.entry,
        'correctOptionIds must name an in-range option index',
        'quiz-content',
      ),
    );
  }
  if (asText(question.data['explanation']).trim().length === 0) {
    found.push(
      finding(
        question.path,
        question.entry,
        'explanation must not be empty',
        'quiz-content',
      ),
    );
  }
  const authoring = asRecord(question.data['authoring']) ?? {};
  const tag = asText(authoring['assessmentObjective']);
  if (!AO_TAGS.has(tag)) {
    found.push(
      finding(
        question.path,
        question.entry,
        'authoring must declare an AO tag (AO1/AO2/AO3)',
        'quiz-content',
      ),
    );
  }
  if (asText(authoring['difficulty']).trim().length === 0) {
    found.push(
      finding(
        question.path,
        question.entry,
        'authoring must declare a difficulty',
        'quiz-content',
      ),
    );
  }
  return found;
}

function passMarkFindings(quiz: CardEntry): readonly Finding[] {
  const ids = stringList(quiz.data['questionIds']);
  const passMark = asNumber(quiz.data['passMark']);
  return !Number.isSafeInteger(passMark) ||
    passMark < 1 ||
    passMark > ids.length
    ? [
        finding(
          quiz.path,
          quiz.entry,
          `passMark ${String(passMark)} must be between 1 and the ${String(ids.length)} declared questionIds`,
          'quiz-content',
        ),
      ]
    : [];
}

function effectFindings(quiz: CardEntry): readonly Finding[] {
  const id = asText(quiz.data['id']);
  const onPass = asObjectArray(quiz.data['onPass']);
  const onFail = asObjectArray(quiz.data['onFail']);
  const found: Finding[] = [];
  if (
    !hasEffect(
      onPass,
      'set-flag',
      (effect) => asText(effect['flag']) === `quiz-passed:${id}`,
    )
  ) {
    found.push(
      finding(
        quiz.path,
        quiz.entry,
        `onPass must set quiz-passed:${id}`,
        'quiz-content',
      ),
    );
  }
  if (!hasEffect(onPass, 'complete-topic')) {
    found.push(
      finding(
        quiz.path,
        quiz.entry,
        'onPass must emit complete-topic',
        'quiz-content',
      ),
    );
  }
  if (!hasEffect(onFail, 'change-lives')) {
    found.push(
      finding(
        quiz.path,
        quiz.entry,
        'onFail must include change-lives',
        'quiz-content',
      ),
    );
  }
  return found;
}

export function checkQuiz(cards: ParsedCardSet): readonly Finding[] {
  const quizzes = collection(cards, 'quizzes');
  const questions = collection(cards, 'questions');
  const questionIds = idsOf(questions);
  return quizzes.flatMap((quiz) => {
    const ids = stringList(quiz.data['questionIds']);
    const quizQuestions = questions.filter((question) =>
      ids.includes(asText(question.data['id'])),
    );
    const tags = new Set(
      quizQuestions.flatMap((question) => {
        const authoring = asRecord(question.data['authoring']) ?? {};
        return AO_TAGS.has(asText(authoring['assessmentObjective']))
          ? [asText(authoring['assessmentObjective'])]
          : [];
      }),
    );
    const missingIds = ids.some((id) => !questionIds.has(id));
    const coverage =
      tags.has('AO1') && tags.has('AO2')
        ? []
        : [
            finding(
              quiz.path,
              quiz.entry,
              'quiz needs at least one AO1 and one AO2 question',
              'quiz-content',
            ),
          ];
    return [
      ...passMarkFindings(quiz),
      ...(missingIds
        ? [
            finding(
              quiz.path,
              quiz.entry,
              'questionIds names an undeclared question',
              'quiz-content',
            ),
          ]
        : []),
      ...quizQuestions.flatMap((question) => questionFindings(question)),
      ...coverage,
      ...effectFindings(quiz),
    ];
  });
}
