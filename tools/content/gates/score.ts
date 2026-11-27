// score-content gate: scores, the eight SpecTopic fields, budgets and area
// starts.

import type { Finding, ParsedCardSet } from '../contracts.ts';
import {
  auditedAreaLikes,
  asNumber,
  asText,
  collection,
  finding,
  type CardEntry,
} from './common.ts';

const TOPIC_FIELDS: readonly string[] = [
  'id',
  'title',
  'specReference',
  'codeLocation',
  'status',
  'evidence',
  'roomIds',
  'maxScore',
];

function scoreOf(kind: string, item: CardEntry, found: Finding[]): number {
  const score = asNumber(item.data['score']);
  if (Number.isSafeInteger(score) && score >= 0) return score;
  found.push(
    finding(
      item.path,
      item.entry,
      `${kind} '${item.entry}' declares an invalid score ${String(item.data['score'])}`,
      'score-content',
    ),
  );
  return 0;
}

function topicFindings(
  topic: CardEntry,
  roomScores: ReadonlyMap<string, number>,
  puzzles: readonly CardEntry[],
  quizzes: readonly CardEntry[],
): readonly Finding[] {
  const id = asText(topic.data['id']);
  const found: Finding[] = TOPIC_FIELDS.filter(
    (field) => !Object.hasOwn(topic.data, field),
  ).map((field) =>
    finding(
      topic.path,
      id,
      `spec topic is missing the ${field} field`,
      'score-content',
    ),
  );
  if (asText(topic.data['evidence']).trim().length === 0) {
    found.push(
      finding(
        topic.path,
        id,
        `spec topic '${id}' has no evidence note`,
        'score-content',
      ),
    );
  }
  const rooms = Array.isArray(topic.data['roomIds'])
    ? topic.data['roomIds']
    : [];
  let total = rooms.reduce(
    (sum, roomId) => sum + (roomScores.get(asText(roomId)) ?? 0),
    0,
  );
  for (const puzzle of puzzles) {
    if (asText(puzzle.data['topicId']) === id)
      total += asNumber(puzzle.data['score']);
  }
  for (const quiz of quizzes) {
    if (asText(quiz.data['topicId']) === id)
      total += asNumber(quiz.data['score']);
  }
  const maxScore = asNumber(topic.data['maxScore']);
  if (Number.isSafeInteger(maxScore) && total > maxScore) {
    found.push(
      finding(
        topic.path,
        id,
        `spec topic '${id}' score total ${String(total)} exceeds maxScore ${String(maxScore)}`,
        'score-content',
      ),
    );
  }
  return found;
}

function startFindings(
  cards: ParsedCardSet,
  roomIds: ReadonlySet<string>,
): readonly Finding[] {
  return auditedAreaLikes(cards).flatMap((area) => {
    const id = asText(area.data['startRoomId']);
    return roomIds.size > 0 && !roomIds.has(id)
      ? [
          finding(
            area.path,
            area.entry,
            `area '${area.entry}' declares an invalid startRoomId '${id}'`,
            'score-content',
          ),
        ]
      : [];
  });
}

export function checkScore(cards: ParsedCardSet): readonly Finding[] {
  const rooms = collection(cards, 'rooms');
  const puzzles = collection(cards, 'puzzles');
  const quizzes = collection(cards, 'quizzes');
  const found: Finding[] = [];
  const roomScores = new Map(
    rooms.map(
      (room) =>
        [asText(room.data['id']), scoreOf('Room', room, found)] as const,
    ),
  );
  for (const puzzle of puzzles) scoreOf('Puzzle', puzzle, found);
  for (const quiz of quizzes) scoreOf('Quiz', quiz, found);
  const topics = collection(cards, 'topics');
  return [
    ...found,
    ...topics.flatMap((topic) =>
      topicFindings(topic, roomScores, puzzles, quizzes),
    ),
    ...startFindings(cards, new Set(roomScores.keys())),
  ];
}
