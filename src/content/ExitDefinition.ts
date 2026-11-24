// DESIGN-OWNED GAP: referenced by application-and-ui.md §3.2 (RoomDefinition)
// but not defined there; the design docs own a later canonical definition.
// Mirrors the canonical Exit contract in §8: direction, target and preconditions.
import type { Direction } from '../types/domain';
import type { Precondition } from '../core/rules/Precondition';

export interface ExitDefinition {
  readonly direction: Direction;
  readonly targetRoomId: string;
  readonly preconditions: readonly Precondition[];
}
