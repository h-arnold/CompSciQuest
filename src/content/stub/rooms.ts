// STUB — replace with authored content
import type { RoomDefinition } from '../RoomDefinition';

export const stubRooms: readonly RoomDefinition[] = [
  {
    id: 'room-stub-start',
    title: 'Stub Starting Room',
    description: 'A deterministic placeholder room for boot and browser tests.',
    exits: [
      {
        direction: 'north',
        targetRoomId: 'room-stub-north',
        preconditions: [],
      },
    ],
    entryEffects: [],
    score: 0,
  },
  {
    id: 'room-stub-north',
    title: 'Stub Northern Room',
    description: 'The second placeholder room; return south to the start.',
    exits: [
      {
        direction: 'south',
        targetRoomId: 'room-stub-start',
        preconditions: [],
      },
    ],
    entryEffects: [],
    score: 0,
  },
];
