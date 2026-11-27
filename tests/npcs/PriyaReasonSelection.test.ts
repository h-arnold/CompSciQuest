import { describe, expect, it } from 'vitest';
import type { Game } from '../../src/application/Game';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { GameState } from '../../src/core/GameState';
import type { ConversationNode } from '../../src/core/npcs/ConversationNode';
import type { ConversationTopic } from '../../src/core/npcs/ConversationTopic';
import {
  findDefaultTopic,
  isDefaultTopic,
  selectTopic,
} from '../../src/core/npcs/TopicSelection';
import { createConditionEvaluator } from '../../src/core/rules/ConditionEvaluator';
import type { TurnContext } from '../../src/core/TurnContext';
import { authoredGame } from '../fixtures/authored';
import {
  ACTOR_ID,
  actorState,
  always,
  defaultTopic,
  node,
  npcBundle,
  npcContext,
  npcDto,
  npcState,
  spokenTexts,
  TALKING,
  topic,
} from '../fixtures/npcs';
import {
  localityState,
  PRIYA_CHOICE_MADE,
  PRIYA_CHOICE_REASON,
  PRIYA_CHOICE_START,
  PRIYA_DEFAULT,
  PRIYA_ID,
  PRIYA_NODE,
  PRIYA_NODE_ID,
  PRIYA_TOPICS,
  pupilBundle,
  RECORDS_ROOM_ID,
  RECOVERY_FLAGS,
} from '../fixtures/wardTopicLocality';

const CHOICE_FLAG = 'priya-choice-taken';
const RECOVERED_STATE_ID = 'actorstate-priya-reasoning';
const REASON_PROMPT =
  '(You could tell Priya what you checked and what it showed.)';
const evaluator = createConditionEvaluator();

type Choice = 'checked' | 'assumed';

function priyaFixture() {
  const bundle = pupilBundle([PRIYA_ID], PRIYA_TOPICS, [PRIYA_NODE]);
  const state = localityState(RECORDS_ROOM_ID, [PRIYA_ID]);
  return { ...authoredGame({ bundle, state }), state };
}

function enterAndChoose(game: Game, choice: Choice): void {
  game.submit('ask priya about audit card');
  game.submit(`ask priya ${choice}`);
}

function recoverySnapshot(state: GameState) {
  return {
    choiceFlag: state.flags[CHOICE_FLAG],
    recoveryFlag: state.flags[RECOVERY_FLAGS.priya],
    actorState: state.npcs[PRIYA_ID]?.stateId,
    activeNodeId: state.npcs[PRIYA_ID]?.activeNodeId,
    topicUses: { ...state.npcs[PRIYA_ID]?.topicUses },
  };
}

function flagChanges(events: readonly GameEvent[]) {
  return events.filter((event) => event.type === 'flag-changed');
}

function stateChanges(events: readonly GameEvent[]) {
  return events.filter((event) => event.type === 'actor-state-changed');
}

