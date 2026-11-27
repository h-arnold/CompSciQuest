// Canonical room-entry text (spec §6.1, application-and-ui.md §6.1). One helper
// produces the four transcript entries shared by room entry and `look`, so the
// level-two location heading and the exits copy cannot drift apart.

export const ROOM_HEADING = '##';

export function roomEntryLines(room: {
  readonly title: string;
  readonly description: string;
  readonly exits: readonly string[];
}): readonly string[] {
  return [
    `${ROOM_HEADING} ${room.title}`,
    '',
    room.description,
    `Exits: ${room.exits.join(', ')}`,
  ];
}
