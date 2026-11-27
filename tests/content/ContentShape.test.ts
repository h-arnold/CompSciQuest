// Red tests for the YAML authoring shape contract. All cards are declared
// in-memory strings; no YAML card is read from disk and no real I/O is used.
import { describe, expect, it } from 'vitest';
import {
  AREA_ID,
  ROOMS_PATH,
  cardText,
  conformingCardSet,
  expectSameMembers,
  findingText,
  loadSchema,
  loadValidation,
  withCard,
  type CardSet,
  type Finding,
  type ParseResult,
  type ValidateResult,
} from '../fixtures/contentToolchain';

interface ParsedRoom {
  readonly id: string;
  readonly description: string;
}

function roomDescriptions(
  result: ParseResult,
): Readonly<Record<string, string>> {
  const card = result.parsed[ROOMS_PATH];
  expect(
    card,
    'rooms.yaml must be present in the parsed card set',
  ).toBeDefined();
  const rooms = card?.['rooms'];
  expect(
    Array.isArray(rooms),
    'the parsed rooms.yaml must expose a rooms array',
  ).toBe(true);
  const entries = (rooms ?? []) as readonly ParsedRoom[];
  return Object.fromEntries(entries.map((room) => [room.id, room.description]));
}

describe('YAML card shapes (content-toolchain.md §2, §4)', () => {
  it('CT-SHAPE-01: one conforming card of each kind parses with no finding', async () => {
    const { parseCardSet } = await loadSchema();

    const result = parseCardSet(conformingCardSet());

    expect(
      result.findings,
      'conforming rooms, npcs, quizzes, puzzles, hazards, hints and spec-topics cards must all parse with no finding',
    ).toEqual([]);
    expectSameMembers(Object.keys(result.parsed), [
      ROOMS_PATH,
      `${AREA_ID}/npcs.yaml`,
      `${AREA_ID}/quizzes.yaml`,
      `${AREA_ID}/puzzles.yaml`,
      `${AREA_ID}/hazards.yaml`,
      `${AREA_ID}/hints.yaml`,
      'spec-topics.yaml',
    ]);
  });

  it('CT-SHAPE-03: omitted optional fields parse while an explicit null is reported', async () => {
    const { parseCardSet } = await loadSchema();
    const cards = conformingCardSet();

    // The declared rooms card already omits the optional entryEffects field.
    const omitted = parseCardSet(cards);
    expect(
      omitted.findings,
      'omitting an optional runtime field must not produce a finding',
    ).toEqual([]);

    const nulledText = cardText(cards, ROOMS_PATH).replace(
      '    score: 0',
      '    score: 0\n    entryEffects: null',
    );
    expect(nulledText).toContain('entryEffects: null');
    const nulled = parseCardSet(withCard(cards, ROOMS_PATH, nulledText));

    expect(
      nulled.findings.length,
      'an optional field set to null must be reported, not silently passed through',
    ).toBeGreaterThan(0);
    const reported = findingText(nulled.findings).toLowerCase();
    expect(reported).toContain('entryeffects');
    expect(
      reported,
      'the finding must direct authors to omit optional fields rather than set them to null',
    ).toContain('omit');
  });

  it('CT-SHAPE-04: folded and literal block scalars keep the WJEC email literal', async () => {
    const { parseCardSet } = await loadSchema();
    const cards = conformingCardSet();
    const base = cardText(cards, ROOMS_PATH);
    const head = base.slice(0, base.indexOf('rooms:\n'));
    const rooms = `rooms:
  - id: room-folded
    title: Folded Hall
    description: >-
      Five type bins hold samples:
      email computer.science@wjec.co.uk.
    exits: []
    score: 0
  - id: room-literal
    title: Literal Hall
    description: |-
      Five type bins hold samples:
      email computer.science@wjec.co.uk.
    exits: []
    score: 0
`;
    const result = parseCardSet(withCard(cards, ROOMS_PATH, `${head}${rooms}`));

    expect(result.findings).toEqual([]);
    const descriptions = roomDescriptions(result);
    expect(descriptions['room-folded']).toBe(
      'Five type bins hold samples: email computer.science@wjec.co.uk.',
    );
    expect(descriptions['room-literal']).toBe(
      'Five type bins hold samples:\nemail computer.science@wjec.co.uk.',
    );
    for (const description of Object.values(descriptions)) {
      expect(description).toContain('computer.science@wjec.co.uk');
    }
  });
});

