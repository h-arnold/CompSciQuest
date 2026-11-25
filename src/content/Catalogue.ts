// Canonical declaration-order registry from application-and-ui.md §3.1.
export interface Catalogue<T> {
  readonly all: readonly T[]; // declaration order, never object-key order
  getById(id: string): T | undefined;
}

// Canonical factory for a declaration-order catalogue (application-and-ui.md
// §3.1). Runtime assembly and the authoring adapter both use this owner.
export function catalogueOf<T extends { readonly id: string }>(
  all: readonly T[],
): Catalogue<T> {
  return {
    all,
    getById(id: string): T | undefined {
      return all.find((entry) => entry.id === id);
    },
  };
}
