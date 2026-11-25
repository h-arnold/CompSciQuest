// puzzle-graph gate (content-rules.md §7, §4.5): dependencies, topic and clues.

import type { Finding, ParsedCardSet } from '../contracts.ts';
import {
  asObjectArray,
  asRecord,
  asText,
  collection,
  finding,
  idsOf,
  stringList,
} from './common.ts';

function dependencyFindings(
  puzzle: {
    readonly path: string;
    readonly entry: string;
    readonly data: Record<string, unknown>;
  },
  puzzleIds: ReadonlySet<string>,
): readonly Finding[] {
  return stringList(puzzle.data['dependsOn'])
    .filter((id) => puzzleIds.size > 0 && !puzzleIds.has(id))
    .map((id) =>
      finding(
        puzzle.path,
        puzzle.entry,
        `dependsOn names unknown puzzle '${id}'`,
        'puzzle-graph',
      ),
    );
}

function clueFindings(puzzle: {
  readonly path: string;
  readonly entry: string;
  readonly data: Record<string, unknown>;
}): readonly Finding[] {
  const authoring = asRecord(puzzle.data['authoring']);
  const clues = stringList(authoring?.['clues']);
  return clues.length > 0 && clues.length < 2
    ? [
        finding(
          puzzle.path,
          puzzle.entry,
          'at least two clues are required',
          'puzzle-graph',
        ),
      ]
    : [];
}

function puzzleFindings(
  cards: ParsedCardSet,
  puzzles: readonly {
    readonly path: string;
    readonly entry: string;
    readonly data: Record<string, unknown>;
  }[],
): readonly Finding[] {
  const puzzleIds = idsOf(puzzles);
  const topics = new Set(
    collection(cards, 'topics').map((item) => asText(item.data['id'])),
  );
  return puzzles.flatMap((puzzle) => {
    const found: Finding[] = [
      ...dependencyFindings(puzzle, puzzleIds),
      ...clueFindings(puzzle),
    ];
    const topicId = asText(puzzle.data['topicId']);
    if (topicId.length > 0 && topics.size > 0 && !topics.has(topicId)) {
      found.push(
        finding(
          puzzle.path,
          puzzle.entry,
          `topicId '${topicId}' has no spec topic`,
          'puzzle-graph',
        ),
      );
    }
    const requirements = asObjectArray(puzzle.data['requirements']);
    for (const requirement of requirements) {
      if (asText(requirement['kind']) === 'has-item') {
        found.push(
          finding(
            puzzle.path,
            puzzle.entry,
            'requirements must use action-set flags, not has-item',
            'puzzle-graph',
          ),
        );
      }
    }
    return found;
  });
}

function cycleFindings(
  puzzles: readonly {
    readonly path: string;
    readonly entry: string;
    readonly data: Record<string, unknown>;
  }[],
): readonly Finding[] {
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const cyclic = new Set<string>();
  const walk = (id: string): void => {
    if (visiting.has(id)) {
      cyclic.add(id);
      return;
    }
    if (visited.has(id)) return;
    visiting.add(id);
    const current = puzzles.find((puzzle) => asText(puzzle.data['id']) === id);
    if (current !== undefined) {
      const dependencies = stringList(current.data['dependsOn']);
      for (const next of dependencies) walk(next);
    }
    visiting.delete(id);
    visited.add(id);
  };
  const ids = puzzles.map((puzzle) => asText(puzzle.data['id']));
  for (const id of ids) walk(id);
  return [...cyclic].flatMap((id) => {
    const item = puzzles.find((puzzle) => asText(puzzle.data['id']) === id);
    return item === undefined
      ? []
      : [
          finding(
            item.path,
            item.entry,
            `puzzle dependency cycle at '${id}'`,
            'puzzle-graph',
          ),
        ];
  });
}

export function checkPuzzle(cards: ParsedCardSet): readonly Finding[] {
  const puzzles = collection(cards, 'puzzles');
  return [...puzzleFindings(cards, puzzles), ...cycleFindings(puzzles)];
}
