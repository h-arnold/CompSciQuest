// YAML scaffolds (content-toolchain.md §3, §2; content-rules.md §4.2). All
// writes go through the injected IO seam; no file is created by importing this
// module.

import type {
  ContentIo,
  ScaffoldOptions,
  ScaffoldResult,
} from './contracts.ts';

const FILES: Readonly<Record<string, string>> = {
  rooms: 'rooms.yaml',
  npcs: 'npcs.yaml',
  quizzes: 'quizzes.yaml',
  puzzles: 'puzzles.yaml',
  hazards: 'hazards.yaml',
  hints: 'hints.yaml',
};

// Authoring rule IDs printed in each scaffold header (content-toolchain.md §3).
const RULES: Readonly<Record<string, string>> = {
  npcs: 'C1, C3, C4, C6',
  quizzes: 'P3, P4, P5',
  puzzles: 'N6, P2',
  hazards: 'H1',
  hints: 'H2, H3',
};

function header(kind: string, areaId: string, rules: string): string {
  return [
    `# ${kind} card for ${areaId}`,
    '# Replace each todo with approved content from the editor brief.',
    `# Applicable rules: ${rules}`,
    `kind: ${kind}`,
    `areaId: ${areaId}`,
    'status: draft # draft | reviewed | approved (V1)',
    '',
  ].join('\n');
}

function roomsScaffold(
  areaId: string,
  world: ScaffoldOptions['world'],
): string {
  const worldId = world?.id ?? `world-${areaId}`;
  // The CLI passes the bare area name; authored area IDs carry the prefix.
  const isOwner = world?.startAreaId === `area-${areaId}`;
  const lines = [
    header('area', areaId, 'D2, D3, D4, N6, V1'),
    `# definition: id area-${areaId}, worldId ${worldId}, name, startRoomId, lives (D3, V1)`,
    `definition:`,
    `  id: area-${areaId}`,
    `  worldId: ${worldId}`,
    '  name: todo-name',
    '  startRoomId: room-todo-start',
    '  lives: 3',
    '',
  ];
  if (isOwner && world !== undefined) {
    lines.push(
      '# A world is declared once, by the area whose startAreaId it names (D3).',
      'worlds:',
      `  - id: ${world.id}`,
      '    name: todo-world-name',
      `    areaIds: [area-${areaId}]`,
      `    startAreaId: ${world.startAreaId}`,
      '    lives: 3',
      '',
    );
  } else {
    lines.push(
      '# Do not declare a second world here; set only definition.worldId (D3).',
      '',
    );
  }
  lines.push(
    '# rooms: id, title, description (block scalar), exits, score (D3, N8)',
    'rooms:',
    '  - id: room-todo-start',
    '    title: todo-title',
    '    description: >-',
    '      todo-description',
    '    exits: []',
    '    score: 0',
    '',
    '# items: id, name, aliases, portable, description, initialRoom (D2, D3)',
    'items: []',
    '',
  );
  return lines.join('\n');
}

function template(
  kind: string,
  areaId: string,
  rules: string,
  body: readonly string[],
): string {
  return [header(kind, areaId, rules), ...body, ''].join('\n');
}

function bodyFor(kind: string): readonly string[] {
  switch (kind) {
    case 'npcs': {
      return [
        '# actors: id, aliases, initialStateId (C1, C6)',
        'actors: []',
        '# actorStates: id, stateDesc, specialDesc; no greeting on ready (C6)',
        'actorStates: []',
        '# conversationTopics: id, actorId, match, isActive, responses (C3, C6)',
        'conversationTopics: []',
        '# conversationNodes: id, actorId, topicIds, defaultTopicId (C4, C6)',
        'conversationNodes: []',
      ];
    }
    case 'quizzes': {
      return [
        '# quizzes: id, topicId, score, questionIds, passMark (P3, P5)',
        'quizzes: []',
        '# questions: prompt, options, correctOptionIds, explanation (P3, P4)',
        'questions: []',
      ];
    }
    case 'puzzles': {
      return [
        '# puzzles: topicId, score, requirements, onSolve, dependsOn (N6, P2)',
        'puzzles: []',
        '# authoring.clues needs at least two discoverable clues (N6)',
      ];
    }
    case 'hazards': {
      return [
        '# hazards: trigger, when, effects, once (H1)',
        'hazards: []',
        '# authoring.telegraph names the clue before harm (H1)',
      ];
    }
    case 'hints': {
      return [
        '# hintSequences: targets, levels, cooldownTurns (H2, H3)',
        'hintSequences: []',
        '# unlock keys: failed-attempts:<quizId> or turns-since:<puzzleId> (H3)',
      ];
    }
    default: {
      return [];
    }
  }
}

interface Target {
  readonly path: string;
  readonly text: string;
}

function targetsFor(
  areaId: string,
  options: ScaffoldOptions,
): readonly Target[] {
  return Object.entries(FILES).map(([kind, name]) => ({
    path: `${areaId}/${name}`,
    text:
      kind === 'rooms'
        ? roomsScaffold(areaId, options.world)
        : template(kind, areaId, RULES[kind] ?? '', bodyFor(kind)),
  }));
}

export function scaffoldArea(
  areaId: string,
  options: ScaffoldOptions,
  io: ContentIo,
): ScaffoldResult {
  const targets = targetsFor(areaId, options);
  // Refusal is atomic: an existing card blocks the whole scaffold so an
  // aborted run never leaves a half-written area behind.
  const refused =
    options.force === true
      ? []
      : targets
          .filter((target) => io.exists(target.path))
          .map((target) => target.path);
  if (refused.length > 0) {
    return {
      written: [],
      refused,
      skipped: targets.map((target) => target.path),
    };
  }
  for (const target of targets) io.writeFile(target.path, target.text);
  return {
    written: targets.map((target) => target.path),
    refused: [],
    skipped: [],
  };
}
