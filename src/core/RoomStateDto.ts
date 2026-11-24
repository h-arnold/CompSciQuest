// Canonical persisted shape from storage-schema.md §3.2.
// A room absent from GameStateDto.rooms has an empty inventory; entries are lazy.
export interface RoomStateDto {
  readonly inventory: readonly string[];
}
