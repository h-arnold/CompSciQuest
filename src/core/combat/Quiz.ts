// Canonical declarative definition from combat.md §2.
import type { Effect } from '../effects/Effect';

export interface Quiz {
  readonly id: string;
  readonly actorId: string; // who is asking
  readonly topicId: string; // SpecTopic id from COVERAGE.md
  readonly score: number; // awarded once on pass, 0 if not scoreable
  readonly questionIds: readonly string[]; // content order; shuffled with Random
  readonly passMark: number; // count, 1..questionIds.length
  readonly onPass: readonly Effect[];
  readonly onFail: readonly Effect[];
  readonly hintSequenceId?: string; // omitted when no hints
  readonly attemptsAllowed?: number; // omitted for unlimited retries
}
