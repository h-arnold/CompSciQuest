// Canonical contract from application-and-ui.md §8.
import type { SpecTopic } from './SpecTopic';

export interface SpecTopicCatalogue {
  getById(id: string): SpecTopic | undefined;
  getByRoomId(roomId: string): readonly SpecTopic[];
  getByAreaId(worldId: string, areaId: string): readonly SpecTopic[];
}
