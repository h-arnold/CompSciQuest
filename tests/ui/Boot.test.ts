import { afterEach, describe, expect, it } from 'vitest';
import {
  makeEnvelope,
  loadSaveManager,
  QUARANTINE_KEY,
  SAVE_KEY,
} from '../fixtures/persistence';
import {
  findButton,
  loadBootstrap,
  restoreDocument,
  runBootstrap,
  type Bootstrap,
  type BootstrapDependencies,
} from '../fixtures/ui';
import { makeBootSetup } from '../fixtures/uiSetup';
import { loadValidator, makeRoom, withRooms } from '../fixtures/content';
import type { ContentBundle } from '../../src/content/ContentBundle';

afterEach(() => {
  restoreDocument();
});

async function boot(bootstrap: Bootstrap, dependencies: BootstrapDependencies) {
  return await runBootstrap(bootstrap, dependencies);
}

describe('boot sequence (application-and-ui.md §2)', () => {
  it('UI-BOOT-01: a missing #app element throws a clear error', async () => {
    // The scaffold module runs a top-level DOM query on first import, so keep
    // #app present until the seam is loaded, then remove it for the boot call.
    const setup = makeBootSetup();
    const bootstrap = await loadBootstrap();
    setup.page.querySelector('#app')?.remove();

    await expect(boot(bootstrap, setup.dependencies)).rejects.toThrow(/#app/);
    expect(setup.page.body.children).toHaveLength(0);
  });

  it('UI-BOOT-02: boot exposes the injected clock, storage, save manager, bus and bundle', async () => {
    const setup = makeBootSetup();
    const bootstrap = await loadBootstrap();

    const result = await boot(bootstrap, setup.dependencies);

    expect(result.clock).toBe(setup.dependencies.clock);
    expect(result.storage).toBe(setup.dependencies.storage);
    expect(result.saveManager).toBe(setup.dependencies.saveManager);
    expect(result.bus).toBe(setup.dependencies.bus);
    expect(result.bundle).toBe(setup.dependencies.bundle);
  });

  it('UI-BOOT-03: a bundle that fails validation stops boot with a readable error', async () => {
    const problems = ['duplicate room id: room-stub-start'];
    let validateCalls = 0;
    const setup = makeBootSetup({
      validate: () => {
        validateCalls += 1;
        return problems;
      },
    });
    const bootstrap = await loadBootstrap();

    await expect(boot(bootstrap, setup.dependencies)).rejects.toThrow(
      'duplicate room id: room-stub-start',
    );
    expect(validateCalls).toBe(1);
    expect(setup.page.body.querySelector('.window')).toBeNull();
  });

  it('UI-BOOT-04: a corrupt live save is quarantined and boot continues without a usable save', async () => {
    const setup = makeBootSetup({ storageEntries: { [SAVE_KEY]: 'not json' } });
    const realSaveManager = await loadSaveManager({
      storage: setup.storage,
      clock: setup.dependencies.clock,
      bundle: setup.bundle,
    });
    const bootstrap = await loadBootstrap();

    const result = await boot(bootstrap, {
      ...setup.dependencies,
      saveManager: realSaveManager,
    });

    const quarantineText = setup.storage.read(QUARANTINE_KEY);
    expect(quarantineText).not.toBeNull();
    const quarantined = JSON.parse(quarantineText ?? '{}') as {
      readonly raw: string;
      readonly reason: string;
      readonly quarantinedAt: string;
    };
    expect(quarantined.raw).toBe('not json');
    expect(quarantined.reason).toBe('invalid-json');
    expect(quarantined.quarantinedAt).toBe(setup.dependencies.clock.now());
    expect(setup.storage.read(SAVE_KEY)).toBe('not json');
    expect(findButton(result.root, 'Continue').disabled).toBe(true);
  });

  it('UI-BOOT-06: Continue is enabled only when load returned ok', async () => {
    const bootstrap = await loadBootstrap();

    const invalid = makeBootSetup({
      loadResult: { ok: false, reason: 'wrong-version' },
    });
    const invalidResult = await boot(bootstrap, invalid.dependencies);
    expect(findButton(invalidResult.root, 'Continue').disabled).toBe(true);
    expect(findButton(invalidResult.root, 'New Game').disabled).toBe(false);
    restoreDocument();

    const valid = makeBootSetup({
      loadResult: { ok: true, dto: makeEnvelope() },
    });
    const validResult = await boot(bootstrap, valid.dependencies);
    expect(findButton(validResult.root, 'Continue').disabled).toBe(false);
    expect(findButton(validResult.root, 'New Game').disabled).toBe(false);
  });

  it('UI-BOOT-07: Continue and New Game dispatch through the Game facade', async () => {
    const dto = makeEnvelope();
    const setup = makeBootSetup({ loadResult: { ok: true, dto } });
    const bootstrap = await loadBootstrap();
    const result = await boot(bootstrap, setup.dependencies);

    findButton(result.root, 'Continue').click();
    expect(setup.game.continueCalls).toEqual([dto]);
    expect(setup.game.newGameCalls).toHaveLength(0);

    findButton(result.root, 'New Game').click();
    expect(setup.game.newGameCalls).toHaveLength(1);
  });

  it('UI-BOOT-08: the first batch is published before the overlay is removed', async () => {
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

    await boot(bootstrap, setup.dependencies);
    findButton(setup.page.body, 'New Game').click();

    expect(setup.bus.records).toHaveLength(1);
    expect(setup.bus.records[0]?.events).toEqual([
      { type: 'message', text: 'A deterministic starting room description.' },
    ]);
    expect(setup.bus.records[0]?.overlayPresentAtPublish).toBe(true);
    expect(setup.page.body.querySelector('.title-overlay')).toBeNull();
  });

  it('UI-BOOT-09: restart from an ended state uses the restart meta action', async () => {
    const setup = makeBootSetup({
      loadResult: { ok: true, dto: makeEnvelope() },
      viewData: {
        status: 'won',
        position: {
          worldId: 'world-stub',
          areaId: 'area-stub',
          roomId: 'room-stub-start',
        },
        turn: 9,
        lives: 3,
        score: 7,
        areas: [],
        hints: [],
      },
    });
    const bootstrap = await loadBootstrap();
    const result = await boot(bootstrap, setup.dependencies);

    findButton(result.root, 'Restart').click();

    expect(setup.game.restartCalls).toHaveLength(1);
    expect(setup.game.newGameCalls).toHaveLength(0);
  });

  it('C-CONTENT-14: boot fails fast on a structurally invalid bundle', async () => {
    const validate = await loadValidator();
    const setup = makeBootSetup();
    const invalidBundle: ContentBundle = withRooms(setup.bundle, [
      makeRoom(),
      makeRoom(),
    ]);
    const problems = validate(invalidBundle);
    expect(problems.length).toBeGreaterThan(0);
    const bootstrap = await loadBootstrap();

    await expect(
      boot(bootstrap, {
        ...setup.dependencies,
        bundle: invalidBundle,
        validate: (bundle: ContentBundle) => validate(bundle),
      }),
    ).rejects.toThrow(problems[0] ?? 'duplicate');
    expect(setup.page.body.querySelector('.window')).toBeNull();
  });

  it('UI-PARITY-01: boot reuses the same validateContent seam as Vitest', async () => {
    const validate = await loadValidator();
    const calls: Array<readonly unknown[]> = [];
    const tracking = (...bootArguments: readonly unknown[]) => {
      calls.push(bootArguments);
      return validate(bootArguments[0] as ContentBundle);
    };
    const setup = makeBootSetup({ validate: tracking });
    const bootstrap = await loadBootstrap();

    const result = await boot(bootstrap, setup.dependencies);

    expect(calls).toHaveLength(1);
    expect(calls[0]).toHaveLength(1);
    expect(calls[0]?.[0]).toBe(setup.bundle);
    expect(result.game).toBe(setup.game);
  });
});
