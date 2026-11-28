// Red tests for NPC integration with the turn pipeline and UI contracts
// (application-and-ui.md §4, §5.2, §6.1, §7.1, §7.2, §8; npcs.md §7;
// shared-rules.md §2; architecture.md §6.2). The bus, random and DOM are fakes.
import { afterEach, describe, expect, it } from 'vitest';
import type { GameEvent } from '../../src/core/events/GameEvent';
import { ConversationPanel } from '../../src/ui/ConversationPanel';
import { formatEvent } from '../../src/ui/formatEvent';
import { RecordingBus, loadGame } from '../fixtures/persistence';
import {
  loadComposedReactionFactory,
  recordingComposedReactionDependencies,
} from '../fixtures/mechanics';
import {
  installFakeDocument,
  makeViewData,
  restoreDocument,
} from '../fixtures/ui';
import {
  ACTOR_ALIAS,
  ACTOR_ID,
  actorState,
  defaultTopic,
  dialogueSystemFor,
  npcBundle,
  npcContext,
  npcDto,
  npcGameDependencies,
  npcState,
  READY,
  TALKING,
  topic,
} from '../fixtures/npcs';

afterEach(() => {
  restoreDocument();
});

describe('NPC integration (application-and-ui.md §4, §8)', () => {
  it('NPC-INTEG-01: an NPC command returns effects applied centrally, buffers one batch and advances the turn once', async () => {
    const bus = new RecordingBus();
    const state = npcState({
      npcs: { [ACTOR_ID]: npcDto({ stateId: READY }) },
    });
    const game = await loadGame({
      ...npcGameDependencies({
        bundle: npcBundle(),
        state,
        command: { kind: 'talk-to', actorId: ACTOR_ID },
      }),
      bus,
    });

    const events = game.submit('talk guide');

    expect(bus.batches).toHaveLength(1);
    expect(bus.batches[0]).toEqual(events);
    expect(game.getViewData().turn).toBe(state.turn + 1);
    expect(events).toContainEqual({
      type: 'conversation-started',
      actorId: ACTOR_ID,
    });
    expect(state.npcs[ACTOR_ID]?.stateId).toBe(TALKING);
  });

  it('NPC-INTEG-02: DialogueSystem.react runs between hazards and puzzles, applies its own effects and emits to no bus', async () => {
    const createComposed = await loadComposedReactionFactory();
    const bundle = npcBundle();
    const state = npcState({
      npcs: { [ACTOR_ID]: npcDto({ stateId: TALKING }) },
    });
    const dialogue = await dialogueSystemFor(bundle, state);
    const trace: string[] = [];
    const react = createComposed({
      ...recordingComposedReactionDependencies(trace),
      npcs: {
        react(
          context: Parameters<typeof dialogue.react>[0],
          events: readonly GameEvent[],
        ) {
          trace.push('npcs');
          return dialogue.react(context, events);
        },
      },
    });

    const events = react(npcContext(state, { bundle }), []);

    expect(trace).toEqual(['scheduler', 'hazards', 'npcs', 'puzzles', 'hints']);
    expect(Array.isArray(events)).toBe(true);
    expect(state.npcs[ACTOR_ID]?.stateId).toBe(TALKING);
  });

  it('NPC-INTEG-03: the panel is inline, visible only during a conversation and renders view-data text once mounted', async () => {
    installFakeDocument();
    const panel = new ConversationPanel();
    const prompt = '(You could ask why.)';
    panel.refresh(
      makeViewData({
        conversation: {
          actorId: ACTOR_ID,
          actorName: 'Guide',
          prompt,
        },
      }),
    );

    expect(panel.element.className).toBe('conversation-panel');
    expect(panel.element.hidden).toBe(false);
    expect(panel.element.textContent).toContain('Guide');
    // UI-CONVPROMPT-01 (application-and-ui.md §6.1): the panel carries only
    // "Talking with X."; the canonical topic-suggested transcript line is the
    // sole on-screen owner of the authored prompt.
    expect(panel.element.textContent).toBe('Talking with Guide.');
    expect(panel.element.textContent).not.toContain(prompt);
    expect(
      formatEvent(
        { type: 'topic-suggested', actorId: ACTOR_ID, text: prompt },
        npcBundle(),
      ),
    ).toEqual([prompt]);
    const mounted = panel.element;

    const state = npcState({
      npcs: { [ACTOR_ID]: npcDto({ stateId: READY }) },
    });
    const bundle = npcBundle({ topics: [defaultTopic()] });
    const game = await loadGame(
      npcGameDependencies({
        bundle,
        state,
        command: { kind: 'talk-to', actorId: ACTOR_ID },
      }),
    );
    game.submit('talk guide');
    panel.refresh(game.getViewData());

    expect(panel.element).toBe(mounted);
    expect(panel.element.hidden).toBe(false);
    expect(panel.element.textContent).toBe('Talking with Guide.');
  });

  it('NPC-INTEG-04: GameViewData.conversation carries actorId, actorName and an optional prompt, and is absent with no conversation', async () => {
    const prompt = '(Ask about the ring.)';
    const prompted = topic({
      responses: ['A ring?'],
      prompt,
    });
    const bundle = npcBundle({
      topics: [prompted, defaultTopic()],
      states: [
        actorState(READY, {
          onEnter: [{ kind: 'message', text: 'Hello.' }],
        }),
        actorState(TALKING),
      ],
    });
    const state = npcState({
      npcs: { [ACTOR_ID]: npcDto({ stateId: READY }) },
    });
    const game = await loadGame(
      npcGameDependencies({
        bundle,
        state,
        command: { kind: 'talk-to', actorId: ACTOR_ID },
      }),
    );

    expect(game.getViewData().conversation).toBeUndefined();
    game.submit('talk guide');
    game.submit('ask guide ring');

    const conversation = game.getViewData().conversation;
    expect(conversation?.actorId).toBe(ACTOR_ID);
    expect(conversation?.actorName).toBe(ACTOR_ALIAS);
    expect(conversation?.prompt).toBe(prompt);

    game.submit('bye');
    expect(game.getViewData().conversation).toBeUndefined();
  });

  it('NPC-INTEG-05: internal-state events stay silent and NPC dialogue still renders in a full batch', async () => {
    const bundle = npcBundle({
      topics: [topic({ prompt: '(You could ask why.)' }), defaultTopic()],
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

    expect(bus.events.length).toBeGreaterThan(0);
    // ENG8-LOGID-01: the six internal-state kinds are suppressed in addition
    // to the bookkeeping group; the player-facing NPC text is still rendered.
    const suppressedTypes = new Set<GameEvent['type']>([
      'quiz-started',
      'quiz-ended',
      'hazard-triggered',
      'conversation-started',
      'conversation-ended',
      'hint-penalty-applied',
      'flag-changed',
      'item-moved',
      'actor-state-changed',
      'knowledge-gained',
      'node-entered',
      'node-exited',
      'scheduled',
    ]);
    for (const event of bus.events) {
      const lines = formatEvent(event, bundle);
      const isNonGainScore = event.type === 'score-changed' && event.delta <= 0;
      if (isNonGainScore || suppressedTypes.has(event.type)) {
        expect(lines, `${event.type} must render no transcript line`).toEqual(
          [],
        );
      } else {
        expect(
          lines.length,
          `${event.type} must still render text`,
        ).toBeGreaterThan(0);
      }
    }
    const started = bus.events.find(
      (event) => event.type === 'conversation-started',
    );
    expect(started).toBeDefined();
    if (started === undefined) return;
    expect(formatEvent(started, bundle)).toEqual([]);

    const dialogueTypes = new Set<GameEvent['type']>([
      'npc-spoke',
      'topic-suggested',
      'message',
    ]);
    const dialogueEvents = bus.events.filter(
      (
        event,
      ): event is Extract<
        GameEvent,
        { type: 'npc-spoke' | 'topic-suggested' | 'message' }
      > => dialogueTypes.has(event.type),
    );
    expect(dialogueEvents.length).toBeGreaterThan(0);
    const renderedDialogue = dialogueEvents
      .flatMap((event) => formatEvent(event, bundle))
      .join('\n');
    for (const event of dialogueEvents) {
      expect(
        renderedDialogue,
        `${event.type} text must reach the player-facing log`,
      ).toContain(event.text);
    }
  });
});
