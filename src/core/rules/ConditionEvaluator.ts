// Canonical signature from application-and-ui.md §8. One evaluator powers both
// pre-turn validation and post-turn reaction checks (shared-rules.md §3).
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

function isConditionMet(
  condition: Condition,
  state: GameState,
  context: TurnContext,
): boolean {
  switch (condition.kind) {
    case 'flag-set': {
      return state.flags[condition.flag] === true;
    }
    case 'has-item': {
      return state.player.inventory.includes(condition.itemId);
    }
    case 'visited-room': {
      return state.progress.some((entry) =>
        entry.visitedRooms.includes(condition.roomId),
      );
    }
    case 'in-room': {
      return state.player.position.roomId === condition.roomId;
    }
    case 'in-area': {
      return (
        state.player.position.worldId === condition.worldId &&
        state.player.position.areaId === condition.areaId
      );
    }
    case 'topic-complete': {
      return state.progress.some((entry) =>
        entry.completedTopics.includes(condition.topicId),
      );
    }
    case 'npc-knows': {
      return (
        state.npcs[condition.actorId]?.knownTopics.includes(
          condition.topicId,
        ) ?? false
      );
    }
    case 'actor-state': {
      return state.npcs[condition.actorId]?.stateId === condition.stateId;
    }
    case 'in-node': {
      return state.npcs[condition.actorId]?.activeNodeId === condition.nodeId;
    }
    case 'puzzle-solved': {
      return state.puzzles[condition.puzzleId]?.phase === 'solved';
    }
    case 'quiz-passed': {
      return state.flags[`quiz-passed:${condition.quizId}`] === true;
    }
    case 'counter-at-least': {
      return (state.counters[condition.key] ?? 0) >= condition.value;
    }
    case 'all': {
      return condition.of.every((of) => isConditionMet(of, state, context));
    }
    case 'any': {
      return condition.of.some((of) => isConditionMet(of, state, context));
    }
    case 'not': {
      return !isConditionMet(condition.of, state, context);
    }
  }
}

export function createConditionEvaluator(): ConditionEvaluator {
  return {
    evaluate(condition, state, context): boolean {
      return isConditionMet(condition, state, context);
    },
  };
}
