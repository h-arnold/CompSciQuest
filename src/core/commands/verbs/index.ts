// Canonical verb table (architecture.md §4, application-and-ui.md §5.1/§5.2).
// One handler per command kind; handlers return effects and never mutate state.
import type { TurnContext } from '../../TurnContext';
import type { Effect } from '../../effects/Effect';
import type { Command } from '../Command';
import type { CommandHandler } from '../CommandHandler';

function message(text: string): Effect {
  return { kind: 'message', text };
}

function visibleOwners(context: TurnContext): ReadonlySet<string> {
  const roomId = context.state.player.position.roomId;
  const inRoom = context.state.rooms[roomId]?.inventory ?? [];
  return new Set<string>([...context.state.player.inventory, ...inRoom]);
}

function isVisible(context: TurnContext, targetId: string): boolean {
  return visibleOwners(context).has(targetId);
}

function hasItem(context: TurnContext, itemId: string): boolean {
  return context.state.player.inventory.includes(itemId);
}

// Doors and containers use the documented kebab-case flag prefixes. The choice
// is derived from the content definition, never from a hard-coded object ID.
function flagPrefix(context: TurnContext, targetId: string): string {
  const item = context.bundle.items.getById(targetId);
  const names: readonly string[] = item
    ? [item.name, ...item.aliases]
    : [targetId];
  return names.some((name) => name.toLowerCase().includes('door'))
    ? 'door'
    : 'container';
}

function isUnlocked(context: TurnContext, targetId: string): boolean {
  const prefix = flagPrefix(context, targetId);
  return context.state.flags[`${prefix}-unlocked:${targetId}`] === true;
}

function describeRoom(context: TurnContext): Effect {
  const roomId = context.state.player.position.roomId;
  const room = context.bundle.rooms.getById(roomId);
  return message(
    room ? `${room.title}. ${room.description}` : 'You see nothing special.',
  );
}

function describeTarget(context: TurnContext, targetId: string): Effect {
  const item = context.bundle.items.getById(targetId);
  const actor = context.bundle.actors.getById(targetId);
  const description = item?.description ?? actor?.aliases[0];
  return message(description ?? 'You see nothing special.');
}

function openOrClose(
  command: Command,
  context: TurnContext,
  shouldOpen: boolean,
): readonly Effect[] {
  if (command.kind !== 'open' && command.kind !== 'close') return [];
  const targetId = command.targetId;
  if (!isVisible(context, targetId)) {
    return [message('You cannot see that here.')];
  }
  if (!isUnlocked(context, targetId)) {
    return [message('It is locked.')];
  }
  const prefix = flagPrefix(context, targetId);
  const actionFlag = `${prefix}-open:${targetId}`;
  const current = context.state.flags[actionFlag];
  // §5.1: the target must not already be in the requested state. An absent
  // flag records no state, so only an explicit value counts as already done.
  if (shouldOpen && current === true) {
    return [message('It is already open.')];
  }
  if (!shouldOpen && current === false) {
    return [message('It is already closed.')];
  }
  return [
    { kind: 'set-flag', flag: actionFlag, value: shouldOpen },
    message(shouldOpen ? 'You open it.' : 'You close it.'),
  ];
}

function unlockHandler(
  command: Command,
  context: TurnContext,
): readonly Effect[] {
  if (command.kind !== 'unlock') return [];
  if (!hasItem(context, command.itemId)) {
    return [message('You are not carrying that.')];
  }
  if (!isVisible(context, command.targetId)) {
    return [message('You cannot see that here.')];
  }
  const prefix = flagPrefix(context, command.targetId);
  return [
    {
      kind: 'set-flag',
      flag: `${prefix}-unlocked:${command.targetId}`,
      value: true,
    },
    message('You unlock it.'),
  ];
}

