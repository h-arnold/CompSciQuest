// Red tests for MD-UI-01 to MD-UI-10 (slice MD-UI-01, transcript integration).
// Canonical contracts: .opencode/scratchpad/slices/markdown-formatting/spec.md
// §4.4, §4.5, §6.1, §8, §10.5–§10.6; branch-matrix.md rows MD-UI-01..10;
// docs/developer/application-and-ui.md §6.1, §7.1.
// Canonical graph nodes: GameWindow (.handleCommand, .renderBatch), OutputLog
// (.append), QuizPanel / ScorePanel (.refresh),
// formatEvent() and the FakeDocument / FakeElement harness. Only injected fakes
// are used: no real DOM, wall clock, random source, storage, network or files.
import { afterEach, expect, it } from 'vitest';
import type { GameEvent } from '../../src/core/events/GameEvent';
import { formatEvent } from '../../src/ui/formatEvent';
import { loadFailureMessage } from '../../src/ui/loadFailureMessage';
import { OutputLog } from '../../src/ui/OutputLog';
import { QuizPanel } from '../../src/ui/QuizPanel';
import { makeBundle, makeEnvelope } from '../fixtures/persistence';
import {
  FakeDocument,
  FakeElement,
  descendants,
  flush,
  installFakeDocument,
  loadBootstrap,
  makeViewData,
  restoreDocument,
  runBootstrap,
} from '../fixtures/ui';
import { makeBootSetup } from '../fixtures/uiSetup';

const TEXT = '#text';

// Element nodes that would prove a plain channel was interpreted as Markdown.
// A wrapper `div` or a `#text` node is still plain (spec §4.5).
const MARKUP_TAGS = new Set([
  'A',
  'BLOCKQUOTE',
  'CODE',
  'EM',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'OL',
  'P',
  'PRE',
  'STRONG',
  'TABLE',
  'UL',
]);

interface TranscriptChannels {
  readonly appendPlain?: (lines: readonly string[]) => void;
  readonly appendMarkdown?: (lines: readonly string[]) => void;
}

afterEach(() => {
  restoreDocument();
});

// ---------------------------------------------------------------------------
// Observable-surface helpers (no private access, no `as any`)
// ---------------------------------------------------------------------------

function fake(element: HTMLElement): FakeElement {
  return element as unknown as FakeElement;
}

function at<T>(items: readonly T[], index: number): T {
  const item = items.at(index);
  expect(item, `expected an item at index ${index}`).toBeDefined();
  if (item === undefined) {
    throw new Error(`Expected an item at index ${index}`);
  }
  return item;
}

function mustFind(root: FakeElement, selector: string): FakeElement {
  const found = root.querySelector(selector);
  expect(found, `expected an element matching "${selector}"`).toBeTruthy();
  return found ?? root;
}

function nodesOf(root: FakeElement): readonly FakeElement[] {
  return [root, ...descendants(root)];
}

function hasTag(root: FakeElement, tag: string): boolean {
  return nodesOf(root).some((node) => node.tagName === tag);
}

function assertPlain(root: FakeElement, expected: string): void {
  expect(root.textContent).toBe(expected);
  for (const node of nodesOf(root)) {
    expect(
      MARKUP_TAGS.has(node.tagName),
      `plain channel must not produce a ${node.tagName} node`,
    ).toBe(false);
    expect(node.innerHTMLWrites).toEqual([]);
  }
}

function assertNoHtmlWrites(root: FakeElement): void {
  for (const node of nodesOf(root)) {
    expect(node.innerHTMLWrites).toEqual([]);
  }
}
const liTexts = (node: FakeElement): string[] =>
  node.children.filter((c) => c.tagName === 'LI').map((c) => c.textContent);
const listSig = (node: FakeElement): string =>
  `${node.getAttribute('start') ?? ''}:${liTexts(node).join(',')}`;

// The named seams are probed through the public OutputLog surface. A missing
// channel fails here with its own reason, before Any DOM assertion can mask it.
function channel(
  log: OutputLog,
  name: keyof TranscriptChannels,
  reason: string,
): (lines: readonly string[]) => void {
  const candidate = (log as unknown as TranscriptChannels)[name];
  expect(candidate, reason).toBeTypeOf('function');
  if (typeof candidate !== 'function') {
    throw new TypeError(reason);
  }
  return (lines: readonly string[]): void => {
    candidate.call(log, lines);
  };
}

