// C7 finding-shape and handoff cases G-NPC-15..18. The named `it` wrappers
// live in NpcTopicOverlap.test.ts.
import { expect } from 'vitest';
import {
  DEFERRED_GATES,
  validateContent,
} from '../../src/content/validateContent';
import type { ConversationTopic } from '../../src/core/npcs/ConversationTopic';
import { selectTopic } from '../../src/core/npcs/TopicSelection';
import type { ConditionEvaluator } from '../../src/core/rules/ConditionEvaluator';
import type { TurnContext } from '../../src/core/TurnContext';
import { AREA_ID, loadValidation } from '../fixtures/contentToolchain';
import {
  catalogueOf,
  makeBundle,
  makeRuntimeState,
} from '../fixtures/persistence';
import {
  ACTOR_ID,
  clerkTopics,
  isNamedTogether,
  messageFor,
  npcCardSet,
  npcData,
  overlapMessages,
  pairFindings,
  runtimeTopic,
} from '../fixtures/npcTopicOverlap';

function runtimeBundle(
  topics: readonly ConversationTopic[],
): TurnContext['bundle'] {
  return { ...makeBundle(), conversationTopics: catalogueOf(topics) };
}

export async function gNpc15(): Promise<void> {
  const findings = await pairFindings(
    { id: 'topic-alpha' },
    { id: 'topic-beta' },
  );
  expect(findings).toHaveLength(1);
  const finding = findings[0];
  expect(finding).toBeDefined();
  expect(finding?.path).toBe(`${AREA_ID}/npcs.yaml`);
  expect(finding?.entry).toBe('topic-alpha');
  expect(finding?.gate).toBe('npc-content');
  expect(finding?.message).toBe(messageFor('topic-alpha', 'topic-beta'));
  expect(finding?.path.length).toBeGreaterThan(0);
  expect(finding?.entry.length).toBeGreaterThan(0);
  expect(finding !== undefined && Object.hasOwn(finding, 'severity')).toBe(
    false,
  );
}

export async function gNpc16(): Promise<void> {
  const data = npcData({ conversationTopics: clerkTopics() });
  const { validateCommand } = await loadValidation();
  const result = validateCommand(npcCardSet(data));
  const messages = overlapMessages(result.findings);
  expect(messages.length).toBeGreaterThan(0);
  expect(
    messages.some((message) =>
      isNamedTogether(message, 'topic-clerk-bases', 'topic-clerk-carries'),
    ),
  ).toBe(true);
  expect(result.exitCode).toBe(1);
}

export async function gNpc17(): Promise<void> {
  expect(DEFERRED_GATES).toContain('npc-content');
  const runtimeTopics = [
    runtimeTopic({ id: 'topic-alpha' }),
    runtimeTopic({ id: 'topic-beta' }),
  ];
  const bundle = {
    ...makeBundle(),
    conversationTopics: catalogueOf<ConversationTopic>(runtimeTopics),
  };
  const problems = validateContent(bundle);
  expect(
    problems.some((problem) =>
      /conversation topics .* overlap/iu.test(problem),
    ),
    'boot validation must not run the authoring-only C7 check',
  ).toBe(false);
}

export async function gNpc18(): Promise<void> {
  const findings = await pairFindings(
    { id: 'topic-alpha' },
    { id: 'topic-beta' },
  );
  expect(findings).toHaveLength(1);
  const message = findings[0]?.message ?? '';
  expect(message).toBe(messageFor('topic-alpha', 'topic-beta'));
  expect(message).not.toMatch(
    /specific|keyword|tie.?break|declaration|prefer|winner|wins\b/iu,
  );
  const alwaysActive: ConditionEvaluator = { evaluate: () => true };
  const alpha = runtimeTopic({ id: 'topic-alpha' });
  const omega = runtimeTopic({ id: 'topic-omega' });
  const context: TurnContext = {
    turn: 1,
    state: makeRuntimeState(),
    bundle: runtimeBundle([alpha, omega]),
    random: { nextInt: () => 0 },
    command: { kind: 'ask', actorId: ACTOR_ID, topic: 'widget' },
  };
  const selected = selectTopic(
    context,
    alwaysActive,
    ACTOR_ID,
    undefined,
    { kind: 'free-text', text: 'widget' },
    'widget',
  );
  expect(selected?.topic.id).toBe('topic-alpha');
  const nodeTopic = runtimeTopic({ id: 'topic-node-first' });
  const actorTopic = runtimeTopic({ id: 'topic-actor-first' });
  const nodeSelected = selectTopic(
    { ...context, bundle: runtimeBundle([actorTopic, nodeTopic]) },
    alwaysActive,
    ACTOR_ID,
    {
      id: 'node-first',
      isSticky: false,
      topics: [nodeTopic],
      defaultTopicId: 'topic-node-first',
    },
    { kind: 'free-text', text: 'widget' },
    'widget',
  );
  expect(nodeSelected?.fromNode).toBe(true);
  expect(nodeSelected?.topic.id).toBe('topic-node-first');
}
