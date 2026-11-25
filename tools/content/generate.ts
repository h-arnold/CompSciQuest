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

const COLLECTION_KEYS: readonly string[] = [
  'worlds',
  'areas',
  'rooms',
  'items',
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
  return path.slice(0, path.lastIndexOf('/'));
}

function push(outputs: Map<string, Data[]>, name: string, data: Data): void {
  outputs.get(name)?.push(data);
}

function areaEntry(card: ParsedCard): Data | undefined {
  const definition = card.data['definition'];
  if (typeof definition !== 'object' || definition === null) return undefined;
  const roomIds = collection({ cards: [card] }, 'rooms').map((room) =>
    asText(room.data['id']),
  );
  return { ...cleanEntry(definition as Data), roomIds };
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
  const area = areaEntry(card);
  if (area !== undefined) push(outputs, 'areas', area);
  for (const key of COLLECTION_KEYS) {
    const target = TARGET_OF[key] ?? key;
    for (const item of collection(one, key)) {
      // Room topicIds are an authoring reference, not a runtime field (D4).
      const clean =
        key === 'rooms'
          ? cleanEntry(item.data, 'topicIds')
          : cleanEntry(item.data);
      push(outputs, target, clean);
    }
  }
  for (const node of collection(one, 'conversationNodes')) {
    push(outputs, 'nodes', nodeEntry(node.data, topics));
  }
}

export function generateContent(
  cards: ParsedCardSet,
  options: ValidationOptions = {},
): GenerationResult {
  const normalised = normalisedCards(cards);
  const findings = validateCards(normalised, options);
  if (findings.length > 0) return { ok: false, findings, files: [] };

  const outputs = new Map<string, Data[]>(
    OUTPUTS.map((output) => [output.name, []] as const),
  );
  const ordered = normalised.cards.toSorted((left, right) => {
    const a = directoryOf(left.path);
    const b = directoryOf(right.path);
    return a < b ? -1 : Number(a > b);
  });
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