function pressEnter(input: FakeElement, value: string): void {
  input.value = value;
  input.dispatch('keydown', { key: 'Enter' });
}

// ---------------------------------------------------------------------------
// MD-UI-01 / 02 / 03 — plain channels stay plain
// ---------------------------------------------------------------------------

it('MD-UI-01: an echoed command stays one plain wrapper with no Markdown nodes', async () => {
  const setup = makeBootSetup({
    loadResult: { ok: true, dto: makeEnvelope() },
  });
  const bootstrap = await loadBootstrap();
  const result = await runBootstrap(bootstrap, setup.dependencies);

  const input = mustFind(result.root, 'input');
  pressEnter(input, '**look**');
  expect(setup.game.submits).toEqual(['**look**']);

  const log = mustFind(result.root, '.output-log');
  const echo = log.children.filter(
    (child) => child.textContent === '> **look**',
  );
  expect(echo).toHaveLength(1);
  const wrapper = at(echo, 0);
  expect(wrapper.tagName).toBe('DIV');
  expect(hasTag(wrapper, 'STRONG')).toBe(false);
  expect(hasTag(wrapper, 'BLOCKQUOTE')).toBe(false);
  assertPlain(wrapper, '> **look**');

  // The echo is written through the plain channel, which must remain available
  // once the Markdown channel is added (spec §4.5; named seam appendPlain).
  const plainLog = new OutputLog();
  const appendPlain = channel(
    plainLog,
    'appendPlain',
    'OutputLog.appendPlain must exist for the plain command echo',
  );
  appendPlain(['> **look**']);
  expect(fake(plainLog.element).children).toHaveLength(1);
  assertPlain(at(fake(plainLog.element).children, 0), '> **look**');
});

it('MD-UI-02: save status and error copy stay literal when they look like Markdown', async () => {
  const setup = makeBootSetup();
  const bootstrap = await loadBootstrap();
  const result = await runBootstrap(bootstrap, setup.dependencies);

  const input = mustFind(result.root, 'input');
  pressEnter(input, 'import');
  await flush();

  const expected = loadFailureMessage('invalid-json');
  const status = mustFind(result.root, '.save-status');
  assertPlain(status, expected);
  expect(loadFailureMessage('wrong-version')).toBe(
    'That save is from an older version of the game.',
  );
  expect(loadFailureMessage('newer-version')).toBe(
    'That save is from a newer version of the game.',
  );

  // A Markdown-looking status string must survive the plain channel byte for
  // byte; only the Markdown channel may interpret emphasis (spec §4.5).
  const statusLog = new OutputLog();
  const appendPlain = channel(
    statusLog,
    'appendPlain',
    'OutputLog.appendPlain must exist for plain status and error copy',
  );
  appendPlain(['**Status** `copy` with *markers*']);
  const wrapper = at(fake(statusLog.element).children, 0);
  assertPlain(wrapper, '**Status** `copy` with *markers*');
});

it('MD-UI-03: sidebar score copy stays plain with Markdown-looking view data', async () => {
  const viewData = makeViewData({
    areas: [
      {
        worldId: 'world-stub',
        areaId: 'area-stub',
        worldName: '**Stub** World',
        areaName: '`Area`',
        earnedScore: 7,
        maxScore: 10,
        visitedRoomCount: 1,
        roomCount: 2,
        topics: [
          {
            id: 'topic-1',
            title: '*Stub* Topic',
            specReference: 'stub section',
            status: 'covered',
            complete: false,
          },
        ],
      },
    ],
  });
  const setup = makeBootSetup({ viewData });
  const bootstrap = await loadBootstrap();
  const result = await runBootstrap(bootstrap, setup.dependencies);

  const sidebar = mustFind(result.root, '.score-panel');
  assertPlain(
    sidebar,
    [
      'Score: 7',
      'Lives: 3',
      '**Stub** World — `Area`',
      'Score: 7 / 10',
      'Rooms visited: 1 / 2',
      '*Stub* Topic — covered',
    ].join(''),
  );

  const plainLog = new OutputLog();
  const appendPlain = channel(
    plainLog,
    'appendPlain',
    'OutputLog.appendPlain must exist for the plain sidebar channel',
  );
  appendPlain(['**Stub** World — `Area`']);
  assertPlain(
    at(fake(plainLog.element).children, 0),
    '**Stub** World — `Area`',
  );
});

