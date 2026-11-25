// Red tests for phase-3 conversation flow and phase-4 NPC reactions
// (npcs.md §4, §7, §8, §9; application-and-ui.md §6, §8; shared-rules.md §2, §3;
// user decisions GAP-01..04 and GAP-11). Every collaborator is an in-memory
// fake; the missing NPC factories fail through named assertions.
import { describe, expect, it } from 'vitest';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { Command } from '../../src/core/commands/Command';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { GameState } from '../../src/core/GameState';
import { loadGame } from '../fixtures/persistence';
import type { DialogueSystemContract } from '../fixtures/npcs';
import {
  ACTOR_ID,
  actorState,
  defaultTopic,
  dialogueSystemFor,
  eventTypes,
  FLAG_TOPIC_ID,
  GIVE_TOPIC_ID,
  GREETING,
  ITEM_ID,
  NODE_ID,
  node,
  npcBundle,
  npcContext,
  npcDto,
  npcGameDependencies,
  npcState,
  READY,
  RING_TOPIC_ID,
  SHOW_TOPIC_ID,
  spokenTexts,
  TALKING,
  topic,
  WHY_TOPIC_ID,
} from '../fixtures/npcs';

const NORTH_ROOM = 'room-stub-north';

async function submit(
  command: Command,
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

function leftRoomEvent(): GameEvent {
  return {
    type: 'room-entered',
    room: {
      id: NORTH_ROOM,
      title: 'North Room',
      description: '',
      exits: [],
    },
  };
}

function asks(text: string): Command {
  return { kind: 'ask', actorId: ACTOR_ID, topic: text };
}

describe('conversation flow (npcs.md §4)', () => {
  it('NPC-FLOW-01: talk-to starts the conversation, applies the ready greeting, switches state and shows the panel', async () => {
    const bundle = npcBundle({
      states: [
        actorState(READY, {
          onEnter: [{ kind: 'message', text: GREETING }],
        }),
        actorState(TALKING),
      ],
    });
    const { events, game, state } = await submit(
      { kind: 'talk-to', actorId: ACTOR_ID },
      { bundle },
    );

    expect(events).toContainEqual({
      type: 'conversation-started',
      actorId: ACTOR_ID,
    });
    expect(eventTypes(events)).toContain('message');
    expect(JSON.stringify(events)).toContain(GREETING);
    expect(events).toContainEqual({
      type: 'actor-state-changed',
      actorId: ACTOR_ID,
      stateId: TALKING,
    });
    expect(state.npcs[ACTOR_ID]?.stateId).toBe(TALKING);
    expect(game.getViewData().conversation?.actorId).toBe(ACTOR_ID);
  });

  it('NPC-FLOW-02: ask, give and show each implicitly start the conversation on the talk-to path', async () => {
    const commands: readonly Command[] = [
      asks(ITEM_ID),
      { kind: 'give', actorId: ACTOR_ID, itemId: ITEM_ID },
      { kind: 'show', actorId: ACTOR_ID, itemId: ITEM_ID },
    ];
    for (const command of commands) {
      const { events, game } = await submit(command);
      expect(events).toContainEqual({
        type: 'conversation-started',
        actorId: ACTOR_ID,
      });
      expect(game.getViewData().conversation?.actorId).toBe(ACTOR_ID);
    }
  });

  it('NPC-FLOW-03: node topics beat state topics and defaults, and every candidate is isActive-gated', async () => {
    const nodeTopic = topic({
      id: WHY_TOPIC_ID,
      match: { kind: 'special', keywords: ['why'] },
      responses: ['NODE REPLY'],
    });
    const stateTopic = topic({
      id: 'state-why',
      match: { kind: 'command', keywords: ['why'] },
      responses: ['STATE REPLY'],
    });
    const bundle = npcBundle({
      topics: [nodeTopic, stateTopic, defaultTopic()],
      nodes: [node({ topics: [nodeTopic] })],
    });
    const activeState = npcState({
      npcs: { [ACTOR_ID]: npcDto({ stateId: TALKING, activeNodeId: NODE_ID }) },
    });
    const first = await submit(asks('why'), { bundle, state: activeState });
    expect(spokenTexts(first.events)).toContain('NODE REPLY');

    const inactiveNodeTopic = topic({
      ...nodeTopic,
      isActive: { kind: 'flag-set', flag: 'not-set' },
    });
    const gatedBundle = npcBundle({
      topics: [inactiveNodeTopic, stateTopic, defaultTopic()],
      nodes: [node({ topics: [inactiveNodeTopic] })],
    });
    const second = await submit(asks('why'), {
      bundle: gatedBundle,
      state: activeState,
    });
    expect(spokenTexts(second.events)).not.toContain('NODE REPLY');
    expect(spokenTexts(second.events)).toContain('STATE REPLY');
  });

  it('NPC-FLOW-04: a matched topic returns its response, prompt and effects to the turn buffer', async () => {
    const bundle = npcBundle({
      topics: [
        topic({
          id: FLAG_TOPIC_ID,
          responses: ['The guide explains binary.'],
          prompt: '(You could ask why.)',
          effects: [
            { kind: 'set-flag', flag: 'explained-binary', value: true },
          ],
        }),
      ],
    });

    const { events, state } = await submit(asks(ITEM_ID), {
      bundle,
      state: npcState({ npcs: { [ACTOR_ID]: npcDto({ stateId: TALKING }) } }),
    });

    expect(events).toContainEqual({
      type: 'npc-spoke',
      actorId: ACTOR_ID,
      text: 'The guide explains binary.',
    });
    expect(events).toContainEqual({
      type: 'topic-suggested',
      actorId: ACTOR_ID,
      text: '(You could ask why.)',
    });
    expect(events).toContainEqual({
      type: 'flag-changed',
      flag: 'explained-binary',
      value: true,
    });
    expect(state.flags['explained-binary']).toBe(true);
  });

  it('NPC-FLOW-05: bye ends the conversation, restores ready and hides the panel', async () => {
    const state = npcState({
      npcs: { [ACTOR_ID]: npcDto({ stateId: TALKING }) },
    });
    const { events, game } = await submit({ kind: 'bye' }, { state });

    expect(events).toContainEqual({
      type: 'conversation-ended',
      actorId: ACTOR_ID,
      reason: expect.any(String),
    });
    expect(events).toContainEqual({
      type: 'actor-state-changed',
      actorId: ACTOR_ID,
      stateId: READY,
    });
    expect(state.npcs[ACTOR_ID]?.stateId).toBe(READY);
    expect(game.getViewData().conversation).toBeUndefined();
  });

  it('NPC-FLOW-06: leaving the room ends the conversation in phase 4', async () => {
    const bundle = npcBundle();
    const state = npcState({
      npcs: {
        [ACTOR_ID]: npcDto({ stateId: TALKING, activeNodeId: NODE_ID }),
      },
    });
    const system: DialogueSystemContract = await dialogueSystemFor(
      bundle,
      state,
    );

    const events = system.react(
      npcContext(state, {
        bundle,
        command: { kind: 'go', direction: 'north' },
      }),
      [leftRoomEvent()],
    );

    expect(eventTypes(events)).toContain('conversation-ended');
    expect(eventTypes(events)).toContain('node-exited');
    expect(state.npcs[ACTOR_ID]?.stateId).toBe(READY);
    expect(state.npcs[ACTOR_ID]).not.toHaveProperty('activeNodeId');
  });

  it('NPC-FLOW-07: passing turns without a conversational command emits no farewell', async () => {
    const bundle = npcBundle();
    const state = npcState({
      npcs: { [ACTOR_ID]: npcDto({ stateId: TALKING }) },
    });
    const system: DialogueSystemContract = await dialogueSystemFor(
      bundle,
      state,
    );
    const ordinary: readonly GameEvent[] = [
      { type: 'message', text: 'You wait.' },
      { type: 'message', text: 'You wait again.' },
    ];

    const events = system.react(
      npcContext(state, { bundle, command: { kind: 'look' } }),
      ordinary,
    );

    expect(eventTypes(events)).not.toContain('conversation-ended');
    expect(state.npcs[ACTOR_ID]?.stateId).toBe(TALKING);
  });

  it('NPC-FLOW-08: npc-knows hides a topic until learn-topic adds it, with knowledge-gained emitted', async () => {
    const learned = topic({
      id: RING_TOPIC_ID,
      isActive: {
        kind: 'npc-knows',
        actorId: ACTOR_ID,
        topicId: RING_TOPIC_ID,
      },
      responses: ['THE RING'],
    });
    const teacher = topic({
      id: 'teacher',
      responses: ['Listen carefully.'],
      effects: [
        { kind: 'learn-topic', actorId: ACTOR_ID, topicId: RING_TOPIC_ID },
      ],
    });
    const bundle = npcBundle({ topics: [learned, teacher, defaultTopic()] });
    const before = npcState({
      npcs: { [ACTOR_ID]: npcDto({ stateId: TALKING }) },
    });
    const after = npcState({
      npcs: {
        [ACTOR_ID]: npcDto({ stateId: TALKING, knownTopics: [RING_TOPIC_ID] }),
      },
    });

    const first = await submit(asks(ITEM_ID), { bundle, state: before });
    expect(spokenTexts(first.events)).not.toContain('THE RING');
    expect(first.events).toContainEqual({
      type: 'knowledge-gained',
      actorId: ACTOR_ID,
      topicId: RING_TOPIC_ID,
    });
    expect(first.state.npcs[ACTOR_ID]?.knownTopics).toContain(RING_TOPIC_ID);

    const second = await submit(asks(ITEM_ID), { bundle, state: after });
    expect(spokenTexts(second.events)).toContain('THE RING');
  });

  it('NPC-FLOW-09: the negated alternative topic is selected when the player already holds the item', async () => {
    const secret = topic({
      id: 'secret',
      isActive: {
        kind: 'npc-knows',
        actorId: ACTOR_ID,
        topicId: RING_TOPIC_ID,
      },
      responses: ['SECRET REPLY'],
    });
    const alternative = topic({
      id: 'alternative',
      isActive: {
        kind: 'not',
        of: { kind: 'npc-knows', actorId: ACTOR_ID, topicId: RING_TOPIC_ID },
      },
      responses: ['ALTERNATIVE REPLY'],
    });
    const bundle = npcBundle({
      topics: [secret, alternative, defaultTopic()],
    });

    const { events } = await submit(asks(ITEM_ID), {
      bundle,
      state: npcState({ npcs: { [ACTOR_ID]: npcDto({ stateId: TALKING }) } }),
    });

    expect(spokenTexts(events)).toContain('ALTERNATIVE REPLY');
    expect(spokenTexts(events)).not.toContain('SECRET REPLY');
  });

  it('NPC-FLOW-10: in-room scope on default and catch-all topics is evaluated against the current position', async () => {
    const scoped = topic({
      id: 'scoped',
      isActive: { kind: 'in-room', roomId: 'room-stub-start' },
      responses: ['SCOPED REPLY'],
    });
    const defaultScoped = defaultTopic();
    const bundle = npcBundle({
      topics: [
        scoped,
        {
          ...defaultScoped,
          isActive: { kind: 'in-room', roomId: 'room-stub-start' },
        },
      ],
    });
    const inRoom = npcState({
      npcs: { [ACTOR_ID]: npcDto({ stateId: TALKING }) },
    });
    const outOfRoom = npcState({
      player: {
        position: {
          worldId: 'world-stub',
          areaId: 'area-stub',
          roomId: NORTH_ROOM,
        },
        inventory: [ITEM_ID],
        lives: 3,
      },
      npcs: { [ACTOR_ID]: npcDto({ stateId: TALKING }) },
    });

    const inRoomReply = await submit(asks(ITEM_ID), { bundle, state: inRoom });
    const outOfRoomReply = await submit(asks(ITEM_ID), {
      bundle,
      state: outOfRoom,
    });
    expect(spokenTexts(inRoomReply.events)).toContain('SCOPED REPLY');
    expect(spokenTexts(outOfRoomReply.events)).not.toContain('SCOPED REPLY');
  });

  it('NPC-FLOW-11: give transfers the held item from player to actor atomically', async () => {
    const gift = topic({
      id: GIVE_TOPIC_ID,
      match: { kind: 'give', itemIds: [ITEM_ID] },
      responses: ['Thank you.'],
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

    const { events } = await submit(
      { kind: 'give', actorId: ACTOR_ID, itemId: ITEM_ID },
      { bundle, state },
    );

    expect(events).toContainEqual({
      type: 'item-moved',
      itemId: ITEM_ID,
      fromOwnerId: 'player',
      toOwnerId: ACTOR_ID,
    });
    expect(state.player.inventory).not.toContain(ITEM_ID);
    expect(state.npcs[ACTOR_ID]?.inventory).toContain(ITEM_ID);
  });

  it('NPC-FLOW-12: show uses the same transfer-item path and emits item-moved', async () => {
    const shown = topic({
      id: SHOW_TOPIC_ID,
      match: { kind: 'show', itemIds: [ITEM_ID] },
      responses: ['An interesting lamp.'],
      effects: [
        {
          kind: 'transfer-item',
          itemId: ITEM_ID,
          fromOwnerId: 'player',
          toOwnerId: ACTOR_ID,
        },
      ],
    });
    const bundle = npcBundle({ topics: [shown, defaultTopic()] });
    const state = npcState({
      npcs: { [ACTOR_ID]: npcDto({ stateId: TALKING }) },
    });

    const { events } = await submit(
      { kind: 'show', actorId: ACTOR_ID, itemId: ITEM_ID },
      { bundle, state },
    );

    expect(events).toContainEqual({
      type: 'item-moved',
      itemId: ITEM_ID,
      fromOwnerId: 'player',
      toOwnerId: ACTOR_ID,
    });
    expect(state.player.inventory).not.toContain(ITEM_ID);
    expect(state.npcs[ACTOR_ID]?.inventory).toContain(ITEM_ID);
  });

  it('NPC-FLOW-13: set-actor-state semantics emit actor-state-changed on start and end', async () => {
    const state = npcState({
      npcs: { [ACTOR_ID]: npcDto({ stateId: READY }) },
    });
    const game = await loadGame(
      npcGameDependencies({
        bundle: npcBundle(),
        state,
        command: { kind: 'talk-to', actorId: ACTOR_ID },
        resolve: (raw: string): Command =>
          raw === 'bye'
            ? { kind: 'bye' }
            : { kind: 'talk-to', actorId: ACTOR_ID },
      }),
    );

    const startEvents = game.submit('talk guide');
    const endEvents = game.submit('bye');

    expect(startEvents).toContainEqual({
      type: 'actor-state-changed',
      actorId: ACTOR_ID,
      stateId: TALKING,
    });
    expect(endEvents).toContainEqual({
      type: 'actor-state-changed',
      actorId: ACTOR_ID,
      stateId: READY,
    });
  });
});
