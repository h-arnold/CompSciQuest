// Deterministic, in-memory seam for the content toolchain red tests. No real
// file system, YAML card under docs/content, wall clock, Math.random, network or
// browser storage is touched. The toolchain modules do not exist yet, so each
// loader turns a missing module/export into a named assertion failure rather
// than a raw resolution error.
import { expect } from 'vitest';
import { importModule } from './persistence';

export interface CardFile {
  readonly path: string;
  readonly text: string;
}

export interface CardSet {
  readonly files: readonly CardFile[];
}

export interface Finding {
  readonly path: string;
  readonly entry: string;
  readonly message: string;
  readonly gate: string;
}

export interface ParseResult {
  readonly findings: readonly Finding[];
  readonly parsed: Readonly<Record<string, Record<string, unknown>>>;
}

export interface ParsedCard {
  readonly path: string;
  readonly data: Record<string, unknown>;
}

export interface ParsedCardSet {
  readonly cards: readonly ParsedCard[];
}

export interface ValidationOptions {
  readonly coverageTopicIds?: readonly string[];
  readonly coverageHeadings?: readonly string[];
  // Clauses whose source is not available to the validator must be reported as
  // gaps instead of silently passing (content-rules.md §7, final paragraph).
  readonly uncheckedClauses?: readonly string[];
}

export interface ValidateResult {
  readonly findings: readonly Finding[];
  readonly exitCode: number;
}

export interface ScaffoldOptions {
  readonly force?: boolean;
  readonly world?: {
    readonly id: string;
    readonly startAreaId: string;
  };
}

export interface ScaffoldResult {
  readonly written: readonly string[];
  readonly refused: readonly string[];
  readonly skipped: readonly string[];
}

export interface GeneratedFile {
  readonly path: string;
  readonly text: string;
}

export interface GenerationResult {
  readonly ok: boolean;
  readonly findings: readonly Finding[];
  readonly files: readonly GeneratedFile[];
}

// ---------------------------------------------------------------------------
// In-memory file I/O fake. Ordering is explicit so lexicographic traversal and
// declaration order can be asserted without depending on host filesystem order.
// ---------------------------------------------------------------------------

export class MemoryContentIo {
  private readonly files = new Map<string, string>();
  readonly writes: GeneratedFile[] = [];
  readonly reads: string[] = [];

  constructor(initial: readonly CardFile[] = []) {
    for (const file of initial) {
      this.files.set(file.path, file.text);
    }
  }

  readFile(path: string): string | undefined {
    this.reads.push(path);
    return this.files.get(path);
  }

  writeFile(path: string, text: string): void {
    this.files.set(path, text);
    this.writes.push({ path, text });
  }

  listFiles(prefix: string): readonly string[] {
    return Object.keys(Object.fromEntries(this.files)).filter((path) =>
      path.startsWith(prefix),
    );
  }

  exists(path: string): boolean {
    return this.files.has(path);
  }

  contentOf(path: string): string {
    return this.files.get(path) ?? '';
  }

  snapshot(): string {
    return JSON.stringify(Object.entries(Object.fromEntries(this.files)));
  }
}

// ---------------------------------------------------------------------------
// Module loaders. Each failure names the expected export and its canonical
// document section, so a missing toolchain is an assertion about the contract,
// not an opaque import error.
// ---------------------------------------------------------------------------

async function loadTool(
  path: string,
  names: readonly string[],
  reason: string,
): Promise<Record<string, unknown>> {
  let module: Record<string, unknown> = {};
  try {
    module = await importModule(path);
  } catch {
    // The named-export assertions below report the contract failure.
  }
  for (const name of names) {
    expect(
      module[name],
      `${name} must be exported from ${path} (${reason})`,
    ).toBeDefined();
  }
  return module;
}

export interface SchemaModule {
  parseCardSet(cards: CardSet): ParseResult;
}

export interface ValidationModule {
  readonly GATE_IDS: readonly string[];
  validateCards(
    cards: ParsedCardSet,
    options?: ValidationOptions,
  ): readonly Finding[];
  validateCommand(cards: CardSet, options?: ValidationOptions): ValidateResult;
}

export interface ScaffoldModule {
  scaffoldArea(
    areaId: string,
    options: ScaffoldOptions,
    io: MemoryContentIo,
  ): ScaffoldResult;
}

export interface GeneratorModule {
  generateContent(
    cards: ParsedCardSet,
    options?: ValidationOptions,
  ): GenerationResult;
}

export async function loadSchema(): Promise<SchemaModule> {
  const module = await loadTool(
    '../../tools/content/schema',
    ['parseCardSet'],
    'content-toolchain.md §4 (Zod shapes)',
  );
  return {
    parseCardSet: module['parseCardSet'] as SchemaModule['parseCardSet'],
  };
}

