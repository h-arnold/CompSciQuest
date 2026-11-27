// Canonical verb table (architecture.md §4, application-and-ui.md §5.1/§5.2).
// One handler per command kind; handlers return effects and never mutate state.
import type { TurnContext } from '../../TurnContext';
import type { Effect } from '../../effects/Effect';
import type { Command } from '../Command';
import type { CommandHandler } from '../CommandHandler';
import { helpText } from '../CommandTable';
import { itemVisibility } from '../ItemVisibility';
import { isActorOutOfRoom } from '../../npcs/TopicSelection';
import { createConditionEvaluator } from '../../rules/ConditionEvaluator';
import { npcHandler } from './npcHandlers';
import {
  describeScenery,
  examineInteraction,
  isSceneryVisible,
  putInteraction,
  useInteraction,
} from '../InteractionRules';

function message(text: string): Effect {
  return { kind: 'message', text };
}

function visibleOwners(context: TurnContext): ReadonlySet<string> {
  return itemVisibility.visibleInRoom(context.state, context.bundle);
}

// A visible, open, non-portable item is a fixture holding other items. The
// open flag is the canonical container state (§5.1); a closed or scenery
// target still gets the generic put line. Its bundle name is the only source
// for player-facing wording (§5.1/§5.2).
function visibleContainerName(
  context: TurnContext,
  targetId: string,
): string | undefined {
  const item = context.bundle.items.getById(targetId);
  return item?.portable === false &&
    context.state.flags[`container-open:${targetId}`] === true &&
    visibleOwners(context).has(targetId)
    ? item.name
    : undefined;
}

interface ContainerOwner {
  readonly ownerId: string;
  readonly name: string;
}

