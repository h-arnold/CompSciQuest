// W7F-07 — authored exit feedback through the in-memory toolchain fixture.
// No real YAML card is read and no generated file is written.
import { describe, expect, it } from 'vitest';
import { normalisedCards } from '../../tools/content/gates/common.ts';
import {
  AREA_ID,
  ROOMS_PATH,
  cardText,
  conformingCardSet,
  findingText,
  generatedFile,
  loadAdapt,
  loadGenerator,
  loadSchema,
  withCard,
  type CardSet,
  type ParseResult,
} from '../fixtures/contentToolchain';
import { W7_AUTHORS_BLOCKED_TEXT } from '../fixtures/wardW7Fixes';

const ROOM_SOURCE_ID = 'room-source';

function cardsWithExitBlock(block: string): CardSet {
  const cards = conformingCardSet();
  const base = cardText(cards, ROOMS_PATH);
  const head = base.slice(0, base.indexOf('rooms:\n'));
  const tail = base.slice(base.indexOf('items:\n'));
  // The original start room stays reachable and links to the source room, so
  // the only possible findings come from the exit field under test.
  const rooms = `rooms:
  - id: room-binary-hall
    title: Binary Hall
    description: >-
      A hall of five type bins.
    exits:
      - direction: east
        to: ${ROOM_SOURCE_ID}
        conditions: []
    score: 0
  - id: room-target
    title: Target Hall
    description: >-
      A deterministic target room.
    exits: []
    score: 0
  - id: ${ROOM_SOURCE_ID}
    title: Source Hall
    description: >-
      A deterministic source room.
${block}
    score: 0

`;
  return withCard(cards, ROOMS_PATH, `${head}${rooms}${tail}`);
}

const AUTHORED_EXIT = `    exits:
      - direction: east
        to: room-target
        blockedText: >-
          ${W7_AUTHORS_BLOCKED_TEXT}
        conditions:
          - { kind: flag-set, flag: tutorial-complete }
`;

const EXIT_WITHOUT_FEEDBACK = `    exits:
      - direction: east
        to: room-target
        conditions:
          - { kind: flag-set, flag: tutorial-complete }
`;

function parsedExit(result: ParseResult): Record<string, unknown> {
  const rooms = result.parsed[ROOMS_PATH]?.['rooms'];
  expect(Array.isArray(rooms), 'rooms.yaml must parse to an array').toBe(true);
  const source = (rooms as readonly Record<string, unknown>[]).find(
    (room) => room['id'] === ROOM_SOURCE_ID,
  );
  expect(source).toBeDefined();
  const exits = source?.['exits'];
  expect(Array.isArray(exits)).toBe(true);
  return (exits as readonly Record<string, unknown>[])[0] ?? {};
}

function sourceRoomLine(text: string): string {
  const line = text
    .split('\n')
    .find((candidate) => candidate.includes(`"id":"${ROOM_SOURCE_ID}"`));
  expect(
    line,
    `generated room ${ROOM_SOURCE_ID} must be emitted`,
  ).toBeDefined();
  return line ?? '';
}

describe('W7 authored exit feedback (assistance-ward.md §10)', () => {
  it('W7F-07: an authored blockedText exit has no shape finding', async () => {
    const { parseCardSet } = await loadSchema();

    const result = parseCardSet(cardsWithExitBlock(AUTHORED_EXIT));

    expect(result.findings).toEqual([]);
    expect(parsedExit(result)['blockedText']).toBe(W7_AUTHORS_BLOCKED_TEXT);
    expect(AREA_ID).toBe('1-2-1-data-representation');
  });

  it('W7F-07: the canonical bundle and generated room carry blockedText verbatim', async () => {
    const { parseCardSet } = await loadSchema();
    const { bundleOf } = await loadAdapt();
    const { generateContent } = await loadGenerator();
    const cards = cardsWithExitBlock(AUTHORED_EXIT);
    const parsed = parseCardSet(cards);
    expect(parsed.findings).toEqual([]);
    const normalised = normalisedCards({
      cards: Object.entries(parsed.parsed).map(([path, data]) => ({
        path,
        data,
      })),
    });

    const bundle = bundleOf(normalised);
    const exit = bundle.rooms.getById(ROOM_SOURCE_ID)?.exits[0];
    expect(exit).toBeDefined();
    expect(exit).toHaveProperty('blockedText', W7_AUTHORS_BLOCKED_TEXT);

    const generated = generateContent(normalised);
    expect(generated.findings).toEqual([]);
    expect(generated.ok).toBe(true);
    const roomsText = generatedFile(
      generated.files,
      'src/content/authored/rooms.ts',
    );
    expect(sourceRoomLine(roomsText)).toContain(
      `"blockedText":${JSON.stringify(W7_AUTHORS_BLOCKED_TEXT)}`,
    );
  });

  it('W7F-07: an omitted blockedText is not materialised as undefined or null', async () => {
    const { parseCardSet } = await loadSchema();
    const { bundleOf } = await loadAdapt();
    const { generateContent } = await loadGenerator();
    const parsed = parseCardSet(cardsWithExitBlock(EXIT_WITHOUT_FEEDBACK));
    expect(parsed.findings).toEqual([]);
    expect(parsedExit(parsed)).not.toHaveProperty('blockedText');
    const normalised = normalisedCards({
      cards: Object.entries(parsed.parsed).map(([path, data]) => ({
        path,
        data,
      })),
    });

    const bundle = bundleOf(normalised);
    const exit = bundle.rooms.getById(ROOM_SOURCE_ID)?.exits[0];
    expect(exit).toBeDefined();
    expect(exit).not.toHaveProperty('blockedText');

    const generated = generateContent(normalised);
    expect(generated.findings).toEqual([]);
    const roomsText = generatedFile(
      generated.files,
      'src/content/authored/rooms.ts',
    );
    const line = sourceRoomLine(roomsText);
    expect(line).not.toContain('blockedText');
    expect(line).not.toMatch(/undefined|null/iu);
  });

  it('W7F-07: a blank blockedText is rejected as a shape finding', async () => {
    const { parseCardSet } = await loadSchema();
    const blank = AUTHORED_EXIT.replace(
      `        blockedText: >-\n          ${W7_AUTHORS_BLOCKED_TEXT}\n`,
      '        blockedText: ""\n',
    );
    expect(blank).toContain('blockedText: ""');

    const result = parseCardSet(cardsWithExitBlock(blank));

    const message = findingText(result.findings).toLowerCase();
    expect(message).toContain('blockedtext');
    expect(message).toMatch(/blank|empty|omit/u);
  });
});
