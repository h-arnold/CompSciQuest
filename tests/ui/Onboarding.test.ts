// Red contract for engine issue 1 / Batch E1 onboarding. The title overlay is
// UI chrome and the copy slots hold engine placeholders only; final wording
// comes from the content session (ENGINE_ISSUES.md, Batch E1 decisions).
// Canonical layout: application-and-ui.md §2 and §7.1.
import { afterEach, describe, expect, it } from 'vitest';
import { DEFAULT_TITLE_COPY, TitleScreen } from '../../src/ui/TitleScreen';
import { makeEnvelope } from '../fixtures/persistence';
import {
  findButton,
  findByClass,
  findFirstByClass,
  installFakeDocument,
  loadBootstrap,
  restoreDocument,
  runBootstrap,
  type Bootstrap,
  type BootstrapDependencies,
  type FakeElement,
} from '../fixtures/ui';
import { makeBootSetup } from '../fixtures/uiSetup';

afterEach(restoreDocument);

// PLAYTEST-assistance-ward.md finding 10: the scaffolding lines are replaced
// by code-owned orientation copy. The wording is fixed by the W7 fix brief.
const OBJECTIVE_PLACEHOLDER =
  'The register marks your attention not satisfied. Pass the Assistance Ward orientation and the mark can be cleared.';
const CONTROLS_PLACEHOLDER =
  'Use plain commands: look, examine, take and a direction such as east. Ask someone about what you can see, or type help for the full list.';
const OLD_OBJECTIVE = 'Objective copy to follow.';
const OLD_CONTROLS = 'Controls copy to follow.';
const HELP_PROMPT = /type\s+help/i;

async function boot(bootstrap: Bootstrap, dependencies: BootstrapDependencies) {
  return await runBootstrap(bootstrap, dependencies);
}

function transcriptLines(log: FakeElement): readonly string[] {
  return log.children.map((child) => child.textContent);
}