function visibleContainerOwner(
  context: TurnContext,
  itemId: string,
): ContainerOwner | undefined {
  const ownerId = itemVisibility.ownerOf(context.state, itemId);
  if (ownerId === undefined) return;
  const name = visibleContainerName(context, ownerId);
  return name === undefined ? undefined : { ownerId, name };
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
  const description =
    item?.description ??
    actor?.aliases[0] ??
    describeScenery(context, targetId);
  const text = description ?? 'You see nothing special.';
  const container = visibleContainerOwner(context, targetId);
  return message(
    container === undefined ? text : `${text} It is in the ${container.name}.`,
  );
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
  // content-bible.md §12 (round-2 findings): a fixed fixture offered as the
  // key-like item cannot be carried. Point at the portable tool instead of
  // claiming it is missing, and leave the whole state untouched.
  const itemDefinition = context.bundle.items.getById(command.itemId);
  const targetDefinition = context.bundle.items.getById(command.targetId);
  if (
    itemDefinition?.portable === false &&
    targetDefinition?.portable === true
  ) {
    const item = itemDefinition?.name ?? command.itemId;
    const target = targetDefinition?.name ?? command.targetId;
    return [
      message(
        `The ${item} stays in place; turn its lock with the ${target} instead.`,
      ),
    ];
  }
  if (!hasItem(context, command.itemId)) {
    // content-bible.md §12 (W7 fix round): name the missing key and its lock
    // rather than falsely claiming the carried object is absent.
    const item =
      context.bundle.items.getById(command.itemId)?.name ?? command.itemId;
    const target =
      context.bundle.items.getById(command.targetId)?.name ?? command.targetId;
    return [
      message(
        `You need the ${item} in hand before it will turn in the ${target}.`,
      ),
    ];
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

function putResultText(
  itemName: string | undefined,
  containerName: string | undefined,
): string {
  return itemName === undefined || containerName === undefined
    ? 'You put it down.'
    : `You put the ${itemName} in the ${containerName}.`;
}

function putHandler(command: Command, context: TurnContext): readonly Effect[] {
  if (command.kind !== 'put') return [];
  // Fixtures and items in the room are reachable sources as well as carried
  // ones (walkthrough.md §8.6 P1/P5/P9/P10).
  const item = context.bundle.items.getById(command.itemId);
  const canReach =
    item === undefined
      ? isSceneryVisible(context, command.itemId)
      : isVisible(context, command.itemId);
  if (!canReach) {
    return [message('You are not carrying that.')];
  }
  const fromOwnerId = hasItem(context, command.itemId)
    ? 'player'
    : context.state.player.position.roomId;
  if (
    !isVisible(context, command.targetId) &&
    !isSceneryVisible(context, command.targetId)
  ) {
    return [message('You cannot see that here.')];
  }
  // storage-schema.md §3.3: transfer-item owner keys are 'player', actor IDs
  // or room IDs. Scenery and authored item fixtures are interaction targets,
  // not room catalogue entries, so a put onto either belongs to the room it
  // stands in. A plain item target (for example a container) keeps its ID.
  const putFlags = putInteraction(command, context);
  const toOwnerId =
    isSceneryVisible(context, command.targetId) || putFlags.length > 0
      ? context.state.player.position.roomId
      : command.targetId;
  const containerName = visibleContainerName(context, command.targetId);
  const itemName = item?.name;
  return [
    {
      kind: 'transfer-item',
      itemId: command.itemId,
      fromOwnerId,
      toOwnerId,
    },
    ...putFlags,
    message(putResultText(itemName, containerName)),
  ];
}

function useHandler(command: Command, context: TurnContext): readonly Effect[] {
  if (command.kind !== 'use') return [];
  const item = context.bundle.items.getById(command.itemId);
  const canReach =
    item === undefined
      ? isSceneryVisible(context, command.itemId)
      : isVisible(context, command.itemId);
  if (!canReach) return [message('You are not carrying that.')];
  if (
    command.targetId !== undefined &&
    !isVisible(context, command.targetId) &&
    !isSceneryVisible(context, command.targetId)
  ) {
    return [message('You cannot see that here.')];
  }
  return (
    useInteraction(command, context) ?? [
      message('That does not fit the mechanism here.'),
    ]
  );
}

function examineHandler(
  command: Command,
  context: TurnContext,
): readonly Effect[] {
  if (command.kind !== 'examine') return [];
  const interaction = examineInteraction(command.targetId);
  return interaction.length > 0
    ? interaction
    : [describeTarget(context, command.targetId)];
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
  // A block placed in a fixture is owned by that fixture, not by the room.
  // Name the real source so the transfer removes it from the one owner it has.
  const container =
    command.kind === 'take'
      ? visibleContainerOwner(context, command.itemId)
      : undefined;
  if (container !== undefined) {
    const name =
      context.bundle.items.getById(command.itemId)?.name ?? command.itemId;
    return [
      {
        kind: 'transfer-item',
        itemId: command.itemId,
        fromOwnerId: container.ownerId,
        toOwnerId: 'player',
      },
      message(`You take the ${name} from the ${container.name}.`),
    ];
  }
  // A closed fixture's contents are still owned by that fixture in state;
  // fall back to the room only when no owner is recorded. `drop` keeps its
  // player -> room transfer unchanged.
  const from =
    command.kind === 'take'
      ? (itemVisibility.ownerOf(context.state, command.itemId) ??
        context.state.player.position.roomId)
      : 'player';
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
  if (command.kind !== 'inventory') {
    return [];
  }
  // Catalogue names are authoritative; unresolved IDs fall back to the raw ID.
  const names: readonly string[] = context.state.player.inventory.map(
    (id) => context.bundle.items.getById(id)?.name ?? id,
  );
  return [message(`You are carrying ${names.join(', ') || 'nothing'}.`)];
}

function scoreHandler(
  command: Command,
  context: TurnContext,
): readonly Effect[] {
  return command.kind === 'score'
    ? [message(`Your score is ${context.state.score}.`)]
    : [];
}

// WR4-C1-FIX: an actor named by give/show but an item the resolver cannot see.
// Reuse the canonical room-absence test; emit one message and change no state.
function unseenActorHandler(
  command: Command,
  context: TurnContext,
): readonly Effect[] {
  if (command.kind !== 'unseen-actor') return [];
  return [
    message(
      isActorOutOfRoom(context, createConditionEvaluator(), command.actorId)
        ? 'You cannot see that here.'
        : "I don't understand that.",
    ),
  ];
}

const HANDLERS: { readonly [K in Command['kind']]: CommandHandler } = {
  go: goHandler,
  take: takeHandler,
  drop: takeHandler,
  use: useHandler,
  examine: examineHandler,
  open: (command, context) => openOrClose(command, context, true),
  close: (command, context) => openOrClose(command, context, false),
  unlock: unlockHandler,
  put: putHandler,
  look: lookHandler,
  inventory: inventoryHandler,
  score: scoreHandler,
  help: () => [message(helpText())],
  unknown: fixedMessage("I don't understand that."),
  'talk-to': npcHandler,
  ask: npcHandler,
  tell: npcHandler,
  give: npcHandler,
  show: npcHandler,
  'unseen-actor': unseenActorHandler,
  bye: npcHandler,
  // Quiz answers and hint requests are delivered by their domain systems
  // (`QuizSystem.handle` in phase 3 and `HintSystem.react` in phase 4).
  answer: () => [],
  hint: () => [],
};

function handlerFor(command: Command): CommandHandler | undefined {
  return HANDLERS[command.kind];
}

// The seam loader verifies the export is callable and invokes its named method.
export const getCommandHandler = Object.assign(handlerFor, {
  getCommandHandler: handlerFor,
});
