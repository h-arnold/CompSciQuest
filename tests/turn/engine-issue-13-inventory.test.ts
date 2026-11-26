// ENG13-INVENTORY-01 — inventory replies must name carried items, and the
// pickup batch must not leak a moved-between-owners debug line into the log.
//
// Authority:
//   .opencode/scratchpad/branch-matrix.md row ENG13-INVENTORY-01.
//   ENGINE_ISSUES.md: Batch E2 decisions table (line 50), issue #13 (line 81),
//   Group B (lines 124-127) and parallel-execution stream 2 (line 156).
//   PLAYTEST_ISSUES.md §13 (lines 146-154) for the two verbatim leaked lines.
//   docs/developer/application-and-ui.md §3.1 (getById returns undefined and
//   never throws), §3.2 (ItemDefinition.name), §6.1 (item-moved is a suppressed
//   bookkeeping event) and §8 (TurnContext carries the injected bundle).
//
// Every collaborator is an in-memory fake: no clock, storage, random source,
// network, file system or DOM is used.
import { describe, expect, it } from 'vitest';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { ItemDefinition } from '../../src/content/ItemDefinition';
import type { Command } from '../../src/core/commands/Command';
import { getCommandHandler } from '../../src/core/commands/verbs/index';
import type { Effect } from '../../src/core/effects/Effect';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { GameState } from '../../src/core/GameState';
import type { TurnContext } from '../../src/core/TurnContext';
import { catalogueOf, makeBundle } from '../fixtures/persistence';
import { makeParserState, makeTurnContext } from '../fixtures/parser';
import { loadFormatEvent } from '../fixtures/turn';

const CARTRIDGE_ID = 'item-comic-sans-cartridge';
const CARTRIDGE_NAME = 'comic sans cartridge';
const LAMP_ID = 'lamp';
const BINARY_HALL = 'room-binary-hall';
const MISSING_ID = 'item-unknown-cartridge';
const DEBUG_LINE = `${CARTRIDGE_NAME} moved from ${BINARY_HALL} to player.`;

const CARTRIDGE: ItemDefinition = {
  id: CARTRIDGE_ID,
  name: CARTRIDGE_NAME,
  aliases: [CARTRIDGE_NAME, 'cursed cartridge'],
  portable: true,
  description: 'A warm, humming cartridge in a paper sleeve.',
  initialRoom: BINARY_HALL,
};

const LAMP: ItemDefinition = {
  id: LAMP_ID,
  name: 'Lamp',
  aliases: [],
  portable: true,
  description: 'A small lamp.',
  initialRoom: BINARY_HALL,
};

function bundleWithItems(items: readonly ItemDefinition[]): ContentBundle {
  return { ...makeBundle(), items: catalogueOf(items) };
}

function messagesOf(effects: readonly Effect[]): readonly string[] {
  type MessageEffect = Extract<Effect, { readonly kind: 'message' }>;
  return effects
    .filter((effect): effect is MessageEffect => effect.kind === 'message')
    .map((effect) => effect.text);
}

function handlerFor(command: Command) {
  const handler = getCommandHandler(command);
  if (handler === undefined) {
    throw new Error(`No command handler for ${command.kind}`);
  }
  return handler;
}

// The in-memory runtime state is a plain JSON-shaped object, so a serialised
// snapshot is enough to prove a handler leaves it untouched.
function stateSnapshot(state: GameState): string {
  return JSON.stringify(state);
}

// The player stands in the Binary Hall, as in the §13 playtest pickup.
function contextFor(
  inventory: readonly string[],
  bundle: ContentBundle,
): TurnContext {
  const state: GameState = makeParserState({
    player: {
      position: {
        worldId: 'world-stub',
        areaId: 'area-stub',
        roomId: BINARY_HALL,
      },
      inventory: [...inventory],
      lives: 3,
    },
    rooms: {
      'room-stub-start': { inventory: [] },
      'room-stub-north': { inventory: [] },
      [BINARY_HALL]: { inventory: [] },
    },
  });
  return makeTurnContext({ state, bundle });
}

