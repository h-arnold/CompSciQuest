// Deterministic, in-memory fixtures for the npcs slice red tests. Every
// collaborator is injected; no browser storage, wall clock, Math.random,
// network or file system is used. Missing NPC factories are reported by a
// named assertion (tests/fixtures/seams.ts), never a raw import error.
import { catalogueOf } from '../../src/content/Catalogue';
import { createEffectApplier } from '../../src/core/effects/EffectApplier';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { ActorDefinition } from '../../src/content/ActorDefinition';
import type { Command } from '../../src/core/commands/Command';
import type { EffectApplier } from '../../src/core/effects/EffectApplier';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { GameState, GameStateDto } from '../../src/core/GameState';
import type { ActorState } from '../../src/core/npcs/ActorState';
import type { ConversationNode } from '../../src/core/npcs/ConversationNode';
import type { ConversationTopic } from '../../src/core/npcs/ConversationTopic';
import type { ResolvedTopic } from '../../src/core/npcs/ResolvedTopic';
import type { NpcStateDto } from '../../src/core/NpcStateDto';
import type { Random } from '../../src/core/Random';
import type { ConditionEvaluator } from '../../src/core/rules/ConditionEvaluator';
import { expect } from 'vitest';
import {
  FakeRandom,
  loadGame as loadGameFromPersistence,
  makeBundle,
  makeGameDependencies,
  makeRuntimeState,
  makeStateDto,
  type GameDependencies,
} from './persistence';
import { loadSeam } from './seams';
import {
  loadConditionEvaluatorFactory,
  turnContext,
  type TurnContract,
} from './mechanics';

export { loadGame } from './persistence';

export const ACTOR_ID = 'npc-1';
export const ACTOR_ALIAS = 'guide';
export const READY = 'ready';
export const TALKING = 'talking';
export const NODE_ID = 'node-explain';
export const DEFAULT_TOPIC_ID = 'default-ask-tell';
export const RING_TOPIC_ID = 'topic-ring';
export const WHY_TOPIC_ID = 'topic-why';
export const GIVE_TOPIC_ID = 'topic-give';
export const SHOW_TOPIC_ID = 'topic-show';
export const ENTER_NODE_TOPIC_ID = 'topic-enter-node';
export const LEARN_TOPIC_ID = 'topic-learn';
export const FLAG_TOPIC_ID = 'topic-flag';
export const QUIZ_TOPIC_ID = 'topic-quiz';
export const QUIZ_ID = 'quiz-1';
export const ITEM_ID = 'lamp';
export const DEFAULT_REPLY = 'The guide changes the subject.';
export const GREETING = 'The guide looks up and smiles.';
export const NEVER_FLAG = 'never-set';

// A deterministically true condition without inventing a new Condition kind.
export const always: ConditionEvaluatorCondition = {
  kind: 'not',
  of: { kind: 'flag-set', flag: NEVER_FLAG },
};

type ConditionEvaluatorCondition = Parameters<
  ConditionEvaluator['evaluate']
>[0];

export interface TopicResolverContract {
  resolve(
    phrase: string,
    state: GameState,
    node?: ConversationNode,
  ): ResolvedTopic;
}

export interface DialogueSystemContract {
  react(
    context: TurnContract,
    events: readonly GameEvent[],
  ): readonly GameEvent[];
}

export interface NpcDependencies {
  readonly bundle: ContentBundle;
  readonly evaluator: ConditionEvaluator;
  readonly random: Random;
  readonly applier: EffectApplier;
}

export type TopicResolverFactory = (
  dependencies: NpcDependencies,
) => TopicResolverContract;
export type DialogueSystemFactory = (
  dependencies: NpcDependencies,
) => DialogueSystemContract;

export function loadTopicResolverFactory(): Promise<TopicResolverFactory> {
  return loadSeam(
    '../../src/core/commands/TopicResolver',
    'createTopicResolver',
    'npcs.md §3 — object alias, node keyword then free-text, no parser error',
  );
}

