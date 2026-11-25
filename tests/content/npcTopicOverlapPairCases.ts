// C7 pair and scope cases G-NPC-01..05 and G-NPC-19..22. The named
// `it` wrappers live in NpcTopicOverlap.test.ts.
import { expect } from 'vitest';
import { loadGenerator, loadValidation } from '../fixtures/contentToolchain';
import {
  askTellTopic,
  askTopic,
  giveTopic,
  messageFor,
  node,
  npcCardSet,
  npcCards,
  npcContentText,
  npcData,
  overlapFindings,
  overlapFindingsFor,
  overlapMessages,
  pairFindings,
  pairMessages,
  showTopic,
  specialTopic,
  tellTopic,
  topic,
  validateOverlap,
  type Data,
} from '../fixtures/npcTopicOverlap';

function command(id: string, keywords: readonly string[]): Data {
  return { id, match: { kind: 'command', keywords } };
}

export async function gNpc01(): Promise<void> {
  const first = {
    id: 'topic-ask-a',
    match: { kind: 'ask', objectIds: ['data-types'] },
  };
  const second = {
    id: 'topic-ask-b',
    match: { kind: 'ask', objectIds: ['number-conversion'] },
  };
  expect(await pairMessages(first, second)).toEqual([
    messageFor('topic-ask-a', 'topic-ask-b'),
  ]);
}

export async function gNpc02(): Promise<void> {
  const ask = askTopic('topic-ask', ['data-types']);
  const tell = tellTopic('topic-tell', ['data-types']);
  const askTell = askTellTopic('topic-asktell', ['data-types']);
  expect(await pairMessages(ask, askTell)).toEqual([
    messageFor('topic-ask', 'topic-asktell'),
  ]);
  expect(await pairMessages(tell, askTell)).toEqual([
    messageFor('topic-tell', 'topic-asktell'),
  ]);
  // npcs.md §3: free text does not distinguish the verbs, so an ask topic is
  // reached for a typed `tell` and the reverse (the `hasResolvedMatch`
  // free-text branch). The verb distinction applies only once a phrase
  // resolves to an object, so ask + tell overlaps here.
  expect(await pairMessages(ask, tell)).toEqual([
    messageFor('topic-ask', 'topic-tell'),
  ]);
}

export async function gNpc03(): Promise<void> {
  const catchAll = askTellTopic('topic-catchall-without-default', []);
  const concrete = askTellTopic('topic-concrete', ['data-types']);
  expect(await pairMessages(catchAll, concrete)).toEqual([]);
  expect(
    await pairMessages(
      askTellTopic('topic-default-a', []),
      askTellTopic('topic-default-b', []),
    ),
  ).toEqual([]);
}

export async function gNpc04(): Promise<void> {
  const giveCache = giveTopic('topic-give-cache', ['item-cache']);
  const giveCacheAgain = giveTopic('topic-give-cache-again', ['item-cache']);
  const showCache = showTopic('topic-show-cache', ['item-cache']);
  const showCacheAgain = showTopic('topic-show-cache-again', ['item-cache']);
  expect(await pairMessages(giveCache, giveCacheAgain)).toEqual([
    messageFor('topic-give-cache', 'topic-give-cache-again'),
  ]);
  expect(await pairMessages(showCache, showCacheAgain)).toEqual([
    messageFor('topic-show-cache', 'topic-show-cache-again'),
  ]);
  expect(
    await pairMessages(giveCache, giveTopic('topic-give-key', ['item-key'])),
  ).toEqual([]);
  expect(await pairMessages(giveCache, showCache)).toEqual([]);
  expect(
    await pairMessages(giveTopic('topic-give-nothing', []), giveCache),
  ).toEqual([]);
}

export async function gNpc05(): Promise<void> {
  expect(
    await pairFindings(
      {
        id: 'topic-kw-equal-a',
        match: { kind: 'command', keywords: ['types'] },
      },
      {
        id: 'topic-kw-equal-b',
        match: { kind: 'command', keywords: ['types'] },
      },
    ),
  ).toHaveLength(1);
  expect(
    await pairFindings(
      {
        id: 'topic-kw-phrase',
        match: { kind: 'command', keywords: ['data types'] },
      },
      {
        id: 'topic-kw-word',
        match: { kind: 'command', keywords: ['types'] },
      },
    ),
  ).toHaveLength(1);
  expect(
    await pairFindings(
      {
        id: 'topic-kw-case',
        match: { kind: 'command', keywords: [' Types '] },
      },
      {
        id: 'topic-kw-lower',
        match: { kind: 'command', keywords: ['types'] },
      },
    ),
  ).toHaveLength(1);
  expect(
    await pairMessages(
      {
        id: 'topic-kw-disjoint-a',
        match: { kind: 'command', keywords: ['types'] },
      },
      {
        id: 'topic-kw-disjoint-b',
        match: { kind: 'command', keywords: ['shifts'] },
      },
    ),
  ).toEqual([]);
  expect(
    await pairMessages(
      { id: 'topic-kw-empty', match: { kind: 'command', keywords: [] } },
      {
        id: 'topic-kw-other',
        match: { kind: 'command', keywords: ['types'] },
      },
    ),
  ).toEqual([]);
  expect(
    await pairMessages(
      {
        id: 'topic-kw-with-special',
        match: { kind: 'command', keywords: ['types'] },
      },
      specialTopic('topic-special-command', ['types']),
    ),
  ).toEqual([]);
  expect(
    await pairMessages(
      specialTopic('topic-special-a', ['why']),
      specialTopic('topic-special-b', ['why']),
    ),
  ).toEqual([]);
}

