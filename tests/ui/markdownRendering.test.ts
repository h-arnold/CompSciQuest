// Red tests for MD-RENDER-01 to MD-RENDER-18 (slice MD-RENDER-01).
// Canonical contracts: .opencode/scratchpad/slices/markdown-formatting/spec.md
// §4 (rendering contract), §5.1 (style families), §10 (acceptance);
// .opencode/scratchpad/branch-matrix.md rows MD-RENDER-01..18;
// docs/developer/application-and-ui.md §7.1 (DOM-only renderer boundary).
// Only the fake DOM from tests/fixtures/ui.ts is used; no real document,
// wall clock, random source, storage, network or file system.
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import {
  FakeDocument,
  FakeElement,
  installFakeDocument,
  restoreDocument,
} from '../fixtures/ui';

const TEXT = '#text';
const LIST_ITEM = 'LI';

interface Renderer {
  readonly renderBlock: (text: string) => readonly Node[];
  readonly renderInline: (text: string) => readonly Node[];
}

// Loaded per test so a red run names each matrix case rather than failing at
// collection while the renderer module and the marked dependency are absent.
async function loadRenderer(): Promise<Renderer> {
  return import('../../src/ui/markdown/renderMarkdown');
}

const state: { page: FakeDocument | undefined } = { page: undefined };

function currentPage(): FakeDocument {
  const installed = state.page;
  if (installed === undefined) {
    throw new Error('No fake document is installed');
  }
  return installed;
}

beforeEach(() => {
  state.page = installFakeDocument(new FakeDocument());
});

