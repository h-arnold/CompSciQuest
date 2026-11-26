// Deterministic red tests for the settled issue-15 rule: the area-entry life
// reset is gated on every quiz and puzzle of the DEPARTED area being solved.
// Sources: ENGINE_ISSUES.md Batch E2 issue 15 + implementation note (lines
// 65-67), PLAYTEST_ISSUES.md issue 15, walkthrough.md §8.2 via
// src/core/effects/EffectApplier.ts areaChangeEvents().
import { describe, expect, it } from 'vitest';
import type { AreaDefinition } from '../../src/content/AreaDefinition';
import { catalogueOf } from '../../src/content/Catalogue';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { RoomDefinition } from '../../src/content/RoomDefinition';
import type { Puzzle } from '../../src/core/puzzles/Puzzle';
import type { Quiz } from '../../src/core/combat/Quiz';
import type { GameStateDto } from '../../src/core/GameState';
import type { GameEvent } from '../../src/core/events/GameEvent';
import { createEffectApplier } from '../../src/core/effects/EffectApplier';
import {
  FakeRandom,
  makeBundle,
  makeRuntimeState,
  makeStateDto,
  makeTopic,
  type TopicIndexEntry,
} from '../fixtures/persistence';

const WORLD_ID = 'world-stub';
const DEPARTED_AREA_ID = 'area-departed';
const DESTINATION_AREA_ID = 'area-destination';
const DEPARTED_ROOM_ID = 'room-departed';
const DEPARTED_INNER_ROOM_ID = 'room-departed-inner';
const DESTINATION_ROOM_ID = 'room-destination';
const DEPARTED_TOPIC_ID = 'topic-departed';
const DESTINATION_TOPIC_ID = 'topic-destination';
const QUIZ_ID = 'quiz-departed';
const PUZZLE_ID = 'puzzle-departed';
const DESTINATION_QUIZ_ID = 'quiz-destination';
const DESTINATION_PUZZLE_ID = 'puzzle-destination';
const UNMAPPED_PUZZLE_ID = 'puzzle-unmapped';
const LIVES_BEFORE_MOVE = 2;
const LIVES_ON_ARRIVAL = 4;

function areaOf(
  id: string,
  roomIds: readonly string[],
  lives: number,
): AreaDefinition {
  return {
    id,
    worldId: WORLD_ID,
    name: `Area ${id}`,
    roomIds,
    startRoomId: roomIds[0] ?? id,
    lives,
  };
}

function roomOf(id: string): RoomDefinition {
  return {
    id,
    title: `Room ${id}`,
    description: `Description for ${id}.`,
    exits: [],
    entryEffects: [],
    score: 0,
  };
}

function quizOf(id: string, topicId: string): Quiz {
  return {
    id,
    actorId: 'npc-1',
    topicId,
    score: 0,
    questionIds: ['question-1'],
    passMark: 1,
    onPass: [],
    onFail: [],
  };
}

function puzzleOf(id: string, topicId?: string): Puzzle {
  return {
    id,
    requirements: [],
    onSolve: [],
    ...(topicId && { topicId }),
    score: 0,
    dependsOn: [],
  };
}

interface BundleOptions {
  readonly topics?: readonly TopicIndexEntry[];
  readonly quizzes?: readonly Quiz[];
  readonly puzzles?: readonly Puzzle[];
}

function gatedBundle(options: BundleOptions = {}): ContentBundle {
  const topics = options.topics ?? [
    makeTopic({ id: DEPARTED_TOPIC_ID }, WORLD_ID, DEPARTED_AREA_ID),
    makeTopic({ id: DESTINATION_TOPIC_ID }, WORLD_ID, DESTINATION_AREA_ID),
  ];
  return {
    ...makeBundle({ topics }),
    areas: catalogueOf([
      areaOf(DEPARTED_AREA_ID, [DEPARTED_ROOM_ID, DEPARTED_INNER_ROOM_ID], 3),
      areaOf(DESTINATION_AREA_ID, [DESTINATION_ROOM_ID], LIVES_ON_ARRIVAL),
    ]),
    rooms: catalogueOf([
      roomOf(DEPARTED_ROOM_ID),
      roomOf(DEPARTED_INNER_ROOM_ID),
      roomOf(DESTINATION_ROOM_ID),
    ]),
    quizzes: catalogueOf(options.quizzes ?? []),
    puzzles: catalogueOf(options.puzzles ?? []),
  };
}

