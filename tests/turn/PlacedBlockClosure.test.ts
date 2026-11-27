// WR4-B1 / WR4-B2 contracts for the placed practice block, from
// application-and-ui.md §5.1/§5.2 and shared-rules.md (transfer-item
// one-owner invariant). All items, rooms and state are in-memory fixtures:
// no authored content, YAML, browser storage, wall clock or Math.random.
import { beforeEach, describe, expect, it } from 'vitest';
import { resolveGameCommand } from '../../src/application/commandResolution';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { ItemDefinition } from '../../src/content/ItemDefinition';
import type { Command } from '../../src/core/commands/Command';
import type { Effect } from '../../src/core/effects/Effect';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { GameState, GameStateDto } from '../../src/core/GameState';
import {
  FakeRandom,
  catalogueOf,
  loadEffectApplier,
  makeBundle,
  makeRuntimeState,
  makeStateDto,
} from '../fixtures/persistence';
import type { EffectApplierLike } from '../fixtures/persistence';
import {
  CHEST_ID,
  KEY_A,
  START_ROOM,
  loadVerbTable,
  makeParserBundle,
  makeParserState,
  makePutFixture,
  makeTurnContext,
} from '../fixtures/parser';
import type { VerbTableLike } from '../fixtures/parser';

const BLOCK_ID = 'item-assistance-practice-block';
const CABINET_ID = 'item-assistance-practice-cabinet';
const KEY_ID = 'item-assistance-practice-key';
const DEMONSTRATION_ROOM = 'room-assistance-demonstration';
const BLOCK_DESCRIPTION = 'A small practice block with a chalk cross.';
const PUT_MESSAGE = 'You put the Practice block in the Practice cabinet.';
const EXAMINE_MESSAGE = `${BLOCK_DESCRIPTION} It is in the Practice cabinet.`;
const TAKE_MESSAGE = 'You take the Practice block from the Practice cabinet.';

interface Fixture {
  readonly bundle: ContentBundle;
  readonly state: GameState;
}

interface HandlerResult {
  readonly command: Command;
  readonly effects: readonly Effect[];
}

function practiceBundle(): ContentBundle {
  const block: ItemDefinition = {
    id: BLOCK_ID,
    name: 'Practice block',
    aliases: ['practice block', 'block'],
    portable: true,
    description: BLOCK_DESCRIPTION,
    initialRoom: DEMONSTRATION_ROOM,
  };
  const cabinet: ItemDefinition = {
    id: CABINET_ID,
    name: 'Practice cabinet',
    aliases: ['practice cabinet', 'cabinet'],
    portable: false,
    description: 'A chalk outline marks where the practice block belongs.',
    initialRoom: DEMONSTRATION_ROOM,
  };
  const key: ItemDefinition = {
    id: KEY_ID,
    name: 'Practice key',
    aliases: ['practice key', 'key'],
    portable: true,
    description: 'A small practice key.',
    initialRoom: DEMONSTRATION_ROOM,
  };
  return {
    ...makeBundle(),
    rooms: catalogueOf([
      {
        id: DEMONSTRATION_ROOM,
        title: 'Demonstration Ward',
        description: 'A practice bench and a practice cabinet.',
        exits: [],
        entryEffects: [],
        score: 0,
      },
    ]),
    items: catalogueOf([block, cabinet, key]),
  };
}

// Precondition reached after `take practice block`, `take practice key`,
// `unlock practice key practice cabinet` and `open practice cabinet`.
function placedBlockFixture(): Fixture {
  const dto: GameStateDto = makeStateDto({
    player: {
      position: {
        worldId: 'world-stub',
        areaId: 'area-stub',
        roomId: DEMONSTRATION_ROOM,
      },
      inventory: [BLOCK_ID, KEY_ID],
      lives: 3,
    },
    rooms: { [DEMONSTRATION_ROOM]: { inventory: [CABINET_ID] } },
    flags: {
      [`container-unlocked:${CABINET_ID}`]: true,
      [`container-open:${CABINET_ID}`]: true,
    },
    progress: [
      {
        worldId: 'world-stub',
        areaId: 'area-stub',
        visitedRooms: [DEMONSTRATION_ROOM],
        completedTopics: [],
        earnedScore: 0,
        maxScore: 10,
      },
    ],
  });
  return { bundle: practiceBundle(), state: makeRuntimeState(dto) };
}

