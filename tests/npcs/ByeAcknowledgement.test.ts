// Contract tests for the explicit `bye` acknowledgement (npcs.md §4 step 4;
// application-and-ui.md §5.2 and §6.1). Every collaborator is an in-memory fake
// and all actor, node and flag IDs come from the committed authored fixtures.
import { describe, expect, it } from 'vitest';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { GameState } from '../../src/core/GameState';
import { formatEvent } from '../../src/ui/formatEvent';
import { authoredBundle, authoredGame } from '../fixtures/authored';
import {
  ACTOR_ID,
  actorState,
  byeCommand,
  eventTypes,
  NODE_ID,
  node,
  npcBundle,
  npcDto,
  npcState,
  READY,
  submitNpc,
  TALKING,
} from '../fixtures/npcs';
import {
  localityState,
  PRIYA_ID,
  PRIYA_NODE,
  PRIYA_TOPICS,
  pupilBundle,
  READY_STATE_ID,
  RECORDS_ROOM_ID,
  RECOVERY_FLAGS,
} from '../fixtures/wardTopicLocality';

const GOODBYE = 'Goodbye.';
const NOT_TALKING = 'You are not in a conversation.';

function messagesOf(events: readonly GameEvent[]): string[] {
  return events.flatMap((event) =>
    event.type === 'message' ? [event.text] : [],
  );
}

function flagChanges(events: readonly GameEvent[]): string[] {
  return events.flatMap((event) =>
    event.type === 'flag-changed' ? [event.flag] : [],
  );
}

function topicUsesOf(state: GameState, actorId: string): object {
  return { ...state.npcs[actorId]?.topicUses };
}

function stateSnapshot(state: GameState): string {
  return JSON.stringify({
    npcs: state.npcs,
    flags: state.flags,
    inventory: state.player.inventory,
  });
}

function priyaInConversation() {
  const bundle = pupilBundle([PRIYA_ID], PRIYA_TOPICS, [PRIYA_NODE]);
  const state = localityState(RECORDS_ROOM_ID, [PRIYA_ID]);
  const { game } = authoredGame({ bundle, state });
  game.submit('ask priya about audit card');
  game.submit('ask priya checked');
  return { game, state };
}

