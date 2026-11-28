// E2E-CONVPROMPT-01 / UI-CONVPROMPT-01 — browser contract for the single
// on-screen owner of an authored conversation prompt. Confirmed by exploration
// QA (.opencode/scratchpad/slices/slice2-convprompt/qa-report.md) and the
// re-anchored Vitest review. No generated copy is re-pinned beyond the confirmed
// authored prompt of `topic-ai-recycling-bin` (conversation-topics.ts:126).
import { expect, test, type Page } from 'playwright/test';
import {
  seedStorage,
  startNewGame,
  submit,
  transcript,
  waitForLine,
  watchConsole,
} from './helpers';

// The authored prompt whose single ownership this spec pins. Both answer forms
// live inside this one string, so counting it counts them too.
const PROMPT = '(You could ask ai yes or ask ai no.)';
const YES_FORM = 'ask ai yes';
const NO_FORM = 'ask ai no';

function occurrences(text: string, needle: string): number {
  let count = 0;
  let index = text.indexOf(needle);
  while (index !== -1) {
    count += 1;
    index = text.indexOf(needle, index + needle.length);
  }
  return count;
}

async function bodyText(page: Page): Promise<string> {
  return (await page.locator('body').textContent()) ?? '';
}

const noConsoleErrors: () => readonly string[] = () => [];

test.describe('UI-CONVPROMPT-01 single on-screen suggested prompt', () => {
  let errors: () => readonly string[] = noConsoleErrors;

  test.beforeEach(async ({ page }) => {
    errors = watchConsole(page);
    await seedStorage(page, {});
  });

  test.afterEach(() => {
    expect(errors(), 'no console errors').toEqual([]);
  });

  test('E2E-CONVPROMPT-01 / UI-CONVPROMPT-01 — authored prompt appears exactly once on the page, never in the panel, and bye adds no conversation-ended line', async ({
    page,
  }) => {
    await startNewGame(page);

    // Real authored route: `ai` is the alias of npc-the-ai in `room-arrival` and
    // `recycling bin` is a declared keyword of `topic-ai-recycling-bin`.
    await submit(page, 'ask ai about recycling bin');

    // Poll the player-visible page text: the single `topic-suggested`
    // transcript line is the only on-screen owner of the prompt.
    await expect
      .poll(async () => occurrences(await bodyText(page), PROMPT), {
        message: 'authored prompt appears exactly once on the page',
      })
      .toBe(1);
    expect(occurrences(await bodyText(page), YES_FORM)).toBe(1);
    expect(occurrences(await bodyText(page), NO_FORM)).toBe(1);

    // The inline panel carries only the conversation identity. Assert text and
    // visibility, not fake-DOM node shape.
    const panel = page.locator('.conversation-panel');
    await expect(panel).toBeVisible();
    await expect(panel).toContainText('Talking with Ai.');
    await expect(panel).not.toContainText(PROMPT);

    // The transcript keeps its log semantics and owns the complete prompt.
    const log = page.locator('.output-log');
    await expect(log).toHaveAttribute('role', 'log');
    await expect(log).toHaveAttribute('aria-live', 'polite');
    await expect(log.getByText(PROMPT).first()).toBeVisible();
    const beforeLines = await transcript(page);
    expect(beforeLines.some((line) => line.includes(PROMPT))).toBe(true);
    expect(beforeLines).toContain('> ask ai about recycling bin');

    // `bye` emits the single friendly acknowledgement; the internal
    // `conversation-ended` event remains transcript-suppressed.
    await submit(page, 'bye');
    await waitForLine(page, 'Goodbye.');
    expect(occurrences(await bodyText(page), 'Goodbye.')).toBe(1);
    const afterLines = await transcript(page);
    expect(afterLines.some((line) => line.includes('Goodbye.'))).toBe(true);
    expect(occurrences(await bodyText(page), 'conversation-ended')).toBe(0);
  });
});
