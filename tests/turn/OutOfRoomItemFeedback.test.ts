// WR4-C1-FIX-01..04 — out-of-room GIVE/SHOW feedback, from the
// Assistance Ward additional observation (PLAYTEST-assistance-ward-round4.md
// line 101 / optional follow-up line 124; round5.md line 94). All content,
// state and collaborators are deterministic in-memory fixtures: no YAML,
// authored prose, browser storage, wall clock, Math.random, network or file
// system. Only observable contracts are asserted (emitted events, command
// shape and state deltas).
import { describe, expect, it } from 'vitest';
import { resolveGameCommand } from '../../src/application/commandResolution';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { ItemDefinition } from '../../src/content/ItemDefinition';
import type { GameEvent } from '../../src/core/events/GameEvent';
import { createFromDto, type GameState } from '../../src/core/GameState';
import type { ConversationTopic } from '../../src/core/npcs/ConversationTopic';
import { isActorOutOfRoom } from '../../src/core/npcs/TopicSelection';
import { createConditionEvaluator } from '../../src/core/rules/ConditionEvaluator';
import { authoredGame, gameplaySnapshot } from '../fixtures/authored';
import { npcContext, npcDto, TALKING, topic } from '../fixtures/npcs';
import { catalogueOf } from '../fixtures/persistence';
import {
  DEMONSTRATION_ROOM_ID,
  INTAKE_ROOM_ID,
  localityState,
  MATEO_ID,
  MATEO_INSTRUCTION,
  pupilBundle,
} from '../fixtures/wardTopicLocality';

const KEY_ID = 'item-assistance-practice-key';
const ABSENCE_LINE = 'You cannot see that here.';
const UNKNOWN_LINE = "I don't understand that.";
const NOT_CARRIED_LINE = 'You do not have that.';
const HANDOVER_LINE = 'You hand the Practice key to mateo.';
const GIVE_RAW = 'give mateo practice key';
const SHOW_RAW = 'show mateo practice key';
const ASK_RAW = 'ask mateo about card';

const PRACTICE_KEY: ItemDefinition = {
  id: KEY_ID,
  name: 'Practice key',
  aliases: ['practice key'],
  portable: true,
  description: 'A small practice key.',
  initialRoom: DEMONSTRATION_ROOM_ID,
};

const MATEO_TRANSFER_TOPIC: ConversationTopic = topic({
  id: 'topic-mateo-practice-key-fixture',
  actorId: MATEO_ID,
  match: { kind: 'askTell', objectIds: [KEY_ID] },
  responses: ['Fixture instruction reply.'],
  strategy: { kind: 'sequence' },
  effects: [],
});

function mateoBundle(topics: readonly ConversationTopic[]): ContentBundle {
  return {
    ...pupilBundle([MATEO_ID], topics),
    items: catalogueOf([PRACTICE_KEY]),
  };
}

// Mateo's instruction topic is scoped to Demonstration, so a player in the
// hub makes isActorOutOfRoom() true. The key lives in Demonstration, so it is
// bundle-known but not nameable in the hub (NameResolver sees only visible
// items). Mateo is already talking, so conversation-start is not a state delta.
function hubState(): GameState {
  const base = localityState(INTAKE_ROOM_ID, [MATEO_ID]);
  return createFromDto({
    ...base,
    npcs: { [MATEO_ID]: npcDto({ stateId: TALKING }) },
    rooms: {
      ...base.rooms,
      [DEMONSTRATION_ROOM_ID]: { inventory: [KEY_ID] },
    },
  });
}

function inRoomState(keyOwner: 'player' | 'room'): GameState {
  const base = localityState(DEMONSTRATION_ROOM_ID, [MATEO_ID]);
  return createFromDto({
    ...base,
    player: {
      position: { ...base.player.position, roomId: DEMONSTRATION_ROOM_ID },
      inventory: keyOwner === 'player' ? [KEY_ID] : [],
      lives: base.player.lives,
    },
    rooms: {
      ...base.rooms,
      [DEMONSTRATION_ROOM_ID]: {
        inventory: keyOwner === 'room' ? [KEY_ID] : [],
      },
    },
    npcs: { [MATEO_ID]: npcDto({ stateId: TALKING }) },
  });
}

