// Canonical signature from application-and-ui.md §8.
import type { ContentBundle } from '../../content/ContentBundle';
import type { GameState } from '../GameState';
import { resolveScenery } from './InteractionRules';
import { itemVisibility } from './ItemVisibility';

export interface NameResolver {
  resolve(
    phrase: string,
    state: GameState,
    bundle: ContentBundle,
  ): string | undefined;
}

function hasName(names: readonly string[], phrase: string): boolean {
  return names.some((name) => name.trim().toLowerCase() === phrase);
}

// A single word may stand for the last word of a content-declared name or
// alias (for example "key" for the alias "brass key"). It is still content
// derived: no object ID is hard-coded and ambiguous short forms stay unresolved.
function hasShortName(names: readonly string[], phrase: string): boolean {
  return names.some(
    (name) => name.trim().toLowerCase().split(/\s+/u).at(-1) === phrase,
  );
}

// Content supplies the aliases (application-and-ui.md §5.2); visibility comes
// from the live state. A phrase matching more than one visible object is
// ambiguous and yields nothing — there is deliberately no disambiguation prompt.
export function createNameResolver(): NameResolver {
  return {
    resolve(phrase, state, bundle) {
      const normalised = phrase.trim().toLowerCase();
      if (normalised.length === 0) return;

      const visible = itemVisibility.visibleInRoom(state, bundle);
      const candidates = [
        ...bundle.items.all
          .filter((item) => visible.has(item.id))
          .map((item) => ({
            id: item.id,
            names: [item.name, ...item.aliases],
          })),
        ...bundle.actors.all
          .filter((actor) => state.npcs[actor.id] !== undefined)
          .map((actor) => ({ id: actor.id, names: actor.aliases })),
      ];
      const exact = candidates
        .filter((candidate) => hasName(candidate.names, normalised))
        .map((candidate) => candidate.id);
      if (exact.length === 0) {
        const scenery = resolveScenery(normalised, state);
        if (scenery !== undefined) return scenery;
      }
      const matchesFound =
        exact.length > 0
          ? exact
          : candidates
              .filter((candidate) => hasShortName(candidate.names, normalised))
              .map((candidate) => candidate.id);

      return matchesFound.length === 1 ? matchesFound[0] : undefined;
    },
  };
}
