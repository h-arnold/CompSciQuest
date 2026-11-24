// Canonical façade from application-and-ui.md §4. The façade owns the turn
// counter and the event buffer; it never computes game rules or scores itself.
import type { ContentBundle } from '../content/ContentBundle';
import { createInitial } from '../core/GameState';
import type { GameState } from '../core/GameState';
import type { EventBus } from '../core/events/EventBus';
import type { GameEvent, RoomSummary } from '../core/events/GameEvent';
import type { Random } from '../core/Random';
import type { StorageAdapter } from '../storage/StorageAdapter';
import type { Clock } from './Clock';
import type {
  AreaProgressView,
  GameViewData,
  SpecTopicView,
} from './GameViewData';
import type { LoadResult, SaveDto } from './SaveDto';
import type { SaveManager } from './SaveManager';

export interface Game {
  submit(raw: string): readonly GameEvent[];
  newGame(): void;
  continueGame(dto: SaveDto): void;
  restart(): void;
  getViewData(): GameViewData;
  save(): void;
  download(): void;
  importSave(text: string): LoadResult;
}

export interface GameDependencies {
  readonly saveManager: SaveManager;
  readonly storage: StorageAdapter;
  readonly clock: Clock;
  readonly bundle: ContentBundle;
  readonly random: Random;
  readonly bus: EventBus;
  readonly downloadFile: (filename: string, text: string) => void;
  readonly initialState?: GameState;
}

function initialBatch(
  state: GameState,
  bundle: ContentBundle,
): readonly GameEvent[] {
  const roomId = state.player.position.roomId;
  const room = bundle.rooms.getById(roomId);
  if (!room) {
    return [{ type: 'message', text: 'The adventure begins.' }];
  }
  const summary: RoomSummary = {
    id: room.id,
    title: room.title,
    description: room.description,
    exits: room.exits.map((exit) => exit.direction),
  };
  return [{ type: 'room-entered', room: summary }];
}

function areaViews(
  state: GameState,
  bundle: ContentBundle,
): readonly AreaProgressView[] {
  return state.progress.map((entry) => {
    const world = bundle.worlds.getById(entry.worldId);
    const area = bundle.areas.getById(entry.areaId);
    const topics: SpecTopicView[] = [];
    for (const topicId of entry.completedTopics) {
      const topic = bundle.specTopics.getById(topicId);
      if (!topic) continue;
      topics.push({
        id: topic.id,
        title: topic.title,
        specReference: topic.specReference,
        status: topic.status,
        complete: true,
      });
    }
    return {
      worldId: entry.worldId,
      areaId: entry.areaId,
      worldName: world?.name ?? entry.worldId,
      areaName: area?.name ?? entry.areaId,
      earnedScore: entry.earnedScore,
      maxScore: entry.maxScore,
      visitedRoomCount: entry.visitedRooms.length,
      roomCount: area?.roomIds.length ?? 0,
      topics,
    };
  });
}

export function createGame(dependencies: GameDependencies): Game {
  let state: GameState = dependencies.initialState ?? createInitial();

  const publish = (events: readonly GameEvent[]): readonly GameEvent[] => {
    dependencies.bus.publish(events);
    return events;
  };

  return {
    submit(raw: string): readonly GameEvent[] {
      (state as { turn: number }).turn += 1;
      return publish([
        { type: 'message', text: `I don't understand that: ${raw}` },
      ]);
    },
    newGame(): void {
      state = createInitial();
      publish(initialBatch(state, dependencies.bundle));
    },
    continueGame(dto: SaveDto): void {
      state = dependencies.saveManager.restore(dto);
      publish(initialBatch(state, dependencies.bundle));
    },
    restart(): void {
      state = createInitial();
      publish(initialBatch(state, dependencies.bundle));
    },
    getViewData(): GameViewData {
      return {
        status: state.status,
        position: state.player.position,
        turn: state.turn,
        lives: state.player.lives,
        score: state.score,
        areas: areaViews(state, dependencies.bundle),
        hints: [],
      };
    },
    save(): void {
      dependencies.saveManager.save(state);
    },
    download(): void {
      const text = JSON.stringify(dependencies.saveManager.buildDto(state));
      const filename = `compsciquest-save-${dependencies.clock.now().replaceAll(/[:.]/gu, '-')}.json`;
      dependencies.downloadFile(filename, text);
    },
    importSave(text: string): LoadResult {
      const result = dependencies.saveManager.validate(text);
      if (result.ok) {
        state = dependencies.saveManager.restore(result.dto);
      }
      return result;
    },
  };
}
