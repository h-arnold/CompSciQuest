// Red-first acceptance for the user-approved conditional `use` seam
// (ward-w6-generation, W6S-01 to W6S-04). Every collaborator is injected by
// authoredGame(): MemoryStorage, FixedClock, FakeRandom and RecordingBus from
// tests/fixtures/persistence.ts. No wall clock, real storage, Math.random,
// network, generation call or production file is used.

import { describe, expect, it } from 'vitest';
import type { ItemDefinition } from '../../src/content/ItemDefinition';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { GameStateDto } from '../../src/core/GameState';
import {
  authoredBundle,
  authoredGame,
  authoredState,
  gameplaySnapshot,
  readSave,
} from '../fixtures/authored';

const RECORDS_ROOM = 'room-assistance-records';
const DEMONSTRATION_ROOM = 'room-assistance-demonstration';
const DIAL_ID = 'item-assistance-calibration-dial';
const BELL_ID = 'item-assistance-practice-bell';
const DIAL_FLAG = 'assistance-dial-calibrated';
const WARD_PUZZLE = 'puzzle-calibrate-assistance';

const DIAL_COMMAND = 'use assistance dial';
const BELL_COMMANDS: readonly string[] = ['use practice bell', 'use demo bell'];

const REQUIRED_FLAGS: readonly string[] = [
  'nia-observation-recovered',
  'mateo-reading-recovered',
  'priya-reasoning-recovered',
  'kofi-operation-recovered',
  'quiz-passed:quiz-assistance-orientation',
];

// Exact 2026-11-27 sign-off recorded in docs/content/content-bible.md §12;
// the blocked wording is the round-2 superseding approval, verbatim from the
// accepted card field `useText.blocked` in docs/content/assistance-ward/rooms.yaml.
// The bell deliberately adds no new string: it reuses its authored description.
const APPROVED_DIAL_SUCCESS =
  'The dial gives a small, reluctant click. All five sockets are lit; the teaching ports have stopped pretending to be decoration.';
const APPROVED_DIAL_BLOCKED =
  "The dial does not move. Lit sockets show records already entered; dark ones still need attention. OBSERVE needs Nia's observation card, READ needs Mateo's instruction card, REASON needs Priya's reason, OPERATE needs Kofi's practice cycle, and ORIENTATION PASS needs the practice quiz. Fill any remaining sockets, then try again.";
const APPROVED_BELL_DESCRIPTION =
  'You find the practice bell screwed to the bench, with a dark felt striker beside it. Its label reads HARMLESS PRACTICE.';

interface AuthoredUseText {
  readonly success?: string;
  readonly blocked?: string;
}

// ItemDefinition now declares useText. This narrow local guard still reads the
// field structurally into a small optional shape instead of forcing the full
// declared type.
function useTextOf(item: ItemDefinition): AuthoredUseText | undefined {
  const candidate: unknown = item;
  if (typeof candidate !== 'object' || candidate === null) return undefined;
  const raw: unknown = (candidate as Record<string, unknown>)['useText'];
  if (typeof raw !== 'object' || raw === null) return undefined;
  const value = raw as {
    readonly success?: unknown;
    readonly blocked?: unknown;
  };
  return {
    ...(typeof value.success === 'string' && { success: value.success }),
    ...(typeof value.blocked === 'string' && { blocked: value.blocked }),
  };
}

function authoredItem(id: string): ItemDefinition {
  const item = authoredBundle.items.getById(id);
  if (item === undefined) {
    throw new Error(`Authored item '${id}' is missing from the catalogue.`);
  }
  return item;
}

function prerequisiteFlags(
  missing: readonly string[] = [],
): Record<string, boolean> {
  return Object.fromEntries(
    REQUIRED_FLAGS.filter((flag) => !missing.includes(flag)).map((flag) => [
      flag,
      true,
    ]),
  );
}

function messages(batch: readonly GameEvent[]): string[] {
  return batch.flatMap((event) =>
    event.type === 'message' ? [event.text] : [],
  );
}

function flagChanges(
  batch: readonly GameEvent[],
): ReadonlyArray<{ readonly flag: string; readonly value: boolean }> {
  return batch
    .filter(
      (event): event is Extract<GameEvent, { readonly type: 'flag-changed' }> =>
        event.type === 'flag-changed',
    )
    .map((event) => ({ flag: event.flag, value: event.value }));
}

function withoutDialFlag(state: GameStateDto): GameStateDto {
  const flags = { ...state.flags };
  delete flags[DIAL_FLAG];
  return { ...state, flags };
}

interface UseObservation {
  readonly batch: readonly GameEvent[];
  readonly published: readonly (readonly GameEvent[])[];
  readonly before: GameStateDto;
  readonly after: GameStateDto;
}

function observeUse(
  raw: string,
  state: ReturnType<typeof authoredState>,
): UseObservation {
  const fixture = authoredGame({ state });
  const before = readSave(fixture.game, fixture.storage).dto.state;
  fixture.bus.batches.length = 0;
  const batch = fixture.game.submit(raw);
  const published = [...fixture.bus.batches];
  const after = readSave(fixture.game, fixture.storage).dto.state;
  return { batch, published, before, after };
}

