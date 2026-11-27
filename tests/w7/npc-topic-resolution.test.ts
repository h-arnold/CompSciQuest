import { describe, expect, it } from 'vitest';
import type { ContentBundle } from '../../src/content/ContentBundle';
import {
  createTopicResolver,
  type TopicResolver,
} from '../../src/core/commands/TopicResolver';
import { createEffectApplier } from '../../src/core/effects/EffectApplier';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { GameState } from '../../src/core/GameState';
import { createConditionEvaluator } from '../../src/core/rules/ConditionEvaluator';
import { FakeRandom } from '../fixtures/persistence';
import {
  authoredBundle,
  authoredGame,
  authoredNpc,
  authoredState,
  FOREMAN_ID,
  readSave,
} from '../fixtures/authored';
import {
  ACTOR_ID,
  defaultTopic,
  DEFAULT_TOPIC_ID,
  ITEM_ID,
  npcBundle,
  npcDto,
  npcState,
  READY,
  spokenTexts,
  submitNpc,
  topic,
} from '../fixtures/npcs';

const AI_ID = 'npc-the-ai';
const KEEPER_ID = 'npc-stack-keeper';

function concreteSnapshot(state: GameState, actorId = AI_ID): string {
  return JSON.stringify({
    flags: state.flags,
    knownTopics: state.npcs[actorId]?.knownTopics,
    activeNodeId: state.npcs[actorId]?.activeNodeId,
    inventories: {
      player: state.player.inventory,
      rooms: Object.fromEntries(
        Object.entries(state.rooms).map(([roomId, room]) => [
          roomId,
          [...room.inventory],
        ]),
      ),
      npcs: Object.fromEntries(
        Object.entries(state.npcs).map(([actorId, npc]) => [
          actorId,
          [...npc.inventory],
        ]),
      ),
    },
    score: state.score,
    position: state.player.position,
    lives: state.player.lives,
    status: state.status,
  });
}

function resolverFor(bundle: ContentBundle, state: GameState): TopicResolver {
  const random = new FakeRandom([0]);
  return createTopicResolver({
    bundle,
    evaluator: createConditionEvaluator(),
    random,
    applier: createEffectApplier(state, { bundle, random }),
  });
}

function stateWithoutVisibleItem(): GameState {
  return npcState({
    player: {
      position: {
        worldId: 'world-stub',
        areaId: 'area-stub',
        roomId: 'room-stub-start',
      },
      inventory: [],
      lives: 3,
    },
    rooms: {
      'room-stub-start': { inventory: [] },
      'room-stub-north': { inventory: [] },
    },
    npcs: { [ACTOR_ID]: npcDto({ stateId: READY }) },
  });
}

function expectNoConcreteEffects(events: readonly GameEvent[]): void {
  const concreteTypes = new Set([
    'flag-changed',
    'knowledge-gained',
    'node-entered',
    'node-exited',
    'item-moved',
    'score-changed',
    'room-entered',
  ]);
  expect(events.filter((event) => concreteTypes.has(event.type))).toEqual([]);
}