describe('Priya choose-then-reason selection', () => {
  it('C-PRIYA-REASON-01: raw audit-card input enters the choice node without setting either flag', () => {
    const { game, state } = priyaFixture();

    const events = game.submit('ask priya about audit card');

    expect(events).toContainEqual({
      type: 'conversation-started',
      actorId: PRIYA_ID,
    });
    expect(spokenTexts(events)).toEqual([PRIYA_CHOICE_START.responses[0]]);
    expect(events).toContainEqual({
      type: 'node-entered',
      actorId: PRIYA_ID,
      nodeId: PRIYA_NODE_ID,
    });
    expect(state.npcs[PRIYA_ID]?.activeNodeId).toBe(PRIYA_NODE_ID);
    expect(state.flags[CHOICE_FLAG]).toBe(false);
    expect(state.flags[RECOVERY_FLAGS.priya]).toBe(false);
    expect(flagChanges(events)).toEqual([]);
    expect(state.npcs[PRIYA_ID]?.topicUses[PRIYA_CHOICE_START.id]).toBe(1);
    expect(state.npcs[PRIYA_ID]?.topicUses[PRIYA_DEFAULT.id]).toBeUndefined();
  });

  it.each<Choice>(['checked', 'assumed'])(
    'C-PRIYA-REASON-02: raw ask priya %s records only the choice and emits the reason prompt',
    (choice) => {
      const { game, state } = priyaFixture();
      game.submit('ask priya about audit card');
      const flagsBefore = { ...state.flags };

      const events = game.submit(`ask priya ${choice}`);

      expect(spokenTexts(events)).toEqual([PRIYA_CHOICE_MADE.responses[0]]);
      expect(events).toContainEqual({
        type: 'topic-suggested',
        actorId: PRIYA_ID,
        text: REASON_PROMPT,
      });
      expect(flagChanges(events)).toEqual([
        { type: 'flag-changed', flag: CHOICE_FLAG, value: true },
      ]);
      expect(state.flags).toEqual({ ...flagsBefore, [CHOICE_FLAG]: true });
      expect(state.flags[RECOVERY_FLAGS.priya]).toBe(false);
      expect(state.npcs[PRIYA_ID]?.stateId).toBe(TALKING);
      expect(state.npcs[PRIYA_ID]?.activeNodeId).toBe(PRIYA_NODE_ID);
      expect(state.npcs[PRIYA_ID]?.topicUses[PRIYA_CHOICE_MADE.id]).toBe(1);
      expect(
        state.npcs[PRIYA_ID]?.topicUses[PRIYA_CHOICE_REASON.id],
      ).toBeUndefined();
    },
  );

  it.each<Choice>(['checked', 'assumed'])(
    'C-PRIYA-REASON-03: a natural tell after %s reaches the reason producer and completes recovery',
    (choice) => {
      const { game, state } = priyaFixture();
      enterAndChoose(game, choice);
      const choiceUses = state.npcs[PRIYA_ID]?.topicUses[PRIYA_CHOICE_MADE.id];

      const events = game.submit(
        'tell priya what I checked and what it showed',
      );

      expect(spokenTexts(events)).toEqual([PRIYA_CHOICE_REASON.responses[0]]);
      expect(spokenTexts(events)).not.toContain(PRIYA_DEFAULT.responses[0]);
      expect(flagChanges(events)).toEqual([
        { type: 'flag-changed', flag: RECOVERY_FLAGS.priya, value: true },
      ]);
      expect(stateChanges(events)).toEqual([
        {
          type: 'actor-state-changed',
          actorId: PRIYA_ID,
          stateId: RECOVERED_STATE_ID,
        },
      ]);
      expect(events).toContainEqual({
        type: 'node-exited',
        actorId: PRIYA_ID,
      });
      expect(state.flags[CHOICE_FLAG]).toBe(true);
      expect(state.flags[RECOVERY_FLAGS.priya]).toBe(true);
      expect(state.npcs[PRIYA_ID]?.stateId).toBe(RECOVERED_STATE_ID);
      expect(state.npcs[PRIYA_ID]?.activeNodeId).toBeUndefined();
      expect(state.npcs[PRIYA_ID]?.topicUses[PRIYA_CHOICE_REASON.id]).toBe(1);
      expect(state.npcs[PRIYA_ID]?.topicUses[PRIYA_CHOICE_MADE.id]).toBe(
        choiceUses,
      );
      expect(state.npcs[PRIYA_ID]?.topicUses[PRIYA_DEFAULT.id]).toBeUndefined();
    },
  );

  it.each<Choice>(['checked', 'assumed'])(
    'C-PRIYA-REASON-04: post-choice talk-to after %s returns the non-producing node default',
    (choice) => {
      const { game, state } = priyaFixture();
      enterAndChoose(game, choice);
      const before = recoverySnapshot(state);

      const events = game.submit('talk-to priya');

      expect(spokenTexts(events)).toEqual([PRIYA_DEFAULT.responses[0]]);
      expect(spokenTexts(events)).not.toContain(
        PRIYA_CHOICE_REASON.responses[0],
      );
      expect(flagChanges(events)).toEqual([]);
      expect(stateChanges(events)).toEqual([]);
      expect(events.some((event) => event.type === 'node-exited')).toBe(false);
      expect(recoverySnapshot(state)).toEqual(before);
      expect(state.npcs[PRIYA_ID]?.activeNodeId).toBe(PRIYA_NODE_ID);
    },
  );

  it.each<Choice>(['checked', 'assumed'])(
    'C-PRIYA-REASON-05: post-choice ask priya %s falls through without reselecting retired or tell-only topics',
    (choice) => {
      const { game, state } = priyaFixture();
      enterAndChoose(game, choice);
      const choiceFlagBefore = state.flags[CHOICE_FLAG];
      const recoveryFlagBefore = state.flags[RECOVERY_FLAGS.priya];
      const actorStateBefore = state.npcs[PRIYA_ID]?.stateId;
      const activeNodeBefore = state.npcs[PRIYA_ID]?.activeNodeId;
      const choiceUsesBefore =
        state.npcs[PRIYA_ID]?.topicUses[PRIYA_CHOICE_MADE.id];
      const reasonUsesBefore =
        state.npcs[PRIYA_ID]?.topicUses[PRIYA_CHOICE_REASON.id];

      const events = game.submit(`ask priya ${choice}`);

      expect(spokenTexts(events)).toEqual([PRIYA_DEFAULT.responses[0]]);
      expect(spokenTexts(events)).not.toContain(PRIYA_CHOICE_MADE.responses[0]);
      expect(spokenTexts(events)).not.toContain(
        PRIYA_CHOICE_REASON.responses[0],
      );
      expect(flagChanges(events)).toEqual([]);
      expect(stateChanges(events)).toEqual([]);
      expect(events.some((event) => event.type === 'node-exited')).toBe(false);
      expect(state.flags[CHOICE_FLAG]).toBe(choiceFlagBefore);
      expect(state.flags[RECOVERY_FLAGS.priya]).toBe(recoveryFlagBefore);
      expect(state.npcs[PRIYA_ID]?.stateId).toBe(actorStateBefore);
      expect(state.npcs[PRIYA_ID]?.activeNodeId).toBe(activeNodeBefore);
      expect(state.npcs[PRIYA_ID]?.topicUses[PRIYA_CHOICE_MADE.id]).toBe(
        choiceUsesBefore,
      );
      expect(state.npcs[PRIYA_ID]?.topicUses[PRIYA_CHOICE_REASON.id]).toBe(
        reasonUsesBefore,
      );
      expect(state.npcs[PRIYA_ID]?.topicUses[PRIYA_DEFAULT.id]).toBe(1);
    },
  );

  it('C-PRIYA-REASON-06: bye exits safely, audit-card input resumes outside the node, and a natural tell recovers', () => {
    const { game, state } = priyaFixture();
    enterAndChoose(game, 'checked');

    const farewell = game.submit('bye');

    expect(farewell).toContainEqual({
      type: 'conversation-ended',
      actorId: PRIYA_ID,
      reason: 'said goodbye',
    });
    expect(farewell).toContainEqual({
      type: 'node-exited',
      actorId: PRIYA_ID,
    });
    expect(state.npcs[PRIYA_ID]?.activeNodeId).toBeUndefined();
    expect(state.npcs[PRIYA_ID]?.stateId).toBe('actorstate-ready');
    expect(state.flags[CHOICE_FLAG]).toBe(true);
    expect(state.flags[RECOVERY_FLAGS.priya]).toBe(false);
    expect(flagChanges(farewell)).toEqual([]);

    const resumed = game.submit('ask priya about audit card');

    expect(spokenTexts(resumed)).toEqual([PRIYA_CHOICE_START.responses[0]]);
    expect(resumed).toContainEqual({
      type: 'node-entered',
      actorId: PRIYA_ID,
      nodeId: PRIYA_NODE_ID,
    });
    expect(state.npcs[PRIYA_ID]?.activeNodeId).toBe(PRIYA_NODE_ID);
    expect(state.flags[RECOVERY_FLAGS.priya]).toBe(false);

    const reason = game.submit('tell priya what I checked and what it showed');

    expect(spokenTexts(reason)).toEqual([PRIYA_CHOICE_REASON.responses[0]]);
    expect(reason).toContainEqual({
      type: 'node-exited',
      actorId: PRIYA_ID,
    });
    expect(state.flags[RECOVERY_FLAGS.priya]).toBe(true);
    expect(state.npcs[PRIYA_ID]?.stateId).toBe(RECOVERED_STATE_ID);
    expect(state.npcs[PRIYA_ID]?.activeNodeId).toBeUndefined();
  });
});

