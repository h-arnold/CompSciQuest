// Red tests for the NPC decisions settled on 2026-11-25 (branch-matrix GAP-01,
// GAP-02, GAP-03, GAP-04 and GAP-11). These split out of the flow file to keep
// both test files inside the 600-line limit. Every collaborator is a fake.
import { describe, expect, it } from 'vitest';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { GameState } from '../../src/core/GameState';
import { loadGame } from '../fixtures/persistence';
import {
  ACTOR_ID,
  actorState,
  defaultTopic,
  eventTypes,
  GREETING,
  ITEM_ID,
  npcBundle,
  npcDto,
  npcGameDependencies,
  npcState,
  READY,
  submitNpc,
  TALKING,
} from '../fixtures/npcs';

async function submit(
  command: Parameters<typeof submitNpc>[0],
  options: { readonly bundle?: ContentBundle; readonly state?: GameState } = {},
) {
  const state =
    options.state ??
    npcState({ npcs: { [ACTOR_ID]: npcDto({ stateId: READY }) } });
  const game = await loadGame(
    npcGameDependencies({
      bundle: options.bundle ?? npcBundle(),
      state,
      command,
    }),
  );
  return { events: game.submit('npc command'), game, state };
}

describe('conversation flow decisions (user rulings)', () => {
  it('NPC-GAP-01: tell with no active conversation starts one exactly like ask', async () => {
    const { events, game } = await submit(
      { kind: 'tell', actorId: ACTOR_ID, topic: ITEM_ID },
      {
        bundle: npcBundle({ topics: [defaultTopic()] }),
        state: npcState({
          npcs: { [ACTOR_ID]: npcDto({ stateId: READY }) },
        }),
      },
    );

    expect(events).toContainEqual({
      type: 'conversation-started',
      actorId: ACTOR_ID,
    });
    expect(game.getViewData().conversation?.actorId).toBe(ACTOR_ID);
  });

  it('NPC-GAP-02: bye outside a conversation gives a friendly message with no other events and unchanged state', async () => {
    const state = npcState({
      npcs: { [ACTOR_ID]: npcDto({ stateId: READY }) },
    });
    const before = JSON.stringify({
      npcs: state.npcs,
      flags: state.flags,
      inventory: state.player.inventory,
    });

    const { events } = await submit({ kind: 'bye' }, { state });

    expect(events).toEqual([
      { type: 'message', text: 'You are not in a conversation.' },
    ]);
    expect(
      JSON.stringify({
        npcs: state.npcs,
        flags: state.flags,
        inventory: state.player.inventory,
      }),
    ).toBe(before);
  });

  it('NPC-GAP-03: a second conversational command is an ordinary topic with no repeated greeting', async () => {
    const bundle = npcBundle({
      states: [
        actorState(READY, {
          onEnter: [{ kind: 'message', text: GREETING }],
        }),
        actorState(TALKING),
      ],
      topics: [defaultTopic()],
    });
    const state = npcState({
      npcs: { [ACTOR_ID]: npcDto({ stateId: READY }) },
    });
    const game = await loadGame(
      npcGameDependencies({
        bundle,
        state,
        command: { kind: 'talk-to', actorId: ACTOR_ID },
      }),
    );
    const busEvents: readonly GameEvent[] = [
      ...game.submit('talk guide'),
      ...game.submit('ask guide ring'),
    ];

    expect(
      busEvents.filter((event) => event.type === 'conversation-started'),
    ).toHaveLength(1);
    expect(JSON.stringify(busEvents).split(GREETING)).toHaveLength(2);
  });

  it('NPC-GAP-04: the old state onExit effects run in declaration order before actor-state-changed', async () => {
    const bundle = npcBundle({
      states: [
        actorState(READY),
        actorState(TALKING, {
          onExit: [
            { kind: 'message', text: 'The guide stands up.' },
            { kind: 'set-flag', flag: 'guide-dismissed', value: true },
          ],
        }),
      ],
    });
    const state = npcState({
      npcs: { [ACTOR_ID]: npcDto({ stateId: TALKING }) },
    });

    const { events } = await submit({ kind: 'bye' }, { bundle, state });
    const types = eventTypes(events);

    expect(JSON.stringify(events)).toContain('The guide stands up.');
    expect(types.indexOf('flag-changed')).toBeLessThan(
      types.indexOf('actor-state-changed'),
    );
    expect(events).toContainEqual({
      type: 'flag-changed',
      flag: 'guide-dismissed',
      value: true,
    });
  });

  it('NPC-GAP-11: give or show without the item gives a friendly message with no events and unchanged state', async () => {
    const state = npcState({
      player: {
        position: {
          worldId: 'world-stub',
          areaId: 'area-stub',
          roomId: 'room-stub-start',
        },
        inventory: [],
        lives: 3,
      },
      npcs: { [ACTOR_ID]: npcDto({ stateId: TALKING }) },
    });
    const before = JSON.stringify({
      npcs: state.npcs,
      inventory: state.player.inventory,
    });

    for (const command of [
      { kind: 'give', actorId: ACTOR_ID, itemId: ITEM_ID },
      { kind: 'show', actorId: ACTOR_ID, itemId: ITEM_ID },
    ] as const) {
      const { events } = await submit(command, { state });
      expect(events).toEqual([
        { type: 'message', text: 'You do not have that.' },
      ]);
      expect(
        JSON.stringify({ npcs: state.npcs, inventory: state.player.inventory }),
      ).toBe(before);
    }
  });
});
