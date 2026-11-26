// Canonical signature from application-and-ui.md §3.3. The optional coverage
// argument is a test-owned injection seam: the static runtime cannot read
// COVERAGE.md, so the `## Topic: <name>` index is supplied as data. The
// one-argument boot-time signature is unchanged.
import { hazardContentFindings } from '../core/hazards/HazardValidation.ts';
import { puzzleGraphFindings } from '../core/puzzles/PuzzleGraph.ts';
import type { SpecTopic } from '../core/scoring/SpecTopic';
import type { Direction } from '../types/domain';
import type { Catalogue } from './Catalogue';
import type { ContentBundle } from './ContentBundle';

// Runtime mirror of the canonical eight-value Direction union in
// architecture.md §7; this is a value set, not a second type declaration.
const DIRECTIONS = new Set<Direction>([
  'north',
  'south',
  'east',
  'west',
  'up',
  'down',
  'in',
  'out',
]);

// `hazard-content` and `puzzle-graph` now have runtime mirrors below. The
// remaining three gates stay with their own mechanics slices (content-rules.md §7).
export const DEFERRED_GATES = [
  'quiz-content',
  'hint-content',
  'npc-content',
] as const;

interface Identified {
  readonly id: string;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function isNonBlank(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function aliasProblemsOf(label: string, aliases: unknown): readonly string[] {
  if (!Array.isArray(aliases))
    return [`${label} scenery aliases must be an array`];
  return aliases.every(isNonBlank)
    ? []
    : [`${label} scenery aliases must be non-empty strings`];
}

function sceneryEntryProblems(
  label: string,
  value: unknown,
): readonly string[] {
  const entry = asRecord(value);
  if (entry === undefined) return [`${label} scenery entry must be an object`];
  const problems: string[] = [];
  if (!isNonBlank(entry['name'])) {
    problems.push(`${label} scenery name must be a non-blank string`);
  }
  if (!isNonBlank(entry['description'])) {
    problems.push(`${label} scenery description must be a non-blank string`);
  }
  problems.push(
    ...(entry['aliases'] === undefined
      ? []
      : aliasProblemsOf(label, entry['aliases'])),
  );
  return problems;
}

function sceneryProblems(label: string, scenery: unknown): readonly string[] {
  return Array.isArray(scenery)
    ? scenery.flatMap((entry) => sceneryEntryProblems(label, entry))
    : [`${label} scenery must be an array`];
}

function interactionProblems(label: string, value: unknown): readonly string[] {
  const interaction = asRecord(value);
  if (interaction === undefined)
    return [`${label} interaction must be an object`];
  const problems: string[] = [];
  if ('itemId' in interaction && !isNonBlank(interaction['itemId'])) {
    problems.push(`${label} interaction itemId must be a non-empty string`);
  }
  if (
    interaction['kind'] === 'examine' &&
    ('itemId' in interaction || 'item' in interaction)
  ) {
    problems.push(
      `${label} EXAMINE interaction must omit its acting item: an EXAMINE interaction must omit its item field`,
    );
  }
  return problems;
}

// One shared interaction/scenery shape owner for the runtime bundle gate and
// the authoring adapter (content-rules.md §4.2, D3). Target-reference existence
// stays with `referenceProblems()`; this function only inspects local shape and
// never mutates its input.
export function interactionShapeProblems(
  rooms: readonly unknown[],
): readonly string[] {
  return rooms.flatMap((value) => {
    const room = asRecord(value);
    if (room === undefined) return [];
    const roomId = typeof room['id'] === 'string' ? room['id'] : 'unknown-room';
    const label = `Room '${roomId}'`;
    const problems = [
      ...(room['scenery'] === undefined
        ? []
        : sceneryProblems(label, room['scenery'])),
    ];
    const interactions = room['interactions'];
    if (interactions === undefined) return problems;
    if (!Array.isArray(interactions)) {
      return [...problems, `${label} interactions must be an array`];
    }
    return [
      ...problems,
      ...interactions.flatMap((entry) => interactionProblems(label, entry)),
    ];
  });
}

function repeated(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const repeats = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      repeats.add(value);
    }
    seen.add(value);
  }
  return [...repeats];
}

function catalogueIds(bundle: ContentBundle): readonly string[] {
  const catalogues: readonly Catalogue<Identified>[] = [
    bundle.worlds,
    bundle.areas,
    bundle.rooms,
    bundle.items,
    bundle.actors,
    bundle.actorStates,
    bundle.conversationTopics,
    bundle.nodes,
    bundle.quizzes,
    bundle.questions,
    bundle.puzzles,
    bundle.hazards,
    bundle.hints,
  ];
  return catalogues.flatMap((catalogue) =>
    repeated(catalogue.all.map((entry) => entry.id)).map(
      (id) => `Duplicate artifact ID '${id}' in a content catalogue`,
    ),
  );
}

function aliasProblems(bundle: ContentBundle): readonly string[] {
  const aliases = [...bundle.items.all, ...bundle.actors.all].flatMap(
    (entry) => entry.aliases,
  );
  return repeated(aliases).map(
    (alias) => `Duplicate object or NPC alias '${alias}'`,
  );
}