describe('explicit bye acknowledgement (npcs.md §4 step 4)', () => {
  it('C-BYE-ACK-01: bye in conversation emits exactly one Goodbye. message before conversation-ended and restores initialStateId', () => {
    const { game, state } = priyaInConversation();
    const usesBefore = topicUsesOf(state, PRIYA_ID);

    const events = game.submit('bye');

    expect(messagesOf(events)).toEqual([GOODBYE]);
    expect(
      events.filter(
        (event) => event.type === 'message' && event.text === GOODBYE,
      ),
    ).toHaveLength(1);
    const acknowledgementIndex = events.findIndex(
      (event) => event.type === 'message' && event.text === GOODBYE,
    );
    expect(acknowledgementIndex).toBeGreaterThanOrEqual(0);
    expect(acknowledgementIndex).toBeLessThan(
      events.findIndex((event) => event.type === 'conversation-ended'),
    );
    expect(events).toContainEqual({
      type: 'conversation-ended',
      actorId: PRIYA_ID,
      reason: 'said goodbye',
    });
    expect(events).toContainEqual({
      type: 'actor-state-changed',
      actorId: PRIYA_ID,
      stateId: READY_STATE_ID,
    });
    expect(state.npcs[PRIYA_ID]?.stateId).toBe(READY_STATE_ID);
    expect(state.npcs[PRIYA_ID]?.activeNodeId).toBeUndefined();
    expect(game.getViewData().conversation).toBeUndefined();
    expect(eventTypes(events)).not.toContain('npc-spoke');
    expect(topicUsesOf(state, PRIYA_ID)).toEqual(usesBefore);
    // The acknowledgement renders in the transcript; the internal end event does not.
    expect(
      events.flatMap((event) => formatEvent(event, authoredBundle)),
    ).toEqual([GOODBYE]);
  });

  it('C-BYE-ACK-02: goodbye alias gives the same single plain Goodbye. acknowledgement', () => {
    const { game, state } = priyaInConversation();

    const events = game.submit('goodbye');

    expect(messagesOf(events)).toEqual([GOODBYE]);
    const acknowledgementIndex = events.findIndex(
      (event) => event.type === 'message' && event.text === GOODBYE,
    );
    expect(acknowledgementIndex).toBeGreaterThanOrEqual(0);
    expect(acknowledgementIndex).toBeLessThan(
      events.findIndex((event) => event.type === 'conversation-ended'),
    );
    expect(events).toContainEqual({
      type: 'conversation-ended',
      actorId: PRIYA_ID,
      reason: 'said goodbye',
    });
    expect(state.npcs[PRIYA_ID]?.stateId).toBe(READY_STATE_ID);
    expect(eventTypes(events)).not.toContain('npc-spoke');
  });

  it('C-BYE-EXIT-01: the acknowledgement precedes the unchanged onExit, node-exit, end and restore sequence', async () => {
    const bundle = npcBundle({
      states: [
        actorState(READY),
        actorState(TALKING, {
          onEnter: [{ kind: 'message', text: 'ON ENTER MUST NOT REPLAY' }],
          onExit: [
            { kind: 'message', text: 'The guide stands up.' },
            { kind: 'set-flag', flag: 'guide-dismissed', value: true },
          ],
        }),
      ],
      nodes: [node()],
    });
    const state = npcState({
      npcs: {
        [ACTOR_ID]: npcDto({ stateId: TALKING, activeNodeId: NODE_ID }),
      },
    });

    const { events } = await submitNpc(byeCommand, { bundle, state });

    expect(eventTypes(events)).toEqual([
      'message',
      'message',
      'flag-changed',
      'node-exited',
      'conversation-ended',
      'actor-state-changed',
    ]);
    expect(messagesOf(events)).toEqual([GOODBYE, 'The guide stands up.']);
    expect(events).toContainEqual({
      type: 'conversation-ended',
      actorId: ACTOR_ID,
      reason: 'said goodbye',
    });
    expect(events).toContainEqual({ type: 'node-exited', actorId: ACTOR_ID });
    expect(state.npcs[ACTOR_ID]?.stateId).toBe(READY);
    expect(state.npcs[ACTOR_ID]).not.toHaveProperty('activeNodeId');
  });

  it('C-BYE-NOTTALKING-01: bye outside a conversation keeps the exact not-talking message and unchanged state', () => {
    const bundle = pupilBundle([PRIYA_ID], PRIYA_TOPICS, [PRIYA_NODE]);
    const state = localityState(RECORDS_ROOM_ID, [PRIYA_ID]);
    const before = stateSnapshot(state);
    const { game } = authoredGame({ bundle, state });

    const events = game.submit('bye');

    expect(events).toEqual([{ type: 'message', text: NOT_TALKING }]);
    expect(eventTypes(events)).not.toContain('conversation-ended');
    expect(messagesOf(events)).not.toContain(GOODBYE);
    expect(stateSnapshot(state)).toBe(before);
  });

  it('C-BYE-FLAGS-01: the acknowledgement changes no flag, gate, topic use or conversation start', () => {
    const { game, state } = priyaInConversation();
    const flagsBefore = { ...state.flags };
    const usesBefore = topicUsesOf(state, PRIYA_ID);

    const farewell = game.submit('bye');

    expect(farewell).toContainEqual({ type: 'message', text: GOODBYE });
    expect(flagChanges(farewell)).toEqual([]);
    expect(eventTypes(farewell)).not.toContain('set-flag');
    expect(eventTypes(farewell)).not.toContain('conversation-started');
    expect(state.flags).toEqual(flagsBefore);
    expect(state.flags[RECOVERY_FLAGS.priya]).toBe(false);
    expect(state.npcs[PRIYA_ID]?.activeNodeId).toBeUndefined();
    expect(topicUsesOf(state, PRIYA_ID)).toEqual(usesBefore);
    expect(game.getViewData().conversation).toBeUndefined();
  });
});
