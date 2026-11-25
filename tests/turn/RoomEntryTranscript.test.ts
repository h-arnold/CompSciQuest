// Browser-facing room-entry acceptance translated to a deterministic Game +
// formatter integration test (E2E-1, ROOM-TEXT-04 and ROOM-TEXT-05).
import { describe, expect, it } from 'vitest';
import { formatEvent } from '../../src/ui/formatEvent';
import type { GameEvent, RoomSummary } from '../../src/core/events/GameEvent';
import {
  authoredBundle,
  authoredGame,
  authoredState,
  messageTexts,
  readSave,
} from '../fixtures/authored';

function summaryOf(roomId: string): RoomSummary {
  const room = authoredBundle.rooms.getById(roomId);
  if (room === undefined) {
    throw new Error(`Authored room '${roomId}' is missing from the catalogue.`);
  }
  return {
    id: room.id,
    title: room.title,
    description: room.description,
    exits: room.exits.map((exit) => exit.direction),
  };
}

function transcript(events: readonly GameEvent[]): string[] {
  return events.flatMap((event) => formatEvent(event, authoredBundle));
}

describe('authored room-entry transcript', () => {
  it('ROOM-TEXT-04: east, in and out render catalogue titles, descriptions and exits rather than raw room IDs', () => {
    const { game } = authoredGame({
      state: authoredState({ roomId: 'room-arrival' }),
    });
    const hubBatch = game.submit('east');
    const interfaceBatch = game.submit('in');
    const returnBatch = game.submit('out');
    const lines = transcript([...hubBatch, ...interfaceBatch, ...returnBatch]);

    for (const roomId of ['room-network-hub', 'room-entry-interface']) {
      const room = authoredBundle.rooms.getById(roomId);
      if (room === undefined) {
        throw new Error(
          `Authored room '${roomId}' is missing from the catalogue.`,
        );
      }
      expect(lines).toContain(room.title);
      expect(lines).toContain(room.description);
      expect(lines).toContain(
        `Exits: ${room.exits.map((exit) => exit.direction).join(', ')}`,
      );
      expect(lines).not.toContain(roomId);
    }
    const hubLines = transcript(hubBatch);
    for (const flag of [
      'switches-set',
      'hex-read',
      'characters-matched',
      'picture-built',
      'sound-sampled',
      'stacks-sorted',
    ]) {
      expect(hubLines.join('\n')).toContain(flag);
    }
  });

  it('ROOM-TEXT-05: a turn-supplied room event formats as title, blank line, description and Exits while panels use view data', () => {
    const { game } = authoredGame({
      state: authoredState({ roomId: 'room-arrival' }),
    });
    const batch = game.submit('east');
    const entered = batch.find((event) => event.type === 'room-entered');
    if (entered?.type !== 'room-entered') {
      throw new Error(
        'Movement must supply a room-entered event to the formatter.',
      );
    }

    const lines = formatEvent(entered, authoredBundle);

    expect(lines).toEqual([
      entered.room.title,
      '',
      entered.room.description,
      `Exits: ${entered.room.exits.join(', ')}`,
    ]);
    expect(lines).toHaveLength(4);
    expect(lines.every((line) => typeof line === 'string')).toBe(true);
    expect(game.getViewData().position.roomId).toBe('room-network-hub');
  });

  it('E2E-1: every authored entry uses its catalogue summary and a room-entry hazard follows the description in one batch', () => {
    const { game, bus, storage } = authoredGame();
    game.newGame();
    const boot = bus.batches.at(-1) ?? [];
    expect(boot.filter((event) => event.type === 'room-entered')).toEqual([
      { type: 'room-entered', room: summaryOf('room-arrival') },
    ]);
    bus.batches.length = 0;

    const hub = game.submit('east');
    const interfaceRoom = game.submit('in');
    const backToHub = game.submit('out');
    expect(hub).toContainEqual({
      type: 'room-entered',
      room: summaryOf('room-network-hub'),
    });
    expect(interfaceRoom).toContainEqual({
      type: 'room-entered',
      room: summaryOf('room-entry-interface'),
    });
    expect(backToHub).toContainEqual({
      type: 'room-entered',
      room: summaryOf('room-network-hub'),
    });
    const hubText = transcript(hub).join('\n');
    for (const flag of [
      'switches-set',
      'hex-read',
      'characters-matched',
      'picture-built',
      'sound-sampled',
      'stacks-sorted',
    ]) {
      expect(hubText).toContain(flag);
    }

    const hazardBatch = game.submit('east');
    const enteredIndex = hazardBatch.findIndex(
      (event) => event.type === 'room-entered',
    );
    const hazardIndex = hazardBatch.findIndex(
      (event) => event.type === 'hazard-triggered',
    );
    expect(enteredIndex).toBeGreaterThanOrEqual(0);
    expect(hazardIndex).toBeGreaterThan(enteredIndex);
    expect(hazardBatch[enteredIndex]).toEqual({
      type: 'room-entered',
      room: summaryOf('room-switch-floor'),
    });
    const hazardLines = transcript(hazardBatch);
    expect(hazardLines.indexOf('The Switch Floor')).toBeLessThan(
      hazardLines.findIndex((line) => line.startsWith('Heat haze curls')),
    );
    expect(bus.batches.at(-1)).toEqual(hazardBatch);

    const saved = readSave(game, storage);
    const disarmed = {
      ...saved.dto,
      state: {
        ...saved.dto.state,
        flags: {
          ...saved.dto.state.flags,
          'switch-cooled': true,
          'carry-cleared': true,
          'stacks-sealed': true,
          'tiles-verified': true,
          'switches-set': true,
          'hex-read': true,
          'characters-matched': true,
          'picture-built': true,
          'sound-sampled': true,
          'stacks-sorted': true,
        },
      },
    };
    game.continueGame(disarmed);
    bus.batches.length = 0;

    const hall = authoredBundle.rooms.getById('room-binary-hall');
    if (hall === undefined) {
      throw new Error(
        'The authored Binary Hall is missing from the catalogue.',
      );
    }
    const gatedExits = hall.exits.filter(
      (exit) => exit.preconditions.length > 0,
    );
    expect(gatedExits).toHaveLength(6);
    for (const exit of gatedExits) {
      const batch = game.submit(exit.direction);
      expect(batch).toContainEqual({
        type: 'room-entered',
        room: summaryOf(exit.targetRoomId),
      });
      const spoke = authoredBundle.rooms.getById(exit.targetRoomId);
      const returnExit = spoke?.exits[0];
      if (returnExit === undefined) {
        throw new Error(
          `Authored spoke '${exit.targetRoomId}' has no return exit.`,
        );
      }
      game.submit(returnExit.direction);
    }
    expect(messageTexts(hazardBatch).length).toBeGreaterThan(0);
  });
});
