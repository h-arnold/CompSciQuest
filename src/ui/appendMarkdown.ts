// Transcript and panel append seams (spec §4.4/§4.5; application-and-ui.md
// §6.1, §7.1). Each call adds one wrapper element per logical entry, holding
// the DOM nodes produced by the Markdown renderer. No HTML string, fragment or
// innerHTML write is made; the plain channel reuses the single text-only writer.
// The block channel always keeps the renderer's own structure — a lone
// paragraph stays a P rather than being flattened into the wrapper (§4.2).
import { appendLine } from './appendLine';
import { renderBlock, renderInline } from './markdown/renderMarkdown';

export function appendPlain(parent: HTMLElement, text: string): void {
  appendLine(parent, text);
}

export function appendMarkdownBlock(parent: HTMLElement, text: string): void {
  const wrapper = document.createElement('div');
  wrapper.append(...renderBlock(text));
  parent.append(wrapper);
}

export function appendMarkdownInline(parent: HTMLElement, text: string): void {
  const wrapper = document.createElement('div');
  wrapper.append(...renderInline(text));
  parent.append(wrapper);
}
