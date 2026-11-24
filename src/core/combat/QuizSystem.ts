// Command-time seam from application-and-ui.md §8 / shared-rules.md §2.
import type { GameState } from '../GameState';
import type { Command } from '../commands/Command';
import type { Effect } from '../effects/Effect';

export interface QuizSystem {
  handle(command: Command, state: GameState): readonly Effect[];
}
