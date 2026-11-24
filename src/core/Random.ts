// Injected random port from shared-rules.md §7 / application-and-ui.md §8.
// No Math.random() in src/core; the seeded implementation lives outside core.
export interface Random {
  nextInt(maxExclusive: number): number;
}
