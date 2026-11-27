import { describe, expect, it } from 'vitest';
import { resolveGameCommand } from '../../src/application/commandResolution';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { GameState } from '../../src/core/GameState';
import type { ConversationTopic } from '../../src/core/npcs/ConversationTopic';
import { selectTopic } from '../../src/core/npcs/TopicSelection';
import { createConditionEvaluator } from '../../src/core/rules/ConditionEvaluator';
import { authoredGame } from '../fixtures/authored';
import { spokenTexts, TALKING } from '../fixtures/npcs';
import {
  AI_ID,
  ARRIVAL_DEFAULT,
  ARRIVAL_DEFAULT_ID,
  ARRIVAL_FAILURE,
  ARRIVAL_ROOM_ID,
  FAILURE_PROMPT,
  FAILURE_RESPONSE,
  FAILURE_TOPIC_ID,
  arrivalBundle,
  actorBindingScenario,
  actorOrderScenario,
  inactiveNodeScenario,
  keywordContext,
  keywordState,
  NEVER_ACTIVE_FLAG,
  nodeOrderScenario,
  nodePriorityScenario,
  OTHER_ACTOR_ID,
  RECORDS_ROOM_ID,
  recordsBundle,
  RELUCTANT_GUIDE_STATE_ID,
  type SelectionScenario,
  selectorFor,
  WARD_DEFAULT,
  WARD_DEFAULT_ID,
  WARD_PROMPT,
  WARD_RECORDS,
  WARD_RESPONSES,
  WARD_TOPIC_ID,
} from '../fixtures/wardKeywordActivity';

const evaluator = createConditionEvaluator();
const ARRIVAL_KEYWORDS = ['fail', 'failure', 'deletion', 'lives'] as const;
const WARD_KEYWORDS = [
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
] as const;
const COMMANDS = [
  { verb: 'ask', prefix: 'ask ai about ' },
  { verb: 'tell', prefix: 'tell ai ' },
] as const;

const arrivalCases = COMMANDS.flatMap((command) =>
  ARRIVAL_KEYWORDS.map((keyword) => ({ ...command, keyword })),
);
const wardCases = COMMANDS.flatMap((command) =>
  WARD_KEYWORDS.map((keyword) => ({ ...command, keyword })),
);
const nonMatchingCases = COMMANDS.flatMap((command) =>
  (['fail', 'deletion'] as const).map((keyword) => ({
    ...command,
    keyword,
  })),
);
const topicIdCases = COMMANDS.flatMap((command) =>
  (
    [
      {
        roomId: ARRIVAL_ROOM_ID,
        topicId: FAILURE_TOPIC_ID,
        special: ARRIVAL_FAILURE,
        defaultTopic: ARRIVAL_DEFAULT,
      },
      {
        roomId: RECORDS_ROOM_ID,
        topicId: WARD_TOPIC_ID,
        special: WARD_RECORDS,
        defaultTopic: WARD_DEFAULT,
      },
    ] as const
  ).map((entry) => ({ ...command, ...entry })),
);

function promptTexts(events: readonly GameEvent[]): string[] {
  return events.flatMap((event) =>
    event.type === 'topic-suggested' ? [event.text] : [],
  );
}

function playerFacingTexts(events: readonly GameEvent[]): string[] {
  return events.flatMap((event) =>
    event.type === 'npc-spoke' || event.type === 'message' ? [event.text] : [],
  );
}

function expectNoParserError(events: readonly GameEvent[]): void {
  expect(playerFacingTexts(events).join(' ')).not.toMatch(
    /parser error|unknown command|I don't understand that/iu,
  );
}

function submitConversation(
  raw: string,
  verb: 'ask' | 'tell',
  keyword: string,
  bundle: ReturnType<typeof arrivalBundle>,
  state: GameState,
  parsedTopic: string = keyword,
): readonly GameEvent[] {
  expect(resolveGameCommand(raw, state, bundle)).toEqual({
    kind: verb,
    actorId: AI_ID,
    topic: parsedTopic,
  });
  const { game } = authoredGame({ bundle, state });
  return game.submit(raw);
}

function expectOnlySelectedUse(
  state: GameState,
  selectedTopicId: string,
  unselectedTopicIds: readonly string[],
): void {
  expect(state.npcs[AI_ID]?.topicUses[selectedTopicId]).toBe(1);
  for (const topicId of unselectedTopicIds) {
    expect(state.npcs[AI_ID]?.topicUses[topicId]).toBeUndefined();
  }
}

function expectDefaultFeedback(
  events: readonly GameEvent[],
  defaultTopic: ConversationTopic,
): void {
  expect(spokenTexts(events)).toEqual([defaultTopic.responses[0]]);
  expect(promptTexts(events)).toEqual([defaultTopic.prompt]);
  expectNoParserError(events);
}

