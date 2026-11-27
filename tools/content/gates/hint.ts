// hint-content gate (content-rules.md §7, §4.7, H2/H3): ladder, unlock keys,
// targets and the zero-default penalty.

import type { Finding, ParsedCardSet } from '../contracts.ts';
import {
  asNumber,
  asObjectArray,
  asRecord,
  asText,
  collection,
  finding,
  idsOf,
  stringList,
  type CardEntry,
} from './common.ts';

const UNLOCK_PREFIXES: readonly string[] = [
  'failed-attempts:',
  'hints-shown:',
  'turns-since:',
];
const ANSWER_PATTERN = /the answer|answer is|correct option|correct answer/u;

function levelFindings(
  hint: CardEntry,
  levels: readonly Record<string, unknown>[],
): readonly Finding[] {
  return levels.flatMap((level, index) => {
    const found: Finding[] = [];
    const number = asNumber(level['level']);
    if (!Number.isSafeInteger(number) || number !== index + 1) {
      found.push(
        finding(
          hint.path,
          hint.entry,
          `hint levels must ascend from 1 (level ${String(number)})`,
          'hint-content',
        ),
      );
    }
    const unlock = asRecord(level['unlock']);
    const key = asText(unlock?.['key']);
    const hasValidKey = UNLOCK_PREFIXES.some(
      (prefix) => key.startsWith(prefix) && key.length > prefix.length,
    );
    if (!hasValidKey) {
      found.push(
        finding(
          hint.path,
          hint.entry,
          `unlock key '${key}' is not an agreed counter key`,
          'hint-content',
        ),
      );
    }
    if (ANSWER_PATTERN.test(asText(level['text']).toLowerCase())) {
      found.push(
        finding(
          hint.path,
          hint.entry,
          'a hint level must not reveal the answer',
          'hint-content',
        ),
      );
    }
    return found;
  });
}

function ladderFindings(hint: CardEntry): readonly Finding[] {
  const levels = asObjectArray(hint.data['levels']);
  const count =
    levels.length < 2 || levels.length > 4
      ? [
          finding(
            hint.path,
            hint.entry,
            `expected 2–4 hint levels, found ${String(levels.length)}`,
            'hint-content',
          ),
        ]
      : [];
  return [...count, ...levelFindings(hint, levels)];
}

function targetFindings(
  hint: CardEntry,
  targets: ReadonlySet<string>,
): readonly Finding[] {
  const listed = stringList(hint.data['targets']);
  const missing =
    targets.size === 0 ? listed : listed.filter((id) => !targets.has(id));
  return missing.map((id) =>
    finding(
      hint.path,
      hint.entry,
      `hint target '${id}' does not exist`,
      'hint-content',
    ),
  );
}

function penaltyFindings(hint: CardEntry): readonly Finding[] {
  const penalty = hint.data['scorePenalty'];
  if (penalty === undefined) return [];
  const value = asNumber(penalty);
  return value === 0 && Number.isSafeInteger(value)
    ? []
    : [
        finding(
          hint.path,
          hint.entry,
          'scorePenalty must default to zero',
          'hint-content',
        ),
      ];
}

export function checkHint(cards: ParsedCardSet): readonly Finding[] {
  const targets = new Set([
    ...idsOf(collection(cards, 'puzzles')),
    ...idsOf(collection(cards, 'quizzes')),
    ...idsOf(collection(cards, 'topics')),
    ...idsOf(collection(cards, 'rooms')),
  ]);
  return collection(cards, 'hintSequences').flatMap((hint) => [
    ...ladderFindings(hint),
    ...targetFindings(hint, targets),
    ...penaltyFindings(hint),
  ]);
}
