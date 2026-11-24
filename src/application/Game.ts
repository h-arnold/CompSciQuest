// Canonical façade from application-and-ui.md §4.
import type { GameEvent } from '../core/events/GameEvent';
import type { GameViewData } from './GameViewData';
import type { LoadResult, SaveDto } from './SaveDto';

export interface Game {
  submit(raw: string): readonly GameEvent[];
  newGame(): void;
  continueGame(dto: SaveDto): void;
  restart(): void;
  getViewData(): GameViewData;
  save(): void;
  download(): void;
  importSave(text: string): LoadResult;
}