export function loadDialogueSystemFactory(): Promise<DialogueSystemFactory> {
  return loadSeam(
    '../../src/core/npcs/DialogueSystem',
    'createDialogueSystem',
    'npcs.md §4/§7 — phase-4 reaction with an injected EffectApplier',
  );
}

export async function resolverFor(
  bundle: ContentBundle = npcBundle(),
): Promise<TopicResolverContract> {
  const createEvaluator = await loadConditionEvaluatorFactory();
  const createResolver = await loadTopicResolverFactory();
  const random = new FakeRandom([0]);
  return createResolver({
    bundle,
    evaluator: createEvaluator(),
    random,
    applier: createEffectApplier(npcState(), { random }),
  });
}

export async function dialogueSystemFor(
  bundle: ContentBundle,
  state: GameState,
): Promise<DialogueSystemContract> {
  const createEvaluator = await loadConditionEvaluatorFactory();
  const createDialogueSystem = await loadDialogueSystemFactory();
  const random = new FakeRandom([0]);
  return createDialogueSystem({
    bundle,
    evaluator: createEvaluator(),
    random,
    applier: createEffectApplier(state, { random }),
  });
}

export function actorState(
  id: string,
  overrides: Partial<ActorState> = {},
): ActorState {
  return {
    id,
    stateDesc: `${id} description.`,
    specialDesc: `${id} special description.`,
    ...overrides,
  };
}

export function topic(
  overrides: Partial<ConversationTopic> = {},
): ConversationTopic {
  return {
    id: RING_TOPIC_ID,
    match: { kind: 'askTell', objectIds: [ITEM_ID] },
    isActive: always,
    responses: ['A ring, you say?'],
    strategy: { kind: 'sequence' },
    effects: [],
    ...overrides,
  };
}

export function node(
  overrides: Partial<ConversationNode> = {},
): ConversationNode {
  return {
    id: NODE_ID,
    isSticky: false,
    topics: [],
    defaultTopicId: DEFAULT_TOPIC_ID,
    ...overrides,
  };
}

export interface NpcBundleOptions {
  readonly topics?: readonly ConversationTopic[];
  readonly nodes?: readonly ConversationNode[];
  readonly states?: readonly ActorState[];
  readonly actors?: readonly ActorDefinition[];
}

export function npcBundle(options: NpcBundleOptions = {}): ContentBundle {
  const base = makeBundle();
  return {
    ...base,
    actors: catalogueOf(
      options.actors ?? [
        { id: ACTOR_ID, aliases: [ACTOR_ALIAS], initialStateId: READY },
      ],
    ),
    actorStates: catalogueOf(
      options.states ?? [actorState(READY), actorState(TALKING)],
    ),
    conversationTopics: catalogueOf(options.topics ?? []),
    nodes: catalogueOf(options.nodes ?? []),
  };
}

export function defaultTopic(
  response: string = DEFAULT_REPLY,
): ConversationTopic {
  return topic({
    id: DEFAULT_TOPIC_ID,
    match: { kind: 'askTell', objectIds: [] },
    responses: [response],
  });
}

export function npcDto(overrides: Partial<NpcStateDto> = {}): NpcStateDto {
  const { activeNodeId, ...rest } = overrides;
  const base: NpcStateDto = {
    stateId: TALKING,
    knownTopics: [],
    inventory: [],
    topicUses: {},
  };
  return activeNodeId === undefined
    ? { ...base, ...rest }
    : { ...base, ...rest, activeNodeId };
}

export function npcState(overrides: Partial<GameStateDto> = {}): GameState {
  return makeRuntimeState(
    makeStateDto({
      // No covered topic is complete, so Session never adds a game-won event
      // to the batch under test.
      progress: [
        {
          worldId: 'world-stub',
          areaId: 'area-stub',
          visitedRooms: ['room-stub-start'],
          completedTopics: [],
          earnedScore: 0,
          maxScore: 10,
        },
      ],
      npcs: { [ACTOR_ID]: npcDto() },
      ...overrides,
    }),
  );
}

