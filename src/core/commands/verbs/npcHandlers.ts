// NPC verb effects from npcs.md §3/§4 and the 2026-11-25 user decisions.
// Handlers return effects only: conversational turns themselves are owned by
// the phase-4 DialogueSystem, so these cover just the friendly preconditions.
import type { TurnContext } from '../../TurnContext';
import type { Effect } from '../../effects/Effect';
import { TALKING_STATE } from '../../npcs/ConversationFlow';
import type { Command } from '../Command';
import type { CommandHandler } from '../CommandHandler';

function message(text: string): Effect {
  return { kind: 'message', text };
}

function isTalking(context: TurnContext): boolean {
  return Object.values(context.state.npcs).some(
    (npc) => npc.stateId === TALKING_STATE,
  );
}

function hasItem(context: TurnContext, itemId: string): boolean {
  return context.state.player.inventory.includes(itemId);
}

export const npcHandler: CommandHandler = (
  command: Command,
  context: TurnContext,
): readonly Effect[] => {
  switch (command.kind) {
    case 'bye': {
      return isTalking(context)
        ? []
        : [message('You are not in a conversation.')];
    }
    case 'give':
    case 'show': {
      return hasItem(context, command.itemId)
        ? []
        : [message('You do not have that.')];
    }
    default: {
      return [];
    }
  }
};
