// Red tests for deterministic generation (content-toolchain.md §5;
// content-rules.md D3/D4; application-and-ui.md §3.1; shared-rules.md §11).
// Generated text is captured through the in-memory Io fake; no file is written
// under src/ and no timestamp, wall clock or filesystem order is consulted.
import { describe, expect, it } from 'vitest';
import {
  AREA_ID,
  GENERATED_PATHS,
  expectSameMembers,
  generatedFile,
  loadGenerator,
  parsedCard,
  parsedSet,
  type GenerationResult,
} from '../fixtures/contentToolchain';

type CardData = Record<string, unknown>;

const AREAS_PATH = 'src/content/authored/areas.ts';
const ROOMS_OUT = 'src/content/authored/rooms.ts';
const ACTORS_OUT = 'src/content/authored/actors.ts';
const NODES_OUT = 'src/content/authored/nodes.ts';

function definition(overrides: CardData = {}): CardData {
  return {
    id: `area-${AREA_ID}`,
    worldId: `world-${AREA_ID}`,
    name: 'The Switchyard',
    startRoomId: 'room-binary-hall',
    lives: 3,
    ...overrides,
  };
}

function roomData(id: string, overrides: CardData = {}): CardData {
  return {
    id,
    title: `Room ${id}`,
    description: `The ${id} description.`,
    exits: [],
    score: 0,
    ...overrides,
  };
}

function cleanParsedSet() {
  return parsedSet(
    parsedCard(`${AREA_ID}/rooms.yaml`, {
      kind: 'area',
      areaId: AREA_ID,
      definition: definition(),
      worlds: [
        {
          id: `world-${AREA_ID}`,
          name: 'The Switchyard',
          areaIds: [`area-${AREA_ID}`],
          startAreaId: `area-${AREA_ID}`,
          lives: 3,
        },
      ],
      rooms: [roomData('room-binary-hall')],
      items: [
        {
          id: 'item-register-cache',
          name: 'register cache',
          aliases: ['cache'],
          portable: true,
          description: 'A cache.',
          initialRoom: 'room-binary-hall',
        },
      ],
    }),
    parsedCard(`${AREA_ID}/npcs.yaml`, {
      kind: 'npc',
      actors: [
        {
          id: 'npc-archivist',
          aliases: ['archivist'],
          initialStateId: 'actorstate-ready',
        },
      ],
      actorStates: [
        { id: 'actorstate-ready', stateDesc: 'Ready.', specialDesc: 'Waits.' },
      ],
      conversationTopics: [
        {
          id: 'topic-data-types',
          actorId: 'npc-archivist',
          match: { kind: 'askTell', objectIds: ['data-types'] },
          isActive: { kind: 'flag-set', flag: 'bins-labelled' },
          responses: ['Types sort the world.'],
          strategy: { kind: 'once' },
          effects: [],
        },
      ],
      conversationNodes: [
        {
          id: 'node-data-types',
          actorId: 'npc-archivist',
          isSticky: false,
          topicIds: ['topic-data-types'],
          defaultTopicId: 'topic-data-types',
          authoring: { reserved: true, note: 'Reserved teaching beat.' },
        },
      ],
    }),
    parsedCard(`${AREA_ID}/quizzes.yaml`, {
      kind: 'quiz',
      quizzes: [
        {
          id: 'quiz-data-types',
          topicId: 'data-types',
          score: 1,
          questionIds: ['q-data-types-1', 'q-data-types-2'],
          passMark: 1,
          onPass: [
            { kind: 'complete-topic', topicId: 'data-types' },
            {
              kind: 'set-flag',
              flag: 'quiz-passed:quiz-data-types',
              value: true,
            },
          ],
          onFail: [
            {
              kind: 'change-lives',
              delta: -1,
              reason: 'A wrong answer costs a life.',
            },
          ],
        },
      ],
      questions: [
        {
          id: 'q-data-types-1',
          prompt: 'Which type holds a whole number?',
          options: ['integer', 'real'],
          correctOptionIds: [0],
          explanation: 'An integer is a whole number.',
          authoring: { assessmentObjective: 'AO1', difficulty: 'easy' },
        },
        {
          id: 'q-data-types-2',
          prompt: 'Which type holds text?',
          options: ['string', 'character'],
          correctOptionIds: [0],
          explanation: 'A string holds a sequence of characters.',
          authoring: { assessmentObjective: 'AO2', difficulty: 'easy' },
        },
      ],
    }),
    parsedCard(`${AREA_ID}/puzzles.yaml`, { kind: 'puzzle', puzzles: [] }),
    parsedCard(`${AREA_ID}/hazards.yaml`, { kind: 'hazard', hazards: [] }),
    parsedCard(`${AREA_ID}/hints.yaml`, { kind: 'hint', hintSequences: [] }),
    parsedCard('spec-topics.yaml', {
      kind: 'spec-topics',
      topics: [
        {
          id: 'data-types',
          title: 'Data types',
          specReference: '§1.2.1',
          codeLocation: 'src/content/authored/rooms.ts',
          status: 'covered',
          evidence: 'The hall teaches the five types.',
          roomIds: ['room-binary-hall'],
          maxScore: 2,
        },
      ],
    }),
  );
}

function pathsOf(result: GenerationResult): readonly string[] {
  return result.files.map((file) => file.path);
}

