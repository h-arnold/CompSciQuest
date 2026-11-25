// Phase-4 seam from application-and-ui.md §8 / shared-rules.md §2.
import type { GameEvent } from '../events/GameEvent';
import type { TurnContext } from '../TurnContext';

export interface HintSystem {
  react(
    context: TurnContext,
    events: readonly GameEvent[],
  ): readonly GameEvent[];
}
