// ENG31-REMOVEQUARANTINE-01 — remove the quarantined-save download button and
// its action only. The boot-time quarantine stays as a recovery path.
// Contract: ENGINE_ISSUES.md lines 14-17, 55, 89; application-and-ui.md §7.1/§7.2;
// storage-schema.md §9/§12. No new feedback copy is introduced.
import { afterEach, describe, expect, it } from 'vitest';
import { SaveControls, type SaveActions } from '../../src/ui/SaveControls';
import type { QuarantineDto } from '../../src/application/QuarantineDto';
import {
  FIXED_ISO,
  loadSaveManager,
  QUARANTINE_KEY,
  SAVE_KEY,
} from '../fixtures/persistence';
import {
  allText,
  descendants,
  findButton,
  findFirstByClass,
  flush,
  loadBootstrap,
  restoreDocument,
  runBootstrap,
  type Bootstrap,
  type FakeElement,
} from '../fixtures/ui';
import { makeBootSetup, type BootSetup } from '../fixtures/uiSetup';

const FIVE_BUTTONS = ['Save', 'Load', 'Download', 'Import', 'Restart'];
const REMOVED_LABEL = 'Download quarantined save';

afterEach(() => {
  restoreDocument();
});

function buttonLabels(root: FakeElement): readonly string[] {
  return descendants(root)
    .filter(
      (element) =>
        element.tagName === 'BUTTON' &&
        element.parentNode?.className === 'save-controls',
    )
    .map((element) => element.textContent.trim());
}

async function bootWithRealSaveManager(options: {
  readonly storageEntries: Readonly<Record<string, string>>;
}): Promise<{ setup: BootSetup; root: FakeElement }> {
  const setup = makeBootSetup({ storageEntries: options.storageEntries });
  const saveManager = await loadSaveManager({
    storage: setup.storage,
    clock: setup.dependencies.clock,
    bundle: setup.bundle,
  });
  const bootstrap = await loadBootstrap();
  const result = await runBootstrap(bootstrap, {
    ...setup.dependencies,
    saveManager,
  });
  return { setup, root: result.root };
}

function doNothing(): void {
  // The structural probe only needs a callable surface.
}

describe('ENG31-REMOVEQUARANTINE-01 — five save controls only (ENGINE_ISSUES.md #31; application-and-ui.md §7.1)', () => {
  it('ENG31-REMOVEQUARANTINE-01: GameWindow.makeActions() renders exactly Save, Load, Download, Import, Restart', async () => {
    const setup = makeBootSetup();
    const bootstrap: Bootstrap = await loadBootstrap();
    const result = await runBootstrap(bootstrap, setup.dependencies);

    expect(buttonLabels(result.root)).toEqual(FIVE_BUTTONS);
    expect(buttonLabels(result.root)).toHaveLength(5);
    expect(buttonLabels(result.root)).not.toContain(REMOVED_LABEL);
  });

  it('ENG31-REMOVEQUARANTINE-01: SaveControls asks its action object for no quarantine action', () => {
    makeBootSetup();
    const accessed: string[] = [];
    // A Proxy observes the action surface without naming the removed symbol.
    const actions = new Proxy({} as SaveActions, {
      get(_target: SaveActions, property: string): () => void {
        accessed.push(property);
        return doNothing;
      },
    });
    const controls = new SaveControls(actions);

    for (const button of controls.element.querySelectorAll('button')) {
      button.click();
    }

    expect(controls.element.children).toHaveLength(FIVE_BUTTONS.length);
    expect(accessed).toEqual([
      'save',
      'load',
      'download',
      'openImport',
      'restart',
    ]);
  });

  it('ENG31-REMOVEQUARANTINE-01: a corrupt live save is still quarantined at boot and the recovery copy is never overwritten', async () => {
    const existing = JSON.stringify({
      quarantinedAt: FIXED_ISO,
      reason: 'invalid-json',
      raw: 'earlier-invalid-save',
    });
    const { setup, root } = await bootWithRealSaveManager({
      storageEntries: {
        [SAVE_KEY]: 'not-json',
        [QUARANTINE_KEY]: existing,
      },
    });

    expect(setup.storage.read(QUARANTINE_KEY)).toBe(existing);
    expect(
      setup.storage.writes.filter((write) => write.key === QUARANTINE_KEY),
    ).toHaveLength(0);
    expect(setup.storage.removals).toEqual([]);
    expect(setup.downloads).toEqual([]);
    expect(buttonLabels(root)).toEqual(FIVE_BUTTONS);
  });

  it('ENG31-REMOVEQUARANTINE-01: boot quarantine keeps quarantinedAt, reason and exact raw text with no download action', async () => {
    const raw = 'not-json';
    const { setup, root } = await bootWithRealSaveManager({
      storageEntries: { [SAVE_KEY]: raw },
    });

    const quarantined = setup.storage.read(QUARANTINE_KEY) ?? '';
    expect(quarantined).not.toBe('');
    const record = JSON.parse(quarantined) as Partial<QuarantineDto>;
    expect(record.quarantinedAt).toBe(FIXED_ISO);
    expect(record.reason).toBe('invalid-json');
    expect(record.raw).toBe(raw);
    expect(setup.storage.read(QUARANTINE_KEY)).toBe(quarantined);
    expect(
      setup.storage.writes.filter((write) => write.key === QUARANTINE_KEY),
    ).toHaveLength(1);
    expect(setup.storage.removals).toEqual([]);
    expect(setup.downloads).toEqual([]);
    expect(buttonLabels(root)).not.toContain(REMOVED_LABEL);
  });

  it('ENG31-REMOVEQUARANTINE-01: ordinary Download still uses the facade path and logs Save downloaded. once', async () => {
    const setup = makeBootSetup({
      submitResult: [{ type: 'message', text: 'Save downloaded.' }],
      publishOnSubmit: true,
    });
    const bootstrap = await loadBootstrap();
    const result = await runBootstrap(bootstrap, setup.dependencies);

    const statusBefore =
      result.root.querySelector('.save-status')?.textContent ?? '';
    findButton(result.root, 'Download').click();
    await flush();

    expect(setup.game.submits).toEqual(['download']);
    expect(setup.game.downloadCalls).toHaveLength(0);
    const lines = findFirstByClass(result.root, 'output-log').children.map(
      (child) => child.textContent,
    );
    expect(lines?.filter((line) => line === 'Save downloaded.')).toEqual([
      'Save downloaded.',
    ]);
    expect(allText(result.root).split('Save downloaded.')).toHaveLength(2);
    expect(result.root.querySelector('.save-status')?.textContent ?? '').toBe(
      statusBefore,
    );
    expect(buttonLabels(result.root)).not.toContain(REMOVED_LABEL);
  });
});
