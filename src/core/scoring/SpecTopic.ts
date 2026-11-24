// Canonical contract from architecture.md §7. worldId/areaId indexing is owned
// by SpecTopicCatalogue (application-and-ui.md §8), not repeated on the topic.
export type SpecStatus = 'not started' | 'in progress' | 'covered';

export interface SpecTopic {
  readonly id: string; // topic name from "## Topic: <name>"
  readonly title: string;
  readonly specReference: string; // PDF section/page
  readonly codeLocation: string; // path::symbol; empty when not mapped
  readonly status: SpecStatus;
  readonly evidence: string; // empty when not mapped yet
  readonly roomIds: readonly string[]; // a topic may span several rooms
  readonly maxScore: number;
}
