// YAML card shapes (content-toolchain.md §2, §4; content-rules.md §4.1, D3).
// The Zod schema guards the authoring envelope; cross-artifact meaning is owned
// by validate.ts and the eight gates, not by this file.
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import type { CardSet, Finding, ParseResult } from './contracts.ts';
import { asRecord, finding } from './gates/common.ts';

const SHAPE_GATE = 'shape';

// Scaffolds write placeholders such as `todo-name`, `room-todo-start` and
// `todo-description`. Any unresolved placeholder fails authoring validation
// (content-toolchain.md §4, content-rules.md §7, application-and-ui.md §3.3).
const TODO_PLACEHOLDER = /(?:^|[-_])todo(?:[-_]|$)/iu;

const KINDS = [
  'area',
  'npc',
  'quiz',
  'puzzle',
  'hazard',
  'hint',
  'spec-topics',
] as const;

const entryShape = z.object({ id: z.string() }).passthrough();
const entriesShape = z.array(entryShape).optional();

// One envelope covers every kind; the kind-specific collections are optional
// because a card holds only the collections its kind owns.
const cardShape = z
  .object({
    kind: z.enum(KINDS),
    areaId: z.string().optional(),
    status: z.enum(['draft', 'reviewed', 'approved']).optional(),
    topicIds: z.array(z.string()).optional(),
    definition: entryShape.optional(),
    worlds: entriesShape,
    rooms: entriesShape,
    items: entriesShape,
    actors: entriesShape,
    actorStates: entriesShape,
    conversationTopics: entriesShape,
    conversationNodes: entriesShape,
    quizzes: entriesShape,
    questions: entriesShape,
    puzzles: entriesShape,
    hazards: entriesShape,
    hintSequences: entriesShape,
    topics: entriesShape,
  })
  .passthrough();

// Authoring-only keys (content-toolchain.md §2). They are legal only inside an
// `authoring:` block; a stray occurrence is a finding.
const AUTHORING_KEYS: ReadonlySet<string> = new Set([
  'interesting',
  'pillar',
  'useNotes',
  'fixtureNotes',
  'telegraph',
  'clues',
  'role',
  'voice',
  'motivation',
  'relationship',
  'misconception',
  'assessmentObjective',
  'difficulty',
  'note',
]);

const COLLECTION_KEYS: readonly string[] = [
  'worlds',
  'rooms',
  'items',
  'actors',
  'actorStates',
  'conversationTopics',
  'conversationNodes',
  'quizzes',
  'questions',
  'puzzles',
  'hazards',
  'hintSequences',
  'topics',
];

function shapeFinding(path: string, entry: string, message: string): Finding {
  return finding(path, entry, message, SHAPE_GATE);
}

function nullFindings(
  value: unknown,
  path: string,
  entry: string,
  seen: ReadonlySet<object>,
): readonly Finding[] {
  const record = asRecord(value);
  if (record !== undefined) {
    if (seen.has(record)) return [];
    const nextSeen = new Set(seen);
    nextSeen.add(record);
    const label = typeof record['id'] === 'string' ? record['id'] : entry;
    return Object.entries(record).flatMap(([key, child]) => {
      if (child === null) {
        return [
          shapeFinding(
            path,
            label,
            `Optional field '${key}' must be omitted, not set to null; omit the field entirely`,
          ),
        ];
      }
      return nullFindings(child, path, label, nextSeen);
    });
  }
  if (Array.isArray(value)) {
    if (seen.has(value)) return [];
    const nextSeen = new Set(seen);
    nextSeen.add(value);
    return value.flatMap((child) => nullFindings(child, path, entry, nextSeen));
  }
  return [];
}

function todoFindings(
  value: unknown,
  path: string,
  entry: string,
  seen: ReadonlySet<object>,
): readonly Finding[] {
  const record = asRecord(value);
  if (record !== undefined) {
    if (seen.has(record)) return [];
    const nextSeen = new Set(seen);
    nextSeen.add(record);
    const label = typeof record['id'] === 'string' ? record['id'] : entry;
    return Object.entries(record).flatMap(([key, child]) => {
      if (typeof child === 'string' && TODO_PLACEHOLDER.test(child)) {
        return [
          shapeFinding(
            path,
            label,
            `Unresolved todo placeholder '${child}' in '${key}'; populate it before review or generation`,
          ),
        ];
      }
      return todoFindings(child, path, label, nextSeen);
    });
  }
  if (Array.isArray(value)) {
    if (seen.has(value)) return [];
    const nextSeen = new Set(seen);
    nextSeen.add(value);
    return value.flatMap((child) => todoFindings(child, path, entry, nextSeen));
  }
  return [];
}

function strayFindings(
  path: string,
  data: Record<string, unknown>,
): readonly Finding[] {
  const found: Finding[] = [];
  const check = (record: Record<string, unknown>, entry: string): void => {
    for (const key of Object.keys(record)) {
      if (key === 'authoring' || !AUTHORING_KEYS.has(key)) continue;
      found.push(
        shapeFinding(
          path,
          entry,
          `Authoring key '${key}' must live inside an authoring block`,
        ),
      );
    }
  };
  check(data, String(data['kind'] ?? path));
  for (const key of COLLECTION_KEYS) {
    const collection = data[key];
    if (!Array.isArray(collection)) continue;
    for (const item of collection) {
      const record = asRecord(item);
      if (record === undefined) continue;
      check(record, String(record['id'] ?? key));
    }
  }
  return found;
}

export function parseCardSet(cards: CardSet): ParseResult {
  const findings: Finding[] = [];
  const parsed: Record<string, Record<string, unknown>> = {};

  for (const file of cards.files) {
    let value: unknown;
    try {
      value = parseYaml(file.text);
    } catch (error: unknown) {
      const detail = error instanceof Error ? error.message : String(error);
      findings.push(
        shapeFinding(file.path, file.path, `YAML parse error: ${detail}`),
      );
      continue;
    }
    const record = asRecord(value);
    if (record === undefined) {
      findings.push(
        shapeFinding(file.path, file.path, 'A card must be a YAML mapping'),
      );
      continue;
    }
    const result = cardShape.safeParse(record);
    if (!result.success) {
      for (const issue of result.error.issues) {
        findings.push(
          shapeFinding(
            file.path,
            String(record['kind'] ?? file.path),
            `Invalid card shape at ${issue.path.join('.') || 'root'}: ${issue.message}`,
          ),
        );
      }
    }
    findings.push(
      ...nullFindings(record, file.path, file.path, new Set()),
      ...todoFindings(record, file.path, file.path, new Set()),
      ...strayFindings(file.path, record),
    );
    parsed[file.path] = record;
  }

  return { findings, parsed };
}
