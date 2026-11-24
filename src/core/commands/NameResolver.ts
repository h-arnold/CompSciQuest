// Canonical signature from application-and-ui.md §8.
import type { ContentBundle } from '../../content/ContentBundle';
import type { GameState } from '../GameState';

export interface NameResolver {
  resolve(
    phrase: string,
    state: GameState,
    bundle: ContentBundle,
  ): string | undefined;
}