function messageTexts(effects: readonly Effect[]): readonly string[] {
  return effects
    .filter(
      (effect): effect is Extract<Effect, { kind: 'message' }> =>
        effect.kind === 'message',
    )
    .map((effect) => effect.text);
}

function transferEffects(
  effects: readonly Effect[],
): readonly Extract<Effect, { kind: 'transfer-item' }>[] {
  return effects.filter(
    (effect): effect is Extract<Effect, { kind: 'transfer-item' }> =>
      effect.kind === 'transfer-item',
  );
}

// Only message and transfer-item effects are allowed in this flow: no flag,
// score, life, gate, topic, quiz or movement effect may piggyback on it.
function expectNoSideEffects(effects: readonly Effect[]): void {
  const unexpected = effects.filter(
    (effect) => effect.kind !== 'message' && effect.kind !== 'transfer-item',
  );
  expect(unexpected, 'no flag, score, gate, life or progress effect').toEqual(
    [],
  );
}

function snapshot(state: GameState): string {
  return JSON.stringify({
    player: state.player,
    rooms: state.rooms,
    npcs: state.npcs,
    flags: state.flags,
    hazards: state.hazards,
    puzzles: state.puzzles,
    hints: state.hints,
    quiz: state.quiz,
    progress: state.progress,
    status: state.status,
    counters: state.counters,
  });
}

function resolveAndHandle(
  raw: string,
  fixture: Fixture,
  table: VerbTableLike,
): HandlerResult {
  const command = resolveGameCommand(raw, fixture.state, fixture.bundle);
  const handler = table.getCommandHandler(command);
  if (!handler) {
    throw new Error(
      `getCommandHandler must return a handler for ${command.kind}`,
    );
  }
  const effects = handler(
    command,
    makeTurnContext({ state: fixture.state, bundle: fixture.bundle, command }),
  );
  return { command, effects };
}

function applyEffects(
  applier: EffectApplierLike,
  effects: readonly Effect[],
): readonly GameEvent[] {
  return effects.flatMap((effect) => [...applier.apply(effect)]);
}

async function applierFor(state: GameState): Promise<EffectApplierLike> {
  return loadEffectApplier(state, { random: new FakeRandom() });
}

