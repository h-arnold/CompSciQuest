// In-memory turn-pipeline fixtures. Every collaborator is injected; no real
// clock, storage, random source or DOM is used (architecture.md §9).
import { expect } from 'vitest';
import type { Clock } from '../../src/application/Clock';
import type { Game } from '../../src/application/Game';
import type { SaveManager } from '../../src/application/SaveManager';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { Command } from '../../src/core/commands/Command';
import type { Effect } from '../../src/core/effects/Effect';
import type { EventBus } from '../../src/core/events/EventBus';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { GameState } from '../../src/core/GameState';
import type { Session } from '../../src/core/lifecycle/Session';
import type { Random } from '../../src/core/Random';
import type { ScoreTracker } from '../../src/core/scoring/ScoreTracker';
import type { TurnContext } from '../../src/core/TurnContext';
import type { StorageAdapter } from '../../src/storage/StorageAdapter';
import { makeGameDependencies } from './persistence';
import { loadSeam } from './seams';

export interface TurnGameDependencies {
  readonly saveManager: SaveManager;
  readonly storage: StorageAdapter;
  readonly clock: Clock;
  readonly bundle: ContentBundle;
  readonly random: Random;
  readonly bus: EventBus;
  readonly downloadFile: (filename: string, text: string) => void;
  readonly initialState?: GameState;
  // Documented phase seams (shared-rules.md §2, application-and-ui.md §8).
  readonly resolve?: (raw: string) => Command;
  readonly check?: (command: Command, state: GameState) => readonly string[];
  readonly dispatch?: (
    command: Command,
    context: TurnContext,
  ) => readonly Effect[];
  readonly apply?: (effect: Effect) => readonly GameEvent[];
  readonly react?: (
    state: GameState,
    events: readonly GameEvent[],
  ) => readonly Effect[];
  readonly score?: ScoreTracker;
  readonly session?: Session;
  readonly clearViews?: () => void;
}

export type EventBusFactory = () => EventBus;
export type FormatEventFunction = (
  event: GameEvent,
  bundle: ContentBundle,
) => readonly string[];

export function loadEventBus(): Promise<EventBusFactory> {
  return loadSeam<EventBusFactory>(
    '../../src/core/events/EventBus',
    'createEventBus',
    'application-and-ui.md §6 — publish takes the whole batch and subscribe returns an unsubscribe function',
  );
}

export function loadFormatEvent(): Promise<FormatEventFunction> {
  return loadSeam<FormatEventFunction>(
    '../../src/ui/formatEvent',
    'formatEvent',
    'application-and-ui.md §6.1 — every event yields at least one transcript line',
  );
}

export class MemoryBus implements EventBus {
  private readonly trace: string[];
  readonly batches: Array<readonly GameEvent[]> = [];
  readonly listeners: Array<(event: GameEvent) => void> = [];

  constructor(trace: string[]) {
    this.trace = trace;
  }

  publish(events: readonly GameEvent[]): void {
    this.trace.push('publish');
    this.batches.push(events);
    for (const listener of this.listeners) {
      for (const event of events) listener(event);
    }
  }

  subscribe(listener: (event: GameEvent) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index !== -1) this.listeners.splice(index, 1);
    };
  }
}

export function makeTurnDependencies(
  calls: string[],
  overrides: Partial<TurnGameDependencies>,
): TurnGameDependencies {
  return {
    ...makeGameDependencies(),
    bus: new MemoryBus(calls),
    ...overrides,
  };
}

// Stand-ins for the documented phases. The unknown-command handler emits the
// documented friendly message; effect application is deliberately trivial here
// so the assertion is about phase behaviour, not effect semantics.
export function phaseFakes(calls: string[]): Partial<TurnGameDependencies> {
  return {
    resolve: (raw: string): Command => {
      calls.push('resolve');
      return { kind: 'unknown', raw };
    },
    check: (): readonly string[] => {
      calls.push('validate');
      return [];
    },
    dispatch: (command: Command): readonly Effect[] => {
      calls.push('execute');
      const text =
        command.kind === 'unknown' ? "I don't understand that." : 'command ran';
      return [{ kind: 'message', text }];
    },
    apply: (effect: Effect): readonly GameEvent[] => {
      const text = 'text' in effect ? effect.text : effect.kind;
      return [{ type: 'message', text }];
    },
    react: (): readonly Effect[] => {
      calls.push('react');
      return [];
    },
    score: {
      observe(events: readonly GameEvent[]): readonly GameEvent[] {
        calls.push('observe-score');
        return events;
      },
      getTotal(): number {
        return 0;
      },
    },
    session: {
      observe(events: readonly GameEvent[]): readonly GameEvent[] {
        calls.push('observe-session');
        return events;
      },
      newGame(): void {
        calls.push('session-new-game');
      },
    },
    clearViews(): void {
      calls.push('clear-views');
    },
  };
}

export async function loadGameWithPhases(
  dependencies: TurnGameDependencies,
): Promise<Game> {
  const module: Partial<{
    createGame: (dependencies: TurnGameDependencies) => Game;
  }> = await import('../../src/application/Game');
  expect(
    module.createGame,
    'createGame must be exported from src/application/Game.ts (application-and-ui.md §4)',
  ).toBeTypeOf('function');
  return module.createGame!(dependencies);
}
