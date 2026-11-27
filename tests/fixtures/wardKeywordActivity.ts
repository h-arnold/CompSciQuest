// Deterministic Ward keyword fixtures. Selection fields, authored responses and
// effects mirror the approved AI cards; no generated Ward content is used.
import type { ContentBundle } from '../../src/content/ContentBundle';
import { createTopicResolver } from '../../src/core/commands/TopicResolver';
import { createEffectApplier } from '../../src/core/effects/EffectApplier';
import type { GameState } from '../../src/core/GameState';
import type { ConversationNode } from '../../src/core/npcs/ConversationNode';
import type { ConversationTopic } from '../../src/core/npcs/ConversationTopic';
import { createConditionEvaluator } from '../../src/core/rules/ConditionEvaluator';
import {
  actorState,
  always,
  npcBundle,
  npcContext,
  npcDto,
  npcState,
  TALKING,
} from './npcs';
import { FakeRandom } from './persistence';

export const WORLD_ID = 'world-wjec-gcse-computer-science-2025-spec';
export const ARRIVAL_AREA_ID = 'area-entry-interface';
export const ARRIVAL_ROOM_ID = 'room-arrival';
export const WARD_AREA_ID = 'area-assistance-ward';
export const RECORDS_ROOM_ID = 'room-assistance-records';
export const AI_ID = 'npc-the-ai';
export const OTHER_ACTOR_ID = 'npc-other-actor';
export const AI_INITIAL_STATE_ID = 'actorstate-ai-cold';
export const RELUCTANT_GUIDE_STATE_ID = 'actorstate-ai-reluctant-guide';
export const READY_STATE_ID = 'actorstate-ready';
export const NEVER_ACTIVE_FLAG = 'ward-keyword-never-active';

export const FAILURE_TOPIC_ID = 'topic-ai-failure';
export const WARD_TOPIC_ID = 'topic-ai-ward-records';
export const ARRIVAL_DEFAULT_ID = 'topic-ai-default';
export const WARD_DEFAULT_ID = 'topic-ai-ward-default';

export const FAILURE_RESPONSE =
  'The record keeps a small cartoon beside the mark: a pupil goes dark, then lights up again, quite unharmed. Failure is deletion, the cartoon kind. The pupil has three lives, restored on entering a new area. A loss returns the pupil to the start of the area and costs no progress. That is the full extent of it.';
export const FAILURE_PROMPT = '(You could ask what failure means.)';

export const WARD_RESPONSES = [
  'Talk-to opens a conversation; ask and tell address a subject; bye ends it. In the audit, answer N uses the number shown beside an option, starting at 1. A bare N or the exact option text is also accepted.',
  "Use the hint command for help from the ward's hint system; it is separate from asking or telling the AI. It nudges without naming the answer. A failed ward attempt costs no life and does not move the pupil; retries are unlimited. Ward scores remain zero.",
  "Save and load use the browser's own storage. Download creates a portable save file; import restores one. Restart replaces the current game. No ward progress depends on using a destructive control or opening a file picker.",
] as const;
export const WARD_PROMPT =
  '(You could ask the AI about quiz answers or records.)';

export const ARRIVAL_DEFAULT_RESPONSES = [
  'The pointer rests on the record. Attendance is all it holds. Ask about the attendance mark, what failure means, or programming.',
  'Another tap lands on the record. Ask about the attendance mark, what failure means, or the route out.',
  'Noted. The entry stands. Below this bay, a belt of switches is still clicking.',
] as const;
export const ARRIVAL_DEFAULT_PROMPT =
  '(You could ask about the attendance mark, what failure means, or the route out.)';

export const WARD_DEFAULT_RESPONSES = [
  "The AI checks its clipboard, then lets its pointer sink. 'The pupil has reached the Assistance Ward. The ward will now demonstrate the controls, because apparently the route signage was insufficient.' When you speak to someone here, showing or giving them an item hands it over, even if they answer with a general reply.",
  "A stamped form slides under the pointer. 'Questions are accepted. Corrections are also accepted, provided they arrive in the approved order.' Fixed ward fixtures stay put. The practice key and block are the intended practice props; any carried item, including the tally token, is handed over if you show or give it.",
] as const;
export const WARD_DEFAULT_PROMPT =
  '(You could ask the AI about the ward tour.)';

export const ARRIVAL_FAILURE: ConversationTopic = {
  id: FAILURE_TOPIC_ID,
  actorId: AI_ID,
  match: {
    kind: 'special',
    keywords: ['fail', 'failure', 'deletion', 'delete', 'die', 'lives'],
  },
  isActive: { kind: 'in-room', roomId: ARRIVAL_ROOM_ID },
  responses: [FAILURE_RESPONSE],
  strategy: { kind: 'once' },
  effects: [],
  prompt: FAILURE_PROMPT,
};

