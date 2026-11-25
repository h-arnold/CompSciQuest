// Red tests for room/area condition scoping (shared-rules.md §3). The two new
// position-sensitive kinds are not yet in the Condition union or the evaluator,
// and visited-room/topic-complete still read only progress[0]. Every test below
// therefore fails on the asserted boolean, not on an import or fixture error.
import { describe, expect, it } from 'vitest';
import type { AreaProgress } from '../../src/core/AreaProgress';
import type { GameState } from '../../src/core/GameState';
import type { Condition } from '../../src/core/rules/Condition';
import type { Position } from '../../src/types/domain';
import {
  loadConditionEvaluatorFactory,
  mechanicsState,
  turnContext,
} from '../fixtures/mechanics';
import { makeRuntimeState, makeStateDto } from '../fixtures/persistence';

const HOME_POSITION: Position = {
  worldId: 'world-a',
  areaId: 'area-a',
  roomId: 'room-target',
};

const BASE_DTO = makeStateDto();

function stateAt(
  position: Position,
  progress: readonly AreaProgress[],
): GameState {
  return makeRuntimeState(
    makeStateDto({
      player: { ...BASE_DTO.player, position },
      progress,
    }),
  );
}

function progressRow(overrides: Partial<AreaProgress> = {}): AreaProgress {
  return {
    worldId: 'world-a',
    areaId: 'area-a',
    visitedRooms: [],
    completedTopics: [],
    earnedScore: 0,
    maxScore: 10,
    ...overrides,
  };
}

