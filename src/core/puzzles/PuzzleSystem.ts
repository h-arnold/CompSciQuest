// Phase-4 seam from application-and-ui.md §8 / shared-rules.md §2. Completion
// detection applies its own effects through the injected applier and returns
// events; Game owns the turn buffer.
import type { ContentBundle } from '../../content/ContentBundle';
import type { Effect } from '../effects/Effect';
import type { EffectApplier } from '../effects/EffectApplier';
import type { GameEvent } from '../events/GameEvent';
import type { GameState } from '../GameState';
import type { Random } from '../Random';
import type { ConditionEvaluator } from '../rules/ConditionEvaluator';
import type { TurnContext } from '../TurnContext';
import type { Puzzle } from './Puzzle';

export interface PuzzleSystem {
  react(
    context: TurnContext,
    events: readonly GameEvent[],
  ): readonly GameEvent[];
}

export interface PuzzleSystemDependencies {
  readonly bundle: ContentBundle;
  readonly evaluator: ConditionEvaluator;
  readonly random: Random;
  readonly applier: EffectApplier;
}

interface FiredThisTurn {
  readonly turn: number;
  readonly ids: Set<string>;
}

interface TurnMarks {
  readonly fired: WeakMap<GameState, FiredThisTurn>;
  readonly counted: WeakMap<GameState, number>;
}

// Once an action flag is set, progress is action-driven: bare possession does
// not advance a puzzle (puzzles.md §3 critical authoring rule). Where no action
// flag exists, carrying the item can genuinely be the solution.
function isPossessionInsufficient(state: GameState): boolean {
  return Object.values(state.flags).some(Boolean);
}

function isPossessionOnly(puzzle: Puzzle): boolean {
  return (
    puzzle.requirements.length > 0 &&
    puzzle.requirements.every((condition) => condition.kind === 'has-item')
  );
}

function shouldSkip(puzzle: Puzzle, state: GameState): boolean {
  return (
    state.puzzles[puzzle.id]?.phase === 'solved' ||
    (isPossessionOnly(puzzle) && isPossessionInsufficient(state))
  );
}

function hasAlreadyFired(
  marks: TurnMarks,
  state: GameState,
  id: string,
): boolean {
  const record = marks.fired.get(state);
  return record?.turn === state.turn && record.ids.has(id);
}

function markFired(marks: TurnMarks, state: GameState, id: string): void {
  const current = marks.fired.get(state);
  const ids = current?.turn === state.turn ? current.ids : new Set<string>();
  ids.add(id);
  marks.fired.set(state, { turn: state.turn, ids });
}

function solveEffects(puzzle: Puzzle, wasUnsolved: boolean): readonly Effect[] {
  const activation: Effect[] = wasUnsolved
    ? [{ kind: 'set-puzzle-active', puzzleId: puzzle.id }]
    : [];
  const completion: Effect[] =
    puzzle.topicId === undefined
      ? []
      : [{ kind: 'complete-topic', topicId: puzzle.topicId }];
  return [
    ...activation,
    { kind: 'set-puzzle-solved', puzzleId: puzzle.id },
    ...puzzle.onSolve,
    ...completion,
  ];
}

// A counter starts at 0 on activation and advances once per subsequent
// phase-4 turn, whatever the command was (storage-schema.md §4). The per-state
// turn stamp stops a second reaction pass advancing it twice in one turn.
function advanceCounters(
  puzzles: readonly Puzzle[],
  state: GameState,
  turn: number,
  marks: TurnMarks,
): void {
  if (marks.counted.get(state) === turn) return;
  marks.counted.set(state, turn);
  for (const puzzle of puzzles) {
    if (state.puzzles[puzzle.id]?.phase !== 'active') continue;
    const key = `turns-since:${puzzle.id}`;
    if (!Object.prototype.hasOwnProperty.call(state.counters, key)) continue;
    const counters = state.counters as Record<string, number>;
    counters[key] = (counters[key] ?? 0) + 1;
  }
}

function reactionFor(
  puzzle: Puzzle,
  context: TurnContext,
  evaluator: ConditionEvaluator,
  applier: EffectApplier,
  marks: TurnMarks,
): readonly GameEvent[] {
  const { state } = context;
  if (hasAlreadyFired(marks, state, puzzle.id) || shouldSkip(puzzle, state)) {
    return [];
  }
  const holds = puzzle.requirements.map((condition) =>
    evaluator.evaluate(condition, state, context),
  );
  const all = holds.length > 0 && holds.every(Boolean);
  if (!all && !holds.some(Boolean)) return [];

  const wasUnsolved =
    (state.puzzles[puzzle.id]?.phase ?? 'unsolved') === 'unsolved';
  const effects: readonly Effect[] = all
    ? solveEffects(puzzle, wasUnsolved)
    : [{ kind: 'set-puzzle-active', puzzleId: puzzle.id }];
  const events = effects.flatMap((effect) => [...applier.apply(effect)]);
  if (wasUnsolved) {
    const key = `turns-since:${puzzle.id}`;
    if (!Object.prototype.hasOwnProperty.call(state.counters, key)) {
      (state.counters as Record<string, number>)[key] = 0;
    }
  }
  markFired(marks, state, puzzle.id);
  return events;
}

export function createPuzzleSystem(
  dependencies: PuzzleSystemDependencies,
): PuzzleSystem {
  const { bundle, evaluator, applier } = dependencies;
  const marks: TurnMarks = {
    fired: new WeakMap<GameState, FiredThisTurn>(),
    counted: new WeakMap<GameState, number>(),
  };
  return {
    react(context): readonly GameEvent[] {
      advanceCounters(bundle.puzzles.all, context.state, context.turn, marks);
      return bundle.puzzles.all.flatMap((puzzle) =>
        reactionFor(puzzle, context, evaluator, applier, marks),
      );
    },
  };
}