// ---------------------------------------------------------------------------
// MD-UI-04 / 05 / 06 — transcript wrappers, empty entries and live region
// ---------------------------------------------------------------------------

it('MD-UI-04: one formatted entry stays inside exactly one wrapper div', () => {
  installFakeDocument(new FakeDocument());
  const log = new OutputLog();
  const appendMarkdown = channel(
    log,
    'appendMarkdown',
    'OutputLog.appendMarkdown must exist for the Markdown transcript channel',
  );

  appendMarkdown(['**bold**']);
  const first = fake(log.element).children;
  expect(first).toHaveLength(1);
  const wrapper = at(first, 0);
  expect(wrapper.tagName).toBe('DIV');
  // §4.2 keeps the lone paragraph as a P holding the inline STRONG (§4.5).
  expect(wrapper.children.map((node) => node.tagName)).toEqual(['P']);
  const paragraph = at(wrapper.children, 0);
  expect(paragraph.children.map((node) => node.tagName)).toEqual(['STRONG']);
  expect(at(paragraph.children, 0).textContent).toBe('bold');
  expect(wrapper.textContent).toBe('bold');

  const multiNodeLog = new OutputLog();
  channel(
    multiNodeLog,
    'appendMarkdown',
    'OutputLog.appendMarkdown must exist for multi-node Markdown entries',
  )(['First paragraph\n\nSecond paragraph']);
  const wrappers = fake(multiNodeLog.element).children;
  expect(wrappers).toHaveLength(1);
  const multiWrapper = at(wrappers, 0);
  expect(multiWrapper.tagName).toBe('DIV');
  expect(multiWrapper.children.map((node) => node.tagName)).toEqual(['P', 'P']);
  assertNoHtmlWrites(fake(multiNodeLog.element));
});

it('MD-UI-05: an empty Markdown entry keeps its empty wrapper in the log', () => {
  installFakeDocument(new FakeDocument());
  const log = new OutputLog();
  channel(
    log,
    'appendMarkdown',
    'OutputLog.appendMarkdown must exist for the documented blank line',
  )(['']);

  const wrappers = fake(log.element).children;
  expect(wrappers).toHaveLength(1);
  const wrapper = at(wrappers, 0);
  expect(wrapper.tagName).toBe('DIV');
  expect(wrapper.tagName).not.toBe(TEXT);
  expect(wrapper.textContent).toBe('');
  expect(wrapper.children).toEqual([]);
  // CSS owns the one-line minimum height for `.output-log > div:empty` (§8).
  assertNoHtmlWrites(fake(log.element));
});

it('MD-UI-06: a table and a fence leave the log role and live region intact', () => {
  installFakeDocument(new FakeDocument());
  const log = new OutputLog();
  channel(
    log,
    'appendMarkdown',
    'OutputLog.appendMarkdown must exist for tables and fenced code',
  )([
    '| Port | Label |\n| --- | --- |\n| west | ARRIVAL |',
    '```\nATTENDANCE: NOT SATISFIED\n```',
  ]);

  const element = fake(log.element);
  expect(element.getAttribute('role')).toBe('log');
  expect(element.getAttribute('aria-live')).toBe('polite');
  expect(element.children).toHaveLength(2);
  expect(hasTag(element, 'TABLE')).toBe(true);
  expect(hasTag(element, 'PRE')).toBe(true);
  assertNoHtmlWrites(element);
});

// ---------------------------------------------------------------------------
// MD-UI-07 — quiz panel uses the assigned channels (MD-UI-08 lives in
// markdownConversationPanel.test.ts to keep this file within the line cap)
// ---------------------------------------------------------------------------

