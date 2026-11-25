// Red tests for topic resolution and the default reply (npcs.md §3, §8, §9;
// application-and-ui.md §8; user decisions GAP-09). The resolver factory is a
// missing production seam, so every test reports a named assertion instead of
// a raw import error. All collaborators are fakes.
import { describe, expect, it } from 'vitest';
import { catalogueOf } from '../../src/content/Catalogue';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { GameState } from '../../src/core/GameState';
import { loadGame } from '../fixtures/persistence';
import { loadValidator, makeItem, withActors } from '../fixtures/content';
import {
  ACTOR_ALIAS,
  ACTOR_ID,
  DEFAULT_REPLY,
  defaultTopic,
  eventTypes,
  ITEM_ID,
  resolverFor,
  NODE_ID,
  node,
  npcBundle,
  npcDto,
  npcGameDependencies,
  npcState,
  READY,
  topic,
  WHY_TOPIC_ID,
} from '../fixtures/npcs';

function asksFor(text: string): {
  readonly kind: 'ask';
  readonly actorId: string;
  readonly topic: string;
} {
  return { kind: 'ask', actorId: ACTOR_ID, topic: text };
}

function spoken(events: readonly GameEvent[]): string[] {
  return events.flatMap((event) =>
    event.type === 'npc-spoke' ? [event.text] : [],
  );
}

describe('TopicResolver (npcs.md §3)', () => {
  it('NPC-RESOLVE-01: a visible object alias resolves to object, skipping keyword and free-text', async () => {
    const resolver = await resolverFor(npcBundle());
    const state: GameState = npcState();
    const before = JSON.stringify(state);

    const result = resolver.resolve(ITEM_ID, state);

    expect(result).toEqual({ kind: 'object', objectId: ITEM_ID });
    expect(JSON.stringify(state)).toBe(before);
  });

  it('NPC-RESOLVE-02: a node special keyword resolves to its topic when no object matches', async () => {
    const resolver = await resolverFor(npcBundle());
    const activeNode = node({
      id: NODE_ID,
      topics: [
        topic({
          id: WHY_TOPIC_ID,
          match: { kind: 'special', keywords: ['why'] },
        }),
      ],
    });

    expect(resolver.resolve('why', npcState(), activeNode)).toEqual({
      kind: 'keyword',
      topicId: WHY_TOPIC_ID,
    });
  });

  it('NPC-RESOLVE-03: unmatched input resolves to free-text without throwing or an unknown command', async () => {
    const resolver = await resolverFor(npcBundle());

    let result: ReturnType<typeof resolver.resolve> | undefined;
    expect(() => {
      result = resolver.resolve('a strange new thought', npcState());
    }).not.toThrow();
    expect(result).toEqual({
      kind: 'free-text',
      text: 'a strange new thought',
    });
    expect(eventTypes([])).not.toContain('unknown');
  });

  it('NPC-RESOLVE-04: an unknown topic gets the authored default reply, not a parser error, and the turn advances', async () => {
    const bundle = npcBundle({ topics: [defaultTopic()] });
    const state = npcState({
      npcs: { [ACTOR_ID]: npcDto({ stateId: READY }) },
    });
    const game = await loadGame(
      npcGameDependencies({ bundle, state, command: asksFor('nonsense') }),
    );

    const events = game.submit('ask guide nonsense');

    expect(spoken(events)).toContain(DEFAULT_REPLY);
    const text = JSON.stringify(events);
    expect(text).not.toContain("I don't understand");
    expect(text).not.toContain('parser error');
    expect(game.getViewData().turn).toBe(state.turn + 1);
  });

  it('NPC-RESOLVE-05: duplicate aliases are rejected by the shared gate and runtime resolution offers no disambiguation', async () => {
    const validate = await loadValidator();
    const bundle = withActors(npcBundle(), [
      { id: ACTOR_ID, aliases: [ACTOR_ALIAS], initialStateId: READY },
      { id: 'npc-2', aliases: [ACTOR_ALIAS], initialStateId: READY },
    ]);
    const resolver = await resolverFor(bundle);
    const problems = validate(bundle);

    expect(problems.join(' ').toLowerCase()).toContain('alias');
    // The runtime relies on that uniqueness: one phrase yields one object ID
    // and no choice prompt is emitted.
    expect(resolver.resolve(ACTOR_ALIAS, npcState())).toEqual({
      kind: 'object',
      objectId: ACTOR_ID,
    });
  });

  it('NPC-NODE-08: a keyword colliding with an object alias matches raw tokens, while object resolution stays separate', async () => {
    const bundle = {
      ...npcBundle({ nodes: [node({ topics: [whySpecialTopic()] })] }),
      items: catalogueOf([makeItem({ aliases: ['why'] })]),
    };
    const resolver = await resolverFor(bundle);
    const state = npcState();

    expect(
      resolver.resolve('why', state, bundle.nodes.getById(NODE_ID)),
    ).toEqual({
      kind: 'keyword',
      topicId: WHY_TOPIC_ID,
    });
    expect(resolver.resolve('why', state)).toEqual({
      kind: 'object',
      objectId: ITEM_ID,
    });
  });

  it('NPC-GAP-09: the default reply is the authored topic text verbatim, never hard-coded wording', async () => {
    const authored = 'The guide looks away and says nothing more.';
    const bundle = npcBundle({ topics: [defaultTopic(authored)] });
    const readyState = npcState({
      npcs: { [ACTOR_ID]: npcDto({ stateId: READY }) },
    });
    const game = await loadGame(
      npcGameDependencies({
        bundle,
        state: readyState,
        command: asksFor('something entirely new'),
      }),
    );

    const lines = spoken(game.submit('ask guide something entirely new'));

    expect(lines).toContain(authored);
    expect(lines).not.toContain(DEFAULT_REPLY);
    expect(lines).toHaveLength(1);
  });
});

function whySpecialTopic() {
  return topic({
    id: WHY_TOPIC_ID,
    match: { kind: 'special', keywords: ['why'] },
  });
}
