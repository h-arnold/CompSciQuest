// Canonical signature from application-and-ui.md §8 and the resolution order
// from npcs.md §3. Node specials are checked first, then actor-bound keyword
// topics, then visible object aliases, then declared object IDs, then free text.
// The resolver only reads state; every topic gate stays in the selector.
import type { ContentBundle } from '../../content/ContentBundle';
import type { GameState } from '../GameState';
import type { ConversationNode } from '../npcs/ConversationNode';
import type { ConversationTopic } from '../npcs/ConversationTopic';
import type { NpcDependencies } from '../npcs/NpcDependencies';
import type { ResolvedTopic } from '../npcs/ResolvedTopic';
import { findDeclaredObjectPhrase } from '../npcs/TopicPhrase';
import { createNameResolver } from './NameResolver';

export interface TopicResolver {
  resolve(
    phrase: string,
    state: GameState,
    node?: ConversationNode,
    actorId?: string,
  ): ResolvedTopic;
}

function hasKeyword(keywords: readonly string[], phrase: string): boolean {
  return keywords.some((keyword) => keyword.trim().toLowerCase() === phrase);
}

function isBoundToActor(
  topic: { readonly actorId?: string },
  actorId: string | undefined,
): boolean {
  return topic.actorId === undefined || topic.actorId === actorId;
}

function actorKeywordTopic(
  bundle: ContentBundle,
  normalised: string,
  actorId: string | undefined,
  node: ConversationNode | undefined,
): ConversationTopic | undefined {
  return bundle.conversationTopics.all.find(
    (topic) =>
      topic.match.kind === 'special' &&
      // A node's own specials are handled in step 1; their shared declaration
      // in the bundle must not make the actor-level pass steal the node turn.
      node?.topics.some((candidate) => candidate.id === topic.id) !== true &&
      topic.actorId !== undefined &&
      isBoundToActor(topic, actorId) &&
      hasKeyword(topic.match.keywords, normalised),
  );
}

export function createTopicResolver(
  dependencies: NpcDependencies,
): TopicResolver {
  const names = createNameResolver();
  const { bundle } = dependencies;
  return {
    resolve(phrase, state, node, actorId): ResolvedTopic {
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
      const keywordTopic = actorKeywordTopic(bundle, normalised, actorId, node);
      if (keywordTopic !== undefined) {
        return { kind: 'keyword', topicId: keywordTopic.id };
      }
      const visibleId = names.resolve(normalised, state, bundle);
      if (visibleId !== undefined)
        return { kind: 'object', objectId: visibleId };
      const declared = findDeclaredObjectPhrase(phrase, bundle, actorId);
      return declared === undefined
        ? { kind: 'free-text', text: phrase.trim() }
        : { kind: 'object', objectId: declared.objectId };
    },
  };
}
