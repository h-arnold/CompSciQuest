// Canonical signature from application-and-ui.md §8.
import type { GameState } from '../GameState';
import type { TurnContext } from '../TurnContext';
import type { Condition } from './Condition';

export interface ConditionEvaluator {
  evaluate(
    condition: Condition,
    state: GameState,
    context: TurnContext,
  ): boolean;
}
