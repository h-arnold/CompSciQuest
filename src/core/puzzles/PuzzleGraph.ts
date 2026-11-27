// Runtime mirror of the authoring `puzzle-graph` gate. Authoring-only fields
// such as clues stay in the toolchain gate; this checks the declarative graph
// carried by the bundle.
import type { ContentBundle } from '../../content/ContentBundle';
import type { Puzzle } from './Puzzle';

function repeatedIds(puzzles: readonly Puzzle[]): readonly string[] {
  const seen = new Set<string>();
  const repeated = new Set<string>();
  for (const puzzle of puzzles) {
    if (seen.has(puzzle.id)) repeated.add(puzzle.id);
    seen.add(puzzle.id);
  }
  return Array.from(repeated, (id) => id);
}

function cycleIds(puzzles: readonly Puzzle[]): readonly string[] {
  const byId = new Map(puzzles.map((puzzle) => [puzzle.id, puzzle]));
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const cyclic = new Set<string>();
  const walk = (id: string): void => {
    if (visiting.has(id)) {
      cyclic.add(id);
      return;
    }
    if (visited.has(id)) return;
    visiting.add(id);
    const dependencies = byId.get(id)?.dependsOn ?? [];
    for (const dependency of dependencies) walk(dependency);
    visiting.delete(id);
    visited.add(id);
  };
  for (const puzzle of puzzles) walk(puzzle.id);
  return Array.from(cyclic, (id) => id);
}

// A puzzle with no dependencies is a start node; every other puzzle must be
// reachable through a declared dependency (puzzles.md §4). An unknown
// dependency cannot confer reachability.
function unreachableIds(puzzles: readonly Puzzle[]): readonly string[] {
  const ids = new Set(Array.from(puzzles, (puzzle) => puzzle.id));
  const reachable = new Set<string>();
  const visit = (id: string): void => {
    if (reachable.has(id)) return;
    reachable.add(id);
    for (const puzzle of puzzles) {
      if ((puzzle.dependsOn ?? []).includes(id)) visit(puzzle.id);
    }
  };
  for (const puzzle of puzzles) {
    if ((puzzle.dependsOn ?? []).length === 0) visit(puzzle.id);
  }
  return puzzles
    .filter((puzzle) => !ids.has(puzzle.id) || !reachable.has(puzzle.id))
    .map((puzzle) => puzzle.id);
}

function firstReady(
  candidates: Iterable<Puzzle>,
  remaining: ReadonlyMap<string, Puzzle>,
): Puzzle | undefined {
  for (const candidate of candidates) {
    const ready = (candidate.dependsOn ?? []).every(
      (dependency) => !remaining.has(dependency) || dependency === candidate.id,
    );
    if (ready) return candidate;
  }
  return undefined;
}

// Topological solve order: each dependency precedes its dependent. Declaration
// order breaks ties, so the result is deterministic (puzzles.md §4).
export function solveOrder(bundle: ContentBundle): readonly string[] {
  const puzzles = bundle.puzzles.all;
  const remaining = new Map(puzzles.map((puzzle) => [puzzle.id, puzzle]));
  const order: string[] = [];
  while (remaining.size > 0) {
    const next = firstReady(remaining.values(), remaining);
    if (next === undefined) break;
    remaining.delete(next.id);
    order.push(next.id);
  }
  // A cyclic remainder cannot be ordered; append it deterministically so the
  // caller still sees every ID (validation reports the cycle separately).
  for (const id of remaining.keys()) order.push(id);
  return order;
}

export function puzzleGraphFindings(bundle: ContentBundle): readonly string[] {
  const puzzles = bundle.puzzles.all;
  const ids = new Set(Array.from(puzzles, (puzzle) => puzzle.id));
  const problems: string[] = [];
  const repeated = repeatedIds(puzzles);
  for (const id of repeated) {
    problems.push(`Duplicate puzzle ID '${id}'`);
  }
  const cyclic = cycleIds(puzzles);
  for (const id of cyclic) {
    problems.push(`Puzzle dependency cycle at '${id}'`);
  }
  for (const puzzle of puzzles) {
    const dependencies = puzzle.dependsOn ?? [];
    for (const dependency of dependencies) {
      if (!ids.has(dependency)) {
        problems.push(
          `Puzzle '${puzzle.id}' dependsOn unknown puzzle '${dependency}'`,
        );
      }
    }
    if (
      puzzle.topicId !== undefined &&
      bundle.specTopics.getById(puzzle.topicId) === undefined
    ) {
      problems.push(
        `Puzzle '${puzzle.id}' names unknown topicId '${puzzle.topicId}'`,
      );
    }
  }
  for (const id of unreachableIds(puzzles)) {
    problems.push(`Puzzle '${id}' is unreachable from the start`);
  }
  return problems;
}