it('MD-UI-07: quiz options use inline Markdown and prompt and requirement use block Markdown', () => {
  installFakeDocument();
  const panel = new QuizPanel();
  panel.refresh(
    makeViewData({
      activeQuiz: {
        quizId: 'quiz-stub',
        prompt: '**Which** structure repeats?',
        options: ['**option**', 'second option'],
        questionNumber: 1,
        questionCount: 3,
        passMark: 2,
        remainingWrong: 1,
      },
    }),
  );

  const element = fake(panel.element);
  expect(element.hidden).toBe(false);
  const option = element.children.find((child) =>
    child.textContent.startsWith('1. '),
  );
  expect(option, 'the first numbered option wrapper is present').toBeDefined();
  if (option === undefined) {
    throw new Error('The first numbered option wrapper is missing');
  }
  expect(option.textContent).toBe('1. option');
  expect(hasTag(option, 'STRONG')).toBe(true);

  const prompt = element.children.find(
    (child) => hasTag(child, 'P') && hasTag(child, 'STRONG'),
  );
  expect(prompt, 'the prompt uses the block Markdown channel').toBeDefined();
  if (prompt === undefined) {
    throw new Error('The prompt was not rendered as a Markdown block');
  }
  expect(prompt.textContent).toContain('Which structure repeats?');

  const requirement = nodesOf(element).find(
    (node) =>
      node.tagName === 'P' && node.getAttribute('aria-live') === 'polite',
  );
  expect(
    requirement,
    'the pass requirement keeps its polite live region',
  ).toBeDefined();
  expect(requirement?.textContent).toBe(
    'Pass mark: 2 correct of 3. Wrong answers allowed: 1.',
  );
  // Prompt and options precede it; the requirement closes the panel (§4.2/§7.1).
  const lastChild = element.children.at(-1);
  expect(lastChild === requirement, 'requirement is last').toBe(true);
  expect(lastChild?.getAttribute('aria-live')).toBe('polite');
  expect(element.textContent).not.toContain('quiz-stub');
  assertNoHtmlWrites(element);
});

// ---------------------------------------------------------------------------
// MD-UI-09 / 10 — formatted events and observable text
// ---------------------------------------------------------------------------

it('MD-UI-09: formatted events use Markdown while numbering and friendly copy survive', () => {
  installFakeDocument(new FakeDocument());
  const bundle = makeBundle();
  const question: GameEvent = {
    type: 'question-asked',
    quizId: 'quiz-stub',
    questionId: 'question-stub',
    prompt: 'Choose **one**.',
    options: ['first **option**', 'second option'],
  };
  const questionLines = formatEvent(question, bundle);
  expect(questionLines[0]).toBe('Choose **one**.');
  expect(questionLines[1]?.startsWith('1. ')).toBe(true);
  expect(questionLines[2]?.startsWith('2. ')).toBe(true);

  const events: readonly GameEvent[] = [
    { type: 'message', text: '**bold** message' },
    { type: 'npc-spoke', actorId: 'npc-stub', text: 'Spoken **text**.' },
    {
      type: 'topic-suggested',
      actorId: 'npc-stub',
      text: 'Ask about **sorting**.',
    },
    {
      type: 'hint-shown',
      hintId: 'hint-stub',
      level: 1,
      text: 'Try **this**.',
    },
    {
      type: 'answer-evaluated',
      quizId: 'quiz-stub',
      questionId: 'question-stub',
      correct: true,
      explanation: '**Correct** answer.',
    },
    {
      type: 'room-entered',
      room: {
        id: 'room-stub-start',
        title: 'The Hub',
        description: 'A **port** here.',
        exits: ['north'],
      },
    },
    question,
    { type: 'score-changed', delta: 2, total: 9, reason: 'puzzle-solved:p-1' },
    { type: 'lives-changed', lives: 2 },
    { type: 'topic-completed', topicId: 'topic-1' },
  ];

  const log = new OutputLog();
  const appendMarkdown = channel(
    log,
    'appendMarkdown',
    'OutputLog.appendMarkdown must exist for formatted game events',
  );
  for (const event of events) {
    appendMarkdown(formatEvent(event, bundle));
  }

  const element = fake(log.element);
  expect(hasTag(element, 'STRONG')).toBe(true);
  expect(element.textContent).toContain('bold message');
  expect(element.textContent).toContain('first option');
  expect(element.textContent).toContain('second option');
  // Numbering: §6.1 literal inline, §4.2 one OL, or two one-item OLs (start 1/2).
  const lists = nodesOf(element)
    .filter((n) => n.tagName === 'OL')
    .map((n) => listSig(n));
  const literalNumbering =
    element.textContent.includes('1. first option') &&
    element.textContent.includes('2. second option');
  const one = lists.some((s) => s.endsWith(':first option,second option'));
  const two =
    lists.length === 2 &&
    lists.includes('1:first option') &&
    lists.includes('2:second option');
  expect(literalNumbering || one || two).toBe(true);
  expect(element.textContent).not.toContain('puzzle-solved:p-1');
  expect(element.textContent).not.toContain('room-stub-start');
  expect(element.textContent).not.toContain('quiz-stub');
  expect(element.textContent).not.toContain('question-stub');
  assertNoHtmlWrites(element);
});

