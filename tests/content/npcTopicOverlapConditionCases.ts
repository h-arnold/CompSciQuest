// C7 condition-exclusivity cases G-NPC-06..14. The named `it` wrappers live
// in NpcTopicOverlap.test.ts.
import { expect } from 'vitest';
import {
  ACTOR_ID,
  actorState,
  all,
  any,
  clerkTopics,
  counterAtLeast,
  flag,
  inArea,
  inNode,
  inRoom,
  isNamedTogether,
  itemHeld,
  messageFor,
  node,
  not,
  npcKnows,
  overlapFindingsFor,
  overlapMessages,
  pairFindings,
  pairMessages,
  puzzleSolved,
  quizPassed,
  visitedRoom,
  type Data,
} from '../fixtures/npcTopicOverlap';

export async function gNpc06(): Promise<void> {
  const pairs: readonly (readonly [Data, Data])[] = [
    [flag('gate-flag'), not(flag('gate-flag'))],
    [npcKnows(ACTOR_ID, 'data-types'), not(npcKnows(ACTOR_ID, 'data-types'))],
    [itemHeld('item-cache'), not(itemHeld('item-cache'))],
    [puzzleSolved('puzzle-sort-types'), not(puzzleSolved('puzzle-sort-types'))],
    [quizPassed('quiz-data-types'), not(quizPassed('quiz-data-types'))],
    [visitedRoom('room-binary-hall'), not(visitedRoom('room-binary-hall'))],
  ];
  for (const [index, [active, complement]] of pairs.entries()) {
    expect(
      await pairMessages(
        { id: `topic-exclusive-${index}-a`, isActive: active },
        { id: `topic-exclusive-${index}-b`, isActive: complement },
      ),
    ).toEqual([]);
  }
  expect(
    await pairFindings(
      { id: 'topic-knows-other', isActive: npcKnows(ACTOR_ID, 'data-types') },
      {
        id: 'topic-knows-different',
        isActive: npcKnows(ACTOR_ID, 'number-conversion'),
      },
    ),
  ).toHaveLength(1);
  expect(
    await pairFindings(
      {
        id: 'topic-knows-actor-a',
        isActive: npcKnows(ACTOR_ID, 'data-types'),
      },
      {
        id: 'topic-knows-actor-b',
        isActive: npcKnows('npc-other', 'data-types'),
      },
    ),
  ).toHaveLength(1);
}

export async function gNpc07(): Promise<void> {
  const exclusivePairs: readonly (readonly [Data, Data])[] = [
    [inRoom('room-binary-hall'), inRoom('room-switch-floor')],
    [
      actorState(ACTOR_ID, 'actorstate-ready'),
      actorState(ACTOR_ID, 'actorstate-talking'),
    ],
    [inNode(ACTOR_ID, 'node-a'), inNode(ACTOR_ID, 'node-b')],
    [inArea('world-a', 'area-a'), inArea('world-a', 'area-b')],
    [inArea('world-a', 'area-a'), inArea('world-b', 'area-a')],
  ];
  for (const [index, [first, second]] of exclusivePairs.entries()) {
    expect(
      await pairMessages(
        { id: `topic-position-${index}-a`, isActive: first },
        { id: `topic-position-${index}-b`, isActive: second },
      ),
    ).toEqual([]);
  }
  const differentActors: readonly (readonly [Data, Data])[] = [
    [
      actorState(ACTOR_ID, 'actorstate-ready'),
      actorState('npc-other', 'actorstate-ready'),
    ],
    [inNode(ACTOR_ID, 'node-a'), inNode('npc-other', 'node-a')],
  ];
  for (const [index, [first, second]] of differentActors.entries()) {
    expect(
      await pairFindings(
        { id: `topic-actor-${index}-a`, isActive: first },
        { id: `topic-actor-${index}-b`, isActive: second },
      ),
    ).toHaveLength(1);
  }
}

export async function gNpc08(): Promise<void> {
  const belowTwo = not(counterAtLeast('counter-a', 2));
  const belowFive = not(counterAtLeast('counter-a', 5));
  const belowFiveB = not(counterAtLeast('counter-b', 5));
  expect(
    await pairMessages(
      { id: 'topic-counter-high', isActive: counterAtLeast('counter-a', 5) },
      { id: 'topic-counter-low', isActive: belowTwo },
    ),
  ).toEqual([]);
  expect(
    await pairFindings(
      { id: 'topic-counter-two', isActive: counterAtLeast('counter-a', 2) },
      { id: 'topic-counter-not-five', isActive: belowFive },
    ),
  ).toHaveLength(1);
  expect(
    await pairFindings(
      { id: 'topic-counter-key-a', isActive: counterAtLeast('counter-a', 2) },
      { id: 'topic-counter-key-b', isActive: belowFiveB },
    ),
  ).toHaveLength(1);
}

