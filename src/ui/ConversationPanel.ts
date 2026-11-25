// Inline conversation panel (application-and-ui.md §7.1, §7.2). It presents the
// active conversation supplied by view data; it resolves no topics itself.
import type { GameViewData } from '../application/GameViewData';
import { appendLine } from './appendLine';

export class ConversationPanel {
  readonly element: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'conversation-panel';
    this.element.hidden = true;
  }

  refresh(data: GameViewData): void {
    const conversation = data.conversation;
    this.element.hidden = conversation === undefined;
    this.element.textContent = '';
    if (conversation === undefined) {
      return;
    }
    const name = conversation.actorName;
    const displayName = name.charAt(0).toUpperCase() + name.slice(1);
    appendLine(this.element, `Talking with ${displayName}.`);
    if (conversation.prompt !== undefined) {
      appendLine(this.element, conversation.prompt);
    }
  }
}
