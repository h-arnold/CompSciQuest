// ENG2-HELP-01: the help list advertises the direction shortcuts as aliases of
// `go` (application-and-ui.md §5.2), so `go n` must produce the same command as
// `go north` and as the bare shortcut `n`. Direction facts come from the
// canonical table; the resolver is observed only through its returned Command.
import { describe, expect, it } from 'vitest';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { Command } from '../../src/core/commands/Command';
import type { GameState } from '../../src/core/GameState';
import { loadCommandTable } from '../fixtures/commandTable';
import { makeParserBundle, makeParserState } from '../fixtures/parser';
import { loadSeam } from '../fixtures/seams';

describe('ENG2-HELP-01 go direction aliases', () => {
  it('ENG2-HELP-01: go <shortcut> resolves like go <full name> and the bare shortcut', async () => {
    type GameCommandResolver = (
      raw: string,
      state: GameState,
      bundle: ContentBundle,
    ) => Command;

    const resolve = await loadSeam<GameCommandResolver>(
      '../../src/application/commandResolution',
      'resolveGameCommand',
      'application-and-ui.md §5.2 — direction shortcuts are aliases of go',
    );
    const { DIRECTIONS } = await loadCommandTable();
    const state = makeParserState();
    const bundle = makeParserBundle();

    for (const direction of DIRECTIONS) {
      expect(
        resolve(`go ${direction.shortcut}`, state, bundle),
        `go ${direction.shortcut} must resolve to ${direction.name}`,
      ).toEqual({ kind: 'go', direction: direction.name });
      expect(
        resolve(`go ${direction.name}`, state, bundle),
        `go ${direction.name} must still resolve`,
      ).toEqual({ kind: 'go', direction: direction.name });
      expect(
        resolve(direction.shortcut, state, bundle),
        `bare ${direction.shortcut} must still resolve`,
      ).toEqual({ kind: 'go', direction: direction.name });
    }
  });
});