describe('W7R-NPC-01 integrated resolution regressions', () => {
  it('W7R-NPC-01: a multi-ID askTell topic resolves only the matching object ID without mutation', () => {
    const bundle = npcBundle({
      topics: [
        topic({
          id: 'topic-multi-id',
          actorId: ACTOR_ID,
          match: { kind: 'askTell', objectIds: [ITEM_ID, 'other-topic'] },
          responses: ['MULTI-ID REPLY'],
        }),
      ],
    });
    const state = stateWithoutVisibleItem();
    const before = JSON.stringify(state);

    const resolved = resolverFor(bundle, state).resolve(
      ITEM_ID,
      state,
      undefined,
      ACTOR_ID,
    );

    expect(resolved).toEqual({ kind: 'object', objectId: ITEM_ID });
    expect(JSON.stringify(state)).toBe(before);
  });

  it('W7R-NPC-01: verdict resolves to its authored keyword topic without mutation', () => {
    const state = authoredState({ roomId: 'room-arrival' });
    const before = JSON.stringify(state);

    const resolved = resolverFor(authoredBundle, state).resolve(
      'verdict',
      state,
      undefined,
      AI_ID,
    );

    expect(resolved).toEqual({
      kind: 'keyword',
      topicId: 'topic-ai-verdict',
    });
    expect(JSON.stringify(state)).toBe(before);
  });

  it('W7R-NPC-01: units resolves to its declared keeper object ID without mutation', () => {
    const storageState = authoredState({ roomId: 'room-storage-stacks' });
    const before = JSON.stringify(storageState);

    const resolved = resolverFor(authoredBundle, storageState).resolve(
      'units',
      storageState,
      undefined,
      KEEPER_ID,
    );

    expect(resolved).toEqual({
      kind: 'object',
      objectId: 'data-storage-units',
    });
    expect(JSON.stringify(storageState)).toBe(before);
  });

  it.each([
    {
      label: 'a tell-only topic named during ask',
      commandKind: 'ask',
      phrase: 'tell-secret',
      topicId: 'topic-tell-secret',
      matchKind: 'tell',
      objectId: 'tell-secret',
    },
    {
      label: 'an ask-only topic named during tell',
      commandKind: 'tell',
      phrase: 'ask-secret',
      topicId: 'topic-ask-secret',
      matchKind: 'ask',
      objectId: 'ask-secret',
    },
  ] as const)(
    'W7R-NPC-01: $label uses the authored default without concrete effects',
    async ({ commandKind, phrase, topicId, matchKind, objectId }) => {
      const bundle = npcBundle({
        topics: [
          topic({
            id: topicId,
            actorId: ACTOR_ID,
            match: { kind: matchKind, objectIds: [objectId] },
            responses: ['FORBIDDEN REPLY'],
            effects: [
              { kind: 'set-flag', flag: `${matchKind}-selected`, value: true },
            ],
          }),
          defaultTopic('DEFAULT REPLY'),
        ],
      });
      const state = npcState({
        npcs: { [ACTOR_ID]: npcDto({ stateId: READY }) },
      });
      const before = concreteSnapshot(state, ACTOR_ID);

      const { events } = await submitNpc(
        { kind: commandKind, actorId: ACTOR_ID, topic: phrase },
        { bundle, state },
      );

      expect(spokenTexts(events)).toEqual(['DEFAULT REPLY']);
      expect(concreteSnapshot(state, ACTOR_ID)).toBe(before);
      expectNoConcreteEffects(events);
    },
  );

  it('W7R-NPC-01: an exhausted once default is not answered, counted or applied again', async () => {
    const bundle = npcBundle({
      topics: [
        topic({
          id: DEFAULT_TOPIC_ID,
          match: { kind: 'askTell', objectIds: [] },
          responses: ['ONCE DEFAULT'],
          strategy: { kind: 'once' },
          effects: [{ kind: 'set-flag', flag: 'default-used', value: true }],
        }),
      ],
    });
    const state = npcState({
      npcs: { [ACTOR_ID]: npcDto({ stateId: READY }) },
    });
    const first = await submitNpc(
      { kind: 'ask', actorId: ACTOR_ID, topic: 'unknown subject' },
      { bundle, state },
    );

    expect(spokenTexts(first.events)).toEqual(['ONCE DEFAULT']);
    expect(state.flags['default-used']).toBe(true);
    expect(state.npcs[ACTOR_ID]?.topicUses[DEFAULT_TOPIC_ID]).toBe(1);
    expect(
      first.events.filter(
        (event) =>
          event.type === 'flag-changed' && event.flag === 'default-used',
      ),
    ).toHaveLength(1);

    const beforeSecond = JSON.stringify({ ...state, turn: 0 });
    const second = first.game.submit('npc command');

    expect(spokenTexts(second)).toEqual([]);
    expect(state.npcs[ACTOR_ID]?.topicUses[DEFAULT_TOPIC_ID]).toBe(1);
    expect(JSON.stringify({ ...state, turn: 0 })).toBe(beforeSecond);
    expectNoConcreteEffects(second);
  });
});