export async function gNpc09(): Promise<void> {
  const exclusivePairs: readonly (readonly [Data, Data])[] = [
    [all([flag('gate-a'), flag('gate-b')]), not(flag('gate-a'))],
    [any([inRoom('room-a')]), any([inRoom('room-b')])],
    [not(flag('gate-a')), not(not(flag('gate-a')))],
  ];
  for (const [index, [first, second]] of exclusivePairs.entries()) {
    expect(
      await pairMessages(
        { id: `topic-tree-exclusive-${index}-a`, isActive: first },
        { id: `topic-tree-exclusive-${index}-b`, isActive: second },
      ),
    ).toEqual([]);
  }
  const overlappingPairs: readonly (readonly [Data, Data])[] = [
    [
      any([flag('gate-a'), flag('gate-b')]),
      any([not(flag('gate-a')), not(flag('gate-b'))]),
    ],
    [not(inRoom('room-a')), not(inRoom('room-b'))],
    [all([flag('gate-a'), flag('gate-b')]), not(flag('gate-c'))],
  ];
  for (const [index, [first, second]] of overlappingPairs.entries()) {
    expect(
      await pairFindings(
        { id: `topic-tree-overlap-${index}-a`, isActive: first },
        { id: `topic-tree-overlap-${index}-b`, isActive: second },
      ),
    ).toHaveLength(1);
  }
}

export async function gNpc10(): Promise<void> {
  expect(
    await pairFindings(
      { id: 'topic-all-empty', isActive: all([]) },
      { id: 'topic-ordinary-active', isActive: flag('gate-a') },
    ),
  ).toHaveLength(1);
  expect(
    await pairMessages(
      { id: 'topic-any-empty', isActive: any([]) },
      { id: 'topic-ordinary-active-2', isActive: flag('gate-a') },
    ),
  ).toEqual([]);
  expect(
    await pairMessages(
      { id: 'topic-all-empty-2', isActive: all([]) },
      { id: 'topic-any-empty-2', isActive: any([]) },
    ),
  ).toEqual([]);
  expect(
    await pairFindings(
      { id: 'topic-all-empty-3', isActive: all([]) },
      { id: 'topic-all-empty-4', isActive: all([]) },
    ),
  ).toHaveLength(1);
}

export async function gNpc11(): Promise<void> {
  const findings = await overlapFindingsFor([
    { id: 'topic-flag-a', isActive: flag('flag-a') },
    { id: 'topic-flag-b', isActive: flag('flag-b') },
    { id: 'topic-flag-c', isActive: flag('flag-c') },
  ]);
  expect(findings).toHaveLength(3);
  const expected = [
    messageFor('topic-flag-a', 'topic-flag-b'),
    messageFor('topic-flag-a', 'topic-flag-c'),
    messageFor('topic-flag-b', 'topic-flag-c'),
  ];
  expect(new Set(overlapMessages(findings))).toEqual(new Set(expected));
  expect(
    await pairFindings(
      { id: 'topic-flag-with-item', isActive: flag('flag-a') },
      { id: 'topic-unrelated-item', isActive: itemHeld('item-cache') },
    ),
  ).toHaveLength(1);
  expect(
    await pairFindings(
      { id: 'topic-key-one', isActive: counterAtLeast('key-one', 2) },
      { id: 'topic-key-two', isActive: counterAtLeast('key-two', 2) },
    ),
  ).toHaveLength(1);
}

export async function gNpc12(): Promise<void> {
  const messages = overlapMessages(await overlapFindingsFor(clerkTopics()));
  expect(messages.length).toBeGreaterThanOrEqual(3);
  expect(messages).toContain(
    messageFor('topic-clerk-bases', 'topic-clerk-carries'),
  );
  expect(messages).toContain(
    messageFor('topic-clerk-bases', 'topic-clerk-shifts'),
  );
  expect(messages).toContain(
    messageFor('topic-clerk-carries', 'topic-clerk-shifts'),
  );
  expect(
    messages.some((message) =>
      isNamedTogether(message, 'topic-clerk-bases', 'topic-clerk-bases-known'),
    ),
    'not npc-knows against npc-knows is proven exclusive',
  ).toBe(false);
  expect(
    messages.some((message) =>
      isNamedTogether(message, 'topic-clerk-bases', 'topic-clerk-shifts-known'),
    ),
    'not npc-knows against npc-knows is proven exclusive',
  ).toBe(false);
}

export async function gNpc13(): Promise<void> {
  const teachingNode = node({
    id: 'node-shift',
    topicIds: ['topic-node-shift'],
    defaultTopicId: 'topic-node-shift',
  });
  const forward = await overlapFindingsFor(
    [{ id: 'topic-node-shift' }, { id: 'topic-actor-shift' }],
    [teachingNode],
  );
  expect(forward).toHaveLength(1);
  expect(forward[0]?.message).toBe(
    messageFor('topic-node-shift', 'topic-actor-shift'),
  );
  const reversed = await overlapFindingsFor(
    [{ id: 'topic-actor-shift' }, { id: 'topic-node-shift' }],
    [teachingNode],
  );
  expect(reversed).toHaveLength(1);
  expect(reversed[0]?.message).toBe(
    messageFor('topic-node-shift', 'topic-actor-shift'),
  );
}

export async function gNpc14(): Promise<void> {
  const exclusivePairs: readonly (readonly [Data, Data])[] = [
    [flag('flag-a'), not(flag('flag-a'))],
    [inRoom('room-a'), inRoom('room-b')],
    [counterAtLeast('counter-a', 5), not(counterAtLeast('counter-a', 2))],
    [all([flag('flag-a'), flag('flag-b')]), not(flag('flag-a'))],
  ];
  for (const [index, [first, second]] of exclusivePairs.entries()) {
    expect(
      await pairMessages(
        { id: `topic-proven-${index}-a`, isActive: first },
        { id: `topic-proven-${index}-b`, isActive: second },
      ),
    ).toEqual([]);
  }
}
