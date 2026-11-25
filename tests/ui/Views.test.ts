import { afterEach, describe, expect, it } from 'vitest';
import { makeEnvelope } from '../fixtures/persistence';
import {
  allText,
  loadBootstrap,
  restoreDocument,
  runBootstrap,
  type Bootstrap,
  type BootstrapDependencies,
  type FakeElement,
} from '../fixtures/ui';
import { makeBootSetup, type BootSetup } from '../fixtures/uiSetup';
import { makeViewData } from '../fixtures/ui';
import type { GameViewData } from '../../src/application/GameViewData';

afterEach(() => {
  restoreDocument();
});

async function boot(bootstrap: Bootstrap, dependencies: BootstrapDependencies) {
  return await runBootstrap(bootstrap, dependencies);
}

async function bootWithValidSave(
  overrides: Parameters<typeof makeBootSetup>[0] = {},
): Promise<{
  readonly setup: BootSetup;
  readonly result: Awaited<ReturnType<typeof boot>>;
}> {
  const setup = makeBootSetup({
    ...overrides,
    loadResult: { ok: true, dto: makeEnvelope() },
  });
  const bootstrap = await loadBootstrap();
  const result = await boot(bootstrap, setup.dependencies);
  return { setup, result };
}

function press(input: FakeElement, key: string, value: string): void {
  input.value = value;
  input.dispatch('keydown', { key });
}

describe('views and view data (application-and-ui.md §7.1, §7.2)', () => {
  it('UI-BOOT-05: GameWindow mounts all eight views and subscribes them to the event bus', async () => {
    const { setup, result } = await bootWithValidSave();

    const app = setup.page.querySelector('#app');
    expect(app!.querySelector('.window')).not.toBeNull();
    expect(app!.querySelector('.title-overlay')).not.toBeNull();
    const workspace = app!.querySelector('.workspace');
    expect(
      workspace!.querySelector('main')?.children.length,
    ).toBeGreaterThanOrEqual(5);
    expect(
      workspace!.querySelector('aside')?.children.length,
    ).toBeGreaterThanOrEqual(2);
    expect(setup.game.viewDataCalls.length).toBeGreaterThan(0);

    setup.bus.publish([
      { type: 'message', text: 'a subscribed transcript line' },
    ]);
    expect(allText(result.root)).toContain('a subscribed transcript line');
  });

  it('UI-BOOT-14: ScorePanel reads view data and computes no scores of its own', async () => {
    const viewData = makeViewData({
      score: 999,
      areas: [
        {
          worldId: 'world-stub',
          areaId: 'area-stub',
          worldName: 'Stub World',
          areaName: 'Stub Area',
          earnedScore: 7,
          maxScore: 10,
          visitedRoomCount: 1,
          roomCount: 2,
          topics: [
            {
              id: 'topic-1',
              title: 'Stub Topic',
              specReference: 'stub section',
              status: 'covered',
              complete: false,
            },
          ],
        },
      ],
    });
    const { setup, result } = await bootWithValidSave({ viewData });

    const aside = result.root.querySelector('aside');
    const panelText = aside?.textContent ?? '';
    expect(panelText).toContain('999');
    expect(panelText).toContain('7');
    expect(panelText).toContain('10');
    expect(panelText).toContain('Stub Topic');
    expect(panelText).not.toContain('NaN');
    expect(setup.game.viewDataCalls.length).toBeGreaterThan(0);
  });

  it('UI-BOOT-17: an empty area list renders a zero score without error', async () => {
    const viewData: GameViewData = makeViewData({ areas: [], score: 0 });
    const { result } = await bootWithValidSave({ viewData });

    const aside = result.root.querySelector('aside');
    const panelText = aside?.textContent ?? '';
    expect(panelText).toContain('0');
    expect(panelText).not.toContain('NaN');
    expect(panelText).not.toContain('undefined');
  });

  it('UI-GAP-01: an empty inventory renders the exact documented line', async () => {
    const line = 'You are carrying nothing.';
    const { setup, result } = await bootWithValidSave({
      submitResult: [{ type: 'message', text: line }],
    });

    const input = result.root.querySelector('input');
    expect(input).not.toBeNull();
    if (!input) {
      return;
    }
    press(input, 'Enter', 'inventory');

    expect(setup.game.submits).toEqual(['inventory']);
    expect(allText(result.root)).toContain(line);
  });
});