describe('W7R-NPC-01 authored ask/tell resolution', () => {
  it('W7R-NPC-01: ask ai about verdict selects the authored verdict topic and enters its node', () => {
    const verdict =
      authoredBundle.conversationTopics.getById('topic-ai-verdict');
    expect(verdict).toBeDefined();
    const state = authoredState({ roomId: 'room-arrival' });
    const { game } = authoredGame({ state });

    const events = game.submit('ask ai about verdict');

    expect(spokenTexts(events)).toEqual([verdict?.responses[0]]);
    expect(events).toContainEqual({
      type: 'knowledge-gained',
      actorId: AI_ID,
      topicId: 'ai-ethics-and-implications',
    });
    expect(events).toContainEqual({
      type: 'node-entered',
      actorId: AI_ID,
      nodeId: 'node-ai-verdict',
    });
    expect(state.npcs[AI_ID]?.knownTopics).toContain(
      'ai-ethics-and-implications',
    );
    expect(state.npcs[AI_ID]?.activeNodeId).toBe('node-ai-verdict');
  });

  it('W7R-NPC-01: ask foreman about data types selects the lift topic and saves stacks-sealed', () => {
    const lift =
      authoredBundle.conversationTopics.getById('topic-foreman-lift');
    expect(lift).toBeDefined();
    const state = authoredState({
      roomId: 'room-binary-hall',
      flags: {
        'quiz-passed:quiz-switchyard': true,
        'switches-set': true,
      },
    });
    const { game, storage } = authoredGame({ state });

    const events = game.submit('ask foreman about data types');

    expect(spokenTexts(events)).toEqual([lift?.responses[0]]);
    expect(state.flags['stacks-sealed']).toBe(true);
    expect(state.npcs[FOREMAN_ID]?.knownTopics).toContain('data-types');
    expect(state.npcs[FOREMAN_ID]?.stateId).toBe('actorstate-foreman-helpful');
    expect(
      events.filter(
        (event) =>
          event.type === 'flag-changed' && event.flag === 'stacks-sealed',
      ),
    ).toHaveLength(1);
    expect(
      events.filter(
        (event) =>
          event.type === 'knowledge-gained' &&
          event.actorId === FOREMAN_ID &&
          event.topicId === 'data-types',
      ),
    ).toHaveLength(1);

    const { dto } = readSave(game, storage);
    expect(dto.state.flags['stacks-sealed']).toBe(true);
    expect(dto.state.npcs[FOREMAN_ID]?.knownTopics).toContain('data-types');
    expect(dto.state.npcs[FOREMAN_ID]?.stateId).toBe(
      'actorstate-foreman-helpful',
    );
  });

  it('W7R-NPC-01: ask keeper about units selects the authored units topic and seals the stacks', () => {
    const units =
      authoredBundle.conversationTopics.getById('topic-keeper-units');
    expect(units).toBeDefined();
    const state = authoredState({ roomId: 'room-storage-stacks' });
    const { game } = authoredGame({ state });

    const events = game.submit('ask keeper about units');

    expect(spokenTexts(events)).toEqual([units?.responses[0]]);
    expect(state.flags['stacks-sealed']).toBe(true);
    expect(state.npcs[KEEPER_ID]?.knownTopics).toContain('data-storage-units');
    expect(
      events.filter(
        (event) =>
          event.type === 'flag-changed' && event.flag === 'stacks-sealed',
      ),
    ).toHaveLength(1);
  });
});

