// Transcript channel (application-and-ui.md §6.1, §7.1). It offers a plain
// append path and a Markdown block path; formatting lives in formatEvent.ts.
import {
  appendMarkdownBlock,
  appendPlain as appendPlainLine,
} from './appendMarkdown';

// Allows for sub-pixel rounding in the browser's scroll range.
const PIN_TOLERANCE_PX = 2;

export class OutputLog {
  private pinnedToLatest = true;
  readonly element: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'output-log';
    // Announce each appended line to assistive technology (§7.1). The log role
    // gives the transcript its semantic shape; polite live updates read output
    // without interrupting the player. No content parsing happens here.
    this.element.setAttribute('role', 'log');
    this.element.setAttribute('aria-live', 'polite');
    // Remember whether the player was following the newest line. A deliberate
    // scroll-back emits a scroll event; appends and re-pins set the flag again.
    this.element.addEventListener('scroll', () => {
      this.pinnedToLatest = this.isAtLatest();
    });
    // Reflow is CSS-driven (application-and-ui.md §7.1). The element's own
    // document view is the resize source; DOM fakes without a view add no
    // listener, so the viewport policy stays inert under those fakes.
    this.element.ownerDocument?.defaultView?.addEventListener('resize', () => {
      if (this.pinnedToLatest) {
        this.scrollToLatest();
      }
    });
  }

  private isAtLatest(): boolean {
    const bottom = this.element.scrollHeight - this.element.clientHeight;
    return this.element.scrollTop >= bottom - PIN_TOLERANCE_PX;
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

  scrollToLatest(): void {
    this.pinnedToLatest = true;
    this.element.scrollTop = this.element.scrollHeight;
  }
}
