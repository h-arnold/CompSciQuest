// MD-STATUS-02–06: generated status copy from spec §6.1–§6.2 and
// application-and-ui.md §6.1. Every collaborator is an in-memory fixture; the
// not-yet-landed core helper is loaded through an explicit named seam so a
// missing module reports the contract, not an opaque import error.
import { describe, expect, it } from 'vitest';
import type { GameEvent, RoomSummary } from '../../src/core/events/GameEvent';
import {
  authoredBundle,
  authoredGame,
  authoredState,
  messageTexts,
  switchyardProgress,
} from '../fixtures/authored';
import { makeBundle, makeTopic } from '../fixtures/persistence';
import { loadFormatEvent } from '../fixtures/turn';

const ROOM_TEXT_SPECIFIER = '../../src/core/RoomText';
const ROOM_TEXT_REASON =
  'spec §6.1 — src/core/RoomText.ts owns ROOM_HEADING and roomEntryLines';

interface RoomTextModule {
  readonly ROOM_HEADING: string;
  readonly roomEntryLines: (room: RoomSummary) => readonly string[];
}

async function loadRoomText(): Promise<RoomTextModule> {
  let imported: Record<string, unknown>;
  try {
    imported = await import(/* @vite-ignore */ ROOM_TEXT_SPECIFIER);
  } catch (error) {
    throw new Error(
      `Missing module ${ROOM_TEXT_SPECIFIER} — ${ROOM_TEXT_REASON}`,
      { cause: error },
    );
  }
  expect(
    imported['ROOM_HEADING'],
    `ROOM_HEADING must be exported (${ROOM_TEXT_REASON})`,
  ).toBe('##');
  expect(
    imported['roomEntryLines'],
    `roomEntryLines must be exported (${ROOM_TEXT_REASON})`,
  ).toBeTypeOf('function');
  return {
    ROOM_HEADING: imported['ROOM_HEADING'] as string,
    roomEntryLines: imported[
      'roomEntryLines'
    ] as RoomTextModule['roomEntryLines'],
  };
}

function authoredRoomSummary(roomId: string): RoomSummary {
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

describe('MD-STATUS generated markdown status lines', () => {
  it('MD-STATUS-02: RoomText.ts exports the shared level-two heading and the four room entry lines', async () => {
    const { ROOM_HEADING, roomEntryLines } = await loadRoomText();
    const room: RoomSummary = {
      id: 'room-stub-start',
      title: 'Stub Hall',
      description: 'A small hall.',
      exits: ['north', 'west'],
    };

    expect(ROOM_HEADING).toBe('##');
    expect(roomEntryLines(room)).toEqual([
      `${ROOM_HEADING} Stub Hall`,
      '',
      'A small hall.',
      'Exits: north, west',
    ]);
  });

  it('MD-STATUS-02: look in an authored room emits the same four lines joined with newlines', async () => {
    const { roomEntryLines } = await loadRoomText();
    const room = authoredRoomSummary('room-network-hub');
    const expected = roomEntryLines(room).join('\n');
    const { game } = authoredGame({
      state: authoredState({ roomId: 'room-network-hub' }),
    });

    const messages = messageTexts(game.submit('look'));

    expect(expected.split('\n')).toEqual([
      `## ${room.title}`,
      '',
      room.description,
      `Exits: ${room.exits.join(', ')}`,
    ]);
    expect(messages.filter((message) => message === expected)).toHaveLength(1);
    expect(game.getViewData().position.roomId).toBe('room-network-hub');
  });

  it('MD-STATUS-03: the score command bolds only the interpolated score value', async () => {
    const state = authoredState({
      progress: [switchyardProgress({ earnedScore: 12 })],
    });
    const { game } = authoredGame({ state });

    const messages = messageTexts(game.submit('score'));

    expect(messages).toContain('Your score is **12**.');
  });

  it('MD-STATUS-04: lives-changed bolds only the interpolated lives value', async () => {
    const formatEvent = await loadFormatEvent();

    expect(
      formatEvent({ type: 'lives-changed', lives: 2 }, makeBundle()),
    ).toEqual(['Lives: **2**.']);
  });

  it('MD-STATUS-05: topic-completed derives the title from the bundle and bolds only the title', async () => {
    const formatEvent = await loadFormatEvent();
    const bundle = makeBundle({
      topics: [
        makeTopic({
          id: 'topic-data-representation',
          title: 'Data representation',
        }),
      ],
    });
    const event: GameEvent = {
      type: 'topic-completed',
      topicId: 'topic-data-representation',
    };

    expect(formatEvent(event, bundle)).toEqual([
      'Topic completed: **Data representation**.',
    ]);
  });

  it('MD-STATUS-06: numerals in the agreed copy are values, not constants, and no other copy changes', async () => {
    const formatEvent = await loadFormatEvent();
    const bundle = makeBundle({
      topics: [makeTopic({ id: 'topic-graphics', title: 'Graphics' })],
    });

    for (const [delta, line] of [
      [1, 'You earned **1** points.'],
      [7, 'You earned **7** points.'],
    ] as const) {
      const event: GameEvent = {
        type: 'score-changed',
        delta,
        total: 9,
        reason: 'stub award',
      };
      expect(formatEvent(event, bundle), `delta ${delta}`).toEqual([line]);
    }
    expect(formatEvent({ type: 'lives-changed', lives: 5 }, bundle)).toEqual([
      'Lives: **5**.',
    ]);
    expect(
      formatEvent(
        { type: 'topic-completed', topicId: 'topic-graphics' },
        bundle,
      ),
    ).toEqual(['Topic completed: **Graphics**.']);
    expect(
      formatEvent(
        { type: 'game-over', reason: 'lives exhausted', finalScore: 5 },
        bundle,
      ),
    ).toEqual(['Game over — lives exhausted. Final score: 5.']);
    expect(formatEvent({ type: 'game-won', finalScore: 9 }, bundle)).toEqual([
      'You have won! Final score: 9.',
    ]);

    const state = authoredState({
      progress: [switchyardProgress({ earnedScore: 30 })],
    });
    const { game } = authoredGame({ state });
    expect(messageTexts(game.submit('score'))).toContain(
      'Your score is **30**.',
    );
  });
});
