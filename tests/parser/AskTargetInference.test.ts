// ENG9-ASKINFER-01: `ask about <topic>` infers an actor only when exactly one
// present actor has a bound, location-scoped conversation topic
// (ENGINE_ISSUES.md Batch E1 `ask` syntax; application-and-ui.md §5.2 — no
// disambiguation prompt). Presence comes from existing bundle relations only:
// ConversationTopic.actorId plus an isActive in-room/in-area (or an all holding
// one) matching the current Position (shared-rules.md §3, npcs.md §2). `not`
// and `any` shapes are not single location scopes. No state field or NPC ID is
// introduced. Only `ask` changes; tell/give/show stay explicit.
import { describe, expect, it } from 'vitest';
import type { ActorDefinition } from '../../src/content/ActorDefinition';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { Command } from '../../src/core/commands/Command';
import type { GameState, GameStateDto } from '../../src/core/GameState';
import type { NpcStateDto } from '../../src/core/NpcStateDto';
import type { ConversationNode } from '../../src/core/npcs/ConversationNode';
import type { ConversationTopic } from '../../src/core/npcs/ConversationTopic';
import type { Condition } from '../../src/core/rules/Condition';
import { catalogueOf } from '../fixtures/persistence';
import {
  KEY_A,
  makeParserBundle,
  makeParserState,
  START_ROOM,
} from '../fixtures/parser';
import { loadSeam } from '../fixtures/seams';

type GameCommandResolver = (
  raw: string,
  state: GameState,
  bundle: ContentBundle,
) => Command;

const TOPIC = 'patterns';
const GUIDE: ActorDefinition = {
  id: 'npc-guide',
  aliases: ['guide'],
  initialStateId: 'idle',
};
const SCRIBE: ActorDefinition = {
  id: 'npc-scribe',
  aliases: ['scribe'],
  initialStateId: 'idle',
};
const IN_ROOM: Condition = { kind: 'in-room', roomId: START_ROOM };
const IN_AREA: Condition = {
  kind: 'in-area',
  worldId: 'world-stub',
  areaId: 'area-stub',
};
const IN_ALL: Condition = { kind: 'all', of: [IN_ROOM] };

function loadResolver(): Promise<GameCommandResolver> {
  return loadSeam<GameCommandResolver>(
    '../../src/application/commandResolution',
    'resolveGameCommand',
    'ENGINE_ISSUES.md Batch E1 ask syntax; application-and-ui.md §5.2 (no disambiguation prompt)',
  );
}

function boundTopic(
  id: string,
  actorId: string | undefined,
  isActive: Condition,
): ConversationTopic {
  return {
    id,
    ...(actorId && { actorId }),
    match: { kind: 'askTell', objectIds: [TOPIC] },
    isActive,
    responses: ['A reply.'],
    strategy: { kind: 'once' },
    effects: [],
  };
}

function npcState(): NpcStateDto {
  return { stateId: 'idle', knownTopics: [], inventory: [], topicUses: {} };
}

interface AskFixture {
  readonly bundle: ContentBundle;
  readonly state: GameState;
}

function askFixture(
  topics: readonly ConversationTopic[],
  actors: readonly ActorDefinition[] = [GUIDE],
  nodeTopics: readonly ConversationTopic[] = [],
): AskFixture {
  const nodes: readonly ConversationNode[] =
    nodeTopics.length === 0
      ? []
      : [
          {
            id: 'node-guide',
            isSticky: true,
            topics: nodeTopics,
            defaultTopicId: 'topic-default',
            onEnterEffects: [],
          },
        ];
  return {
    bundle: {
      ...makeParserBundle(),
      // One unambiguous visible item keeps give/show assertions about the
      // verb contract rather than about alias ambiguity.
      items: catalogueOf([
        {
          id: KEY_A,
          name: 'Brass key',
          aliases: ['key'],
          portable: true,
          description: 'A small brass key.',
          initialRoom: START_ROOM,
        },
      ]),
      actors: catalogueOf(actors),
      conversationTopics: catalogueOf(topics),
      nodes: catalogueOf(nodes),
    },
    state: makeParserState({
      npcs: Object.fromEntries(
        actors.map((actor) => [actor.id, npcState()]),
      ) as GameStateDto['npcs'],
    }),
  };
}

function snapshot(state: GameState): string {
  return JSON.stringify(state);
}

