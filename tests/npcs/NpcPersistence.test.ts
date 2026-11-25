// Red tests for NPC persistence (npcs.md §7, §8; storage-schema.md §3.2, §3.3,
// §7; application-and-ui.md §4.1; user decisions GAP-08 and GAP-10). All
// storage and clocks are injected in-memory fakes; no real browser storage or
// wall clock is touched.
import { describe, expect, it } from 'vitest';
import type { GameState } from '../../src/core/GameState';
import {
  FixedClock,
  loadSaveManager,
  makeEnvelope,
  MemoryStorage,
  RecordingBus,
  roundTripThroughJson,
  SAVE_KEY,
} from '../fixtures/persistence';
import {
  ACTOR_ID,
  askRing,
  defaultTopic,
  DEFAULT_REPLY,
  ITEM_ID,
  loadGame,
  NODE_ID,
  npcBundle,
  npcDto,
  npcGameDependencies,
  npcState,
  RING_TOPIC_ID,
  submitNpc,
  talkToGuide,
  TALKING,
  topic,
} from '../fixtures/npcs';

describe('NPC persistence (npcs.md §8)', () => {
  it('NPC-PERSIST-01: every NpcStateDto field survives JSON save/load and the active node still drives replies', async () => {
    const bundle = npcBundle({
      topics: [defaultTopic('The node is still open.')],
    });
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
      npcs: {
        [ACTOR_ID]: npcDto({
          stateId: TALKING,
          knownTopics: [RING_TOPIC_ID],
          inventory: [ITEM_ID],
          activeNodeId: NODE_ID,
          topicUses: { [RING_TOPIC_ID]: 2 },
        }),
      },
    });
    const storage = new MemoryStorage();
    const manager = await loadSaveManager({
      storage,
      clock: new FixedClock(),
      bundle,
    });
    manager.save(state);
    const loaded = manager.load();
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) return;
    const restored = manager.restore(loaded.dto);

    expect(restored.npcs[ACTOR_ID]).toEqual(state.npcs[ACTOR_ID]);
    expect(restored.npcs[ACTOR_ID]).toHaveProperty('activeNodeId', NODE_ID);
    const npcJson = JSON.stringify(restored.npcs);
    expect(npcJson).not.toContain('score');

    const withoutNode = manager.restore(
      makeEnvelope({
        ...state,
        npcs: { [ACTOR_ID]: npcDto({ stateId: TALKING }) },
      }),
    );
    expect(withoutNode.npcs[ACTOR_ID]).not.toHaveProperty('activeNodeId');

    const { events } = await submitNpc(askRing, { bundle, state: restored });
    expect(
      events.flatMap((event) =>
        event.type === 'npc-spoke' ? [event.text] : [],
      ),
    ).toContain('The node is still open.');
  });

  it('NPC-PERSIST-02: an item given to an actor stays in exactly one owner list after restore', async () => {
    const gift = topic({
      effects: [
        {
          kind: 'transfer-item',
          itemId: ITEM_ID,
          fromOwnerId: 'player',
          toOwnerId: ACTOR_ID,
        },
      ],
    });
    const bundle = npcBundle({ topics: [gift, defaultTopic()] });
    const state = npcState({
      npcs: { [ACTOR_ID]: npcDto({ stateId: TALKING }) },
    });
    await submitNpc(
      { kind: 'give', actorId: ACTOR_ID, itemId: ITEM_ID },
      { bundle, state },
    );

    const storage = new MemoryStorage();
    const manager = await loadSaveManager({
      storage,
      clock: new FixedClock(),
      bundle,
    });
    manager.save(state);
    const loaded = manager.load();
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) return;
    const restored = manager.restore(loaded.dto);

    const owners = [
      restored.player.inventory,
      restored.npcs[ACTOR_ID]?.inventory ?? [],
      ...Object.values(restored.rooms).map((room) => room.inventory),
    ].flat();
    expect(owners.filter((id) => id === ITEM_ID)).toHaveLength(1);
    expect(restored.npcs[ACTOR_ID]?.inventory).toContain(ITEM_ID);
  });

  it('NPC-PERSIST-03: empty actor records round-trip and no topic passes npc-knows until learn-topic fires', async () => {
    const bundle = npcBundle({
      topics: [
        topic({
          id: RING_TOPIC_ID,
          isActive: {
            kind: 'npc-knows',
            actorId: ACTOR_ID,
            topicId: RING_TOPIC_ID,
          },
          responses: ['SECRET'],
        }),
        defaultTopic(DEFAULT_REPLY),
      ],
    });
    const state = npcState({
      npcs: {
        [ACTOR_ID]: npcDto({
          stateId: TALKING,
          knownTopics: [],
          inventory: [],
          topicUses: {},
        }),
      },
    });
    const restored = roundTripThroughJson(state) as GameState;

    expect(restored.npcs[ACTOR_ID]?.knownTopics).toEqual([]);
    expect(restored.npcs[ACTOR_ID]?.inventory).toEqual([]);
    expect(restored.npcs[ACTOR_ID]?.topicUses).toEqual({});
    expect(restored.npcs[ACTOR_ID]).not.toHaveProperty('activeNodeId');

    const { events } = await submitNpc(askRing, {
      bundle,
      state: restored,
    });
    const spoken = events.flatMap((event) =>
      event.type === 'npc-spoke' ? [event.text] : [],
    );
    expect(spoken).not.toContain('SECRET');
    expect(spoken).toContain(DEFAULT_REPLY);
  });

  it('NPC-GAP-08: topicUses increments on each successful match and survives conversations and saves', async () => {
    const bundle = npcBundle({ topics: [topic(), defaultTopic()] });
    const state = npcState({
      npcs: { [ACTOR_ID]: npcDto({ stateId: TALKING }) },
    });

    await submitNpc(talkToGuide, { bundle, state });
    await submitNpc(askRing, { bundle, state });
    await submitNpc({ kind: 'bye' }, { bundle, state });
    await submitNpc(talkToGuide, { bundle, state });
    await submitNpc(askRing, { bundle, state });

    expect(state.npcs[ACTOR_ID]?.topicUses[RING_TOPIC_ID]).toBe(2);

    const storage = new MemoryStorage();
    const manager = await loadSaveManager({
      storage,
      clock: new FixedClock(),
      bundle,
    });
    manager.save(state);
    const loaded = manager.load();
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) return;
    expect(manager.restore(loaded.dto).npcs[ACTOR_ID]?.topicUses).toEqual({
      [RING_TOPIC_ID]: 2,
    });
    expect(storage.read(SAVE_KEY)).not.toBeNull();
  });

  it('NPC-GAP-10: restoring a talking actor shows the panel from view data and emits no conversation-started', async () => {
    const state = npcState({
      npcs: { [ACTOR_ID]: npcDto({ stateId: TALKING }) },
    });
    const bus = new RecordingBus();
    const game = await loadGame({
      ...npcGameDependencies({
        bundle: npcBundle(),
        state,
        command: talkToGuide,
      }),
      bus,
    });

    game.continueGame(makeEnvelope(state));

    expect(game.getViewData().conversation?.actorId).toBe(ACTOR_ID);
    expect(bus.events).not.toContainEqual({
      type: 'conversation-started',
      actorId: ACTOR_ID,
    });
  });
});
