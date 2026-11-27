// Inline quiz panel (application-and-ui.md §7.1, §7.2). It displays the active
// question; answers are typed into the same Terminal input, never here.
import type { GameViewData } from '../application/GameViewData';
import { appendMarkdownInline } from './appendMarkdown';
import { renderBlock } from './markdown/renderMarkdown';

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
    // The prompt keeps the paragraph produced by the block renderer. Its nodes
    // go straight into the panel so the only direct div children are the
    // numbered options (§7.1).
    this.element.append(
      ...renderBlock(
        `Question ${quiz.questionNumber} of ${quiz.questionCount}: ${quiz.prompt}`,
      ),
    );

    let index = 0;
    for (const option of quiz.options) {
      appendMarkdownInline(this.element, `${index + 1}. ${option}`);
      index += 1;
    }

    // The requirement closes the panel and is a polite live region announced
    // when a quiz starts (§7.1). It is built through the block channel so the
    // prose stays a paragraph, then appended after prompt and options.
    const requirement = `Pass mark: ${quiz.passMark} correct of ${quiz.questionCount}. Wrong answers allowed: ${quiz.remainingWrong}.`;
    const requirementNodes = renderBlock(requirement);
    const requirementParagraph = requirementNodes.find(
      (node): node is HTMLElement => 'tagName' in node && node.tagName === 'P',
    );
    requirementParagraph?.setAttribute('aria-live', 'polite');
    this.element.append(...requirementNodes);
  }
}