// The inventory verb is a read-only renderer: it answers with message effects
// only, and leaves the injected state untouched.
function inventoryReply(
  inventory: readonly string[],
  bundle: ContentBundle,
): readonly string[] {
  const context = contextFor(inventory, bundle);
  const before = stateSnapshot(context.state);
  const command: Command = { kind: 'inventory' };
  const effects = handlerFor(command)(command, context);
  expect(
    stateSnapshot(context.state),
    'inventory must not change game state',
  ).toBe(before);
  return messagesOf(effects);
}

describe('inventory reply — ENG13-INVENTORY-01 (PLAYTEST_ISSUES.md §13)', () => {
  it('ENG13-INVENTORY-01: carried items are named, not shown as internal IDs', () => {
    const reply = inventoryReply([CARTRIDGE_ID], bundleWithItems([CARTRIDGE]));

    expect(reply).toEqual(['You are carrying comic sans cartridge.']);
    expect(reply.join('\n')).not.toContain(CARTRIDGE_ID);
  });

  it('ENG13-INVENTORY-01: several carried items are listed by name in inventory order', () => {
    const reply = inventoryReply(
      [CARTRIDGE_ID, LAMP_ID],
      bundleWithItems([CARTRIDGE, LAMP]),
    );

    expect(reply).toEqual(['You are carrying comic sans cartridge, Lamp.']);
    for (const rawId of [CARTRIDGE_ID, LAMP_ID]) {
      expect(
        reply.join('\n'),
        `${rawId} must not appear in the reply`,
      ).not.toContain(rawId);
    }
  });

  it('ENG13-INVENTORY-01: an unresolved ID does not throw and is shown raw for that entry only', () => {
    const bundle = bundleWithItems([CARTRIDGE]);
    const render = (): readonly string[] =>
      inventoryReply([CARTRIDGE_ID, MISSING_ID], bundle);

    expect(render).not.toThrow();
    expect(render()).toEqual([
      `You are carrying ${CARTRIDGE_NAME}, ${MISSING_ID}.`,
    ]);
  });

  it('ENG13-INVENTORY-01: an empty inventory still yields the friendly nothing line', () => {
    expect(inventoryReply([], bundleWithItems([CARTRIDGE]))).toEqual([
      'You are carrying nothing.',
    ]);
  });

  it('ENG13-INVENTORY-01: the pickup batch carries no moved-between-owners debug message', () => {
    const bundle = bundleWithItems([CARTRIDGE]);

    const take: Command = { kind: 'take', itemId: CARTRIDGE_ID };
    const takeContext = contextFor([], bundle);
    const beforeTake = stateSnapshot(takeContext.state);
    const takeEffects = handlerFor(take)(take, takeContext);
    expect(
      stateSnapshot(takeContext.state),
      'take handler must not mutate state; the effect carries the transfer',
    ).toBe(beforeTake);

    const inventory: Command = { kind: 'inventory' };
    const inventoryEffects = handlerFor(inventory)(
      inventory,
      contextFor([CARTRIDGE_ID], bundle),
    );

    const batchMessages = [
      ...messagesOf(takeEffects),
      ...messagesOf(inventoryEffects),
    ];
    expect(batchMessages).not.toContain(DEBUG_LINE);
    expect(batchMessages.join('\n')).not.toContain('moved from');
    expect(batchMessages.join('\n')).not.toContain(BINARY_HALL);
  });

  it('ENG13-INVENTORY-01: formatEvent emits no line for the item-moved bookkeeping event', async () => {
    const formatEvent = await loadFormatEvent();
    const itemMoved: GameEvent = {
      type: 'item-moved',
      itemId: CARTRIDGE_ID,
      fromOwnerId: BINARY_HALL,
      toOwnerId: 'player',
    };

    const lines = formatEvent(itemMoved, bundleWithItems([CARTRIDGE]));
    expect(lines).toEqual([]);
    expect(lines.join('\n')).not.toContain(DEBUG_LINE);
  });
});