describe('ENG9-ASKINFER-01 ask target inference', () => {
  it('ENG9-ASKINFER-01: ask about a topic infers the only present actor and matches the explicit form', async () => {
    const resolve = await loadResolver();
    const { bundle, state } = askFixture([
      boundTopic('topic-guide', GUIDE.id, IN_ROOM),
    ]);
    const before = snapshot(state);
    const expected: Command = { kind: 'ask', actorId: GUIDE.id, topic: TOPIC };

    expect
      .soft(
        resolve(`ask about ${TOPIC}`, state, bundle),
        'one location-scoped, actor-bound topic must identify the actor for ask about <topic>',
      )
      .toEqual(expected);
    expect
      .soft(
        resolve(`ask ${GUIDE.aliases[0]} about ${TOPIC}`, state, bundle),
        'explicit ask <npc> about <topic> must keep working',
      )
      .toEqual(expected);
    expect.soft(snapshot(state)).toBe(before);
  });

  it('ENG9-ASKINFER-01: node topics, in-area and all scopes also infer a single actor', async () => {
    const resolve = await loadResolver();
    const areaFixture = askFixture(
      [],
      [GUIDE],
      [boundTopic('topic-node-area', GUIDE.id, IN_AREA)],
    );
    const allFixture = askFixture([boundTopic('topic-all', GUIDE.id, IN_ALL)]);
    const beforeArea = snapshot(areaFixture.state);
    const beforeAll = snapshot(allFixture.state);
    const expected: Command = { kind: 'ask', actorId: GUIDE.id, topic: TOPIC };

    expect
      .soft(
        resolve(`ask about ${TOPIC}`, areaFixture.state, areaFixture.bundle),
        'a bound topic inside bundle.nodes.all with in-area is a presence candidate',
      )
      .toEqual(expected);
    expect
      .soft(
        resolve(`ask about ${TOPIC}`, allFixture.state, allFixture.bundle),
        'an all scope containing a matching in-room condition is a presence candidate',
      )
      .toEqual(expected);
    expect.soft(snapshot(areaFixture.state)).toBe(beforeArea);
    expect.soft(snapshot(allFixture.state)).toBe(beforeAll);
  });

  it('ENG9-ASKINFER-01: zero or several candidates take the unknown path without guessing', async () => {
    const resolve = await loadResolver();
    const single = askFixture([boundTopic('topic-only', GUIDE.id, IN_ROOM)]);
    const none = askFixture([]);
    const several = askFixture(
      [
        boundTopic('topic-guide', GUIDE.id, IN_ROOM),
        boundTopic('topic-scribe', SCRIBE.id, IN_ROOM),
      ],
      [GUIDE, SCRIBE],
    );
    const elsewhere = askFixture([
      boundTopic('topic-elsewhere', GUIDE.id, {
        kind: 'in-room',
        roomId: 'room-stub-north',
      }),
    ]);
    const unbound = askFixture([
      boundTopic('topic-unbound', undefined, IN_ROOM),
    ]);
    const nonScopes = askFixture(
      [
        boundTopic('topic-any', GUIDE.id, {
          kind: 'any',
          of: [IN_ROOM],
        }),
        boundTopic('topic-not', GUIDE.id, {
          kind: 'not',
          of: { kind: 'in-room', roomId: 'room-stub-north' },
        }),
      ],
      [GUIDE, SCRIBE],
    );
    const raw = `ask about ${TOPIC}`;
    const fixtures = [none, several, elsewhere, unbound, nonScopes];
    const before = fixtures.map((fixture) => snapshot(fixture.state));

    expect
      .soft(
        resolve(raw, single.state, single.bundle),
        'with exactly one candidate ask about <topic> must infer it (contrast for the no-guess cases)',
      )
      .toEqual({ kind: 'ask', actorId: GUIDE.id, topic: TOPIC });
    for (const [index, fixture] of fixtures.entries()) {
      expect
        .soft(
          resolve(raw, fixture.state, fixture.bundle),
          'zero, several, out-of-scope, unbound or non-scope topics must not be guessed (no disambiguation prompt)',
        )
        .toEqual({ kind: 'unknown', raw });
      expect.soft(snapshot(fixture.state)).toBe(before[index]);
    }
  });

  it('ENG9-ASKINFER-01: only ask infers; tell, give and show keep their explicit forms', async () => {
    const resolve = await loadResolver();
    const { bundle, state } = askFixture(
      [boundTopic('topic-guide', GUIDE.id, IN_ROOM)],
      [GUIDE, SCRIBE],
    );
    const before = snapshot(state);

    expect
      .soft(
        resolve(`ask about ${TOPIC}`, state, bundle),
        'the inferred ask command carries the single present actor',
      )
      .toEqual({ kind: 'ask', actorId: GUIDE.id, topic: TOPIC });
    expect
      .soft(
        resolve(`tell about ${TOPIC}`, state, bundle),
        'tell about <topic> must not gain inference',
      )
      .toEqual({ kind: 'unknown', raw: `tell about ${TOPIC}` });
    expect
      .soft(
        resolve(`tell ${GUIDE.aliases[0]} about ${TOPIC}`, state, bundle),
        'explicit tell <npc> about <topic> must keep working',
      )
      .toEqual({ kind: 'tell', actorId: GUIDE.id, topic: TOPIC });
    expect
      .soft(
        resolve(`give ${GUIDE.aliases[0]} key`, state, bundle),
        'give is explicit',
      )
      .toEqual({ kind: 'give', actorId: GUIDE.id, itemId: KEY_A });
    expect
      .soft(
        resolve(`show ${GUIDE.aliases[0]} key`, state, bundle),
        'show is explicit',
      )
      .toEqual({ kind: 'show', actorId: GUIDE.id, itemId: KEY_A });
    expect
      .soft(
        resolve('give key', state, bundle),
        'give without a target stays unknown',
      )
      .toEqual({ kind: 'unknown', raw: 'give key' });
    expect
      .soft(
        resolve('show key', state, bundle),
        'show without a target stays unknown',
      )
      .toEqual({ kind: 'unknown', raw: 'show key' });
    expect.soft(snapshot(state)).toBe(before);
  });
});
