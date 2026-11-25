// Phase-4 seam from application-and-ui.md §8 / shared-rules.md §2. Each
// matched hazard applies its effects through the injected applier before the
// next hazard's `when` is evaluated (hazards.md §3 step 5).
import type { ContentBundle } from '../../content/ContentBundle';
import type { EffectApplier } from '../effects/EffectApplier';
import type { GameEvent } from '../events/GameEvent';
import type { GameState, HazardStateDto } from '../GameState';
import type { Random } from '../Random';
import type { ConditionEvaluator } from '../rules/ConditionEvaluator';
import type { Trigger } from '../rules/Trigger';
import type { TurnContext } from '../TurnContext';
import type { Hazard } from './Hazard';

export interface HazardSystem {
  react(
    context: TurnContext,
    events: readonly GameEvent[],
  ): readonly GameEvent[];
}

export interface HazardSystemDependencies {
  readonly bundle: ContentBundle;
  readonly evaluator: ConditionEvaluator;
  readonly random: Random;
  readonly applier: EffectApplier;
}

interface FiredThisTurn {
  readonly turn: number;
  readonly ids: Set<string>;
}

// `on-room-enter` matches a buffered `room-entered` event. The very first turn
// has no buffered entry, so the area's start room also counts: hazards.md §8
// pins that entry hazards fire after the initial room description. A scene
// injected into another room is not an entry and waits for a real transition.
function isInitialRoom(roomId: string, context: TurnContext): boolean {
  const { position } = context.state.player;
  if (position.roomId !== roomId) return false;
  const area = context.bundle.areas.getById(position.areaId);
  return area?.startRoomId === position.roomId;
}

function isTriggerMatched(
  trigger: Trigger,
  context: TurnContext,
  events: readonly GameEvent[],
): boolean {
  switch (trigger.kind) {
    case 'on-room-enter': {
      return (
        isInitialRoom(trigger.roomId, context) ||
        events.some(
          (event) =>
            event.type === 'room-entered' && event.room.id === trigger.roomId,
        )
      );
    }
    case 'on-turn': {
      return true;
    }
    case 'on-verb': {
      return context.command.kind === trigger.verb;
    }
    case 'on-item-used': {
      // Only an actual `use` counts: carrying or taking the same item is not
      // using it (hazards.md §2 action trap; shared-rules.md §4).
      const command = context.command;
      return (
        command.kind === 'use' &&
        'itemId' in command &&
        command.itemId === trigger.itemId
      );
    }
    case 'on-event': {
      return events.some((event) => event.type === trigger.eventType);
    }
    case 'on-schedule': {
      return events.some(
        (event) =>
          event.type === 'scheduled' && event.eventId === trigger.eventId,
      );
    }
  }
}

function shouldSkip(hazard: Hazard, state: GameState): boolean {
  const record = state.hazards[hazard.id];
  if (hazard.once === true && (record?.timesFired ?? 0) > 0) return true;
  if (
    hazard.cooldownTurns !== undefined &&
    record?.lastFiredTurn !== undefined &&
    state.turn - record.lastFiredTurn < hazard.cooldownTurns
  ) {
    return true;
  }
  return false;
}

function recordFire(state: GameState, hazardId: string): void {
  const previous = state.hazards[hazardId];
  const next: HazardStateDto = {
    timesFired: (previous?.timesFired ?? 0) + 1,
    lastFiredTurn: state.turn,
  };
  (state.hazards as Record<string, HazardStateDto>)[hazardId] = next;
}

export function createHazardSystem(
  dependencies: HazardSystemDependencies,
): HazardSystem {
  const { bundle, evaluator, applier } = dependencies;
  // Once-per-rule tracking is per turn and per system instance, not persisted
  // (shared-rules.md §11(4)). No other system shares these marks.
  const firedByState = new WeakMap<GameState, FiredThisTurn>();
  const hasAlreadyFired = (state: GameState, id: string): boolean =>
    firedByState.get(state)?.turn === state.turn &&
    firedByState.get(state)?.ids.has(id) === true;
  const markFired = (state: GameState, id: string): void => {
    const current = firedByState.get(state);
    const ids = current?.turn === state.turn ? current.ids : new Set<string>();
    ids.add(id);
    firedByState.set(state, { turn: state.turn, ids });
  };

  return {
    react(context, bufferedEvents): readonly GameEvent[] {
      const events: GameEvent[] = [];
      for (const hazard of bundle.hazards.all) {
        if (
          hasAlreadyFired(context.state, hazard.id) ||
          shouldSkip(hazard, context.state) ||
          !isTriggerMatched(hazard.trigger, context, bufferedEvents) ||
          !evaluator.evaluate(hazard.when, context.state, context)
        ) {
          continue;
        }
        markFired(context.state, hazard.id);
        recordFire(context.state, hazard.id);
        const announcement = applier.apply({
          kind: 'announce-hazard',
          hazardId: hazard.id,
          reason: hazard.id,
        });
        for (const event of announcement) events.push(event);
        // Puzzle phase is owned by PuzzleSystem alone (hazards.md §4).
        for (const effect of hazard.effects) {
          if (effect.kind.startsWith('set-puzzle-')) continue;
          for (const event of applier.apply(effect)) events.push(event);
        }
      }
      return events;
    },
  };
}
