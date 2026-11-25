import { afterEach, describe, expect, it } from 'vitest';
import { makeEnvelope } from '../fixtures/persistence';
import {
  allText,
  descendants,
  loadBootstrap,
  restoreDocument,
  runBootstrap,
  type Bootstrap,
  type BootstrapDependencies,
  type FakeElement,
} from '../fixtures/ui';
import { makeBootSetup } from '../fixtures/uiSetup';

afterEach(() => {
  restoreDocument();
});

async function boot(bootstrap: Bootstrap, dependencies: BootstrapDependencies) {
  return await runBootstrap(bootstrap, dependencies);
}

function press(input: FakeElement, key: string, value?: string): void {
  if (value !== undefined) {
    input.value = value;
  }
  input.dispatch('keydown', { key });
}

describe('window layout and terminal (application-and-ui.md §7.1, §7.2)', () => {
  it('UI-BOOT-11: the mounted window layout matches the documented chrome and keeps panels mounted', async () => {
    const setup = makeBootSetup({
      loadResult: { ok: true, dto: makeEnvelope() },
    });
    const bootstrap = await loadBootstrap();
    const result = await boot(bootstrap, setup.dependencies);

    const app = setup.page.querySelector('#app');
    expect(app).not.toBeNull();
    const windowElement = app!.querySelector('.window')!;
    expect(windowElement).not.toBeNull();
    expect(windowElement.querySelectorAll('.titlebar')).toHaveLength(1);
    expect(windowElement.querySelectorAll('.workspace')).toHaveLength(1);
    expect(windowElement.querySelectorAll('.title-overlay')).toHaveLength(1);

    const workspace = windowElement!.querySelector('.workspace');
    const main = workspace!.querySelector('main');
    const aside = workspace!.querySelector('aside');
    expect(main).not.toBeNull();
    expect(aside).not.toBeNull();
    expect(main?.children.length).toBeGreaterThanOrEqual(5);
    expect(aside?.children.length).toBeGreaterThanOrEqual(2);

    const mounted = [...(main?.children ?? []), ...(aside?.children ?? [])];
    setup.bus.publish([{ type: 'message', text: 'A turn happened.' }]);

    for (const panel of mounted) {
      expect(result.root.contains(panel)).toBe(true);
    }
  });

  it('UI-BOOT-12: terminal echoes before rendering and bounds history at fifty entries', async () => {
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
    for (let index = 1; index <= 51; index += 1) {
      press(input, 'Enter', `cmd-${index}`);
    }

    expect(setup.game.submits).toEqual(
      Array.from({ length: 51 }, (_unused, index) => `cmd-${index + 1}`),
    );
    expect(allText(result.root)).toContain('> cmd-1');
    expect(allText(result.root)).toContain('> cmd-51');

    for (let index = 0; index < 50; index += 1) {
      press(input, 'ArrowUp');
      expect(input.value).toBe(`cmd-${51 - index}`);
    }
    press(input, 'ArrowUp');
    expect(input.value).toBe('cmd-2');

    press(input, 'Enter', 'duplicate');
    press(input, 'Enter', 'duplicate');
    press(input, 'ArrowUp');
    expect(input.value).toBe('duplicate');
    press(input, 'ArrowUp');
    expect(input.value).toBe('duplicate');
  });

  it('UI-BOOT-13: markup-like event text is written as text, never as HTML', async () => {
    const markup = '<img src=x onerror="boom()">Danger</img>';
    const setup = makeBootSetup();
    const bootstrap = await loadBootstrap();
    const result = await boot(bootstrap, setup.dependencies);

    setup.bus.publish([{ type: 'message', text: markup }]);

    expect(allText(result.root)).toContain(markup);
    expect(
      descendants(result.root).some((element) => element.tagName === 'IMG'),
    ).toBe(false);
    expect(
      descendants(result.root).some(
        (element) => element.innerHTMLWrites.length > 0,
      ),
    ).toBe(false);
  });
});
