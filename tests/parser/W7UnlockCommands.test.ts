// W7F-03..05 — unlock syntax and in-world refusal from the 2026-11-27 ward
// fix round (content-bible.md §12; assistance-ward.md §§6, 9.1, 10).
// All objects come from the in-memory fixture bundle, never authored YAML.
import { describe, expect, it } from 'vitest';
import { resolveGameCommand } from '../../src/application/commandResolution';
import type { Command } from '../../src/core/commands/Command';
import type { Effect } from '../../src/core/effects/Effect';
import { loadVerbTable } from '../fixtures/parser';
import {
  messageTexts,
  stateSnapshot,
  W7_CABINET_NAME,
  W7_KEY_NAME,
  W7_UNLOCK_COMMAND,
  w7UnlockBundle,
  w7UnlockContext,
  w7UnlockState,
} from '../fixtures/wardW7Fixes';

const EXPECTED_UNLOCK_COMMAND: Command = W7_UNLOCK_COMMAND;

describe('W7 unlock command acceptance (content-bible.md §12)', () => {
  it('W7F-03: unlock <item> with <target> resolves to the canonical item-first command', () => {
    const state = w7UnlockState(true);
    const bundle = w7UnlockBundle();
    const before = stateSnapshot(state);

    const command = resolveGameCommand(
      'unlock practice key with practice cabinet',
      state,
      bundle,
    );

    expect(command).toEqual(EXPECTED_UNLOCK_COMMAND);
    expect(stateSnapshot(state)).toBe(before);
  });

  it('W7F-04: unlock <item> <target> splits both multi-word names without dropping a word', () => {
    const state = w7UnlockState(true);
    const bundle = w7UnlockBundle();
    const before = stateSnapshot(state);

    const assessed = resolveGameCommand(
      'unlock practice key practice cabinet',
      state,
      bundle,
    );

    expect(assessed).toEqual(EXPECTED_UNLOCK_COMMAND);
    expect(
      resolveGameCommand(
        'unlock practice key with practice cabinet',
        state,
        bundle,
      ),
    ).toEqual(assessed);
    expect(stateSnapshot(state)).toBe(before);
  });
});

describe('W7 unlock refusal (content-bible.md §12)', () => {
  it('W7F-05: a missing key yields one in-world message and no false carrying claim', async () => {
    const table = await loadVerbTable();
    const state = w7UnlockState(false);
    const context = w7UnlockContext(state);
    const before = stateSnapshot(state);
    const handler = table.getCommandHandler(W7_UNLOCK_COMMAND);
    expect(handler, 'unlock must have a verb handler').toBeTypeOf('function');

    const effects: readonly Effect[] =
      handler?.(W7_UNLOCK_COMMAND, context) ?? [];

    expect(messageTexts(effects)).toEqual([
      `You need the ${W7_KEY_NAME} in hand before it will turn in the ${W7_CABINET_NAME}.`,
    ]);
    expect(
      messageTexts(effects).some((text) =>
        text.includes('You are not carrying that.'),
      ),
      'the carried key is not the missing object',
    ).toBe(false);
    expect(stateSnapshot(state)).toBe(before);
  });
});