describe('condition scoping (shared-rules.md §3)', () => {
  it('C-DTO-01: the Condition union admits the two-field in-area shape', () => {
    // Explicit annotations, not `satisfies`: typecheck must reject a one-field
    // in-area literal because worldId is required by the canonical union.
    const inRoom: Condition = { kind: 'in-room', roomId: 'room-target' };
    const inArea: Condition = {
      kind: 'in-area',
      worldId: 'world-a',
      areaId: 'area-a',
    };

    expect(inRoom).toMatchObject({ kind: 'in-room', roomId: 'room-target' });
    expect(inArea).toMatchObject({
      kind: 'in-area',
      worldId: 'world-a',
      areaId: 'area-a',
    });
  });

  it('C-COND-01: in-room is true only in the current room, false elsewhere, and never throws', async () => {
    const createEvaluator = await loadConditionEvaluatorFactory();
    const evaluator = createEvaluator();
    const state = stateAt(HOME_POSITION, [progressRow()]);
    const context = turnContext(state);

    const matching = {
      kind: 'in-room',
      roomId: 'room-target',
    } satisfies Condition;
    expect(() => evaluator.evaluate(matching, state, context)).not.toThrow();
    expect(evaluator.evaluate(matching, state, context)).toBe(true);

    expect(
      evaluator.evaluate(
        { kind: 'in-room', roomId: 'room-north' },
        state,
        context,
      ),
    ).toBe(false);

    // An unknown ID and an absent (empty) ID are both false, never thrown.
    expect(
      evaluator.evaluate(
        { kind: 'in-room', roomId: 'room-not-in-any-area' },
        state,
        context,
      ),
    ).toBe(false);
    expect(
      evaluator.evaluate({ kind: 'in-room', roomId: '' }, state, context),
    ).toBe(false);
  });

  it('C-COND-02: in-area needs both worldId and areaId to match the current position', async () => {
    const createEvaluator = await loadConditionEvaluatorFactory();
    const evaluator = createEvaluator();
    const state = stateAt(HOME_POSITION, [progressRow()]);
    const context = turnContext(state);

    const matching = {
      kind: 'in-area',
      worldId: 'world-a',
      areaId: 'area-a',
    } satisfies Condition;
    expect(() => evaluator.evaluate(matching, state, context)).not.toThrow();
    expect(evaluator.evaluate(matching, state, context)).toBe(true);

    // The same areaId in a different world is NOT a match (area IDs are only
    // unique together with worldId — application-and-ui.md §3.2).
    expect(
      evaluator.evaluate(
        { kind: 'in-area', worldId: 'world-b', areaId: 'area-a' },
        state,
        context,
      ),
    ).toBe(false);

    // A different areaId in the matching world is not a match either.
    expect(
      evaluator.evaluate(
        { kind: 'in-area', worldId: 'world-a', areaId: 'area-z' },
        state,
        context,
      ),
    ).toBe(false);

    // Unknown and absent IDs evaluate false and never throw.
    expect(
      evaluator.evaluate(
        { kind: 'in-area', worldId: 'world-unknown', areaId: 'area-a' },
        state,
        context,
      ),
    ).toBe(false);
    expect(
      evaluator.evaluate(
        { kind: 'in-area', worldId: '', areaId: '' },
        state,
        context,
      ),
    ).toBe(false);
    expect(() =>
      evaluator.evaluate(
        { kind: 'in-area', worldId: '', areaId: '' },
        state,
        context,
      ),
    ).not.toThrow();
  });

  it('C-COND-03: visited-room finds a room in a non-first AreaProgress row', async () => {
    const createEvaluator = await loadConditionEvaluatorFactory();
    const evaluator = createEvaluator();
    const targetRoom = 'room-in-second-area';
    const progress: readonly AreaProgress[] = [
      progressRow({ visitedRooms: ['room-in-first-area'] }),
      progressRow({
        worldId: 'world-b',
        areaId: 'area-b',
        visitedRooms: [targetRoom],
      }),
    ];
    const state = stateAt(HOME_POSITION, progress);
    const context = turnContext(state);

    const condition = {
      kind: 'visited-room',
      roomId: targetRoom,
    } satisfies Condition;
    expect(() => evaluator.evaluate(condition, state, context)).not.toThrow();
    // Fails today: progressEntry(state) reads only progress[0].
    expect(evaluator.evaluate(condition, state, context)).toBe(true);

    expect(
      evaluator.evaluate(
        { kind: 'visited-room', roomId: 'room-never-seen' },
        state,
        context,
      ),
    ).toBe(false);

    const emptyState = stateAt(HOME_POSITION, []);
    const emptyContext = turnContext(emptyState);
    expect(() =>
      evaluator.evaluate(condition, emptyState, emptyContext),
    ).not.toThrow();
    expect(evaluator.evaluate(condition, emptyState, emptyContext)).toBe(false);
  });

  it('C-COND-04: nested all/any/not composes the scope leaves recursively', async () => {
    const createEvaluator = await loadConditionEvaluatorFactory();
    const evaluator = createEvaluator();
    const visitedRoom = 'room-visited-in-second-area';
    const progress: readonly AreaProgress[] = [
      progressRow({ visitedRooms: ['room-in-first-area'] }),
      progressRow({
        worldId: 'world-b',
        areaId: 'area-b',
        visitedRooms: [visitedRoom],
      }),
    ];

    const inRoom = {
      kind: 'in-room',
      roomId: 'room-target',
    } satisfies Condition;
    const inArea = {
      kind: 'in-area',
      worldId: 'world-a',
      areaId: 'area-a',
    } satisfies Condition;
    const visited = {
      kind: 'visited-room',
      roomId: visitedRoom,
    } satisfies Condition;
    const notElsewhere = {
      kind: 'not',
      of: { kind: 'in-room', roomId: 'room-elsewhere' },
    } satisfies Condition;
    const composed = {
      kind: 'all',
      of: [inRoom, { kind: 'any', of: [inArea, notElsewhere] }, visited],
    } satisfies Condition;

    const state = stateAt(HOME_POSITION, progress);
    const context = turnContext(state);

    // The whole nested expression composes to true at home with the room
    // recorded in a non-first progress row.
    expect(evaluator.evaluate(composed, state, context)).toBe(true);

    // Move the player only; progress is deliberately unchanged.
    const movedPosition: Position = {
      worldId: 'world-b',
      areaId: 'area-b',
      roomId: 'room-elsewhere',
    };
    const movedState = stateAt(movedPosition, progress);
    const movedContext = turnContext(movedState);

    // The two position leaves flip to false ...
    expect(evaluator.evaluate(inRoom, movedState, movedContext)).toBe(false);
    expect(evaluator.evaluate(inArea, movedState, movedContext)).toBe(false);

    // ... but visited-room still reads progress, so it stays true.
    expect(evaluator.evaluate(visited, movedState, movedContext)).toBe(true);

    // The composed expression flips to false with the position change.
    expect(evaluator.evaluate(composed, movedState, movedContext)).toBe(false);
  });

  it('C-COND-05: topic-complete finds a topic in a non-first AreaProgress row', async () => {
    const createEvaluator = await loadConditionEvaluatorFactory();
    const evaluator = createEvaluator();
    const targetTopic = 'topic-in-third-area';
    const progress: readonly AreaProgress[] = [
      progressRow({ completedTopics: ['topic-in-first-area'] }),
      progressRow({
        worldId: 'world-b',
        areaId: 'area-b',
        completedTopics: ['topic-in-second-area'],
      }),
      progressRow({
        worldId: 'world-c',
        areaId: 'area-c',
        completedTopics: [targetTopic],
      }),
    ];
    const state = stateAt(HOME_POSITION, progress);
    const context = turnContext(state);

    const condition = {
      kind: 'topic-complete',
      topicId: targetTopic,
    } satisfies Condition;
    expect(() => evaluator.evaluate(condition, state, context)).not.toThrow();
    // Fails today: progressEntry(state) reads only progress[0].
    expect(evaluator.evaluate(condition, state, context)).toBe(true);

    expect(
      evaluator.evaluate(
        { kind: 'topic-complete', topicId: 'topic-never-started' },
        state,
        context,
      ),
    ).toBe(false);
  });
});