interface StateOptions {
  readonly flags?: Readonly<Record<string, boolean>>;
  readonly puzzles?: GameStateDto['puzzles'];
  readonly roomId?: string;
}

function gatedState(options: StateOptions = {}): GameStateDto {
  return makeStateDto({
    player: {
      position: {
        worldId: WORLD_ID,
        areaId: DEPARTED_AREA_ID,
        roomId: options.roomId ?? DEPARTED_ROOM_ID,
      },
      inventory: [],
      lives: LIVES_BEFORE_MOVE,
    },
    flags: options.flags ?? {},
    puzzles: options.puzzles ?? {},
  });
}

function livesChangedOf(events: readonly GameEvent[]): readonly GameEvent[] {
  return events.filter((event) => event.type === 'lives-changed');
}

function entering(roomId: string): {
  readonly kind: 'move-player';
  readonly roomId: string;
  readonly reason: string;
} {
  return { kind: 'move-player', roomId, reason: 'cross-area test move' };
}

describe('ENG15-LIFEGATE-01 area-entry life reset gate', () => {
  it('ENG15-LIFEGATE-01: all quizzes and puzzles of the departed area solved restores the destination lives', () => {
    const bundle = gatedBundle({
      quizzes: [quizOf(QUIZ_ID, DEPARTED_TOPIC_ID)],
      puzzles: [puzzleOf(PUZZLE_ID, DEPARTED_TOPIC_ID)],
    });
    const state = makeRuntimeState(
      gatedState({
        flags: { [`quiz-passed:${QUIZ_ID}`]: true },
        puzzles: { [PUZZLE_ID]: { phase: 'solved' } },
      }),
    );

    const events = createEffectApplier(state, {
      bundle,
      random: new FakeRandom([0]),
    }).apply(entering(DESTINATION_ROOM_ID));

    expect(livesChangedOf(events)).toEqual([
      { type: 'lives-changed', lives: LIVES_ON_ARRIVAL },
    ]);
    expect(state.player.lives).toBe(LIVES_ON_ARRIVAL);
  });

  it('ENG15-LIFEGATE-01: an unsolved quiz in the departed area carries lives across the boundary', () => {
    // The destination has no quizzes or puzzles, mirroring the Hub in the
    // original bug: gating on the entered area would wrongly reset here.
    const bundle = gatedBundle({
      quizzes: [quizOf(QUIZ_ID, DEPARTED_TOPIC_ID)],
    });
    const state = makeRuntimeState(
      gatedState({ flags: { [`quiz-passed:${QUIZ_ID}`]: false } }),
    );

    const events = createEffectApplier(state, {
      bundle,
      random: new FakeRandom([0]),
    }).apply(entering(DESTINATION_ROOM_ID));

    expect(livesChangedOf(events)).toEqual([]);
    expect(events.map((event) => event.type)).toContain('room-entered');
    expect(state.player.lives).toBe(LIVES_BEFORE_MOVE);
  });

  it('ENG15-LIFEGATE-01: an unsolved puzzle in the departed area carries lives across the boundary', () => {
    const bundle = gatedBundle({
      puzzles: [puzzleOf(PUZZLE_ID, DEPARTED_TOPIC_ID)],
    });
    const state = makeRuntimeState(
      gatedState({ puzzles: { [PUZZLE_ID]: { phase: 'active' } } }),
    );

    const events = createEffectApplier(state, {
      bundle,
      random: new FakeRandom([0]),
    }).apply(entering(DESTINATION_ROOM_ID));

    expect(livesChangedOf(events)).toEqual([]);
    expect(events.map((event) => event.type)).toContain('room-entered');
    expect(state.player.lives).toBe(LIVES_BEFORE_MOVE);
  });

  it('ENG15-LIFEGATE-01: a departed area with no quizzes and no puzzles resets lives vacuously', () => {
    const bundle = gatedBundle({ quizzes: [], puzzles: [] });
    const state = makeRuntimeState(gatedState());

    const events = createEffectApplier(state, {
      bundle,
      random: new FakeRandom([0]),
    }).apply(entering(DESTINATION_ROOM_ID));

    expect(livesChangedOf(events)).toEqual([
      { type: 'lives-changed', lives: LIVES_ON_ARRIVAL },
    ]);
    expect(state.player.lives).toBe(LIVES_ON_ARRIVAL);
  });

  it('ENG15-LIFEGATE-01: unsolved quizzes and puzzles in other areas do not block the reset', () => {
    const bundle = gatedBundle({
      quizzes: [
        quizOf(QUIZ_ID, DEPARTED_TOPIC_ID),
        quizOf(DESTINATION_QUIZ_ID, DESTINATION_TOPIC_ID),
      ],
      puzzles: [
        puzzleOf(PUZZLE_ID, DEPARTED_TOPIC_ID),
        puzzleOf(DESTINATION_PUZZLE_ID, DESTINATION_TOPIC_ID),
        puzzleOf(UNMAPPED_PUZZLE_ID),
      ],
    });
    const state = makeRuntimeState(
      gatedState({
        flags: {
          [`quiz-passed:${QUIZ_ID}`]: true,
          [`quiz-passed:${DESTINATION_QUIZ_ID}`]: false,
        },
        puzzles: {
          [PUZZLE_ID]: { phase: 'solved' },
          [DESTINATION_PUZZLE_ID]: { phase: 'active' },
          [UNMAPPED_PUZZLE_ID]: { phase: 'unsolved' },
        },
      }),
    );

    const events = createEffectApplier(state, {
      bundle,
      random: new FakeRandom([0]),
    }).apply(entering(DESTINATION_ROOM_ID));

    expect(livesChangedOf(events)).toEqual([
      { type: 'lives-changed', lives: LIVES_ON_ARRIVAL },
    ]);
    expect(state.player.lives).toBe(LIVES_ON_ARRIVAL);
  });

  it('ENG15-LIFEGATE-01: a move within one area never resets lives, even when its quizzes and puzzles are solved', () => {
    const bundle = gatedBundle({
      quizzes: [quizOf(QUIZ_ID, DEPARTED_TOPIC_ID)],
      puzzles: [puzzleOf(PUZZLE_ID, DEPARTED_TOPIC_ID)],
    });
    const state = makeRuntimeState(
      gatedState({
        flags: { [`quiz-passed:${QUIZ_ID}`]: true },
        puzzles: { [PUZZLE_ID]: { phase: 'solved' } },
      }),
    );

    const events = createEffectApplier(state, {
      bundle,
      random: new FakeRandom([0]),
    }).apply(entering(DEPARTED_INNER_ROOM_ID));

    expect(livesChangedOf(events)).toEqual([]);
    expect(state.player.lives).toBe(LIVES_BEFORE_MOVE);
    expect(state.player.position).toEqual({
      worldId: WORLD_ID,
      areaId: DEPARTED_AREA_ID,
      roomId: DEPARTED_INNER_ROOM_ID,
    });
  });

  it('ENG15-LIFEGATE-01: without a bundle no solved state can be proved and lives are left alone', () => {
    const state = makeRuntimeState(gatedState());

    const events = createEffectApplier(state, {
      random: new FakeRandom([0]),
    }).apply(entering(DESTINATION_ROOM_ID));

    expect(livesChangedOf(events)).toEqual([]);
    expect(state.player.lives).toBe(LIVES_BEFORE_MOVE);
  });
});
