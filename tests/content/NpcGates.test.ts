// Red tests for the npc-content gate and the NPC generation handoff. All
// artefacts are declared in-memory; no card is read from disk.
import { describe, expect, it } from 'vitest';
import {
  AREA_ID,
  findingText,
  generatedFile,
  loadGenerator,
  loadValidation,
  parsedCard,
  parsedSet,
  type Finding,
} from '../fixtures/contentToolchain';

type Data = Record<string, unknown>;

// Only the emitted node entries are inspected here: an assertion about the
// node's own fields must not be satisfied (or defeated) by fields on the
// topics embedded inside it. The catalogue body is a JSON array literal.
interface EmittedTopic {
  readonly actorId?: string;
}

interface EmittedNode {
  readonly topics: readonly EmittedTopic[];
}

function emittedNodes(text: string): readonly EmittedNode[] {
  const open = text.indexOf('= [');
  const close = text.lastIndexOf('];');
  expect(
    open !== -1 && close > open,
    'nodes.ts must emit an array of ConversationNode entries',
  ).toBe(true);
  return JSON.parse(text.slice(open + 2, close + 1)) as readonly EmittedNode[];
}

const CONVERSATION_TOPICS_PATH = 'src/content/authored/conversation-topics.ts';
const NODES_PATH = 'src/content/authored/nodes.ts';
const NOT_KNOWN: Data = {
  kind: 'not',
  of: { kind: 'flag-set', flag: 'data-types-known' },
};

function actor(overrides: Data = {}): Data {
  return {
    id: 'npc-archivist',
    aliases: ['archivist'],
    initialStateId: 'actorstate-ready',
    ...overrides,
  };
}

function topic(overrides: Data = {}): Data {
  return {
    id: 'topic-data-types',
    actorId: 'npc-archivist',
    match: { kind: 'askTell', objectIds: ['data-types'] },
    isActive: NOT_KNOWN,
    responses: ['Types sort the world.'],
    strategy: { kind: 'once' },
    effects: [],
    ...overrides,
  };
}

function node(overrides: Data = {}): Data {
  return {
    id: 'node-data-types',
    actorId: 'npc-archivist',
    isSticky: false,
    topicIds: ['topic-data-types'],
    defaultTopicId: 'topic-data-types',
    authoring: { reserved: true, note: 'Reserved teaching beat.' },
    ...overrides,
  };
}

function npcData(overrides: Data = {}): Data {
  return {
    kind: 'npc',
    areaId: AREA_ID,
    actors: [actor()],
    actorStates: [
      { id: 'actorstate-ready', stateDesc: 'Ready.', specialDesc: 'Waits.' },
    ],
    conversationTopics: [topic()],
    conversationNodes: [node()],
    ...overrides,
  };
}

function npcCards(data: Data) {
  return parsedSet(parsedCard(`${AREA_ID}/npcs.yaml`, data));
}

function hasFinding(findings: readonly Finding[], token: string): boolean {
  return findings.some(
    (finding) =>
      finding.gate === 'npc-content' &&
      finding.message.toLowerCase().includes(token.toLowerCase()),
  );
}

function npcFindings(findings: readonly Finding[]): string {
  return findingText(
    findings.filter((finding) => finding.gate === 'npc-content'),
  );
}