describe('WR4-B1: a placed practice block stays findable and retrievable', () => {
  let table: VerbTableLike;

  beforeEach(async () => {
    table = await loadVerbTable();
  });

  it('WR4-B1: put and place a practice block emit one in-world placement message and transfer to the cabinet owner', async () => {
    const expectedCommand: Command = {
      kind: 'put',
      itemId: BLOCK_ID,
      targetId: CABINET_ID,
    };

    for (const raw of [
      'put practice block in practice cabinet',
      'place practice block in practice cabinet',
    ]) {
      const fixture = placedBlockFixture();
      const applier = await applierFor(fixture.state);
      const before = snapshot(fixture.state);

      const result = resolveAndHandle(raw, fixture, table);

      expect(result.command, `${raw} must resolve to a put command`).toEqual(
        expectedCommand,
      );
      expect(
        messageTexts(result.effects),
        'exactly one friendly result names the cabinet as the destination',
      ).toEqual([PUT_MESSAGE]);
      expect(transferEffects(result.effects)).toEqual([
        {
          kind: 'transfer-item',
          itemId: BLOCK_ID,
          fromOwnerId: 'player',
          toOwnerId: CABINET_ID,
        },
      ]);
      expectNoSideEffects(result.effects);
      expect(snapshot(fixture.state), 'handlers never mutate state').toBe(
        before,
      );

      const events = applyEffects(applier, result.effects);
      expect(events).toContainEqual({
        type: 'item-moved',
        itemId: BLOCK_ID,
        fromOwnerId: 'player',
        toOwnerId: CABINET_ID,
      });
      expect(events).toContainEqual({ type: 'message', text: PUT_MESSAGE });

      // shared-rules.md: exactly one owner after the transfer.
      expect(fixture.state.player.inventory).not.toContain(BLOCK_ID);
      expect(fixture.state.rooms[DEMONSTRATION_ROOM]?.inventory).not.toContain(
        BLOCK_ID,
      );
      expect(fixture.state.rooms[CABINET_ID]?.inventory).toEqual([BLOCK_ID]);
    }
  });

  it('WR4-B1: after placement, examine practice block reports that the block is in the cabinet', async () => {
    const fixture = placedBlockFixture();
    const applier = await applierFor(fixture.state);
    const placement = resolveAndHandle(
      'put practice block in practice cabinet',
      fixture,
      table,
    );
    applyEffects(applier, placement.effects);

    const before = snapshot(fixture.state);
    const result = resolveAndHandle('examine practice block', fixture, table);

    expect(
      result.command,
      'a block held by a visible cabinet remains a resolvable object',
    ).toEqual({ kind: 'examine', targetId: BLOCK_ID });
    expect(messageTexts(result.effects)).toEqual([EXAMINE_MESSAGE]);
    expectNoSideEffects(result.effects);
    expect(snapshot(fixture.state)).toBe(before);
  });

  it('WR4-B1: after placement, take/get/short-name forms retrieve the block from the cabinet', async () => {
    for (const raw of [
      'take practice block',
      'get practice block',
      'take block',
    ]) {
      const fixture = placedBlockFixture();
      const applier = await applierFor(fixture.state);
      const placement = resolveAndHandle(
        'put practice block in practice cabinet',
        fixture,
        table,
      );
      applyEffects(applier, placement.effects);

      const before = snapshot(fixture.state);
      const result = resolveAndHandle(raw, fixture, table);

      expect(result.command, `${raw} must resolve to a take command`).toEqual({
        kind: 'take',
        itemId: BLOCK_ID,
      });
      expect(
        messageTexts(result.effects),
        'in-world retrieval feedback, not a parser denial',
      ).toEqual([TAKE_MESSAGE]);
      expect(transferEffects(result.effects)).toEqual([
        {
          kind: 'transfer-item',
          itemId: BLOCK_ID,
          fromOwnerId: CABINET_ID,
          toOwnerId: 'player',
        },
      ]);
      expectNoSideEffects(result.effects);
      expect(snapshot(fixture.state)).toBe(before);

      const events = applyEffects(applier, result.effects);
      expect(events).toContainEqual({
        type: 'item-moved',
        itemId: BLOCK_ID,
        fromOwnerId: CABINET_ID,
        toOwnerId: 'player',
      });
      expect(events).toContainEqual({ type: 'message', text: TAKE_MESSAGE });
      expect(fixture.state.player.inventory).toContain(BLOCK_ID);
      expect(fixture.state.rooms[CABINET_ID]?.inventory).not.toContain(
        BLOCK_ID,
      );
      expect(fixture.state.rooms[DEMONSTRATION_ROOM]?.inventory).not.toContain(
        BLOCK_ID,
      );

      // No flag, score, life, gate, progress or position change from retrieval.
      const afterState = JSON.parse(snapshot(fixture.state)) as GameStateDto;
      const beforeState = JSON.parse(before) as GameStateDto;
      expect(afterState.flags).toEqual(beforeState.flags);
      expect(afterState.progress).toEqual(beforeState.progress);
      expect(afterState.player.lives).toBe(beforeState.player.lives);
      expect(afterState.player.position).toEqual(beforeState.player.position);
    }
  });

  it('WR4-B1: a block put in a closed cabinet is still taken from its real owner', async () => {
    const fixture: Fixture = {
      bundle: practiceBundle(),
      state: makeRuntimeState(
        makeStateDto({
          player: {
            position: {
              worldId: 'world-stub',
              areaId: 'area-stub',
              roomId: DEMONSTRATION_ROOM,
            },
            inventory: [BLOCK_ID, KEY_ID],
            lives: 3,
          },
          rooms: { [DEMONSTRATION_ROOM]: { inventory: [CABINET_ID] } },
          // The cabinet is present and unlocked, but container-open is absent.
          flags: { [`container-unlocked:${CABINET_ID}`]: true },
          progress: [
            {
              worldId: 'world-stub',
              areaId: 'area-stub',
              visitedRooms: [DEMONSTRATION_ROOM],
              completedTopics: [],
              earnedScore: 0,
              maxScore: 10,
            },
          ],
        }),
      ),
    };
    const applier = await applierFor(fixture.state);

    const placement = resolveAndHandle(
      'put practice block in practice cabinet',
      fixture,
      table,
    );
    expect(transferEffects(placement.effects)).toEqual([
      {
        kind: 'transfer-item',
        itemId: BLOCK_ID,
        fromOwnerId: 'player',
        toOwnerId: CABINET_ID,
      },
    ]);
    applyEffects(applier, placement.effects);
    expect(fixture.state.rooms[CABINET_ID]?.inventory).toContain(BLOCK_ID);

    const before = snapshot(fixture.state);
    const result = resolveAndHandle('take practice block', fixture, table);

    expect(result.command).toEqual({ kind: 'take', itemId: BLOCK_ID });
    // The specific in-container wording is gated on the open flag; this row
    // pins only that a real transfer happens with the generic message.
    expect(messageTexts(result.effects)).toEqual(['Taken.']);
    expect(transferEffects(result.effects)).toEqual([
      {
        kind: 'transfer-item',
        itemId: BLOCK_ID,
        fromOwnerId: CABINET_ID,
        toOwnerId: 'player',
      },
    ]);
    expectNoSideEffects(result.effects);
    expect(snapshot(fixture.state)).toBe(before);

    const events = applyEffects(applier, result.effects);
    expect(events).toContainEqual({
      type: 'item-moved',
      itemId: BLOCK_ID,
      fromOwnerId: CABINET_ID,
      toOwnerId: 'player',
    });
    expect(fixture.state.player.inventory).toContain(BLOCK_ID);
    expect(fixture.state.rooms[CABINET_ID]?.inventory).not.toContain(BLOCK_ID);
  });
});