function putHandler(command: Command, context: TurnContext): readonly Effect[] {
  if (command.kind !== 'put') return [];
  if (!hasItem(context, command.itemId)) {
    return [message('You are not carrying that.')];
  }
  if (!isVisible(context, command.targetId)) {
    return [message('You cannot see that here.')];
  }
  return [
    {
      kind: 'transfer-item',
      itemId: command.itemId,
      fromOwnerId: 'player',
      toOwnerId: command.targetId,
    },
    message('You put it down.'),
  ];
}

function goHandler(command: Command, context: TurnContext): readonly Effect[] {
  if (command.kind !== 'go') return [];
  const roomId = context.state.player.position.roomId;
  const room = context.bundle.rooms.getById(roomId);
  const exit = room?.exits.find(
    (candidate) => candidate.direction === command.direction,
  );
  return [
    exit
      ? { kind: 'move-player', roomId: exit.targetRoomId, reason: 'go' }
      : message('You cannot go that way.'),
  ];
}

function takeHandler(
  command: Command,
  context: TurnContext,
): readonly Effect[] {
  if (command.kind !== 'take' && command.kind !== 'drop') return [];
  // §5.2: only `take` is gated by portability; `drop` shares this handler but
  // must always hand the item back to the room. A refusal is in-voice feedback
  // (content-rules.md §3 N5) and changes no state.
  if (command.kind === 'take') {
    const item = context.bundle.items.getById(command.itemId);
    if (item?.portable === false) {
      return [
        message(item.refusalText || 'You cannot take that item with you.'),
      ];
    }
  }
  const from =
    command.kind === 'take' ? context.state.player.position.roomId : 'player';
  const to =
    command.kind === 'take' ? 'player' : context.state.player.position.roomId;
  return [
    {
      kind: 'transfer-item',
      itemId: command.itemId,
      fromOwnerId: from,
      toOwnerId: to,
    },
    message(command.kind === 'take' ? 'Taken.' : 'Dropped.'),
  ];
}

function fixedMessage(text: string): CommandHandler {
  return () => [message(text)];
}

function lookHandler(
  command: Command,
  context: TurnContext,
): readonly Effect[] {
  return command.kind === 'look' ? [describeRoom(context)] : [];
}

function inventoryHandler(
  command: Command,
  context: TurnContext,
): readonly Effect[] {
  return command.kind === 'inventory'
    ? [
        message(
          `You are carrying ${context.state.player.inventory.join(', ') || 'nothing'}.`,
        ),
      ]
    : [];
}

function scoreHandler(
  command: Command,
  context: TurnContext,
): readonly Effect[] {
  return command.kind === 'score'
    ? [message(`Your score is ${context.state.score}.`)]
    : [];
}

const HANDLERS: { readonly [K in Command['kind']]: CommandHandler } = {
  go: goHandler,
  take: takeHandler,
  drop: takeHandler,
  use: fixedMessage('You cannot use that here.'),
  examine: (command, context) => [
    command.kind === 'examine'
      ? describeTarget(context, command.targetId)
      : message('You see nothing special.'),
  ],
  open: (command, context) => openOrClose(command, context, true),
  close: (command, context) => openOrClose(command, context, false),
  unlock: unlockHandler,
  put: putHandler,
  look: lookHandler,
  inventory: inventoryHandler,
  score: scoreHandler,
  help: fixedMessage(
    'Try a direction, take, drop, examine, open, close, unlock, put, look, inventory, score or help.',
  ),
  unknown: fixedMessage("I don't understand that."),
  'talk-to': fixedMessage('There is no reply.'),
  ask: fixedMessage('There is no reply.'),
  tell: fixedMessage('There is no reply.'),
  give: fixedMessage('That is not accepted.'),
  show: fixedMessage('There is no reaction.'),
  bye: fixedMessage('Farewell.'),
  answer: fixedMessage('There is no question to answer.'),
  hint: fixedMessage('No hint is available.'),
};

function handlerFor(command: Command): CommandHandler | undefined {
  return HANDLERS[command.kind];
}

// The seam loader verifies the export is callable and invokes its named method.
export const getCommandHandler = Object.assign(handlerFor, {
  getCommandHandler: handlerFor,
});
