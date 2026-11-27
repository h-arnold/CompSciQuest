// Deterministic in-memory builders for the C7 npc topic-overlap red tests.
// Every card, condition and runtime topic is a declared literal: no card is
// read from disk and no wall clock, Math.random, network or browser storage
// is touched.
import { expect } from 'vitest';
import { stringify } from 'yaml';
import type { ConversationTopic } from '../../src/core/npcs/ConversationTopic';
import type { Condition } from '../../src/core/rules/Condition';
import {
  AREA_ID,
  loadValidation,
  parsedCard,
  parsedSet,
  type CardSet,
  type Finding,
  type ParsedCardSet,
} from './contentToolchain';

export type Data = Record<string, unknown>;

export const ACTOR_ID = 'npc-clerk';
export const NPCS_PATH = `${AREA_ID}/npcs.yaml`;

export function flag(name: string): Data {
  return { kind: 'flag-set', flag: name };
}

export function not(condition: Data): Data {
  return { kind: 'not', of: condition };
}

export function all(of: readonly Data[]): Data {
  return { kind: 'all', of };
}

export function any(of: readonly Data[]): Data {
  return { kind: 'any', of };
}

export function itemHeld(itemId: string): Data {
  return { kind: 'has-item', itemId };
}

export function inRoom(roomId: string): Data {
  return { kind: 'in-room', roomId };
}

export function inArea(worldId: string, areaId: string): Data {
  return { kind: 'in-area', worldId, areaId };
}

export function inNode(actorId: string, nodeId: string): Data {
  return { kind: 'in-node', actorId, nodeId };
}

export function npcKnows(actorId: string, topicId: string): Data {
  return { kind: 'npc-knows', actorId, topicId };
}

export function actorState(actorId: string, stateId: string): Data {
  return { kind: 'actor-state', actorId, stateId };
}

export function puzzleSolved(puzzleId: string): Data {
  return { kind: 'puzzle-solved', puzzleId };
}

export function quizPassed(quizId: string): Data {
  return { kind: 'quiz-passed', quizId };
}

export function visitedRoom(roomId: string): Data {
  return { kind: 'visited-room', roomId };
}

export function counterAtLeast(key: string, value: number): Data {
  return { kind: 'counter-at-least', key, value };
}

export function topic(overrides: Data = {}): Data {
  return {
    id: 'topic-alpha',
    actorId: ACTOR_ID,
    match: { kind: 'askTell', objectIds: ['data-types'] },
    isActive: all([]),
    responses: ['A reply.'],
    strategy: { kind: 'once' },
    effects: [],
    ...overrides,
  };
}

export function askTopic(
  id: string,
  objectIds: readonly string[],
  isActive: Data = all([]),
): Data {
  return topic({ id, match: { kind: 'ask', objectIds }, isActive });
}

export function tellTopic(
  id: string,
  objectIds: readonly string[],
  isActive: Data = all([]),
): Data {
  return topic({ id, match: { kind: 'tell', objectIds }, isActive });
}

export function askTellTopic(
  id: string,
  objectIds: readonly string[],
  isActive: Data = all([]),
): Data {
  return topic({ id, match: { kind: 'askTell', objectIds }, isActive });
}

export function giveTopic(
  id: string,
  itemIds: readonly string[],
  isActive: Data = all([]),
): Data {
  return topic({ id, match: { kind: 'give', itemIds }, isActive });
}

export function showTopic(
  id: string,
  itemIds: readonly string[],
  isActive: Data = all([]),
): Data {
  return topic({ id, match: { kind: 'show', itemIds }, isActive });
}

export function specialTopic(id: string, keywords: readonly string[]): Data {
  return topic({ id, match: { kind: 'special', keywords } });
}

export function commandTopic(id: string, keywords: readonly string[]): Data {
  return topic({ id, match: { kind: 'command', keywords } });
}

export function node(overrides: Data = {}): Data {
  return {
    id: 'node-clerk',
    actorId: ACTOR_ID,
    isSticky: false,
    topicIds: [],
    defaultTopicId: 'topic-alpha',
    authoring: {
      reserved: true,
      note: 'Declared teaching beat exercised by the C7 gate test.',
    },
    ...overrides,
  };
}

export function npcData(overrides: Data = {}): Data {
  return {
    kind: 'npc',
    areaId: AREA_ID,
    actors: [
      {
        id: ACTOR_ID,
        aliases: ['clerk'],
        initialStateId: 'actorstate-ready',
      },
    ],
    actorStates: [
      {
        id: 'actorstate-ready',
        stateDesc: 'Ready.',
        specialDesc: 'A clerk waits.',
      },
    ],
    conversationTopics: [topic()],
    conversationNodes: [],
    ...overrides,
  };
}

