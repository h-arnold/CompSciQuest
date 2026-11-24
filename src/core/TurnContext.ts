// Canonical signature from application-and-ui.md §8.
import type { ContentBundle } from '../content/ContentBundle';
import type { GameState } from './GameState';
import type { Random } from './Random';

export interface TurnContext {
  readonly turn: number;
  readonly state: GameState;
  readonly bundle: ContentBundle;
  readonly random: Random;
}
