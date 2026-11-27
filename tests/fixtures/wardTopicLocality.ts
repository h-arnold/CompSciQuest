// Deterministic Assistance Ward locality fixtures. IDs, conditions and recovery
// effects mirror docs/content/assistance-ward/npcs.yaml; no YAML or generated
// content is read at runtime. Ward cards and cranks are deliberately absent from
// visible inventory so `card`/`crank` exercise declared-object exact matching.
import type { ContentBundle } from '../../src/content/ContentBundle';
import type { GameState } from '../../src/core/GameState';
import type { ConversationNode } from '../../src/core/npcs/ConversationNode';
import type { ConversationTopic } from '../../src/core/npcs/ConversationTopic';
import {
  actorState,
  always,
  defaultTopic,
  DEFAULT_REPLY,
  npcBundle,
  npcDto,
  npcState,
  TALKING,
  topic,
} from './npcs';

export const WORLD_ID = 'world-wjec-gcse-computer-science-2025-spec';
export const WARD_AREA_ID = 'area-assistance-ward';
export const INTAKE_ROOM_ID = 'room-assistance-intake';
export const DEMONSTRATION_ROOM_ID = 'room-assistance-demonstration';
export const RECORDS_ROOM_ID = 'room-assistance-records';
export const ARRIVAL_AREA_ID = 'area-entry-interface';
export const ARRIVAL_ROOM_ID = 'room-arrival';
export const AI_ID = 'npc-the-ai';
export const NIA_ID = 'npc-nia';
export const MATEO_ID = 'npc-mateo';
export const KOFI_ID = 'npc-kofi';
export const PRIYA_ID = 'npc-priya';
export const READY_STATE_ID = 'actorstate-ready';
export const PRIYA_NODE_ID = 'node-priya-choice';

export const RECOVERY_FLAGS = {
  nia: 'nia-observation-recovered',
  mateo: 'mateo-reading-recovered',
  kofi: 'kofi-operation-recovered',
  priya: 'priya-reasoning-recovered',
} as const;

export const DECOY_REPLY = 'A different topic answers.';

const NIA_RESPONSE =
  "Nia studies the observation card. 'That corner is chipped.' She compares the broken edge with the light, then writes the detail herself. 'I noticed that. The AI didn't tell me.'";
const MATEO_RESPONSE =
  "Mateo steadies the fixed instruction card. 'UNLOCK, OPEN, PLACE, CLOSE.' He stops after each word, waiting for an interruption. None comes. 'That is the whole instruction. I read it myself.'";
const KOFI_RESPONSE =
  "Kofi examines the fixed crank's handle and the chalk mark on its housing. 'One full turn brings the two marks together.' He guides the handle through one harmless cycle and watches the wheel settle. 'Start, turn, finish. I did the whole sequence.'";
const PRIYA_START_RESPONSE =
  "Priya slides the fixed audit card into view. 'CHECKED or ASSUMED. Quick answer: checked. No — wait.' She holds up one finger. 'Choose one. Then I need a reason that says what I checked and what it showed.'";
const PRIYA_CHOICE_RESPONSE =
  "Priya writes the word you chose beside the card. 'Done. No — done isn't a reason.' She looks up. 'What did I check, and what did it show?'";
const PRIYA_REASON_RESPONSE =
  "Priya listens, then writes your reason beside her choice. 'I can point to what I checked and what it showed. I don't have to be quick to have a reason.' She looks up, cheerful.";

interface RecoveryTopicInput {
  readonly id: string;
  readonly actorId: string;
  readonly objectId: string;
  readonly roomId: string;
  readonly flag: string;
  readonly recoveredStateId: string;
  readonly response: string;
}

function recoveryTopic(input: RecoveryTopicInput): ConversationTopic {
  return {
    id: input.id,
    actorId: input.actorId,
    match: { kind: 'askTell', objectIds: [input.objectId] },
    isActive: {
      kind: 'all',
      of: [
        { kind: 'in-room', roomId: input.roomId },
        { kind: 'not', of: { kind: 'flag-set', flag: input.flag } },
      ],
    },
    responses: [input.response],
    strategy: { kind: 'once' },
    effects: [
      { kind: 'set-flag', flag: input.flag, value: true },
      {
        kind: 'set-actor-state',
        actorId: input.actorId,
        stateId: input.recoveredStateId,
      },
    ],
  };
}

