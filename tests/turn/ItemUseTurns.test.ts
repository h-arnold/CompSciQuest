// Turn accounting and browser-facing authored producer acceptance for ITEM-USE-11
// and E2E-3. Every collaborator is injected; no browser or real storage is used.
import { describe, expect, it } from 'vitest';
import type { GameEvent } from '../../src/core/events/GameEvent';
import {
  authoredBundle,
  authoredGame,
  changedFlags,
  FOREMAN_ID,
  gameplaySnapshot,
  producerState,
  readSave,
} from '../fixtures/authored';
import { makePutFixture } from '../fixtures/parser';

interface ProducerAcceptanceCase {
  readonly raw: string;
  readonly roomId: string;
  readonly heldItems: readonly string[];
  readonly flag: string;
  readonly puzzleId?: string;
}

const EXPECTED_FLAGS: readonly string[] = [
  'switch-cooled',
  'switches-set',
  'types-sorted',
  'carry-cleared',
  'hex-read',
  'carries-added',
  'row-shifted',
  'characters-matched',
  'picture-built',
  'sound-sampled',
  'stacks-sorted',
  'archive-packed',
  'overflow-checked',
  'pixels-weighed',
  'badge-scaled',
  'bit-rate-counted',
  'capacity-labelled',
  'compression-chosen',
];

const PRODUCER_CASES: readonly ProducerAcceptanceCase[] = [
  {
    raw: 'use switch gauge on belt',
    roomId: 'room-switch-floor',
    heldItems: ['item-switch-gauge'],
    flag: 'switch-cooled',
  },
  {
    raw: 'use switch gauge on belt',
    roomId: 'room-switch-floor',
    heldItems: ['item-switch-gauge'],
    flag: 'switches-set',
    puzzleId: 'puzzle-set-the-switches',
  },
  {
    raw: 'use nibble card on carry lamp',
    roomId: 'room-hex-deck',
    heldItems: ['item-hex-nibble-card'],
    flag: 'carry-cleared',
  },
  {
    raw: 'use nibble card on nibble groups',
    roomId: 'room-hex-deck',
    heldItems: ['item-hex-nibble-card'],
    flag: 'hex-read',
    puzzleId: 'puzzle-read-nibbles',
  },
  {
    raw: 'use carry token on rightmost column',
    roomId: 'room-hex-deck',
    heldItems: [],
    flag: 'carries-added',
    puzzleId: 'puzzle-add-with-carries',
  },
  {
    raw: 'use shift lever on row',
    roomId: 'room-hex-deck',
    heldItems: [],
    flag: 'row-shifted',
    puzzleId: 'puzzle-shift-the-row',
  },
  {
    raw: 'use ascii stamp on tiles',
    roomId: 'room-character-tiles',
    heldItems: ['item-ascii-stamp'],
    flag: 'characters-matched',
    puzzleId: 'puzzle-match-characters',
  },
  {
    raw: 'use pixel lens on mosaic',
    roomId: 'room-picture-mosaic',
    heldItems: ['item-pixel-lens'],
    flag: 'picture-built',
    puzzleId: 'puzzle-build-mosaic',
  },
  {
    raw: 'use pixel lens on nibble card',
    roomId: 'room-picture-mosaic',
    heldItems: ['item-pixel-lens', 'item-hex-nibble-card'],
    flag: 'pixels-weighed',
    puzzleId: 'puzzle-weigh-the-pixels',
  },
  {
    raw: 'use sample fork on bit-rate desk',
    roomId: 'room-sound-choir',
    heldItems: ['item-sample-fork'],
    flag: 'sound-sampled',
    puzzleId: 'puzzle-tune-sampling',
  },
  {
    raw: 'use sample fork on unit ladder',
    roomId: 'room-storage-stacks',
    heldItems: ['item-sample-fork'],
    flag: 'stacks-sorted',
    puzzleId: 'puzzle-stack-the-bytes',
  },
  {
    raw: 'use compression die',
    roomId: 'room-compression-press',
    heldItems: ['item-compression-die'],
    flag: 'archive-packed',
    puzzleId: 'puzzle-pack-the-archive',
  },
  {
    raw: 'use compression die on ascii stamp',
    roomId: 'room-compression-press',
    heldItems: ['item-compression-die', 'item-ascii-stamp'],
    flag: 'compression-chosen',
    puzzleId: 'puzzle-choose-the-compression',
  },
  {
    raw: 'show foreman switch gauge',
    roomId: 'room-binary-hall',
    heldItems: ['item-switch-gauge'],
    flag: 'overflow-checked',
    puzzleId: 'puzzle-check-the-overflow-register',
  },
  {
    raw: 'show foreman pixel lens',
    roomId: 'room-binary-hall',
    heldItems: ['item-pixel-lens'],
    flag: 'badge-scaled',
    puzzleId: 'puzzle-scale-the-badge',
  },
  {
    raw: 'show foreman sample fork',
    roomId: 'room-binary-hall',
    heldItems: ['item-sample-fork'],
    flag: 'bit-rate-counted',
    puzzleId: 'puzzle-count-the-bit-rate',
  },
  {
    raw: 'show foreman nibble card',
    roomId: 'room-binary-hall',
    heldItems: ['item-hex-nibble-card'],
    flag: 'capacity-labelled',
    puzzleId: 'puzzle-label-the-capacity',
  },
];

