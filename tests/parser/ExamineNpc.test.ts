// Examine-on-NPC contracts from npcs.md §2 and application-and-ui.md §5/§5.2.
// Showrunner decision: an actor with no authored examine interaction prints its
// CURRENT ActorState.stateDesc verbatim as the single message, with no state
// change and no npc-spoke. Item and scenery examine paths stay unchanged.
// All content, state and collaborators are deterministic in-memory fixtures:
// no browser storage, wall clock, Math.random, network or file system.
import { describe, expect, it } from 'vitest';
import type { Effect } from '../../src/core/effects/Effect';
import type { GameEvent } from '../../src/core/events/GameEvent';
import type { GameState } from '../../src/core/GameState';
import {
  authoredBundle,
  authoredGame,
  authoredNpc,
  authoredState,
  gameplaySnapshot,
} from '../fixtures/authored';
import { CHEST_ID, loadVerbTable, makeTurnContext } from '../fixtures/parser';

const AI_ID = 'npc-the-ai';
const AI_COLD = 'actorstate-ai-cold';
const AI_GRUDGING = 'actorstate-ai-grudging';

// Derive the expected line from the generated catalogue, the source of truth
// for authored prose (testing.md §"Generated copy and shared constants").
function stateDescOf(stateId: string): string {
  const state = authoredBundle.actorStates.getById(stateId);
  if (state === undefined) {
    throw new Error(
      `Authored actor state '${stateId}' is missing from the catalogue.`,
    );
  }
  return state.stateDesc;
}

function effectMessages(effects: readonly Effect[]): readonly string[] {
  return effects.flatMap((effect) =>
    effect.kind === 'message' ? [effect.text] : [],
  );
}

function eventMessages(events: readonly GameEvent[]): readonly string[] {
  return events.flatMap((event) =>
    event.type === 'message' ? [event.text] : [],
  );
}

function snapshot(state: GameState): string {
  return JSON.stringify({
    gameplay: gameplaySnapshot(state),
    score: state.score,
  });
}

describe('examine on an NPC (describeTarget)', () => {
  it('P-EXAMINE-NPC-REQUIRED-01: examine ai emits the current stateDesc verbatim as one message, with no npc-spoke and no state change', () => {
    const state = authoredState({
      roomId: 'room-arrival',
      npcs: { [AI_ID]: authoredNpc(AI_ID) },
    });
    const before = snapshot(state);
    const { game } = authoredGame({ state });

    const batch = game.submit('examine ai');

    expect(eventMessages(batch)).toEqual([stateDescOf(AI_COLD)]);
    expect(batch.filter((event) => event.type === 'npc-spoke')).toHaveLength(0);
    expect(snapshot(state)).toBe(before);
  });

  it('P-EXAMINE-NPC-STATEDESC-01: x and look at print the NPC stateDesc for its current state, not a fixed initial line', () => {
    const state = authoredState({
      roomId: 'room-arrival',
      npcs: { [AI_ID]: authoredNpc(AI_ID, { stateId: AI_GRUDGING }) },
    });
    const before = snapshot(state);
    const { game } = authoredGame({ state });

    const short = game.submit('x ai');
    const long = game.submit('look at ai');
    const batches = [...short, ...long];

    expect(eventMessages(short)).toEqual([stateDescOf(AI_GRUDGING)]);
    expect(eventMessages(long)).toEqual([stateDescOf(AI_GRUDGING)]);
    expect(batches.filter((event) => event.type === 'npc-spoke')).toHaveLength(
      0,
    );
    expect(snapshot(state)).toBe(before);
  });

  it('examine on an item still prints that item description (describeTarget item path unchanged)', async () => {
    const table = await loadVerbTable();
    const context = makeTurnContext();
    const command = { kind: 'examine', targetId: CHEST_ID } as const;
    const handler = table.getCommandHandler(command);
    if (handler === undefined) {
      throw new Error(
        'getCommandHandler must return a handler for examine (application-and-ui.md §5.2)',
      );
    }

    expect(effectMessages(handler(command, context))).toEqual([
      'A wooden chest.',
    ]);
  });
});