export const NIA_OBSERVATION = recoveryTopic({
  id: 'topic-nia-observation',
  actorId: NIA_ID,
  objectId: 'item-assistance-observation-card',
  roomId: INTAKE_ROOM_ID,
  flag: RECOVERY_FLAGS.nia,
  recoveredStateId: 'actorstate-nia-observant',
  response: NIA_RESPONSE,
});

export const MATEO_INSTRUCTION = recoveryTopic({
  id: 'topic-mateo-instruction',
  actorId: MATEO_ID,
  objectId: 'item-assistance-instruction-card',
  roomId: DEMONSTRATION_ROOM_ID,
  flag: RECOVERY_FLAGS.mateo,
  recoveredStateId: 'actorstate-mateo-reading',
  response: MATEO_RESPONSE,
});

export const KOFI_PRACTICE_CYCLE = recoveryTopic({
  id: 'topic-kofi-practice-cycle',
  actorId: KOFI_ID,
  objectId: 'item-assistance-practice-crank',
  roomId: DEMONSTRATION_ROOM_ID,
  flag: RECOVERY_FLAGS.kofi,
  recoveredStateId: 'actorstate-kofi-cycling',
  response: KOFI_RESPONSE,
});

export const PRIYA_CHOICE_START: ConversationTopic = {
  id: 'topic-priya-choice-start',
  actorId: PRIYA_ID,
  match: { kind: 'askTell', objectIds: ['item-assistance-audit-card'] },
  isActive: {
    kind: 'all',
    of: [
      { kind: 'in-room', roomId: RECORDS_ROOM_ID },
      {
        kind: 'not',
        of: { kind: 'flag-set', flag: RECOVERY_FLAGS.priya },
      },
      {
        kind: 'any',
        of: [
          {
            kind: 'not',
            of: { kind: 'flag-set', flag: 'priya-choice-taken' },
          },
          {
            kind: 'not',
            of: {
              kind: 'in-node',
              actorId: PRIYA_ID,
              nodeId: PRIYA_NODE_ID,
            },
          },
        ],
      },
    ],
  },
  responses: [PRIYA_START_RESPONSE],
  strategy: { kind: 'rotating' },
  effects: [{ kind: 'enter-node', actorId: PRIYA_ID, nodeId: PRIYA_NODE_ID }],
};

export const PRIYA_CHOICE_MADE: ConversationTopic = {
  id: 'topic-priya-choice-made',
  actorId: PRIYA_ID,
  match: {
    kind: 'special',
    keywords: ['checked', 'check', 'assumed', 'assume'],
  },
  isActive: {
    kind: 'all',
    of: [
      { kind: 'in-node', actorId: PRIYA_ID, nodeId: PRIYA_NODE_ID },
      {
        kind: 'not',
        of: { kind: 'flag-set', flag: 'priya-choice-taken' },
      },
    ],
  },
  responses: [PRIYA_CHOICE_RESPONSE],
  strategy: { kind: 'rotating' },
  effects: [{ kind: 'set-flag', flag: 'priya-choice-taken', value: true }],
  prompt: '(You could tell Priya what you checked and what it showed.)',
};

export const PRIYA_CHOICE_REASON: ConversationTopic = {
  id: 'topic-priya-choice-reason',
  actorId: PRIYA_ID,
  match: { kind: 'tell', objectIds: [] },
  isActive: {
    kind: 'all',
    of: [
      { kind: 'in-node', actorId: PRIYA_ID, nodeId: PRIYA_NODE_ID },
      { kind: 'flag-set', flag: 'priya-choice-taken' },
      {
        kind: 'not',
        of: { kind: 'flag-set', flag: RECOVERY_FLAGS.priya },
      },
    ],
  },
  responses: [PRIYA_REASON_RESPONSE],
  strategy: { kind: 'once' },
  effects: [
    { kind: 'set-flag', flag: RECOVERY_FLAGS.priya, value: true },
    {
      kind: 'set-actor-state',
      actorId: PRIYA_ID,
      stateId: 'actorstate-priya-reasoning',
    },
    { kind: 'exit-node', actorId: PRIYA_ID },
  ],
};

