// Canonical declarative shape from npcs.md §2.
import type { Effect } from '../effects/Effect';
import type { Condition } from '../rules/Condition';
import type { ResponseStrategy } from './ResponseStrategy';
import type { TopicMatch } from './TopicMatch';

export interface ConversationTopic {
  readonly id: string;
  // Optional actor binding, emitted by the generator when authored; an
  // unbound topic stays globally reachable.
  readonly actorId?: string;
  readonly match: TopicMatch;
  readonly isActive: Condition;
  readonly responses: readonly string[];
  readonly strategy: ResponseStrategy;
  readonly effects: readonly Effect[];
  readonly prompt?: string; // "(You could ask why.)"
}
