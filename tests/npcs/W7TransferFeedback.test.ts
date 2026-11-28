// W7F-10 — SHOW/GIVE announce the transfer at the moment it happens
// (PLAYTEST-assistance-ward.md finding 11; assistance-ward.md §6).
// Authored teaching text is never asserted or changed.
import { describe, expect, it } from 'vitest';
import { authoredGame } from '../fixtures/authored';
import type { Effect } from '../../src/core/effects/Effect';
import {
  W7_AI_ALIAS,
  W7_AI_ID,
  W7_TRANSFER_ITEM_ID,
  W7_TRANSFER_ITEM_NAME,
  w7QuizBundle,
  w7QuizState,
  w7TransferItem,
  w7TransferTopic,
} from '../fixtures/wardW7Fixes';

const EXPECTED_MESSAGE = `You hand the ${W7_TRANSFER_ITEM_NAME} to ${W7_AI_ALIAS}.`;

function transferTopic(effects: readonly Effect[]) {
  return w7TransferTopic('topic-fixture-transfer', effects);
}

describe('W7 SHOW/GIVE feedback (assistance-ward.md §6)', () => {
  it.each(['show', 'give'] as const)(
    'W7F-10: %s transfers once and announces the handover',
    (verb) => {
      const bundle = w7QuizBundle([transferTopic([])], [w7TransferItem()]);
      const state = w7QuizState({ heldItems: [W7_TRANSFER_ITEM_ID] });
      const { game } = authoredGame({ bundle, state });

      const events = game.submit(`${verb} ${W7_AI_ALIAS} tally token`);

      expect(state.player.inventory).not.toContain(W7_TRANSFER_ITEM_ID);
      expect(state.npcs[W7_AI_ID]?.inventory).toEqual([W7_TRANSFER_ITEM_ID]);
      expect(
        events.filter(
          (event) =>
            event.type === 'message' && event.text === EXPECTED_MESSAGE,
        ),
      ).toHaveLength(1);
      const moved = events.findIndex((event) => event.type === 'item-moved');
      const announced = events.findIndex(
        (event) => event.type === 'message' && event.text === EXPECTED_MESSAGE,
      );
      expect(moved).toBeGreaterThanOrEqual(0);
      expect(announced).toBeGreaterThanOrEqual(moved);
    },
  );

  it('W7F-10: an already authored transfer effect is not duplicated', () => {
    const authoredTransfer: Effect = {
      kind: 'transfer-item',
      itemId: W7_TRANSFER_ITEM_ID,
      fromOwnerId: 'player',
      toOwnerId: W7_AI_ID,
    };
    const bundle = w7QuizBundle(
      [transferTopic([authoredTransfer])],
      [w7TransferItem()],
    );
    const state = w7QuizState({ heldItems: [W7_TRANSFER_ITEM_ID] });
    const { game } = authoredGame({ bundle, state });

    const events = game.submit(`show ${W7_AI_ALIAS} tally token`);

    expect(state.player.inventory).not.toContain(W7_TRANSFER_ITEM_ID);
    expect(state.npcs[W7_AI_ID]?.inventory).toEqual([W7_TRANSFER_ITEM_ID]);
    expect(events.filter((event) => event.type === 'item-moved')).toHaveLength(
      1,
    );
    expect(
      events.filter(
        (event) => event.type === 'message' && event.text === EXPECTED_MESSAGE,
      ),
    ).toHaveLength(1);
  });
});
