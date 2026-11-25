// content-ids gate (content-rules.md §7; content-toolchain.md §2): unique IDs,
// unique aliases, ID prefixes and resolvable references.

import type {
  Finding,
  ParsedCardSet,
  ValidationOptions,
} from '../contracts.ts';
import {
  auditedAreaLikes,
  asArray,
  asObjectArray,
  asText,
  collection,
  coverageIds,
  DIRECTIONS,
  finding,
  idsOf,
  knownTopicIds,
  stringList,
} from './common.ts';

const PREFIXES: Readonly<Record<string, string>> = {
  worlds: 'world-',
  rooms: 'room-',
  items: 'item-',
  actors: 'npc-',
  actorStates: 'actorstate-',
  conversationTopics: 'topic-',
  conversationNodes: 'node-',
  quizzes: 'quiz-',
  questions: 'q-',
  puzzles: 'puzzle-',
  hazards: 'hazard-',
  hintSequences: 'hint-',
};

const COLLECTIONS: readonly string[] = [...Object.keys(PREFIXES), 'areas'];

function repeats(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const repeated = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) repeated.add(value);
    seen.add(value);
  }
  return [...repeated];
}

function duplicateFindings(cards: ParsedCardSet): readonly Finding[] {
  const found: Finding[] = [];
  for (const key of COLLECTIONS) {
    const items = collection(cards, key);
    for (const item of items) {
      const id = asText(item.data['id']);
      if (id.length === 0) continue;
      // A world is declared exactly once across the whole card set
      // (content-toolchain.md §2, content-rules.md §4.2).
      if (items.filter((entry) => asText(entry.data['id']) === id).length > 1) {
        found.push(
          finding(
            item.path,
            id,
            `Duplicate artifact ID '${id}' in ${key}`,
            'content-ids',
          ),
        );
      }
    }
  }
  return found;
}

function aliasFindings(cards: ParsedCardSet): readonly Finding[] {
  const owners = [
    ...collection(cards, 'items'),
    ...collection(cards, 'actors'),
  ];
  const aliases = owners.flatMap((item) =>
    stringList(item.data['aliases']).map((alias) => ({ alias, item })),
  );
  return repeats(aliases.map((entry) => entry.alias)).map((alias) => {
    const owner = aliases.find((entry) => entry.alias === alias)?.item;
    return finding(
      owner?.path ?? '',
      alias,
      `Duplicate object or NPC alias '${alias}'`,
      'content-ids',
    );
  });
}

function prefixProblem(id: string, prefix: string): string | undefined {
  return id.length > 0 && !id.startsWith(prefix)
    ? `ID '${id}' must carry the ${prefix} prefix`
    : undefined;
}

function badPrefix(
  item: { readonly path: string; readonly entry: string },
  id: string,
  prefix: string,
): readonly Finding[] {
  const message = prefixProblem(id, prefix);
  return message === undefined
    ? []
    : [finding(item.path, item.entry, message, 'content-ids')];
}

function prefixFindings(cards: ParsedCardSet): readonly Finding[] {
  const collected = Object.entries(PREFIXES).flatMap(([key, prefix]) =>
    collection(cards, key).flatMap((item) =>
      badPrefix(item, asText(item.data['id']), prefix),
    ),
  );
  const areas = collection(cards, 'areas').flatMap((item) =>
    badPrefix(item, asText(item.data['id']), 'area-'),
  );
  const definitions = cards.cards.flatMap((card) => {
    const definition = asObjectArray([card.data['definition']]);
    return definition.flatMap((data) =>
      badPrefix(
        { path: card.path, entry: asText(data['id']) },
        asText(data['id']),
        'area-',
      ),
    );
  });
  return [...collected, ...areas, ...definitions];
}

function metadataTopicFindings(
  cards: ParsedCardSet,
  known: ReadonlySet<string>,
): readonly Finding[] {
  return cards.cards.flatMap((card) => {
    const item = { path: card.path, entry: asText(card.data['kind']) };
    return stringList(card.data['topicIds']).flatMap((id) =>
      known.has(id)
        ? []
        : [
            finding(
              item.path,
              item.entry,
              `Unknown topic ID '${id}'`,
              'content-ids',
            ),
          ],
    );
  });
}

function entryTopicFindings(
  cards: ParsedCardSet,
  known: ReadonlySet<string>,
): readonly Finding[] {
  return collection(cards, 'rooms').flatMap((room) =>
    stringList(room.data['topicIds']).flatMap((id) =>
      known.has(id)
        ? []
        : [
            finding(
              room.path,
              room.entry,
              `Unknown topic ID '${id}'`,
              'content-ids',
            ),
          ],
    ),
  );
}

