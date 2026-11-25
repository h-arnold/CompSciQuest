// Content generation (content-toolchain.md §5). Validation runs first; on
// success each kind is emitted once, in directory-then-file declaration order.

import type {
  GeneratedFile,
  GenerationResult,
  ParsedCard,
  ParsedCardSet,
  ValidationOptions,
} from './contracts.ts';
import {
  asText,
  collection,
  normalisedCards,
  stringList,
} from './gates/common.ts';
import { bundleOf } from './adapt.ts';
import { cleanEntry, emitCatalogue, type CatalogueEmit } from './emit.ts';
import { validateCards } from './validate.ts';

type Data = Record<string, unknown>;

const OUTPUTS: readonly {
  readonly path: string;
  readonly name: string;
  readonly typeName: string;
  readonly importPath: string;
}[] = [
  {
    path: 'src/content/authored/rooms.ts',
    name: 'rooms',
    typeName: 'RoomDefinition',
    importPath: '../RoomDefinition',
  },
  {
    path: 'src/content/authored/items.ts',
    name: 'items',
    typeName: 'ItemDefinition',
    importPath: '../ItemDefinition',
  },
  {
    path: 'src/content/authored/areas.ts',
    name: 'areas',
    typeName: 'AreaDefinition',
    importPath: '../AreaDefinition',
  },
  {
    path: 'src/content/authored/worlds.ts',
    name: 'worlds',
    typeName: 'WorldDefinition',
    importPath: '../WorldDefinition',
  },
  {
    path: 'src/content/authored/actors.ts',
    name: 'actors',
    typeName: 'ActorDefinition',
    importPath: '../ActorDefinition',
  },
  {
    path: 'src/content/authored/actor-states.ts',
    name: 'actorStates',
    typeName: 'ActorState',
    importPath: '../../core/npcs/ActorState',
  },
  {
    path: 'src/content/authored/conversation-topics.ts',
    name: 'conversationTopics',
    typeName: 'ConversationTopic',
    importPath: '../../core/npcs/ConversationTopic',
  },
  {
    path: 'src/content/authored/nodes.ts',
    name: 'nodes',
    typeName: 'ConversationNode',
    importPath: '../../core/npcs/ConversationNode',
  },
  {
    path: 'src/content/authored/quizzes.ts',
    name: 'quizzes',
    typeName: 'Quiz',
    importPath: '../../core/combat/Quiz',
  },
  {
    path: 'src/content/authored/questions.ts',
    name: 'questions',
    typeName: 'QuizQuestion',
    importPath: '../../core/combat/QuizQuestion',
  },
  {
    path: 'src/content/authored/puzzles.ts',
    name: 'puzzles',
    typeName: 'Puzzle',
    importPath: '../../core/puzzles/Puzzle',
  },
  {
    path: 'src/content/authored/hazards.ts',
    name: 'hazards',
    typeName: 'Hazard',
    importPath: '../../core/hazards/Hazard',
  },
  {
    path: 'src/content/authored/hints.ts',
    name: 'hints',
    typeName: 'HintSequence',
    importPath: '../../core/hints/HintSequence',
  },
  {
    path: 'src/content/authored/spec-topics.ts',
    name: 'specTopics',
    typeName: 'SpecTopic',
    importPath: '../../core/scoring/SpecTopic',
  },
];

const TARGET_OF: Readonly<Record<string, string>> = {
  hintSequences: 'hints',
  topics: 'specTopics',
};

// The canonical-mapped kinds (worlds, areas, rooms, items) come from bundleOf;
// these collections are copied from YAML after authoring blocks are stripped.
const COLLECTION_KEYS: readonly string[] = [
  'actors',
  'actorStates',
  'conversationTopics',
  'quizzes',
  'questions',
  'puzzles',
  'hazards',
  'hintSequences',
  'topics',
];

function directoryOf(path: string): string {
  const separator = path.lastIndexOf('/');
  return separator === -1 ? '' : path.slice(0, separator);
}

function push(outputs: Map<string, Data[]>, name: string, data: Data): void {
  outputs.get(name)?.push(data);
}

function nodeEntry(node: Data, topics: ReadonlyMap<string, Data>): Data {
  const topicIds = stringList(node['topicIds']);
  // Only the node's authoring-only actorId is dropped. An embedded
  // ConversationTopic keeps its optional runtime actor binding
  // (content-rules.md §4.3 point 2, §8).
  const clean = cleanEntry(node, 'topicIds', 'actorId');
  const embedded = topicIds.flatMap((id) => {
    const topic = topics.get(id);
    return topic === undefined ? [] : [cleanEntry(topic)];
  });
  return { ...clean, topics: embedded };
}

function collectTopics(card: ParsedCard): readonly (readonly [string, Data])[] {
  return collection({ cards: [card] }, 'conversationTopics').map((topic) => [
    asText(topic.data['id']),
    cleanEntry(topic.data),
  ]);
}

function collectCard(
  outputs: Map<string, Data[]>,
  card: ParsedCard,
  topics: ReadonlyMap<string, Data>,
): void {
  const one = { cards: [card] };
  for (const key of COLLECTION_KEYS) {
    const target = TARGET_OF[key] ?? key;
    for (const item of collection(one, key)) {
      push(outputs, target, cleanEntry(item.data));
    }
  }
  for (const node of collection(one, 'conversationNodes')) {
    push(outputs, 'nodes', nodeEntry(node.data, topics));
  }
}

export function generateContent(
  cards: ParsedCardSet,
  options?: ValidationOptions,
): GenerationResult {
  // Generation runs C7 by default; an explicit caller options object still
  // overrides this default (content-rules.md §7, content-toolchain.md §5).
  const settings = options ?? { topicOverlap: true };
  const normalised = normalisedCards(cards);
  const findings = validateCards(normalised, settings);
  if (findings.length > 0) return { ok: false, findings, files: [] };

  const outputs = new Map<string, Data[]>(
    OUTPUTS.map((output) => [output.name, []] as const),
  );
  const ordered = [...normalised.cards];
  ordered.sort((left: ParsedCard, right: ParsedCard): number => {
    const a = directoryOf(left.path);
    const b = directoryOf(right.path);
    return a < b ? -1 : Number(a > b);
  });
  // The canonical adapter is the one owner of YAML shorthand → DTO mapping
  // (exit conditions, entry effects, area roomIds). Feeding it declaration-
  // ordered cards keeps generated entries in the same canonical order.
  const canonical = bundleOf({ cards: [...ordered] });
  const canonicalKinds = [
    ['worlds', canonical.worlds.all],
    ['areas', canonical.areas.all],
    ['rooms', canonical.rooms.all],
    ['items', canonical.items.all],
  ] as const;
  for (const [name, entries] of canonicalKinds) {
    for (const entry of entries) {
      push(outputs, name, cleanEntry(entry as unknown as Data));
    }
  }
  const topics = new Map(ordered.flatMap((card) => collectTopics(card)));
  for (const card of ordered) collectCard(outputs, card, topics);

  const files: GeneratedFile[] = OUTPUTS.map((output) => {
    const spec: CatalogueEmit = {
      name: output.name,
      typeName: output.typeName,
      importPath: output.importPath,
      entries: outputs.get(output.name) ?? [],
    };
    return { path: output.path, text: emitCatalogue(spec) };
  });
  return { ok: true, findings: [], files };
}