describe('onboarding copy slots and first log batch (ENGINE_ISSUES.md Batch E1)', () => {
  it('W7F-11: DEFAULT_TITLE_COPY holds the approved objective and controls wording', () => {
    expect(DEFAULT_TITLE_COPY.objective).toBe(OBJECTIVE_PLACEHOLDER);
    expect(DEFAULT_TITLE_COPY.controls).toBe(CONTROLS_PLACEHOLDER);
    for (const placeholder of [OLD_OBJECTIVE, OLD_CONTROLS]) {
      expect(OBJECTIVE_PLACEHOLDER).not.toContain(placeholder);
      expect(CONTROLS_PLACEHOLDER).not.toContain(placeholder);
    }
  });

  it('ENG1-ONBOARD-01: title overlay renders objective, controls and a type help prompt with unchanged chrome', () => {
    const page = installFakeDocument();
    let continueClicks = 0;
    let newGameClicks = 0;
    const screen = new TitleScreen(
      false,
      () => {
        continueClicks += 1;
      },
      () => {
        newGameClicks += 1;
      },
    );
    page.body.append(screen.element as unknown as FakeElement);
    const overlay = findFirstByClass(page.body, 'title-overlay');

    expect(findByClass(overlay, 'title-objective')).toHaveLength(1);
    expect(findFirstByClass(overlay, 'title-objective').textContent).toBe(
      OBJECTIVE_PLACEHOLDER,
    );
    expect(findByClass(overlay, 'title-controls')).toHaveLength(1);
    expect(findFirstByClass(overlay, 'title-controls').textContent).toBe(
      CONTROLS_PLACEHOLDER,
    );
    expect(findByClass(overlay, 'title-help-prompt')).toHaveLength(1);
    expect(findFirstByClass(overlay, 'title-help-prompt').textContent).toMatch(
      HELP_PROMPT,
    );

    const heading = overlay.querySelector('h1');
    expect(heading).not.toBeNull();
    expect(heading?.textContent).toBe('CompSciQuest');
    expect(findButton(overlay, 'Continue').disabled).toBe(true);
    expect(findButton(overlay, 'New Game').disabled).toBe(false);
    findButton(overlay, 'New Game').click();
    expect(newGameClicks).toBe(1);
    expect(continueClicks).toBe(0);

    const enabled = new TitleScreen(
      true,
      () => {
        continueClicks += 1;
      },
      () => {
        newGameClicks += 1;
      },
    );
    const enabledElement = enabled.element as unknown as FakeElement;
    expect(findButton(enabledElement, 'Continue').disabled).toBe(false);
    findButton(enabledElement, 'Continue').click();
    expect(continueClicks).toBe(1);
    expect(newGameClicks).toBe(1);
  });

  it('ENG1-ONBOARD-01: copy slots accept supplied copy rather than hardcoded text', () => {
    const page = installFakeDocument();
    let continueClicks = 0;
    let newGameClicks = 0;
    const supplied = { objective: 'OBJ-SLOT', controls: 'CTRL-SLOT' };
    const screen = Reflect.construct(TitleScreen, [
      true,
      () => {
        continueClicks += 1;
      },
      () => {
        newGameClicks += 1;
      },
      supplied,
    ]) as TitleScreen;
    page.body.append(screen.element as unknown as FakeElement);
    const overlay = findFirstByClass(page.body, 'title-overlay');

    expect(findFirstByClass(overlay, 'title-objective').textContent).toBe(
      supplied.objective,
    );
    expect(findFirstByClass(overlay, 'title-controls').textContent).toBe(
      supplied.controls,
    );
    expect(findButton(overlay, 'Continue').disabled).toBe(false);
    findButton(overlay, 'Continue').click();
    expect(continueClicks).toBe(1);
    expect(newGameClicks).toBe(0);
  });

  it('ENG1-ONBOARD-01: New Game boot seeds objective and controls as the first log lines before the overlay is removed', async () => {
    const setup = makeBootSetup({
      onNewGame: () => {
        setup.bus.publish([
          {
            type: 'message',
            text: 'A deterministic starting room description.',
          },
        ]);
      },
    });
    const bootstrap = await loadBootstrap();
    const result = await boot(bootstrap, setup.dependencies);

    const overlayBefore = result.root.querySelector('.title-overlay');
    expect(overlayBefore).not.toBeNull();
    const log = findFirstByClass(result.root, 'output-log');
    expect(transcriptLines(log)).toEqual([
      OBJECTIVE_PLACEHOLDER,
      CONTROLS_PLACEHOLDER,
    ]);

    findButton(result.root, 'New Game').click();

    expect(setup.bus.records).toHaveLength(1);
    expect(setup.bus.records[0]?.overlayPresentAtPublish).toBe(true);
    expect(result.root.querySelector('.title-overlay')).toBeNull();
    expect(transcriptLines(log)).toEqual([
      OBJECTIVE_PLACEHOLDER,
      CONTROLS_PLACEHOLDER,
      'A deterministic starting room description.',
    ]);
  });

  it('ENG1-ONBOARD-01: Continue with a valid save keeps objective and controls first in the transcript', async () => {
    const dto = makeEnvelope();
    const setup = makeBootSetup({ loadResult: { ok: true, dto } });
    const bootstrap = await loadBootstrap();
    const result = await boot(bootstrap, setup.dependencies);

    const log = findFirstByClass(result.root, 'output-log');
    expect(transcriptLines(log)).toEqual([
      OBJECTIVE_PLACEHOLDER,
      CONTROLS_PLACEHOLDER,
    ]);

    findButton(result.root, 'Continue').click();
    expect(setup.game.continueCalls).toEqual([dto]);

    setup.bus.publish([
      { type: 'message', text: 'Restored room description.' },
    ]);

    expect(setup.bus.records).toHaveLength(1);
    expect(setup.bus.records[0]?.overlayPresentAtPublish).toBe(true);
    expect(result.root.querySelector('.title-overlay')).toBeNull();
    expect(transcriptLines(log)).toEqual([
      OBJECTIVE_PLACEHOLDER,
      CONTROLS_PLACEHOLDER,
      'Restored room description.',
    ]);
  });
});
