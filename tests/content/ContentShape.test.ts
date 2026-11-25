// Red tests for the YAML authoring shape contract (content-toolchain.md §2 and
// §4; content-rules.md §4.1, D3, V1). All cards are declared in-memory strings;
// no YAML card is read from docs/content and no real I/O is used.
import { describe, expect, it } from 'vitest';
import {
  AREA_ID,
  ROOMS_PATH,
  cardText,
  conformingCardSet,
  expectSameMembers,
  findingText,
  loadSchema,
  withCard,
  type ParseResult,
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
