// USE/PUT/SHOW producer contracts from walkthrough.md §2/§3/§4,
// application-and-ui.md §5/§9 and shared-rules.md §5. Handlers and systems are
// observed through effects and events; no producer representation is prescribed.
import { describe, expect, it } from 'vitest';
import type { Command } from '../../src/core/commands/Command';
import { getCommandHandler } from '../../src/core/commands/verbs/index';
import type { Effect } from '../../src/core/effects/Effect';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { GameState } from '../../src/core/GameState';
import {
  authoredBundle,
  authoredGame,
  changedFlags,
  eventTypes,
  FOREMAN_ID,
  gameplaySnapshot,
  producerState,
  readSave,
} from '../fixtures/authored';
import {
  CHEST_ID,
  KEY_A,
  makePutFixture,
  makeTurnContext,
} from '../fixtures/parser';

interface ProducerCase {
  readonly raw: string;
  readonly roomId: string;
  readonly heldItems: readonly string[];
  readonly flag: string;
  readonly puzzleId?: string;
  readonly topicId?: string;
  readonly extraFlags?: Readonly<Record<string, boolean>>;
}

function expectProducer(
  batch: readonly GameEvent[],
  flag: string,
  puzzleId?: string,
  topicId?: string,
): void {
  expect(changedFlags(batch)).toContain(flag);
  if (puzzleId !== undefined) {
    const activated = eventTypes(batch).indexOf('puzzle-activated');
    const solved = eventTypes(batch).indexOf('puzzle-solved');
    expect(activated).toBeGreaterThanOrEqual(0);
    expect(solved).toBeGreaterThan(activated);
    expect(batch).toContainEqual({ type: 'puzzle-solved', puzzleId });
  }
  if (topicId !== undefined) {
    expect(batch).toContainEqual({ type: 'topic-completed', topicId });
  }
}

function submitCase(testCase: ProducerCase) {
  const state = producerState(testCase.roomId, testCase.heldItems, {
    ...(testCase.puzzleId && { targetPuzzleId: testCase.puzzleId }),
    ...(testCase.extraFlags && { extraFlags: testCase.extraFlags }),
  });
  const { game, bus } = authoredGame({ state });
  const batch = game.submit(testCase.raw);
  expect(bus.batches).toEqual([batch]);
  return { batch, game, state };
}

function itemOwners(state: GameState, itemId: string): string[] {
  return [
    ...(state.player.inventory.includes(itemId) ? ['player'] : []),
    ...Object.entries(state.rooms)
      .filter(([, room]) => room.inventory.includes(itemId))
      .map(([roomId]) => roomId),
    ...Object.entries(state.npcs)
      .filter(([, npc]) => npc.inventory.includes(itemId))
      .map(([actorId]) => actorId),
  ];
}

describe('authored item-use command resolution', () => {
  it('ITEM-USE-01: USE, PUT and SHOW resolve canonical command shapes and unknown phrases leave gameplay state unchanged', async () => {
    const commands: Command[] = [];
    const dispatch = (
      command: Command,
      context: ReturnType<typeof makeTurnContext>,
    ): readonly Effect[] => {
      commands.push(command);
      return getCommandHandler(command)?.(command, context) ?? [];
    };
    const useState = producerState('room-picture-mosaic', [
      'item-pixel-lens',
      'item-hex-nibble-card',
    ]);
    const useFixture = authoredGame({
      state: useState,
      overrides: { dispatch },
    });
    useFixture.game.submit('use pixel lens on nibble card');

    const putFixtureData = makePutFixture();
    const putFixture = authoredGame({
      bundle: putFixtureData.bundle,
      state: putFixtureData.state,
      overrides: { dispatch },
    });
    putFixture.game.submit('put brass key in chest');

    const showState = producerState('room-switch-floor', ['item-switch-gauge']);
    const showFixture = authoredGame({
      state: showState,
      overrides: { dispatch },
    });
    showFixture.game.submit('show foreman switch gauge');

    expect(commands).toEqual([
      {
        kind: 'use',
        itemId: 'item-pixel-lens',
        targetId: 'item-hex-nibble-card',
      },
      { kind: 'put', itemId: KEY_A, targetId: CHEST_ID },
      { kind: 'show', actorId: FOREMAN_ID, itemId: 'item-switch-gauge' },
    ]);

    const handler = getCommandHandler(commands[0]!);
    expect(handler).toBeTypeOf('function');
    if (handler !== undefined) {
      const before = gameplaySnapshot(useState.toDto());
      const effects = handler(
        commands[0]!,
        makeTurnContext({ state: useState, bundle: authoredBundle }),
      );
      expect(effects.length).toBeGreaterThan(0);
      expect(gameplaySnapshot(useState.toDto())).toBe(before);
    }

    const unknownState = producerState('room-switch-floor', [
      'item-switch-gauge',
    ]);
    const unknownFixture = authoredGame({ state: unknownState });
    const before = readSave(unknownFixture.game, unknownFixture.storage).dto
      .state;
    const unknownBatch = unknownFixture.game.submit('use moonstone on belt');
    const after = readSave(unknownFixture.game, unknownFixture.storage).dto
      .state;
    expect(unknownBatch).toEqual([
      { type: 'message', text: "I don't understand that." },
    ]);
    expect(gameplaySnapshot(after)).toBe(gameplaySnapshot(before));
    expect(unknownFixture.game.getViewData().turn).toBe(before.turn + 1);
  });
});

