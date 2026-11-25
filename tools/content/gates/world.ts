// world-graph gate (content-rules.md §7, §8; application-and-ui.md §3.3):
// declarations, ID-based starts, reachability and covered-topic completion.

import type { Finding, ParsedCardSet } from '../contracts.ts';
import {
  allEffects,
  areaLikes as areaLikesOf,
  auditedAreaLikes,
  asObjectArray,
  asText,
  collection,
  finding,
  idsOf,
  type CardEntry,
} from './common.ts';

type AreaLike = CardEntry;

// A world may be declared only once across the whole card set, by the area
// that owns its startAreaId (content-toolchain.md §2, content-rules.md §7).
function duplicateWorlds(cards: ParsedCardSet): readonly Finding[] {
  const seen = new Set<string>();
  return collection(cards, 'worlds').flatMap((world) => {
    const id = asText(world.data['id']);
    if (id.length === 0) return [];
    if (seen.has(id)) {
      return [
        finding(
          world.path,
          id,
          `World '${id}' is declared more than once across the card set`,
          'world-graph',
        ),
      ];
    }
    seen.add(id);
    return [];
  });
}

function ownershipFindings(
  worlds: readonly CardEntry[],
  areas: readonly AreaLike[],
): readonly Finding[] {
  return worlds.flatMap((world) => {
    const startAreaId = asText(world.data['startAreaId']);
    if (startAreaId.length === 0) return [];
    const owner = areas.find((area) => asText(area.data['id']) === startAreaId);
    return owner === undefined || owner.path !== world.path
      ? [
          finding(
            world.path,
            world.entry,
            `World '${asText(world.data['id'])}' must be declared by the area '${startAreaId}' named by startAreaId`,
            'world-graph',
          ),
        ]
      : [];
  });
}

function declarationFindings(
  areaLikes: readonly AreaLike[],
  worlds: readonly CardEntry[],
  areas: readonly AreaLike[],
): readonly Finding[] {
  const worldIds = idsOf(worlds);
  return areaLikes.flatMap((area) => {
    const worldId = asText(area.data['worldId']);
    if (worldId.length === 0) return [];
    const isUndeclared =
      worldIds.size === 0 ? areas.length > 0 : !worldIds.has(worldId);
    return isUndeclared
      ? [
          finding(
            area.path,
            area.entry,
            `World '${worldId}' is not declared`,
            'world-graph',
          ),
        ]
      : [];
  });
}

function startFindings(
  worlds: readonly CardEntry[],
  areaLikes: readonly AreaLike[],
  roomIds: ReadonlySet<string>,
): readonly Finding[] {
  return worlds.flatMap((world) => {
    const startAreaId = asText(world.data['startAreaId']);
    const start = areaLikes.find(
      (area) => asText(area.data['id']) === startAreaId,
    );
    if (start === undefined) {
      return [
        finding(
          world.path,
          world.entry,
          `startAreaId '${startAreaId}' does not name an area`,
          'world-graph',
        ),
      ];
    }
    const startRoomId = asText(start.data['startRoomId']);
    return roomIds.size > 0 && !roomIds.has(startRoomId)
      ? [
          finding(
            start.path,
            start.entry,
            `startRoomId '${startRoomId}' does not name a room`,
            'world-graph',
          ),
        ]
      : [];
  });
}

function reachableRooms(
  startRoomId: string,
  rooms: readonly CardEntry[],
): ReadonlySet<string> {
  const byId = new Map(
    rooms.map((room) => [asText(room.data['id']), room.data] as const),
  );
  const seen = new Set<string>();
  const visit = (id: string): void => {
    if (id.length === 0 || seen.has(id)) return;
    seen.add(id);
    const room = byId.get(id);
    if (room === undefined) return;
    const exits = asObjectArray(room['exits']);
    for (const exit of exits) visit(asText(exit['targetRoomId']));
  };
  visit(startRoomId);
  return seen;
}

function reachabilityFindings(
  areas: readonly AreaLike[],
  rooms: readonly CardEntry[],
  roomIds: ReadonlySet<string>,
): readonly Finding[] {
  const reachable = new Set<string>();
  const starts = areas.map((area) => asText(area.data['startRoomId']));
  for (const start of starts) {
    for (const id of reachableRooms(start, rooms)) reachable.add(id);
  }
  return rooms.flatMap((room) => {
    const id = asText(room.data['id']);
    return roomIds.size > 0 && !reachable.has(id)
      ? [
          finding(
            room.path,
            id,
            `Room '${id}' is unreachable from its start`,
            'world-graph',
          ),
        ]
      : [];
  });
}

function completionFindings(cards: ParsedCardSet): readonly Finding[] {
  const completions = new Set(
    allEffects(cards)
      .filter((effect) => asText(effect['kind']) === 'complete-topic')
      .map((effect) => asText(effect['topicId'])),
  );
  return collection(cards, 'topics').flatMap((topic) => {
    const id = asText(topic.data['id']);
    const isCovered = asText(topic.data['status']) === 'covered';
    const hasEvidence = asText(topic.data['evidence']).trim().length > 0;
    return isCovered && hasEvidence && !completions.has(id)
      ? [
          finding(
            topic.path,
            id,
            `Covered topic '${id}' has no completion source on a path to game-won`,
            'world-graph',
          ),
        ]
      : [];
  });
}

export function checkWorld(cards: ParsedCardSet): readonly Finding[] {
  const areas = collection(cards, 'areas');
  const areaLikes: readonly AreaLike[] = areaLikesOf(cards);
  const worlds = collection(cards, 'worlds');
  const rooms = collection(cards, 'rooms');
  const roomIds = idsOf(rooms);
  // Reachability and covered-topic completion are whole-graph gates
  // (content-rules.md §7 `world-graph`). A card set is a whole graph when it
  // declares a `world` or uses the older `areas` collection; a spec-topics-only
  // fragment (CT-TOPIC-* fixtures) declares neither and is not audited for
  // completion. Completion is never gated on a completion source or on a quiz /
  // puzzle artefact existing: the missing completion source is exactly the
  // defect this gate exists to report.
  const audited = auditedAreaLikes(cards);
  const reachability =
    audited.length > 0 ? reachabilityFindings(audited, rooms, roomIds) : [];
  const shouldAuditCompletion = areas.length > 0 || worlds.length > 0;
  const completion = shouldAuditCompletion ? completionFindings(cards) : [];
  return [
    ...duplicateWorlds(cards),
    ...ownershipFindings(worlds, audited),
    ...declarationFindings(areaLikes, worlds, areas),
    ...startFindings(worlds, audited, roomIds),
    ...reachability,
    ...completion,
  ];
}
