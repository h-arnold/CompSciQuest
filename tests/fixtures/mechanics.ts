// Deterministic fixtures for the hazards/puzzles red tests (Gate 1).
// Every collaborator is injected: no real storage, clock, randomness, DOM or
// file system. Not-yet-implemented mechanic factories fail with a named
// assertion (tests/fixtures/seams.ts), never a raw import error.
import { catalogueOf } from '../../src/content/Catalogue';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { Command } from '../../src/core/commands/Command';
import type { EffectApplier } from '../../src/core/effects/EffectApplier';
import { createEffectApplier } from '../../src/core/effects/EffectApplier';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { GameState, GameStateDto } from '../../src/core/GameState';
import type { Hazard } from '../../src/core/hazards/Hazard';
import type { Puzzle } from '../../src/core/puzzles/Puzzle';
import type { Random } from '../../src/core/Random';
import type { ConditionEvaluator } from '../../src/core/rules/ConditionEvaluator';
import type { ScheduledEvent } from '../../src/core/scheduling/ScheduledEvent';
import { expect } from 'vitest';
import {
  FakeRandom,
  makeBundle,
  makeRuntimeState,
  makeStateDto,
} from './persistence';

// A missing module or export becomes a named assertion, never a raw import
// error. Missing behaviour is the expected red state for this slice.
async function loadFactory<T>(
  specifier: string,
  exportName: string,
  reason: string,
): Promise<T> {
  let module: Record<string, unknown> = {};
  try {
    module = (await import(/* @vite-ignore */ specifier)) as Record<
      string,
      unknown
    >;
  } catch {
    // Fall through to the assertion below so the failure names the factory.
  }
  expect(
    module[exportName],
    `${exportName} must be exported from ${specifier} (${reason})`,
  ).toBeTypeOf('function');
  return module[exportName] as T;
}

export const FIXED_TURN = 7;
export const START_ROOM = 'room-stub-start';
export const NORTH_ROOM = 'room-stub-north';
export const HAZARD_ID = 'hazard-test';
export const SECOND_HAZARD_ID = 'hazard-second';
export const PUZZLE_ID = 'puzzle-test';
export const SECOND_PUZZLE_ID = 'puzzle-second';
export const TOPIC_ID = 'topic-1';
export const DOOR_FLAG = 'door-unlocked';

// ---------------------------------------------------------------------------
// Test-owned ports for the amended phase-4 contract (application-and-ui.md §8).
// These are declared here rather than imported from the pre-amendment source so
// a red test fails on the asserted event contract, not on a type mismatch.
// ---------------------------------------------------------------------------

export interface TurnContract {
  readonly turn: number;
  readonly state: GameState;
  readonly bundle: ContentBundle;
  readonly random: Random;
  readonly command: Command;
}

export interface SchedulerContract {
  // The amended contract is tick(context). The optional second argument is
  // supplied only so the pre-amendment implementation receives its state and
  // fails on the event assertion rather than on a TypeError.
  tick(
    context: TurnContract,
    preAmendmentState?: GameState,
  ): readonly GameEvent[];
}

export interface ReactionSystemContract {
  react(
    context: TurnContract,
    events: readonly GameEvent[],
  ): readonly GameEvent[];
}

// ---------------------------------------------------------------------------
// Canonical mechanic seams — factories are not implemented yet.
// ---------------------------------------------------------------------------

export interface MechanicsDependencies {
  readonly bundle: ContentBundle;
  readonly evaluator: ConditionEvaluator;
  readonly random: Random;
  readonly applier: EffectApplier;
}

export type HazardSystemFactory = (
  dependencies: MechanicsDependencies,
) => ReactionSystemContract;
export type PuzzleSystemFactory = (
  dependencies: MechanicsDependencies,
) => ReactionSystemContract;
export type SchedulerFactory = (dependencies: {
  readonly applier: EffectApplier;
}) => SchedulerContract;
export type ConditionEvaluatorFactory = () => ConditionEvaluator;

export type ComposedReaction = (
  context: TurnContract,
  events: readonly GameEvent[],
) => readonly GameEvent[];

export interface ComposedReactionDependencies {
  readonly scheduler: SchedulerContract;
  readonly hazards: ReactionSystemContract;
  readonly npcs: ReactionSystemContract;
  readonly puzzles: ReactionSystemContract;
  readonly hints: ReactionSystemContract;
}

export type ComposedReactionFactory = (
  dependencies: ComposedReactionDependencies,
) => ComposedReaction;
export type SolveOrderFunction = (bundle: ContentBundle) => readonly string[];

export function loadConditionEvaluatorFactory(): Promise<ConditionEvaluatorFactory> {
  return loadFactory<ConditionEvaluatorFactory>(
    '../../src/core/rules/ConditionEvaluator',
    'createConditionEvaluator',
    'shared-rules.md §3 — one evaluator powers validation and reaction checks',
  );
}

export function loadHazardSystemFactory(): Promise<HazardSystemFactory> {
  return loadFactory<HazardSystemFactory>(
    '../../src/core/hazards/HazardSystem',
    'createHazardSystem',
    'hazards.md §3 — phase-4 reaction system in declaration order',
  );
}

