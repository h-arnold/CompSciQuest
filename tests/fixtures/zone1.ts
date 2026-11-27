// Declared, deterministic view of the accepted whole-game card set for C3/W6
// red tests. The YAML text is inlined at build time by Vite's raw glob: no
// runtime file system, clock, randomness, network or storage is touched. No
// card is written. The declared paths, coverage headings and spec-topic IDs
// come from the accepted cards and COVERAGE.md, not from the generated bundle.
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

// Injected representation of all twelve `## Topic:` headings in COVERAGE.md
// (content-toolchain.md §2). A fixed list keeps the tests independent of the
// Markdown file while still supplying every heading the accepted cards declare.
// `ai-ethics-and-implications` remains `in progress` but is still canonical;
// `tutorial-mechanics` is the approved non-assessed onboarding heading; the
// final two headings record the accepted W5 coverage flip for Zone A.
export const ZONE1_COVERAGE_HEADINGS: readonly string[] = [
  '## Topic: switch-to-bit',
  '## Topic: data-types',
  '## Topic: number-conversion',
  '## Topic: character-representation',
  '## Topic: graphics-representation',
  '## Topic: sound-representation',
  '## Topic: data-storage-units',
  '## Topic: data-compression',
  '## Topic: tutorial-mechanics',
  '## Topic: ai-ethics-and-implications',
  '## Topic: algorithms-and-pseudocode',
  '## Topic: programming-constructs',
];

export const ZONE1_OPTIONS: ValidationOptions = {
  coverageHeadings: ZONE1_COVERAGE_HEADINGS,
};

// The declared generated module table from content-toolchain.md §5. Expected
// counts are not literals here: expectedZone1Counts() derives them from the
// accepted YAML cards, so a stale generated bundle fails against the cards.
export const ZONE1_CATALOGUES: readonly {
  readonly path: string;
  readonly name: string;
}[] = [
  { path: 'src/content/authored/rooms.ts', name: 'rooms' },
  { path: 'src/content/authored/items.ts', name: 'items' },
  { path: 'src/content/authored/areas.ts', name: 'areas' },
  { path: 'src/content/authored/worlds.ts', name: 'worlds' },
  { path: 'src/content/authored/actors.ts', name: 'actors' },
  {
    path: 'src/content/authored/actor-states.ts',
    name: 'actorStates',
  },
  {
    path: 'src/content/authored/conversation-topics.ts',
    name: 'conversationTopics',
  },
  { path: 'src/content/authored/nodes.ts', name: 'nodes' },
  { path: 'src/content/authored/quizzes.ts', name: 'quizzes' },
  { path: 'src/content/authored/questions.ts', name: 'questions' },
  { path: 'src/content/authored/puzzles.ts', name: 'puzzles' },
  { path: 'src/content/authored/hazards.ts', name: 'hazards' },
  { path: 'src/content/authored/hints.ts', name: 'hints' },
  {
    path: 'src/content/authored/spec-topics.ts',
    name: 'specTopics',
  },
];

// The eleven spec topics declared by docs/content/spec-topics.yaml, in card
// declaration order. `ai-ethics-and-implications` is a canonical heading but
// `in progress`, so it has no spec topic and is deliberately absent here.
// `tutorial-mechanics` is the approved non-assessed onboarding topic
// (`maxScore 0`, outside the win set; see the topic record in
// docs/coverage/COVERAGE.md).
export const ZONE1_SPEC_TOPIC_IDS: readonly string[] = [
  'switch-to-bit',
  'data-types',
  'number-conversion',
  'character-representation',
  'graphics-representation',
  'sound-representation',
  'data-storage-units',
  'data-compression',
  'algorithms-and-pseudocode',
  'programming-constructs',
  'tutorial-mechanics',
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
    '1-4-concourse/rooms.yaml',
    '1-4-programming-constructs/hazards.yaml',
    '1-4-programming-constructs/hints.yaml',
    '1-4-programming-constructs/npcs.yaml',
    '1-4-programming-constructs/puzzles.yaml',
    '1-4-programming-constructs/quizzes.yaml',
    '1-4-programming-constructs/rooms.yaml',
    'assistance-ward/hazards.yaml',
    'assistance-ward/hints.yaml',
    'assistance-ward/npcs.yaml',
    'assistance-ward/puzzles.yaml',
    'assistance-ward/quizzes.yaml',
    'assistance-ward/rooms.yaml',
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

// Zone A adds a second quizzes, puzzles, hazards and hints card, so these
// collections must be merged across every matching card in declaration order
// exactly as generateContent() merges them (content-toolchain.md §5).
function cardDataAll(
  cards: ParsedCardSet,
  suffix: string,
): readonly Record<string, unknown>[] {
  const matches = cards.cards.filter((entry) => entry.path.endsWith(suffix));
  expect(
    matches.length,
    `the ${suffix} cards must be present in the accepted set`,
  ).toBeGreaterThan(0);
  return matches.map((entry) => entry.data);
}

function idsFromCards(
  cards: ParsedCardSet,
  suffix: string,
  key: string,
): readonly string[] {
  return cardDataAll(cards, suffix).flatMap((data) => idsOf(data[key]));
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
    quizzes: idsFromCards(cards, '/quizzes.yaml', 'quizzes'),
    questions: idsFromCards(cards, '/quizzes.yaml', 'questions'),
    puzzles: idsFromCards(cards, '/puzzles.yaml', 'puzzles'),
    hazards: idsFromCards(cards, '/hazards.yaml', 'hazards'),
    hints: idsFromCards(cards, '/hints.yaml', 'hintSequences'),
    specTopics: idsFromCards(cards, 'spec-topics.yaml', 'topics'),
  };
}

// Approved counts are read from the accepted cards, never from the generated
// bundle under test (HANDOFF §7 records the same whole-game totals).
export function expectedZone1Counts(
  cards: ParsedCardSet,
): Readonly<Record<string, number>> {
  const ids = expectedZone1Ids(cards);
  const counts: Record<string, number> = {};
  for (const [name, entries] of Object.entries(ids)) {
    counts[name] = entries.length;
  }
  return counts;
}

// Dates that survive the handoff belong to the accepted card prose: authoring
// notes are stripped before emission (content-toolchain.md §5). The Zone A
// spec-topic evidence quotes its acceptance date twice; nothing else is dated.
export function acceptedEmittedDates(cards: ParsedCardSet): readonly string[] {
  const datePattern = /\b20\d{2}-\d{2}-\d{2}\b/gu;
  const withoutAuthoring = (value: unknown): unknown => {
    if (Array.isArray(value))
      return value.map((item) => withoutAuthoring(item));
    if (isRecord(value)) {
      return Object.fromEntries(
        Object.entries(value)
          .filter(([key]) => key !== 'authoring')
          .map(([key, child]) => [key, withoutAuthoring(child)]),
      );
    }
    return value;
  };
  return cards.cards.flatMap((card) => {
    const text = JSON.stringify(withoutAuthoring(card.data));
    return text.match(datePattern) ?? [];
  });
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
