import { describe, expect, it } from 'vitest';
import type { Condition } from '../../src/core/rules/Condition';
import { createConditionEvaluator } from '../../src/core/rules/ConditionEvaluator';
import type { GameState } from '../../src/core/GameState';
import type { ConversationNode } from '../../src/core/npcs/ConversationNode';
import type { ConversationTopic } from '../../src/core/npcs/ConversationTopic';
import { findDefaultTopic } from '../../src/core/npcs/TopicSelection';
import type { TurnContext } from '../../src/core/TurnContext';
import {
  actorState,
  always,
  defaultTopic,
  NEVER_FLAG,
  node,
  npcBundle,
  npcContext,
  npcDto,
  npcState,
} from '../fixtures/npcs';

const AI_ID = 'npc-the-ai';
const WORLD_ID = 'world-wjec-gcse-computer-science-2025-spec';
const WARD_AREA_ID = 'area-assistance-ward';
const HUB_AREA_ID = 'area-network-hub';
const WARD_ROOM_ID = 'room-assistance-intake';
const HUB_ROOM_ID = 'room-network-hub';
const GLOBAL_DEFAULT_ID = 'topic-ai-default';
const WARD_DEFAULT_ID = 'topic-ai-ward-default';
const SEQUENCE_STRATEGY: ConversationTopic['strategy'] = {
  kind: 'sequence',
};
const evaluator = createConditionEvaluator();

function catalogueDefault(
  id: string,
  isActive: Condition,
  strategy: ConversationTopic['strategy'] = SEQUENCE_STRATEGY,
): ConversationTopic {
  return {
    ...defaultTopic(),
    id,
    actorId: AI_ID,
    isActive,
    strategy,
  };
}

function globalDefault(): ConversationTopic {
  return catalogueDefault(GLOBAL_DEFAULT_ID, {
    kind: 'not',
    of: { kind: 'in-area', worldId: WORLD_ID, areaId: WARD_AREA_ID },
  });
}

function wardDefault(): ConversationTopic {
  return catalogueDefault(WARD_DEFAULT_ID, {
    kind: 'in-area',
    worldId: WORLD_ID,
    areaId: WARD_AREA_ID,
  });
}

function stateAt(
  areaId: string,
  roomId: string,
  topicUses: Readonly<Record<string, number>> = {},
): GameState {
  return npcState({
    player: {
      position: { worldId: WORLD_ID, areaId, roomId },
      inventory: [],
      lives: 3,
    },
    npcs: {
      [AI_ID]: npcDto({ stateId: 'talking', topicUses }),
    },
  });
}

function contextFor(
  state: GameState,
  topics: readonly ConversationTopic[],
  nodes: readonly ConversationNode[] = [],
): TurnContext {
  return npcContext(state, {
    bundle: npcBundle({
      actors: [{ id: AI_ID, aliases: [], initialStateId: 'talking' }],
      states: [actorState('talking')],
      topics,
      nodes,
    }),
    command: { kind: 'talk-to', actorId: AI_ID },
  });
}

function expectSelectionWithoutMutation(
  context: TurnContext,
  expected: ConversationTopic | undefined,
  activeNode?: ConversationNode,
): void {
  const stateBefore = JSON.stringify(context.state);
  const topicUsesBefore = { ...context.state.npcs[AI_ID]?.topicUses };

  const selected = findDefaultTopic(context, evaluator, AI_ID, activeNode);

  expect(selected).toBe(expected);
  expect(JSON.stringify(context.state)).toBe(stateBefore);
  expect(context.state.npcs[AI_ID]?.topicUses).toEqual(topicUsesBefore);
}

describe('Assistance Ward default topic selection', () => {
  it('C-WARD-DEFAULT-01: an inactive earlier global default does not shadow the active ward default', () => {
    const global = globalDefault();
    const ward = wardDefault();
    const context = contextFor(stateAt(WARD_AREA_ID, WARD_ROOM_ID), [
      global,
      ward,
    ]);

    expectSelectionWithoutMutation(context, ward);
  });

  it('C-WARD-DEFAULT-02: the earlier active global default still wins outside the ward', () => {
    const global = globalDefault();
    const ward = wardDefault();
    const context = contextFor(stateAt(HUB_AREA_ID, HUB_ROOM_ID), [
      global,
      ward,
    ]);

    expectSelectionWithoutMutation(context, global);
  });

  it('C-WARD-DEFAULT-03: the active node default retains priority over catalogue defaults', () => {
    const nodeTopic = catalogueDefault('topic-node-default', always);
    const activeNode = node({
      topics: [nodeTopic],
      defaultTopicId: nodeTopic.id,
    });
    const context = contextFor(
      stateAt(WARD_AREA_ID, WARD_ROOM_ID),
      [globalDefault(), wardDefault()],
      [activeNode],
    );

    expectSelectionWithoutMutation(context, nodeTopic, activeNode);
  });

  it('C-WARD-DEFAULT-04: an exhausted once default is skipped for a later active default', () => {
    const exhausted = catalogueDefault('topic-exhausted-default', always, {
      kind: 'once',
    });
    const later = catalogueDefault('topic-later-default', always);
    const context = contextFor(
      stateAt(WARD_AREA_ID, WARD_ROOM_ID, {
        [exhausted.id]: 1,
      }),
      [exhausted, later],
    );

    expectSelectionWithoutMutation(context, later);
  });

  it('C-WARD-DEFAULT-05: no active eligible catalogue default returns undefined', () => {
    const firstInactive = catalogueDefault('topic-first-inactive-default', {
      kind: 'flag-set',
      flag: NEVER_FLAG,
    });
    const secondInactive = catalogueDefault('topic-second-inactive-default', {
      kind: 'flag-set',
      flag: NEVER_FLAG,
    });
    const context = contextFor(stateAt(WARD_AREA_ID, WARD_ROOM_ID), [
      firstInactive,
      secondInactive,
    ]);

    expectSelectionWithoutMutation(context, undefined);
  });
});