export const PRIYA_DEFAULT: ConversationTopic = {
  ...defaultTopic(),
  id: 'topic-priya-default',
  actorId: PRIYA_ID,
  isActive: {
    kind: 'all',
    of: [
      { kind: 'in-room', roomId: RECORDS_ROOM_ID },
      {
        kind: 'not',
        of: { kind: 'flag-set', flag: RECOVERY_FLAGS.priya },
      },
    ],
  },
};

export const PRIYA_RECOVERED_DEFAULT: ConversationTopic = {
  ...defaultTopic(),
  id: 'topic-priya-recovered-default',
  actorId: PRIYA_ID,
  isActive: {
    kind: 'all',
    of: [
      { kind: 'in-room', roomId: RECORDS_ROOM_ID },
      { kind: 'flag-set', flag: RECOVERY_FLAGS.priya },
    ],
  },
};

export const PRIYA_NODE: ConversationNode = {
  id: PRIYA_NODE_ID,
  isSticky: true,
  topics: [PRIYA_CHOICE_MADE, PRIYA_CHOICE_REASON, PRIYA_DEFAULT],
  defaultTopicId: PRIYA_DEFAULT.id,
};

export const PRIYA_TOPICS = [
  PRIYA_DEFAULT,
  PRIYA_RECOVERED_DEFAULT,
  PRIYA_CHOICE_START,
  PRIYA_CHOICE_MADE,
  PRIYA_CHOICE_REASON,
] as const;

export interface PupilCase {
  readonly actorId: string;
  readonly actorAlias: string;
  readonly phrase: string;
  readonly objectId: string;
  readonly homeRoomId: string;
  readonly remoteRoomId: string;
  readonly recoveryFlag: string;
  readonly recoveredStateId: string;
  readonly response: string;
  readonly lessonTopic: ConversationTopic;
}

export const PUPIL_CASES = [
  {
    actorId: NIA_ID,
    actorAlias: 'nia',
    phrase: 'card',
    objectId: 'item-assistance-observation-card',
    homeRoomId: INTAKE_ROOM_ID,
    remoteRoomId: DEMONSTRATION_ROOM_ID,
    recoveryFlag: RECOVERY_FLAGS.nia,
    recoveredStateId: 'actorstate-nia-observant',
    response: NIA_RESPONSE,
    lessonTopic: NIA_OBSERVATION,
  },
  {
    actorId: MATEO_ID,
    actorAlias: 'mateo',
    phrase: 'card',
    objectId: 'item-assistance-instruction-card',
    homeRoomId: DEMONSTRATION_ROOM_ID,
    remoteRoomId: INTAKE_ROOM_ID,
    recoveryFlag: RECOVERY_FLAGS.mateo,
    recoveredStateId: 'actorstate-mateo-reading',
    response: MATEO_RESPONSE,
    lessonTopic: MATEO_INSTRUCTION,
  },
  {
    actorId: KOFI_ID,
    actorAlias: 'kofi',
    phrase: 'crank',
    objectId: 'item-assistance-practice-crank',
    homeRoomId: DEMONSTRATION_ROOM_ID,
    remoteRoomId: INTAKE_ROOM_ID,
    recoveryFlag: RECOVERY_FLAGS.kofi,
    recoveredStateId: 'actorstate-kofi-cycling',
    response: KOFI_RESPONSE,
    lessonTopic: KOFI_PRACTICE_CYCLE,
  },
  {
    actorId: PRIYA_ID,
    actorAlias: 'priya',
    phrase: 'card',
    objectId: 'item-assistance-audit-card',
    homeRoomId: RECORDS_ROOM_ID,
    remoteRoomId: DEMONSTRATION_ROOM_ID,
    recoveryFlag: RECOVERY_FLAGS.priya,
    recoveredStateId: 'actorstate-priya-reasoning',
    response: PRIYA_START_RESPONSE,
    lessonTopic: PRIYA_CHOICE_START,
  },
] as const satisfies readonly PupilCase[];

