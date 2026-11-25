// Sole mutator for effect-driven fields (shared-rules.md §5). This slice
// implements the effects the persistence contracts exercise and gives every
// other documented effect its canonical event without inventing mechanics.
import type { GameState, RoomStateDto } from '../GameState';
import type { GameEvent } from '../events/GameEvent';
import type { Random } from '../Random';
import type { Effect } from './Effect';

export interface EffectApplierDependencies {
  readonly random: Random;
}

export interface EffectApplier {
  apply(effect: Effect): readonly GameEvent[];
}

function inventoryOf(state: GameState, ownerId: string): string[] | undefined {
  if (ownerId === 'player') {
    return (state.player as unknown as { inventory: string[] }).inventory;
  }
  const npc = state.npcs[ownerId];
  if (npc) return (npc as unknown as { inventory: string[] }).inventory;
  const room = state.rooms[ownerId];
  return room
    ? (room as unknown as { inventory: string[] }).inventory
    : undefined;
}

function transferItem(
  state: GameState,
  effect: Extract<Effect, { kind: 'transfer-item' }>,
): GameEvent {
  let target = inventoryOf(state, effect.toOwnerId);
  if (
    !target &&
    state.npcs[effect.toOwnerId] === undefined &&
    state.rooms[effect.toOwnerId] === undefined
  ) {
    const room: RoomStateDto = { inventory: [] };
    (state as { rooms: Record<string, RoomStateDto> }).rooms[effect.toOwnerId] =
      room;
    target = inventoryOf(state, effect.toOwnerId);
  }
  const source = inventoryOf(state, effect.fromOwnerId);
  if (source && target) {
    const index = source.indexOf(effect.itemId);
    if (index !== -1) {
      source.splice(index, 1);
      target.push(effect.itemId);
    }
  }
  return {
    type: 'item-moved',
    itemId: effect.itemId,
    fromOwnerId: effect.fromOwnerId,
    toOwnerId: effect.toOwnerId,
  };
}

function applyItemEffect(
  state: GameState,
  effect: Effect,
): readonly GameEvent[] | undefined {
  if (effect.kind === 'transfer-item') return [transferItem(state, effect)];
  if (effect.kind !== 'grant-item' && effect.kind !== 'remove-item')
    return undefined;
  const player = state.player as unknown as { inventory: string[] };
  const index = player.inventory.indexOf(effect.itemId);
  if (effect.kind === 'grant-item') {
    if (index === -1) player.inventory.push(effect.itemId);
  } else if (index !== -1) {
    player.inventory.splice(index, 1);
  }
  return [
    {
      type: 'item-moved',
      itemId: effect.itemId,
      fromOwnerId: effect.kind === 'grant-item' ? 'world' : 'player',
      toOwnerId: effect.kind === 'grant-item' ? 'player' : 'world',
    },
  ];
}

function applyStateEffect(
  state: GameState,
  effect: Effect,
): readonly GameEvent[] | undefined {
  if (effect.kind === 'change-lives') {
    const player = state.player as { lives: number };
    player.lives = Math.max(0, player.lives + effect.delta);
    return [{ type: 'lives-changed', lives: player.lives }];
  }
  if (effect.kind === 'set-flag') {
    (state.flags as Record<string, boolean>)[effect.flag] = effect.value;
    return [{ type: 'flag-changed', flag: effect.flag, value: effect.value }];
  }
  if (effect.kind === 'message')
    return [{ type: 'message', text: effect.text }];
  if (effect.kind === 'complete-topic') {
    const current = state.progress[0] as
      { completedTopics: string[] } | undefined;
    if (current && !current.completedTopics.includes(effect.topicId)) {
      current.completedTopics.push(effect.topicId);
    }
    return [{ type: 'topic-completed', topicId: effect.topicId }];
  }
  if (effect.kind === 'schedule') {
    (state.schedule as unknown[]).push(effect.event);
    return [
      {
        type: 'scheduled',
        eventId: effect.event.id,
        kind: effect.event.kind,
        remainingTurns: effect.event.remainingTurns,
      },
    ];
  }
  return undefined;
}

