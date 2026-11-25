// NPC turn mechanics shared by the phase-4 DialogueSystem (npcs.md §4, §5, §7).
// Every effect goes through the injected EffectApplier; this module only
// assembles events and maintains the one counter no effect kind carries.
import type { Command } from '../commands/Command';
import {
  createTopicResolver,
  type TopicResolver,
} from '../commands/TopicResolver';
import type { Effect } from '../effects/Effect';
import type { EffectApplier } from '../effects/EffectApplier';
import type { GameEvent } from '../events/GameEvent';
import type { GameState } from '../GameState';
import type { TurnContext } from '../TurnContext';
import type { ConversationNode } from './ConversationNode';
import type { ConversationTopic } from './ConversationTopic';
import type { NpcDependencies } from './NpcDependencies';
import {
  findDefaultTopic,
  selectTopic,
  type SelectedTopic,
} from './TopicSelection';

// Engine roles from npcs.md §4/§6, not authored content IDs. The ready state is
// the actor's declared initial state; "talking" is the conversation role.
const TALKING_STATE = 'talking';

interface MutableNpcState {
  stateId: string;
  knownTopics: string[];
  inventory: string[];
  activeNodeId?: string;
  topicUses: Record<string, number>;
}

function mutableNpc(
  state: GameState,
  actorId: string,
): MutableNpcState | undefined {
  return state.npcs[actorId] as MutableNpcState | undefined;
}

function phraseOf(command: Command): string | undefined {
  switch (command.kind) {
    case 'ask':
    case 'tell': {
      return command.topic;
    }
    case 'give':
    case 'show': {
      return command.itemId;
    }
    default: {
      return undefined;
    }
  }
}

export function createNpcTopicResolver(
  dependencies: NpcDependencies,
): TopicResolver {
  return createTopicResolver(dependencies);
}

function usesOf(npc: MutableNpcState, topicId: string): number {
  return npc.topicUses[topicId] ?? 0;
}

function incrementUses(npc: MutableNpcState, topicId: string): number {
  const next = usesOf(npc, topicId) + 1;
  npc.topicUses[topicId] = next;
  return next;
}

function responseFor(
  topic: ConversationTopic,
  uses: number,
): string | undefined {
  const responses = topic.responses;
  const first = responses[0];
  if (first === undefined) return undefined;
  if (topic.strategy.kind === 'once') return uses === 0 ? first : undefined;
  const index =
    topic.strategy.kind === 'sequence'
      ? Math.min(uses, responses.length - 1)
      : uses % responses.length;
  return responses[index] ?? first;
}

function applyAll(
  effects: readonly Effect[],
  applier: EffectApplier,
  events: GameEvent[],
): void {
  for (const effect of effects) {
    for (const event of applier.apply(effect)) events.push(event);
  }
}

function applyTopicEffects(
  topic: ConversationTopic,
  npc: MutableNpcState,
  dependencies: NpcDependencies,
  events: GameEvent[],
): void {
  const { applier, bundle } = dependencies;
  for (const effect of topic.effects) {
    // A repeated lesson must not claim new knowledge twice; the effect is
    // still routed through the canonical applier on the first application.
    if (
      effect.kind === 'learn-topic' &&
      npc.knownTopics.includes(effect.topicId)
    ) {
      continue;
    }
    for (const event of applier.apply(effect)) events.push(event);
    if (effect.kind !== 'enter-node') continue;
    const node = bundle.nodes.getById(effect.nodeId);
    applyAll(node?.onEnterEffects ?? [], applier, events);
    npc.activeNodeId = effect.nodeId;
  }
}

export function startConversation(
  context: TurnContext,
  actorId: string,
  dependencies: NpcDependencies,
  events: GameEvent[],
): void {
  const { bundle, applier } = dependencies;
  const npc = mutableNpc(context.state, actorId);
  if (npc === undefined) return;
  events.push({ type: 'conversation-started', actorId });
  const definition = bundle.actorStates.getById(npc.stateId);
  applyAll(definition?.onEnter ?? [], applier, events);
  applyAll(
    [{ kind: 'set-actor-state', actorId, stateId: TALKING_STATE }],
    applier,
    events,
  );
}

export function endConversation(
  context: TurnContext,
  actorId: string,
  reason: string,
  dependencies: NpcDependencies,
  events: GameEvent[],
): void {
  const { applier, bundle } = dependencies;
  const npc = mutableNpc(context.state, actorId);
  if (npc === undefined) return;
  const current = bundle.actorStates.getById(npc.stateId);
  applyAll(current?.onExit ?? [], applier, events);
  if (npc.activeNodeId !== undefined) {
    applyAll([{ kind: 'exit-node', actorId }], applier, events);
  }
  events.push({ type: 'conversation-ended', actorId, reason });
  const ready = bundle.actors.getById(actorId)?.initialStateId ?? 'ready';
  applyAll(
    [{ kind: 'set-actor-state', actorId, stateId: ready }],
    applier,
    events,
  );
}

export function activeNode(
  context: TurnContext,
  actorId: string,
): ConversationNode | undefined {
  const nodeId = mutableNpc(context.state, actorId)?.activeNodeId;
  return nodeId === undefined
    ? undefined
    : context.bundle.nodes.getById(nodeId);
}