describe('authored USE producers', () => {
  it('ITEM-USE-02: the switch gauge sets both switch flags, solves the switch puzzle and completes number conversion', () => {
    const { batch } = submitCase({
      raw: 'use switch gauge on belt',
      roomId: 'room-switch-floor',
      heldItems: ['item-switch-gauge'],
      flag: 'switches-set',
      puzzleId: 'puzzle-set-the-switches',
      topicId: 'number-conversion',
    });
    expect(changedFlags(batch)).toEqual(['switch-cooled', 'switches-set']);
    expectProducer(
      batch,
      'switches-set',
      'puzzle-set-the-switches',
      'number-conversion',
    );
  });

  it('ITEM-USE-03: the four hex-deck uses set their trace-pinned action flags without handler state writes', () => {
    const cases: readonly ProducerCase[] = [
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
        topicId: 'number-conversion',
      },
      {
        raw: 'use carry token on rightmost column',
        roomId: 'room-hex-deck',
        heldItems: [],
        flag: 'carries-added',
        puzzleId: 'puzzle-add-with-carries',
        topicId: 'number-conversion',
      },
      {
        raw: 'use shift lever on row',
        roomId: 'room-hex-deck',
        heldItems: [],
        flag: 'row-shifted',
        puzzleId: 'puzzle-shift-the-row',
        topicId: 'number-conversion',
      },
    ];
    for (const testCase of cases) {
      const { batch } = submitCase(testCase);
      expectProducer(batch, testCase.flag, testCase.puzzleId, testCase.topicId);
    }
  });

  it('ITEM-USE-04: the ASCII stamp sets characters-matched before the matching puzzle is solved', () => {
    const { batch } = submitCase({
      raw: 'use ascii stamp on tiles',
      roomId: 'room-character-tiles',
      heldItems: ['item-ascii-stamp'],
      flag: 'characters-matched',
      puzzleId: 'puzzle-match-characters',
      topicId: 'character-representation',
    });
    const types = eventTypes(batch);
    expect(types).toContain('flag-changed');
    expect(types).toContain('puzzle-solved');
    expect(types.indexOf('flag-changed')).toBeLessThan(
      types.indexOf('puzzle-solved'),
    );
    expectProducer(batch, 'characters-matched', 'puzzle-match-characters');
  });

  it('ITEM-USE-05: the pixel lens sets picture-built and pixels-weighed by action rather than possession', () => {
    for (const testCase of [
      {
        raw: 'use pixel lens on mosaic',
        flag: 'picture-built',
        puzzleId: 'puzzle-build-mosaic',
      },
      {
        raw: 'use pixel lens on nibble card',
        flag: 'pixels-weighed',
        puzzleId: 'puzzle-weigh-the-pixels',
      },
    ] as const) {
      const { batch, game } = submitCase({
        raw: testCase.raw,
        roomId: 'room-picture-mosaic',
        heldItems: ['item-pixel-lens', 'item-hex-nibble-card'],
        flag: testCase.flag,
        puzzleId: testCase.puzzleId,
        topicId: 'graphics-representation',
      });
      expectProducer(
        batch,
        testCase.flag,
        testCase.puzzleId,
        'graphics-representation',
      );
      expect(game.getViewData().turn).toBe(1);
    }

    const possessionOnly = producerState(
      'room-picture-mosaic',
      ['item-pixel-lens'],
      { targetPuzzleId: 'puzzle-build-mosaic' },
    );
    const { game } = authoredGame({ state: possessionOnly });
    expect(game.submit('look')).not.toContainEqual({
      type: 'puzzle-solved',
      puzzleId: 'puzzle-build-mosaic',
    });
  });

  it('ITEM-USE-06: the sample fork sets sound-sampled and stacks-sorted for their chain puzzles', () => {
    for (const testCase of [
      {
        raw: 'use sample fork on bit-rate desk',
        roomId: 'room-sound-choir',
        flag: 'sound-sampled',
        puzzleId: 'puzzle-tune-sampling',
      },
      {
        raw: 'use sample fork on unit ladder',
        roomId: 'room-storage-stacks',
        flag: 'stacks-sorted',
        puzzleId: 'puzzle-stack-the-bytes',
      },
    ] as const) {
      const { batch } = submitCase({
        raw: testCase.raw,
        roomId: testCase.roomId,
        heldItems: ['item-sample-fork'],
        flag: testCase.flag,
        puzzleId: testCase.puzzleId,
      });
      expectProducer(batch, testCase.flag, testCase.puzzleId);
      expect(batch).not.toContainEqual({
        type: 'flag-changed',
        flag: 'bit-rate-counted',
        value: true,
      });
    }
  });

  it('ITEM-USE-07: the compression die works without a target and on the ASCII stamp', () => {
    for (const testCase of [
      {
        raw: 'use compression die',
        flag: 'archive-packed',
        puzzleId: 'puzzle-pack-the-archive',
      },
      {
        raw: 'use compression die on ascii stamp',
        flag: 'compression-chosen',
        puzzleId: 'puzzle-choose-the-compression',
      },
    ] as const) {
      const { batch } = submitCase({
        raw: testCase.raw,
        roomId: 'room-compression-press',
        heldItems: ['item-compression-die', 'item-ascii-stamp'],
        flag: testCase.flag,
        puzzleId: testCase.puzzleId,
        topicId: 'data-compression',
      });
      expectProducer(
        batch,
        testCase.flag,
        testCase.puzzleId,
        'data-compression',
      );
    }
  });
});

