// Inline quiz panel (application-and-ui.md §7.1, §7.2). It displays the active
// question; answers are typed into the same Terminal input, never here.
import type { GameViewData } from '../application/GameViewData';
import { appendLine } from './appendLine';

export class QuizPanel {
  readonly element: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'quiz-panel';
    this.element.hidden = true;
  }

  refresh(data: GameViewData): void {
    const quiz = data.activeQuiz;
    this.element.hidden = quiz === undefined;
    this.element.textContent = '';
    if (quiz === undefined) {
      return;
    }
    appendLine(
      this.element,
      `Question ${quiz.questionNumber} of ${quiz.questionCount}: ${quiz.prompt}`,
    );
    let index = 0;
    for (const option of quiz.options) {
      appendLine(this.element, `${index + 1}. ${option}`);
      index += 1;
    }
  }
}