function selectorContext(kind: 'ask' | 'tell'): TurnContext {
  const state = npcState({
    npcs: { [ACTOR_ID]: npcDto({ stateId: TALKING }) },
  });
  const bundle = npcBundle({
    actors: [
      { id: ACTOR_ID, aliases: ['guide'], initialStateId: 'actorstate-ready' },
    ],
    states: [actorState('actorstate-ready'), actorState(TALKING)],
    topics: [selectorCatchAll],
  });
  return npcContext(state, {
    bundle,
    command: { kind, actorId: ACTOR_ID, topic: 'a reason' },
  });
}

const selectorCatchAll: ConversationTopic = {
  ...defaultTopic(),
  id: 'topic-selector-catch-all',
  actorId: ACTOR_ID,
  isActive: always,
};
const selectorTell: ConversationTopic = topic({
  id: 'topic-selector-tell',
  actorId: ACTOR_ID,
  match: { kind: 'tell', objectIds: [] },
  isActive: always,
});
const selectorNode: ConversationNode = node({
  topics: [selectorTell, selectorCatchAll],
  defaultTopicId: selectorCatchAll.id,
});

function selectPurely<T>(context: TurnContext, operation: () => T): T {
  const stateBefore = JSON.stringify(context.state);
  const usesBefore = { ...context.state.npcs[ACTOR_ID]?.topicUses };
  const result = operation();
  expect(JSON.stringify(context.state)).toBe(stateBefore);
  expect(context.state.npcs[ACTOR_ID]?.topicUses).toEqual(usesBefore);
  return result;
}