function expectArrivalFailure(
  isWardFirst: boolean,
  verb: 'ask' | 'tell',
  keyword: string,
): void {
  const bundle = arrivalBundle(isWardFirst);
  const state = keywordState(ARRIVAL_ROOM_ID);
  const raw = verb === 'ask' ? `ask ai about ${keyword}` : `tell ai ${keyword}`;

  const events = submitConversation(raw, verb, keyword, bundle, state);

  expect(spokenTexts(events)).toEqual([FAILURE_RESPONSE]);
  expect(promptTexts(events)).toEqual([FAILURE_PROMPT]);
  expectNoParserError(events);
  expectOnlySelectedUse(state, FAILURE_TOPIC_ID, [
    WARD_TOPIC_ID,
    ARRIVAL_DEFAULT_ID,
  ]);
  expect(state.npcs[AI_ID]?.stateId).toBe(TALKING);
  expect(
    events.filter(
      (event) =>
        event.type === 'actor-state-changed' &&
        event.actorId === AI_ID &&
        event.stateId === RELUCTANT_GUIDE_STATE_ID,
    ),
  ).toEqual([]);
}

function expectWardFirstResponse(
  isWardFirst: boolean,
  verb: 'ask' | 'tell',
  keyword: string,
): void {
  const bundle = recordsBundle(isWardFirst);
  const state = keywordState(RECORDS_ROOM_ID);
  const raw = verb === 'ask' ? `ask ai about ${keyword}` : `tell ai ${keyword}`;

  const events = submitConversation(raw, verb, keyword, bundle, state);

  expect(spokenTexts(events)).toEqual([WARD_RESPONSES[0]]);
  expect(promptTexts(events)).toEqual([WARD_PROMPT]);
  expectNoParserError(events);
  expectOnlySelectedUse(state, WARD_TOPIC_ID, [
    FAILURE_TOPIC_ID,
    WARD_DEFAULT_ID,
  ]);
  expect(state.npcs[AI_ID]?.stateId).toBe(RELUCTANT_GUIDE_STATE_ID);
}

function expectScenarioSelection(
  scenario: SelectionScenario,
): readonly GameEvent[] {
  const { bundle, state, node, expectedTopic } = scenario;
  const context = keywordContext(state, bundle, 'shared');
  const before = JSON.stringify(state);

  const selected = selectTopic(
    context,
    evaluator,
    AI_ID,
    node,
    { kind: 'keyword', topicId: scenario.resolvedTopicId },
    'shared',
  );

  expect(selected).toMatchObject({
    topic: { id: expectedTopic.id },
    fromNode: scenario.expectedFromNode,
    isDefault: false,
  });
  expect(JSON.stringify(state)).toBe(before);

  const events = submitConversation(
    'ask ai about shared',
    'ask',
    'shared',
    bundle,
    state,
  );

  expect(spokenTexts(events)).toEqual([expectedTopic.responses[0]]);
  expect(promptTexts(events)).toEqual([expectedTopic.prompt]);
  expect(state.flags).toEqual({
    [NEVER_ACTIVE_FLAG]: false,
    [scenario.expectedEffectFlag]: true,
  });
  expect(state.npcs[AI_ID]?.topicUses).toEqual({ [expectedTopic.id]: 1 });
  return events;
}

