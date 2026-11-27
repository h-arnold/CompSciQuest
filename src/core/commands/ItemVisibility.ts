// Read-only ownership/visibility seam shared by name resolution and verbs
// (application-and-ui.md §5.2, storage-schema.md §3.3). Ownership lives in live
// state; the bundle says which visible fixtures are containers that reveal
// what they hold. No game rule, flag or content ID lives here.
import type { ContentBundle } from '../../content/ContentBundle';
import type { GameState } from '../GameState';

interface ItemVisibility {
  // The owner recorded in state, or undefined when the item is unowned.
  ownerOf(state: GameState, itemId: string): string | undefined;
  // Item IDs a player can name here, including fixture-held contents.
  visibleInRoom(state: GameState, bundle: ContentBundle): ReadonlySet<string>;
}

export const itemVisibility: ItemVisibility = {
  ownerOf(state, itemId): string | undefined {
    if (state.player.inventory.includes(itemId)) return 'player';
    const npc = Object.entries(state.npcs).find(([, entry]) =>
      entry.inventory.includes(itemId),
    );
    if (npc !== undefined) return npc[0];
    const room = Object.entries(state.rooms).find(([, entry]) =>
      entry.inventory.includes(itemId),
    );
    return room?.[0];
  },

  visibleInRoom(state, bundle): ReadonlySet<string> {
    const roomId = state.player.position.roomId;
    const visible = new Set<string>([
      ...state.player.inventory,
      ...(state.rooms[roomId]?.inventory ?? []),
    ]);
    // transfer-item keys a fixture's contents by the fixture's own ID
    // (§5.1). Walk those contents so a placed item stays nameable, with a
    // pending list rather than recursion so content cannot loop back.
    const pending = [...visible];
    for (let index = 0; index < pending.length; index += 1) {
      const id = pending[index];
      if (id === undefined || bundle.items.getById(id)?.portable !== false) {
        continue;
      }
      const heldItems = state.rooms[id]?.inventory ?? [];
      for (const held of heldItems) {
        if (visible.has(held)) continue;
        visible.add(held);
        pending.push(held);
      }
    }
    return visible;
  },
};
