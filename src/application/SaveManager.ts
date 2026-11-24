// Canonical API contract from storage-schema.md §10 (interface only).
import type { GameState, GameStateDto } from '../core/GameState';
import type { LoadResult, SaveDto } from './SaveDto';

export interface SaveManager {
  buildDto(state: GameStateDto): SaveDto;
  save(state: GameStateDto): void;
  load(): LoadResult;
  validate(text: string): LoadResult;
  restore(dto: SaveDto): GameState;
}
