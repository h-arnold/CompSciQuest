import { afterEach, describe, expect, it } from 'vitest';
import {
  loadSaveManager,
  makeEnvelope,
  QUARANTINE_KEY,
  SAVE_KEY,
} from '../fixtures/persistence';
import {
  allText,
  descendants,
  findButton,
  flush,
  loadBootstrap,
  restoreDocument,
  runBootstrap,
  type Bootstrap,
  type BootstrapDependencies,
  type FakeElement,
} from '../fixtures/ui';
import { makeBootSetup } from '../fixtures/uiSetup';
import type { QuarantineDto } from '../../src/application/QuarantineDto';
import type { LoadFailureReason } from '../../src/application/SaveDto';

afterEach(() => {
  restoreDocument();
});

async function boot(bootstrap: Bootstrap, dependencies: BootstrapDependencies) {
  return await runBootstrap(bootstrap, dependencies);
}

function statusText(root: FakeElement): string {
  return root.querySelector('.titlebar')?.textContent ?? '';
}

describe('SaveControls and the import facade (application-and-ui.md §4.1, §7.1)', () => {
  it('UI-BOOT-15: the five meta actions have buttons in order, with no quarantine button', async () => {
    const setup = makeBootSetup({
      loadResult: { ok: true, dto: makeEnvelope() },
    });
    const bootstrap = await loadBootstrap();
    const result = await boot(bootstrap, setup.dependencies);

    const expected = ['Save', 'Load', 'Download', 'Import', 'Restart'];
    const labels = descendants(result.root)
      .filter(
        (element) =>
          element.tagName === 'BUTTON' &&
          element.parentNode?.className === 'save-controls',
      )
      .map((button) => button.textContent.trim());
    expect(labels).toEqual(expected);
    expect(labels).toHaveLength(expected.length);
    expect(labels).not.toContain('Download quarantined save');
  });

  it('S-PERSIST-22: boot quarantine keeps the stored raw text as a recovery path with no download action', async () => {
    const raw = 'not-json';
    const setup = makeBootSetup({
      storageEntries: { [SAVE_KEY]: raw },
    });
    const saveManager = await loadSaveManager({
      storage: setup.storage,
      clock: setup.dependencies.clock,
      bundle: setup.bundle,
    });
    const bootstrap = await loadBootstrap();
    const result = await boot(bootstrap, {
      ...setup.dependencies,
      saveManager,
    });

    const quarantined = setup.storage.read(QUARANTINE_KEY) ?? '';
    expect(quarantined).not.toBe('');
    const record = JSON.parse(quarantined) as Partial<QuarantineDto>;
    expect(record.raw).toBe(raw);
    expect(record.reason).toBe('invalid-json');
    expect(setup.downloads).toEqual([]);
    expect(setup.storage.read(QUARANTINE_KEY)).toBe(quarantined);
    expect(
      descendants(result.root)
        .filter(
          (element) =>
            element.tagName === 'BUTTON' &&
            element.parentNode?.className === 'save-controls',
        )
        .map((button) => button.textContent.trim()),
    ).not.toContain('Download quarantined save');
  });

  it('S-PERSIST-26: every LoadFailureReason maps to a distinct friendly message', async () => {
    const reasons: readonly LoadFailureReason[] = [
      'invalid-json',
      'wrong-version',
      'newer-version',
      'invalid-shape',
      'invalid-content',
    ];
    const messages: string[] = [];

    for (const reason of reasons) {
      restoreDocument();
      const setup = makeBootSetup({
        validateResult: { ok: false, reason },
        importText: '{}',
        storageEntries: { [SAVE_KEY]: 'live-save-text' },
      });
      const bootstrap = await loadBootstrap();
      const result = await boot(bootstrap, setup.dependencies);
      const before = setup.storage.snapshot();

      findButton(result.root, 'Import').click();
      await flush();

      const message = statusText(result.root).trim();
      expect(message.length).toBeGreaterThan(0);
      expect(message).not.toBe(reason);
      messages.push(message);
      expect(setup.storage.snapshot()).toEqual(before);
    }

    expect(new Set(messages).size).toBe(reasons.length);
  });

  it('UI-GAP-02: a post-boot invalid save reuses the friendly message without overwriting storage', async () => {
    const setup = makeBootSetup({
      loadResult: { ok: true, dto: makeEnvelope() },
      validateResult: { ok: false, reason: 'invalid-content' },
      importText: '{}',
      storageEntries: { [SAVE_KEY]: 'live-save-text' },
    });
    const bootstrap = await loadBootstrap();
    const result = await boot(bootstrap, setup.dependencies);
    const before = setup.storage.snapshot();

    findButton(result.root, 'Import').click();
    await flush();
    const importMessage = statusText(result.root).trim();
    expect(importMessage.length).toBeGreaterThan(0);

    setup.saveManager.loadResult = { ok: false, reason: 'invalid-content' };
    findButton(result.root, 'Continue').click();
    await flush();

    expect(statusText(result.root).trim()).toBe(importMessage);
    expect(setup.storage.snapshot()).toEqual(before);
  });

  it('UI-IMPORT-FACADE: typed import calls the injected file reader instead of consuming pasted JSON', async () => {
    const setup = makeBootSetup({
      loadResult: { ok: true, dto: makeEnvelope() },
    });
    const bootstrap = await loadBootstrap();
    const result = await boot(bootstrap, setup.dependencies);

    const input = result.root.querySelector('input');
    expect(input).not.toBeNull();
    if (!input) {
      return;
    }
    input.value = 'import';
    input.dispatch('keydown', { key: 'Enter' });
    await flush();

    expect(setup.openFileCalls).toHaveLength(1);
    expect(setup.game.submits).not.toContain('import');
    expect(allText(result.root)).not.toContain('pasted JSON');
  });
});
