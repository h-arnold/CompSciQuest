// Small deterministic in-memory bundle that mirrors the retired two-room stub.
// It is a test fixture only: no test imports the retired module and no data is
// read from disk. Empty mechanics catalogues keep validation fixtures honest.
import { catalogueOf } from '../../src/content/Catalogue';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { ActorDefinition } from '../../src/content/ActorDefinition';
import type { ItemDefinition } from '../../src/content/ItemDefinition';
import type { RoomDefinition } from '../../src/content/RoomDefinition';
import type { ActorState } from '../../src/core/npcs/ActorState';
import type { ConversationNode } from '../../src/core/npcs/ConversationNode';
import type { ConversationTopic } from '../../src/core/npcs/ConversationTopic';
import type { Hazard } from '../../src/core/hazards/Hazard';
import type { HintSequence } from '../../src/core/hints/HintSequence';
import type { Puzzle } from '../../src/core/puzzles/Puzzle';
import type { Quiz } from '../../src/core/combat/Quiz';
import type { QuizQuestion } from '../../src/core/combat/QuizQuestion';
import type { SpecTopic } from '../../src/core/scoring/SpecTopic';

export const LOCAL_WORLD_ID = 'world-stub';
export const LOCAL_AREA_ID = 'area-stub';
export const LOCAL_START_ROOM_ID = 'room-stub-start';
export const LOCAL_NORTH_ROOM_ID = 'room-stub-north';

export const localRooms: readonly RoomDefinition[] = [
  {
    id: LOCAL_START_ROOM_ID,
    title: 'Stub Starting Room',
    description: 'A deterministic placeholder room for boot and browser tests.',
    exits: [
      {
        direction: 'north',
        targetRoomId: LOCAL_NORTH_ROOM_ID,
        preconditions: [],
      },
    ],
    entryEffects: [],
    score: 0,
  },
  {
    id: LOCAL_NORTH_ROOM_ID,
    title: 'Stub Northern Room',
    description: 'The second placeholder room; return south to the start.',
    exits: [
      {
        direction: 'south',
        targetRoomId: LOCAL_START_ROOM_ID,
        preconditions: [],
      },
    ],
    entryEffects: [],
    score: 0,
  },
];

export const localBundle: ContentBundle = {
  worlds: catalogueOf([
    {
      id: LOCAL_WORLD_ID,
      name: 'Stub World',
      areaIds: [LOCAL_AREA_ID],
      startAreaId: LOCAL_AREA_ID,
      lives: 3,
    },
  ]),
  areas: catalogueOf([
    {
      id: LOCAL_AREA_ID,
      worldId: LOCAL_WORLD_ID,
      name: 'Stub Area',
      roomIds: [LOCAL_START_ROOM_ID, LOCAL_NORTH_ROOM_ID],
      startRoomId: LOCAL_START_ROOM_ID,
      lives: 3,
    },
  ]),
  rooms: catalogueOf(localRooms),
  items: catalogueOf<ItemDefinition>([]),
  actors: catalogueOf<ActorDefinition>([]),
  actorStates: catalogueOf<ActorState>([]),
  conversationTopics: catalogueOf<ConversationTopic>([]),
  nodes: catalogueOf<ConversationNode>([]),
  quizzes: catalogueOf<Quiz>([]),
  questions: catalogueOf<QuizQuestion>([]),
  puzzles: catalogueOf<Puzzle>([]),
  hazards: catalogueOf<Hazard>([]),
  hints: catalogueOf<HintSequence>([]),
  specTopics: {
    getById(): undefined {
      return;
    },
    getByRoomId(): readonly SpecTopic[] {
      return [];
    },
    getByAreaId(): readonly SpecTopic[] {
      return [];
    },
  },
};
