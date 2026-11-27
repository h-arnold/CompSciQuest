import { describe, expect, it } from 'vitest';
import { resolveGameCommand } from '../../src/application/commandResolution';
import { createTopicResolver } from '../../src/core/commands/TopicResolver';
import { createEffectApplier } from '../../src/core/effects/EffectApplier';
import type { GameEvent } from '../../src/core/events/GameEvent';
import { createConditionEvaluator } from '../../src/core/rules/ConditionEvaluator';
import type { ConversationTopic } from '../../src/core/npcs/ConversationTopic';
import {
  findDefaultTopic,
  isActorOutOfRoom,
  selectTopic,
} from '../../src/core/npcs/TopicSelection';
import { authoredGame } from '../fixtures/authored';
import { FakeRandom } from '../fixtures/persistence';
import {
  AI_ID,
  aiBundle,
  ARRIVAL_AREA_ID,
  ARRIVAL_ROOM_ID,
  DECOY_REPLY,
  DEMONSTRATION_ROOM_ID,
  GLOBAL_AI_DEFAULT,
  GLOBAL_AI_KEYWORD,
  INTAKE_ROOM_ID,
  lessonSnapshot,
  localityState,
  NIA_ID,
  NIA_OBSERVATION,
  PUPIL_CASES,
  pupilBundle,
  PRIYA_CHOICE_MADE,
  PRIYA_CHOICE_START,
  PRIYA_CHOICE_REASON,
  PRIYA_ID,
  PRIYA_NODE,
  PRIYA_TOPICS,
  RECOVERY_FLAGS,
  UNBOUND_DEFAULT,
  WARD_AI_DEFAULT,
} from '../fixtures/wardTopicLocality';
import {
  defaultTopic,
  DEFAULT_REPLY as NPC_DEFAULT_REPLY,
  npcContext,
  node,
  spokenTexts,
  topic,
} from '../fixtures/npcs';

const evaluator = createConditionEvaluator();

function playerFacingTexts(events: readonly GameEvent[]): string[] {
  return events.flatMap((event) =>
    event.type === 'npc-spoke' || event.type === 'message' ? [event.text] : [],
  );
}

