// Canonical union from npcs.md §3.
export type ResolvedTopic =
  | { readonly kind: 'object'; readonly objectId: string }
  | { readonly kind: 'keyword'; readonly topicId: string }
  | { readonly kind: 'free-text'; readonly text: string };