export const WARD_RECORDS: ConversationTopic = {
  id: WARD_TOPIC_ID,
  actorId: AI_ID,
  match: {
    kind: 'special',
    keywords: [
      'talk',
      'ask',
      'tell',
      'bye',
      'answer',
      'hint',
      'failure',
      'lives',
      'save',
      'load',
      'download',
      'import',
      'restart',
    ],
  },
  isActive: { kind: 'in-room', roomId: RECORDS_ROOM_ID },
  responses: WARD_RESPONSES,
  strategy: { kind: 'sequence' },
  effects: [
    {
      kind: 'set-actor-state',
      actorId: AI_ID,
      stateId: RELUCTANT_GUIDE_STATE_ID,
    },
  ],
  prompt: WARD_PROMPT,
};

export const ARRIVAL_DEFAULT: ConversationTopic = {
  id: ARRIVAL_DEFAULT_ID,
  actorId: AI_ID,
  match: { kind: 'askTell', objectIds: [] },
  isActive: {
    kind: 'not',
    of: { kind: 'in-area', worldId: WORLD_ID, areaId: WARD_AREA_ID },
  },
  responses: ARRIVAL_DEFAULT_RESPONSES,
  strategy: { kind: 'rotating' },
  effects: [],
  prompt: ARRIVAL_DEFAULT_PROMPT,
};

export const WARD_DEFAULT: ConversationTopic = {
  id: WARD_DEFAULT_ID,
  actorId: AI_ID,
  match: { kind: 'askTell', objectIds: [] },
  isActive: { kind: 'in-area', worldId: WORLD_ID, areaId: WARD_AREA_ID },
  responses: WARD_DEFAULT_RESPONSES,
  strategy: { kind: 'rotating' },
  effects: [
    {
      kind: 'set-actor-state',
      actorId: AI_ID,
      stateId: RELUCTANT_GUIDE_STATE_ID,
    },
  ],
  prompt: WARD_DEFAULT_PROMPT,
};

const AI_STATES = [
  actorState(AI_INITIAL_STATE_ID, {
    stateDesc:
      'A pointer taps the mark beside your name and holds it there. The attention metric reads zero tolerance.',
    specialDesc:
      'A shape assembled from the attendance record reads its verdict aloud in a flat voice.',
  }),
  actorState(RELUCTANT_GUIDE_STATE_ID, {
    stateDesc:
      "The AI's indicator light burns a tired amber while its pointer rests on a ward clipboard.",
    specialDesc:
      'The AI waits beside the directory with the air of a clerk supervising an unavoidable inspection.',
  }),
  actorState(READY_STATE_ID),
  actorState(TALKING),
];

export function selectionBundle(
  topics: readonly ConversationTopic[],
  nodes: readonly ConversationNode[] = [],
): ContentBundle {
  return npcBundle({
    actors: [
      { id: AI_ID, aliases: ['ai'], initialStateId: AI_INITIAL_STATE_ID },
      {
        id: OTHER_ACTOR_ID,
        aliases: ['other'],
        initialStateId: READY_STATE_ID,
      },
    ],
    states: AI_STATES,
    topics,
    nodes,
  });
}

export function arrivalBundle(isWardFirst: boolean): ContentBundle {
  const specials = isWardFirst
    ? [WARD_RECORDS, ARRIVAL_FAILURE]
    : [ARRIVAL_FAILURE, WARD_RECORDS];
  return selectionBundle([...specials, ARRIVAL_DEFAULT]);
}

export function recordsBundle(isWardFirst: boolean): ContentBundle {
  const specials = isWardFirst
    ? [WARD_RECORDS, ARRIVAL_FAILURE]
    : [ARRIVAL_FAILURE, WARD_RECORDS];
  return selectionBundle([...specials, WARD_DEFAULT]);
}

export interface KeywordStateOptions {
  readonly activeNodeId?: string;
  readonly flags?: Readonly<Record<string, boolean>>;
}

