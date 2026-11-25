// Verb-handler contracts from application-and-ui.md §5.1, §5.2 and §12:
// handlers return effects, never mutate state, and blocked actions stay quiet
// in state while emitting a friendly in-voice message.
import { describe, expect, it } from 'vitest';
import type { Command } from '../../src/core/commands/Command';
import type { Effect } from '../../src/core/effects/Effect';
import type { GameState, GameStateDto } from '../../src/core/GameState';
import {
  CHEST_ID,
  DOOR_ID,
  KEY_A,
  START_ROOM,
  loadVerbTable,
  makeParserState,
  makeTurnContext,
} from '../fixtures/parser';

function stateSnapshot(state: GameState): string {
  return JSON.stringify({
    player: state.player,
    flags: state.flags,
    rooms: state.rooms,
  });
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
