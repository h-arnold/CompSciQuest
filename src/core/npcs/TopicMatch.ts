// Canonical union from npcs.md §2.
export type TopicMatch =
  | {
      readonly kind: 'ask' | 'tell' | 'askTell';
      readonly objectIds: readonly string[];
    }
  | { readonly kind: 'give' | 'show'; readonly itemIds: readonly string[] }
  | {
      readonly kind: 'command' | 'special';
      readonly keywords: readonly string[];
    };
