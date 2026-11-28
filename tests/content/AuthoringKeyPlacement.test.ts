// Red tests for the authoring-key placement rule in the YAML content schema
// (content-toolchain.md §2 D4 and §4; npcs.md §8). An authoring-only key is
// legal only inside an `authoring:` block; outside one it is a shape finding.
// Every card below is an in-memory string literal: no card is read from disk
// and no wall clock, randomness, network or browser storage is touched.
import { describe, expect, it } from 'vitest';
import { parseCardSet } from '../../tools/content/schema.ts';
import { zone1CardSet } from '../fixtures/zone1';

type Finding = ReturnType<typeof parseCardSet>['findings'][number];

const ACTOR_CARD_PATH = 'acceptance-area/npcs.yaml';
const TOPIC_CARD_PATH = 'acceptance-area/topics.yaml';

// A voice sample block sitting directly on the actor, outside any authoring
// block (npcs.md §8 documents it as `authoring.voiceSamples`).
const STRAY_ACTOR_CARD = `kind: npc
areaId: acceptance-area
status: draft

actors:
  - id: npc-archivist
    aliases: [archivist, keeper]
    initialStateId: actorstate-ready
    voiceSamples:
      toneMode: clipped-patient
      addressForm: second person present
      sampleLine: The archive is open to scholars.
`;

// A dialogue plan sitting directly on the conversation topic, outside any
// authoring block (npcs.md §8 documents it as `authoring.dialoguePlan`).
const STRAY_TOPIC_CARD = `kind: npc
areaId: acceptance-area
status: draft

conversationTopics:
  - id: topic-fde-explain
    actorId: npc-archivist
    match: { kind: askTell, objectIds: [] }
    responses:
      - >-
        The archive is open to scholars.
    strategy: { kind: once }
    prompt: (You could ask the archivist about the archive.)
    dialoguePlan:
      playerQuestion: Why is the archive open?
      intent: Explain the archive opening hours.
      takeaway: The archive is open to scholars.
`;

// The same two cards with the authoring-only keys inside their authoring
// blocks, which is the legal home of authoring metadata (D4).
const AUTHORED_ACTOR_CARD = `kind: npc
areaId: acceptance-area
status: draft

actors:
  - id: npc-archivist
    aliases: [archivist, keeper]
    initialStateId: actorstate-ready
    authoring:
      role: >-
        Archivist who explains the archive opening hours.
      voiceSamples:
        toneMode: clipped-patient
        addressForm: second person present
        sampleLine: The archive is open to scholars.
`;

const AUTHORED_TOPIC_CARD = `kind: npc
areaId: acceptance-area
status: draft

conversationTopics:
  - id: topic-fde-explain
    actorId: npc-archivist
    match: { kind: askTell, objectIds: [] }
    responses:
      - >-
        The archive is open to scholars.
    strategy: { kind: once }
    prompt: (You could ask the archivist about the archive.)
    authoring:
      note: >-
        Explains the archive opening hours.
      dialoguePlan:
        playerQuestion: Why is the archive open?
        intent: Explain the archive opening hours.
        takeaway: The archive is open to scholars.
`;

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
  expect(finding, 'the stray-key finding must be present').toBeDefined();
  expect(
    finding?.gate,
    'a stray authoring key is reported on the shape gate',
  ).toBe('shape');
  expect(
    finding?.path,
    'the finding must carry the path of the offending card',
  ).toBe(expected.path);
  expect(
    finding?.entry,
    'the finding must carry the ID of the offending entry',
  ).toBe(expected.entry);
  const message = (finding?.message ?? '').toLowerCase();
  expect(
    message,
    'the finding must name the offending authoring key',
  ).toContain(expected.key.toLowerCase());
  expect(
    message,
    'the finding must state that the key belongs in an authoring block',
  ).toContain('authoring');
  expect(
    message,
    'the finding must state that the key belongs in an authoring block',
  ).toContain('block');
}

describe('authoring key placement (content-toolchain.md §2 D4, §4; npcs.md §8)', () => {
  it('AKP-01: an authoring-only key outside an authoring block is a shape finding', () => {
    const actorCard = parseCardSet({
      files: [{ path: ACTOR_CARD_PATH, text: STRAY_ACTOR_CARD }],
    });

    expectOneStrayKeyFinding(actorCard.findings, {
      path: ACTOR_CARD_PATH,
      entry: 'npc-archivist',
      key: 'voiceSamples',
    });
    expect(
      actorCard.parsed[ACTOR_CARD_PATH],
      'a reported stray key must not stop the card from parsing',
    ).toBeDefined();

    const topicCard = parseCardSet({
      files: [{ path: TOPIC_CARD_PATH, text: STRAY_TOPIC_CARD }],
    });

    expectOneStrayKeyFinding(topicCard.findings, {
      path: TOPIC_CARD_PATH,
      entry: 'topic-fde-explain',
      key: 'dialoguePlan',
    });
    expect(
      topicCard.parsed[TOPIC_CARD_PATH],
      'a reported stray key must not stop the card from parsing',
    ).toBeDefined();
  });

  it('AKP-02: the same authoring keys inside an authoring block raise no finding', () => {
    const actorCard = parseCardSet({
      files: [{ path: ACTOR_CARD_PATH, text: AUTHORED_ACTOR_CARD }],
    });

    expect(
      actorCard.findings,
      'an authoring key inside an authoring block is legal and raises nothing',
    ).toEqual([]);
    expect(
      actorCard.parsed[ACTOR_CARD_PATH],
      'the card with an authoring block must still parse',
    ).toBeDefined();

    const topicCard = parseCardSet({
      files: [{ path: TOPIC_CARD_PATH, text: AUTHORED_TOPIC_CARD }],
    });

    expect(
      topicCard.findings,
      'an authoring key inside an authoring block is legal and raises nothing',
    ).toEqual([]);
    expect(
      topicCard.parsed[TOPIC_CARD_PATH],
      'the card with an authoring block must still parse',
    ).toBeDefined();
  });

  it('AKP-03: the shipped card set parses with no authoring-key finding', () => {
    const result = parseCardSet(zone1CardSet());

    expect(
      result.findings,
      'every shipped card under docs/content must parse with no finding',
    ).toEqual([]);
  });
});
