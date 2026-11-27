// Red tests for ENG30-PASSMARK-A11Y-01. Canonical contracts:
// docs/developer/application-and-ui.md §6.1 (L548–581), §7.1 (L585–609),
// §7.2 (L638–696). Graph owners: QuizPanel (src/ui/QuizPanel.ts:L6) and its
// .refresh() (src/ui/QuizPanel.ts:L15), QuizView (src/application/GameViewData.ts:L27).
// The requirement text and childless <p> structure already have a contract in
// tests/ui/engine-issue-30-passmark.test.ts; this file adds the ARIA live-region
// requirement only, without duplicating or weakening that inherited coverage.
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

function requirementNode(
  panel: QuizPanel,
): ReturnType<FakeElement['querySelector']> {
  const root = panel.element as unknown as FakeElement;
  return root.querySelector('p');
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

  it('UI-PASSMARK-A11Y-03: only the ARIA attribute is added to the byte-stable requirement', () => {
    installFakeDocument();
    const panel = new QuizPanel();

    panel.refresh(makeViewData({ activeQuiz: QUIZ_VIEW }));

    const requirement = requirementNode(panel);
    expect(requirement?.textContent).toBe(REQUIREMENT_TEXT);
    expect(requirement?.children).toEqual([]);
    expect(panel.element.querySelectorAll('button')).toHaveLength(0);
    expect(panel.element.querySelectorAll('input')).toHaveLength(0);
    expect(requirement?.getAttribute('aria-live')).toBe('polite');
  });
});
