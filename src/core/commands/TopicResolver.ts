// Canonical signature from application-and-ui.md §8 and the resolution order
// from npcs.md §3. A node's raw special keywords are checked first because they
// are matched against ParsedCommand tokens, then visible object aliases, then
// free text (npcs.md §5).
import type { ConversationNode } from '../npcs/ConversationNode';
import type { NpcDependencies } from '../npcs/NpcDependencies';
import type { ResolvedTopic } from '../npcs/ResolvedTopic';
import type { GameState } from '../GameState';
import { createNameResolver } from './NameResolver';

export interface TopicResolver {
  resolve(
    phrase: string,
    state: GameState,
    node?: ConversationNode,
  ): ResolvedTopic;
}

function hasKeyword(keywords: readonly string[], phrase: string): boolean {
  return keywords.some((keyword) => keyword.trim().toLowerCase() === phrase);
}

export function createTopicResolver(
  dependencies: NpcDependencies,
): TopicResolver {
  const names = createNameResolver();
  const { bundle } = dependencies;
  return {
    resolve(phrase, state, node): ResolvedTopic {
      const normalised = phrase.trim().toLowerCase();
      if (node !== undefined) {
        const special = node.topics.find(
          (candidate) =>
            candidate.match.kind === 'special' &&
            hasKeyword(candidate.match.keywords, normalised),
        );
        if (special !== undefined) {
          return { kind: 'keyword', topicId: special.id };
        }
      }
      const objectId = names.resolve(normalised, state, bundle);
      return objectId === undefined
        ? { kind: 'free-text', text: phrase.trim() }
        : { kind: 'object', objectId };
    },
  };
}
