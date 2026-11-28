// Red tests for the authoring-key coverage slice: the reach of the schema's
// stray-authoring-key walk, its false-positive guard on the shipped card set,
// the derived completeness of the enforced key set, the depth at which a
// runtime `reason:` field stays legal and the documented `authoring.reason`
// form (content-toolchain.md §2 D4 and §4; npcs.md §8; shared-rules.md §5).
// Every card below is an in-memory string literal except the shipped set,
// which is read through the read-only zone1CardSet() fixture: no clock,
// randomness, network, browser storage or file system is touched.
import { describe, expect, it } from 'vitest';
import { parseCardSet } from '../../tools/content/schema.ts';
import { zone1CardSet } from '../fixtures/zone1';

type Finding = ReturnType<typeof parseCardSet>['findings'][number];
type CardRecord = ReturnType<typeof parseCardSet>['parsed'][string];

// An artefact level names the record an `authoring:` block sits on: the card
// record itself, a card's `definition:` record, or a collection entry named
// by its collection.
const CARD_LEVEL = 'card';
const DEFINITION_LEVEL = 'definition';
const UNREACHABLE_LEVEL = 'unreachable';
const SHAPE_GATE = 'shape';

const PROBE_PATH = 'probe-area/probe.yaml';
const PROBE_AREA_ID = 'probe-area';
const PROBE_AREA_DEFINITION_ID = 'area-probe-area';
const PROBE_NPC_KIND = 'npc';
const PROBE_AREA_KIND = 'area';
const PROBE_STATUS = 'draft';
const PROBE_VALUE = 'probe-value';

const QUIZ_CARD_PATH = 'probe-area/quizzes.yaml';
const HAZARD_CARD_PATH = 'probe-area/hazards.yaml';
const NPC_CARD_PATH = 'probe-area/npcs.yaml';

// An authoring-only key written directly on an area card's `definition:`
// record, beside the runtime fields, outside any `authoring:` block
// (content-toolchain.md §2 D4).
const STRAY_DEFINITION_CARD = `kind: area
areaId: probe-area
status: draft

definition:
  id: area-probe-area
  worldId: world-probe
  name: The Probe Area
  startRoomId: room-probe
  pillar: probe-value
`;

// A runtime `reason:` nested inside a quiz entry's `onFail:` effect list.
// `reason` belongs to the `change-lives` variant of the pinned `Effect` union
// (shared-rules.md §5), so it is a runtime field there, not an authoring key.
const NESTED_REASON_QUIZ_CARD = `kind: quiz
areaId: probe-area
status: draft

quizzes:
  - id: quiz-probe
    actorId: npc-probe
    topicId: switch-to-bit
    questionIds: [q-probe-01]
    passMark: 1
    onFail:
      - { kind: change-lives, delta: -1, reason: "the rehearsal went wrong" }
`;

// The same runtime `reason:` nested inside a hazard entry's `effects:` list;
// `move-player` carries a `reason` field in the pinned union (shared-rules.md
// §5).
const NESTED_REASON_HAZARD_CARD = `kind: hazard
areaId: probe-area
status: draft

hazards:
  - id: hazard-probe
    trigger: { kind: on-room-enter, roomId: room-probe }
    effects:
      - { kind: move-player, roomId: room-probe-start, reason: "returned to the level start after the probe" }
    once: true
`;

// A `reason:` written directly on a conversation node, outside any
// `authoring:` block.
const STRAY_REASON_NODE_CARD = `kind: npc
areaId: probe-area
status: draft

conversationNodes:
  - id: node-probe
    actorId: npc-probe
    isSticky: false
    topicIds: []
    defaultTopicId: topic-probe-default
    reason: >-
      No enter-node producer is declared for this node.
`;