export async function gNpc19(): Promise<void> {
  const giveCoincident = giveTopic('topic-give-coincident', ['data-types']);
  const showCoincident = showTopic('topic-show-coincident', ['data-types']);
  const askCoincident = askTopic('topic-ask-coincident', ['data-types']);
  const commandCoincident = {
    id: 'topic-command-coincident',
    match: { kind: 'command', keywords: ['types'] },
  };
  expect(await pairMessages(giveCoincident, askCoincident)).toEqual([]);
  expect(await pairMessages(showCoincident, askCoincident)).toEqual([]);
  expect(await pairMessages(giveCoincident, commandCoincident)).toEqual([]);
  expect(await pairFindings(commandCoincident, askCoincident)).toHaveLength(1);
  expect(
    await pairMessages(
      { id: 'topic-command-empty', match: { kind: 'command', keywords: [] } },
      askCoincident,
    ),
  ).toEqual([]);
}

export async function gNpc20(): Promise<void> {
  const sameNode = node({
    id: 'node-both',
    topicIds: ['topic-node-alpha', 'topic-node-beta'],
    defaultTopicId: 'topic-node-alpha',
  });
  expect(
    await pairMessages({ id: 'topic-node-alpha' }, { id: 'topic-node-beta' }, [
      sameNode,
    ]),
  ).toEqual([]);
  const nodeAlpha = node({
    id: 'node-alpha',
    topicIds: ['topic-node-alpha'],
    defaultTopicId: 'topic-node-alpha',
  });
  const nodeBeta = node({
    id: 'node-beta',
    topicIds: ['topic-node-beta'],
    defaultTopicId: 'topic-node-beta',
  });
  expect(
    await pairFindings({ id: 'topic-node-alpha' }, { id: 'topic-node-beta' }, [
      nodeAlpha,
      nodeBeta,
    ]),
  ).toHaveLength(1);
  expect(
    await pairFindings({ id: 'topic-node-alpha' }, { id: 'topic-node-beta' }, [
      nodeAlpha,
    ]),
  ).toHaveLength(1);
}

export async function gNpc21(): Promise<void> {
  expect(
    await pairFindings(
      command('topic-equal-a', ['types']),
      command('topic-equal-b', ['types']),
    ),
  ).toHaveLength(1);
  expect(
    await pairFindings(
      command('topic-phrase-a', ['data types']),
      command('topic-word-a', ['types']),
    ),
  ).toHaveLength(1);
  expect(
    await pairFindings(
      command('topic-word-b', ['types']),
      command('topic-phrase-b', ['data types']),
    ),
  ).toHaveLength(1);
  expect(
    await pairMessages(
      command('topic-unrelated-a', ['types']),
      command('topic-unrelated-b', ['shifts']),
    ),
  ).toEqual([]);
  expect(
    await pairMessages(
      command('topic-empty-a', []),
      command('topic-empty-b', ['types']),
    ),
  ).toEqual([]);
  expect(
    await pairFindings(
      command('topic-trimmed', [' Data Types ']),
      command('topic-lowered', ['types']),
    ),
  ).toHaveLength(1);
}

export async function gNpc22(): Promise<void> {
  const topics = [
    topic({ id: 'topic-alpha' }),
    topic({ id: 'topic-beta' }),
    topic({ id: 'topic-gamma' }),
  ];
  const nodes = [
    node({
      id: 'node-alpha-beta',
      topicIds: ['topic-alpha', 'topic-beta'],
      defaultTopicId: 'topic-alpha',
    }),
  ];
  const data = npcData({
    conversationTopics: topics,
    conversationNodes: nodes,
  });
  const cards = npcCards(data);
  const bare = await validateOverlap(cards);
  expect(overlapMessages(bare)).toEqual([]);
  expect(npcContentText(bare), 'the eight-gate default must not run C7').toBe(
    '',
  );
  expect(await overlapFindingsFor(topics, nodes)).not.toHaveLength(0);
  const { validateCommand } = await loadValidation();
  const cliFindings = overlapFindings(
    validateCommand(npcCardSet(data)).findings,
  );
  expect(cliFindings.length).toBeGreaterThan(0);
  const { generateContent } = await loadGenerator();
  const generated = overlapFindings(generateContent(cards).findings);
  expect(generated.length).toBeGreaterThan(0);
}
