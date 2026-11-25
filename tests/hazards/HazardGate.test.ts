// Red test for H-GAP-02 (skeleton-decisions.md, 2026-11-25): the authoring
// hazard-content gate rejects a scheduled event with remainingTurns: 0 and
// accepts a positive value. This asserts the reject variant, not a clamp.
// The gate is called directly on an in-memory parsed card; no YAML file,
// clock, storage, randomness or file system is touched.
import { describe, expect, it } from 'vitest';
import { checkHazard } from '../../tools/content/gates/hazard.ts';
import {
  HAZARDS_PATH,
  parsedCard,
  parsedSet,
} from '../fixtures/contentToolchain';

function scheduledHazard(
  id: string,
  remainingTurns: number,
): Record<string, unknown> {
  return {
    id,
    trigger: { kind: 'on-room-enter', roomId: 'room-binary-hall' },
    when: { kind: 'flag-set', flag: 'switch-cooled' },
    effects: [{ kind: 'message', text: 'The belt clicks faster.' }],
    schedule: {
      id: `fuse-${id}`,
      kind: 'fuse',
      remainingTurns,
      effect: { kind: 'message', text: 'The fuse burned out.' },
    },
    authoring: { telegraph: 'Heat haze shimmers off the belt.' },
  };
}

describe('hazard-content gate (H-GAP-02)', () => {
  it('H-GAP-02: a scheduled event with remainingTurns 0 is rejected; a positive value passes', () => {
    const cards = parsedSet(
      parsedCard(HAZARDS_PATH, {
        kind: 'hazard',
        hazards: [
          scheduledHazard('hazard-zero-fuse', 0),
          scheduledHazard('hazard-positive-fuse', 1),
        ],
      }),
    );
    const before = JSON.stringify(cards);

    const findings = checkHazard(cards).filter(
      (finding) => finding.gate === 'hazard-content',
    );
    const entries = findings.map((finding) => finding.entry);

    expect(entries).toContain('hazard-zero-fuse');
    expect(entries).not.toContain('hazard-positive-fuse');
    expect(JSON.stringify(cards)).toBe(before);
  });
});