describe('content:generate (content-toolchain.md §5)', () => {
  it('CT-GEN-01: findings block generation; a clean set emits one file per kind', async () => {
    const { generateContent } = await loadGenerator();

    const invalid = parsedSet(
      parsedCard(`${AREA_ID}/rooms.yaml`, {
        kind: 'area',
        rooms: [roomData('room-duplicate'), roomData('room-duplicate')],
      }),
    );
    const blocked = generateContent(invalid);
    expect(
      blocked.ok,
      'generation must run validation first and refuse a card set with findings',
    ).toBe(false);
    expect(blocked.findings.length).toBeGreaterThan(0);
    expect(
      blocked.files,
      'nothing may be generated when findings exist',
    ).toEqual([]);

    const clean = generateContent(cleanParsedSet());
    expect(clean.ok).toBe(true);
    expect(clean.findings).toEqual([]);
    expectSameMembers(pathsOf(clean), [...GENERATED_PATHS]);
  });

  it('CT-GEN-02: areas follow directory order, entries keep file order and no timestamps appear', async () => {
    const { generateContent } = await loadGenerator();
    const cards = parsedSet(
      parsedCard('a-zone/rooms.yaml', {
        kind: 'area',
        areaId: 'area-z',
        definition: definition({
          id: 'area-z',
          worldId: 'world-z',
          startRoomId: 'room-z2',
        }),
        rooms: [roomData('room-z2'), roomData('room-z1')],
      }),
      parsedCard('z-zone/rooms.yaml', {
        kind: 'area',
        areaId: 'area-a',
        definition: definition({
          id: 'area-a',
          worldId: 'world-z',
          startRoomId: 'room-a1',
        }),
        rooms: [roomData('room-a1')],
      }),
    );

    const result = generateContent(cards);
    expect(result.ok).toBe(true);
    const areas = generatedFile(result.files, AREAS_PATH);
    expect(
      areas.indexOf('area-z'),
      'a-zone sorts before z-zone even though its area ID sorts later',
    ).toBeLessThan(areas.indexOf('area-a'));
    const rooms = generatedFile(result.files, ROOMS_OUT);
    expect(
      rooms.indexOf('room-z2'),
      'entries must retain in-file order, not be sorted by ID',
    ).toBeLessThan(rooms.indexOf('room-z1'));
    for (const file of result.files) {
      expect(
        /\b20\d{2}-\d{2}-\d{2}\b/u.test(file.text),
        `${file.path} must not carry a generated timestamp`,
      ).toBe(false);
    }
  });

  it('CT-GEN-03: authoring blocks and room topicIds never reach the engine', async () => {
    const { generateContent } = await loadGenerator();
    const cards = parsedSet(
      parsedCard(`${AREA_ID}/rooms.yaml`, {
        kind: 'area',
        definition: definition(),
        rooms: [
          roomData('room-binary-hall', {
            topicIds: ['data-types'],
            authoring: {
              interesting: 'The worn, repeated verdict.',
              pillar: ['P-a'],
            },
          }),
        ],
      }),
      parsedCard(`${AREA_ID}/npcs.yaml`, {
        kind: 'npc',
        actors: [
          {
            id: 'npc-archivist',
            aliases: [],
            initialStateId: 'actorstate-ready',
            authoring: { role: 'tutor', voice: 'clipped' },
          },
        ],
        actorStates: [],
        conversationTopics: [],
        conversationNodes: [],
      }),
    );

    const result = generateContent(cards);
    expect(result.ok).toBe(true);
    const rooms = generatedFile(result.files, ROOMS_OUT);
    for (const token of ['authoring', 'topicIds', 'interesting', 'pillar']) {
      expect(rooms.toLowerCase()).not.toContain(token.toLowerCase());
    }
    const actors = generatedFile(result.files, ACTORS_OUT);
    for (const token of ['authoring', 'role', 'voice']) {
      expect(actors.toLowerCase()).not.toContain(token.toLowerCase());
    }
    expect(rooms).toContain('room-binary-hall');
  });

  it('CT-GEN-05: roomIds and node topics are derived in declaration order', async () => {
    const { generateContent } = await loadGenerator();
    const firstReply = 'First topic reply.';
    const secondReply = 'Second topic reply.';
    const cards = parsedSet(
      parsedCard(`${AREA_ID}/rooms.yaml`, {
        kind: 'area',
        definition: definition({
          // An authored roomIds list must not be trusted over the rooms order.
          roomIds: ['room-a', 'room-b'],
        }),
        rooms: [roomData('room-b'), roomData('room-a')],
      }),
      parsedCard(`${AREA_ID}/npcs.yaml`, {
        kind: 'npc',
        actors: [],
        actorStates: [],
        conversationTopics: [
          {
            id: 'topic-first',
            responses: [firstReply],
            match: { kind: 'command', keywords: ['first'] },
            isActive: { kind: 'flag-set', flag: 'first-flag' },
            strategy: { kind: 'once' },
            effects: [],
          },
          {
            id: 'topic-second',
            responses: [secondReply],
            match: { kind: 'command', keywords: ['second'] },
            isActive: { kind: 'flag-set', flag: 'second-flag' },
            strategy: { kind: 'once' },
            effects: [],
          },
        ],
        conversationNodes: [
          {
            id: 'node-data-types',
            isSticky: false,
            topicIds: ['topic-second', 'topic-first'],
            defaultTopicId: 'topic-first',
          },
        ],
      }),
    );

    const result = generateContent(cards);
    expect(result.ok).toBe(true);
    const areas = generatedFile(result.files, AREAS_PATH);
    expect(
      areas.indexOf('room-b'),
      'roomIds come from rooms[*].id in declaration order',
    ).toBeLessThan(areas.indexOf('room-a'));
    const nodes = generatedFile(result.files, NODES_OUT);
    expect(
      nodes.indexOf(secondReply),
      'node topics follow topicIds order',
    ).toBeLessThan(nodes.indexOf(firstReply));
    const rooms = generatedFile(result.files, ROOMS_OUT);
    expect(rooms).toContain('The room-b description.');
  });
});
