// Canonical declaration-order registry from application-and-ui.md §3.1.
export interface Catalogue<T> {
  readonly all: readonly T[]; // declaration order, never object-key order
  getById(id: string): T | undefined;
}