describe('W7R-NPC-01 defaults and negative state contracts', () => {
  it('W7R-NPC-01: unresolved text in node-ai-verdict uses the default without verdict effects', () => {
    const verdict =
      authoredBundle.conversationTopics.getById('topic-ai-verdict');
    const fallback =
      authoredBundle.conversationTopics.getById('topic-ai-default');
    const state = authoredState({
      roomId: 'room-arrival',
      npcs: {
        [AI_ID]: authoredNpc(AI_ID, { activeNodeId: 'node-ai-verdict' }),
      },
    });
    const before = concreteSnapshot(state);
    const previousTurn = state.turn;
    const { game } = authoredGame({ state });

    const events = game.submit('ask ai about quantum bananas');

    expect(spokenTexts(events)).toEqual([fallback?.responses[0]]);
    expect(spokenTexts(events)).not.toContain(verdict?.responses[0]);
    expect(concreteSnapshot(state)).toBe(before);
    expect(state.turn).toBe(previousTurn + 1);
    expectNoConcreteEffects(events);
  });

  it('W7R-NPC-01: fresh unresolved text uses the authored default without concrete mutation', () => {
    const fallback =
      authoredBundle.conversationTopics.getById('topic-ai-default');
    const state = authoredState({ roomId: 'room-arrival' });
    const before = concreteSnapshot(state);
    const previousTurn = state.turn;
    const { game } = authoredGame({ state });

    const events = game.submit('ask ai about quantum bananas');

    expect(spokenTexts(events)).toEqual([fallback?.responses[0]]);
    expect(concreteSnapshot(state)).toBe(before);
    expect(state.turn).toBe(previousTurn + 1);
    expectNoConcreteEffects(events);
  });

  it('W7R-NPC-01: an exhausted once topic falls back without repeating concrete effects', async () => {
    const bundle = npcBundle({
      topics: [
        topic({
          id: 'topic-once-object',
          match: { kind: 'askTell', objectIds: [ITEM_ID] },
          responses: ['FIRST REPLY'],
          strategy: { kind: 'once' },
          effects: [
            { kind: 'set-flag', flag: 'once-used', value: true },
            {
              kind: 'learn-topic',
              actorId: ACTOR_ID,
              topicId: 'once-known',
            },
          ],
        }),
        defaultTopic('DEFAULT REPLY'),
      ],
    });
    const state = npcState({
      npcs: { [ACTOR_ID]: npcDto({ stateId: READY }) },
    });
    const command = { kind: 'ask' as const, actorId: ACTOR_ID, topic: ITEM_ID };
    const first = await submitNpc(command, { bundle, state });

    expect(spokenTexts(first.events)).toEqual(['FIRST REPLY']);
    expect(state.flags['once-used']).toBe(true);
    expect(state.npcs[ACTOR_ID]?.knownTopics).toContain('once-known');

    const second = first.game.submit('npc command');

    expect(spokenTexts(second)).toEqual(['DEFAULT REPLY']);
    expect(state.flags['once-used']).toBe(true);
    expect(state.npcs[ACTOR_ID]?.knownTopics).toEqual(['once-known']);
    expectNoConcreteEffects(second);
  });
});

describe('W7R-NPC-01 retained precedence and scope controls', () => {
  it.each([
    {
      label: 'why-here',
      roomId: 'room-arrival',
      topicId: 'topic-ai-why-here',
      raw: 'ask ai about why here',
    },
    {
      label: 'failure',
      roomId: 'room-arrival',
      topicId: 'topic-ai-failure',
      raw: 'ask ai about fail',
    },
    {
      label: 'escape',
      roomId: 'room-network-hub',
      topicId: 'topic-ai-escape',
      raw: 'ask ai about escape',
    },
  ] as const)(
    'W7R-NPC-01: the $label special topic beats generic askTell topics',
    ({ roomId, topicId, raw }) => {
      const special = authoredBundle.conversationTopics.getById(topicId);
      const state = authoredState({ roomId });
      const { game } = authoredGame({ state });

      const events = game.submit(raw);

      expect(spokenTexts(events)).toEqual([special?.responses[0]]);
    },
  );

  it('W7R-NPC-01: a resolved visible object beats an earlier unrelated topic', async () => {
    const bundle = npcBundle({
      topics: [
        topic({
          id: 'topic-unrelated',
          match: { kind: 'askTell', objectIds: ['other-object'] },
          responses: ['UNRELATED REPLY'],
        }),
        topic({
          id: 'topic-visible-object',
          match: { kind: 'askTell', objectIds: [ITEM_ID] },
          responses: ['OBJECT REPLY'],
        }),
        defaultTopic('DEFAULT REPLY'),
      ],
    });
    const state = npcState({
      npcs: { [ACTOR_ID]: npcDto({ stateId: READY }) },
    });

    const { events } = await submitNpc(
      { kind: 'ask', actorId: ACTOR_ID, topic: ITEM_ID },
      { bundle, state },
    );

    expect(spokenTexts(events)).toEqual(['OBJECT REPLY']);
  });

  it.each([
    {
      label: 'why-here',
      roomId: 'room-network-hub',
      raw: 'ask ai about why here',
    },
    {
      label: 'failure',
      roomId: 'room-network-hub',
      raw: 'ask ai about fail',
    },
    {
      label: 'escape',
      roomId: 'room-arrival',
      raw: 'ask ai about escape',
    },
  ] as const)(
    'W7R-NPC-01: the $label special topic remains room-scoped',
    ({ roomId, raw }) => {
      const fallback =
        authoredBundle.conversationTopics.getById('topic-ai-default');
      const state = authoredState({ roomId });
      const { game } = authoredGame({ state });

      const events = game.submit(raw);

      expect(spokenTexts(events)).toEqual([fallback?.responses[0]]);
    },
  );
});
