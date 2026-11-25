// Verb-handler contracts from application-and-ui.md §5.1, §5.2 and §12:
// handlers return effects, never mutate state, and blocked actions stay quiet
// in state while emitting a friendly in-voice message.
import { describe, expect, it } from 'vitest';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { ItemDefinition } from '../../src/content/ItemDefinition';
import type { Command } from '../../src/core/commands/Command';
import type { Effect } from '../../src/core/effects/Effect';
import type { GameState, GameStateDto } from '../../src/core/GameState';
import {
  CHEST_ID,
  DOOR_ID,
  KEY_A,
  KEY_B,
  START_ROOM,
  loadVerbTable,
  makeParserBundle,
  makeParserState,
  makeTurnContext,
} from '../fixtures/parser';
import { catalogueOf } from '../fixtures/persistence';

function stateSnapshot(state: GameState): string {
  return JSON.stringify({
    player: state.player,
    flags: state.flags,
    rooms: state.rooms,
  });
}

function messageTexts(effects: readonly Effect[]): readonly string[] {
  return effects
    .filter(
      (effect): effect is Extract<Effect, { kind: 'message' }> =>
        effect.kind === 'message',
    )
    .map((effect) => effect.text);
}

function bareState(): GameState {
  const player = {
    position: {
      worldId: 'world-stub',
      areaId: 'area-stub',
      roomId: START_ROOM,
    },
    inventory: [],
    lives: 3,
  };
  const overrides: Partial<GameStateDto> = {
    player,
    rooms: { [START_ROOM]: { inventory: [] } },
    flags: {},
  };
  return makeParserState(overrides);
}

function permissiveState(): GameState {
  return makeParserState({
    flags: { [`door-unlocked:${DOOR_ID}`]: true },
  });
}

type FlagPrefix = 'door' | 'container';

// Unlocked but already open: the only unmet precondition is "target already
// open" (application-and-ui.md §5.1). Both the action flag and its unlock flag
// are set so no other reason can account for a blocked message.
function alreadyOpenState(targetId: string, prefix: FlagPrefix): GameState {
  return makeParserState({
    flags: {
      [`${prefix}-unlocked:${targetId}`]: true,
      [`${prefix}-open:${targetId}`]: true,
    },
  });
}

