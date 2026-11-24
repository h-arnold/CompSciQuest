// Restore-time derivation contracts (S-PERSIST-11, S-PERSIST-12).
import { describe, expect, it } from 'vitest';
import {
  FixedClock,
  MemoryStorage,
  RecordingBus,
  loadGame,
  loadSaveManager,
  makeBundle,
  makeEnvelope,
  makeGameDependencies,
  makeStateDto,
  makeTopic,
} from '../fixtures/persistence';

function dependencies(bundle = makeBundle()) {
  return {
    storage: new MemoryStorage(),
    clock: new FixedClock(),
    bundle,
  };
}

describe('restore-time derivation', () => {
  it('S-PERSIST-11: maxScore is refreshed from SpecTopicCatalogue.getByAreaId, saved value is only a fallback', async () => {
    const changedContent = makeBundle({
      topics: [makeTopic({ maxScore: 25 })],
    });
    const manager = await loadSaveManager(dependencies(changedContent));

    const restored = manager.restore(
      makeEnvelope(makeStateDto()), // saved maxScore is 10
    );

    expect(restored.progress[0]?.maxScore).toBe(25);
  });

  it('S-PERSIST-12: won and lost statuses round-trip without emitting game-won or game-over again', async () => {
    const manager = await loadSaveManager(dependencies());

    for (const status of ['won', 'lost'] as const) {
      const bus = new RecordingBus();
      const game = await loadGame(
        makeGameDependencies({ saveManager: manager, bus }),
      );

      game.continueGame(makeEnvelope(makeStateDto({ status })));

      expect(game.getViewData().status).toBe(status);
      expect(
        bus.events.some(
          (event) => event.type === 'game-won' || event.type === 'game-over',
        ),
      ).toBe(false);
    }
  });
});