describe('Ward keyword activity', () => {
  it('C-WKA-01: selection skips the resolver inactive Ward candidate and returns active Arrival failure without mutation', () => {
    const bundle = arrivalBundle(true);
    const state = keywordState(ARRIVAL_ROOM_ID);
    const context = keywordContext(state, bundle, 'failure');
    const before = JSON.stringify(state);

    const selected = selectTopic(
      context,
      evaluator,
      AI_ID,
      undefined,
      { kind: 'keyword', topicId: WARD_TOPIC_ID },
      'failure',
    );

    expect(selected).toMatchObject({
      topic: { id: FAILURE_TOPIC_ID },
      fromNode: false,
      isDefault: false,
    });
    expect(JSON.stringify(state)).toBe(before);
  });

  it.each(arrivalCases)(
    'C-WKA-02: ward-first $verb $keyword selects the active Arrival failure topic only',
    ({ verb, keyword }) => {
      expectArrivalFailure(true, verb, keyword);
    },
  );

  it.each(arrivalCases)(
    'C-WKA-03: failure-first $verb $keyword preserves the active Arrival failure topic',
    ({ verb, keyword }) => {
      expectArrivalFailure(false, verb, keyword);
    },
  );

  it.each(wardCases)(
    'C-WKA-04: ward-first $verb $keyword selects the active Records topic only',
    ({ verb, keyword }) => {
      expectWardFirstResponse(true, verb, keyword);
    },
  );

  it.each(wardCases)(
    'C-WKA-05: failure-first $verb $keyword skips inactive failure and selects Records',
    ({ verb, keyword }) => {
      expectWardFirstResponse(false, verb, keyword);
    },
  );

  it('C-WKA-05: the Records command then failure sequence advances only the Ward lesson', () => {
    const bundle = recordsBundle(false);
    const state = keywordState(RECORDS_ROOM_ID);
    const { game } = authoredGame({ bundle, state });

    const first = game.submit('ask ai about talk');
    const second = game.submit('ask ai about failure');

    expect(spokenTexts(first)).toEqual([WARD_RESPONSES[0]]);
    expect(spokenTexts(second)).toEqual([WARD_RESPONSES[1]]);
    expect([...promptTexts(first), ...promptTexts(second)]).toEqual([
      WARD_PROMPT,
      WARD_PROMPT,
    ]);
    expectNoParserError([...first, ...second]);
    expect(state.npcs[AI_ID]?.topicUses).toEqual({ [WARD_TOPIC_ID]: 2 });
    expect(state.npcs[AI_ID]?.topicUses[FAILURE_TOPIC_ID]).toBeUndefined();
    expect(state.npcs[AI_ID]?.topicUses[WARD_DEFAULT_ID]).toBeUndefined();
    expect(state.npcs[AI_ID]?.stateId).toBe(RELUCTANT_GUIDE_STATE_ID);
    expect([...first, ...second].join(' ')).not.toContain(FAILURE_RESPONSE);
  });

  it.each(nonMatchingCases)(
    'C-WKA-06: Records $verb $keyword is not Ward vocabulary and falls to the active default',
    ({ verb, keyword }) => {
      const bundle = recordsBundle(false);
      const state = keywordState(RECORDS_ROOM_ID);
      const raw =
        verb === 'ask' ? `ask ai about ${keyword}` : `tell ai ${keyword}`;

      const events = submitConversation(raw, verb, keyword, bundle, state);

      expectDefaultFeedback(events, WARD_DEFAULT);
      expect(state.npcs[AI_ID]?.topicUses[FAILURE_TOPIC_ID]).toBeUndefined();
      expect(state.npcs[AI_ID]?.topicUses[WARD_TOPIC_ID]).toBeUndefined();
      expect(state.npcs[AI_ID]?.stateId).toBe(RELUCTANT_GUIDE_STATE_ID);
      expect(state.flags[NEVER_ACTIVE_FLAG]).toBe(false);
    },
  );

  it('C-WKA-07: an active node special keeps priority over an earlier actor special', () => {
    const scenario = nodePriorityScenario();

    expectScenarioSelection(scenario);

    expect(scenario.state.npcs[AI_ID]?.activeNodeId).toBe(scenario.node?.id);
  });

  it('C-WKA-08: an inactive node special falls through to the active actor special', () => {
    expectScenarioSelection(inactiveNodeScenario());
  });

  it('C-WKA-09: node declaration order selects the first active matching node special', () => {
    expectScenarioSelection(nodeOrderScenario());
  });

  it('C-WKA-10: actor declaration order beats topic-ID order after an inactive candidate', () => {
    expectScenarioSelection(actorOrderScenario());
  });

  it('C-WKA-11: speaking-actor binding excludes the other actor before inactive-candidate recovery', () => {
    const scenario = actorBindingScenario();
    const otherBefore = JSON.stringify(scenario.state.npcs[OTHER_ACTOR_ID]);
    const { resolver } = selectorFor(scenario.state, scenario.bundle);

    expect(
      resolver.resolve('shared', scenario.state, undefined, AI_ID),
    ).toEqual({ kind: 'keyword', topicId: scenario.resolvedTopicId });
    expectScenarioSelection(scenario);
    expect(JSON.stringify(scenario.state.npcs[OTHER_ACTOR_ID])).toBe(
      otherBefore,
    );
  });

  it.each(topicIdCases)(
    'C-WKA-12: $verb $topicId is not player vocabulary in $roomId and reaches the default',
    ({ verb, roomId, topicId, special, defaultTopic, prefix }) => {
      const bundle =
        roomId === ARRIVAL_ROOM_ID
          ? arrivalBundle(false)
          : recordsBundle(false);
      const state = keywordState(roomId);
      const parsedTopic = topicId.replaceAll('-', ' ');
      const context = keywordContext(state, bundle, parsedTopic, verb);
      const { resolver } = selectorFor(state, bundle);
      const resolved = resolver.resolve(parsedTopic, state, undefined, AI_ID);
      const before = JSON.stringify(state);

      expect(resolved).toEqual({ kind: 'free-text', text: parsedTopic });
      expect(
        selectTopic(
          context,
          evaluator,
          AI_ID,
          undefined,
          resolved,
          parsedTopic,
        ),
      ).toMatchObject({
        topic: { id: defaultTopic.id },
        fromNode: false,
        isDefault: true,
      });
      expect(JSON.stringify(state)).toBe(before);

      const events = submitConversation(
        `${prefix}${topicId}`,
        verb,
        topicId,
        bundle,
        state,
        parsedTopic,
      );

      expectDefaultFeedback(events, defaultTopic);
      expect(state.npcs[AI_ID]?.topicUses[special.id]).toBeUndefined();
      expect(state.npcs[AI_ID]?.topicUses[FAILURE_TOPIC_ID]).toBeUndefined();
      expect(state.npcs[AI_ID]?.topicUses[WARD_TOPIC_ID]).toBeUndefined();
      expect(state.flags[NEVER_ACTIVE_FLAG]).toBe(false);
    },
  );
});