describe('verb handlers', () => {
  it('P-PARSE-18: a known verb dispatches to a handler that returns effects', async () => {
    const table = await loadVerbTable();
    const context = makeTurnContext();
    const command: Command = { kind: 'look' };
    const before = stateSnapshot(context.state);

    const handler = table.getCommandHandler(command);
    if (!handler) {
      throw new Error(
        'getCommandHandler must return a handler for look (application-and-ui.md §5.2)',
      );
    }
    const effects = handler(command, context);

    expect(effects.length).toBeGreaterThan(0);
    expect(effects.every((effect) => typeof effect.kind === 'string')).toBe(
      true,
    );
    expect(stateSnapshot(context.state)).toBe(before);
  });

  it('P-PARSE-19: door and container verbs set documented flags on success and leave state unchanged when blocked', async () => {
    const table = await loadVerbTable();
    const successCases: ReadonlyArray<{
      readonly command: Command;
      readonly expected: Effect;
    }> = [
      {
        command: { kind: 'open', targetId: DOOR_ID },
        expected: {
          kind: 'set-flag',
          flag: `door-open:${DOOR_ID}`,
          value: true,
        },
      },
      {
        command: { kind: 'close', targetId: DOOR_ID },
        expected: {
          kind: 'set-flag',
          flag: `door-open:${DOOR_ID}`,
          value: false,
        },
      },
      {
        command: {
          kind: 'unlock',
          itemId: KEY_A,
          targetId: DOOR_ID,
        },
        expected: {
          kind: 'set-flag',
          flag: `door-unlocked:${DOOR_ID}`,
          value: true,
        },
      },
      {
        command: { kind: 'put', itemId: KEY_A, targetId: CHEST_ID },
        expected: {
          kind: 'transfer-item',
          itemId: KEY_A,
          fromOwnerId: 'player',
          toOwnerId: CHEST_ID,
        },
      },
    ];

    for (const { command, expected } of successCases) {
      const state = permissiveState();
      const before = stateSnapshot(state);
      const handler = table.getCommandHandler(command);
      if (!handler) {
        throw new Error(
          `getCommandHandler must return a handler for ${command.kind} (application-and-ui.md §5.1)`,
        );
      }

      const effects = handler(command, makeTurnContext({ state }));

      expect(effects).toContainEqual(expected);
      expect(stateSnapshot(state)).toBe(before);
    }

    const blockedCommands: readonly Command[] = successCases.map(
      ({ command }) => command,
    );
    for (const command of blockedCommands) {
      const state = bareState();
      const before = stateSnapshot(state);
      const handler = table.getCommandHandler(command);
      if (!handler) {
        throw new Error(
          `getCommandHandler must return a handler for ${command.kind} (application-and-ui.md §5.1)`,
        );
      }

      const effects = handler(command, makeTurnContext({ state }));

      expect(
        effects.some(
          (effect) => effect.kind === 'message' && effect.text.trim() !== '',
        ),
      ).toBe(true);
      expect(effects.some((effect) => effect.kind === 'set-flag')).toBe(false);
      expect(stateSnapshot(state)).toBe(before);
    }

    const alreadyOpenCases: ReadonlyArray<{
      readonly command: Command;
      readonly targetId: string;
      readonly prefix: FlagPrefix;
    }> = [
      {
        command: { kind: 'open', targetId: DOOR_ID },
        targetId: DOOR_ID,
        prefix: 'door',
      },
      {
        command: { kind: 'open', targetId: CHEST_ID },
        targetId: CHEST_ID,
        prefix: 'container',
      },
    ];
    for (const { command, targetId, prefix } of alreadyOpenCases) {
      const state = alreadyOpenState(targetId, prefix);
      const before = stateSnapshot(state);
      const flag = `${prefix}-open:${targetId}`;
      const handler = table.getCommandHandler(command);
      if (!handler) {
        throw new Error(
          `getCommandHandler must return a handler for ${command.kind} (application-and-ui.md §5.1)`,
        );
      }

      const effects = handler(command, makeTurnContext({ state }));
      const texts = effects
        .filter(
          (effect): effect is Extract<Effect, { kind: 'message' }> =>
            effect.kind === 'message',
        )
        .map((effect) => effect.text);

      expect(
        texts.some((text) => /^it(?:'s| is) already open\.$/iu.test(text)),
      ).toBe(true);
      expect(effects.some((effect) => effect.kind === 'set-flag')).toBe(false);
      expect(state.flags[flag]).toBe(true);
      expect(stateSnapshot(state)).toBe(before);
    }
  });
});

// Ratified row P-TAKE-01: `portable` gates `take`, never `drop`. `refusalText`
// is not declared on ItemDefinition yet, so the authored text is attached at
// runtime to a plain ItemDefinition-shaped object. The suite therefore still
// compiles today and can only fail on the behavioural assertions below.
describe('P-TAKE-01: portable item handling', () => {
  const PLAQUE_ID = 'plaque-1';
  const PLAQUE_DESCRIPTION =
    'A brass plaque bolted to the wall, engraved with a spiral.';
  const FALLBACK_REFUSAL = 'You cannot take that item with you.';
  const AUTHORED_REFUSAL =
    'The plaque is bolted fast; you leave the spiral where it is.';

  function portabilityState(heldByPlayer: readonly string[] = []): GameState {
    return makeParserState({
      player: {
        position: {
          worldId: 'world-stub',
          areaId: 'area-stub',
          roomId: START_ROOM,
        },
        inventory: [...heldByPlayer],
        lives: 3,
      },
      rooms: {
        [START_ROOM]: {
          inventory: heldByPlayer.includes(KEY_B)
            ? [PLAQUE_ID]
            : [PLAQUE_ID, KEY_B],
        },
      },
      flags: {},
    });
  }

  function portabilityBundle(refusalText?: string): ContentBundle {
    const plaque: ItemDefinition = {
      id: PLAQUE_ID,
      name: 'Brass plaque',
      aliases: ['plaque'],
      portable: false,
      description: PLAQUE_DESCRIPTION,
      initialRoom: START_ROOM,
    };
    // Runtime attachment: no cast to a field that does not exist yet and no
    // `as any`. `catalogueOf` is generic, so the extra property is tolerated.
    const fixedItem =
      refusalText === undefined
        ? plaque
        : Object.assign(plaque, { refusalText });
    return {
      ...makeParserBundle(),
      items: catalogueOf([
        fixedItem,
        {
          id: KEY_B,
          name: 'Silver key',
          aliases: ['silver key'],
          portable: true,
          description: 'A small silver key.',
          initialRoom: START_ROOM,
        },
      ]),
    };
  }

  it('P-TAKE-01: non-portable take without authored refusalText emits the exact fallback, no transfer and unchanged state, and the item remains examinable', async () => {
    const table = await loadVerbTable();
    const state = portabilityState();
    const bundle = portabilityBundle();
    const before = stateSnapshot(state);
    const command: Command = { kind: 'take', itemId: PLAQUE_ID };
    const handler = table.getCommandHandler(command);
    if (!handler) {
      throw new Error(
        'getCommandHandler must return a handler for take (application-and-ui.md §5.2)',
      );
    }

    const effects = handler(command, makeTurnContext({ state, bundle }));

    expect(messageTexts(effects)).toEqual([FALLBACK_REFUSAL]);
    expect(effects.filter((effect) => effect.kind === 'message')).toHaveLength(
      1,
    );
    expect(effects.some((effect) => effect.kind === 'transfer-item')).toBe(
      false,
    );
    expect(stateSnapshot(state)).toBe(before);
    expect(state.rooms[START_ROOM]?.inventory).toContain(PLAQUE_ID);
    expect(state.player.inventory).not.toContain(PLAQUE_ID);

    // `look at` is an alias of `examine` (§5.2), so the same handler covers it.
    const examine: Command = { kind: 'examine', targetId: PLAQUE_ID };
    const examineHandler = table.getCommandHandler(examine);
    if (!examineHandler) {
      throw new Error(
        'getCommandHandler must return a handler for examine (application-and-ui.md §5.2)',
      );
    }
    const examineEffects = examineHandler(
      examine,
      makeTurnContext({ state, bundle }),
    );
    expect(messageTexts(examineEffects)).toEqual([PLAQUE_DESCRIPTION]);
  });

  it('P-TAKE-01: non-portable take with authored refusalText emits that exact text, not the fallback, with no transfer and unchanged state', async () => {
    const table = await loadVerbTable();
    const state = portabilityState();
    const bundle = portabilityBundle(AUTHORED_REFUSAL);
    const before = stateSnapshot(state);
    const command: Command = { kind: 'take', itemId: PLAQUE_ID };
    const handler = table.getCommandHandler(command);
    if (!handler) {
      throw new Error(
        'getCommandHandler must return a handler for take (application-and-ui.md §5.2)',
      );
    }

    const effects = handler(command, makeTurnContext({ state, bundle }));

    expect(messageTexts(effects)).toEqual([AUTHORED_REFUSAL]);
    expect(effects.filter((effect) => effect.kind === 'message')).toHaveLength(
      1,
    );
    expect(effects.some((effect) => effect.kind === 'transfer-item')).toBe(
      false,
    );
    expect(stateSnapshot(state)).toBe(before);
    expect(state.rooms[START_ROOM]?.inventory).toContain(PLAQUE_ID);
    expect(state.player.inventory).not.toContain(PLAQUE_ID);
  });

  it('P-TAKE-01: an empty authored refusalText is treated as absent and uses the exact fallback, with no transfer and unchanged state', async () => {
    const table = await loadVerbTable();
    const state = portabilityState();
    // '' is an authored value, so the runtime attachment must receive it
    // rather than omit the property (user decision of 2026-11-25).
    const bundle = portabilityBundle('');
    const before = stateSnapshot(state);
    const command: Command = { kind: 'take', itemId: PLAQUE_ID };
    const handler = table.getCommandHandler(command);
    if (!handler) {
      throw new Error(
        'getCommandHandler must return a handler for take (application-and-ui.md §5.2)',
      );
    }

    const effects = handler(command, makeTurnContext({ state, bundle }));

    expect(messageTexts(effects)).toEqual([FALLBACK_REFUSAL]);
    expect(effects.filter((effect) => effect.kind === 'message')).toHaveLength(
      1,
    );
    expect(effects.some((effect) => effect.kind === 'transfer-item')).toBe(
      false,
    );
    expect(stateSnapshot(state)).toBe(before);
    expect(state.rooms[START_ROOM]?.inventory).toContain(PLAQUE_ID);
    expect(state.player.inventory).not.toContain(PLAQUE_ID);
  });

  it('P-TAKE-01: portable take transfers room -> player and emits "Taken."', async () => {
    const table = await loadVerbTable();
    const state = portabilityState();
    const bundle = portabilityBundle();
    const before = stateSnapshot(state);
    const command: Command = { kind: 'take', itemId: KEY_B };
    const handler = table.getCommandHandler(command);
    if (!handler) {
      throw new Error(
        'getCommandHandler must return a handler for take (application-and-ui.md §5.2)',
      );
    }

    const effects = handler(command, makeTurnContext({ state, bundle }));

    expect(effects).toEqual([
      {
        kind: 'transfer-item',
        itemId: KEY_B,
        fromOwnerId: START_ROOM,
        toOwnerId: 'player',
      },
      { kind: 'message', text: 'Taken.' },
    ]);
    expect(stateSnapshot(state)).toBe(before);
  });

  it('P-TAKE-01: drop shares takeHandler but has no portability gate — transfer player -> room and emit "Dropped."', async () => {
    const table = await loadVerbTable();
    const state = portabilityState([KEY_B]);
    const bundle = portabilityBundle();
    const before = stateSnapshot(state);
    const command: Command = { kind: 'drop', itemId: KEY_B };
    const handler = table.getCommandHandler(command);
    if (!handler) {
      throw new Error(
        'getCommandHandler must return a handler for drop (application-and-ui.md §5.2)',
      );
    }

    const effects = handler(command, makeTurnContext({ state, bundle }));

    expect(effects).toEqual([
      {
        kind: 'transfer-item',
        itemId: KEY_B,
        fromOwnerId: 'player',
        toOwnerId: START_ROOM,
      },
      { kind: 'message', text: 'Dropped.' },
    ]);
    expect(stateSnapshot(state)).toBe(before);
  });
});
