// Canonical signature from application-and-ui.md §8.
// An empty array means the command is allowed.
import type { ContentBundle } from '../../content/ContentBundle';
import type { GameState } from '../GameState';
import type { Random } from '../Random';
import type { TurnContext } from '../TurnContext';
import type { Command } from '../commands/Command';
import type { ConditionEvaluator } from './ConditionEvaluator';

export interface RuleEngine {
  check(command: Command, state: GameState): readonly string[];
}

export interface RuleEngineDependencies {
  readonly bundle: ContentBundle;
  readonly evaluator: ConditionEvaluator;
  readonly random: Random;
}

export function createRuleEngine(
  dependencies: RuleEngineDependencies,
): RuleEngine {
  const { bundle, evaluator, random } = dependencies;
  return {
    check(command, state): readonly string[] {
      if (command.kind !== 'go') return [];
      // A missing exit is reported by the verb handler; validation only gates
      // exits whose declared preconditions do not hold (architecture.md §6).
      const room = bundle.rooms.getById(state.player.position.roomId);
      const exit = room?.exits.find(
        (candidate) => candidate.direction === command.direction,
      );
      if (exit === undefined) return [];
      const context: TurnContext = {
        turn: state.turn,
        state,
        bundle,
        random,
        command,
      };
      return exit.preconditions
        .filter(
          (precondition) => !evaluator.evaluate(precondition, state, context),
        )
        .map((precondition) => `That way is blocked: ${precondition.kind}.`);
    },
  };
}
