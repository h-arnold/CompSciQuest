import { describe, expect, it } from 'vitest';
import { createGame } from '../../src/application/Game';
import type { AreaDefinition } from '../../src/content/AreaDefinition';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { RoomDefinition } from '../../src/content/RoomDefinition';
import type { WorldDefinition } from '../../src/content/WorldDefinition';
import { createEffectApplier } from '../../src/core/effects/EffectApplier';
import type { GameEvent } from '../../src/core/events/GameEvent';
import {
  createFromDto,
  type AreaProgress,
  type GameState,
} from '../../src/core/GameState';
import type { Puzzle } from '../../src/core/puzzles/Puzzle';
import { createScoreTracker } from '../../src/core/scoring/ScoreTracker';
import type { SpecTopic } from '../../src/core/scoring/SpecTopic';
import type { SpecTopicCatalogue } from '../../src/core/scoring/SpecTopicCatalogue';
import {
  catalogueOf,
  FakeRandom,
  makeBundle,
  makeGameDependencies,
  makeRuntimeState,
  makeStateDto,
  roundTripThroughJson,
} from '../fixtures/persistence';

const ROOM_A1 = 'room-a1';
const ROOM_A2 = 'room-a2';
const ROOM_B1 = 'room-b1';
const ROOM_B2 = 'room-b2';
const TOPIC_ID = 'topic-b';
const PUZZLE_ID = 'puzzle-b';

function room(id: string, score = 0): RoomDefinition {
  return {
    id,
    title: id,
    description: `${id} description.`,
    exits: [],
    entryEffects: [],
    score,
  };
}

function areaBundle(): ContentBundle {
  const areas: readonly AreaDefinition[] = [
    {
      id: 'area-a',
      worldId: 'world-a',
      name: 'Area A',
      roomIds: [ROOM_A1, ROOM_A2],
      startRoomId: ROOM_A1,
      lives: 3,
    },
    {
      id: 'area-b',
      worldId: 'world-b',
      name: 'Area B',
      roomIds: [ROOM_B1, ROOM_B2],
      startRoomId: ROOM_B1,
      lives: 3,
    },
  ];
  const worlds: readonly WorldDefinition[] = [
    {
      id: 'world-a',
      name: 'World A',
      areaIds: ['area-a'],
      startAreaId: 'area-a',
      lives: 3,
    },
    {
      id: 'world-b',
      name: 'World B',
      areaIds: ['area-b'],
      startAreaId: 'area-b',
      lives: 3,
    },
  ];
  const topic: SpecTopic = {
    id: TOPIC_ID,
    title: 'Topic B',
    specReference: 'stub section',
    codeLocation: '',
    status: 'covered',
    evidence: 'A deterministic scored topic.',
    roomIds: [ROOM_B2],
    maxScore: 10,
  };
  const specTopics: SpecTopicCatalogue = {
    getById: (id) => (id === TOPIC_ID ? topic : undefined),
    getByRoomId: (roomId) => (topic.roomIds.includes(roomId) ? [topic] : []),
    getByAreaId: (worldId, areaId) => {
      const area = areas.find(
        (entry) => entry.worldId === worldId && entry.id === areaId,
      );
      return area !== undefined && area.roomIds.includes(ROOM_B2)
        ? [topic]
        : [];
    },
  };
  const puzzle: Puzzle = {
    id: PUZZLE_ID,
    requirements: [],
    onSolve: [],
    topicId: TOPIC_ID,
    score: 4,
    dependsOn: [],
  };
  return {
    ...makeBundle({ emptyContent: true }),
    worlds: catalogueOf(worlds),
    areas: catalogueOf(areas),
    rooms: catalogueOf([
      room(ROOM_A1),
      room(ROOM_A2),
      room(ROOM_B1),
      room(ROOM_B2, 3),
    ]),
    puzzles: catalogueOf([puzzle]),
    specTopics,
  };
}

function progress(
  worldId: string,
  areaId: string,
  earnedScore: number,
  visitedRooms: readonly string[] = [],
): AreaProgress {
  return {
    worldId,
    areaId,
    visitedRooms,
    completedTopics: [],
    earnedScore,
    maxScore: 10,
  };
}

function stateAt(
  bundle: ContentBundle,
  roomId: string,
  rows: readonly AreaProgress[],
): GameState {
  const area = bundle.areas.all.find((entry) => entry.roomIds.includes(roomId));
  if (area === undefined) throw new Error(`No area owns ${roomId}.`);
  const roomEntries = bundle.rooms.all.map((entry) => [
    entry.id,
    { inventory: [] },
  ]);
  const rooms = Object.fromEntries(roomEntries);
  return makeRuntimeState(
    makeStateDto({
      player: {
        position: { worldId: area.worldId, areaId: area.id, roomId },
        inventory: [],
        lives: 3,
      },
      rooms,
      puzzles: { [PUZZLE_ID]: { phase: 'unsolved' } },
      progress: rows,
    }),
  );
}

