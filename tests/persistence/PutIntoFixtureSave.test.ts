// W7WIN-C01 regression: a PUT onto an authored item fixture must transfer to the
// room the player stands in, not create a phantom room keyed by the fixture ID.
// The resulting save has to survive SaveManager validation and restore.
import { describe, expect, it } from 'vitest';
import { createSaveManager } from '../../src/application/SaveManager';
import type { GameStateDto } from '../../src/core/GameState';
import {
  authoredBundle,
  authoredGame,
  authoredState,
  readSave,
} from '../fixtures/authored';
import { FixedClock, MemoryStorage } from '../fixtures/persistence';

const ROOM_ID = 'room-endless-selvedge';
const THREAD_ID = 'item-rogue-thread';
const DRAWER_ID = 'item-counterfoil-drawer';

// storage-schema.md §3.3(1): an item has exactly one owner list. Collecting all
// three owner kinds makes a duplicate or a phantom owner observable.
function ownersOf(state: GameStateDto, itemId: string): string[] {
  const owners: string[] = [];
  if (state.player.inventory.includes(itemId)) owners.push('player');
  for (const [npcId, npc] of Object.entries(state.npcs)) {
    if (npc.inventory.includes(itemId)) owners.push(npcId);
  }
  for (const [roomId, room] of Object.entries(state.rooms)) {
    if (room.inventory.includes(itemId)) owners.push(roomId);
  }
  return owners;
}

describe('W7WIN-C01 PUT into an authored item fixture', () => {
  it('W7WIN-C01: putting the rogue thread in the counterfoil drawer gives the current room sole ownership and a save that validates and restores', () => {
    const fixture = authoredGame({
      state: authoredState({
        roomId: ROOM_ID,
        heldItems: [THREAD_ID],
        // The walkthrough's give step precedes P10; its flag is the other
        // requirement of puzzle-file-the-rogue-thread.
        flags: { 'card-condition-given': true },
      }),
    });

    const batch = fixture.game.submit('put rogue thread in counterfoil drawer');
    const changedFlags = batch.flatMap((event) =>
      event.type === 'flag-changed' ? [event.flag] : [],
    );
    const solvedPuzzles = batch.flatMap((event) =>
      event.type === 'puzzle-solved' ? [event.puzzleId] : [],
    );
    expect(changedFlags).toContain('rogue-thread-in-drawer');
    expect(solvedPuzzles).toContain('puzzle-file-the-rogue-thread');

    const dto = readSave(fixture.game, fixture.storage).dto;
    expect(ownersOf(dto.state, THREAD_ID)).toEqual([ROOM_ID]);
    expect(Object.keys(dto.state.rooms)).not.toContain(DRAWER_ID);

    const manager = createSaveManager({
      storage: new MemoryStorage(),
      clock: new FixedClock(),
      bundle: authoredBundle,
    });
    const validation = manager.validate(JSON.stringify(dto));
    expect(validation).toEqual({ ok: true, dto });

    const restored = manager.restore(dto);
    expect(restored.player.position).toEqual(dto.state.player.position);
    expect(restored.status).toBe(dto.state.status);
    expect(restored.rooms[ROOM_ID]?.inventory).toContain(THREAD_ID);
    expect(Object.keys(restored.rooms)).not.toContain(DRAWER_ID);
  });
});
