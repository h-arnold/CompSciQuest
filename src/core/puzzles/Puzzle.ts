// Canonical declarative definition from puzzles.md §2.
import type { Effect } from '../effects/Effect';
import type { Condition } from '../rules/Condition';

export interface Puzzle {
  readonly id: string;
  readonly requirements: readonly Condition[]; // all must hold
  readonly onSolve: readonly Effect[];
  readonly topicId?: string; // omitted if not a spec topic
  readonly score: number; // first-solve award, 0 if not scoreable
  readonly hintSequenceId?: string; // omitted when no hints
  readonly dependsOn: readonly string[]; // ids, for the dependency graph
}
