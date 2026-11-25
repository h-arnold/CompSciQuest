// Canonical entry point from application-and-ui.md §3.3. Generated catalogues
// are committed TypeScript, so assembly is static and needs no parser.
import type { ActorDefinition } from './ActorDefinition';
import type { AreaDefinition } from './AreaDefinition';
import { catalogueOf } from './Catalogue';
import type { ContentBundle } from './ContentBundle';
import type { ItemDefinition } from './ItemDefinition';
import type { RoomDefinition } from './RoomDefinition';
import type { WorldDefinition } from './WorldDefinition';
import { actors } from './authored/actors';
import { actorStates } from './authored/actor-states';
import { conversationTopics } from './authored/conversation-topics';
import { hazards } from './authored/hazards';
import { hints } from './authored/hints';
import { items } from './authored/items';
import { nodes } from './authored/nodes';
import { puzzles } from './authored/puzzles';
import { questions } from './authored/questions';
import { quizzes } from './authored/quizzes';
import { rooms } from './authored/rooms';
import { specTopics as authoredSpecTopics } from './authored/spec-topics';
import { areas } from './authored/areas';
import { worlds } from './authored/worlds';
import type { SpecTopic } from '../core/scoring/SpecTopic';
import type { SpecTopicCatalogue } from '../core/scoring/SpecTopicCatalogue';

// World/area indexing stays in the catalogue, not on SpecTopic entries.
const specTopics: SpecTopicCatalogue = {
  getById(id: string): SpecTopic | undefined {
    return authoredSpecTopics.find((topic) => topic.id === id);
  },
  getByRoomId(roomId: string): readonly SpecTopic[] {
    return authoredSpecTopics.filter((topic) => topic.roomIds.includes(roomId));
  },
  getByAreaId(worldId: string, areaId: string): readonly SpecTopic[] {
    const area = areas.find(
      (entry) => entry.id === areaId && entry.worldId === worldId,
    );
    return area === undefined
      ? []
      : authoredSpecTopics.filter((topic) =>
          topic.roomIds.some((roomId) => area.roomIds.includes(roomId)),
        );
  },
};

// Assembled once from the committed generated modules; callers share the same
// declaration-order catalogues.
const assembled: ContentBundle = {
  worlds: catalogueOf<WorldDefinition>(worlds),
  areas: catalogueOf<AreaDefinition>(areas),
  rooms: catalogueOf<RoomDefinition>(rooms),
  items: catalogueOf<ItemDefinition>(items),
  actors: catalogueOf<ActorDefinition>(actors),
  actorStates: catalogueOf(actorStates),
  conversationTopics: catalogueOf(conversationTopics),
  nodes: catalogueOf(nodes),
  quizzes: catalogueOf(quizzes),
  questions: catalogueOf(questions),
  puzzles: catalogueOf(puzzles),
  hazards: catalogueOf(hazards),
  hints: catalogueOf(hints),
  specTopics,
};

export function loadContent(): ContentBundle {
  return assembled;
}
