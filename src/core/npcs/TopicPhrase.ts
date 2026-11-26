// Shared phrase-to-declared-object helper from npcs.md §3. Both the command
// resolver and the topic selector use this one owner: a phrase that names a
// declared ask/tell object ID is a stronger match than free text, and the
// uniqueness rule prevents an ambiguous phrase from selecting an object.
import type { ContentBundle } from '../../content/ContentBundle';
import type { ConversationTopic } from './ConversationTopic';
import type { TopicMatch } from './TopicMatch';

export interface DeclaredObjectPhrase {
  readonly objectId: string;
  readonly topics: readonly ConversationTopic[];
}

function normalise(value: string): string {
  return value.trim().toLowerCase().replaceAll(/[-_]/gu, ' ');
}

function isObjectName(objectId: string, phrase: string): boolean {
  const declared = normalise(objectId);
  const spoken = normalise(phrase);
  return declared === spoken || declared.split(/\s+/u).at(-1) === spoken;
}

function isBoundToActor(
  topic: ConversationTopic,
  actorId: string | undefined,
): boolean {
  return topic.actorId === undefined || topic.actorId === actorId;
}

type AskTellMatch = Extract<
  TopicMatch,
  { readonly kind: 'ask' | 'tell' | 'askTell' }
>;

function isAskTellMatch(match: TopicMatch): match is AskTellMatch {
  return 'objectIds' in match;
}

function collectMatches(
  phrase: string,
  bundle: ContentBundle,
  actorId: string | undefined,
): Map<string, ConversationTopic[]> {
  const matches = new Map<string, ConversationTopic[]>();
  for (const topic of bundle.conversationTopics.all) {
    if (!isBoundToActor(topic, actorId)) continue;
    const { match } = topic;
    if (!isAskTellMatch(match)) continue;
    for (const objectId of match.objectIds) {
      if (!isObjectName(objectId, phrase)) continue;
      const topics = matches.get(objectId) ?? [];
      if (topics.includes(topic)) continue;
      matches.set(objectId, [...topics, topic]);
    }
  }
  return matches;
}

export function findDeclaredObjectPhrase(
  phrase: string,
  bundle: ContentBundle,
  actorId: string | undefined,
): DeclaredObjectPhrase | undefined {
  if (normalise(phrase).length === 0) return undefined;
  const matches = collectMatches(phrase, bundle, actorId);
  if (matches.size !== 1) return undefined;
  const objectId = matches.keys().next().value;
  const topics = objectId === undefined ? [] : (matches.get(objectId) ?? []);
  return objectId === undefined ? undefined : { objectId, topics };
}