const EXPECTED_PUZZLES: readonly string[] = [
  'puzzle-set-the-switches',
  'puzzle-sort-the-data-types',
  'puzzle-read-nibbles',
  'puzzle-add-with-carries',
  'puzzle-shift-the-row',
  'puzzle-match-characters',
  'puzzle-build-mosaic',
  'puzzle-weigh-the-pixels',
  'puzzle-tune-sampling',
  'puzzle-stack-the-bytes',
  'puzzle-pack-the-archive',
  'puzzle-choose-the-compression',
  'puzzle-check-the-overflow-register',
  'puzzle-scale-the-badge',
  'puzzle-count-the-bit-rate',
  'puzzle-label-the-capacity',
];

function hasStateChange(batch: readonly GameEvent[]): boolean {
  return batch.some((event) => event.type !== 'message');
}

function observeProducer(testCase: ProducerAcceptanceCase) {
  const fixture = authoredGame({
    state: producerState(testCase.roomId, testCase.heldItems, {
      ...(testCase.puzzleId && { targetPuzzleId: testCase.puzzleId }),
    }),
  });
  const batch = fixture.game.submit(testCase.raw);
  const failures: string[] = [];
  if (!changedFlags(batch).includes(testCase.flag)) {
    failures.push(`${testCase.raw} did not set ${testCase.flag}`);
  }
  if (testCase.raw.startsWith('show ')) {
    const moves = batch.filter((event) => event.type === 'item-moved');
    if (moves.length !== 1 || moves[0]?.toOwnerId !== FOREMAN_ID) {
      failures.push(
        `${testCase.raw} did not transfer the item once to the foreman`,
      );
    }
  }
  return { batch, failures };
}

function observePut() {
  const sample = authoredBundle.items.all.find((item) =>
    item.name.toLowerCase().includes('decimal sample'),
  );
  if (sample === undefined) {
    return {
      batch: [] as readonly GameEvent[],
      failures: ['the authored decimal sample is missing'],
    };
  }
  const fixture = authoredGame({
    state: producerState('room-binary-hall', [sample.id], {
      targetPuzzleId: 'puzzle-sort-the-data-types',
    }),
  });
  const batch = fixture.game.submit('put decimal sample on real bin');
  const failures: string[] = [];
  if (!changedFlags(batch).includes('types-sorted')) {
    failures.push('PUT did not set types-sorted');
  }
  const moves = batch.filter((event) => event.type === 'item-moved');
  if (moves.length !== 1 || moves[0]?.fromOwnerId !== 'player') {
    failures.push('PUT did not transfer the decimal sample exactly once');
  }
  return { batch, failures };
}

function solvedPuzzles(batch: readonly GameEvent[]): string[] {
  return batch.flatMap((event) =>
    event.type === 'puzzle-solved' ? [event.puzzleId] : [],
  );
}

