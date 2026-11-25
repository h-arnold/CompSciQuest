// Red tests for Puzzle Dependency Graph validation (puzzles.md §4, §7;
// content-rules.md §7 (`puzzle-graph`); CT-GATE-05). The runtime bundle mirror
// is checked through the single canonical validator at boot; the authoring
// card set is checked through the shared toolchain gates.
import { describe, expect, it } from 'vitest';
import {
  LOCAL_FIXTURE_COVERAGE_TOPIC_IDS,
  loadValidator,
} from '../fixtures/content';
import {
  loadValidation,
  parsedCard,
  parsedSet,
  PUZZLES_PATH,
  type Finding,
} from '../fixtures/contentToolchain';
import {
  loadSolveOrder,
  mechanicsBundle,
  PUZZLE_ID,
  puzzle,
  SECOND_PUZZLE_ID,
  snapshot,
} from '../fixtures/mechanics';

function hasFinding(
  findings: readonly Finding[],
  gate: string,
  token: string,
): boolean {
  return findings.some(
    (finding) =>
      finding.gate === gate &&
      finding.message.toLowerCase().includes(token.toLowerCase()),
  );
}

describe('puzzle dependency graph (puzzles.md §4)', () => {
  it('Z-PDG-01: the graph rejects unknown dependencies, cycles and duplicate IDs', async () => {
    const validate = await loadValidator();
    const definitions = [
      puzzle({ id: PUZZLE_ID, dependsOn: [SECOND_PUZZLE_ID] }),
      puzzle({ id: SECOND_PUZZLE_ID, dependsOn: [PUZZLE_ID] }),
      puzzle({
        id: 'puzzle-unknown-dependency',
        dependsOn: ['puzzle-does-not-exist'],
      }),
    ];
    const bundle = mechanicsBundle([], definitions);
    const before = snapshot(bundle);

    const problems = validate(bundle, LOCAL_FIXTURE_COVERAGE_TOPIC_IDS);
    const text = problems.join(' ').toLowerCase();

    expect(text).toContain('cycle');
    expect(text).toContain('puzzle-does-not-exist');
    expect(snapshot(bundle)).toBe(before);
  });

  it('Z-PDG-02: an unknown topicId on a puzzle is reported', async () => {
    const validate = await loadValidator();
    const bundle = mechanicsBundle(
      [],
      [puzzle({ topicId: 'topic-does-not-exist' })],
    );
    const before = snapshot(bundle);

    const problems = validate(bundle, LOCAL_FIXTURE_COVERAGE_TOPIC_IDS);

    expect(problems.join(' ')).toContain('topic-does-not-exist');
    expect(snapshot(bundle)).toBe(before);
  });

  it('Z-PDG-03: a puzzle unreachable from the start is reported; a fully reachable graph is not', async () => {
    const validate = await loadValidator();
    const definitions = [
      puzzle({ id: PUZZLE_ID }),
      puzzle({
        id: 'puzzle-orphan',
        dependsOn: ['puzzle-does-not-exist'],
      }),
    ];
    const bundle = mechanicsBundle([], definitions);
    const before = snapshot(bundle);

    const problems = validate(bundle, LOCAL_FIXTURE_COVERAGE_TOPIC_IDS);
    const text = problems.join(' ').toLowerCase();

    expect(text).toContain('unreachable');
    expect(text).toContain('puzzle-orphan');

    const reachable = mechanicsBundle(
      [],
      [
        puzzle({ id: PUZZLE_ID }),
        puzzle({ id: SECOND_PUZZLE_ID, dependsOn: [PUZZLE_ID] }),
      ],
    );
    const clean = validate(reachable, LOCAL_FIXTURE_COVERAGE_TOPIC_IDS)
      .join(' ')
      .toLowerCase();
    expect(clean).not.toContain('unreachable');
    expect(snapshot(bundle)).toBe(before);
  });

  it('Z-PDG-04: a topological solve order puts every dependency before its dependent', async () => {
    const solveOrder = await loadSolveOrder();
    const third = 'puzzle-third';
    const bundle = mechanicsBundle(
      [],
      [
        puzzle({ id: PUZZLE_ID }),
        puzzle({ id: SECOND_PUZZLE_ID, dependsOn: [PUZZLE_ID] }),
        puzzle({ id: third, dependsOn: [SECOND_PUZZLE_ID] }),
      ],
    );

    const order = solveOrder(bundle);

    expect(order).toHaveLength(3);
    expect(order).toEqual(
      expect.arrayContaining([PUZZLE_ID, SECOND_PUZZLE_ID, third]),
    );
    expect(order.indexOf(PUZZLE_ID)).toBeLessThan(
      order.indexOf(SECOND_PUZZLE_ID),
    );
    expect(order.indexOf(SECOND_PUZZLE_ID)).toBeLessThan(order.indexOf(third));
  });

  it('Z-CLUE-01: a puzzle card with fewer than two clues is reported by puzzle-graph', async () => {
    const { validateCards } = await loadValidation();
    const cards = parsedSet(
      parsedCard(PUZZLES_PATH, {
        kind: 'puzzle',
        puzzles: [
          {
            id: PUZZLE_ID,
            requirements: [{ kind: 'flag-set', flag: 'door-unlocked' }],
            onSolve: [],
            score: 0,
            dependsOn: [],
            authoring: { clues: [] },
          },
        ],
      }),
    );
    const before = JSON.stringify(cards);

    const findings = validateCards(cards);

    expect(hasFinding(findings, 'puzzle-graph', 'clue')).toBe(true);
    expect(JSON.stringify(cards)).toBe(before);
  });
});