function messages(events: readonly GameEvent[]): string[] {
  return events.flatMap((event) =>
    event.type === 'message' ? [event.text] : [],
  );
}

function snapshot(state: GameState): string {
  return JSON.stringify({
    gameplay: gameplaySnapshot(state),
    score: state.score,
    lives: state.player.lives,
  });
}

function assertSingleOwnership(state: GameState): void {
  const counts: Record<string, number> = {};
  const add = (itemId: string): void => {
    counts[itemId] = (counts[itemId] ?? 0) + 1;
  };
  for (const itemId of state.player.inventory) add(itemId);
  for (const room of Object.values(state.rooms)) {
    for (const itemId of room.inventory) add(itemId);
  }
  for (const npc of Object.values(state.npcs)) {
    for (const itemId of npc.inventory) add(itemId);
  }
  expect(Object.values(counts).every((count) => count === 1)).toBe(true);
  expect(counts[KEY_ID]).toBe(1);
}

describe('Out-of-room GIVE/SHOW absence feedback (WR4-C1-FIX)', () => {
  it('WR4-C1-FIX-01: out-of-room GIVE uses the canonical absence line with no state delta', () => {
    const bundle = mateoBundle([MATEO_INSTRUCTION]);
    const state = hubState();
    const before = snapshot(state);
    assertSingleOwnership(state);

    const context = npcContext(state, {
      bundle,
      command: { kind: 'ask', actorId: MATEO_ID, topic: 'card' },
    });
    expect(
      isActorOutOfRoom(context, createConditionEvaluator(), MATEO_ID),
    ).toBe(true);

    const { game } = authoredGame({ bundle, state });
    const events = game.submit(GIVE_RAW);

    expect(messages(events)).toEqual([ABSENCE_LINE]);
    expect(events.filter((event) => event.type === 'npc-spoke')).toEqual([]);
    expect(snapshot(state)).toBe(before);
    assertSingleOwnership(state);
    expect(resolveGameCommand(GIVE_RAW, state, bundle)).toEqual({
      kind: 'unseen-actor',
      actorId: MATEO_ID,
    });
  });

  it('WR4-C1-FIX-02: out-of-room SHOW shares the canonical absence line with no state delta', () => {
    const bundle = mateoBundle([MATEO_INSTRUCTION]);
    const state = hubState();
    const before = snapshot(state);
    assertSingleOwnership(state);

    const context = npcContext(state, {
      bundle,
      command: { kind: 'ask', actorId: MATEO_ID, topic: 'card' },
    });
    expect(
      isActorOutOfRoom(context, createConditionEvaluator(), MATEO_ID),
    ).toBe(true);

    const { game } = authoredGame({ bundle, state });
    const events = game.submit(SHOW_RAW);

    expect(messages(events)).toEqual([ABSENCE_LINE]);
    expect(events.filter((event) => event.type === 'npc-spoke')).toEqual([]);
    expect(events.filter((event) => event.type === 'item-moved')).toEqual([]);
    expect(snapshot(state)).toBe(before);
    assertSingleOwnership(state);
    expect(resolveGameCommand(SHOW_RAW, state, bundle)).toEqual({
      kind: 'unseen-actor',
      actorId: MATEO_ID,
    });
  });

  it('WR4-C1-FIX-03: out-of-room ASK still emits the absence line without a lesson or state delta', () => {
    const bundle = mateoBundle([MATEO_INSTRUCTION]);
    const state = hubState();
    const before = snapshot(state);

    expect(resolveGameCommand(ASK_RAW, state, bundle)).toEqual({
      kind: 'ask',
      actorId: MATEO_ID,
      topic: 'card',
    });

    const { game } = authoredGame({ bundle, state });
    const events = game.submit(ASK_RAW);

    expect(messages(events)).toEqual([ABSENCE_LINE]);
    expect(events.filter((event) => event.type === 'npc-spoke')).toEqual([]);
    expect(events.filter((event) => event.type === 'item-moved')).toEqual([]);
    expect(events.filter((event) => event.type === 'flag-changed')).toEqual([]);
    expect(snapshot(state)).toBe(before);
    assertSingleOwnership(state);
  });

  it('WR4-C1-FIX-04: an in-room carried GIVE transfers once and announces the hand-over', () => {
    const bundle = mateoBundle([MATEO_TRANSFER_TOPIC]);
    const state = inRoomState('player');

    expect(resolveGameCommand(GIVE_RAW, state, bundle)).toEqual({
      kind: 'give',
      actorId: MATEO_ID,
      itemId: KEY_ID,
    });

    const { game } = authoredGame({ bundle, state });
    const events = game.submit(GIVE_RAW);

    expect(state.player.inventory).not.toContain(KEY_ID);
    expect(state.npcs[MATEO_ID]?.inventory).toEqual([KEY_ID]);
    expect(
      events.filter(
        (event) =>
          event.type === 'item-moved' &&
          event.itemId === KEY_ID &&
          event.fromOwnerId === 'player' &&
          event.toOwnerId === MATEO_ID,
      ),
    ).toHaveLength(1);
    expect(
      messages(events).filter((text) => text === HANDOVER_LINE),
    ).toHaveLength(1);
    expect(messages(events)).not.toContain(ABSENCE_LINE);
    expect(messages(events)).not.toContain(UNKNOWN_LINE);
    assertSingleOwnership(state);
  });

  it('WR4-C1-FIX-04: an in-room visible but uncarried GIVE refuses without transfer or state delta', () => {
    const bundle = mateoBundle([MATEO_TRANSFER_TOPIC]);
    const state = inRoomState('room');
    const before = snapshot(state);

    expect(resolveGameCommand(GIVE_RAW, state, bundle)).toEqual({
      kind: 'give',
      actorId: MATEO_ID,
      itemId: KEY_ID,
    });

    const { game } = authoredGame({ bundle, state });
    const events = game.submit(GIVE_RAW);

    expect(messages(events)).toEqual([NOT_CARRIED_LINE]);
    expect(events.filter((event) => event.type === 'item-moved')).toEqual([]);
    expect(snapshot(state)).toBe(before);
    assertSingleOwnership(state);
  });

  it('WR4-C1-FIX-04: an in-room give with an unresolvable item keeps the fixed unknown line', () => {
    const bundle = mateoBundle([MATEO_INSTRUCTION]);
    const state = inRoomState('player');
    const before = snapshot(state);

    const { game } = authoredGame({ bundle, state });
    const events = game.submit('give mateo missing widget');

    expect(messages(events)).toEqual([UNKNOWN_LINE]);
    expect(events.filter((event) => event.type === 'item-moved')).toEqual([]);
    expect(snapshot(state)).toBe(before);
    assertSingleOwnership(state);
  });

  it('WR4-C1-FIX-04: a wholly unknown phrase still uses the fixed unknown line', () => {
    const bundle = mateoBundle([MATEO_INSTRUCTION]);
    const state = hubState();
    const before = snapshot(state);
    const raw = 'flibbertigibbet wobble';

    expect(resolveGameCommand(raw, state, bundle)).toEqual({
      kind: 'unknown',
      raw,
    });

    const { game } = authoredGame({ bundle, state });
    const events = game.submit(raw);

    expect(messages(events)).toEqual([UNKNOWN_LINE]);
    expect(snapshot(state)).toBe(before);
    assertSingleOwnership(state);
  });

  it('WR4-C1-FIX-04: the unseen-actor variant is reserved for give/show with an unresolved item', () => {
    const bundle = mateoBundle([MATEO_INSTRUCTION]);
    const hub = hubState();
    const inRoom = inRoomState('room');

    const noActor = 'give nobody practice key';
    expect(resolveGameCommand(noActor, hub, bundle)).toEqual({
      kind: 'unknown',
      raw: noActor,
    });
    expect(resolveGameCommand(ASK_RAW, hub, bundle)).toEqual({
      kind: 'ask',
      actorId: MATEO_ID,
      topic: 'card',
    });
    expect(resolveGameCommand(GIVE_RAW, inRoom, bundle)).toEqual({
      kind: 'give',
      actorId: MATEO_ID,
      itemId: KEY_ID,
    });
    expect(resolveGameCommand(SHOW_RAW, inRoom, bundle)).toEqual({
      kind: 'show',
      actorId: MATEO_ID,
      itemId: KEY_ID,
    });
    const raw = 'flibbertigibbet wobble';
    expect(resolveGameCommand(raw, hub, bundle)).toEqual({
      kind: 'unknown',
      raw,
    });
  });
});
