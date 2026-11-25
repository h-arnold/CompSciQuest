// Catalogue-derived room summaries from application-and-ui.md §3.1/§3.2/§6/§9
// and the accepted V4 trace in walkthrough.md §2/§3.
import { describe, expect, it } from 'vitest';
import { createEffectApplier } from '../../src/core/effects/EffectApplier';
import type { RoomSummary } from '../../src/core/events/GameEvent';
import { FakeRandom } from '../fixtures/persistence';
import {
  authoredBundle,
  authoredGame,
  authoredState,
} from '../fixtures/authored';

function summaryOf(roomId: string): RoomSummary {
  const room = authoredBundle.rooms.getById(roomId);
  if (room === undefined) {
    throw new Error(`Authored room '${roomId}' is missing from the catalogue.`);
  }
  return {
    id: room.id,
    title: room.title,
    description: room.description,
    exits: room.exits.map((exit) => exit.direction),
  };
}

describe('authored room-entry summaries', () => {
  it('ROOM-TEXT-01: move-player emits the catalogue title, description and exits and updates the player position', () => {
    const state = authoredState({ roomId: 'room-arrival' });
    const dependencies = {
      random: new FakeRandom([0]),
      bundle: authoredBundle,
    };
    const applier = createEffectApplier(state, dependencies);

    const events = applier.apply({
      kind: 'move-player',
      roomId: 'room-network-hub',
      reason: 'go',
    });

    expect(events).toEqual([
      { type: 'room-entered', room: summaryOf('room-network-hub') },
    ]);
    expect(state.player.position.roomId).toBe('room-network-hub');
  });

  it('ROOM-TEXT-02: boot and movement produce the same summary from the injected catalogue', () => {
    const { game, bus } = authoredGame();
    game.newGame();
    const boot = bus.batches
      .at(-1)
      ?.find((event) => event.type === 'room-entered');
    bus.batches.length = 0;

    const movementBatch = game.submit('east');
    const movement = movementBatch.find(
      (event) => event.type === 'room-entered',
    );

    expect(boot).toEqual({
      type: 'room-entered',
      room: summaryOf('room-arrival'),
    });
    expect(movement).toEqual({
      type: 'room-entered',
      room: summaryOf('room-network-hub'),
    });
    expect(movement).not.toEqual(boot);
    expect(bus.batches).toEqual([movementBatch]);
  });

  it('ROOM-TEXT-03: the authored hub description carries all six route clues and entry surfaces them without examine', () => {
    const hub = authoredBundle.rooms.getById('room-network-hub');
    if (hub === undefined) {
      throw new Error(
        'The authored Network Hub is missing from the catalogue.',
      );
    }
    const description = hub.description.toLowerCase();
    for (const [flag, clue] of [
      ['switches-set', 'switches'],
      ['hex-read', 'nibbles'],
      ['characters-matched', 'tiles'],
      ['picture-built', 'image'],
      ['sound-sampled', 'sound'],
      ['stacks-sorted', 'stacks'],
    ]) {
      expect(description, `the hub must name ${flag}`).toContain(flag);
      expect(description, `the hub must repeat the ${clue} clue`).toContain(
        clue,
      );
    }

    const { game } = authoredGame({
      state: authoredState({ roomId: 'room-arrival' }),
    });
    const entered = game
      .submit('east')
      .find((event) => event.type === 'room-entered');

    expect(entered).toEqual({
      type: 'room-entered',
      room: summaryOf('room-network-hub'),
    });
  });
});