describe('Priya selector shape regression', () => {
  it('C-PRIYA-REASON-07: empty-object tell is explicit while askTell remains the default and invalid node defaults are ignored', () => {
    const tellContext = selectorContext('tell');
    const askContext = selectorContext('ask');

    expect(
      selectPurely(tellContext, () => isDefaultTopic(selectorCatchAll)),
    ).toBe(true);
    expect(selectPurely(tellContext, () => isDefaultTopic(selectorTell))).toBe(
      false,
    );
    expect(
      selectPurely(tellContext, () =>
        selectTopic(
          tellContext,
          evaluator,
          ACTOR_ID,
          selectorNode,
          { kind: 'free-text', text: 'the evidence agrees' },
          'the evidence agrees',
        ),
      ),
    ).toMatchObject({
      topic: { id: selectorTell.id },
      fromNode: true,
      isDefault: false,
    });
    expect(
      selectPurely(askContext, () =>
        selectTopic(
          askContext,
          evaluator,
          ACTOR_ID,
          selectorNode,
          { kind: 'free-text', text: 'a reason' },
          'a reason',
        ),
      ),
    ).toMatchObject({
      topic: { id: selectorCatchAll.id },
      fromNode: false,
      isDefault: true,
    });
    expect(
      selectPurely(tellContext, () =>
        findDefaultTopic(tellContext, evaluator, ACTOR_ID, selectorNode),
      ),
    ).toBe(selectorCatchAll);

    const invalidDefaultNode = node({
      topics: [selectorTell, selectorCatchAll],
      defaultTopicId: selectorTell.id,
    });
    expect(
      selectPurely(tellContext, () =>
        findDefaultTopic(tellContext, evaluator, ACTOR_ID, invalidDefaultNode),
      ),
    ).toBe(selectorCatchAll);
  });
});