function fallBackAfterOnce(
  context: TurnContext,
  dependencies: NpcDependencies,
  actorId: string,
  node: ConversationNode | undefined,
  selected: SelectedTopic | undefined,
): SelectedTopic | undefined {
  if (selected === undefined) return undefined;
  if (selected.topic.strategy.kind !== 'once') return selected;
  const npc = mutableNpc(context.state, actorId);
  if (npc === undefined || usesOf(npc, selected.topic.id) === 0) {
    return selected;
  }
  const fallback = findDefaultTopic(
    context,
    dependencies.evaluator,
    actorId,
    node,
  );
  return fallback === undefined
    ? undefined
    : { topic: fallback, fromNode: false, isDefault: true };
}

export function handleConversationTopic(
  context: TurnContext,
  actorId: string,
  dependencies: NpcDependencies,
  resolver: TopicResolver,
  events: GameEvent[],
): void {
  const phrase = phraseOf(context.command);
  if (phrase === undefined) return;
  const npc = mutableNpc(context.state, actorId);
  if (npc === undefined) return;
  const node = activeNode(context, actorId);
  const resolved = resolver.resolve(phrase, context.state, node);
  const selected = fallBackAfterOnce(
    context,
    dependencies,
    actorId,
    node,
    selectTopic(
      context,
      dependencies.evaluator,
      actorId,
      node,
      resolved,
      phrase.trim().toLowerCase(),
    ),
  );
  if (selected === undefined) return;
  const { topic } = selected;
  const uses = incrementUses(npc, topic.id);
  const response = responseFor(topic, uses - 1);
  if (response !== undefined) {
    events.push({ type: 'npc-spoke', actorId, text: response });
  }
  if (topic.prompt !== undefined) {
    events.push({ type: 'topic-suggested', actorId, text: topic.prompt });
  }
  const isHadNode = npc.activeNodeId !== undefined;
  applyTopicEffects(topic, npc, dependencies, events);

  const entered = topic.effects.some((effect) => effect.kind === 'enter-node');
  const exited = topic.effects.some((effect) => effect.kind === 'exit-node');
  const specialExit =
    selected.fromNode &&
    resolved.kind === 'keyword' &&
    node !== undefined &&
    !node.isSticky;
  if (specialExit) {
    applyAll([{ kind: 'exit-node', actorId }], dependencies.applier, events);
  }
  // The authored default catches unmatched input and keeps the node open
  // (npcs.md §8). A matched non-special topic consumes a one-turn node instead.
  if (
    isHadNode &&
    !entered &&
    !exited &&
    !specialExit &&
    node !== undefined &&
    !node.isSticky &&
    !selected.isDefault
  ) {
    expireNode(context, actorId, dependencies, events);
  }
}

// A one-turn node that falls through to its catch-all ends with the
// conversation; the user decision for NPC-GAP-05 pins node-exited plus ready.
export function expireNode(
  context: TurnContext,
  actorId: string,
  dependencies: NpcDependencies,
  events: GameEvent[],
): void {
  const npc = mutableNpc(context.state, actorId);
  if (npc?.activeNodeId === undefined) return;
  applyAll([{ kind: 'exit-node', actorId }], dependencies.applier, events);
  events.push({ type: 'conversation-ended', actorId, reason: 'node expired' });
  const ready =
    context.bundle.actors.getById(actorId)?.initialStateId ?? 'ready';
  applyAll(
    [{ kind: 'set-actor-state', actorId, stateId: ready }],
    dependencies.applier,
    events,
  );
}

// `talk-to` on an actor already talking is an idle conversational turn: the
// actor speaks from its active topic without counting as a topic question.
export function handleIdleTopic(
  context: TurnContext,
  actorId: string,
  dependencies: NpcDependencies,
  events: GameEvent[],
): void {
  const node = activeNode(context, actorId);
  if (node !== undefined && !node.isSticky) {
    expireNode(context, actorId, dependencies, events);
    return;
  }
  const selected = selectTopic(
    context,
    dependencies.evaluator,
    actorId,
    node,
    { kind: 'free-text', text: '' },
    '',
  );
  if (selected === undefined) return;
  const npc = mutableNpc(context.state, actorId);
  if (npc === undefined) return;
  const uses = usesOf(npc, selected.topic.id);
  const response = responseFor(selected.topic, uses);
  if (response !== undefined) {
    events.push({ type: 'npc-spoke', actorId, text: response });
  }
  if (selected.topic.prompt !== undefined) {
    events.push({
      type: 'topic-suggested',
      actorId,
      text: selected.topic.prompt,
    });
  }
  applyTopicEffects(selected.topic, npc, dependencies, events);
}

export function speakingActorIds(state: GameState): readonly string[] {
  return Object.entries(state.npcs)
    .filter(([, record]) => record.stateId === TALKING_STATE)
    .map(([id]) => id);
}

export function isLeavingRoom(
  command: Command,
  events: readonly GameEvent[],
): boolean {
  const isEnteredRoom = events.some((event) => event.type === 'room-entered');
  return command.kind === 'go' && isEnteredRoom;
}

const HANDLED_NPC_EVENT_TYPES: ReadonlySet<string> = new Set([
  'conversation-started',
  'npc-spoke',
  'conversation-ended',
  'topic-suggested',
  'node-entered',
  'node-exited',
]);

export function hasHandledNpcTurn(events: readonly GameEvent[]): boolean {
  return events.some((event) => HANDLED_NPC_EVENT_TYPES.has(event.type));
}

export { TALKING_STATE };
