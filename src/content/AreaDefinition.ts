// Canonical definition from application-and-ui.md §3.2.
export interface AreaDefinition {
  readonly id: string; // unique together with worldId
  readonly worldId: string;
  readonly name: string;
  readonly roomIds: readonly string[];
  readonly startRoomId: string; // level start for hazards and quiz failures
  readonly lives: number; // reset value on entering the area
}