function roomReferenceProblems(
  bundle: ContentBundle,
  roomIds: ReadonlySet<string>,
): readonly string[] {
  const problems: string[] = [];
  for (const room of bundle.rooms.all) {
    for (const exit of room.exits) {
      if (!roomIds.has(exit.targetRoomId)) {
        problems.push(
          `Room '${room.id}' has an exit targeting missing room '${exit.targetRoomId}'`,
        );
      }
      if (!DIRECTIONS.has(exit.direction)) {
        problems.push(
          `Room '${room.id}' has an invalid exit direction '${String(exit.direction)}'`,
        );
      }
    }
    for (const effect of room.entryEffects) {
      if (effect.kind === 'move-player' && !roomIds.has(effect.roomId)) {
        problems.push(
          `Room '${room.id}' has a move-player target '${effect.roomId}' that is not a room`,
        );
      }
    }
  }
  return problems;
}

function ownerProblems(
  bundle: ContentBundle,
  roomIds: ReadonlySet<string>,
): readonly string[] {
  const problems: string[] = [];
  for (const item of bundle.items.all) {
    if (!roomIds.has(item.initialRoom)) {
      problems.push(
        `Item '${item.id}' has a missing initialRoom '${item.initialRoom}'`,
      );
    }
  }
  for (const area of bundle.areas.all) {
    if (!roomIds.has(area.startRoomId)) {
      problems.push(
        `Area '${area.id}' has a missing startRoomId '${area.startRoomId}'`,
      );
    }
  }
  return problems;
}

function referenceProblems(bundle: ContentBundle): readonly string[] {
  const roomIds = new Set(bundle.rooms.all.map((room) => room.id));
  const noRooms =
    bundle.rooms.all.length === 0 ? ['Content bundle declares no rooms'] : [];
  return [
    ...noRooms,
    ...roomReferenceProblems(bundle, roomIds),
    ...ownerProblems(bundle, roomIds),
  ];
}

// SpecTopicCatalogue has no `all`, so topics are enumerated through the rooms
// and areas that index them, plus any IDs supplied by the injected coverage
// list, and deduplicated by canonical ID.
function specTopicsOf(
  bundle: ContentBundle,
  coverage?: readonly string[],
): readonly SpecTopic[] {
  const found: SpecTopic[] = [];
  const collect = (topics: readonly SpecTopic[]): void => {
    for (const topic of topics) {
      if (found.every((known) => known.id !== topic.id)) {
        found.push(topic);
      }
    }
  };
  for (const room of bundle.rooms.all) {
    collect(bundle.specTopics.getByRoomId(room.id));
  }
  for (const area of bundle.areas.all) {
    collect(bundle.specTopics.getByAreaId(area.worldId, area.id));
  }
  if (coverage !== undefined) {
    for (const id of coverage) {
      const topic = bundle.specTopics.getById(id);
      if (topic !== undefined) {
        collect([topic]);
      }
    }
  }
  return found;
}

function scoreValidityProblems(bundle: ContentBundle): readonly string[] {
  const problems: string[] = [];
  const checkScore = (kind: string, id: string, score: number): void => {
    if (!Number.isSafeInteger(score) || score < 0) {
      problems.push(
        `${kind} '${id}' declares an invalid score ${String(score)}`,
      );
    }
  };
  for (const room of bundle.rooms.all) {
    checkScore('Room', room.id, room.score);
  }
  for (const puzzle of bundle.puzzles.all) {
    checkScore('Puzzle', puzzle.id, puzzle.score);
  }
  for (const quiz of bundle.quizzes.all) {
    checkScore('Quiz', quiz.id, quiz.score);
  }
  return problems;
}

function budgetProblems(
  bundle: ContentBundle,
  topics: readonly SpecTopic[],
): readonly string[] {
  const problems: string[] = [];
  for (const topic of topics) {
    let total = 0;
    for (const roomId of topic.roomIds) {
      total += bundle.rooms.getById(roomId)?.score ?? 0;
    }
    for (const puzzle of bundle.puzzles.all) {
      if (puzzle.topicId === topic.id) {
        total += puzzle.score;
      }
    }
    for (const quiz of bundle.quizzes.all) {
      if (quiz.topicId === topic.id) {
        total += quiz.score;
      }
    }
    if (total > topic.maxScore) {
      problems.push(
        `Spec topic '${topic.id}' score total ${total} exceeds its maxScore ${topic.maxScore}`,
      );
    }
  }
  return problems;
}

function coverageProblems(
  topics: readonly SpecTopic[],
  coverage: readonly string[],
): readonly string[] {
  const problems: string[] = [];
  for (const topic of topics) {
    if (!coverage.includes(topic.id)) {
      problems.push(
        `Spec topic '${topic.id}' is absent from the coverage index`,
      );
    }
    if (topic.specReference.trim().length === 0) {
      problems.push(`Spec topic '${topic.id}' has no specReference`);
    }
    if (topic.evidence.trim().length === 0) {
      problems.push(`Spec topic '${topic.id}' has no evidence note`);
    }
  }
  return problems;
}

export function validateContent(
  bundle: ContentBundle,
  coverage?: readonly string[],
): readonly string[] {
  const topics = specTopicsOf(bundle, coverage);
  // An omitted list falls back to the IDs this validator can enumerate, so the
  // coverage gate still checks references and evidence in the one-arg boot form.
  const coverageIds = coverage ?? topics.map((topic) => topic.id);
  return [
    ...catalogueIds(bundle),
    ...aliasProblems(bundle),
    ...referenceProblems(bundle),
    ...scoreValidityProblems(bundle),
    ...budgetProblems(bundle, topics),
    ...coverageProblems(topics, coverageIds),
    ...hazardContentFindings(bundle),
    ...puzzleGraphFindings(bundle),
    ...interactionShapeProblems(bundle.rooms.all),
  ];
}
