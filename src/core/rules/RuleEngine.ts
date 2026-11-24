// Canonical signature from application-and-ui.md §8.
// An empty array means the command is allowed.
import type { GameState } from '../GameState';
import type { Command } from '../commands/Command';

export interface RuleEngine {
  check(command: Command, state: GameState): readonly string[];
}
