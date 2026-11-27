// WR2-E1 — arrival nouns resolve to the accepted room scenery prose
// (application-and-ui.md §5; content-bible.md §12;
// topics/assistance-ward.md §6; PLAYTEST-assistance-ward-round2.md §3 finding E).
// The state and bundle are in-memory fixtures only: no YAML, authored prose,
// real storage, wall clock, random source or network is read by this test.
import { describe, expect, it } from 'vitest';
import { resolveGameCommand } from '../../src/application/commandResolution';
import type { Effect } from '../../src/core/effects/Effect';
import type { GameState } from '../../src/core/GameState';
import { loadVerbTable, makeTurnContext } from '../fixtures/parser';
import {
  makeBundle,
  makeRuntimeState,
  makeStateDto,
} from '../fixtures/persistence';
import { messageTexts, stateSnapshot } from '../fixtures/wardW7Fixes';

const ARRIVAL_ROOM_ID = 'room-arrival';

// Verbatim from the accepted docs/content/entry-interface/rooms.yaml
// `room-arrival` description; the code-owned scenery entry must reuse it.
const ARRIVAL_SCENERY_TEXT =
  'The register lies open, a mark beside your name. The AI reads it in the flat voice of a machine that has read it a thousand times: attention not satisfied.';

const UNKNOWN_TEXT = "I don't understand that.";

const ARRIVAL_PHRASES: readonly string[] = [
  'examine register',
  'examine attendance record',
  'look at the record',
  'examine the mark',
];

function arrivalState(): GameState {
  return makeRuntimeState(
    makeStateDto({
      player: {
        position: {
          worldId: 'world-fixture-ward',
          areaId: 'area-fixture-ward',
          roomId: ARRIVAL_ROOM_ID,
        },
        inventory: [],
        lives: 3,
      },
      rooms: { [ARRIVAL_ROOM_ID]: { inventory: [] } },
      flags: {},
    }),
  );
}

describe('WR2-E1 — arrival nouns resolve to scenery (application-and-ui.md §5)', () => {
  for (const raw of ARRIVAL_PHRASES) {
    it(`WR2-E1: '${raw}' returns one in-world scenery message and changes no state`, async () => {
      const table = await loadVerbTable();
      const state = arrivalState();
      const bundle = makeBundle({ emptyContent: true });
      const before = stateSnapshot(state);
      const command = resolveGameCommand(raw, state, bundle);
      const handler = table.getCommandHandler(command);
      expect(handler, 'the resolved verb must have a handler').toBeTypeOf(
        'function',
      );

      const effects: readonly Effect[] =
        handler?.(command, makeTurnContext({ state, bundle, command })) ?? [];

      expect(messageTexts(effects)).toEqual([ARRIVAL_SCENERY_TEXT]);
      expect(effects).toHaveLength(1);
      expect(messageTexts(effects).includes(UNKNOWN_TEXT)).toBe(false);
      expect(command.kind).toBe('examine');
      expect(stateSnapshot(state)).toBe(before);
    });
  }
});

// Verification of the review minor: `record` and `mark` are aliases of the
// same single room-arrival SCENERY entry. hasMatchingName() folds all aliases
// into one boolean per entry via names.some(...), and resolveScenery() counts
// matching entries, so several matching aliases still resolve unambiguously.
describe('VERIFICATION — bare record and mark aliases resolve to the same arrival scenery', () => {
  it("VERIFICATION: 'examine record' returns one in-world scenery message and changes no state", async () => {
    const table = await loadVerbTable();
    const state = arrivalState();
    const bundle = makeBundle({ emptyContent: true });
    const before = stateSnapshot(state);
    const raw = 'examine record';
    const command = resolveGameCommand(raw, state, bundle);
    const handler = table.getCommandHandler(command);
    expect(handler, 'the resolved verb must have a handler').toBeTypeOf(
      'function',
    );

    const effects: readonly Effect[] =
      handler?.(command, makeTurnContext({ state, bundle, command })) ?? [];

    expect(messageTexts(effects)).toEqual([ARRIVAL_SCENERY_TEXT]);
    expect(effects).toHaveLength(1);
    expect(messageTexts(effects).includes(UNKNOWN_TEXT)).toBe(false);
    expect(command.kind).toBe('examine');
    expect(stateSnapshot(state)).toBe(before);
  });

  it("VERIFICATION: 'examine mark' returns one in-world scenery message and changes no state", async () => {
    const table = await loadVerbTable();
    const state = arrivalState();
    const bundle = makeBundle({ emptyContent: true });
    const before = stateSnapshot(state);
    const raw = 'examine mark';
    const command = resolveGameCommand(raw, state, bundle);
    const handler = table.getCommandHandler(command);
    expect(handler, 'the resolved verb must have a handler').toBeTypeOf(
      'function',
    );

    const effects: readonly Effect[] =
      handler?.(command, makeTurnContext({ state, bundle, command })) ?? [];

    expect(messageTexts(effects)).toEqual([ARRIVAL_SCENERY_TEXT]);
    expect(effects).toHaveLength(1);
    expect(messageTexts(effects).includes(UNKNOWN_TEXT)).toBe(false);
    expect(command.kind).toBe('examine');
    expect(stateSnapshot(state)).toBe(before);
  });
});
