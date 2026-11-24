// Canonical signature from application-and-ui.md §8.
import type { Position } from '../types/domain';
import type { GameState } from './GameState';
import type { Exit } from './Exit';
import type { Room } from './Room';

export interface World {
  getRoom(position: Position): Room | undefined;
  canTraverse(exit: Exit, state: GameState): boolean;
}
