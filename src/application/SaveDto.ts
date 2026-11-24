// Canonical envelope from storage-schema.md §2 and result type from §8.2.
import type { GameStateDto } from '../core/GameState';

export interface SaveDto {
  readonly version: 1; // literal; see schema.ts
  readonly savedAt: string; // ISO 8601, supplied by the injected Clock
  readonly state: GameStateDto;
}

export type LoadFailureReason =
  | 'invalid-json'
  | 'wrong-version'
  | 'newer-version'
  | 'invalid-shape'
  | 'invalid-content';

export type LoadResult =
  | { readonly ok: true; readonly dto: SaveDto }
  | { readonly ok: false; readonly reason: LoadFailureReason };

// QuarantineDto is canonical in storage-schema.md §9; re-exported here for the
// save API import path.
export type { QuarantineDto } from './QuarantineDto';
