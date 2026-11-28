// WR2-B1 / WR2-B2 — round-2 unlock refusal and the item-first preservation
// contract (application-and-ui.md §5/§5.1;
// topics/assistance-ward.md §6; PLAYTEST-assistance-ward-round2.md §3 finding B).
// Every object comes from the deterministic in-memory ward fixture: no authored
// YAML, real storage, wall clock, random source or network is used.
import { describe, expect, it } from 'vitest';
import { resolveGameCommand } from '../../src/application/commandResolution';
import type { Command } from '../../src/core/commands/Command';
import type { Effect } from '../../src/core/effects/Effect';
import { loadVerbTable } from '../fixtures/parser';
import {
  messageTexts,
  stateSnapshot,
  W7_CABINET_ID,
  W7_CABINET_NAME,
  W7_KEY_ID,
  W7_KEY_NAME,
  W7_UNLOCK_COMMAND,
  w7UnlockBundle,
  w7UnlockContext,
  w7UnlockState,
} from '../fixtures/wardW7Fixes';

// The bolted-down cabinet is offered as the key-like item and the portable key
// as the lock: exactly the order the round-2 playtest found misleading.
const WRONG_ORDER_COMMAND: Command = {
  kind: 'unlock',
  itemId: W7_CABINET_ID,
  targetId: W7_KEY_ID,
};

const WRONG_ORDER_TEXT = `The ${W7_CABINET_NAME} stays in place; turn its lock with the ${W7_KEY_NAME} instead.`;
const MISSING_KEY_TEXT = `You need the ${W7_KEY_NAME} in hand before it will turn in the ${W7_CABINET_NAME}.`;

describe('WR2-B1 — wrong-order unlock refusal (assistance-ward.md §6)', () => {
  it('WR2-B1: the bolted-down cabinet gets one in-world refusal that points to the key and leaves the whole state unchanged', async () => {
    const table = await loadVerbTable();
    const state = w7UnlockState(true);
    const context = { ...w7UnlockContext(state), command: WRONG_ORDER_COMMAND };
    const before = stateSnapshot(state);
    const handler = table.getCommandHandler(WRONG_ORDER_COMMAND);
    expect(handler, 'unlock must have a verb handler').toBeTypeOf('function');

    const effects: readonly Effect[] =
      handler?.(WRONG_ORDER_COMMAND, context) ?? [];
    const texts = messageTexts(effects);

    expect(texts).toEqual([WRONG_ORDER_TEXT]);
    expect(effects).toHaveLength(1);
    for (const forbidden of [
      'in hand',
      'not carrying',
      'You need the',
      W7_CABINET_ID,
      W7_KEY_ID,
      'flag-set',
      'unlocked:',
    ]) {
      expect(
        texts.some((text) => text.includes(forbidden)),
        `the refusal must not say '${forbidden}'`,
      ).toBe(false);
    }
    expect(stateSnapshot(state)).toBe(before);
  });

  it('WR2-B1: a genuine missing key still receives the existing in-world message', async () => {
    const table = await loadVerbTable();
    const state = w7UnlockState(false);
    const context = w7UnlockContext(state);
    const before = stateSnapshot(state);
    const handler = table.getCommandHandler(W7_UNLOCK_COMMAND);
    expect(handler, 'unlock must have a verb handler').toBeTypeOf('function');

    const effects: readonly Effect[] =
      handler?.(W7_UNLOCK_COMMAND, context) ?? [];

    expect(messageTexts(effects)).toEqual([MISSING_KEY_TEXT]);
    expect(effects).toHaveLength(1);
    expect(stateSnapshot(state)).toBe(before);
  });
});

describe('WR2-B2 — item-first unlock preservation contract (application-and-ui.md §5.1)', () => {
  // Both tests in this describe were green before the round-2 slice; they are
  // preservation contracts, not new behaviour.
  it('WR2-B2: preservation — both authorised item-first forms resolve to the key-first unlock command', () => {
    const state = w7UnlockState(true);
    const bundle = w7UnlockBundle();
    const before = stateSnapshot(state);

    expect(
      resolveGameCommand('unlock practice key practice cabinet', state, bundle),
    ).toEqual(W7_UNLOCK_COMMAND);
    expect(
      resolveGameCommand(
        'unlock practice key with practice cabinet',
        state,
        bundle,
      ),
    ).toEqual(W7_UNLOCK_COMMAND);
    expect(stateSnapshot(state)).toBe(before);
  });

  it('WR2-B2: preservation — the key-held command still sets the lock flag and emits "You unlock it."', async () => {
    const table = await loadVerbTable();
    const state = w7UnlockState(true);
    const context = w7UnlockContext(state);
    const before = stateSnapshot(state);
    const handler = table.getCommandHandler(W7_UNLOCK_COMMAND);
    expect(handler, 'unlock must have a verb handler').toBeTypeOf('function');

    const effects: readonly Effect[] =
      handler?.(W7_UNLOCK_COMMAND, context) ?? [];

    expect(effects).toContainEqual({
      kind: 'set-flag',
      flag: `container-unlocked:${W7_CABINET_ID}`,
      value: true,
    });
    expect(messageTexts(effects)).toEqual(['You unlock it.']);
    expect(stateSnapshot(state)).toBe(before);
  });
});