export function npcCards(data: Data): ParsedCardSet {
  return parsedSet(parsedCard(NPCS_PATH, data));
}

export function cardsWith(
  topics: readonly Data[],
  nodes: readonly Data[] = [],
): ParsedCardSet {
  return npcCards(
    npcData({ conversationTopics: topics, conversationNodes: nodes }),
  );
}

export function npcCardSet(data: Data): CardSet {
  return { files: [{ path: NPCS_PATH, text: stringify(data) }] };
}

export async function validateOverlap(
  cards: ParsedCardSet,
  options?: { readonly topicOverlap?: boolean },
): Promise<readonly Finding[]> {
  type Callable = (
    set: ParsedCardSet,
    settings?: { readonly topicOverlap?: boolean },
  ) => readonly Finding[];
  const { validateCards } = await loadValidation();
  return (validateCards as unknown as Callable)(cards, options);
}

export async function overlapFindingsFor(
  overrides: readonly Data[],
  nodes: readonly Data[] = [],
): Promise<readonly Finding[]> {
  const topics = overrides.map((override) => topic(override));
  return overlapFindings(
    await validateOverlap(cardsWith(topics, nodes), { topicOverlap: true }),
  );
}

export async function overlapMessagesFor(
  overrides: readonly Data[],
  nodes: readonly Data[] = [],
): Promise<readonly string[]> {
  const cards = cardsWith(
    overrides.map((override) => topic(override)),
    nodes,
  );
  const before = JSON.stringify(cards);
  const messages = overlapMessages(
    await validateOverlap(cards, { topicOverlap: true }),
  );
  expect(JSON.stringify(cards), 'validation must not mutate the cards').toBe(
    before,
  );
  return messages;
}

export async function pairMessages(
  first: Data,
  second: Data,
  nodes: readonly Data[] = [],
): Promise<readonly string[]> {
  return overlapMessagesFor([first, second], nodes);
}

export async function pairFindings(
  first: Data,
  second: Data,
  nodes: readonly Data[] = [],
): Promise<readonly Finding[]> {
  return overlapFindingsFor([first, second], nodes);
}

export function npcContentText(findings: readonly Finding[]): string {
  return findings
    .filter((finding) => finding.gate === 'npc-content')
    .map((finding) => finding.message)
    .join('\n');
}

export function overlapFindings(
  findings: readonly Finding[],
): readonly Finding[] {
  return findings.filter(
    (finding) =>
      finding.gate === 'npc-content' &&
      finding.message.startsWith('conversation topics '),
  );
}

export function overlapMessages(
  findings: readonly Finding[],
): readonly string[] {
  return overlapFindings(findings).map((finding) => finding.message);
}

export function messageFor(
  earlier: string,
  later: string,
  actorId: string = ACTOR_ID,
): string {
  return `conversation topics '${earlier}' and '${later}' overlap for actor '${actorId}'`;
}

export function isNamedTogether(
  message: string,
  first: string,
  second: string,
): boolean {
  return message.includes(`'${first}'`) && message.includes(`'${second}'`);
}

// The five accepted clerk topics from
// docs/content/1-2-1-data-representation/npcs.yaml. They are reproduced as
// declared literals so the W6 gate blocker is exercised without reading the
// accepted card set from disk.
export function clerkTopics(): readonly Data[] {
  const known = npcKnows(ACTOR_ID, 'number-conversion');
  const discovery = any([itemHeld('item-hex-nibble-card'), flag('hex-read')]);
  const scope = ['number-conversion'];
  return [
    topic({
      id: 'topic-clerk-bases',
      match: { kind: 'askTell', objectIds: scope },
      isActive: not(known),
    }),
    topic({
      id: 'topic-clerk-carries',
      match: { kind: 'askTell', objectIds: scope },
      isActive: flag('switches-set'),
    }),
    topic({
      id: 'topic-clerk-shifts',
      match: { kind: 'askTell', objectIds: scope },
      isActive: flag('carries-added'),
    }),
    topic({
      id: 'topic-clerk-bases-known',
      match: { kind: 'askTell', objectIds: scope },
      isActive: all([known, discovery]),
    }),
    topic({
      id: 'topic-clerk-shifts-known',
      match: { kind: 'askTell', objectIds: scope },
      isActive: all([known, flag('carries-added')]),
    }),
  ];
}

const RUNTIME_ACTIVE: Condition = { kind: 'all', of: [] };

export function runtimeTopic(
  overrides: Partial<ConversationTopic> = {},
): ConversationTopic {
  return {
    id: 'topic-runtime',
    actorId: ACTOR_ID,
    match: { kind: 'askTell', objectIds: ['data-types'] },
    isActive: RUNTIME_ACTIVE,
    responses: ['A reply.'],
    strategy: { kind: 'once' },
    effects: [],
    ...overrides,
  };
}
