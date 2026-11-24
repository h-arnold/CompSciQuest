// Canonical signature from application-and-ui.md §8.
import type { ConversationNode } from '../npcs/ConversationNode';
import type { ResolvedTopic } from '../npcs/ResolvedTopic';
import type { GameState } from '../GameState';

export interface TopicResolver {
  resolve(
    phrase: string,
    state: GameState,
    node?: ConversationNode,
  ): ResolvedTopic;
}