describe('Assistance Ward exact-topic locality', () => {
  it('C-WARD-LOCALITY-01: a local active exact card topic beats earlier compatible candidates and applies Nia recovery once', () => {
    const decoy = topic({
      id: 'topic-nia-decoy',
      match: {
        kind: 'askTell',
        objectIds: ['item-assistance-observation-card'],
      },
      responses: [DECOY_REPLY],
      effects: [{ kind: 'set-flag', flag: 'nia-decoy-chosen', value: true }],
    });
    const activeDefault: ConversationTopic = {
      ...defaultTopic(NPC_DEFAULT_REPLY),
      id: 'topic-nia-active-default',
      actorId: NIA_ID,
      effects: [{ kind: 'set-flag', flag: 'nia-default-chosen', value: true }],
    };
    const bundle = pupilBundle(
      [NIA_ID],
      [decoy, activeDefault, NIA_OBSERVATION],
    );
    const state = localityState(INTAKE_ROOM_ID, [NIA_ID]);
    const { game } = authoredGame({ bundle, state });

    const events = game.submit('ask nia about card');

    expect(spokenTexts(events)).toEqual([NIA_OBSERVATION.responses[0]]);
    expect(spokenTexts(events)).not.toContain(DECOY_REPLY);
    expect(
      events.filter(
        (event) =>
          event.type === 'flag-changed' &&
          event.flag === RECOVERY_FLAGS.nia &&
          event.value === true,
      ),
    ).toHaveLength(1);
    expect(
      events.filter(
        (event) =>
          event.type === 'actor-state-changed' &&
          event.actorId === NIA_ID &&
          event.stateId === 'actorstate-nia-observant',
      ),
    ).toHaveLength(1);
    expect(state.flags[RECOVERY_FLAGS.nia]).toBe(true);
    expect(state.npcs[NIA_ID]?.stateId).toBe('actorstate-nia-observant');
    expect(state.npcs[NIA_ID]?.topicUses[NIA_OBSERVATION.id]).toBe(1);
    expect(state.npcs[NIA_ID]?.topicUses[decoy.id]).toBeUndefined();
    expect(state.npcs[NIA_ID]?.topicUses[activeDefault.id]).toBeUndefined();
    expect(state.flags['nia-decoy-chosen']).toBeUndefined();
    expect(state.flags['nia-default-chosen']).toBeUndefined();
  });

  it('C-WARD-LOCALITY-02: the selector rejects an inactive exact actor-bound topic when no compatible topic or default is active', () => {
    const bundle = pupilBundle([NIA_ID], [NIA_OBSERVATION]);
    const state = localityState(DEMONSTRATION_ROOM_ID, [NIA_ID]);
    const context = npcContext(state, {
      bundle,
      command: { kind: 'ask', actorId: NIA_ID, topic: 'card' },
    });
    const before = lessonSnapshot(state, NIA_ID);

    const selected = selectTopic(
      context,
      evaluator,
      NIA_ID,
      undefined,
      { kind: 'object', objectId: 'item-assistance-observation-card' },
      'card',
    );

    expect(selected).toBeUndefined();
    expect(lessonSnapshot(state, NIA_ID)).toBe(before);
  });

  it.each(PUPIL_CASES)(
    'C-WARD-LOCALITY-02: remote $actorAlias/$phrase input applies no lesson response, effect or use',
    (pupil) => {
      const bundle = pupilBundle([pupil.actorId], [pupil.lessonTopic]);
      const state = localityState(pupil.remoteRoomId, [pupil.actorId]);
      const before = lessonSnapshot(state, pupil.actorId);
      const raw = `ask ${pupil.actorAlias} about ${pupil.phrase}`;
      expect(resolveGameCommand(raw, state, bundle)).toEqual({
        kind: 'ask',
        actorId: pupil.actorId,
        topic: pupil.phrase,
      });
      const { game } = authoredGame({ bundle, state });

      const events = game.submit(raw);

      expect(playerFacingTexts(events)).not.toContain(pupil.response);
      expect(events).not.toContainEqual({
        type: 'flag-changed',
        flag: pupil.recoveryFlag,
        value: true,
      });
      expect(events).not.toContainEqual({
        type: 'actor-state-changed',
        actorId: pupil.actorId,
        stateId: pupil.recoveredStateId,
      });
      expect(
        events.filter(
          (event) =>
            event.type === 'node-entered' && event.actorId === pupil.actorId,
        ),
      ).toEqual([]);
      expect(lessonSnapshot(state, pupil.actorId)).toBe(before);
    },
  );

  it('C-WARD-LOCALITY-03: an inactive exact topic falls back to an active compatible default without exact effects or use', () => {
    const fallback = {
      ...defaultTopic(NPC_DEFAULT_REPLY),
      id: 'topic-nia-fallback-default',
      actorId: NIA_ID,
    };
    const bundle = pupilBundle([NIA_ID], [NIA_OBSERVATION, fallback]);
    const state = localityState(DEMONSTRATION_ROOM_ID, [NIA_ID]);
    const context = npcContext(state, {
      bundle,
      command: { kind: 'ask', actorId: NIA_ID, topic: 'card' },
    });
    const before = lessonSnapshot(state, NIA_ID);

    const selected = selectTopic(
      context,
      evaluator,
      NIA_ID,
      undefined,
      { kind: 'object', objectId: 'item-assistance-observation-card' },
      'card',
    );

    expect(selected).toMatchObject({
      topic: { id: fallback.id },
      fromNode: false,
      isDefault: true,
    });
    expect(state.flags[RECOVERY_FLAGS.nia]).toBe(false);
    expect(state.npcs[NIA_ID]?.topicUses[NIA_OBSERVATION.id]).toBeUndefined();
    expect(lessonSnapshot(state, NIA_ID)).toBe(before);
  });

  it('C-WARD-LOCALITY-04: out-of-room Priya input is non-silent and leaves lesson state untouched', () => {
    const bundle = pupilBundle([PRIYA_ID], PRIYA_TOPICS, [PRIYA_NODE]);
    const state = localityState(DEMONSTRATION_ROOM_ID, [PRIYA_ID]);
    const context = npcContext(state, {
      bundle,
      command: { kind: 'ask', actorId: PRIYA_ID, topic: 'audit card' },
    });
    const before = lessonSnapshot(state, PRIYA_ID);
    expect(evaluator.evaluate(PRIYA_CHOICE_MADE.isActive, state, context)).toBe(
      false,
    );
    expect(
      evaluator.evaluate(PRIYA_CHOICE_REASON.isActive, state, context),
    ).toBe(false);
    expect(
      selectTopic(
        context,
        evaluator,
        PRIYA_ID,
        undefined,
        { kind: 'keyword', topicId: PRIYA_CHOICE_MADE.id },
        'checked',
      ),
    ).toBeUndefined();
    expect(
      selectTopic(
        context,
        evaluator,
        PRIYA_ID,
        undefined,
        { kind: 'free-text', text: 'the printed evidence agrees' },
        'the printed evidence agrees',
      ),
    ).toBeUndefined();
    const raw = 'ask priya about audit card';
    expect(resolveGameCommand(raw, state, bundle)).toEqual({
      kind: 'ask',
      actorId: PRIYA_ID,
      topic: 'audit card',
    });
    const { game } = authoredGame({ bundle, state });

    const events = game.submit(raw);
    const texts = playerFacingTexts(events);

    expect(texts.some((text) => text.trim().length > 0)).toBe(true);
    expect(texts).not.toContain(PRIYA_CHOICE_START.responses[0]);
    expect(texts.join(' ')).not.toMatch(
      /parser error|unknown command|I don't understand that/iu,
    );
    expect(events.filter((event) => event.type === 'flag-changed')).toEqual([]);
    expect(
      events.filter(
        (event) => event.type === 'node-entered' && event.actorId === PRIYA_ID,
      ),
    ).toEqual([]);
    expect(lessonSnapshot(state, PRIYA_ID)).toBe(before);
  });

  it('C-WARD-LOCALITY-05: an active node default retains priority over an active catalogue default without mutation', () => {
    const nodeDefault = {
      ...defaultTopic(NPC_DEFAULT_REPLY),
      id: 'topic-node-default',
      actorId: NIA_ID,
    };
    const catalogueDefault = {
      ...defaultTopic(NPC_DEFAULT_REPLY),
      id: 'topic-catalogue-default',
      actorId: NIA_ID,
    };
    const activeNode = node({
      topics: [nodeDefault],
      defaultTopicId: nodeDefault.id,
    });
    const bundle = pupilBundle([NIA_ID], [catalogueDefault], [activeNode]);
    const state = localityState(INTAKE_ROOM_ID, [NIA_ID]);
    const context = npcContext(state, { bundle });
    const before = JSON.stringify(state);

    const selected = findDefaultTopic(context, evaluator, NIA_ID, activeNode);

    expect(selected).toBe(nodeDefault);
    expect(JSON.stringify(state)).toBe(before);
  });

  it('C-WARD-LOCALITY-06: unmatched AI input keeps the arrival/Ward default split and global keyword selection', () => {
    const bundle = aiBundle();
    const outside = localityState(ARRIVAL_ROOM_ID, [AI_ID], ARRIVAL_AREA_ID);
    const inside = localityState(INTAKE_ROOM_ID, [AI_ID]);
    const outsideContext = npcContext(outside, {
      bundle,
      command: { kind: 'ask', actorId: AI_ID, topic: 'unmatched subject' },
    });
    const insideContext = npcContext(inside, {
      bundle,
      command: { kind: 'ask', actorId: AI_ID, topic: 'unmatched subject' },
    });
    const outsideBefore = JSON.stringify(outside);
    const insideBefore = JSON.stringify(inside);

    expect(
      selectTopic(
        outsideContext,
        evaluator,
        AI_ID,
        undefined,
        { kind: 'free-text', text: 'unmatched subject' },
        'unmatched subject',
      )?.topic.id,
    ).toBe(GLOBAL_AI_DEFAULT.id);
    expect(
      selectTopic(
        insideContext,
        evaluator,
        AI_ID,
        undefined,
        { kind: 'free-text', text: 'unmatched subject' },
        'unmatched subject',
      )?.topic.id,
    ).toBe(WARD_AI_DEFAULT.id);
    const random = new FakeRandom([0]);
    const resolver = createTopicResolver({
      bundle,
      evaluator,
      random,
      applier: createEffectApplier(outside, { bundle, random }),
    });
    const resolved = resolver.resolve('verdict', outside, undefined, AI_ID);
    expect(resolved).toEqual({
      kind: 'keyword',
      topicId: GLOBAL_AI_KEYWORD.id,
    });
    expect(
      selectTopic(
        outsideContext,
        evaluator,
        AI_ID,
        undefined,
        resolved,
        'verdict',
      )?.topic.id,
    ).toBe(GLOBAL_AI_KEYWORD.id);
    expect(JSON.stringify(outside)).toBe(outsideBefore);
    expect(JSON.stringify(inside)).toBe(insideBefore);
  });

  it('C-WARD-LOCALITY-06: an active unbound default still answers for an actor whose bound topics are out of room', () => {
    const bundle = pupilBundle([NIA_ID], [NIA_OBSERVATION, UNBOUND_DEFAULT]);
    const state = localityState(DEMONSTRATION_ROOM_ID, [NIA_ID]);
    const { game } = authoredGame({ bundle, state });

    const events = game.submit('ask nia about a remote matter');

    expect(spokenTexts(events)).toEqual([NPC_DEFAULT_REPLY]);
    expect(state.flags[RECOVERY_FLAGS.nia]).toBe(false);
    expect(state.npcs[NIA_ID]?.topicUses[NIA_OBSERVATION.id]).toBeUndefined();
    expect(state.npcs[NIA_ID]?.topicUses[UNBOUND_DEFAULT.id]).toBe(1);
  });

  it('C-WARD-LOCALITY-07: mixed satisfied and unmet actor-bound room gates do not establish absence', () => {
    const presentTopic: ConversationTopic = topic({
      id: 'topic-nia-intake-present',
      actorId: NIA_ID,
      isActive: { kind: 'in-room', roomId: INTAKE_ROOM_ID },
    });
    const remoteTopic: ConversationTopic = topic({
      id: 'topic-nia-demonstration-remote',
      actorId: NIA_ID,
      isActive: { kind: 'in-room', roomId: DEMONSTRATION_ROOM_ID },
    });
    const bundle = pupilBundle([NIA_ID], [presentTopic, remoteTopic]);
    const state = localityState(INTAKE_ROOM_ID, [NIA_ID]);
    const context = npcContext(state, {
      bundle,
      command: { kind: 'ask', actorId: NIA_ID, topic: 'unmatched subject' },
    });

    expect(isActorOutOfRoom(context, evaluator, NIA_ID)).toBe(false);
  });
});
