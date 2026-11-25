import { describe, expect, it } from 'vitest';
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { AreaDefinition } from '../../src/content/AreaDefinition';
import type { Effect } from '../../src/core/effects/Effect';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { AreaProgress } from '../../src/core/GameState';
import {
  authoredBundle,
  authoredGame,
  authoredState,
  readSave,
} from '../fixtures/authored';
import { catalogueOf } from '../fixtures/persistence';

const BINARY_HALL = 'room-binary-hall';
const SWITCH_FLOOR = 'room-switch-floor';
const ARRIVAL = 'room-arrival';
const NETWORK_HUB = 'room-network-hub';
const BINARY_HALL_SCORE = 5;

function areaFor(bundle: ContentBundle, roomId: string): AreaDefinition {
  const area = bundle.areas.all.find((entry) => entry.roomIds.includes(roomId));
  if (area === undefined) throw new Error(`No area owns ${roomId}.`);
  return area;
}

function progressRow(
  bundle: ContentBundle,
  roomId: string,
  earnedScore: number,
  visitedRooms: readonly string[],
): AreaProgress {
  const area = areaFor(bundle, roomId);
  return {
    worldId: area.worldId,
    areaId: area.id,
    visitedRooms,
    completedTopics: [],
    earnedScore,
    maxScore: bundle.specTopics
      .getByAreaId(area.worldId, area.id)
      .reduce((total, topic) => total + topic.maxScore, 0),
  };
}

function scoredBinaryHallBundle(): ContentBundle {
  return {
    ...authoredBundle,
    rooms: catalogueOf(
      authoredBundle.rooms.all.map((room) =>
        room.id === BINARY_HALL ? { ...room, score: BINARY_HALL_SCORE } : room,
      ),
    ),
  };
}

function ejectionFixture(): {
  readonly bundle: ContentBundle;
  readonly state: ReturnType<typeof authoredState>;
  readonly game: ReturnType<typeof authoredGame>['game'];
  readonly storage: ReturnType<typeof authoredGame>['storage'];
} {
  const bundle = scoredBinaryHallBundle();
  const switchyard = progressRow(bundle, SWITCH_FLOOR, 2, [SWITCH_FLOOR]);
  const arrival = progressRow(bundle, ARRIVAL, 3, [ARRIVAL]);
  const hub = progressRow(bundle, NETWORK_HUB, 7, [NETWORK_HUB]);
  const state = authoredState({
    roomId: SWITCH_FLOOR,
    progress: [switchyard, arrival, hub],
  });
  const fixture = authoredGame({
    bundle,
    state,
    overrides: {
      dispatch: (): readonly Effect[] => [
        {
          kind: 'move-player',
          roomId: BINARY_HALL,
          reason: 'enter the scored hall',
        },
        {
          kind: 'move-player',
          roomId: ARRIVAL,
          reason: 'same-turn ejection',
        },
      ],
      react: (): readonly GameEvent[] => [],
    },
  });
  return { bundle, state, ...fixture };
}

describe('W7R-AREA-01 entered-room score ownership', () => {
  it('W7R-AREA-01: a buffered Binary Hall visit credits its resolved area before ejection', () => {
    const { bundle, state, game, storage } = ejectionFixture();

    const batch = game.submit('look');
    const { dto } = readSave(game, storage);
    const switchyardArea = areaFor(bundle, BINARY_HALL);
    const savedSwitchyard = dto.state.progress.find(
      (entry) =>
        entry.worldId === switchyardArea.worldId &&
        entry.areaId === switchyardArea.id,
    );
    const arrivalArea = areaFor(bundle, ARRIVAL);
    const savedArrival = dto.state.progress.find(
      (entry) =>
        entry.worldId === arrivalArea.worldId &&
        entry.areaId === arrivalArea.id,
    );
    const hubArea = areaFor(bundle, NETWORK_HUB);
    const savedHub = dto.state.progress.find(
      (entry) =>
        entry.worldId === hubArea.worldId && entry.areaId === hubArea.id,
    );

    expect(
      batch
        .filter((event) => event.type === 'room-entered')
        .map((event) => event.room.id),
    ).toEqual([BINARY_HALL, ARRIVAL]);
    expect(savedSwitchyard).toMatchObject({
      earnedScore: 7,
      visitedRooms: [SWITCH_FLOOR, BINARY_HALL],
    });
    expect(state.player.position).toEqual({
      worldId: arrivalArea.worldId,
      areaId: arrivalArea.id,
      roomId: ARRIVAL,
    });
    expect(savedArrival).toEqual(progressRow(bundle, ARRIVAL, 3, [ARRIVAL]));
    expect(savedHub).toEqual(
      progressRow(bundle, NETWORK_HUB, 7, [NETWORK_HUB]),
    );
    expect(batch.filter((event) => event.type === 'score-changed')).toEqual([
      {
        type: 'score-changed',
        delta: BINARY_HALL_SCORE,
        total: 17,
        reason: `room:${BINARY_HALL}`,
      },
    ]);
  });

  it('W7R-AREA-01: repeated buffered visits add no duplicate visit or points and save unique rows', () => {
    const { bundle, game, storage } = ejectionFixture();
    game.submit('look');
    const firstSaved = readSave(game, storage).dto.state.progress;

    const repeated = game.submit('look');

    expect(repeated.filter((event) => event.type === 'score-changed')).toEqual(
      [],
    );
    const secondSaved = readSave(game, storage).dto.state.progress;
    expect(secondSaved).toEqual(firstSaved);

    const pairs = secondSaved.map((entry) => [entry.worldId, entry.areaId]);
    expect(new Set(pairs).size).toBe(pairs.length);
    const binaryHallArea = areaFor(bundle, BINARY_HALL);
    expect(
      secondSaved.find(
        (entry) =>
          entry.worldId === binaryHallArea.worldId &&
          entry.areaId === binaryHallArea.id,
      ),
    ).toMatchObject({
      earnedScore: 7,
      visitedRooms: [SWITCH_FLOOR, BINARY_HALL],
    });
  });
});