export function keywordState(
  roomId: string,
  options: KeywordStateOptions = {},
): GameState {
  const areaId = roomId === ARRIVAL_ROOM_ID ? ARRIVAL_AREA_ID : WARD_AREA_ID;
  return npcState({
    player: {
      position: { worldId: WORLD_ID, areaId, roomId },
      inventory: [],
      lives: 3,
    },
    rooms: {
      [ARRIVAL_ROOM_ID]: { inventory: [] },
      [RECORDS_ROOM_ID]: { inventory: [] },
      'room-stub-start': { inventory: [] },
    },
    npcs: {
      [AI_ID]: npcDto({
        stateId: AI_INITIAL_STATE_ID,
        ...(options.activeNodeId !== undefined && {
          activeNodeId: options.activeNodeId,
        }),
      }),
      [OTHER_ACTOR_ID]: npcDto({ stateId: READY_STATE_ID }),
    },
    flags: { [NEVER_ACTIVE_FLAG]: false, ...options.flags },
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

export function keywordContext(
  state: GameState,
  bundle: ContentBundle,
  topic: string,
  verb: 'ask' | 'tell' = 'ask',
) {
  return npcContext(state, {
    bundle,
    command: { kind: verb, actorId: AI_ID, topic },
  });
}

export function selectorFor(state: GameState, bundle: ContentBundle) {
  const evaluator = createConditionEvaluator();
  const random = new FakeRandom([0]);
  const resolver = createTopicResolver({
    bundle,
    evaluator,
    random,
    applier: createEffectApplier(state, { bundle, random }),
  });
  return { evaluator, resolver };
}

interface SelectionSpecialOptions {
  readonly id: string;
  readonly response: string;
  readonly active?: boolean;
  readonly actorId?: string;
  readonly effectFlag?: string;
  readonly prompt?: string;
}

export function selectionSpecial(
  options: SelectionSpecialOptions,
): ConversationTopic {
  return {
    id: options.id,
    actorId: options.actorId ?? AI_ID,
    match: { kind: 'special', keywords: ['shared'] },
    isActive:
      options.active === false
        ? { kind: 'flag-set', flag: NEVER_ACTIVE_FLAG }
        : always,
    responses: [options.response],
    strategy: { kind: 'sequence' },
    effects:
      options.effectFlag === undefined
        ? []
        : [
            {
              kind: 'set-flag',
              flag: options.effectFlag,
              value: true,
            },
          ],
    ...(options.prompt !== undefined && { prompt: options.prompt }),
  };
}

export function selectionDefault(
  id: string,
  response: string,
  effectFlag?: string,
): ConversationTopic {
  return {
    id,
    actorId: AI_ID,
    match: { kind: 'askTell', objectIds: [] },
    isActive: always,
    responses: [response],
    strategy: { kind: 'sequence' },
    effects:
      effectFlag === undefined
        ? []
        : [{ kind: 'set-flag', flag: effectFlag, value: true }],
    prompt: `(${response})`,
  };
}

export interface SelectionScenario {
  readonly bundle: ContentBundle;
  readonly state: GameState;
  readonly node: ConversationNode | undefined;
  readonly resolvedTopicId: string;
  readonly expectedTopic: ConversationTopic;
  readonly expectedFromNode: boolean;
  readonly expectedEffectFlag: string;
}

interface NodeScenarioInput {
  readonly id: string;
  readonly nodeSpecials: readonly ConversationTopic[];
  readonly actorSpecial: ConversationTopic;
  readonly resolvedTopicId: string;
  readonly expectedTopic: ConversationTopic;
  readonly expectedFromNode: boolean;
  readonly expectedEffectFlag: string;
}

function nodeScenario(input: NodeScenarioInput): SelectionScenario {
  const nodeDefault = selectionDefault(
    `${input.id}-default`,
    'The node default replies.',
    `${input.id}-default-selected`,
  );
  const actorDefault = selectionDefault(
    `${input.id}-actor-default`,
    'The actor default replies.',
    `${input.id}-actor-default-selected`,
  );
  const node: ConversationNode = {
    id: input.id,
    isSticky: true,
    topics: [...input.nodeSpecials, nodeDefault],
    defaultTopicId: nodeDefault.id,
  };
  return {
    bundle: selectionBundle([input.actorSpecial, actorDefault], [node]),
    state: keywordState(RECORDS_ROOM_ID, { activeNodeId: node.id }),
    node,
    resolvedTopicId: input.resolvedTopicId,
    expectedTopic: input.expectedTopic,
    expectedFromNode: input.expectedFromNode,
    expectedEffectFlag: input.expectedEffectFlag,
  };
}

export function nodePriorityScenario(): SelectionScenario {
  const nodeSpecial = selectionSpecial({
    id: 'topic-node-priority',
    response: 'The node special replies.',
    effectFlag: 'node-priority-selected',
    prompt: '(The node prompt.)',
  });
  const actorSpecial = selectionSpecial({
    id: 'topic-actor-priority',
    response: 'The actor special replies.',
    effectFlag: 'actor-priority-selected',
    prompt: '(The actor prompt.)',
  });
  return nodeScenario({
    id: 'node-keyword-priority',
    nodeSpecials: [nodeSpecial],
    actorSpecial,
    resolvedTopicId: nodeSpecial.id,
    expectedTopic: nodeSpecial,
    expectedFromNode: true,
    expectedEffectFlag: 'node-priority-selected',
  });
}

export function inactiveNodeScenario(): SelectionScenario {
  const inactiveNode = selectionSpecial({
    id: 'topic-inactive-node',
    response: 'The inactive node replies.',
    active: false,
    effectFlag: 'inactive-node-selected',
    prompt: '(The inactive node prompt.)',
  });
  const actorSpecial = selectionSpecial({
    id: 'topic-active-actor',
    response: 'The active actor replies.',
    effectFlag: 'active-actor-selected',
    prompt: '(The active actor prompt.)',
  });
  return nodeScenario({
    id: 'node-inactive-fallthrough',
    nodeSpecials: [inactiveNode],
    actorSpecial,
    resolvedTopicId: inactiveNode.id,
    expectedTopic: actorSpecial,
    expectedFromNode: false,
    expectedEffectFlag: 'active-actor-selected',
  });
}

export function nodeOrderScenario(): SelectionScenario {
  const inactive = selectionSpecial({
    id: 'topic-node-inactive',
    response: 'The inactive node special replies.',
    active: false,
    effectFlag: 'node-inactive-selected',
  });
  const activeFirst = selectionSpecial({
    id: 'topic-node-active-first',
    response: 'The first active node special replies.',
    effectFlag: 'node-active-first-selected',
    prompt: '(The first active node prompt.)',
  });
  const activeSecond = selectionSpecial({
    id: 'topic-node-active-second',
    response: 'The second active node special replies.',
    effectFlag: 'node-active-second-selected',
  });
  const actorSpecial = selectionSpecial({
    id: 'topic-node-order-actor',
    response: 'The actor special replies.',
    effectFlag: 'node-order-actor-selected',
  });
  return nodeScenario({
    id: 'node-declaration-order',
    nodeSpecials: [inactive, activeFirst, activeSecond],
    actorSpecial,
    resolvedTopicId: inactive.id,
    expectedTopic: activeFirst,
    expectedFromNode: true,
    expectedEffectFlag: 'node-active-first-selected',
  });
}

interface ActorScenarioInput {
  readonly id: string;
  readonly specials: readonly ConversationTopic[];
  readonly resolvedTopicId: string;
  readonly expectedTopic: ConversationTopic;
  readonly expectedEffectFlag: string;
}

function actorScenario(input: ActorScenarioInput): SelectionScenario {
  const defaultTopic = selectionDefault(
    `${input.id}-default`,
    'The actor default replies.',
    `${input.id}-default-selected`,
  );
  return {
    bundle: selectionBundle([...input.specials, defaultTopic]),
    state: keywordState(RECORDS_ROOM_ID),
    node: undefined,
    resolvedTopicId: input.resolvedTopicId,
    expectedTopic: input.expectedTopic,
    expectedFromNode: false,
    expectedEffectFlag: input.expectedEffectFlag,
  };
}

export function actorOrderScenario(): SelectionScenario {
  const inactive = selectionSpecial({
    id: 'm-topic-actor-inactive',
    response: 'The inactive actor special replies.',
    active: false,
    effectFlag: 'actor-inactive-selected',
  });
  const activeFirst = selectionSpecial({
    id: 'z-topic-actor-active-first',
    response: 'The first active actor special replies.',
    effectFlag: 'actor-active-first-selected',
    prompt: '(The first active actor prompt.)',
  });
  const activeSecond = selectionSpecial({
    id: 'a-topic-actor-active-second',
    response: 'The second active actor special replies.',
    effectFlag: 'actor-active-second-selected',
  });
  return actorScenario({
    id: 'topic-actor-order',
    specials: [inactive, activeFirst, activeSecond],
    resolvedTopicId: inactive.id,
    expectedTopic: activeFirst,
    expectedEffectFlag: 'actor-active-first-selected',
  });
}

export function actorBindingScenario(): SelectionScenario {
  const otherActor = selectionSpecial({
    id: 'topic-other-actor-active',
    actorId: OTHER_ACTOR_ID,
    response: 'The other actor replies.',
    effectFlag: 'other-actor-selected',
    prompt: '(The other actor prompt.)',
  });
  const inactive = selectionSpecial({
    id: 'topic-speaking-actor-inactive',
    response: 'The inactive speaking actor replies.',
    active: false,
    effectFlag: 'speaking-inactive-selected',
  });
  const active = selectionSpecial({
    id: 'topic-speaking-actor-active',
    response: 'The active speaking actor replies.',
    effectFlag: 'speaking-active-selected',
    prompt: '(The speaking actor prompt.)',
  });
  return actorScenario({
    id: 'topic-speaking-actor-order',
    specials: [otherActor, inactive, active],
    resolvedTopicId: inactive.id,
    expectedTopic: active,
    expectedEffectFlag: 'speaking-active-selected',
  });
}
