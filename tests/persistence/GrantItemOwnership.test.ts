// W7WIN-C04 regression: an authored quiz passes a `grant-item` effect for a
// pattern card that already has its `initialRoom` copy in the catalogue. The
// grant must leave the player as the card's ONLY owner, and the later give must
// leave the quiz actor as the only owner. storage-schema.md §3.3(1);
// walkthrough.md §8 step 23 / §8.4; combat.md §3; application-and-ui.md §11–12.
import { describe, expect, it } from 'vitest';
import { createSaveManager } from '../../src/application/SaveManager';
import { createEffectApplier } from '../../src/core/effects/EffectApplier';
import type { Effect } from '../../src/core/effects/Effect';
import type { GameStateDto } from '../../src/core/GameState';
import { authoredBundle, authoredState } from '../fixtures/authored';
import { FakeRandom, FixedClock, MemoryStorage } from '../fixtures/persistence';

const BUREAU_ID = 'room-pattern-bureau';
const QUIZ_IDS = [
  'quiz-threading-order',
  'quiz-colour-court',
  'quiz-weft-tally',
  'quiz-selvedge',
] as const;

function saveManager() {
  return createSaveManager({
    storage: new MemoryStorage(),
    clock: new FixedClock(),
    bundle: authoredBundle,
  });
}

// storage-schema.md §3.3(1): every item id occurs in exactly one owner list.
// Collecting all three owner kinds makes a duplicate owner observable.
function ownersOf(state: GameStateDto, itemId: string): string[] {
  const owners: string[] = [];
  if (state.player.inventory.includes(itemId)) owners.push('player');
  for (const [npcId, npc] of Object.entries(state.npcs)) {
    if (npc.inventory.includes(itemId)) owners.push(npcId);
  }
  for (const [roomId, room] of Object.entries(state.rooms)) {
    if (room.inventory.includes(itemId)) owners.push(roomId);
  }
  return owners;
}

// The granted card and the actor who receives the give both come from the
// authored quiz; no item id or NPC id is invented here.
function authoredGrant(quizId: string): {
  readonly itemId: string;
  readonly actorId: string;
} {
  const quiz = authoredBundle.quizzes.getById(quizId);
  if (quiz === undefined) {
    throw new Error(`Authored quiz '${quizId}' is missing from the catalogue.`);
  }
  const effect = quiz.onPass.find((entry) => entry.kind === 'grant-item');
  if (effect === undefined || effect.kind !== 'grant-item') {
    throw new Error(
      `Authored quiz '${quizId}' has no grant-item onPass effect.`,
    );
  }
  return { itemId: effect.itemId, actorId: quiz.actorId };
}

// createInitial() places each authored item in its declared initialRoom, so the
// duplicate condition is real without inventing state (authoredState() derives
// from createInitial(authoredBundle).toDto()).
function grantedState(itemId: string) {
  const definition = authoredBundle.items.getById(itemId);
  expect(
    definition?.initialRoom,
    `authored initialRoom for '${itemId}' (storage-schema.md §3.3(2))`,
  ).toBe(BUREAU_ID);
  const state = authoredState({ roomId: BUREAU_ID });
  expect(
    state.toDto().rooms[BUREAU_ID]?.inventory,
    `authored initialRoom copy of '${itemId}' before the quiz grant`,
  ).toContain(itemId);
  const applier = createEffectApplier(state, {
    random: new FakeRandom(),
    bundle: authoredBundle,
  });
  const events = applier.apply({ kind: 'grant-item', itemId });
  expect(events, 'grant-item emits its canonical item-moved event').toEqual([
    {
      type: 'item-moved',
      itemId,
      fromOwnerId: 'world',
      toOwnerId: 'player',
    },
  ]);
  return { state, applier };
}

describe('W7WIN-C04 authored pattern-card grants keep one owner per item', () => {
  it('W7WIN-C04: each authored quiz grant gives the player sole ownership of its pattern card and the give transfers sole ownership to the quiz actor, with a valid save throughout', () => {
    const manager = saveManager();
    for (const quizId of QUIZ_IDS) {
      const { itemId, actorId } = authoredGrant(quizId);
      const { state, applier } = grantedState(itemId);

      const afterGrant = state.toDto();
      expect(
        afterGrant.player.inventory,
        `player inventory after ${quizId} grants '${itemId}'`,
      ).toContain(itemId);
      expect(
        ownersOf(afterGrant, itemId),
        `sole owner of '${itemId}' after ${quizId} (storage-schema.md §3.3(1))`,
      ).toEqual(['player']);

      const grantedSave = manager.buildDto(afterGrant);
      expect(
        manager.validate(JSON.stringify(grantedSave)),
        `save after ${quizId} must not be quarantined as invalid-content`,
      ).toEqual({ ok: true, dto: grantedSave });

      const moved: Effect = {
        kind: 'transfer-item',
        itemId,
        fromOwnerId: 'player',
        toOwnerId: actorId,
      };
      expect(
        applier.apply(moved),
        `give of '${itemId}' to ${actorId} (walkthrough.md §8 step 23)`,
      ).toEqual([
        {
          type: 'item-moved',
          itemId,
          fromOwnerId: 'player',
          toOwnerId: actorId,
        },
      ]);

      const afterGive = state.toDto();
      expect(afterGive.player.inventory).not.toContain(itemId);
      expect(
        ownersOf(afterGive, itemId),
        `sole owner of '${itemId}' after the give to ${actorId}`,
      ).toEqual([actorId]);

      const givenSave = manager.buildDto(afterGive);
      expect(
        manager.validate(JSON.stringify(givenSave)),
        `save after the give to ${actorId} must still validate`,
      ).toEqual({ ok: true, dto: givenSave });
    }
  });

  it('W7WIN-C04: the sequence-card grant produces a save that SaveManager.validate() accepts rather than quarantining as invalid-content', () => {
    // storage-schema.md §9: a failed validation on boot writes the quarantine
    // slot and Continue is disabled. The user-visible contract is a valid save.
    const manager = saveManager();
    const { itemId } = authoredGrant('quiz-threading-order');
    expect(itemId).toBe('item-pattern-card-sequence');
    const { state } = grantedState(itemId);

    const save = manager.buildDto(state.toDto());
    const validation = manager.validate(JSON.stringify(save));
    expect(
      validation,
      'granting an authored pattern card must not invalidate the save',
    ).toEqual({
      ok: true,
      dto: save,
    });
    expect(
      ownersOf(validation.ok ? validation.dto.state : state.toDto(), itemId),
      'the granted card must have exactly one owner',
    ).toEqual(['player']);
  });
});
