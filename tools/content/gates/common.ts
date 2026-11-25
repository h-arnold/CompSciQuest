// Shared read-only helpers for the eight authoring gates (content-toolchain.md
// §4). Nothing here mutates a parsed card.

import type {
  Finding,
  ParsedCardSet,
  ValidationOptions,
} from '../contracts.ts';

export interface CardEntry {
  readonly path: string;
  readonly entry: string;
  readonly data: Record<string, unknown>;
}

export function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

export function asArray(value: unknown): readonly unknown[] {
  return Array.isArray(value) ? value : [];
}

export function asText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function asNumber(value: unknown): number {
  return typeof value === 'number' ? value : NaN;
}

export function asObjectArray(
  value: unknown,
): readonly Record<string, unknown>[] {
  return asArray(value).flatMap((item) => {
    const record = asRecord(item);
    return record === undefined ? [] : [record];
  });
}

export function finding(
  path: string,
  entry: string,
  message: string,
  gate: string,
): Finding {
  return { path, entry, message, gate };
}

export function collection(
  cards: ParsedCardSet,
  key: string,
): readonly CardEntry[] {
  return cards.cards.flatMap((card) =>
    asObjectArray(card.data[key]).map((data) => ({
      path: card.path,
      entry: asText(data['id']) || key,
      data,
    })),
  );
}

export function entriesWith(
  cards: ParsedCardSet,
  ...keys: readonly string[]
): readonly CardEntry[] {
  return keys.flatMap((key) => collection(cards, key));
}

// An area is declared under `definition:` on a canonical area card
// (content-toolchain.md §2, content-rules.md §4.2). The `areas` collection is
// the earlier fixture spelling; both take the same gate path.
export function areaLikes(cards: ParsedCardSet): readonly CardEntry[] {
  const definitions = cards.cards
    .map((card) => {
      const data = asRecord(card.data['definition']);
      return data === undefined
        ? undefined
        : { path: card.path, entry: asText(data['id']), data };
    })
    .filter((entry): entry is CardEntry => entry !== undefined);
  return [...collection(cards, 'areas'), ...definitions];
}

function normaliseExit(exit: Record<string, unknown>): Record<string, unknown> {
  const targetRoomId = asText(exit['targetRoomId'] ?? exit['to']);
  return {
    ...Object.fromEntries(Object.entries(exit).filter(([key]) => key !== 'to')),
    targetRoomId,
  };
}

// Whole-graph checks apply to declared `areas` entries and to every area a
// world declares. A conforming multi-area card set lists all its members in
// `world.areaIds` and has no `areas` collection (content-toolchain.md §2), so
// the non-start members' definitions must be audited too, not just the area
// named by `startAreaId`. A definition fragment that declares no world and no
// `areas` collection is not yet a whole graph and stays out of the audit.
export function auditedAreaLikes(cards: ParsedCardSet): readonly CardEntry[] {
  const declared = new Set(
    collection(cards, 'areas').map((area) => asText(area.data['id'])),
  );
  const worlds = collection(cards, 'worlds');
  const starts = new Set(
    worlds.map((world) => asText(world.data['startAreaId'])),
  );
  const members = new Set(
    worlds.flatMap((world) => stringList(world.data['areaIds'])),
  );
  return areaLikes(cards).filter((area) => {
    const id = asText(area.data['id']);
    return declared.has(id) || starts.has(id) || members.has(id);
  });
}

// YAML authors `exits[*].to`; the canonical RoomDefinition/ExitDefinition uses
// `targetRoomId`. Normalise once at the adapter boundary so every gate and the
// emitted TypeScript see the same shape (content-toolchain.md §2, §5). The
// input cards are never mutated.
export function normalisedCards(cards: ParsedCardSet): ParsedCardSet {
  return {
    cards: cards.cards.map((card) => {
      const rooms = card.data['rooms'];
      if (!Array.isArray(rooms)) return card;
      return {
        path: card.path,
        data: {
          ...card.data,
          rooms: rooms.map((room: unknown) => {
            const data = asRecord(room);
            return data === undefined || !Array.isArray(data['exits'])
              ? room
              : {
                  ...data,
                  exits: asObjectArray(data['exits']).map((exit) =>
                    normaliseExit(exit),
                  ),
                };
          }),
        },
      };
    }),
  };
}

export function idsOf(entries: readonly CardEntry[]): ReadonlySet<string> {
  return new Set(
    entries
      .map((item) => asText(item.data['id']))
      .filter((id) => id.length > 0),
  );
}

export function authoringOf(
  data: Record<string, unknown>,
): Record<string, unknown> {
  return asRecord(data['authoring']) ?? {};
}

export function stringList(value: unknown): readonly string[] {
  return asArray(value)
    .map((item) =>
      typeof item === 'number' && Number.isFinite(item)
        ? String(item)
        : asText(item),
    )
    .filter((text) => text.length > 0);
}

// The single owner of the coverage heading marker: the CLI extracts headings
// from COVERAGE.md with this, and the gates resolve their IDs with coverageIds.
const TOPIC_HEADING = '## Topic:';

export function topicHeadings(text: string): readonly string[] {
  return text.split('\n').filter((line) => line.startsWith(TOPIC_HEADING));
}

export function coverageIds(options: ValidationOptions): readonly string[] {
  const fromHeadings = options.coverageHeadings?.flatMap((heading) =>
    heading.startsWith(TOPIC_HEADING)
      ? heading.slice(TOPIC_HEADING.length).trim()
      : [],
  );
  return [...(options.coverageTopicIds ?? []), ...(fromHeadings ?? [])].filter(
    (id) => id.length > 0,
  );
}

// Topic IDs become known only from the injected coverage source or from a
// declared spec-topics card. With neither source there is no registry to check
// against, so reference checks are skipped rather than guessed.
export function knownTopicIds(
  cards: ParsedCardSet,
  options: ValidationOptions,
): ReadonlySet<string> {
  const declared = collection(cards, 'topics').map((item) =>
    asText(item.data['id']),
  );
  return new Set([...coverageIds(options), ...declared].filter(Boolean));
}

// Value mirror of the canonical direction union in architecture.md §7.
export const DIRECTIONS: ReadonlySet<string> = new Set([
  'north',
  'south',
  'east',
  'west',
  'up',
  'down',
  'in',
  'out',
]);

// Value mirror of the canonical Effect union in shared-rules.md §5.
export const EFFECT_KINDS: ReadonlySet<string> = new Set([
  'set-flag',
  'message',
  'change-lives',
  'complete-topic',
  'grant-item',
  'remove-item',
  'transfer-item',
  'move-player',
  'set-actor-state',
  'learn-topic',
  'enter-node',
  'exit-node',
  'set-puzzle-active',
  'set-puzzle-solved',
  'schedule',
  'start-quiz',
  'show-hint',
]);

export function effectList(value: unknown): readonly Record<string, unknown>[] {
  return asObjectArray(value);
}

export function allEffects(
  cards: ParsedCardSet,
): readonly Record<string, unknown>[] {
  const found: Record<string, unknown>[] = [];
  const seen = new Set<object>();
  const walk = (value: unknown): void => {
    if (Array.isArray(value)) {
      if (seen.has(value)) return;
      seen.add(value);
      for (const child of value) walk(child);
      return;
    }
    const record = asRecord(value);
    if (record === undefined || seen.has(record)) return;
    seen.add(record);
    if (EFFECT_KINDS.has(asText(record['kind']))) found.push(record);
    for (const child of Object.values(record)) walk(child);
  };
  for (const card of cards.cards) walk(card.data);
  return found;
}
