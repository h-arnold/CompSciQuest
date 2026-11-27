// Markdown to DOM boundary (spec §4.1–§4.4; application-and-ui.md §7.1).
// Lexer tokens become nodes built with createElement and createTextNode. No
// HTML string, innerHTML write or content-generated style attribute is made.
import { Lexer } from 'marked';
import type { Token, Tokens } from 'marked';
import { isAllowedLink } from './links';

const ALIGNMENTS = new Set(['left', 'center', 'right']);
const HEADING_LEVELS = 6;

function collapseNewlines(text: string): string {
  return text.replaceAll(/\n+/g, ' ');
}

function childTokens(holder: object): readonly Token[] {
  return 'tokens' in holder && Array.isArray(holder.tokens)
    ? (holder.tokens as Token[])
    : [];
}

function literalText(token: object): string {
  if ('text' in token && typeof token.text === 'string') {
    return token.text;
  }
  if ('raw' in token && typeof token.raw === 'string') {
    return token.raw;
  }
  return '';
}

function plainText(tokens: readonly Token[]): string {
  let text = '';
  for (const token of tokens) {
    const children = childTokens(token);
    text += children.length > 0 ? plainText(children) : literalText(token);
  }
  return text;
}

function elementOfNodes(tag: string, nodes: readonly Node[]): HTMLElement {
  const element = document.createElement(tag);
  element.append(...nodes);
  return element;
}

function inlineElement(tag: string, tokens: readonly Token[]): HTMLElement {
  return elementOfNodes(tag, renderTokens(tokens));
}

function renderTokens(tokens: readonly Token[]): Node[] {
  const nodes: Node[] = [];
  for (const token of tokens) {
    nodes.push(...renderToken(token));
  }
  return nodes;
}

function renderList(token: Token): readonly Node[] {
  const isOrdered = 'ordered' in token && token['ordered'] === true;
  const list = document.createElement(isOrdered ? 'ol' : 'ul');
  if (isOrdered) {
    const start = 'start' in token ? token['start'] : undefined;
    if (typeof start === 'number') {
      list.setAttribute('start', String(start));
    }
  }
  const items =
    'items' in token && Array.isArray(token['items'])
      ? (token['items'] as readonly Token[])
      : [];
  for (const item of items) {
    const children = renderTokens(childTokens(item));
    list.append(elementOfNodes('li', children));
  }
  return [list];
}

function renderCell(
  tag: 'th' | 'td',
  cell: Tokens.TableCell,
  align: unknown,
): HTMLElement {
  const element = document.createElement(tag);
  if (tag === 'th') {
    element.setAttribute('scope', 'col');
  }
  const direction = typeof cell.align === 'string' ? cell.align : align;
  if (typeof direction === 'string' && ALIGNMENTS.has(direction)) {
    element.className = `align-${direction}`;
  }
  element.append(...renderTokens(childTokens(cell)));
  return element;
}

function renderTable(token: Token): readonly Node[] {
  const wrapper = document.createElement('div');
  wrapper.className = 'table-scroll';
  const table = document.createElement('table');
  const alignments =
    'align' in token && Array.isArray(token['align']) ? token['align'] : [];
  const headers: readonly Tokens.TableCell[] =
    'header' in token && Array.isArray(token['header']) ? token['header'] : [];
  const rows: readonly (readonly Tokens.TableCell[])[] =
    'rows' in token && Array.isArray(token['rows']) ? token['rows'] : [];

  const headRow = document.createElement('tr');
  for (const [index, cell] of headers.entries()) {
    headRow.append(renderCell('th', cell, alignments[index]));
  }
  table.append(elementOfNodes('thead', [headRow]));

  const body = document.createElement('tbody');
  for (const row of rows) {
    const bodyRow = document.createElement('tr');
    for (const [index, cell] of row.entries()) {
      bodyRow.append(renderCell('td', cell, alignments[index]));
    }
    body.append(bodyRow);
  }
  table.append(body);
  wrapper.append(table);
  return [wrapper];
}

