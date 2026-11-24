// Canonical signature from application-and-ui.md §8.
import type { Direction } from '../types/domain';
import type { Precondition } from './rules/Precondition';

export interface Exit {
  readonly direction: Direction;
  readonly targetRoomId: string;
  readonly preconditions: readonly Precondition[];
}