it('MD-UI-09 (event channels): message lists use blocks and quiz options stay inline', async () => {
  const setup = makeBootSetup();
  const bootstrap = await loadBootstrap();
  const result = await runBootstrap(bootstrap, setup.dependencies);
  const log = mustFind(result.root, '.output-log');
  // (a) A numbered message is transcript prose: §4.2 block OL/LI, not the
  // inline literal `1. ` text reserved for quiz options (§6.1).
  const beforeMessage = log.children.length;
  setup.bus.publish([{ type: 'message', text: '1. first item' }]);
  const messageWrappers = log.children.slice(beforeMessage);
  expect.soft(messageWrappers).toHaveLength(1);
  const listWrapper = at(messageWrappers, 0);
  expect.soft(hasTag(listWrapper, 'OL'), 'block OL').toBe(true);
  const itemText = descendants(listWrapper).find(
    (node) => node.tagName === 'LI',
  )?.textContent;
  expect.soft(itemText, 'the item is an LI').toBe('first item');
  expect.soft(listWrapper.textContent).not.toContain('1. ');
  // (b) The question prompt is block Markdown; numbered options stay inline.
  const beforeQuestion = log.children.length;
  const options = ['first option', 'second option'];
  setup.bus.publish([
    {
      type: 'question-asked',
      quizId: 'quiz-stub',
      questionId: 'question-stub',
      prompt: 'Choose **one**.',
      options,
    },
  ]);
  const questionWrappers = log.children.slice(beforeQuestion);
  expect.soft(questionWrappers).toHaveLength(3);
  const promptWrapper = at(questionWrappers, 0);
  expect.soft(hasTag(promptWrapper, 'P'), 'block P prompt').toBe(true);
  expect.soft(promptWrapper.textContent).toContain('Choose one.');
  expect.soft(hasTag(promptWrapper, 'STRONG')).toBe(true);
  for (const [index, wrapper] of questionWrappers.slice(1).entries()) {
    expect.soft(hasTag(wrapper, 'OL'), 'no OL').toBe(false);
    const expected = `${index + 1}. ${at(options, index)}`;
    expect.soft(wrapper.textContent, 'inline numbering kept').toBe(expected);
  }
  expect.soft(log.textContent).not.toContain('quiz-stub');
  expect.soft(log.textContent).not.toContain('question-stub');
  assertNoHtmlWrites(log);
});

it('MD-UI-10: appended text matches the source with newlines collapsed and no HTML writes', () => {
  installFakeDocument(new FakeDocument());
  const log = new OutputLog();
  const appendPlain = channel(
    log,
    'appendPlain',
    'OutputLog.appendPlain must exist for the plain text assertion',
  );
  const appendMarkdown = channel(
    log,
    'appendMarkdown',
    'OutputLog.appendMarkdown must exist for the renderer text assertion',
  );

  const source = 'Prose with **bold** and\na newline.';
  appendPlain(['> plain **input**']);
  appendMarkdown([source]);

  const element = fake(log.element);
  expect(element.children).toHaveLength(2);
  expect(at(element.children, 0).textContent).toBe('> plain **input**');
  expect(at(element.children, 1).textContent).toBe(
    'Prose with bold and a newline.',
  );
  assertNoHtmlWrites(element);
});
