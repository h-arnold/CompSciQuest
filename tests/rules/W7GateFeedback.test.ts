// W7F-06 — player-visible gate denial. The RuleEngine is the canonical owner of
// exit gating; the verb handler is not tested twice here.
import { describe, expect, it } from 'vitest';
import { createRuleEngine } from '../../src/core/rules/RuleEngine';
import { createConditionEvaluator } from '../../src/core/rules/ConditionEvaluator';
import type { Command } from '../../src/core/commands/Command';
import { FakeRandom } from '../fixtures/persistence';
import {
  stateSnapshot,
  W7_AUTHORS_BLOCKED_TEXT,
  W7_GATE_FALLBACK,
  W7_ROOM_ID,
  w7GateBundle,
  w7GateState,
  type W7GateExit,
} from '../fixtures/wardW7Fixes';

const GO_EAST: Command = { kind: 'go', direction: 'east' };

function checkExit(exit: W7GateExit): readonly string[] {
  const state = w7GateState();
  const before = stateSnapshot(state);
  const engine = createRuleEngine({
    bundle: w7GateBundle([exit]),
    evaluator: createConditionEvaluator(),
    random: new FakeRandom([0]),
  });
  const messages = engine.check(GO_EAST, state);
  expect(stateSnapshot(state)).toBe(before);
  return messages;
}

const UNMET: W7GateExit['preconditions'] = [
  { kind: 'flag-set', flag: 'tutorial-complete' },
];

function expectNoTechnicalDetail(messages: readonly string[]): void {
  const text = messages.join(' ');
  for (const token of [
    'tutorial-complete',
    'flag-set',
    'precondition',
    'kind',
    W7_ROOM_ID,
  ]) {
    expect(text, `${token} must never reach the player`).not.toContain(token);
  }
}

describe('W7 gate denial (assistance-ward.md §10)', () => {
  it('W7F-06: an authored blockedText is returned verbatim and once', () => {
    const messages = checkExit({
      direction: 'east',
      targetRoomId: 'room-fixture-target',
      preconditions: UNMET,
      blockedText: W7_AUTHORS_BLOCKED_TEXT,
    });

    expect(messages).toEqual([W7_AUTHORS_BLOCKED_TEXT]);
    expectNoTechnicalDetail([...messages]);
  });

  it('W7F-06: an exit without blockedText uses exactly the in-world fallback', () => {
    const messages = checkExit({
      direction: 'east',
      targetRoomId: 'room-fixture-target',
      preconditions: UNMET,
    });

    expect(messages).toEqual([W7_GATE_FALLBACK]);
    expectNoTechnicalDetail([...messages]);
  });

  it('W7F-06: several failing preconditions still produce one friendly line', () => {
    const messages = checkExit({
      direction: 'east',
      targetRoomId: 'room-fixture-target',
      preconditions: [
        { kind: 'flag-set', flag: 'tutorial-complete' },
        { kind: 'has-item', itemId: 'item-fixture-key' },
        { kind: 'in-room', roomId: 'room-fixture-elsewhere' },
      ],
    });

    expect(messages).toEqual([W7_GATE_FALLBACK]);
    expectNoTechnicalDetail([...messages]);
  });
});