export interface NpcContextOptions {
  readonly bundle?: ContentBundle;
  readonly command?: Command;
  readonly turn?: number;
}

export function npcContext(
  state: GameState,
  options: NpcContextOptions = {},
): TurnContract {
  return turnContext(state, {
    bundle: options.bundle ?? npcBundle(),
    command: options.command ?? { kind: 'talk-to', actorId: ACTOR_ID },
    turn: options.turn ?? state.turn,
  });
}

export interface NpcGameOptions {
  readonly bundle?: ContentBundle;
  readonly state?: GameState;
  readonly command: Command;
  readonly resolve?: (raw: string) => Command;
  readonly random?: Random;
}

export interface NpcGameDependencies extends GameDependencies {
  readonly resolve?: (raw: string) => Command;
}

function resolveNpcRaw(raw: string, actorId: string): Command | undefined {
  const phrase = raw.trim().toLowerCase();
  if (phrase === 'bye') return { kind: 'bye' };
  const match = /^(talk|ask|tell|give|show) guide(?: (.+))?$/u.exec(phrase);
  if (match === null) return undefined;
  const verb = match[1];
  const object = match[2];
  if (verb === 'talk') return { kind: 'talk-to', actorId };
  if (object === undefined) return undefined;
  const resolved = object === 'ring' ? ITEM_ID : object;
  if (verb === 'ask') return { kind: 'ask', actorId, topic: resolved };
  if (verb === 'tell') return { kind: 'tell', actorId, topic: resolved };
  return { kind: verb === 'give' ? 'give' : 'show', actorId, itemId: resolved };
}

export function npcGameDependencies(
  options: NpcGameOptions,
): NpcGameDependencies {
  const bundle = options.bundle ?? npcBundle();
  const actorId = bundle.actors.all[0]?.id ?? ACTOR_ID;
  const base = makeGameDependencies({
    bundle,
    initialState: options.state ?? npcState(),
    random: options.random ?? new FakeRandom([0]),
  });
  return {
    ...base,
    resolve:
      options.resolve ??
      ((raw) => resolveNpcRaw(raw, actorId) ?? options.command),
  };
}

export interface SubmitNpcOptions {
  readonly bundle?: ContentBundle;
  readonly state?: GameState;
  readonly random?: Random;
}

export async function submitNpc(
  command: Command,
  options: SubmitNpcOptions = {},
) {
  const state =
    options.state ??
    npcState({ npcs: { [ACTOR_ID]: npcDto({ stateId: READY }) } });
  const game = await loadGameFromPersistence(
    npcGameDependencies({
      bundle: options.bundle ?? npcBundle(),
      state,
      command,
      ...(options.random !== undefined && { random: options.random }),
    }),
  );
  return { events: game.submit('npc command'), game, state };
}

export const askRing: Command = {
  kind: 'ask',
  actorId: ACTOR_ID,
  topic: ITEM_ID,
};

export const talkToGuide: Command = {
  kind: 'talk-to',
  actorId: ACTOR_ID,
};

export const byeCommand: Command = { kind: 'bye' };

// A counting Random proves that a deterministic rotating cycle never draws on
// the injected port without an explicit authoring flag (NPC-GAP-07).
export class CountingRandom implements Random {
  calls = 0;

  nextInt(): number {
    this.calls += 1;
    return 0;
  }
}

export function eventTypes(events: readonly GameEvent[]): string[] {
  return events.map((event) => event.type);
}

export function spokenTexts(events: readonly GameEvent[]): string[] {
  return events.flatMap((event) =>
    event.type === 'npc-spoke' ? [event.text] : [],
  );
}

export function assertActorState(state: GameState, stateId: string): void {
  expect(state.npcs[ACTOR_ID]?.stateId).toBe(stateId);
}