// The documented form (npcs.md §8, "Reserved nodes"): a node with no
// `enter-node` producer carries `authoring.reserved: true` and its reason in
// `authoring.note` or `authoring.reason`.
const AUTHORED_REASON_NODE_CARD = `kind: npc
areaId: probe-area
status: draft

conversationNodes:
  - id: node-probe
    actorId: npc-probe
    isSticky: false
    topicIds: []
    defaultTopicId: topic-probe-default
    authoring:
      reserved: true
      reason: >-
        No enter-node producer is declared for this node.
`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

interface AuthoringPair {
  readonly name: string;
  readonly level: string;
}

// An authoring block on an artefact the walk cannot reach. The card path and
// the block path let the failure message point at the offending card and the
// offending record rather than at an opaque list.
interface UnreachableBlock {
  readonly name: string;
  readonly level: string;
  readonly cardPath: string;
  readonly blockPath: string;
}

interface DerivedAuthoring {
  readonly pairs: readonly AuthoringPair[];
  readonly unreachable: readonly UnreachableBlock[];
}

// The legal card-level collection names are derived from the shipped cards:
// a top-level key whose value is a non-empty array of records that each carry
// a string id. These names are never hand-written, so a new collection in the
// shipped set changes them. The tolerated-name list asserted in AKP-06 is a
// different thing: it is a deliberate hand-written tripwire pinned to
// ['topics'], kept literal so the single tolerance stays visible.
function legalCollectionNames(
  cards: readonly CardRecord[],
): ReadonlySet<string> {
  const names = new Set<string>();
  for (const card of cards) {
    for (const [key, value] of Object.entries(card)) {
      if (!Array.isArray(value) || value.length === 0) continue;
      const entries = value.filter(isRecord);
      if (
        entries.length !== value.length ||
        entries.some((entry) => typeof entry['id'] !== 'string')
      ) {
        continue;
      }
      names.add(key);
    }
  }
  return names;
}

interface WalkContext {
  readonly legalCollections: ReadonlySet<string>;
  readonly seen: Set<string>;
  readonly unreachableSeen: Set<string>;
  readonly pairs: AuthoringPair[];
  readonly unreachable: UnreachableBlock[];
  // The card the walk is inside, so an unreachable block can name it.
  cardPath: string;
}

// The path of a record inside its card, so a failure can name the offending
// card and the offending record.
function joinPath(prefix: string, segment: string): string {
  return prefix.length === 0 ? segment : `${prefix}.${segment}`;
}

// An `authoring:` record's own contents are not further authoring blocks, so
// the walk stops there and records the block's direct key names with the
// artefact level of the record that holds it. A block on a record the walk
// cannot reach is recorded separately, with the card path and the block path
// it came from.
function collectAuthoringNames(
  value: unknown,
  level: string | undefined,
  path: string,
  context: WalkContext,
): void {
  if (!isRecord(value)) return;
  const blockPath = joinPath(path, 'authoring');
  for (const name of Object.keys(value)) {
    if (level === undefined) {
      const key = `${context.cardPath} ${blockPath} ${name}`;
      if (context.unreachableSeen.has(key)) continue;
      context.unreachableSeen.add(key);
      context.unreachable.push({
        name,
        level: UNREACHABLE_LEVEL,
        cardPath: context.cardPath,
        blockPath,
      });
      continue;
    }
    const key = `${name} ${level}`;
    if (context.seen.has(key)) continue;
    context.seen.add(key);
    context.pairs.push({ name, level });
  }
}

// Walk every shipped card record and record each `authoring:` block's direct
// key names together with the artefact level of the record that holds the
// block. The walk tracks the parent kind: a child of the card record is
// either its `definition:` record or a collection entry named by its
// collection, and anything deeper is unreachable for the stray-key walk.
function walkRecord(
  value: unknown,
  level: string | undefined,
  path: string,
  context: WalkContext,
): void {
  if (!isRecord(value)) return;
  for (const [key, child] of Object.entries(value)) {
    if (key === 'authoring') {
      collectAuthoringNames(child, level, path, context);
      continue;
    }
    if (Array.isArray(child)) {
      walkEntries(child, key, level, path, context);
      continue;
    }
    if (!isRecord(child)) continue;
    const childLevel =
      level === CARD_LEVEL && key === DEFINITION_LEVEL
        ? DEFINITION_LEVEL
        : undefined;
    walkRecord(child, childLevel, joinPath(path, key), context);
  }
}

