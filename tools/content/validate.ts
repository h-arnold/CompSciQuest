// Content gates. The eight gate IDs are the public contract; findings are
// emitted as path/entry/message/gate.

import type {
  CardSet,
  Finding,
  ParsedCardSet,
  ValidateResult,
  ValidationOptions,
} from './contracts.ts';
import { parseCardSet } from './schema.ts';
import { sharedFindings } from './adapt.ts';
import { finding, normalisedCards } from './gates/common.ts';
import { checkContentIds } from './gates/contentIds.ts';
import { checkQuiz } from './gates/quiz.ts';
import { checkPuzzle } from './gates/puzzle.ts';
import { checkWorld } from './gates/world.ts';
import { checkHint } from './gates/hint.ts';
import { checkHazard } from './gates/hazard.ts';
import { checkNpc } from './gates/npc.ts';
import { checkScore } from './gates/score.ts';

export const GATE_IDS = [
  'content-ids',
  'quiz-content',
  'puzzle-graph',
  'world-graph',
  'hint-content',
  'hazard-content',
  'npc-content',
  'score-content',
] as const;

function uncheckedFindings(
  cards: ParsedCardSet,
  options: ValidationOptions,
): readonly Finding[] {
  return (options.uncheckedClauses ?? []).map((clause) =>
    finding(
      cards.cards[0]?.path ?? '',
      clause,
      `Cannot check clause '${clause}': its source is unavailable; reported as an unverified gap`,
      'content-ids',
    ),
  );
}

export function validateCards(
  cards: ParsedCardSet,
  options: ValidationOptions = {},
): readonly Finding[] {
  // Authoring `to:` exits become canonical `targetRoomId` once, here, before
  // any gate or the shared bundle validator sees them.
  const normalised = normalisedCards(cards);
  return [
    ...checkContentIds(normalised, options),
    ...checkQuiz(normalised),
    ...checkPuzzle(normalised),
    ...checkWorld(normalised),
    ...checkHint(normalised),
    ...checkHazard(normalised),
    ...checkNpc(normalised, options),
    ...checkScore(normalised),
    ...sharedFindings(normalised, options),
    ...uncheckedFindings(normalised, options),
  ];
}

export function validateCommand(
  cards: CardSet,
  options?: ValidationOptions,
): ValidateResult {
  // The content:validate path runs C7 by default; an explicit caller options
  // object still overrides this default.
  const settings = options ?? { topicOverlap: true };
  const parsed = parseCardSet(cards);
  const parsedCards: ParsedCardSet = {
    cards: Object.entries(parsed.parsed).map(([path, data]) => ({
      path,
      data,
    })),
  };
  const findings = [
    ...parsed.findings,
    ...validateCards(parsedCards, settings),
  ];
  return { findings, exitCode: findings.length === 0 ? 0 : 1 };
}
