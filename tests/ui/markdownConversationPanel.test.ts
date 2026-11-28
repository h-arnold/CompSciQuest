// MD-UI-08 / UI-CONVPROMPT-01 — the conversation panel owns only
// "Talking with X."; the canonical topic-suggested transcript line owns the
// authored prompt (application-and-ui.md §6.1, §7.1, §7.2). Canonical graph
// nodes: ConversationPanel.refresh(), formatEvent(), appendMarkdownBlock().
// Only injected fakes are used: no real DOM, storage, clock or random source.
import { afterEach, expect, it } from 'vitest';
import { ConversationPanel } from '../../src/ui/ConversationPanel';
import { formatEvent } from '../../src/ui/formatEvent';
import { HintPanel } from '../../src/ui/HintPanel';
import { makeBundle } from '../fixtures/persistence';
import {
  FakeElement,
  descendants,
  installFakeDocument,
  makeViewData,
  restoreDocument,
} from '../fixtures/ui';

afterEach(() => {
  restoreDocument();
});

function fake(element: HTMLElement): FakeElement {
  return element as unknown as FakeElement;
}

function nodesOf(root: FakeElement): readonly FakeElement[] {
  return [root, ...descendants(root)];
}

function hasTag(root: FakeElement, tag: string): boolean {
  return nodesOf(root).some((node) => node.tagName === tag);
}

function assertNoHtmlWrites(root: FakeElement): void {
  for (const node of nodesOf(root)) {
    expect(node.innerHTMLWrites).toEqual([]);
  }
}

it('MD-UI-08: conversation and hint text use block Markdown without extra entries', () => {
  installFakeDocument();
  const conversation = new ConversationPanel();
  const prompt = '**Ask** about sorting.';
  conversation.refresh(
    makeViewData({
      conversation: {
        actorId: 'npc-stub',
        actorName: 'AI',
        prompt,
      },
    }),
  );
  const conversationElement = fake(conversation.element);
  expect(conversationElement.hidden).toBe(false);
  // UI-CONVPROMPT-01 (application-and-ui.md §6.1): the panel renders only its
  // single "Talking with X." block; the suggested prompt belongs to the
  // transcript and must not be duplicated here.
  expect(conversationElement.children).toHaveLength(1);
  expect(hasTag(conversationElement, 'P')).toBe(true);
  expect(hasTag(conversationElement, 'STRONG')).toBe(false);
  expect(conversationElement.textContent).toBe('Talking with AI.');
  expect(conversationElement.textContent).not.toContain('Ask about sorting.');
  expect(conversationElement.textContent).not.toContain('**Ask**');

  const suggested = formatEvent(
    { type: 'topic-suggested', actorId: 'npc-stub', text: prompt },
    makeBundle(),
  );
  expect(suggested).toEqual([prompt]);

  const hint = new HintPanel();
  hint.refresh(
    makeViewData({
      hints: [{ hintId: 'hint-stub', level: 1, text: 'Try **this** next.' }],
    }),
  );
  const hintElement = fake(hint.element);
  expect(hintElement.hidden).toBe(false);
  expect(hintElement.children).toHaveLength(1);
  expect(hasTag(hintElement, 'STRONG')).toBe(true);
  expect(hintElement.textContent).toBe('Hint 1: Try this next.');
  expect(hintElement.textContent).not.toContain('**this**');
  assertNoHtmlWrites(conversationElement);
  assertNoHtmlWrites(hintElement);
});
