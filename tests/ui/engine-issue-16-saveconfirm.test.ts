// ENG16-SAVECONFIRM-01 — Save/Download confirmation routing. The façade's
// existing confirmation lines are emitted by Game.performMeta (Game.ts §4.1);
// this slice proves the sidebar buttons and typed aliases reach that path.
import { afterEach, describe, expect, it } from 'vitest';
import { makeEnvelope } from '../fixtures/persistence';
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

const SAVE_CONFIRMATION = 'Game saved.';
const DOWNLOAD_CONFIRMATION = 'Save downloaded.';

afterEach(() => {
  restoreDocument();
});

async function bootGame(
  bootstrap: Bootstrap,
  dependencies: BootstrapDependencies,
) {
  return await runBootstrap(bootstrap, dependencies);
}

// Mirrors production: Game.submit publishes its batch on the injected bus and
// GameWindow renders it. The fake is opted into that path so a second render
// of the same batch would be visible as a duplicate line.
async function bootWithConfirmation(text: string) {
  const setup = makeBootSetup({
    loadResult: { ok: true, dto: makeEnvelope() },
    submitResult: [{ type: 'message', text }],
    publishOnSubmit: true,
  });
  const bootstrap = await loadBootstrap();
  const result = await bootGame(bootstrap, setup.dependencies);
  return { setup, result };
}

function logLines(root: FakeElement): readonly string[] {
  const output = root.querySelector('.output-log');
  expect(
    output,
    'the transcript must be mounted (application-and-ui.md §7.1)',
  ).not.toBeNull();
  return (output?.children ?? []).map((child) => child.textContent);
}

function countLine(lines: readonly string[], expected: string): number {
  return lines.filter((line) => line === expected).length;
}

function countOccurrences(text: string, needle: string): number {
  return text.split(needle).length - 1;
}

function statusText(root: FakeElement): string {
  return root.querySelector('.save-status')?.textContent ?? '';
}

function pressEnter(input: FakeElement, value: string): void {
  input.value = value;
  input.dispatch('keydown', { key: 'Enter' });
}

describe('ENG16-SAVECONFIRM-01 — Save and Download confirmation (ENGINE_ISSUES.md issue 16; application-and-ui.md §4.1)', () => {
  it("ENG16-SAVECONFIRM-01: sidebar Save routes through Game.submit('save'), not Game.save()", async () => {
    const { setup, result } = await bootWithConfirmation(SAVE_CONFIRMATION);

    findButton(result.root, 'Save').click();
    await flush();

    expect(setup.game.submits).toEqual(['save']);
    expect(setup.game.saveCalls).toHaveLength(0);
  });

  it("ENG16-SAVECONFIRM-01: sidebar Download routes through Game.submit('download'), not Game.download()", async () => {
    const { setup, result } = await bootWithConfirmation(DOWNLOAD_CONFIRMATION);

    findButton(result.root, 'Download').click();
    await flush();

    expect(setup.game.submits).toEqual(['download']);
    expect(setup.game.downloadCalls).toHaveLength(0);
  });

  it('ENG16-SAVECONFIRM-01: Save appends the facade confirmation once, with no new copy and no status change', async () => {
    const { setup, result } = await bootWithConfirmation(SAVE_CONFIRMATION);
    const statusBefore = statusText(result.root);
    const before = logLines(result.root);

    findButton(result.root, 'Save').click();
    await flush();

    const after = logLines(result.root);
    expect(countLine(after, SAVE_CONFIRMATION)).toBe(1);
    // Exactly one new transcript line: the façade's own line, nothing invented.
    expect(after.slice(before.length)).toEqual([SAVE_CONFIRMATION]);
    expect(countOccurrences(allText(result.root), SAVE_CONFIRMATION)).toBe(1);
    expect(statusText(result.root)).toBe(statusBefore);
    expect(setup.game.saveCalls).toHaveLength(0);
  });

  it('ENG16-SAVECONFIRM-01: Download appends the facade confirmation once, with no new copy and no status change', async () => {
    const { setup, result } = await bootWithConfirmation(DOWNLOAD_CONFIRMATION);
    const statusBefore = statusText(result.root);
    const before = logLines(result.root);

    findButton(result.root, 'Download').click();
    await flush();

    const after = logLines(result.root);
    expect(countLine(after, DOWNLOAD_CONFIRMATION)).toBe(1);
    expect(after.slice(before.length)).toEqual([DOWNLOAD_CONFIRMATION]);
    expect(countOccurrences(allText(result.root), DOWNLOAD_CONFIRMATION)).toBe(
      1,
    );
    expect(statusText(result.root)).toBe(statusBefore);
    expect(setup.game.downloadCalls).toHaveLength(0);
  });

  it("ENG16-SAVECONFIRM-01: typed save is the same submit('save') path and confirmation as the button", async () => {
    const { setup, result } = await bootWithConfirmation(SAVE_CONFIRMATION);
    const input = result.root.querySelector('input')!;
    const before = logLines(result.root);

    pressEnter(input, 'save');
    await flush();

    expect(setup.game.submits).toEqual(['save']);
    expect(setup.game.saveCalls).toHaveLength(0);
    expect(logLines(result.root)).toEqual([
      ...before,
      '> save',
      SAVE_CONFIRMATION,
    ]);
  });

  it("ENG16-SAVECONFIRM-01: typed download is the same submit('download') path and confirmation as the button", async () => {
    const { setup, result } = await bootWithConfirmation(DOWNLOAD_CONFIRMATION);
    const input = result.root.querySelector('input')!;
    const before = logLines(result.root);

    pressEnter(input, 'download');
    await flush();

    expect(setup.game.submits).toEqual(['download']);
    expect(setup.game.downloadCalls).toHaveLength(0);
    expect(logLines(result.root)).toEqual([
      ...before,
      '> download',
      DOWNLOAD_CONFIRMATION,
    ]);
  });
});