function boldItalicMarker(token: Token, only: Token): string | undefined {
  if (only.type !== 'strong') {
    return undefined;
  }
  const strongRaw = only.raw;
  const doubled = strongRaw.slice(0, 2);
  if ((doubled !== '**' && doubled !== '__') || !strongRaw.endsWith(doubled)) {
    return undefined;
  }
  const marker = doubled[0];
  if (marker === undefined) {
    return undefined;
  }
  const triple = marker.repeat(3);
  return token.raw.startsWith(triple) && token.raw.endsWith(triple)
    ? triple
    : undefined;
}

function renderEmphasis(token: Token): readonly Node[] {
  const children = childTokens(token);
  const only = children[0];
  if (
    only !== undefined &&
    children.length === 1 &&
    boldItalicMarker(token, only) !== undefined
  ) {
    const inner = elementOfNodes('em', renderTokens(childTokens(only)));
    return [elementOfNodes('strong', [inner])];
  }
  return [inlineElement('em', children)];
}

function renderCode(token: Token): readonly Node[] {
  const pre = document.createElement('pre');
  const code = document.createElement('code');
  const info =
    'lang' in token && typeof token['lang'] === 'string'
      ? token['lang'].trim().split(/\s+/, 1)[0]
      : undefined;
  if (info !== undefined && info !== '') {
    code.className = `language-${info}`;
  }
  code.append(document.createTextNode(literalText(token)));
  pre.append(code);
  return [pre];
}

function renderLink(token: Token): readonly Node[] {
  const href =
    'href' in token && typeof token['href'] === 'string' ? token['href'] : '';
  if (!isAllowedLink(href)) {
    const children = childTokens(token);
    const label =
      children.length > 0 ? plainText(children) : literalText(token);
    return [document.createTextNode(collapseNewlines(label))];
  }
  const anchor = document.createElement('a');
  anchor.setAttribute('href', href);
  anchor.setAttribute('target', '_blank');
  anchor.setAttribute('rel', 'noopener noreferrer');
  anchor.append(...renderTokens(childTokens(token)));
  return [anchor];
}

function renderHeading(token: Token): readonly Node[] {
  const depth =
    'depth' in token && typeof token['depth'] === 'number' ? token['depth'] : 1;
  const level = Math.min(HEADING_LEVELS, Math.max(1, Math.trunc(depth)));
  return [inlineElement(`h${level}`, childTokens(token))];
}

function renderParagraph(token: Token): readonly Node[] {
  const children = childTokens(token);
  return children.length > 0 &&
    children.every((child) => child.type === 'image')
    ? renderTokens(children)
    : [inlineElement('p', children)];
}

function renderText(token: Token): readonly Node[] {
  const children = childTokens(token);
  return children.length > 0
    ? renderTokens(children)
    : [document.createTextNode(collapseNewlines(literalText(token)))];
}

function renderLeaf(token: Token): readonly Node[] {
  switch (token.type) {
    case 'br': {
      return [document.createElement('br')];
    }
    case 'hr': {
      return [document.createElement('hr')];
    }
    case 'space': {
      return [];
    }
    case 'html':
    case 'escape': {
      // Newlines inside literal HTML or escape text are content, not spacing.
      return [document.createTextNode(literalText(token))];
    }
    default: {
      return [document.createTextNode(collapseNewlines(literalText(token)))];
    }
  }
}

function renderToken(token: Token): readonly Node[] {
  switch (token.type) {
    case 'paragraph': {
      return renderParagraph(token);
    }
    case 'text': {
      return renderText(token);
    }
    case 'heading': {
      return renderHeading(token);
    }
    case 'blockquote': {
      return [elementOfNodes('blockquote', renderTokens(childTokens(token)))];
    }
    case 'strong': {
      return [inlineElement('strong', childTokens(token))];
    }
    case 'em': {
      return renderEmphasis(token);
    }
    case 'codespan': {
      return [
        elementOfNodes('code', [document.createTextNode(literalText(token))]),
      ];
    }
    case 'code': {
      return renderCode(token);
    }
    case 'link': {
      return renderLink(token);
    }
    case 'list': {
      return renderList(token);
    }
    case 'table': {
      return renderTable(token);
    }
    default: {
      return renderLeaf(token);
    }
  }
}

export function renderBlock(text: string): readonly Node[] {
  return renderTokens(Lexer.lex(text, { gfm: true, breaks: false }));
}

export function renderInline(text: string): readonly Node[] {
  return renderTokens(Lexer.lexInline(text));
}
