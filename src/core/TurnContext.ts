// Canonical signature from application-and-ui.md §8.
import type { ContentBundle } from '../content/ContentBundle';
import type { Command } from './commands/Command';
import type { GameState } from './GameState';
import type { Random } from './Random';

export interface TurnContext {
  readonly turn: number;
  readonly state: GameState;
  readonly bundle: ContentBundle;
  readonly random: Random;
  // The resolved command for this turn; the carrier for on-verb and
  // on-item-used triggers (shared-rules.md §4, application-and-ui.md §8).
  readonly command: Command;
}
