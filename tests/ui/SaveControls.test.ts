import { afterEach, describe, expect, it } from 'vitest';
import {
  makeEnvelope,
  QUARANTINE_KEY,
  SAVE_KEY,
} from '../fixtures/persistence';
import {
  allText,
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
  it('UI-BOOT-15: every meta action and the quarantine download have a button', async () => {
    const setup = makeBootSetup({
      loadResult: { ok: true, dto: makeEnvelope() },
    });
    const bootstrap = await loadBootstrap();
    const result = await boot(bootstrap, setup.dependencies);

    const labels = [
      'Save',
      'Load',
      'Download',
      'Import',
      'Restart',
      'Download quarantined save',
    ];
    const found = labels.map((label) => findButton(result.root, label));
    expect(new Set(found).size).toBe(labels.length);
  });

  it('S-PERSIST-22: Download quarantined save exposes the stored raw text', async () => {
    const raw = '{"version":1,"savedAt":"2026-11-24T12:06:00.000Z","state":{}}';
    const quarantined = JSON.stringify({
      quarantinedAt: '2026-11-24T12:06:00.000Z',
      reason: 'invalid-json',
      raw,
    });
    const setup = makeBootSetup({
      storageEntries: { [QUARANTINE_KEY]: quarantined },
    });
    const bootstrap = await loadBootstrap();
    const result = await boot(bootstrap, setup.dependencies);

    findButton(result.root, 'Download quarantined save').click();
    await flush();

    expect(setup.downloads).toHaveLength(1);
    expect(setup.downloads[0]?.text).toBe(raw);
    expect(setup.storage.read(QUARANTINE_KEY)).toBe(quarantined);
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
