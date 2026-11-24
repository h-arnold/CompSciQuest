// Canonical persisted shape from storage-schema.md §3.2.
export interface NpcStateDto {
  readonly stateId: string;
  readonly knownTopics: readonly string[];
  readonly inventory: readonly string[];
  readonly activeNodeId?: string; // omitted when no node is active
  readonly topicUses: Readonly<Record<string, number>>;
}
