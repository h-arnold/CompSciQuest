// Red tests for topic effects and NPC event mapping (npcs.md §2, §4, §6, §7;
// shared-rules.md §5; application-and-ui.md §6.1, §9; combat.md §3 step 1).
// Effects are asserted only through the observable events and state deltas
// produced by injected fakes.
import { describe, expect, it } from 'vitest';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { GameState } from '../../src/core/GameState';
import { formatEvent } from '../../src/ui/formatEvent';
import { RecordingBus } from '../fixtures/persistence';
import {
  ACTOR_ID,
  actorState,
  defaultTopic,
  eventTypes,
  FLAG_TOPIC_ID,
  LEARN_TOPIC_ID,
  loadGame,
  NODE_ID,
  npcBundle,
  npcDto,
  npcGameDependencies,
  npcState,
  QUIZ_ID,
  QUIZ_TOPIC_ID,
  READY,
  submitNpc,
  TALKING,
  topic,
} from '../fixtures/npcs';

function talkingState(): GameState {
  return npcState({
    npcs: { [ACTOR_ID]: npcDto({ stateId: TALKING }) },
  });
}

function ask(): Parameters<typeof submitNpc>[0] {
  return { kind: 'ask', actorId: ACTOR_ID, topic: 'lamp' };
}

describe('NPC effects (npcs.md §4, §8)', () => {
  it('NPC-EFF-01: learn-topic adds the ID once and emits knowledge-gained', async () => {
    const learning = topic({
      id: LEARN_TOPIC_ID,
      effects: [
        { kind: 'learn-topic', actorId: ACTOR_ID, topicId: 'secret-ring' },
      ],
    });
    const bundle = npcBundle({ topics: [learning, defaultTopic()] });
    const state = talkingState();

    const first = await submitNpc(ask(), { bundle, state });
    const second = await submitNpc(ask(), { bundle, state });

    expect(first.events).toContainEqual({
      type: 'knowledge-gained',
      actorId: ACTOR_ID,
      topicId: 'secret-ring',
    });
    expect(
      [...first.events, ...second.events].filter(
        (event) => event.type === 'knowledge-gained',
      ),
    ).toHaveLength(1);
    expect(state.npcs[ACTOR_ID]?.knownTopics).toEqual(['secret-ring']);
  });

  it('NPC-EFF-02: a topic set-flag effect emits flag-changed and writes no score field', async () => {
    const flagging = topic({
      id: FLAG_TOPIC_ID,
      effects: [{ kind: 'set-flag', flag: 'binary-explained', value: true }],
    });
    const bundle = npcBundle({ topics: [flagging, defaultTopic()] });
    const state = talkingState();
    const scoreBefore = state.score;

    const { events } = await submitNpc(ask(), { bundle, state });

    expect(events).toContainEqual({
      type: 'flag-changed',
      flag: 'binary-explained',
      value: true,
    });
    expect(state.flags['binary-explained']).toBe(true);
    expect(state.score).toBe(scoreBefore);
    expect(events).not.toContainEqual(
      expect.objectContaining({ type: 'score-changed' }),
    );
  });

  it('NPC-EFF-03: every topic effect is applied in order with a mapped event that formats to a line', async () => {
    const combined = topic({
      effects: [
        { kind: 'set-flag', flag: 'explained', value: true },
        { kind: 'message', text: 'Remember this.' },
        { kind: 'learn-topic', actorId: ACTOR_ID, topicId: 'remembered' },
      ],
    });
    const bundle = npcBundle({ topics: [combined, defaultTopic()] });

    const { events } = await submitNpc(ask(), {
      bundle,
      state: talkingState(),
    });
    const types = eventTypes(events);
    const mapped = events.filter((event) =>
      ['flag-changed', 'message', 'knowledge-gained'].includes(event.type),
    );

    expect(types.indexOf('flag-changed')).toBeLessThan(
      types.indexOf('message'),
    );
    expect(types.indexOf('message')).toBeLessThan(
      types.indexOf('knowledge-gained'),
    );
    for (const event of mapped) {
      expect(formatEvent(event, bundle).length).toBeGreaterThan(0);
    }
  });

  it('NPC-EFF-04: a start-quiz effect exits the node first and owns no quiz transition', async () => {
    const quizTopic = topic({
      id: QUIZ_TOPIC_ID,
      effects: [
        { kind: 'exit-node', actorId: ACTOR_ID },
        { kind: 'start-quiz', quizId: QUIZ_ID, actorId: ACTOR_ID },
      ],
    });
    const bundle = npcBundle({ topics: [quizTopic, defaultTopic()] });
    const state = npcState({
      npcs: {
        [ACTOR_ID]: npcDto({ stateId: TALKING, activeNodeId: NODE_ID }),
      },
    });

    const { events } = await submitNpc(ask(), { bundle, state });
    const types = eventTypes(events);

    expect(types).toContain('node-exited');
    expect(types).not.toContain('question-asked');
    expect(types).not.toContain('quiz-ended');
  });

  it('NPC-EFF-05: a full conversation emits all pinned NPC and bookkeeping event variants', async () => {
    const prompt = '(Ask about the ring.)';
    const teaching = topic({
      responses: ['Here is what I know.'],
      prompt,
      effects: [
        { kind: 'learn-topic', actorId: ACTOR_ID, topicId: 'ring-known' },
        { kind: 'enter-node', actorId: ACTOR_ID, nodeId: NODE_ID },
      ],
    });
    const bundle = npcBundle({
      states: [
        actorState(READY, {
          onEnter: [{ kind: 'message', text: 'The guide greets you.' }],
        }),
        actorState(TALKING),
      ],
      topics: [teaching, defaultTopic()],
    });
    const state = npcState({
      npcs: { [ACTOR_ID]: npcDto({ stateId: READY }) },
    });
    const bus = new RecordingBus();
    const game = await loadGame({
      ...npcGameDependencies({
        bundle,
        state,
        command: { kind: 'talk-to', actorId: ACTOR_ID },
      }),
      bus,
    });

    game.submit('talk guide');
    game.submit('ask guide ring');
    game.submit('bye');
    const types: string[] = bus.events.map((event: GameEvent) => event.type);

    for (const expected of [
      'conversation-started',
      'npc-spoke',
      'topic-suggested',
      'conversation-ended',
      'actor-state-changed',
      'knowledge-gained',
      'node-entered',
      'node-exited',
    ]) {
      expect(types).toContain(expected);
    }
  });
});
