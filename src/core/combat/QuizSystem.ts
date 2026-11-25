// Command-time seam from application-and-ui.md §8 / shared-rules.md §2. The
// answer handler is phase 3: it returns effects only and never mutates state.
import type { ContentBundle } from '../../content/ContentBundle';
import type { GameState } from '../GameState';
import type { Command } from '../commands/Command';
import type { Effect } from '../effects/Effect';

export interface QuizSystem {
  handle(command: Command, state: GameState): readonly Effect[];
}

export interface QuizSystemDependencies {
  readonly bundle: ContentBundle;
}

const NO_QUESTION = 'There is no question to answer.';
const OUT_OF_RANGE = 'That answer is not one of the choices.';

function message(text: string): Effect {
  return { kind: 'message', text };
}

export function createQuizSystem(
  dependencies: QuizSystemDependencies,
): QuizSystem {
  return {
    handle(command, state): readonly Effect[] {
      if (command.kind !== 'answer') return [];
      const quizId = state.quiz.activeQuizId;
      if (quizId === undefined) return [message(NO_QUESTION)];
      const quiz = dependencies.bundle.quizzes.getById(quizId);
      const questionId = state.quiz.questionIds[state.quiz.index];
      const question =
        questionId === undefined
          ? undefined
          : dependencies.bundle.questions.getById(questionId);
      if (quiz === undefined || question === undefined) {
        return [message(NO_QUESTION)];
      }
      // The player types a 1-based number; the stored choice is 0-based.
      const option = command.option - 1;
      if (
        !Number.isSafeInteger(option) ||
        option < 0 ||
        option >= question.options.length
      ) {
        return [message(OUT_OF_RANGE)];
      }
      const correct = question.correctOptionIds.includes(option);
      const attempts: Effect[] = [
        {
          kind: 'evaluate-answer',
          quizId,
          questionId: question.id,
          option,
          correct,
          explanation: question.explanation,
        },
      ];
      const hasMoreQuestions =
        state.quiz.index + 1 < state.quiz.questionIds.length;
      if (hasMoreQuestions) {
        const nextId = state.quiz.questionIds[state.quiz.index + 1];
        const next =
          nextId === undefined
            ? undefined
            : dependencies.bundle.questions.getById(nextId);
        return next === undefined
          ? attempts
          : [
              ...attempts,
              {
                kind: 'ask-question',
                quizId,
                questionId: next.id,
                prompt: next.prompt,
                options: next.options,
              },
            ];
      }
      const correctCount = state.quiz.correctCount + (correct ? 1 : 0);
      const isPassed = correctCount >= quiz.passMark;
      const finish: Effect[] = [
        ...attempts,
        {
          kind: 'end-quiz',
          quizId,
          passed: isPassed,
          reason: isPassed ? 'the quiz was passed' : 'the quiz was failed',
        },
        ...(isPassed ? quiz.onPass : quiz.onFail),
      ];
      return finish;
    },
  };
}
