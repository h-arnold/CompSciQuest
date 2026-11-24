// Canonical signature from application-and-ui.md §5.2.
import type { TurnContext } from '../TurnContext';
import type { Effect } from '../effects/Effect';
import type { Command } from './Command';

export type CommandHandler = (
  command: Command,
  context: TurnContext,
) => readonly Effect[];
