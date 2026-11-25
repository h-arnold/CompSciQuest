// hazard-content gate (content-rules.md §7, §4.6, H1): telegraphs, shared
// effects only and a declared level start.

import type { Finding, ParsedCardSet } from '../contracts.ts';
import {
  auditedAreaLikes,
  asObjectArray,
  asRecord,
  asText,
  collection,
  EFFECT_KINDS,
  finding,
  idsOf,
  type CardEntry,
} from './common.ts';

function telegraphFinding(hazard: CardEntry): readonly Finding[] {
  const authoring = asRecord(hazard.data['authoring']);
  const telegraph = asText(authoring?.['telegraph']).trim();
  return telegraph.length === 0
    ? [
        finding(
          hazard.path,
          hazard.entry,
          'hazard needs a telegraph clue',
          'hazard-content',
        ),
      ]
    : [];
}

function effectFindings(hazard: CardEntry): readonly Finding[] {
  const effects = asObjectArray(hazard.data['effects']);
  return effects.flatMap((effect) => {
    const kind = asText(effect['kind']);
    if (kind.startsWith('set-puzzle-')) {
      return [
        finding(
          hazard.path,
          hazard.entry,
          `hazard effect '${kind}' (set-puzzle-*) is not allowed`,
          'hazard-content',
        ),
      ];
    }
    return EFFECT_KINDS.has(kind)
      ? []
      : [
          finding(
            hazard.path,
            hazard.entry,
            `unknown effect kind '${kind}'`,
            'hazard-content',
          ),
        ];
  });
}

function startFindings(cards: ParsedCardSet): readonly Finding[] {
  const roomIds = idsOf(collection(cards, 'rooms'));
  if (roomIds.size === 0) return [];
  return auditedAreaLikes(cards).flatMap((area) => {
    const startRoomId = asText(area.data['startRoomId']);
    return startRoomId.length > 0 && !roomIds.has(startRoomId)
      ? [
          finding(
            area.path,
            area.entry,
            `level start '${startRoomId}' is not a declared room`,
            'hazard-content',
          ),
        ]
      : [];
  });
}

export function checkHazard(cards: ParsedCardSet): readonly Finding[] {
  const hazards = collection(cards, 'hazards');
  return [
    ...hazards.flatMap((hazard) => [
      ...telegraphFinding(hazard),
      ...effectFindings(hazard),
    ]),
    ...startFindings(cards),
  ];
}