// C-CONTENT-18: the optional item `refusalText` is an authoring-only YAML
// check. The non-blank rule was decided on 2026-11-25. The runtime fallback and
// empty-as-absent behaviour stay with P-TAKE-01 and are not re-asserted here.
const REFUSAL_ITEM_ID = 'item-register-cache';
const INITIAL_ROOM_LINE = '    initialRoom: room-binary-hall';

function cardsWithRefusalText(value: string): CardSet {
  const cards = conformingCardSet();
  const base = cardText(cards, ROOMS_PATH);
  expect(base, 'the fixture item must carry the initialRoom anchor').toContain(
    INITIAL_ROOM_LINE,
  );
  return withCard(
    cards,
    ROOMS_PATH,
    base.replace(
      INITIAL_ROOM_LINE,
      () => `${INITIAL_ROOM_LINE}\n    refusalText: ${value}`,
    ),
  );
}

function refusalFindings(findings: readonly Finding[]): readonly Finding[] {
  return findings.filter((entry) => entry.entry === REFUSAL_ITEM_ID);
}

function expectOneShapeFinding(
  result: ValidateResult,
  messagePattern: RegExp,
): void {
  const forItem = refusalFindings(result.findings);
  expect(
    forItem,
    'exactly one finding must name the offending item ID',
  ).toHaveLength(1);
  expect(
    result.findings,
    'the otherwise-valid card set must produce no unrelated findings',
  ).toHaveLength(1);
  const [offending] = forItem;
  expect(offending?.path).toBe(ROOMS_PATH);
  expect(offending?.gate).toBe('shape');
  expect(offending?.message).toMatch(/refusaltext/iu);
  expect(offending?.message.toLowerCase()).toMatch(messagePattern);
  expect(result.exitCode, 'any finding must fail content:validate').not.toBe(0);
}

describe('C-CONTENT-18: authoring validation of item refusalText', () => {
  it('C-CONTENT-18: absent refusalText produces no finding', async () => {
    const { validateCommand } = await loadValidation();
    const cards = conformingCardSet();
    expect(cardText(cards, ROOMS_PATH)).not.toContain('refusalText');

    const result = validateCommand(cards);

    expect(
      refusalFindings(result.findings),
      'omitting the optional field must not produce a finding',
    ).toEqual([]);
    expect(result.exitCode).toBe(0);
  });

  it('C-CONTENT-18: a non-blank refusalText string is accepted', async () => {
    const { validateCommand } = await loadValidation();

    const result = validateCommand(
      cardsWithRefusalText('The plaque is bolted fast'),
    );

    expect(refusalFindings(result.findings)).toEqual([]);
    expect(result.exitCode).toBe(0);
  });

  it('C-CONTENT-18: authored prose keeps its surrounding whitespace', async () => {
    const { validateCommand } = await loadValidation();

    const result = validateCommand(
      cardsWithRefusalText('"  The plaque is bolted fast  "'),
    );

    expect(
      refusalFindings(result.findings),
      'validation must not require trimming or rewriting authored prose',
    ).toEqual([]);
    expect(result.exitCode).toBe(0);
  });

  it('C-CONTENT-18: an empty refusalText string is rejected', async () => {
    const { validateCommand } = await loadValidation();

    const result = validateCommand(cardsWithRefusalText('""'));

    expectOneShapeFinding(result, /blank|omit|empty/u);
  });

  it('C-CONTENT-18: a whitespace-only refusalText string is rejected', async () => {
    const { validateCommand } = await loadValidation();

    const result = validateCommand(cardsWithRefusalText('"   "'));

    expectOneShapeFinding(result, /blank|omit|empty/u);
  });

  it.each([
    ['a number', '42'],
    ['a boolean', 'true'],
    ['an array', '[fast, bolted]'],
    ['an object', '{ text: bolted }'],
  ] as const)(
    'C-CONTENT-18: %s refusalText is rejected',
    async (_variant, value) => {
      const { validateCommand } = await loadValidation();

      const result = validateCommand(cardsWithRefusalText(value));

      expectOneShapeFinding(result, /string/u);
    },
  );

  it('C-CONTENT-18: null refusalText has one finding and no duplicate', async () => {
    const { validateCommand } = await loadValidation();

    const result = validateCommand(cardsWithRefusalText('null'));

    expectOneShapeFinding(result, /omit|null/u);
  });
});
