// Inline hint panel (application-and-ui.md §7.1, §7.2). It shows the most
// recent hint from view data; hint selection and penalties belong to core.
import type { GameViewData } from '../application/GameViewData';
import { appendMarkdownBlock } from './appendMarkdown';

export class HintPanel {
  readonly element: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'hint-panel';
    this.element.hidden = true;
  }

  refresh(data: GameViewData): void {
    const hint = data.hints.at(-1);
    this.element.hidden = hint === undefined;
    this.element.textContent = '';
    if (hint === undefined) {
      return;
    }
    appendMarkdownBlock(this.element, `Hint ${hint.level}: ${hint.text}`);
  }
}