function walkEntries(
  entries: readonly unknown[],
  key: string,
  level: string | undefined,
  path: string,
  context: WalkContext,
): void {
  for (const [index, entry] of entries.entries()) {
    if (!isRecord(entry)) continue;
    const childLevel =
      level === CARD_LEVEL && context.legalCollections.has(key)
        ? key
        : undefined;
    walkRecord(entry, childLevel, joinPath(path, `${key}[${index}]`), context);
  }
}

function deriveAuthoringPairs(
  parsed: Readonly<Record<string, CardRecord>>,
  legalCollections: ReadonlySet<string>,
): DerivedAuthoring {
  const context: WalkContext = {
    legalCollections,
    seen: new Set<string>(),
    unreachableSeen: new Set<string>(),
    pairs: [],
    unreachable: [],
    cardPath: '',
  };
  for (const [cardPath, card] of Object.entries(parsed)) {
    context.cardPath = cardPath;
    walkRecord(card, CARD_LEVEL, '', context);
  }
  return { pairs: context.pairs, unreachable: context.unreachable };
}

// A conforming probe card that places the given key as a direct key of the
// given artefact level, outside any `authoring:` block. Every other key is
// legal, so the stray-key finding is the only finding the probe can raise.
function probeCardText(name: string, level: string): string {
  if (level === CARD_LEVEL) {
    return [
      `kind: ${PROBE_NPC_KIND}`,
      `areaId: ${PROBE_AREA_ID}`,
      `status: ${PROBE_STATUS}`,
      `${name}: ${PROBE_VALUE}`,
      '',
    ].join('\n');
  }
  if (level === DEFINITION_LEVEL) {
    return [
      `kind: ${PROBE_AREA_KIND}`,
      `areaId: ${PROBE_AREA_ID}`,
      `status: ${PROBE_STATUS}`,
      'definition:',
      `  id: ${PROBE_AREA_ID}`,
      `  ${name}: ${PROBE_VALUE}`,
      '',
    ].join('\n');
  }
  return [
    `kind: ${PROBE_NPC_KIND}`,
    `areaId: ${PROBE_AREA_ID}`,
    `status: ${PROBE_STATUS}`,
    `${level}:`,
    '  - id: probe-entry',
    `    ${name}: ${PROBE_VALUE}`,
    '',
  ].join('\n');
}

function probeFindings(name: string, level: string): readonly Finding[] {
  const result = parseCardSet({
    files: [{ path: PROBE_PATH, text: probeCardText(name, level) }],
  });
  return result.findings;
}

// A word-boundary match, so the name `note` does not match a message about
// `notes` and the name `spec` does not match a message about `specCheck`.
function wordPattern(name: string): RegExp {
  const escaped = name.replaceAll(/[.*+?^${}()|[\]\\]/gu, String.raw`\$&`);
  return new RegExp(String.raw`\b${escaped}\b`, 'iu');
}

// The reason the probe is not enforced, or undefined when it is. A stray
// authoring key must raise exactly one finding, on the shape gate, naming the
// key and stating that it must live inside an authoring block.
function enforcementFailure(
  name: string,
  findings: readonly Finding[],
): string | undefined {
  if (findings.length !== 1) {
    return `expected exactly one finding, got ${findings.length}`;
  }
  const [finding] = findings;
  if (finding?.gate !== SHAPE_GATE) {
    return `expected the ${SHAPE_GATE} gate, got '${String(finding?.gate)}'`;
  }
  const message = finding?.message ?? '';
  if (!wordPattern(name).test(message)) {
    return `the message does not name the key: ${message}`;
  }
  if (!/authoring/iu.test(message) || !/block/iu.test(message)) {
    return `the message does not say the key must live inside an authoring block: ${message}`;
  }
  return undefined;
}

