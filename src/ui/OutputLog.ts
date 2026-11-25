// Transcript channel (application-and-ui.md §6.1, §7.1). It appends formatted
// lines and never interprets them; formatting lives in formatEvent.ts.
import { appendLine } from './appendLine';

export class OutputLog {
  readonly element: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'output-log';
    // Announce each appended line to assistive technology (§7.1). The log role
    // gives the transcript its semantic shape; polite live updates read output
    // without interrupting the player. No content parsing happens here.
    this.element.setAttribute('role', 'log');
    this.element.setAttribute('aria-live', 'polite');
  }

  append(lines: readonly string[]): void {
    for (const line of lines) {
      appendLine(this.element, line);
    }
  }

  clear(): void {
    this.element.textContent = '';
  }
}
