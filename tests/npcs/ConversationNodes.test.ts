// Red tests for ConvNode behaviour (npcs.md §2, §5, §8; shared-rules.md §5;
// application-and-ui.md §9; user decision GAP-05). Node effects are applied
// only through injected fakes; no implementation file is edited here.
import { describe, expect, it } from 'vitest';
import type { Command } from '../../src/core/commands/Command';
import type { GameEvent } from '../../src/core/events/GameEvent';
import {
  ACTOR_ID,
  defaultTopic,
  DEFAULT_REPLY,
  eventTypes,
  NODE_ID,
  node,
  npcBundle,
  npcDto,
  npcState,
  submitNpc,
  TALKING,
  topic,
  WHY_TOPIC_ID,
} from '../fixtures/npcs';

function asks(text: string): Command {
  return { kind: 'ask', actorId: ACTOR_ID, topic: text };
}

function activeState() {
  return npcState({
    npcs: {
      [ACTOR_ID]: npcDto({
        stateId: TALKING,
        activeNodeId: NODE_ID,
      }),
    },
  });
}

function spoken(events: readonly GameEvent[]): string[] {
  return events.flatMap((event) =>
    event.type === 'npc-spoke' ? [event.text] : [],
  );
}

describe('conversation nodes (npcs.md §5)', () => {
  it('NPC-NODE-01: enter-node sets the active node, emits node-entered and applies onEnterEffects in order', async () => {
    const enterTopic = topic({
      id: 'topic-enter',
      responses: ['Listen carefully.'],
      effects: [{ kind: 'enter-node', actorId: ACTOR_ID, nodeId: NODE_ID }],
    });
    const bundle = npcBundle({
      topics: [enterTopic, defaultTopic()],
      nodes: [
        node({
          onEnterEffects: [
            { kind: 'message', text: 'A hush falls.' },
            { kind: 'set-flag', flag: 'node-opened', value: true },
          ],
        }),
      ],
    });

    const { events, state } = await submitNpc(asks('listen'), {
      bundle,
      state: activeState(),
    });
    const types = eventTypes(events);

    expect(state.npcs[ACTOR_ID]?.activeNodeId).toBe(NODE_ID);
    expect(events).toContainEqual({
      type: 'node-entered',
      actorId: ACTOR_ID,
      nodeId: NODE_ID,
    });
    expect(JSON.stringify(events)).toContain('A hush falls.');
    expect(types.indexOf('message')).toBeLessThan(
      types.indexOf('flag-changed'),
    );
    expect(types.indexOf('node-entered')).toBeLessThan(
      types.indexOf('flag-changed'),
    );
  });

  it('NPC-NODE-02: the node default topic catches unmatched input and keeps the node open', async () => {
    const bundle = npcBundle({
      topics: [defaultTopic('Please answer the question.')],
      nodes: [node({ defaultTopicId: 'default-ask-tell' })],
    });

    const { events, state } = await submitNpc(asks('something else'), {
      bundle,
      state: activeState(),
    });

    expect(spoken(events)).toContain('Please answer the question.');
    expect(state.npcs[ACTOR_ID]?.activeNodeId).toBe(NODE_ID);
  });

  it('NPC-NODE-03: a matching special keyword exits the node and emits node-exited', async () => {
    const special = topic({
      id: WHY_TOPIC_ID,
      match: { kind: 'special', keywords: ['why'] },
      responses: ['Because binary matters.'],
    });
    const bundle = npcBundle({
      topics: [special, defaultTopic()],
      nodes: [node({ topics: [special] })],
    });

    const { events, state } = await submitNpc(asks('why'), {
      bundle,
      state: activeState(),
    });

    expect(spoken(events)).toContain('Because binary matters.');
    expect(events).toContainEqual({
      type: 'node-exited',
      actorId: ACTOR_ID,
    });
    expect(state.npcs[ACTOR_ID]).not.toHaveProperty('activeNodeId');
  });

  it('NPC-NODE-04: a non-sticky node is no longer active after one turn', async () => {
    const next = topic({
      id: 'topic-again',
      match: { kind: 'command', keywords: ['again'] },
      responses: ['Again.'],
    });
    const bundle = npcBundle({
      topics: [defaultTopic(), next],
      nodes: [node({ isSticky: false, topics: [next] })],
    });

    const { state } = await submitNpc(asks('again'), {
      bundle,
      state: activeState(),
    });

    expect(state.npcs[ACTOR_ID]).not.toHaveProperty('activeNodeId');
  });

  it('NPC-NODE-05: a sticky node survives several turns until a special topic or exit', async () => {
    const stickyTopic = topic({
      id: 'sticky-question',
      match: { kind: 'special', keywords: ['one', 'two'] },
      responses: ['STICKY REPLY'],
    });
    const bundle = npcBundle({
      topics: [stickyTopic, defaultTopic()],
      nodes: [node({ isSticky: true, topics: [stickyTopic] })],
    });

    const first = await submitNpc(asks('one'), {
      bundle,
      state: activeState(),
    });
    const second = await submitNpc(asks('two'), {
      bundle,
      state: first.state,
    });

    expect(spoken(first.events)).toContain('STICKY REPLY');
    expect(spoken(second.events)).toContain('STICKY REPLY');
    expect(first.state.npcs[ACTOR_ID]?.activeNodeId).toBe(NODE_ID);
    expect(second.state.npcs[ACTOR_ID]?.activeNodeId).toBe(NODE_ID);
    expect(eventTypes(second.events)).not.toContain('node-exited');
  });

  it('NPC-NODE-06: an exit-node effect omits activeNodeId and emits node-exited', async () => {
    const leaving = topic({
      id: 'topic-leave',
      responses: ['Very well.'],
      effects: [{ kind: 'exit-node', actorId: ACTOR_ID }],
    });
    const bundle = npcBundle({
      topics: [leaving, defaultTopic()],
      nodes: [node({ topics: [leaving] })],
    });

    const { events, state } = await submitNpc(asks('leave'), {
      bundle,
      state: activeState(),
    });

    expect(events).toContainEqual({
      type: 'node-exited',
      actorId: ACTOR_ID,
    });
    expect(state.npcs[ACTOR_ID]).not.toHaveProperty('activeNodeId');
  });

  it('NPC-NODE-07: ending the conversation also ends any active node', async () => {
    const { events, state } = await submitNpc(
      { kind: 'bye' },
      { state: activeState() },
    );

    expect(state.npcs[ACTOR_ID]).not.toHaveProperty('activeNodeId');
    expect(eventTypes(events)).toContain('node-exited');
    expect(state.npcs[ACTOR_ID]?.stateId).toBe('ready');
  });

  it('NPC-NODE-09: a node topic prompt is emitted as topic-suggested and surfaced in view data', async () => {
    const prompt = '(You could ask about binary.)';
    const prompted = topic({
      id: 'topic-prompt',
      responses: ['Binary uses two symbols.'],
      prompt,
    });
    const bundle = npcBundle({
      topics: [prompted, defaultTopic()],
      nodes: [node({ isSticky: true, topics: [prompted] })],
    });

    const { events, game } = await submitNpc(asks('binary'), {
      bundle,
      state: activeState(),
    });

    expect(events).toContainEqual({
      type: 'topic-suggested',
      actorId: ACTOR_ID,
      text: prompt,
    });
    expect(game.getViewData().conversation?.prompt).toBe(prompt);
  });

  it('NPC-GAP-05: one-turn node expiry emits node-exited and restores the ready state', async () => {
    const next = topic({
      id: 'topic-next',
      match: { kind: 'command', keywords: ['next'] },
      responses: ['Next.'],
    });
    const bundle = npcBundle({
      topics: [defaultTopic(DEFAULT_REPLY), next],
      nodes: [node({ isSticky: false, topics: [next] })],
    });

    const { events, state } = await submitNpc(asks('next'), {
      bundle,
      state: activeState(),
    });

    expect(events).toContainEqual({
      type: 'node-exited',
      actorId: ACTOR_ID,
    });
    expect(state.npcs[ACTOR_ID]?.stateId).toBe('ready');
    expect(state.npcs[ACTOR_ID]).not.toHaveProperty('activeNodeId');
  });
});
