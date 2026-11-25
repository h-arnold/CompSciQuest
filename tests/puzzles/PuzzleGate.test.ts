// Red test for Z-GAP-01 (skeleton-decisions.md, 2026-11-25): the clue count is
// per puzzle, so zero or one clue is a puzzle-graph finding and two or more
// pass. The gate is called directly on an in-memory parsed card set.
import { describe, expect, it } from 'vitest';
import { checkPuzzle } from '../../tools/content/gates/puzzle.ts';
import {
  parsedCard,
  parsedSet,
  PUZZLES_PATH,
} from '../fixtures/contentToolchain';

function puzzleWithClues(
  id: string,
  clues: readonly string[],
): Record<string, unknown> {
  return {
    id,
    requirements: [{ kind: 'flag-set', flag: 'door-unlocked' }],
    onSolve: [],
    score: 0,
    dependsOn: [],
    authoring: { clues },
  };
}

describe('puzzle-graph gate (Z-GAP-01)', () => {
  it('Z-GAP-01: zero and one clue are both rejected; two or more clues pass', () => {
    const cards = parsedSet(
      parsedCard(PUZZLES_PATH, {
        kind: 'puzzle',
        puzzles: [
          puzzleWithClues('puzzle-zero-clues', []),
          puzzleWithClues('puzzle-one-clue', ['one clue']),
          puzzleWithClues('puzzle-two-clues', ['first clue', 'second clue']),
          puzzleWithClues('puzzle-three-clues', ['one', 'two', 'three']),
        ],
      }),
    );
    const before = JSON.stringify(cards);

    const findings = checkPuzzle(cards).filter(
      (finding) =>
        finding.gate === 'puzzle-graph' &&
        finding.message.toLowerCase().includes('clue'),
    );
    const entries = findings.map((finding) => finding.entry);

    expect(entries).toContain('puzzle-zero-clues');
    expect(entries).toContain('puzzle-one-clue');
    expect(entries).not.toContain('puzzle-two-clues');
    expect(entries).not.toContain('puzzle-three-clues');
    expect(JSON.stringify(cards)).toBe(before);
  });
});
