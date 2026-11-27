// Transcript channel (application-and-ui.md §6.1, §7.1). It offers a plain
// append path and a Markdown block path; formatting lives in formatEvent.ts.
import {
  appendMarkdownBlock,
  appendPlain as appendPlainLine,
} from './appendMarkdown';

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
    this.appendPlain(lines);
  }

  appendPlain(lines: readonly string[]): void {
    for (const line of lines) {
      appendPlainLine(this.element, line);
    }
  }

  appendMarkdown(lines: readonly string[]): void {
    for (const line of lines) {
      appendMarkdownBlock(this.element, line);
    }
  }

  clear(): void {
    this.element.textContent = '';
  }
}
