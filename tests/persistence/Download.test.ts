// Dated download filename contracts (S-PERSIST-10, S-GAP-02).
import { describe, expect, it } from 'vitest';
import {
  FIXED_ISO,
  FixedClock,
  MemoryStorage,
  loadGame,
  loadSaveManager,
  makeBundle,
  makeEnvelope,
  makeGameDependencies,
  makeRuntimeState,
  makeStateDto,
} from '../fixtures/persistence';

function downloadRecorder() {
  const calls: Array<{ readonly filename: string; readonly text: string }> = [];
  return {
    calls,
    downloadFile(filename: string, text: string): void {
      calls.push({ filename, text });
    },
  };
}

describe('dated save download', () => {
  it('S-PERSIST-10: download uses a dated filename so successive exports do not collide', async () => {
    const recorder = downloadRecorder();
    const storage = new MemoryStorage();
    const saveManager = await loadSaveManager({
      storage,
      clock: new FixedClock(),
      bundle: makeBundle(),
    });
    const initialState = makeRuntimeState(makeStateDto());
    const game = await loadGame(
      makeGameDependencies({
        storage,
        saveManager,
        initialState,
        downloadFile: recorder.downloadFile,
      }),
    );

    game.download();

    expect(recorder.calls).toHaveLength(1);
    expect(recorder.calls[0]?.filename).toMatch(
      /^compsciquest-save-.+\.json$/u,
    );
    expect(recorder.calls[0]?.filename).not.toContain(':');
    const expectedText = JSON.stringify(makeEnvelope(makeStateDto()));
    expect(recorder.calls[0]?.text).toBe(expectedText);
  });

  it('S-GAP-02: filename uses the full ISO timestamp with colons replaced by hyphens and savedAt stays unmodified', async () => {
    const recorder = downloadRecorder();
    const storage = new MemoryStorage();
    const saveManager = await loadSaveManager({
      storage,
      clock: new FixedClock(FIXED_ISO),
      bundle: makeBundle(),
    });
    const initialState = makeRuntimeState(makeStateDto());
    const game = await loadGame(
      makeGameDependencies({
        storage,
        saveManager,
        initialState,
        downloadFile: recorder.downloadFile,
      }),
    );

    game.download();

    expect(recorder.calls[0]?.filename).toBe(
      'compsciquest-save-2026-11-24T12-06-00-000Z.json',
    );
    const text = recorder.calls[0]?.text ?? '{}';
    const downloaded = JSON.parse(text) as { savedAt?: string };
    expect(downloaded.savedAt).toBe(FIXED_ISO);
  });
});