describe('authored PUT and SHOW producers', () => {
  it('ITEM-USE-08: PUT moves the decimal sample once to the real bin and sets types-sorted', () => {
    const sample = authoredBundle.items.all.find((item) =>
      item.name.toLowerCase().includes('decimal sample'),
    );
    if (sample === undefined) {
      throw new Error(
        'The authored decimal sample from walkthrough.md §2 step 5 is missing.',
      );
    }
    const { batch, game, state } = submitCase({
      raw: 'put decimal sample on real bin',
      roomId: 'room-binary-hall',
      heldItems: [sample.id],
      flag: 'types-sorted',
      puzzleId: 'puzzle-sort-the-data-types',
      topicId: 'data-types',
    });
    expectProducer(
      batch,
      'types-sorted',
      'puzzle-sort-the-data-types',
      'data-types',
    );
    const moves = batch.filter((event) => event.type === 'item-moved');
    expect(moves).toHaveLength(1);
    expect(moves[0]).toMatchObject({
      itemId: sample.id,
      fromOwnerId: 'player',
    });
    if (moves[0]?.type === 'item-moved') {
      expect(moves[0].toOwnerId).not.toBe('player');
      expect(itemOwners(state, sample.id)).toEqual([moves[0].toOwnerId]);
    }
    expect(game.getViewData().turn).toBe(1);
  });

  it('ITEM-USE-09: each foreman SHOW sets its leaf flag and transfers the shown item exactly once', () => {
    const cases: readonly {
      readonly itemId: string;
      readonly raw: string;
      readonly flag: string;
      readonly puzzleId: string;
    }[] = [
      {
        itemId: 'item-switch-gauge',
        raw: 'show foreman switch gauge',
        flag: 'overflow-checked',
        puzzleId: 'puzzle-check-the-overflow-register',
      },
      {
        itemId: 'item-pixel-lens',
        raw: 'show foreman pixel lens',
        flag: 'badge-scaled',
        puzzleId: 'puzzle-scale-the-badge',
      },
      {
        itemId: 'item-sample-fork',
        raw: 'show foreman sample fork',
        flag: 'bit-rate-counted',
        puzzleId: 'puzzle-count-the-bit-rate',
      },
      {
        itemId: 'item-hex-nibble-card',
        raw: 'show foreman nibble card',
        flag: 'capacity-labelled',
        puzzleId: 'puzzle-label-the-capacity',
      },
    ];
    for (const testCase of cases) {
      const { batch, state } = submitCase({
        raw: testCase.raw,
        roomId: 'room-binary-hall',
        heldItems: [testCase.itemId],
        flag: testCase.flag,
        puzzleId: testCase.puzzleId,
      });
      expectProducer(batch, testCase.flag, testCase.puzzleId);
      const moves = batch.filter((event) => event.type === 'item-moved');
      expect(moves).toEqual([
        {
          type: 'item-moved',
          itemId: testCase.itemId,
          fromOwnerId: 'player',
          toOwnerId: FOREMAN_ID,
        },
      ]);
      expect(itemOwners(state, testCase.itemId)).toEqual([FOREMAN_ID]);
    }
  });
});
