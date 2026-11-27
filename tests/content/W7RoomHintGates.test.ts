// W7F-14 — room IDs are legal hint ladder targets. Gate functions are called
// on in-memory parsed cards; no npm command, YAML card or generated file is
// touched.
import { describe, expect, it } from 'vitest';
import { checkContentIds } from '../../tools/content/gates/contentIds.ts';
import { checkHint } from '../../tools/content/gates/hint.ts';
import { validateCards } from '../../tools/content/validate.ts';
import {
  HINTS_PATH,
  AREA_ID,
  cardText,
  conformingCardSet,
  findingText,
  loadSchema,
  withCard,
  type CardSet,
} from '../fixtures/contentToolchain';

const ROOM_TARGETS = [
  'room-assistance-records',
  'room-assistance-intake',
  'room-assistance-demonstration',
] as const;

function ladder(roomId: string): string {
  return `  - id: hint-assistance-${roomId.replace('room-assistance-', '')}
    targets: [${roomId}]
    levels:
      - level: 1
        text: >-
          Name the stalled step in this room.
        unlock: { kind: counter-at-least, key: hints-shown:hint-assistance-${roomId.replace('room-assistance-', '')}, value: 0 }
      - level: 2
        text: >-
          Compare what is visible with the earlier demonstration.
        unlock: { kind: counter-at-least, key: hints-shown:hint-assistance-${roomId.replace('room-assistance-', '')}, value: 1 }
`;
}

const ROOM_HINTS_YAML = `kind: hint
areaId: ${AREA_ID}
status: draft
topicIds: [data-types]

hintSequences:
${ROOM_TARGETS.map((roomId) => ladder(roomId)).join('')}  - id: hint-non-room-control
    targets: [data-types, puzzle-sort-types, quiz-data-types]
    levels:
      - level: 1
        text: >-
          Look at the visible label first.
        unlock: { kind: counter-at-least, key: hints-shown:hint-non-room-control, value: 0 }
      - level: 2
        text: >-
          Match the label to the next action.
        unlock: { kind: counter-at-least, key: hints-shown:hint-non-room-control, value: 1 }
`;

function cardsWithRoomHints(
  targets: readonly string[] = ROOM_TARGETS,
): CardSet {
  const cards = conformingCardSet();
  let text = ROOM_HINTS_YAML;
  for (const target of ROOM_TARGETS) {
    text = text.replace(
      target,
      () => targets[ROOM_TARGETS.indexOf(target)] ?? target,
    );
  }
  expect(cardText(cards, HINTS_PATH)).not.toBe(text);
  // Declared rooms are controls: the gates must know these IDs exist.
  const roomsPath = `${AREA_ID}/rooms.yaml`;
  // Keep the declared start room reachable and chain the three fixture rooms
  // from it, so only the hint-target gate is under test.
  const rooms = cardText(cards, roomsPath).replace(
    '    exits: []\n    score: 0',
    `    exits:
      - direction: east
        to: room-assistance-records
        conditions: []
    score: 0
  - id: room-assistance-records
    title: Fixture Records
    description: Fixture only.
    exits:
      - direction: east
        to: room-assistance-intake
        conditions: []
    score: 0
  - id: room-assistance-intake
    title: Fixture Intake
    description: Fixture only.
    exits:
      - direction: east
        to: room-assistance-demonstration
        conditions: []
    score: 0
  - id: room-assistance-demonstration
    title: Fixture Demonstration
    description: Fixture only.
    exits: []
    score: 0`,
  );
  return withCard(withCard(cards, HINTS_PATH, text), roomsPath, rooms);
}

async function parsedCards(cards: CardSet) {
  const { parseCardSet } = await loadSchema();
  const parsed = parseCardSet(cards);
  expect(parsed.findings).toEqual([]);
  return {
    cards: Object.entries(parsed.parsed).map(([path, data]) => ({
      path,
      data,
    })),
  };
}

describe('W7 room hint target gates (content-bible.md §12)', () => {
  it('W7F-14: checkHint and checkContentIds admit declared room targets', async () => {
    const cards = await parsedCards(cardsWithRoomHints());

    expect(checkHint(cards)).toEqual([]);
    expect(checkContentIds(cards, {})).toEqual([]);
  });

  it('W7F-14: validateCards reports no findings for room-targeted ladders', async () => {
    const cards = await parsedCards(cardsWithRoomHints());

    expect(validateCards(cards, {})).toEqual([]);
  });

  it('W7F-14: an undeclared hint target is still rejected by both gates', async () => {
    const unknown: readonly string[] = [
      'room-assistance-unknown',
      ...ROOM_TARGETS.slice(1),
    ];
    const cards = await parsedCards(cardsWithRoomHints(unknown));

    const hintFindings = findingText(checkHint(cards));
    const idFindings = findingText(checkContentIds(cards, {}));

    expect(hintFindings).toContain(
      "hint target 'room-assistance-unknown' does not exist",
    );
    expect(idFindings).toContain(
      "Unknown hint target 'room-assistance-unknown'",
    );
  });
});