afterEach(() => {
  restoreDocument();
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Fake-DOM inspection helpers (no private access, no forced casts)
// ---------------------------------------------------------------------------

function fakeNode(node: Node): FakeElement {
  if (!(node instanceof FakeElement)) {
    throw new TypeError('Renderer returned a node that is not a fake DOM node');
  }
  return node;
}

function tags(nodes: readonly Node[]): string[] {
  return nodes.map((node) => fakeNode(node).tagName);
}

function elementTags(nodes: readonly Node[]): string[] {
  return tags(nodes).filter((tag) => tag !== TEXT);
}

function textOf(nodes: readonly Node[]): string {
  return nodes.map((node) => fakeNode(node).textContent).join('');
}

function at<T>(items: readonly T[], index: number): T {
  const item = items.at(index);
  if (item === undefined) {
    throw new Error(`Expected an item at index ${index}`);
  }
  return item;
}

function allNodes(root: FakeElement): FakeElement[] {
  return [root, ...root.children.flatMap((child) => allNodes(child))];
}

function find(root: FakeElement, tag: string): FakeElement {
  const match = allNodes(root).find((node) => node.tagName === tag);
  if (match === undefined) {
    throw new Error(`Expected a ${tag} inside the rendered nodes`);
  }
  return match;
}

function declaredClasses(element: FakeElement): string {
  return `${element.className} ${element.getAttribute('class') ?? ''}`;
}

function hasClass(element: FakeElement, name: string): boolean {
  return declaredClasses(element).split(/\s+/).includes(name);
}

function assertClean(root: FakeElement): void {
  for (const node of allNodes(root)) {
    expect(node.innerHTMLWrites).toEqual([]);
    expect(node.attributes.has('style')).toBe(false);
  }
}

// ---------------------------------------------------------------------------
// Block and inline token rendering
// ---------------------------------------------------------------------------

it('MD-RENDER-01: two paragraphs and a collapsed newline in one text token', async () => {
  const { renderBlock } = await loadRenderer();
  const nodes = renderBlock('First line\nsecond line\n\nSecond paragraph.');

  expect(tags(nodes)).toEqual(['P', 'P']);
  expect(fakeNode(at(nodes, 0)).textContent).toBe('First line second line');
  expect(fakeNode(at(nodes, 1)).textContent).toBe('Second paragraph.');
  for (const node of nodes) {
    assertClean(fakeNode(node));
  }
});

it('MD-RENDER-02: emphasis maps to strong, em, strong containing em and code', async () => {
  const { renderInline } = await loadRenderer();
  const strong = renderInline('**handle**');
  expect(tags(strong)).toEqual(['STRONG']);
  expect(textOf(strong)).toBe('handle');

  const emphasised = renderInline('*way through*');
  expect(tags(emphasised)).toEqual(['EM']);
  expect(textOf(emphasised)).toBe('way through');

  const person = renderInline('***person***');
  expect(tags(person)).toEqual(['STRONG']);
  const outer = fakeNode(at(person, 0));
  expect(outer.children.map((node) => node.tagName)).toEqual(['EM']);
  expect(textOf(person)).toBe('person');

  const code = renderInline('`code`');
  expect(tags(code)).toEqual(['CODE']);
  expect(textOf(code)).toBe('code');
});

it('MD-RENDER-03: ordered list preserves a non-default start attribute', async () => {
  const { renderBlock } = await loadRenderer();
  const nodes = renderBlock('3. first\n4. second\n5. third');

  expect(tags(nodes)).toEqual(['OL']);
  const list = fakeNode(at(nodes, 0));
  expect(list.getAttribute('start')).toBe('3');
  expect(list.children.map((node) => node.tagName)).toEqual([
    LIST_ITEM,
    LIST_ITEM,
    LIST_ITEM,
  ]);
  assertClean(list);
});

it('MD-RENDER-04: unordered list keeps nested block content inside its li', async () => {
  const { renderBlock } = await loadRenderer();
  const nodes = renderBlock('- First item\n- Second item\n  - Nested item');

  expect(tags(nodes)).toEqual(['UL']);
  const list = fakeNode(at(nodes, 0));
  expect(list.children.map((node) => node.tagName)).toEqual([
    LIST_ITEM,
    LIST_ITEM,
  ]);
  const second = at(list.children, 1);
  expect(second.children.some((node) => node.tagName === 'UL')).toBe(true);
  const nested = find(second, 'UL');
  expect(nested.children.map((node) => node.tagName)).toEqual([LIST_ITEM]);
  expect(nested.textContent).toBe('Nested item');
  assertClean(list);
});

it('MD-RENDER-05: table uses the wrapper, scopes and alignment classes', async () => {
  const { renderBlock } = await loadRenderer();
  const source = [
    '| Port | Label | State |',
    '| :--- | :---: | ---: |',
    '| west | ARRIVAL | dark |',
    '| east | LIVE | bright |',
  ].join('\n');

  const nodes = renderBlock(source);

  expect(tags(nodes)).toEqual(['DIV']);
  const wrapper = fakeNode(at(nodes, 0));
  expect(hasClass(wrapper, 'table-scroll')).toBe(true);
  const table = find(wrapper, 'TABLE');
  expect(table.children.map((node) => node.tagName)).toEqual([
    'THEAD',
    'TBODY',
  ]);

  const head = at(table.children, 0);
  const body = at(table.children, 1);
  expect(head.children.map((node) => node.tagName)).toEqual(['TR']);
  const headerRow = at(head.children, 0);
  expect(headerRow.children.map((node) => node.tagName)).toEqual([
    'TH',
    'TH',
    'TH',
  ]);
  expect(headerRow.children.map((node) => node.getAttribute('scope'))).toEqual([
    'col',
    'col',
    'col',
  ]);
  const alignments = ['align-left', 'align-center', 'align-right'];
  expect(
    headerRow.children.map((node, index) =>
      hasClass(node, alignments[index] ?? ''),
    ),
  ).toEqual([true, true, true]);

  expect(body.children.map((node) => node.tagName)).toEqual(['TR', 'TR']);
  const firstBodyRow = at(body.children, 0);
  expect(firstBodyRow.children.map((node) => node.tagName)).toEqual([
    'TD',
    'TD',
    'TD',
  ]);
  assertClean(wrapper);
});

it('MD-RENDER-06: fences keep a language class only when one is supplied', async () => {
  const { renderBlock } = await loadRenderer();
  const nodes = renderBlock(
    '```ts\nconst answer = 42;\n```\n\n```\nplain fence\n```',
  );

  expect(tags(nodes)).toEqual(['PRE', 'PRE']);
  const first = fakeNode(at(nodes, 0));
  const second = fakeNode(at(nodes, 1));
  expect(first.children.map((node) => node.tagName)).toEqual(['CODE']);
  expect(second.children.map((node) => node.tagName)).toEqual(['CODE']);

  const firstCode = at(first.children, 0);
  const secondCode = at(second.children, 0);
  expect(hasClass(firstCode, 'language-ts')).toBe(true);
  expect(declaredClasses(secondCode)).not.toContain('language-');
  expect(firstCode.textContent).toContain('const answer = 42;');
  expect(secondCode.textContent).toContain('plain fence');
  for (const pre of [first, second]) {
    expect(
      allNodes(pre)
        .filter((node) => node.tagName !== TEXT)
        .map((node) => node.tagName),
    ).toEqual(['PRE', 'CODE']);
    assertClean(pre);
  }
});

it('MD-RENDER-07: four-space indented code preserves its lines', async () => {
  const { renderBlock } = await loadRenderer();
  const nodes = renderBlock('    first line\n    second line');

  expect(tags(nodes)).toEqual(['PRE']);
  const pre = fakeNode(at(nodes, 0));
  const code = find(pre, 'CODE');
  expect(code.textContent).toContain('first line\nsecond line');
  assertClean(pre);
});

it('MD-RENDER-08: blockquote and headings h1 to h6 map to their elements', async () => {
  const { renderBlock } = await loadRenderer();
  const source = [
    '> Quoted line',
    '',
    '# One',
    '',
    '## Two',
    '',
    '### Three',
    '',
    '#### Four',
    '',
    '##### Five',
    '',
    '###### Six',
  ].join('\n');

  const nodes = renderBlock(source);

  expect(tags(nodes)).toEqual([
    'BLOCKQUOTE',
    'H1',
    'H2',
    'H3',
    'H4',
    'H5',
    'H6',
  ]);
  expect(fakeNode(at(nodes, 0)).textContent).toBe('Quoted line');
});

it('MD-RENDER-09: a lone horizontal rule yields one hr node', async () => {
  const { renderBlock } = await loadRenderer();
  const nodes = renderBlock('---');

  expect(tags(nodes)).toEqual(['HR']);
  assertClean(fakeNode(at(nodes, 0)));
});

it('MD-RENDER-10: a hard line break yields one br node with breaks disabled', async () => {
  const { renderBlock } = await loadRenderer();
  // Code-lead's reading of the agreed spec §4.2: with breaks: false a Markdown
  // hard break (two trailing spaces then newline) still produces a br token.
  const nodes = renderBlock('first  \nsecond');

  expect(tags(nodes)).toEqual(['P']);
  const paragraph = fakeNode(at(nodes, 0));
  expect(
    allNodes(paragraph).filter((node) => node.tagName === 'BR'),
  ).toHaveLength(1);
  expect(paragraph.textContent).toContain('first');
  expect(paragraph.textContent).toContain('second');
});

it('MD-RENDER-11: raw HTML stays literal text with no element or innerHTML write', async () => {
  const { renderBlock } = await loadRenderer();
  const source = '<script>alert(1)</script>';

  const nodes = renderBlock(source);

  expect(tags(nodes)).toEqual([TEXT]);
  expect(textOf(nodes)).toBe(source);
  assertClean(fakeNode(at(nodes, 0)));
});

it('MD-RENDER-12: image syntax renders alt text only', async () => {
  const { renderBlock } = await loadRenderer();
  const nodes = renderBlock('![alt text](https://example.invalid/image.png)');

  expect(tags(nodes)).toEqual([TEXT]);
  expect(textOf(nodes)).toBe('alt text');
});

it('MD-RENDER-13: escaped markers render as literal characters', async () => {
  const { renderInline } = await loadRenderer();
  const nodes = renderInline(String.raw`\*not emphasised\*`);

  expect(textOf(nodes)).toBe('*not emphasised*');
  expect(elementTags(nodes)).toEqual([]);
});

it('MD-RENDER-14: allowed Pages links keep query and fragment and open safely', async () => {
  const { renderInline } = await loadRenderer();
  const cases = [
    {
      source: '[Pages](https://h-arnold.github.io/CompSciQuest/)',
      label: 'Pages',
      href: 'https://h-arnold.github.io/CompSciQuest/',
    },
    {
      source:
        '[Notes](https://h-arnold.github.io/CompSciQuest/topics/notes.html?q=sorting#step-2)',
      label: 'Notes',
      href: 'https://h-arnold.github.io/CompSciQuest/topics/notes.html?q=sorting#step-2',
    },
  ];

  for (const item of cases) {
    const nodes = renderInline(item.source);

    expect(tags(nodes)).toEqual(['A']);
    const anchor = fakeNode(at(nodes, 0));
    expect(anchor.textContent).toBe(item.label);
    expect(anchor.getAttribute('href')).toBe(item.href);
    expect(anchor.getAttribute('target')).toBe('_blank');
    expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
    assertClean(anchor);
  }
});

it('MD-RENDER-15: disallowed links render as label text only', async () => {
  const { renderInline } = await loadRenderer();
  const cases = [
    { label: 'Bad', source: '[Bad](javascript:alert%281%29)' },
    { label: 'Bad', source: '[Bad](data:text/plain,hello)' },
    { label: 'Bad', source: '[Bad](file:///tmp/notes.txt)' },
    {
      label: 'Bad',
      source: '[Bad](https://user:pass@h-arnold.github.io/CompSciQuest/)',
    },
    {
      label: 'Bad',
      source: '[Bad](https://h-arnold.github.io:8443/CompSciQuest/)',
    },
    { label: 'Bad', source: '[Bad](https://example.invalid/CompSciQuest/)' },
    {
      label: 'Repo',
      source: '[Repo](https://github.com/h-arnold/CompSciQuest)',
    },
  ];

  for (const item of cases) {
    const nodes = renderInline(item.source);

    expect(nodes.length).toBeGreaterThan(0);
    expect(elementTags(nodes)).toEqual([]);
    expect(textOf(nodes)).toBe(item.label);
    expect(nodes.every((node) => !fakeNode(node).attributes.has('href'))).toBe(
      true,
    );
  }
});

it('MD-RENDER-16: inline mode leaves block-only syntax as text', async () => {
  const { renderInline } = await loadRenderer();
  const nodes = renderInline('# heading\n\n- item');

  expect(nodes.length).toBeGreaterThan(0);
  expect(elementTags(nodes)).toEqual([]);
  const text = textOf(nodes);
  expect(text).toContain('# heading');
  expect(text).toContain('- item');
  expect(text).not.toContain('\n');
});

it('MD-RENDER-17: an unknown token type becomes literal text', async () => {
  const { renderBlock } = await loadRenderer();
  const { Lexer } = await import('marked');
  // An intentionally unmapped token; the marked token union cannot describe it.
  const token = {
    type: 'unmapped-token',
    raw: 'unknown-token-text',
    text: 'unknown-token-text',
  };
  const spy = vi
    .spyOn(Lexer, 'lex')
    .mockReturnValue([token] as unknown as ReturnType<typeof Lexer.lex>);

  const nodes = renderBlock('anything');

  expect(spy).toHaveBeenCalled();
  expect(tags(nodes)).toEqual([TEXT]);
  expect(textOf(nodes)).toBe('unknown-token-text');
});

it('MD-RENDER-18: helpers return arrays and append nothing on their own', async () => {
  const { renderBlock, renderInline } = await loadRenderer();
  const block = renderBlock('**bold**\n\n| a |\n| --- |\n| b |');
  const inline = renderInline('*emphasis* `code`');

  expect(Array.isArray(block)).toBe(true);
  expect(Array.isArray(inline)).toBe(true);
  expect(currentPage().body.children).toEqual([]);
  for (const node of [...block, ...inline]) {
    assertClean(fakeNode(node));
  }
});

// ---------------------------------------------------------------------------
// Reviewer follow-ups (PASS WITH MINORS): uncovered §4.2/§4.3 contracts
// ---------------------------------------------------------------------------

it('MD-RENDER-02 (alternate marker): ___person___ matches the ***person*** shape', async () => {
  const { renderBlock } = await loadRenderer();
  const nodes = renderBlock('___person___');

  expect(tags(nodes)).toEqual(['P']);
  const paragraph = fakeNode(at(nodes, 0));
  // Spec §4.2: bold italic is `strong` containing `em`, for either marker.
  expect(paragraph.children.map((node) => node.tagName)).toEqual(['STRONG']);
  const strong = find(paragraph, 'STRONG');
  expect(strong.children.map((node) => node.tagName)).toEqual(['EM']);
  expect(strong.textContent).toBe('person');
});

it('MD-RENDER-11 (multi-line raw HTML): raw HTML newlines stay literal', async () => {
  const { renderBlock } = await loadRenderer();
  const source = '<div class="x">\nline one\nline two\n</div>';
  const nodes = renderBlock(source);

  // Spec §4.2: newline collapsing applies to text tokens, not raw HTML.
  expect(tags(nodes)).toEqual([TEXT]);
  expect(fakeNode(at(nodes, 0)).textContent).toContain('line one\nline two');
  assertClean(fakeNode(at(nodes, 0)));
});

it('MD-RENDER-15 (formatted label on a rejected link): label text is inert', async () => {
  const { renderInline } = await loadRenderer();
  const nodes = renderInline('[**Bad**](javascript:alert%281%29)');

  // Spec §4.3: a rejected link renders as its label text only — the rendered
  // label is `Bad`, with no Markdown markers and no element node.
  expect(nodes.length).toBeGreaterThan(0);
  expect(tags(nodes)).not.toContain('A');
  expect(elementTags(nodes)).toEqual([]);
  expect(textOf(nodes)).toBe('Bad');
});