function applyEntityEffect(
  state: GameState,
  effect: Effect,
): readonly GameEvent[] | undefined {
  if (effect.kind === 'move-player') {
    (state.player as { position: { roomId: string } }).position.roomId =
      effect.roomId;
    return [
      {
        type: 'room-entered',
        room: {
          id: effect.roomId,
          title: effect.roomId,
          description: '',
          exits: [],
        },
      },
    ];
  }
  if (effect.kind === 'set-actor-state') {
    const npc = state.npcs[effect.actorId] as { stateId: string } | undefined;
    if (npc) npc.stateId = effect.stateId;
    return [
      {
        type: 'actor-state-changed',
        actorId: effect.actorId,
        stateId: effect.stateId,
      },
    ];
  }
  if (effect.kind === 'learn-topic') {
    const npc = state.npcs[effect.actorId] as
      { knownTopics: string[] } | undefined;
    if (npc && !npc.knownTopics.includes(effect.topicId)) {
      npc.knownTopics.push(effect.topicId);
    }
    return [
      {
        type: 'knowledge-gained',
        actorId: effect.actorId,
        topicId: effect.topicId,
      },
    ];
  }
  if (effect.kind === 'enter-node') {
    const npc = state.npcs[effect.actorId] as
      { activeNodeId?: string } | undefined;
    if (npc) npc.activeNodeId = effect.nodeId;
    return [
      { type: 'node-entered', actorId: effect.actorId, nodeId: effect.nodeId },
    ];
  }
  if (effect.kind === 'exit-node') {
    const npc = state.npcs[effect.actorId] as
      { activeNodeId?: string } | undefined;
    if (npc) delete npc.activeNodeId;
    return [{ type: 'node-exited', actorId: effect.actorId }];
  }
  return undefined;
}

function applySystemEffect(
  state: GameState,
  effect: Effect,
): readonly GameEvent[] | undefined {
  if (
    effect.kind === 'set-puzzle-active' ||
    effect.kind === 'set-puzzle-solved'
  ) {
    const isActive = effect.kind === 'set-puzzle-active';
    const puzzle = state.puzzles[effect.puzzleId] as
      { phase: string } | undefined;
    if (puzzle) puzzle.phase = isActive ? 'active' : 'solved';
    const event: GameEvent = {
      type: isActive ? 'puzzle-activated' : 'puzzle-solved',
      puzzleId: effect.puzzleId,
    };
    return [event];
  }
  if (effect.kind === 'start-quiz') {
    (state.quiz as { activeQuizId?: string }).activeQuizId = effect.quizId;
    return [
      { type: 'quiz-started', quizId: effect.quizId, actorId: effect.actorId },
    ];
  }
  if (effect.kind === 'show-hint') {
    return [
      {
        type: 'hint-shown',
        hintId: effect.hintId,
        level: effect.level,
        text: effect.text,
      },
    ];
  }
  return undefined;
}

export function hazardTriggeredEvent(
  effect: Extract<Effect, { kind: 'announce-hazard' }>,
): GameEvent {
  return {
    type: 'hazard-triggered',
    hazardId: effect.hazardId,
    reason: effect.reason,
  };
}

function applyBookkeepingEffect(
  _state: GameState,
  effect: Effect,
): readonly GameEvent[] | undefined {
  return effect.kind === 'announce-hazard'
    ? [hazardTriggeredEvent(effect)]
    : undefined;
}

function applyEffect(state: GameState, effect: Effect): readonly GameEvent[] {
  const handlers = [
    applyItemEffect,
    applyStateEffect,
    applyEntityEffect,
    applySystemEffect,
    applyBookkeepingEffect,
  ];
  for (const handler of handlers) {
    const events = handler(state, effect);
    if (events) return events;
  }
  return [{ type: 'message', text: '' }];
}

export function createEffectApplier(
  state: GameState,
  dependencies: EffectApplierDependencies,
): EffectApplier {
  // The injected source of randomness is retained for mechanic slices.
  const applier = {
    apply(effect: Effect): readonly GameEvent[] {
      return applyEffect(state, effect);
    },
    random: dependencies.random,
  };
  return applier;
}