describe('npc-content gate', () => {
  it('CT-NPC-01: a topic actorId must bind to a declared actor and is generated', async () => {
    const { validateCards } = await loadValidation();
    const { generateContent } = await loadGenerator();

    const missingData = npcData({
      conversationTopics: [topic({ actorId: 'npc-absent' })],
    });
    const missing = npcCards(missingData);
    const before = JSON.stringify(missing);
    const findings = validateCards(missing);
    expect(
      hasFinding(findings, 'npc-absent'),
      'a topic actorId naming no declared actor must be rejected',
    ).toBe(true);
    expect(JSON.stringify(missing)).toBe(before);

    const bound = npcCards(npcData());
    expect(npcFindings(validateCards(bound))).toBe('');
    const generated = generateContent(bound);
    expect(generated.ok).toBe(true);
    expect(
      generatedFile(generated.files, CONVERSATION_TOPICS_PATH),
      'the optional actorId must be emitted on runtime ConversationTopic',
    ).toContain('actorId');
  });

  it('CT-NPC-02: node actorId is validated against actors and dropped from runtime nodes', async () => {
    const { validateCards } = await loadValidation();
    const { generateContent } = await loadGenerator();

    const unknownActor = npcCards(
      npcData({ conversationNodes: [node({ actorId: 'npc-absent' })] }),
    );
    const unknownFindings = validateCards(unknownActor);
    expect(hasFinding(unknownFindings, 'npc-absent')).toBe(true);

    const foreignDefault = npcCards(
      npcData({
        conversationNodes: [node({ defaultTopicId: 'topic-elsewhere' })],
      }),
    );
    const foreignFindings = validateCards(foreignDefault);
    expect(
      hasFinding(foreignFindings, 'topic-elsewhere'),
      'the default topic must belong to the same actor',
    ).toBe(true);

    const nodeFixture = npcData({ conversationNodes: [node()] });
    const generated = generateContent(npcCards(nodeFixture));
    expect(generated.ok).toBe(true);

    const runtimeNodes = emittedNodes(
      generatedFile(generated.files, NODES_PATH),
    );
    expect(runtimeNodes.length, 'the generated node must be inspected').toBe(1);
    for (const runtimeNode of runtimeNodes) {
      expect(
        Object.hasOwn(runtimeNode, 'actorId'),
        'node actorId is authoring-only and must not reach ConversationNode',
      ).toBe(false);
      expect(
        runtimeNode.topics.length,
        'the node must embed its resolved topics',
      ).toBeGreaterThan(0);
      for (const embeddedTopic of runtimeNode.topics) {
        expect(
          embeddedTopic.actorId,
          'every embedded ConversationTopic keeps its optional actorId',
        ).toBe('npc-archivist');
      }
    }
  });

  it('CT-NPC-03: an unentered node needs a reservation and a reason', async () => {
    const { validateCards } = await loadValidation();

    const unreserved = npcCards(
      npcData({ conversationNodes: [node({ authoring: undefined })] }),
    );
    expect(
      hasFinding(validateCards(unreserved), 'reserved'),
      'a node with no enter-node producer needs authoring.reserved: true and a reason',
    ).toBe(true);

    // The zone-1 reason is carried across verbatim from its card.
    const zoneReason = 'Reserved and deliberately unentered in this card.';
    const reserved = npcCards(
      npcData({
        conversationNodes: [
          node({ authoring: { reserved: true, note: zoneReason } }),
        ],
      }),
    );
    expect(npcFindings(validateCards(reserved))).toBe('');
  });

  it('CT-NPC-04: any active topic may be the default within its own actor', async () => {
    const { validateCards } = await loadValidation();

    const custom = npcCards(
      npcData({
        conversationTopics: [topic({ id: 'topic-foreman-predecessor' })],
        conversationNodes: [
          node({ defaultTopicId: 'topic-foreman-predecessor' }),
        ],
      }),
    );
    expect(
      npcFindings(validateCards(custom)),
      'a catch-all need not be named *-default',
    ).toBe('');

    const foreign = npcCards(
      npcData({
        actors: [actor({ id: 'npc-other' })],
        conversationTopics: [topic({ actorId: 'npc-other' })],
        conversationNodes: [node({ actorId: 'npc-archivist' })],
      }),
    );
    expect(hasFinding(validateCards(foreign), 'topic-data-types')).toBe(true);
  });

  it('CT-NPC-05: node topicIds resolve to concrete topics without reordering responses', async () => {
    const { validateCards } = await loadValidation();
    const { generateContent } = await loadGenerator();

    const unresolved = npcCards(
      npcData({ conversationNodes: [node({ topicIds: ['topic-absent'] })] }),
    );
    expect(hasFinding(validateCards(unresolved), 'topic-absent')).toBe(true);

    const firstReply = 'First authored reply.';
    const secondReply = 'Second authored reply.';
    const resolved = npcCards(
      npcData({
        conversationTopics: [
          topic({ id: 'topic-first', responses: [firstReply] }),
          topic({ id: 'topic-second', responses: [secondReply] }),
        ],
        conversationNodes: [
          node({ topicIds: ['topic-second', 'topic-first'] }),
        ],
      }),
    );
    expect(npcFindings(validateCards(resolved))).toBe('');

    const generated = generateContent(resolved);
    expect(generated.ok).toBe(true);
    const nodesText = generatedFile(generated.files, NODES_PATH);
    expect(nodesText.indexOf(secondReply)).toBeLessThan(
      nodesText.indexOf(firstReply),
    );
  });

  it('CT-NPC-06: every admitted match, condition, effect and strategy variant is accepted', async () => {
    const { validateCards } = await loadValidation();
    const conditions: readonly Data[] = [
      { kind: 'flag-set', flag: 'bins-labelled' },
      { kind: 'has-item', itemId: 'item-cache' },
      { kind: 'visited-room', roomId: 'room-binary-hall' },
      { kind: 'topic-complete', topicId: 'data-types' },
      { kind: 'npc-knows', actorId: 'npc-archivist', topicId: 'data-types' },
      {
        kind: 'actor-state',
        actorId: 'npc-archivist',
        stateId: 'actorstate-ready',
      },
      {
        kind: 'in-node',
        actorId: 'npc-archivist',
        nodeId: 'node-data-types',
      },
      { kind: 'puzzle-solved', puzzleId: 'puzzle-sort-types' },
      { kind: 'quiz-passed', quizId: 'quiz-data-types' },
      {
        kind: 'counter-at-least',
        key: 'failed-attempts:quiz-data-types',
        value: 1,
      },
      { kind: 'all', of: [] },
      NOT_KNOWN,
    ];
    const effects: readonly Data[] = [
      { kind: 'set-flag', flag: 'bins-labelled', value: true },
      { kind: 'message', text: 'A line of prose.' },
      { kind: 'change-lives', delta: -1, reason: 'A hazard.' },
      { kind: 'complete-topic', topicId: 'data-types' },
      { kind: 'grant-item', itemId: 'item-cache' },
      { kind: 'remove-item', itemId: 'item-cache' },
      {
        kind: 'transfer-item',
        itemId: 'item-cache',
        fromOwnerId: 'player',
        toOwnerId: 'npc-archivist',
      },
      { kind: 'move-player', roomId: 'room-binary-hall', reason: 'Return.' },
      {
        kind: 'set-actor-state',
        actorId: 'npc-archivist',
        stateId: 'actorstate-ready',
      },
      { kind: 'learn-topic', actorId: 'npc-archivist', topicId: 'data-types' },
      {
        kind: 'enter-node',
        actorId: 'npc-archivist',
        nodeId: 'node-data-types',
      },
      { kind: 'exit-node', actorId: 'npc-archivist' },
      { kind: 'set-puzzle-active', puzzleId: 'puzzle-sort-types' },
      { kind: 'set-puzzle-solved', puzzleId: 'puzzle-sort-types' },
      {
        kind: 'schedule',
        event: {
          id: 'event-fuse',
          kind: 'fuse',
          remainingTurns: 1,
          effect: { kind: 'message', text: 'The fuse fires.' },
        },
      },
      {
        kind: 'start-quiz',
        quizId: 'quiz-data-types',
        actorId: 'npc-archivist',
      },
      {
        kind: 'show-hint',
        hintId: 'hint-sort-types',
        level: 1,
        text: 'A nudge.',
      },
    ];
    const matches: readonly Data[] = [
      { kind: 'ask', objectIds: ['data-types'] },
      { kind: 'tell', objectIds: ['data-types'] },
      { kind: 'askTell', objectIds: ['data-types'] },
      { kind: 'give', itemIds: ['item-cache'] },
      { kind: 'show', itemIds: ['item-cache'] },
      { kind: 'command', keywords: ['types'] },
      { kind: 'special', keywords: ['why'] },
    ];
    const strategies: readonly Data[] = [
      { kind: 'once' },
      { kind: 'sequence' },
      { kind: 'rotating' },
    ];
    const variants = matches.map((match, index) =>
      topic({
        id: `topic-variant-${String(index)}`,
        match,
        isActive: conditions[index % conditions.length],
        responses: [`Variant response ${String(index)}.`],
        strategy: strategies[index % strategies.length],
        effects: [effects[index % effects.length]],
      }),
    );
    const roomsCard = parsedCard(`${AREA_ID}/rooms.yaml`, {
      kind: 'area',
      rooms: [
        {
          id: 'room-binary-hall',
          title: 'Hall',
          description: 'Hall.',
          exits: [],
          score: 0,
        },
      ],
      items: [
        {
          id: 'item-cache',
          name: 'Cache',
          aliases: ['cache'],
          portable: true,
          description: 'Cache.',
          initialRoom: 'room-binary-hall',
        },
      ],
    });
    const npcsCard = parsedCard(
      `${AREA_ID}/npcs.yaml`,
      npcData({
        conversationTopics: variants,
        conversationNodes: [node({ topicIds: ['topic-variant-0'] })],
      }),
    );
    const puzzlesCard = parsedCard(`${AREA_ID}/puzzles.yaml`, {
      kind: 'puzzle',
      puzzles: [{ id: 'puzzle-sort-types', topicId: 'data-types', score: 0 }],
    });
    const quizzesCard = parsedCard(`${AREA_ID}/quizzes.yaml`, {
      kind: 'quiz',
      quizzes: [{ id: 'quiz-data-types', topicId: 'data-types', score: 0 }],
    });
    const hintsCard = parsedCard(`${AREA_ID}/hints.yaml`, {
      kind: 'hint',
      hintSequences: [{ id: 'hint-sort-types', targets: ['data-types'] }],
    });
    const cards = parsedSet(
      roomsCard,
      npcsCard,
      puzzlesCard,
      quizzesCard,
      hintsCard,
    );

    expect(
      npcFindings(validateCards(cards)),
      'an unused admitted variant must not be a finding',
    ).toBe('');
  });

  it('CT-NPC-07: the ready state must not author a greeting but other states may', async () => {
    const { validateCards } = await loadValidation();

    const readyData = npcData({
      actorStates: [
        {
          id: 'actorstate-ready',
          stateDesc: 'Ready.',
          specialDesc: 'Waits.',
          onEnter: [{ kind: 'message', text: 'Hello there.' }],
        },
      ],
    });
    const readyCards = npcCards(readyData);
    const readyFindings = validateCards(readyCards);
    expect(
      hasFinding(readyFindings, 'ready'),
      'the silent ready-state decision forbids an authored greeting',
    ).toBe(true);

    const otherData = npcData({
      actorStates: [
        { id: 'actorstate-ready', stateDesc: 'Ready.', specialDesc: 'Waits.' },
        {
          id: 'actorstate-talking',
          stateDesc: 'Talking.',
          specialDesc: 'In conversation.',
          onEnter: [{ kind: 'message', text: 'Carry on.' }],
        },
      ],
    });
    const otherCards = npcCards(otherData);
    const otherFindings = validateCards(otherCards);
    expect(
      npcFindings(otherFindings),
      'the schema still admits onEnter effects on other states',
    ).toBe('');
  });
});
