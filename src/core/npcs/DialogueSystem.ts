// Phase-4 seam from application-and-ui.md §8 / shared-rules.md §2. The real
// NPC reaction: it ends a conversation when the player leaves the room, and it
// owns the conversational turn (implicit start, topic, effects, farewell).
// It applies effects through the injected applier and never emits to a bus.
import type { GameEvent } from '../events/GameEvent';
import type { TurnContext } from '../TurnContext';
import {
  createNpcTopicResolver,
  endConversation,
  handleConversationTopic,
  handleIdleTopic,
  hasHandledNpcTurn,
  isLeavingRoom,
  speakingActorIds,
  startConversation,
  TALKING_STATE,
} from './ConversationFlow';
import type { NpcDependencies } from './NpcDependencies';

export interface DialogueSystem {
  react(
    context: TurnContext,
    events: readonly GameEvent[],
  ): readonly GameEvent[];
}

function actorIdOf(context: TurnContext): string | undefined {
  const command = context.command;
  switch (command.kind) {
    case 'talk-to':
    case 'ask':
    case 'tell':
    case 'give':
    case 'show': {
      return command.actorId;
    }
    default: {
      return undefined;
    }
  }
}

function hasItem(context: TurnContext, itemId: string): boolean {
  return context.state.player.inventory.includes(itemId);
}

export function createDialogueSystem(
  dependencies: NpcDependencies,
): DialogueSystem {
  const resolver = createNpcTopicResolver(dependencies);
  return {
    react(context, bufferedEvents): readonly GameEvent[] {
      if (hasHandledNpcTurn(bufferedEvents)) return [];
      const events: GameEvent[] = [];
      const command = context.command;

      if (isLeavingRoom(command, bufferedEvents)) {
        for (const actorId of speakingActorIds(context.state)) {
          endConversation(
            context,
            actorId,
            'left the room',
            dependencies,
            events,
          );
        }
        return events;
      }

      if (command.kind === 'bye') {
        for (const actorId of speakingActorIds(context.state)) {
          endConversation(
            context,
            actorId,
            'said goodbye',
            dependencies,
            events,
          );
        }
        return events;
      }

      const actorId = actorIdOf(context);
      if (actorId === undefined) return events;
      if (
        (command.kind === 'give' || command.kind === 'show') &&
        !hasItem(context, command.itemId)
      ) {
        return events;
      }
      const npc = context.state.npcs[actorId];
      if (npc === undefined) return events;
      if (npc.stateId !== TALKING_STATE) {
        startConversation(context, actorId, dependencies, events);
      }
      if (command.kind === 'talk-to') {
        handleIdleTopic(context, actorId, dependencies, events);
      } else {
        handleConversationTopic(
          context,
          actorId,
          dependencies,
          resolver,
          events,
        );
      }
      return events;
    },
  };
}