const PUPIL_STATES = [
  actorState(READY_STATE_ID),
  actorState(TALKING),
  actorState('actorstate-nia-observant'),
  actorState('actorstate-mateo-reading'),
  actorState('actorstate-kofi-cycling'),
  actorState('actorstate-priya-reasoning'),
];

export function pupilBundle(
  actorIds: readonly string[],
  topics: readonly ConversationTopic[],
  nodes: readonly ConversationNode[] = [],
): ContentBundle {
  const actors = PUPIL_CASES.filter((pupil) =>
    actorIds.includes(pupil.actorId),
  ).map((pupil) => ({
    id: pupil.actorId,
    aliases: [pupil.actorAlias],
    initialStateId: READY_STATE_ID,
  }));
  return npcBundle({ actors, states: PUPIL_STATES, topics, nodes });
}

export function localityState(
  roomId: string,
  actorIds: readonly string[],
  areaId: string = WARD_AREA_ID,
): GameState {
  const roomIds = new Set([
    INTAKE_ROOM_ID,
    DEMONSTRATION_ROOM_ID,
    RECORDS_ROOM_ID,
    ARRIVAL_ROOM_ID,
    roomId,
  ]);
  return npcState({
    player: {
      position: { worldId: WORLD_ID, areaId, roomId },
      inventory: [],
      lives: 3,
    },
    rooms: Object.fromEntries(
      [...roomIds].map((id) => [id, { inventory: [] }]),
    ),
    npcs: Object.fromEntries(
      actorIds.map((actorId) => [actorId, npcDto({ stateId: READY_STATE_ID })]),
    ),
    flags: {
      [RECOVERY_FLAGS.nia]: false,
      [RECOVERY_FLAGS.mateo]: false,
      [RECOVERY_FLAGS.kofi]: false,
      [RECOVERY_FLAGS.priya]: false,
      'priya-choice-taken': false,
    },
    progress: [
      {
        worldId: WORLD_ID,
        areaId,
        visitedRooms: [roomId],
        completedTopics: [],
        earnedScore: 0,
        maxScore: 0,
      },
    ],
  });
}

export function lessonSnapshot(state: GameState, actorId: string): string {
  return JSON.stringify({
    flags: state.flags,
    knownTopics: state.npcs[actorId]?.knownTopics,
    topicUses: state.npcs[actorId]?.topicUses,
    activeNodeId: state.npcs[actorId]?.activeNodeId,
    position: state.player.position,
    playerInventory: state.player.inventory,
    roomInventory: Object.fromEntries(
      Object.entries(state.rooms).map(([id, room]) => [id, room.inventory]),
    ),
    npcInventory: Object.fromEntries(
      Object.entries(state.npcs).map(([id, npc]) => [id, npc.inventory]),
    ),
  });
}

export const GLOBAL_AI_DEFAULT: ConversationTopic = {
  ...defaultTopic(DEFAULT_REPLY),
  id: 'topic-ai-default',
  actorId: AI_ID,
  isActive: {
    kind: 'not',
    of: { kind: 'in-area', worldId: WORLD_ID, areaId: WARD_AREA_ID },
  },
};

export const WARD_AI_DEFAULT: ConversationTopic = {
  ...defaultTopic(DEFAULT_REPLY),
  id: 'topic-ai-ward-default',
  actorId: AI_ID,
  isActive: { kind: 'in-area', worldId: WORLD_ID, areaId: WARD_AREA_ID },
};

export const GLOBAL_AI_KEYWORD: ConversationTopic = topic({
  id: 'topic-ai-verdict',
  actorId: AI_ID,
  match: { kind: 'special', keywords: ['verdict'] },
  isActive: always,
  responses: [DEFAULT_REPLY],
});

export const UNBOUND_DEFAULT: ConversationTopic = {
  ...defaultTopic(DEFAULT_REPLY),
  id: 'topic-global-unbound-default',
  isActive: always,
};

export function aiBundle(): ContentBundle {
  return npcBundle({
    actors: [{ id: AI_ID, aliases: ['ai'], initialStateId: READY_STATE_ID }],
    states: [actorState(READY_STATE_ID), actorState(TALKING)],
    topics: [GLOBAL_AI_DEFAULT, WARD_AI_DEFAULT, GLOBAL_AI_KEYWORD],
  });
}
