// Deterministic, in-memory content fixtures for the content-validation red
// tests. No game data is read from disk and no real localStorage, wall clock,
// Math.random or network is used. All fixtures are small declared literals.
import { expect } from 'vitest';
import type { ActorDefinition } from '../../src/content/ActorDefinition';
import type { AreaDefinition } from '../../src/content/AreaDefinition';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { ExitDefinition } from '../../src/content/ExitDefinition';
import type { ItemDefinition } from '../../src/content/ItemDefinition';
import type { RoomDefinition } from '../../src/content/RoomDefinition';
import type { WorldDefinition } from '../../src/content/WorldDefinition';
import type { SpecTopic } from '../../src/core/scoring/SpecTopic';
import { localBundle } from './localBundle';
import { catalogueOf, importModule, makeBundle } from './persistence';

export { makeBundle } from './persistence';

// The coverage index is an injected representation of all eleven
// `## Topic: <name>` headings in COVERAGE.md (already converted to topic IDs).
// Static-first means the runtime cannot read that Markdown file, so validation
// takes the index as data (application-and-ui.md §3.3; content-rules.md §7).
// `ai-ethics-and-implications` is `in progress` in COVERAGE.md but is still a
// canonical coverage heading; the two Zone A headings are part of the accepted
// W5 coverage flip recorded in COVERAGE.md and docs/content/status.md.
export type CoverageTopicIds = readonly string[];

export interface ValidateContent {
  (bundle: ContentBundle, coverage?: CoverageTopicIds): readonly string[];
}

export const COVERAGE_TOPIC_IDS: CoverageTopicIds = [
  'switch-to-bit',
  'data-types',
  'number-conversion',
  'character-representation',
  'graphics-representation',
  'sound-representation',
  'data-storage-units',
  'data-compression',
  'ai-ethics-and-implications',
  'algorithms-and-pseudocode',
  'programming-constructs',
];

// Coverage index for the local deterministic fixture only. `makeTopic()` and
// `makeSpecTopic()` carry one synthetic `topic-1` that is not a real coverage
// heading; structural and score gate tests inject it explicitly so they isolate
// their own gate. Generated data always uses COVERAGE_TOPIC_IDS above.
export const LOCAL_FIXTURE_COVERAGE_TOPIC_IDS: CoverageTopicIds = [
  ...COVERAGE_TOPIC_IDS,
  'topic-1',
];
export const MISSING_ID = 'room-missing';
export const ITEM_ALIAS = 'glow';
export const NPC_ALIAS = 'guide';

export async function loadValidator(): Promise<ValidateContent> {
  let module: Record<string, unknown> = {};
  try {
    module = await importModule('../../src/content/validateContent');
  } catch {
    // No implementation yet: fall through to the assertion below so the
    // failure names the missing export rather than a raw resolution error.
  }
  expect(
    module['validateContent'],
    'validateContent must be exported from src/content/validateContent.ts (application-and-ui.md §3.3)',
  ).toBeTypeOf('function');
  return module['validateContent'] as ValidateContent;
}

// ---------------------------------------------------------------------------
// Declared base artefacts — copies of the deterministic stub, never authored.
// ---------------------------------------------------------------------------

const BASE_ROOM: RoomDefinition = {
  id: 'room-stub-start',
  title: 'Stub Starting Room',
  description: 'A deterministic placeholder room for boot and browser tests.',
  exits: [
    { direction: 'north', targetRoomId: 'room-stub-north', preconditions: [] },
  ],
  entryEffects: [],
  score: 0,
};

const BASE_ITEM: ItemDefinition = {
  id: 'lamp',
  name: 'Lamp',
  aliases: [],
  portable: true,
  description: 'A small lamp.',
  initialRoom: 'room-stub-start',
};

const BASE_AREA: AreaDefinition = {
  id: 'area-stub',
  worldId: 'world-stub',
  name: 'Stub Area',
  roomIds: ['room-stub-start', 'room-stub-north'],
  startRoomId: 'room-stub-start',
  lives: 3,
};

const BASE_WORLD: WorldDefinition = {
  id: 'world-stub',
  name: 'Stub World',
  areaIds: ['area-stub'],
  startAreaId: 'area-stub',
  lives: 3,
};

export function makeRoom(
  overrides: Partial<RoomDefinition> = {},
): RoomDefinition {
  return { ...BASE_ROOM, ...overrides };
}

export function makeItem(
  overrides: Partial<ItemDefinition> = {},
): ItemDefinition {
  return { ...BASE_ITEM, ...overrides };
}

export function makeArea(
  overrides: Partial<AreaDefinition> = {},
): AreaDefinition {
  return { ...BASE_AREA, ...overrides };
}

export function makeWorld(
  overrides: Partial<WorldDefinition> = {},
): WorldDefinition {
  return { ...BASE_WORLD, ...overrides };
}

export function makeActor(
  overrides: Partial<ActorDefinition> = {},
): ActorDefinition {
  return { id: 'npc-1', aliases: [], initialStateId: 'idle', ...overrides };
}

export function makeSpecTopic(overrides: Partial<SpecTopic> = {}): SpecTopic {
  return {
    id: 'topic-1',
    title: 'Stub Topic',
    specReference: 'stub section',
    codeLocation: '',
    status: 'covered',
    evidence: 'stub evidence',
    roomIds: ['room-stub-start'],
    maxScore: 10,
    ...overrides,
  };
}

export function bundleWithTopic(topic: SpecTopic): ContentBundle {
  return makeBundle({
    topics: [{ topic, worldId: 'world-stub', areaId: 'area-stub' }],
  });
}

// Both stub rooms are kept so exit targets stay present; only the score varies.
export function scoredRooms(score: number): readonly RoomDefinition[] {
  return localBundle.rooms.all.map((room, index) => ({
    ...room,
    score: index === 0 ? score : 0,
  }));
}

// Invalid content cannot be typed as a canonical ExitDefinition; the single
// assertion is confined to this fixture so production types stay strict.
export function exitWithDirection(direction: string): ExitDefinition {
  return {
    direction,
    targetRoomId: 'room-stub-north',
    preconditions: [],
  } as unknown as ExitDefinition;
}

// ---------------------------------------------------------------------------
// Bundle replacement helpers
// ---------------------------------------------------------------------------

export function withRooms(
  bundle: ContentBundle,
  rooms: readonly RoomDefinition[],
): ContentBundle {
  return { ...bundle, rooms: catalogueOf(rooms) };
}

export function withItems(
  bundle: ContentBundle,
  items: readonly ItemDefinition[],
): ContentBundle {
  return { ...bundle, items: catalogueOf(items) };
}

export function withAreas(
  bundle: ContentBundle,
  areas: readonly AreaDefinition[],
): ContentBundle {
  return { ...bundle, areas: catalogueOf(areas) };
}

export function withWorlds(
  bundle: ContentBundle,
  worlds: readonly WorldDefinition[],
): ContentBundle {
  return { ...bundle, worlds: catalogueOf(worlds) };
}

export function withActors(
  bundle: ContentBundle,
  actors: readonly ActorDefinition[],
): ContentBundle {
  return { ...bundle, actors: catalogueOf(actors) };
}

export function snapshot(bundle: ContentBundle): string {
  return JSON.stringify(bundle);
}