// One stray authoring key: exactly one finding, on the shape gate, on the
// card path, naming the offending entry and the offending key.
function expectOneStrayKeyFinding(
  findings: readonly Finding[],
  expected: {
    readonly path: string;
    readonly entry: string;
    readonly key: string;
  },
): void {
  expect(
    findings,
    `the stray ${expected.key} key must raise exactly one finding`,
  ).toHaveLength(1);
  const [finding] = findings;
  expect(
    finding?.gate,
    'a stray authoring key is reported on the shape gate',
  ).toBe(SHAPE_GATE);
  expect(
    finding?.path,
    'the finding must carry the path of the offending card',
  ).toBe(expected.path);
  expect(
    finding?.entry,
    'the finding must carry the ID of the offending entry',
  ).toBe(expected.entry);
  const message = finding?.message ?? '';
  expect(
    wordPattern(expected.key).test(message),
    'the finding must name the offending authoring key',
  ).toBe(true);
  expect(
    /authoring/iu.test(message) && /block/iu.test(message),
    'the finding must state that the key belongs in an authoring block',
  ).toBe(true);
}

describe('authoring key coverage (content-toolchain.md §2 D4, §4; npcs.md §8; shared-rules.md §5)', () => {
  it('AKP-04: an authoring-only key on a definition record is a shape finding', () => {
    const result = parseCardSet({
      files: [{ path: PROBE_PATH, text: STRAY_DEFINITION_CARD }],
    });

    expectOneStrayKeyFinding(result.findings, {
      path: PROBE_PATH,
      // The `entry` convention — the offending artefact's own id — is an
      // internal convention of the finding shape, not a rule the documents
      // state.
      entry: PROBE_AREA_DEFINITION_ID,
      key: 'pillar',
    });
    expect(
      result.parsed[PROBE_PATH],
      'a reported stray key must not stop the card from parsing',
    ).toBeDefined();
  });

  it('AKP-05: the shipped definition authoring block raises no finding', () => {
    const result = parseCardSet(zone1CardSet());

    expect(
      result.findings,
      'the shipped card set must parse with no finding, so reaching the definition record adds no false positive',
    ).toEqual([]);

    // The guard rail must not pass vacuously: the shipped set really does
    // carry an `authoring:` block on a `definition:` record.
    const definitionAuthoringKeys = Object.values(result.parsed).flatMap(
      (card) => {
        const definition = card['definition'];
        if (!isRecord(definition)) return [];
        const authoring = definition['authoring'];
        return isRecord(authoring) ? Object.keys(authoring) : [];
      },
    );
    expect(
      definitionAuthoringKeys,
      'the shipped set must carry a definition authoring block for this guard rail to mean anything',
    ).toContain('pillar');
  });

  it('AKP-06: every shipped authoring-block key name is enforced', () => {
    const parsed = parseCardSet(zone1CardSet()).parsed;
    const cards = Object.values(parsed);
    const legalCollections = legalCollectionNames(cards);
    const { pairs, unreachable } = deriveAuthoringPairs(
      parsed,
      legalCollections,
    );

    expect(
      new Set(pairs.map((pair) => pair.name)).size,
      'the shipped cards must contribute authoring-block key names to derive',
    ).toBeGreaterThan(0);
    expect(
      pairs.length,
      'the shipped cards must contribute authoring-block key names to derive',
    ).toBeGreaterThan(0);
    expect(
      unreachable,
      "an authoring block on a shipped card sits on an artefact the walk does not visit, so the key it carries cannot be enforced: the walk reaches only the card record, a card's definition record and one level of collection entries. Move that authoring block onto one of those artefact levels, or extend the walk deliberately; extending the walk would also start flagging runtime fields such as the reason field of an effect array. Each listed entry names the card path and the authoring-block path it came from.",
    ).toEqual([]);

    const failures: string[] = [];
    const exempted: string[] = [];
    for (const pair of pairs) {
      const findings = probeFindings(pair.name, pair.level);
      if (legalCollections.has(pair.name)) {
        exempted.push(pair.name);
        if (findings.length > 0) {
          failures.push(
            `${pair.name} at ${pair.level}: a legal card-level collection name raised ${findings.length} finding(s)`,
          );
        }
        continue;
      }
      const failure = enforcementFailure(pair.name, findings);
      if (failure !== undefined) {
        failures.push(`${pair.name} at ${pair.level}: ${failure}`);
      }
    }

    expect(
      failures,
      'every derived authoring-block key name must raise exactly one shape finding when it appears as a stray key at the level where it is used',
    ).toEqual([]);
    expect(
      [...new Set(exempted)],
      'the tolerated derived names are pinned to a deliberate tripwire, not to the derived mechanism: a second legal card-level collection name becoming an authoring-block key fails this assertion on purpose, so the remedy is to extend the pinned list rather than to change the implementation',
    ).toEqual(['topics']);

    // Production's collection list is module-private, so the test cannot
    // compare it with the derived one; instead every derived legal
    // card-level collection name must be reachable by the walk. A collection
    // added to the shipped set without being added to the walk would
    // otherwise let its entries escape the stray-key check silently.
    const probeKey = pairs.find(
      (pair) => !legalCollections.has(pair.name),
    )?.name;
    expect(
      probeKey,
      'the derived pairs must contribute a key name that is not a legal card-level collection name, so the collection probes have an authoring-only key to place',
    ).toBeDefined();
    const collectionFailures: string[] = [];
    if (probeKey !== undefined) {
      for (const collection of legalCollections) {
        const findings = probeFindings(probeKey, collection);
        const failure = enforcementFailure(probeKey, findings);
        if (failure !== undefined) {
          collectionFailures.push(`${collection}: ${failure}`);
        }
      }
    }
    expect(
      collectionFailures,
      'every derived legal card-level collection name must be reachable by the walk, so a collection added to the shipped set without being added to the walk cannot escape the stray-key check silently',
    ).toEqual([]);
  });

  it('AKP-07: a reason nested in an effect array raises no stray-key finding', () => {
    const quiz = parseCardSet({
      files: [{ path: QUIZ_CARD_PATH, text: NESTED_REASON_QUIZ_CARD }],
    });

    expect(
      quiz.findings,
      'a runtime reason nested in a quiz effect array is legal and raises nothing',
    ).toEqual([]);
    expect(
      quiz.parsed[QUIZ_CARD_PATH],
      'the card with a nested runtime reason must still parse',
    ).toBeDefined();

    const hazard = parseCardSet({
      files: [{ path: HAZARD_CARD_PATH, text: NESTED_REASON_HAZARD_CARD }],
    });

    expect(
      hazard.findings,
      'a runtime reason nested in a hazard effect array is legal and raises nothing',
    ).toEqual([]);
    expect(
      hazard.parsed[HAZARD_CARD_PATH],
      'the card with a nested runtime reason must still parse',
    ).toBeDefined();
  });

  it('AKP-08: the documented authoring reason key is enforced', () => {
    const stray = parseCardSet({
      files: [{ path: NPC_CARD_PATH, text: STRAY_REASON_NODE_CARD }],
    });

    expectOneStrayKeyFinding(stray.findings, {
      path: NPC_CARD_PATH,
      entry: 'node-probe',
      key: 'reason',
    });
    expect(
      stray.parsed[NPC_CARD_PATH],
      'a reported stray reason must not stop the card from parsing',
    ).toBeDefined();

    const authored = parseCardSet({
      files: [{ path: NPC_CARD_PATH, text: AUTHORED_REASON_NODE_CARD }],
    });

    expect(
      authored.findings,
      'the documented authoring.reason form on a reserved node is legal and raises nothing',
    ).toEqual([]);
    expect(
      authored.parsed[NPC_CARD_PATH],
      'the card with the documented authoring.reason form must still parse',
    ).toBeDefined();
  });
});