export async function loadValidation(): Promise<ValidationModule> {
  const module = await loadTool(
    '../../tools/content/validate',
    ['GATE_IDS', 'validateCards', 'validateCommand'],
    'content-toolchain.md §4 (eight shared gates)',
  );
  return {
    GATE_IDS: module['GATE_IDS'] as readonly string[],
    validateCards: module['validateCards'] as ValidationModule['validateCards'],
    validateCommand: module[
      'validateCommand'
    ] as ValidationModule['validateCommand'],
  };
}

export async function loadScaffolder(): Promise<ScaffoldModule> {
  const module = await loadTool(
    '../../tools/content/scaffold',
    ['scaffoldArea'],
    'content-toolchain.md §3 (scaffolds)',
  );
  return {
    scaffoldArea: module['scaffoldArea'] as ScaffoldModule['scaffoldArea'],
  };
}

export async function loadGenerator(): Promise<GeneratorModule> {
  const module = await loadTool(
    '../../tools/content/generate',
    ['generateContent'],
    'content-toolchain.md §5 (generation)',
  );
  return {
    generateContent: module[
      'generateContent'
    ] as GeneratorModule['generateContent'],
  };
}

// ---------------------------------------------------------------------------
// Declared deterministic card data. These are test literals, not authored game
// content; no file under docs/content is read or written.
// ---------------------------------------------------------------------------

export const AREA_ID = '1-2-1-data-representation';
export const ROOMS_PATH = `${AREA_ID}/rooms.yaml`;
export const NPCS_PATH = `${AREA_ID}/npcs.yaml`;
export const QUIZZES_PATH = `${AREA_ID}/quizzes.yaml`;
export const PUZZLES_PATH = `${AREA_ID}/puzzles.yaml`;
export const HAZARDS_PATH = `${AREA_ID}/hazards.yaml`;
export const HINTS_PATH = `${AREA_ID}/hints.yaml`;
export const SPEC_TOPICS_PATH = 'spec-topics.yaml';

const ROOMS_YAML = `kind: area
areaId: ${AREA_ID}
status: draft
topicIds: [data-types]

definition:
  id: area-${AREA_ID}
  worldId: world-${AREA_ID}
  name: The Switchyard
  startRoomId: room-binary-hall
  lives: 3

worlds:
  - id: world-${AREA_ID}
    name: The Switchyard
    areaIds: [area-${AREA_ID}]
    startAreaId: area-${AREA_ID}
    lives: 3

rooms:
  - id: room-binary-hall
    title: Binary Hall
    description: >-
      A hall of five type bins.
    exits: []
    score: 0

items:
  - id: item-register-cache
    name: register cache
    aliases: [cache]
    portable: true
    description: >-
      A small cache of registers.
    initialRoom: room-binary-hall
`;

const NPCS_YAML = `kind: npc
areaId: ${AREA_ID}
status: draft
topicIds: [data-types]

actors:
  - id: npc-archivist
    aliases: [archivist]
    initialStateId: actorstate-ready

actorStates:
  - id: actorstate-ready
    stateDesc: Ready to explain.
    specialDesc: An archivist waits.

conversationTopics:
  - id: topic-data-types
    actorId: npc-archivist
    match: { kind: askTell, objectIds: [data-types] }
    isActive: { kind: not, of: { kind: flag-set, flag: data-types-known } }
    responses:
      - >-
        Types sort the world.
    strategy: { kind: once }
    effects: []

conversationNodes:
  - id: node-data-types
    actorId: npc-archivist
    isSticky: false
    topicIds: [topic-data-types]
    defaultTopicId: topic-data-types
    authoring:
      reserved: true
      note: Deliberate teaching beat with no enter-node producer.
`;

const QUIZZES_YAML = `kind: quiz
areaId: ${AREA_ID}
status: draft
topicIds: [data-types]

quizzes:
  - id: quiz-data-types
    actorId: npc-archivist
    topicId: data-types
    score: 1
    questionIds: [q-data-types-1, q-data-types-2]
    passMark: 1
    onPass:
      - { kind: complete-topic, topicId: data-types }
      - { kind: set-flag, flag: quiz-passed:quiz-data-types, value: true }
    onFail:
      - { kind: change-lives, delta: -1, reason: A wrong answer costs a life. }

questions:
  - id: q-data-types-1
    prompt: >-
      Which type holds a whole number?
    options: [integer, real]
    correctOptionIds: [0]
    explanation: >-
      An integer is a whole number.
    authoring:
      assessmentObjective: AO1
      difficulty: easy
  - id: q-data-types-2
    prompt: >-
      Which type holds text?
    options: [string, character]
    correctOptionIds: [0]
    explanation: >-
      A string holds a sequence of characters.
    authoring:
      assessmentObjective: AO2
      difficulty: easy
`;