function solvedWardPuzzle(): Record<string, { readonly phase: 'solved' }> {
  // Isolate the seam from the puzzle's own onSolve effects: walkthrough C2.10
  // keeps tutorial-complete, its message and topic completion owned by the
  // puzzle, not by this producer.
  return { [WARD_PUZZLE]: { phase: 'solved' } };
}

describe('authored conditional use seam', () => {
  it('W6S-01: all five prerequisites set assistance-dial-calibrated once with one approved success message and no other state change', () => {
    const observed = observeUse(
      DIAL_COMMAND,
      authoredState({
        roomId: RECORDS_ROOM,
        flags: prerequisiteFlags(),
        puzzles: solvedWardPuzzle(),
      }),
    );

    expect(messages(observed.batch)).toEqual([APPROVED_DIAL_SUCCESS]);
    expect(flagChanges(observed.batch)).toEqual([
      { flag: DIAL_FLAG, value: true },
    ]);
    expect(observed.batch.some((event) => event.type === 'lives-changed')).toBe(
      false,
    );
    expect(observed.batch.some((event) => event.type === 'score-changed')).toBe(
      false,
    );
    expect(observed.batch.some((event) => event.type === 'item-moved')).toBe(
      false,
    );
    expect(observed.after.flags[DIAL_FLAG]).toBe(true);
    expect(gameplaySnapshot(withoutDialFlag(observed.after))).toBe(
      gameplaySnapshot(withoutDialFlag(observed.before)),
    );
    expect(observed.published).toEqual([observed.batch]);
  });

  it('W6S-02: each missing prerequisite blocks the dial with the approved text, leaves state unchanged and succeeds on retry', () => {
    for (const missing of REQUIRED_FLAGS) {
      const observed = observeUse(
        DIAL_COMMAND,
        authoredState({
          roomId: RECORDS_ROOM,
          flags: prerequisiteFlags([missing]),
        }),
      );

      expect(messages(observed.batch)).toEqual([APPROVED_DIAL_BLOCKED]);
      expect(
        observed.batch.filter((event) => event.type !== 'message'),
      ).toEqual([]);
      expect(observed.after.flags[DIAL_FLAG]).not.toBe(true);
      expect(gameplaySnapshot(observed.after)).toBe(
        gameplaySnapshot(observed.before),
      );
      expect(observed.published).toEqual([observed.batch]);

      const repaired = authoredState({
        ...observed.before,
        roomId: RECORDS_ROOM,
        flags: { ...observed.before.flags, [missing]: true },
        puzzles: solvedWardPuzzle(),
      });
      const retry = observeUse(DIAL_COMMAND, repaired);
      expect(messages(retry.batch)).toEqual([APPROVED_DIAL_SUCCESS]);
      expect(flagChanges(retry.batch)).toEqual([
        { flag: DIAL_FLAG, value: true },
      ]);
    }
  });

  it('W6S-03: both ratified bell aliases ring harmlessly with no state change', () => {
    const bell = authoredItem(BELL_ID);
    expect(bell.description).toBe(APPROVED_BELL_DESCRIPTION);

    for (const raw of BELL_COMMANDS) {
      const observed = observeUse(
        raw,
        authoredState({ roomId: DEMONSTRATION_ROOM }),
      );

      expect(messages(observed.batch)).toEqual([bell.description]);
      expect(
        observed.batch.filter((event) => event.type !== 'message'),
      ).toEqual([]);
      expect(gameplaySnapshot(observed.after)).toBe(
        gameplaySnapshot(observed.before),
      );
      expect(observed.published).toEqual([observed.batch]);
    }
  });

  it('W6S-04: approved text comes from authored fields and the runtime message matches those fields', () => {
    const dial = authoredItem(DIAL_ID);
    const bell = authoredItem(BELL_ID);
    const dialUseText = useTextOf(dial);

    expect(dialUseText?.success).toBe(APPROVED_DIAL_SUCCESS);
    expect(dialUseText?.blocked).toBe(APPROVED_DIAL_BLOCKED);
    expect(useTextOf(bell)).toBeUndefined();
    expect(bell.description).toBe(APPROVED_BELL_DESCRIPTION);

    const success = observeUse(
      DIAL_COMMAND,
      authoredState({
        roomId: RECORDS_ROOM,
        flags: prerequisiteFlags(),
        puzzles: solvedWardPuzzle(),
      }),
    );
    const blocked = observeUse(
      DIAL_COMMAND,
      authoredState({
        roomId: RECORDS_ROOM,
        flags: prerequisiteFlags(['kofi-operation-recovered']),
      }),
    );
    const ringing = observeUse(
      'use practice bell',
      authoredState({ roomId: DEMONSTRATION_ROOM }),
    );

    expect(messages(success.batch)).toEqual([dialUseText?.success]);
    expect(messages(blocked.batch)).toEqual([dialUseText?.blocked]);
    expect(messages(ringing.batch)).toEqual([bell.description]);
  });
});