describe('quiz-passed condition (shared-rules.md §3, combat.md §8)', () => {
  it('C-QUIZ-01: quiz-passed evaluates true when its flag is set', async () => {
    const createEvaluator = await loadConditionEvaluatorFactory();
    const evaluator = createEvaluator();
    const state = mechanicsState({
      flags: { 'quiz-passed:quiz-1': true },
    });
    const context = turnContext(state);
    const condition = {
      kind: 'quiz-passed',
      quizId: 'quiz-1',
    } satisfies Condition;

    expect(() => evaluator.evaluate(condition, state, context)).not.toThrow();
    expect(evaluator.evaluate(condition, state, context)).toBe(true);
  });

  it('C-QUIZ-02: quiz-passed is false for an absent, false, or other-quiz flag and never throws', async () => {
    const createEvaluator = await loadConditionEvaluatorFactory();
    const evaluator = createEvaluator();
    const condition = {
      kind: 'quiz-passed',
      quizId: 'quiz-1',
    } satisfies Condition;

    const absent = mechanicsState();
    expect(() =>
      evaluator.evaluate(condition, absent, turnContext(absent)),
    ).not.toThrow();
    expect(evaluator.evaluate(condition, absent, turnContext(absent))).toBe(
      false,
    );

    const explicitlyFalse = mechanicsState({
      flags: { 'quiz-passed:quiz-1': false },
    });
    expect(
      evaluator.evaluate(
        condition,
        explicitlyFalse,
        turnContext(explicitlyFalse),
      ),
    ).toBe(false);

    const otherQuiz = mechanicsState({
      flags: { 'quiz-passed:quiz-2': true },
    });
    expect(
      evaluator.evaluate(condition, otherQuiz, turnContext(otherQuiz)),
    ).toBe(false);
    expect(
      evaluator.evaluate(
        { kind: 'quiz-passed', quizId: 'quiz-unknown' },
        otherQuiz,
        turnContext(otherQuiz),
      ),
    ).toBe(false);
  });
});
