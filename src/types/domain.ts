// Canonical contracts from architecture.md §7.
export type Direction =
  | 'north'
  | 'south'
  | 'east'
  | 'west'
  | 'up'
  | 'down'
  | 'in'
  | 'out';

export interface Position {
  readonly worldId: string;
  readonly areaId: string;
  readonly roomId: string;
}

export interface GameObject {
  readonly id: string;
  readonly name: string;
  readonly aliases: readonly string[];
  describe(): string;
}

export interface Serialisable<TDto> {
  toDto(): TDto;
}
// Restoration is a factory concern: GameState.createInitial() / fromDto(dto).