export function loadPuzzleSystemFactory(): Promise<PuzzleSystemFactory> {
  return loadFactory<PuzzleSystemFactory>(
    '../../src/core/puzzles/PuzzleSystem',
    'createPuzzleSystem',
    'puzzles.md §3 — phase-4 completion detection',
  );
}

export function loadSchedulerFactory(): Promise<SchedulerFactory> {
  return loadFactory<SchedulerFactory>(
    '../../src/core/scheduling/Scheduler',
    'createScheduler',
    'shared-rules.md §6 — fuse/daemon countdown, first in phase 4',
  );
}

export function loadComposedReactionFactory(): Promise<ComposedReactionFactory> {
  return loadFactory<ComposedReactionFactory>(
    '../../src/application/ComposedReaction',
    'createComposedReaction',
    'shared-rules.md §2 — ordered phase-4 composition of the five systems',
  );
}

export function loadSolveOrder(): Promise<SolveOrderFunction> {
  return loadFactory<SolveOrderFunction>(
    '../../src/core/puzzles/PuzzleGraph',
    'solveOrder',
    'puzzles.md §4 — a topological order gives a valid solve order',
  );
}

export function loadHazardCatalogueFactory(): Promise<
  (hazards: readonly Hazard[]) => {
    getById(id: string): Hazard | undefined;
    getForRoom(roomId: string): readonly Hazard[];
  }
> {
  return loadFactory<
    (hazards: readonly Hazard[]) => {
      getById(id: string): Hazard | undefined;
      getForRoom(roomId: string): readonly Hazard[];
    }
  >(
    '../../src/core/hazards/HazardCatalogue',
    'createHazardCatalogue',
    'hazards.md §5 — getById/getForRoom without scanning the whole content set',
  );
}

// ---------------------------------------------------------------------------
// Declared, deterministic data builders
// ---------------------------------------------------------------------------

export function hazard(overrides: Partial<Hazard> = {}): Hazard {
  return {
    id: HAZARD_ID,
    trigger: { kind: 'on-room-enter', roomId: START_ROOM },
    when: { kind: 'not', of: { kind: 'flag-set', flag: 'switch-cooled' } },
    effects: [
      { kind: 'message', text: 'The switches hiss.' },
      { kind: 'change-lives', delta: -1, reason: 'the switches overheated' },
    ],
    ...overrides,
  };
}

export function puzzle(overrides: Partial<Puzzle> = {}): Puzzle {
  return {
    id: PUZZLE_ID,
    requirements: [{ kind: 'flag-set', flag: DOOR_FLAG }],
    onSolve: [],
    score: 2,
    dependsOn: [],
    ...overrides,
  };
}

export function scheduled(
  overrides: Partial<ScheduledEvent> = {},
): ScheduledEvent {
  return {
    id: 'fuse-test',
    kind: 'fuse',
    remainingTurns: 1,
    effect: { kind: 'message', text: 'The fuse burns out.' },
    ...overrides,
  };
}

export function mechanicsBundle(
  hazards: readonly Hazard[] = [],
  puzzles: readonly Puzzle[] = [],
  roomScore = 0,
): ContentBundle {
  const base = makeBundle();
  return {
    ...base,
    hazards: catalogueOf(hazards),
    puzzles: catalogueOf(puzzles),
    rooms: catalogueOf(
      base.rooms.all.map((room) => ({ ...room, score: roomScore })),
    ),
  };
}

export function mechanicsState(
  overrides: Partial<GameStateDto> = {},
): GameState {
  return makeRuntimeState(makeStateDto(overrides));
}

export function applierFor(
  state: GameState,
  random: Random = new FakeRandom([0]),
): EffectApplier {
  return createEffectApplier(state, { random });
}

export interface TurnContextOptions {
  readonly bundle?: ContentBundle;
  readonly random?: Random;
  readonly command?: Command;
  readonly turn?: number;
}

// The returned object is both a TurnContract and a state-shaped object. The
// extra state fields let the pre-amendment systems run to completion so red
// failures name the event contract instead of throwing on a missing field.
export function turnContext(
  state: GameState,
  options: TurnContextOptions = {},
): TurnContract & GameState {
  return {
    ...state,
    turn: options.turn ?? state.turn,
    state,
    bundle: options.bundle ?? mechanicsBundle(),
    random: options.random ?? new FakeRandom([0]),
    command: options.command ?? { kind: 'look' },
  };
}

export function snapshot(value: unknown): string {
  return JSON.stringify(value);
}

export function eventTypes(events: readonly GameEvent[]): string[] {
  return events.map((event) => event.type);
}

// Recording systems let an order assertion observe which phase-4 system ran,
// without exposing any private pipeline internals.
export function recordingComposedReactionDependencies(
  trace: string[],
  scheduler?: SchedulerContract,
): ComposedReactionDependencies {
  const reactOf = (label: string) => (): readonly GameEvent[] => {
    trace.push(label);
    return [];
  };
  return {
    scheduler: {
      tick(context, preAmendmentState): readonly GameEvent[] {
        trace.push('scheduler');
        return scheduler?.tick(context, preAmendmentState) ?? [];
      },
    },
    hazards: { react: reactOf('hazards') },
    npcs: { react: reactOf('npcs') },
    puzzles: { react: reactOf('puzzles') },
    hints: { react: reactOf('hints') },
  };
}
