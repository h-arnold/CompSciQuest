// Canonical declarative shape from npcs.md §2.
import type { Effect } from '../effects/Effect';
import type { ConversationTopic } from './ConversationTopic';

export interface ConversationNode {
  readonly id: string;
  readonly isSticky: boolean; // false = expires after one turn
  readonly topics: readonly ConversationTopic[];
  readonly defaultTopicId: string; // catches unmatched input, keeps node open
  readonly onEnterEffects?: readonly Effect[];
}