const PUZZLES_YAML = `kind: puzzle
areaId: ${AREA_ID}
status: draft
topicIds: [data-types]

puzzles:
  - id: puzzle-sort-types
    topicId: data-types
    score: 1
    requirements:
      - { kind: flag-set, flag: bins-labelled }
    onSolve:
      - { kind: complete-topic, topicId: data-types }
    dependsOn: []
    authoring:
      clues:
        - The first bin is labelled for a whole number.
        - The notice lists a string example.
`;

const HAZARDS_YAML = `kind: hazard
areaId: ${AREA_ID}
status: draft
topicIds: [data-types]

hazards:
  - id: hazard-overheat
    trigger: { kind: on-room-enter, roomId: room-binary-hall }
    when: { kind: not, of: { kind: flag-set, flag: cooling-fitted } }
    effects:
      - { kind: change-lives, delta: -1, reason: The cartridge overheats. }
    once: true
    authoring:
      telegraph: The cartridge hums warmly before it overheats.
`;

const HINTS_YAML = `kind: hint
areaId: ${AREA_ID}
status: draft
topicIds: [data-types]

hintSequences:
  - id: hint-sort-types
    targets: [data-types, puzzle-sort-types]
    levels:
      - level: 1
        text: >-
          Look for the label on the first bin.
        unlock:
          { kind: counter-at-least, key: failed-attempts:quiz-data-types, value: 1 }
      - level: 2
        text: >-
          Match each sample to its type bin.
        unlock:
          { kind: counter-at-least, key: turns-since:puzzle-sort-types, value: 3 }
    cooldownTurns: 2
`;

const SPEC_TOPICS_YAML = `kind: spec-topics
status: draft

topics:
  - id: data-types
    title: Data types
    specReference: "§1.2.1"
    codeLocation: "src/content/authored/rooms.ts"
    status: covered
    evidence: The binary hall teaches and assesses the five types.
    roomIds: [room-binary-hall]
    maxScore: 2
`;

export function conformingCardSet(): CardSet {
  return {
    files: [
      { path: ROOMS_PATH, text: ROOMS_YAML },
      { path: NPCS_PATH, text: NPCS_YAML },
      { path: QUIZZES_PATH, text: QUIZZES_YAML },
      { path: PUZZLES_PATH, text: PUZZLES_YAML },
      { path: HAZARDS_PATH, text: HAZARDS_YAML },
      { path: HINTS_PATH, text: HINTS_YAML },
      { path: SPEC_TOPICS_PATH, text: SPEC_TOPICS_YAML },
    ],
  };
}

export function withCard(cards: CardSet, path: string, text: string): CardSet {
  const files = cards.files.filter((file) => file.path !== path);
  files.push({ path, text });
  return { files };
}

export function cardText(cards: CardSet, path: string): string {
  const file = cards.files.find((entry) => entry.path === path);
  expect(file, `Fixture card ${path} must be declared`).toBeDefined();
  return file?.text ?? '';
}

export function parsedCard(
  path: string,
  data: Record<string, unknown>,
): ParsedCard {
  return { path, data };
}

export function parsedSet(...cards: readonly ParsedCard[]): ParsedCardSet {
  return { cards };
}

export function generatedFile(
  files: readonly GeneratedFile[],
  path: string,
): string {
  const file = files.find((entry) => entry.path === path);
  expect(file, `Generated file ${path} must be emitted`).toBeDefined();
  return file?.text ?? '';
}

export function expectSameMembers(
  actual: readonly string[],
  expected: readonly string[],
): void {
  expect(actual).toHaveLength(expected.length);
  expect(new Set(actual)).toEqual(new Set(expected));
}

export function findingText(findings: readonly Finding[]): string {
  return findings
    .map((finding) =>
      [finding.path, finding.entry, finding.message, finding.gate].join(' '),
    )
    .join('\n');
}

export const GATE_NAMES = [
  'content-ids',
  'quiz-content',
  'puzzle-graph',
  'world-graph',
  'hint-content',
  'hazard-content',
  'npc-content',
  'score-content',
] as const;

// Generated output paths from content-toolchain.md §5 mapping table.
export const GENERATED_PATHS = [
  'src/content/authored/rooms.ts',
  'src/content/authored/items.ts',
  'src/content/authored/areas.ts',
  'src/content/authored/worlds.ts',
  'src/content/authored/actors.ts',
  'src/content/authored/actor-states.ts',
  'src/content/authored/conversation-topics.ts',
  'src/content/authored/nodes.ts',
  'src/content/authored/quizzes.ts',
  'src/content/authored/questions.ts',
  'src/content/authored/puzzles.ts',
  'src/content/authored/hazards.ts',
  'src/content/authored/hints.ts',
  'src/content/authored/spec-topics.ts',
] as const;
