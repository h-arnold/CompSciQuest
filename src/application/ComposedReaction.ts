// Ordered phase-4 composition from shared-rules.md §2. Each system returns
// events for the turn buffer; this module owns no game rules and no buffer.
import type { GameEvent } from '../core/events/GameEvent';
import type { HazardSystem } from '../core/hazards/HazardSystem';
import type { HintSystem } from '../core/hints/HintSystem';
import type { DialogueSystem } from '../core/npcs/DialogueSystem';
import type { PuzzleSystem } from '../core/puzzles/PuzzleSystem';
import type { Scheduler } from '../core/scheduling/Scheduler';
import type { TurnContext } from '../core/TurnContext';

export interface ComposedReactionDependencies {
  readonly scheduler: Scheduler;
  readonly hazards: HazardSystem;
  readonly npcs: DialogueSystem;
  readonly puzzles: PuzzleSystem;
  readonly hints: HintSystem;
}

export type ComposedReaction = (
  context: TurnContext,
  events: readonly GameEvent[],
) => readonly GameEvent[];

// The five systems each apply their own effects and return events; concatenating
// them is the whole of phase 4 (application-and-ui.md §8).
export function createComposedReaction(
  dependencies: ComposedReactionDependencies,
): ComposedReaction {
  return (context, events): readonly GameEvent[] => [
    ...dependencies.scheduler.tick(context),
    ...dependencies.hazards.react(context, events),
    ...dependencies.npcs.react(context, events),
    ...dependencies.puzzles.react(context, events),
    ...dependencies.hints.react(context, events),
  ];
}
