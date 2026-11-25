// Room-targeted lookup for hazard definitions (hazards.md §5). Declaration
// order is preserved so phase 4 never depends on object-key iteration.
import type { Hazard } from './Hazard';

export interface HazardCatalogue {
  getById(id: string): Hazard | undefined;
  getForRoom(roomId: string): readonly Hazard[];
}

export function createHazardCatalogue(
  hazards: readonly Hazard[],
): HazardCatalogue {
  const byId = new Map(hazards.map((hazard) => [hazard.id, hazard]));
  const byRoom = new Map<string, Hazard[]>();
  for (const hazard of hazards) {
    if (
      hazard.trigger.kind !== 'on-room-enter' ||
      hazard.trigger.roomId.length === 0
    ) {
      continue;
    }
    const entries = byRoom.get(hazard.trigger.roomId) ?? [];
    entries.push(hazard);
    byRoom.set(hazard.trigger.roomId, entries);
  }
  return {
    getById(id): Hazard | undefined {
      return byId.get(id);
    },
    getForRoom(roomId): readonly Hazard[] {
      return byRoom.get(roomId) ?? [];
    },
  };
}