function entered(bundle: ContentBundle, roomId: string): GameEvent {
  const definition = bundle.rooms.getById(roomId);
  if (definition === undefined) throw new Error(`Missing room ${roomId}.`);
  return {
    type: 'room-entered',
    room: {
      id: definition.id,
      title: definition.title,
      description: definition.description,
      exits: definition.exits.map((exit) => exit.direction),
    },
  };
}

describe('W7R-AREA-01 bundle position and matching progress rows', () => {
  it('W7R-AREA-01: move-player derives worldId, areaId and roomId from the bundle', () => {
    const bundle = areaBundle();
    const state = stateAt(bundle, ROOM_B1, [
      progress('world-a', 'area-a', 5, [ROOM_A1]),
      progress('world-b', 'area-b', 2, [ROOM_B1]),
    ]);
    const applier = createEffectApplier(state, {
      bundle,
      random: new FakeRandom(),
    });

    const events = applier.apply({
      kind: 'move-player',
      roomId: ROOM_A2,
      reason: 'cross-area test move',
    });

    expect(state.player.position).toEqual({
      worldId: 'world-a',
      areaId: 'area-a',
      roomId: ROOM_A2,
    });
    expect(events).toEqual([entered(bundle, ROOM_A2)]);
  });

  it('W7R-AREA-01: room and puzzle awards use the matching world/area row', () => {
    const bundle = areaBundle();
    const decoy = progress('world-a', 'area-a', 5, [ROOM_A1]);
    const matching = progress('world-b', 'area-b', 2, [ROOM_B1]);
    const state = stateAt(bundle, ROOM_B2, [decoy, matching]);
    const tracker = createScoreTracker(state, { bundle });

    const observed = tracker.observe([
      entered(bundle, ROOM_B2),
      { type: 'puzzle-solved', puzzleId: PUZZLE_ID },
    ]);

    expect(decoy.earnedScore).toBe(5);
    expect(decoy.visitedRooms).toEqual([ROOM_A1]);
    expect(matching.earnedScore).toBe(9);
    expect(matching.visitedRooms).toEqual([ROOM_B1, ROOM_B2]);
    expect(
      observed
        .filter((event) => event.type === 'score-changed')
        .map((event) => event.reason),
    ).toEqual([`room:${ROOM_B2}`, `puzzle:${PUZZLE_ID}`]);
    expect(tracker.getTotal()).toBe(14);
  });

  it('W7R-AREA-01: the first room or puzzle award creates the matching progress row', () => {
    const bundle = areaBundle();
    const state = stateAt(bundle, ROOM_B2, []);
    const tracker = createScoreTracker(state, { bundle });

    tracker.observe([
      entered(bundle, ROOM_B2),
      { type: 'puzzle-solved', puzzleId: PUZZLE_ID },
    ]);

    expect(state.progress).toEqual([
      {
        worldId: 'world-b',
        areaId: 'area-b',
        visitedRooms: [ROOM_B2],
        completedTopics: [],
        earnedScore: 7,
        maxScore: 10,
      },
    ]);
    expect(tracker.getTotal()).toBe(7);
  });

  it('W7R-AREA-01: a puzzle award alone creates the matching progress row', () => {
    const bundle = areaBundle();
    const state = stateAt(bundle, ROOM_B2, []);
    const tracker = createScoreTracker(state, { bundle });

    tracker.observe([{ type: 'puzzle-solved', puzzleId: PUZZLE_ID }]);

    expect(state.progress).toEqual([
      {
        worldId: 'world-b',
        areaId: 'area-b',
        visitedRooms: [],
        completedTopics: [],
        earnedScore: 4,
        maxScore: 10,
      },
    ]);
  });

  it('W7R-AREA-01: complete-topic writes only to the matching progress row', () => {
    const bundle = areaBundle();
    const decoy = progress('world-a', 'area-a', 5, [ROOM_A1]);
    const matching = progress('world-b', 'area-b', 2, [ROOM_B1]);
    const state = stateAt(bundle, ROOM_B2, [decoy, matching]);
    const applier = createEffectApplier(state, {
      bundle,
      random: new FakeRandom(),
    });

    const events = applier.apply({ kind: 'complete-topic', topicId: TOPIC_ID });

    expect(events).toEqual([{ type: 'topic-completed', topicId: TOPIC_ID }]);
    expect(decoy.completedTopics).toEqual([]);
    expect(matching.completedTopics).toEqual([TOPIC_ID]);
  });

  it('W7R-AREA-01: empty-progress completion creates one restorable row without awarding score', () => {
    const bundle = areaBundle();
    const state = stateAt(bundle, ROOM_A1, []);
    const applier = createEffectApplier(state, {
      bundle,
      random: new FakeRandom(),
    });
    const expectedCurrent = {
      worldId: 'world-b',
      areaId: 'area-b',
      visitedRooms: [],
      completedTopics: [TOPIC_ID],
      earnedScore: 0,
      maxScore: 10,
    };

    applier.apply({
      kind: 'move-player',
      roomId: ROOM_B2,
      reason: 'same-turn cross-area completion',
    });
    const events = applier.apply({ kind: 'complete-topic', topicId: TOPIC_ID });

    expect(events).toEqual([{ type: 'topic-completed', topicId: TOPIC_ID }]);
    expect(state.progress).toEqual([expectedCurrent]);
    expect(state.score).toBe(0);
    expect(
      state.progress.filter(
        (entry) => entry.worldId === 'world-b' && entry.areaId === 'area-b',
      ),
    ).toHaveLength(1);
    expect(
      new Set(state.progress.map((entry) => `${entry.worldId}/${entry.areaId}`))
        .size,
    ).toBe(state.progress.length);

    applier.apply({ kind: 'complete-topic', topicId: TOPIC_ID });

    expect(state.progress).toEqual([expectedCurrent]);
    expect(state.score).toBe(0);

    const restored = createFromDto(roundTripThroughJson(state));

    expect(restored.progress).toEqual([expectedCurrent]);
    expect(restored.score).toBe(0);
    expect(
      restored.progress.find(
        (entry) => entry.worldId === 'world-b' && entry.areaId === 'area-b',
      ),
    ).toEqual(expectedCurrent);
  });

  it('W7R-AREA-01: completion preserves an unrelated row and creates no duplicate world/area pair', () => {
    const bundle = areaBundle();
    const unrelated = progress('world-a', 'area-a', 5, [ROOM_A1]);
    const unrelatedBefore = JSON.stringify(unrelated);
    const state = stateAt(bundle, ROOM_B2, [unrelated]);
    const applier = createEffectApplier(state, {
      bundle,
      random: new FakeRandom(),
    });
    const expectedCurrent = {
      worldId: 'world-b',
      areaId: 'area-b',
      visitedRooms: [],
      completedTopics: [TOPIC_ID],
      earnedScore: 0,
      maxScore: 10,
    };

    applier.apply({ kind: 'complete-topic', topicId: TOPIC_ID });

    expect(state.progress).toEqual([unrelated, expectedCurrent]);
    expect(JSON.stringify(unrelated)).toBe(unrelatedBefore);
    expect(state.score).toBe(5);
    expect(
      new Set(state.progress.map((entry) => `${entry.worldId}/${entry.areaId}`))
        .size,
    ).toBe(state.progress.length);

    applier.apply({ kind: 'complete-topic', topicId: TOPIC_ID });

    expect(state.progress).toEqual([unrelated, expectedCurrent]);
    expect(JSON.stringify(unrelated)).toBe(unrelatedBefore);
    expect(state.score).toBe(5);
  });

  it('W7R-AREA-01: area views use the world/area pair and cap visitedRoomCount', () => {
    const areas: readonly AreaDefinition[] = [
      {
        id: 'shared-area',
        worldId: 'world-a',
        name: 'Area A',
        roomIds: [ROOM_A1],
        startRoomId: ROOM_A1,
        lives: 3,
      },
      {
        id: 'shared-area',
        worldId: 'world-b',
        name: 'Area B',
        roomIds: [ROOM_B1, ROOM_B2],
        startRoomId: ROOM_B1,
        lives: 3,
      },
    ];
    const worlds: readonly WorldDefinition[] = [
      {
        id: 'world-a',
        name: 'World A',
        areaIds: ['shared-area'],
        startAreaId: 'shared-area',
        lives: 3,
      },
      {
        id: 'world-b',
        name: 'World B',
        areaIds: ['shared-area'],
        startAreaId: 'shared-area',
        lives: 3,
      },
    ];
    const emptyTopics: SpecTopicCatalogue = {
      getById: () => {
        return;
      },
      getByRoomId: () => [],
      getByAreaId: () => [],
    };
    const bundle: ContentBundle = {
      ...makeBundle({ emptyContent: true }),
      worlds: catalogueOf(worlds),
      areas: catalogueOf(areas),
      rooms: catalogueOf([room(ROOM_A1), room(ROOM_B1), room(ROOM_B2)]),
      specTopics: emptyTopics,
    };
    const state = stateAt(bundle, ROOM_B1, [
      progress('world-a', 'shared-area', 0, [ROOM_A1]),
      progress('world-b', 'shared-area', 0, [ROOM_B1, ROOM_B2, ROOM_B1]),
    ]);
    const game = createGame(
      makeGameDependencies({ bundle, initialState: state }),
    );

    const views = game.getViewData().areas;

    expect(views[1]).toMatchObject({
      worldId: 'world-b',
      areaId: 'shared-area',
      worldName: 'World B',
      areaName: 'Area B',
      visitedRoomCount: 2,
      roomCount: 2,
    });
    expect(views.every((view) => view.visitedRoomCount <= view.roomCount)).toBe(
      true,
    );
  });
});
