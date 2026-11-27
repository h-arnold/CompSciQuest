// Red tests for ENG30-PASSMARK-A11Y-01. Canonical contracts:
// docs/developer/application-and-ui.md §6.1 (L548–581), §7.1 (L585–609),
// §7.2 (L638–696). Graph owners: QuizPanel (src/ui/QuizPanel.ts:L6) and its
// .refresh() (src/ui/QuizPanel.ts:L15), QuizView (src/application/GameViewData.ts:L27).
// The requirement copy already has a contract in
// tests/ui/engine-issue-30-passmark.test.ts. Spec §4.5 / MD-UI-07 require the
// paragraph through block Markdown, so plain prose becomes one #text child;
// this file adds the ARIA live-region requirement and pins that shape without
// duplicating or weakening inherited coverage.
import { afterEach, describe, expect, it } from 'vitest';
import type { QuizView } from '../../src/application/GameViewData';
import { QuizPanel } from '../../src/ui/QuizPanel';
import {
  installFakeDocument,
  makeViewData,
  restoreDocument,
  type FakeElement,
} from '../fixtures/ui';

interface PassMarkA11yQuizView extends QuizView {
  readonly passMark: number;
  readonly remainingWrong: number;
}

// Stub numbers chosen so no prompt or option line contains them by accident.
const QUIZ_VIEW: PassMarkA11yQuizView = {
  quizId: 'quiz-stub',
  prompt: 'Which <b>structure</b> repeats?',
  options: ['first option', 'second option'],
  questionNumber: 1,
  questionCount: 7,
  passMark: 3,
  remainingWrong: 4,
};

const REQUIREMENT_TEXT = 'Pass mark: 3 correct of 7. Wrong answers allowed: 4.';

// Mirror a real DOM querySelector's null miss without a literal (unicorn/no-null).
function absentElement(): FakeElement | null {
  return new URLSearchParams().get('absent') as unknown as FakeElement;
}

function requirementNode(
  panel: QuizPanel,
): ReturnType<FakeElement['querySelector']> {
  const root = panel.element as unknown as FakeElement;
  // Match by copy: a leading prompt `<p>` must not be mistaken for the
  // requirement once the panel puts the prompt before it (MD-UI-07).
  return (
    root
      .querySelectorAll('p')
      .find((node) => node.textContent === REQUIREMENT_TEXT) ?? absentElement()
  );
}

afterEach(() => {
  restoreDocument();
});

describe('ENG30-PASSMARK-A11Y-01: QuizPanel requirement live region (application-and-ui.md §7.1, §7.2)', () => {
  it('UI-PASSMARK-A11Y-01: the requirement paragraph is a polite live region', () => {
    installFakeDocument();
    const panel = new QuizPanel();

    panel.refresh(makeViewData({ activeQuiz: QUIZ_VIEW }));

    const requirement = requirementNode(panel);
    expect(requirement).not.toBeNull();
    expect(requirement?.textContent).toBe(REQUIREMENT_TEXT);
    expect(requirement?.getAttribute('aria-live')).toBe('polite');
  });

  it('UI-PASSMARK-A11Y-02: with no quiz the panel is hidden and no live region is left behind', () => {
    installFakeDocument();
    const panel = new QuizPanel();
    panel.refresh(makeViewData({ activeQuiz: QUIZ_VIEW }));
    expect(requirementNode(panel)).not.toBeNull();

    panel.refresh(makeViewData());

    expect(panel.element.hidden).toBe(true);
    expect(panel.element.textContent).toBe('');
    expect(panel.element.querySelectorAll('p')).toHaveLength(0);
  });

  it('UI-PASSMARK-A11Y-03: the requirement keeps its copy and live region while rendering as block Markdown prose', () => {
    installFakeDocument();
    const panel = new QuizPanel();

    panel.refresh(makeViewData({ activeQuiz: QUIZ_VIEW }));

    const requirement = requirementNode(panel);
    expect(requirement?.textContent).toBe(REQUIREMENT_TEXT);
    expect(requirement?.children).toHaveLength(1);
    expect(requirement?.children[0]?.tagName).toBe('#text');
    expect(requirement?.children[0]?.textContent).toBe(REQUIREMENT_TEXT);
    expect(panel.element.querySelectorAll('button')).toHaveLength(0);
    expect(panel.element.querySelectorAll('input')).toHaveLength(0);
    expect(requirement?.getAttribute('aria-live')).toBe('polite');
  });
});
