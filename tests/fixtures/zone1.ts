// Declared, deterministic view of the clean zone-1 card set for C3 red tests.
// The YAML text is inlined at build time by Vite's raw glob: no runtime file
// system, clock, randomness, network or storage is touched. No card is written.
import { expect } from 'vitest';
import {
  AREA_ID,
  type CardSet,
  type ParsedCardSet,
  type ValidationOptions,
} from './contentToolchain';

const RAW_YAML = import.meta.glob('../../docs/content/**/*.yaml', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const CARD_PREFIX = '../../docs/content/';

export const GENERATED_HEADER =
  '// GENERATED FILE — do not edit. Regenerate with npm run content:generate.';

// Injected representation of the `## Topic:` headings in COVERAGE.md
// (content-toolchain.md §2). A fixed list keeps the tests independent of the
// Markdown file while still supplying every heading the clean cards declare.
export const ZONE1_COVERAGE_HEADINGS: readonly string[] = [
  '## Topic: switch-to-bit',
  '## Topic: data-types',
  '## Topic: number-conversion',
  '## Topic: character-representation',
  '## Topic: graphics-representation',
  '## Topic: sound-representation',
  '## Topic: data-storage-units',
  '## Topic: data-compression',
  '## Topic: ai-ethics-and-implications',
];

export const ZONE1_OPTIONS: ValidationOptions = {
  coverageHeadings: ZONE1_COVERAGE_HEADINGS,
};

export const ZONE1_CATALOGUES: readonly {
  readonly path: string;
  readonly name: string;
  readonly count: number;
}[] = [
  { path: 'src/content/authored/rooms.ts', name: 'rooms', count: 11 },
  { path: 'src/content/authored/items.ts', name: 'items', count: 18 },
  { path: 'src/content/authored/areas.ts', name: 'areas', count: 3 },
  { path: 'src/content/authored/worlds.ts', name: 'worlds', count: 1 },
  { path: 'src/content/authored/actors.ts', name: 'actors', count: 9 },
  {
    path: 'src/content/authored/actor-states.ts',
    name: 'actorStates',
    count: 6,
  },
  {
    path: 'src/content/authored/conversation-topics.ts',
    name: 'conversationTopics',
    count: 41,
  },
  { path: 'src/content/authored/nodes.ts', name: 'nodes', count: 4 },
  { path: 'src/content/authored/quizzes.ts', name: 'quizzes', count: 8 },
  { path: 'src/content/authored/questions.ts', name: 'questions', count: 32 },
  { path: 'src/content/authored/puzzles.ts', name: 'puzzles', count: 17 },
  { path: 'src/content/authored/hazards.ts', name: 'hazards', count: 5 },
  { path: 'src/content/authored/hints.ts', name: 'hints', count: 6 },
  {
    path: 'src/content/authored/spec-topics.ts',
    name: 'specTopics',
    count: 8,
  },
];

export const ZONE1_SPEC_TOPIC_IDS: readonly string[] = [
  'switch-to-bit',
  'data-types',
  'number-conversion',
  'character-representation',
  'graphics-representation',
  'sound-representation',
  'data-storage-units',
  'data-compression',
];

export function zone1CardSet(): CardSet {
  const files = Object.entries(RAW_YAML).map(([key, text]) => ({
    path: key.slice(CARD_PREFIX.length),
    text: String(text),
  }));
  files.sort((left, right) =>
    left.path < right.path ? -1 : Number(left.path > right.path),
  );
  expect(
    files.map((file) => file.path),
    'the authored card set must declare every area card',
  ).toEqual([
    `${AREA_ID}/hazards.yaml`,
    `${AREA_ID}/hints.yaml`,
    `${AREA_ID}/npcs.yaml`,
    `${AREA_ID}/puzzles.yaml`,
    `${AREA_ID}/quizzes.yaml`,
    `${AREA_ID}/rooms.yaml`,
    'entry-interface/npcs.yaml',
    'entry-interface/rooms.yaml',
    'network-hub/npcs.yaml',
    'network-hub/rooms.yaml',
    'spec-topics.yaml',
  ]);
  return { files };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function recordsOf(value: unknown): readonly Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function idsOf(value: unknown): readonly string[] {
  return recordsOf(value).flatMap((entry) => {
    const id = entry['id'];
    return typeof id === 'string' ? [id] : [];
  });
}

// Collections are merged across cards in path order by the generator, so the
// expected IDs must be aggregated the same way rather than read from zone 1
// alone (areas own their own room, NPC and definition artefacts).
function allIds(cards: ParsedCardSet, key: string): readonly string[] {
  return cards.cards.flatMap((card) => idsOf(card.data[key]));
}

function cardData(
  cards: ParsedCardSet,
  suffix: string,
): Record<string, unknown> {
  const card = cards.cards.find((entry) => entry.path.endsWith(suffix));
  expect(
    card,
    `the ${suffix} card must be present in the zone-1 set`,
  ).toBeDefined();
  return card?.data ?? {};
}

export interface Zone1Start {
  readonly worldId: string;
  readonly areaId: string;
  readonly roomId: string;
  readonly roomIds: readonly string[];
}

export function zone1DeclaredStart(cards: ParsedCardSet): Zone1Start {
  // The world is declared once, by the area card whose startAreaId it names.
  // Do not assume that is the first rooms card in path order.
  const owner = cards.cards.find((card) => recordsOf(card.data['worlds'])[0]);
  expect(owner, 'an area card must declare the world').toBeDefined();
  const data = owner?.data ?? {};
  const definition = isRecord(data['definition']) ? data['definition'] : {};
  const world = recordsOf(data['worlds'])[0] ?? {};
  const worldId = world['id'];
  const areaId = definition['id'];
  const roomId = definition['startRoomId'];
  expect(
    [worldId, areaId, roomId].every(
      (value) => typeof value === 'string' && value.length > 0,
    ),
    'the zone-1 world, area and start room must all be declared by ID',
  ).toBe(true);
  return {
    worldId: String(worldId),
    areaId: String(areaId),
    roomId: String(roomId),
    roomIds: allIds(cards, 'rooms'),
  };
}

export function expectedZone1Ids(
  cards: ParsedCardSet,
): Readonly<Record<string, readonly string[]>> {
  const quizzes = cardData(cards, '/quizzes.yaml');
  const puzzles = cardData(cards, '/puzzles.yaml');
  const hazards = cardData(cards, '/hazards.yaml');
  const hints = cardData(cards, '/hints.yaml');
  const spec = cardData(cards, 'spec-topics.yaml');
  return {
    rooms: allIds(cards, 'rooms'),
    items: allIds(cards, 'items'),
    areas: cards.cards.flatMap((card) => {
      const declared = idsOf(card.data['areas']);
      const own = isRecord(card.data['definition'])
        ? idsOf([card.data['definition']])
        : [];
      return [...declared, ...own];
    }),
    worlds: allIds(cards, 'worlds'),
    actors: allIds(cards, 'actors'),
    actorStates: allIds(cards, 'actorStates'),
    conversationTopics: allIds(cards, 'conversationTopics'),
    nodes: allIds(cards, 'conversationNodes'),
    quizzes: idsOf(quizzes['quizzes']),
    questions: idsOf(quizzes['questions']),
    puzzles: idsOf(puzzles['puzzles']),
    hazards: idsOf(hazards['hazards']),
    hints: idsOf(hints['hintSequences']),
    specTopics: idsOf(spec['topics']),
  };
}

export function emittedEntries(
  text: string,
): readonly Record<string, unknown>[] {
  const start = text.indexOf(' = [');
  expect(
    start,
    'an emitted catalogue must declare a readonly array literal',
  ).toBeGreaterThan(-1);
  const end = text.lastIndexOf('];');
  expect(
    end,
    'an emitted catalogue must close its array literal',
  ).toBeGreaterThan(start);
  const value: unknown = JSON.parse(text.slice(start + 3, end + 1));
  expect(
    Array.isArray(value),
    'an emitted catalogue body must be a JSON array of entries',
  ).toBe(true);
  const entries = Array.isArray(value) ? value.filter(isRecord) : [];
  expect(entries, 'every emitted entry must be a JSON object').toHaveLength(
    Array.isArray(value) ? value.length : -1,
  );
  return entries;
}