function quizTopicFindings(
  cards: ParsedCardSet,
  known: ReadonlySet<string>,
): readonly Finding[] {
  return ['puzzles', 'quizzes'].flatMap((key) =>
    collection(cards, key).flatMap((item) => {
      const id = asText(item.data['topicId']);
      return id.length === 0 || known.has(id)
        ? []
        : [
            finding(
              item.path,
              item.entry,
              `Unknown topic ID '${id}'`,
              'content-ids',
            ),
          ];
    }),
  );
}

function hintTargetFindings(
  cards: ParsedCardSet,
  known: ReadonlySet<string>,
): readonly Finding[] {
  const artefacts = new Set([
    ...known,
    ...idsOf(collection(cards, 'puzzles')),
    ...idsOf(collection(cards, 'quizzes')),
  ]);
  return collection(cards, 'hintSequences').flatMap((hint) =>
    artefacts.size === 0
      ? []
      : stringList(hint.data['targets'])
          .filter((id) => !artefacts.has(id))
          .map((id) =>
            finding(
              hint.path,
              hint.entry,
              `Unknown hint target '${id}'`,
              'content-ids',
            ),
          ),
  );
}

function coverageTopicFindings(
  cards: ParsedCardSet,
  options: ValidationOptions,
): readonly Finding[] {
  const declared = new Set(coverageIds(options));
  return collection(cards, 'topics').flatMap((topic) => {
    const id = asText(topic.data['id']);
    return declared.size > 0 && !declared.has(id)
      ? [
          finding(
            topic.path,
            id,
            `Topic '${id}' has no coverage heading`,
            'content-ids',
          ),
        ]
      : [];
  });
}

function topicFindings(
  cards: ParsedCardSet,
  options: ValidationOptions,
): readonly Finding[] {
  const known = knownTopicIds(cards, options);
  if (known.size === 0) return coverageTopicFindings(cards, options);
  return [
    ...metadataTopicFindings(cards, known),
    ...entryTopicFindings(cards, known),
    ...quizTopicFindings(cards, known),
    ...hintTargetFindings(cards, known),
    ...coverageTopicFindings(cards, options),
  ];
}

function exitFindings(
  cards: ParsedCardSet,
  roomIds: ReadonlySet<string>,
): readonly Finding[] {
  return collection(cards, 'rooms').flatMap((room) => {
    const exits = asObjectArray(room.data['exits']);
    const missing = exits
      .map((exit) => asText(exit['targetRoomId']))
      .filter((id) => roomIds.size > 0 && !roomIds.has(id))
      .map((id) =>
        finding(
          room.path,
          room.entry,
          `Exit target '${id}' is not a declared room`,
          'content-ids',
        ),
      );
    const invalid = exits
      .map((exit) => asText(exit['direction']))
      .filter((direction) => !DIRECTIONS.has(direction))
      .map((direction) =>
        finding(
          room.path,
          room.entry,
          `Invalid exit direction '${direction}'`,
          'content-ids',
        ),
      );
    return [...missing, ...invalid];
  });
}

function movePlayerFindings(
  cards: ParsedCardSet,
  roomIds: ReadonlySet<string>,
): readonly Finding[] {
  return cards.cards.flatMap((card) =>
    asArray(card.data['entryEffects']).flatMap((effect) => {
      const record =
        typeof effect === 'object' && effect !== null
          ? (effect as Record<string, unknown>)
          : {};
      if (asText(record['kind']) !== 'move-player') return [];
      const id = asText(record['roomId']);
      return roomIds.size > 0 && !roomIds.has(id)
        ? [
            finding(
              card.path,
              asText(card.data['kind']),
              `move-player target '${id}' is not a declared room`,
              'content-ids',
            ),
          ]
        : [];
    }),
  );
}

function ownerFindings(
  cards: ParsedCardSet,
  roomIds: ReadonlySet<string>,
): readonly Finding[] {
  const owners = [...collection(cards, 'items'), ...auditedAreaLikes(cards)];
  return owners.flatMap((item) => {
    const id = asText(item.data['initialRoom'] ?? item.data['startRoomId']);
    return roomIds.size > 0 && !roomIds.has(id)
      ? [
          finding(
            item.path,
            item.entry,
            `Room reference '${id}' is not a declared room`,
            'content-ids',
          ),
        ]
      : [];
  });
}

function referenceFindings(cards: ParsedCardSet): readonly Finding[] {
  const roomIds = idsOf(collection(cards, 'rooms'));
  return [
    ...exitFindings(cards, roomIds),
    ...movePlayerFindings(cards, roomIds),
    ...ownerFindings(cards, roomIds),
  ];
}

export function checkContentIds(
  cards: ParsedCardSet,
  options: ValidationOptions,
): readonly Finding[] {
  return [
    ...duplicateFindings(cards),
    ...aliasFindings(cards),
    ...prefixFindings(cards),
    ...topicFindings(cards, options),
    ...referenceFindings(cards),
  ];
}
