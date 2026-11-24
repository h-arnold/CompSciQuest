// Canonical union from npcs.md §2.
export type ResponseStrategy =
  | { readonly kind: 'once' }
  | { readonly kind: 'sequence' } // play in order, repeat the last
  | { readonly kind: 'rotating' }; // cycle; uses injected Random if shuffled
