// Red tests for response strategies (npcs.md §2; shared-rules.md §7, §12;
// storage-schema.md §3.3(5); user decisions GAP-06 and GAP-07). Every draw of
// randomness is injected and observed; the cycle itself must be deterministic.
import { describe, expect, it } from 'vitest';
import { createFromDto } from '../../src/core/GameState';
import type { GameState } from '../../src/core/GameState';
import { roundTripThroughJson } from '../fixtures/persistence';
import {
  ACTOR_ID,
  CountingRandom,
  defaultTopic,
  npcBundle,
  npcDto,
  npcState,
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

describe('response strategies (npcs.md §2)', () => {
  it('NPC-STRAT-01: a sequence plays its responses in order then repeats the last', async () => {
    const sequential = topic({
      responses: ['FIRST', 'SECOND'],
      strategy: { kind: 'sequence' },
    });
    const bundle = npcBundle({ topics: [sequential, defaultTopic()] });
    const state = talkingState();
    const replies: string[] = [];

    for (let use = 0; use < 3; use += 1) {
      const { events } = await submitNpc(ask(), { bundle, state });
      const spoken = events.flatMap((event) =>
        event.type === 'npc-spoke' ? [event.text] : [],
      );
      replies.push(...spoken);
    }

    expect(replies).toEqual(['FIRST', 'SECOND', 'SECOND']);
  });

  it('NPC-STRAT-02: a rotating topic cycles deterministically and reproduces after a save/restore', async () => {
    const rotating = topic({
      responses: ['ALPHA', 'BETA', 'GAMMA'],
      strategy: { kind: 'rotating' },
    });
    const bundle = npcBundle({ topics: [rotating, defaultTopic()] });
    const state = talkingState();
    const replies: string[] = [];

    for (let use = 0; use < 3; use += 1) {
      const { events } = await submitNpc(ask(), { bundle, state });
      replies.push(
        ...events.flatMap((event) =>
          event.type === 'npc-spoke' ? [event.text] : [],
        ),
      );
    }
    expect(replies).toEqual(['ALPHA', 'BETA', 'GAMMA']);

    const restored = createFromDto(roundTripThroughJson(state));
    const { events } = await submitNpc(ask(), { bundle, state: restored });
    expect(
      events.flatMap((event) =>
        event.type === 'npc-spoke' ? [event.text] : [],
      ),
    ).toEqual(['ALPHA']);
  });

  it('NPC-GAP-06: a once topic used again falls through to the default topic', async () => {
    const single = topic({
      responses: ['ONLY ONCE'],
      strategy: { kind: 'once' },
    });
    const bundle = npcBundle({
      topics: [single, defaultTopic('THE DEFAULT')],
    });
    const state = talkingState();
    const replies: string[] = [];

    for (let use = 0; use < 2; use += 1) {
      const { events } = await submitNpc(ask(), { bundle, state });
      replies.push(
        ...events.flatMap((event) =>
          event.type === 'npc-spoke' ? [event.text] : [],
        ),
      );
    }

    expect(replies).toEqual(['ONLY ONCE', 'THE DEFAULT']);
  });

  it('NPC-GAP-07: rotating never shuffles without an explicit authoring flag', async () => {
    const rotating = topic({
      responses: ['ONE', 'TWO'],
      strategy: { kind: 'rotating' },
    });
    const bundle = npcBundle({ topics: [rotating, defaultTopic()] });
    const state = talkingState();
    const random = new CountingRandom();
    const replies: string[] = [];

    for (let use = 0; use < 4; use += 1) {
      const { events } = await submitNpc(ask(), {
        bundle,
        state,
        random,
      });
      replies.push(
        ...events.flatMap((event) =>
          event.type === 'npc-spoke' ? [event.text] : [],
        ),
      );
    }

    expect(replies).toEqual(['ONE', 'TWO', 'ONE', 'TWO']);
    expect(random.calls).toBe(0);
  });
});
