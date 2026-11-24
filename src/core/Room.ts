// Canonical signature from application-and-ui.md §8.
import type { Exit } from './Exit';

export interface Room {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly exits: readonly Exit[];
}