describe('authored item-command turns', () => {
  it('ITEM-USE-11: USE, PUT and SHOW advance exactly one turn and blocked attempts emit friendly text with gameplay state unchanged', () => {
    const validUse = authoredGame({
      state: producerState('room-switch-floor', ['item-switch-gauge'], {
        targetPuzzleId: 'puzzle-set-the-switches',
      }),
    });
    const useBefore = readSave(validUse.game, validUse.storage).dto.state;
    validUse.bus.batches.length = 0;
    const useBatch = validUse.game.submit('use switch gauge on belt');
    expect(validUse.game.getViewData().turn).toBe(useBefore.turn + 1);
    expect(changedFlags(useBatch)).toContain('switches-set');
    expect(validUse.bus.batches).toEqual([useBatch]);

    const putData = makePutFixture();
    const validPut = authoredGame({
      bundle: putData.bundle,
      state: putData.state,
    });
    const putBefore = readSave(validPut.game, validPut.storage).dto.state;
    validPut.bus.batches.length = 0;
    const putBatch = validPut.game.submit('put brass key in chest');
    expect(validPut.game.getViewData().turn).toBe(putBefore.turn + 1);
    expect(
      putBatch.filter((event) => event.type === 'item-moved'),
    ).toHaveLength(1);
    expect(validPut.bus.batches).toEqual([putBatch]);

    const validShow = authoredGame({
      state: producerState('room-binary-hall', ['item-switch-gauge'], {
        targetPuzzleId: 'puzzle-check-the-overflow-register',
      }),
    });
    const showBefore = readSave(validShow.game, validShow.storage).dto.state;
    validShow.bus.batches.length = 0;
    const showBatch = validShow.game.submit('show foreman switch gauge');
    expect(validShow.game.getViewData().turn).toBe(showBefore.turn + 1);
    expect(showBatch).toContainEqual({
      type: 'item-moved',
      itemId: 'item-switch-gauge',
      fromOwnerId: 'player',
      toOwnerId: FOREMAN_ID,
    });
    expect(validShow.bus.batches).toEqual([showBatch]);

    for (const testCase of [
      {
        raw: 'use moonstone on belt',
        state: producerState('room-switch-floor', ['item-switch-gauge']),
        exactMessage: "I don't understand that.",
      },
      {
        raw: 'use oil can on belt',
        state: producerState('room-switch-floor', ['item-oil-can']),
      },
    ]) {
      const fixture = authoredGame({ state: testCase.state });
      const before = readSave(fixture.game, fixture.storage).dto.state;
      fixture.bus.batches.length = 0;
      const batch = fixture.game.submit(testCase.raw);
      const after = readSave(fixture.game, fixture.storage).dto.state;
      expect(fixture.game.getViewData().turn).toBe(before.turn + 1);
      expect(hasStateChange(batch)).toBe(false);
      expect(
        batch.some(
          (event) => event.type === 'message' && event.text.trim() !== '',
        ),
      ).toBe(true);
      if (testCase.exactMessage !== undefined) {
        expect(batch).toEqual([
          { type: 'message', text: testCase.exactMessage },
        ]);
      }
      expect(gameplaySnapshot(after)).toBe(gameplaySnapshot(before));
      expect(fixture.bus.batches).toEqual([batch]);
    }
  });
});

describe('authored producer acceptance', () => {
  it('E2E-3: the trace-pinned USE, PUT and SHOW commands set all eighteen flags and emit matching puzzle completions', () => {
    const observations = PRODUCER_CASES.map((testCase) =>
      observeProducer(testCase),
    );
    const put = observePut();
    const batches = [...observations.map((entry) => entry.batch), put.batch];
    const failures = [
      ...observations.flatMap((entry) => entry.failures),
      ...put.failures,
    ];
    expect(failures).toEqual([]);
    expect(new Set(batches.flatMap((batch) => changedFlags(batch)))).toEqual(
      new Set(EXPECTED_FLAGS),
    );
    expect(new Set(batches.flatMap((batch) => solvedPuzzles(batch)))).toEqual(
      new Set(EXPECTED_PUZZLES),
    );
  });
});