describe('WR4-B2: taught ward commands keep their existing behaviour', () => {
  // Unlock, open/close, bell, NPC recovery and quiz paths are covered by the
  // named baselines tests/parser/W7UnlockCommands.test.ts::W7F-03/W7F-04,
  // tests/parser/VerbHandlers.test.ts::P-PARSE-19/P-TAKE-01,
  // tests/parser/ItemUseProducers.test.ts and
  // tests/turn/AuthoredWinPath.test.ts::E2E-4. This test pins only the two
  // overlapping put/take contracts with the local parser fixtures.
  it('WR4-B2: putting the brass key in the chest and taking it back keep the generic feedback', async () => {
    const table = await loadVerbTable();
    const putData = makePutFixture();
    const putApplier = await applierFor(putData.state);
    const beforePut = JSON.parse(snapshot(putData.state)) as GameStateDto;

    const putResult = resolveAndHandle(
      'put brass key in chest',
      putData,
      table,
    );

    expect(putResult.command).toEqual({
      kind: 'put',
      itemId: KEY_A,
      targetId: CHEST_ID,
    });
    expect(messageTexts(putResult.effects)).toEqual(['You put it down.']);
    expect(transferEffects(putResult.effects)).toEqual([
      {
        kind: 'transfer-item',
        itemId: KEY_A,
        fromOwnerId: 'player',
        toOwnerId: CHEST_ID,
      },
    ]);
    applyEffects(putApplier, putResult.effects);
    expect(putData.state.rooms[CHEST_ID]?.inventory).toContain(KEY_A);
    const afterPut = JSON.parse(snapshot(putData.state)) as GameStateDto;
    expect(afterPut.flags).toEqual(beforePut.flags);
    expect(afterPut.progress).toEqual(beforePut.progress);

    const takeState = makeParserState({
      player: {
        position: {
          worldId: 'world-stub',
          areaId: 'area-stub',
          roomId: START_ROOM,
        },
        inventory: [],
        lives: 3,
      },
      rooms: { [START_ROOM]: { inventory: [KEY_A, CHEST_ID] } },
    });
    const takeFixture: Fixture = {
      bundle: makeParserBundle(),
      state: takeState,
    };
    const takeApplier = await applierFor(takeState);
    const beforeTake = JSON.parse(snapshot(takeState)) as GameStateDto;

    const takeResult = resolveAndHandle('take brass key', takeFixture, table);

    expect(takeResult.command).toEqual({ kind: 'take', itemId: KEY_A });
    expect(messageTexts(takeResult.effects)).toEqual(['Taken.']);
    expect(transferEffects(takeResult.effects)).toEqual([
      {
        kind: 'transfer-item',
        itemId: KEY_A,
        fromOwnerId: START_ROOM,
        toOwnerId: 'player',
      },
    ]);
    applyEffects(takeApplier, takeResult.effects);
    expect(takeState.player.inventory).toContain(KEY_A);
    const afterTake = JSON.parse(snapshot(takeState)) as GameStateDto;
    expect(afterTake.flags).toEqual(beforeTake.flags);
    expect(afterTake.progress).toEqual(beforeTake.progress);
  });
});
