// SCAFFOLDING — type-placeholder inspections. These rows are explicitly exempt
// from red-first (the DTO/type placeholders were landed during scaffolding).
// They pin the canonical shapes from npcs.md §2/§3, storage-schema.md §3.2 and
// application-and-ui.md §8 without asserting any runtime behaviour.
import { describe, expect, expectTypeOf, it } from 'vitest';
import type { ActorDefinition } from '../../src/content/ActorDefinition';
import type { DialogueSystem } from '../../src/core/npcs/DialogueSystem';
import type { ActorState } from '../../src/core/npcs/ActorState';
import type { ConversationNode } from '../../src/core/npcs/ConversationNode';
import type { ConversationTopic } from '../../src/core/npcs/ConversationTopic';
import type { ResolvedTopic } from '../../src/core/npcs/ResolvedTopic';
import type { ResponseStrategy } from '../../src/core/npcs/ResponseStrategy';
import type { TopicMatch } from '../../src/core/npcs/TopicMatch';
import type { NpcStateDto } from '../../src/core/NpcStateDto';
import type { TopicResolver } from '../../src/core/commands/TopicResolver';
import { npcDto } from '../fixtures/npcs';

describe('NPC model placeholders — SCAFFOLDING', () => {
  it('NPC-MODEL-01: ActorState is data with descriptions and optional effects', () => {
    const state: ActorState = {
      id: 'ready',
      stateDesc: 'Ready to talk.',
      specialDesc: 'A helpful figure.',
      onEnter: [{ kind: 'message', text: 'Hello.' }],
      onExit: [],
    };
    expect(state.id).toBe('ready');
    expect(state.stateDesc).toBe('Ready to talk.');
    expect(state.specialDesc).toBe('A helpful figure.');
    expect(state.onEnter).toHaveLength(1);
    expect(state.onExit).toEqual([]);
    expectTypeOf<ActorState>().toHaveProperty('id').toEqualTypeOf<string>();
  });

  it('NPC-MODEL-02: TopicMatch carries every canonical variant in one union', () => {
    const matches: readonly TopicMatch[] = [
      { kind: 'ask', objectIds: ['ring'] },
      { kind: 'tell', objectIds: ['ring'] },
      { kind: 'askTell', objectIds: ['ring'] },
      { kind: 'give', itemIds: ['lamp'] },
      { kind: 'show', itemIds: ['lamp'] },
      { kind: 'command', keywords: ['why'] },
      { kind: 'special', keywords: ['why'] },
    ];
    expect(matches).toHaveLength(7);
    expectTypeOf<TopicMatch>().toEqualTypeOf<
      | {
          readonly kind: 'ask' | 'tell' | 'askTell';
          readonly objectIds: readonly string[];
        }
      | { readonly kind: 'give' | 'show'; readonly itemIds: readonly string[] }
      | {
          readonly kind: 'command' | 'special';
          readonly keywords: readonly string[];
        }
    >();
  });

  it('NPC-MODEL-03: ResponseStrategy has exactly once, sequence and rotating', () => {
    const strategies: readonly ResponseStrategy[] = [
      { kind: 'once' },
      { kind: 'sequence' },
      { kind: 'rotating' },
    ];
    expect(strategies.map((strategy) => strategy.kind)).toEqual([
      'once',
      'sequence',
      'rotating',
    ]);
    expectTypeOf<ResponseStrategy>().toEqualTypeOf<
      | { readonly kind: 'once' }
      | { readonly kind: 'sequence' }
      | { readonly kind: 'rotating' }
    >();
  });

  it('NPC-MODEL-04: ConversationTopic has the canonical fields and no locality field', () => {
    const conversationTopic: ConversationTopic = {
      id: 'topic-ring',
      actorId: 'npc-1',
      match: { kind: 'askTell', objectIds: ['ring'] },
      isActive: { kind: 'not', of: { kind: 'flag-set', flag: 'never' } },
      responses: ['A ring?'],
      strategy: { kind: 'once' },
      effects: [],
      prompt: '(You could ask why.)',
    };
    expect(conversationTopic.id).toBe('topic-ring');
    expect(conversationTopic.actorId).toBe('npc-1');
    expect(conversationTopic.responses).toEqual(['A ring?']);
    expect(conversationTopic.prompt).toBe('(You could ask why.)');
    expectTypeOf<ConversationTopic>().toHaveProperty('isActive');
    expectTypeOf<ConversationTopic>().toHaveProperty('effects');
  });

  it('NPC-MODEL-05: ConversationNode has no actorId and carries its default topic', () => {
    const conversationNode: ConversationNode = {
      id: 'node-explain',
      isSticky: true,
      topics: [],
      defaultTopicId: 'default-ask-tell',
      onEnterEffects: [{ kind: 'message', text: 'Listen.' }],
    };
    expect(conversationNode.id).toBe('node-explain');
    expect(conversationNode.isSticky).toBe(true);
    expect(conversationNode.defaultTopicId).toBe('default-ask-tell');
    expect(conversationNode.onEnterEffects).toHaveLength(1);
    expectTypeOf<ConversationNode>().not.toHaveProperty('actorId');
  });

  it('NPC-MODEL-06: ResolvedTopic has exactly object, keyword and free-text', () => {
    const resolved: readonly ResolvedTopic[] = [
      { kind: 'object', objectId: 'ring' },
      { kind: 'keyword', topicId: 'topic-why' },
      { kind: 'free-text', text: 'whatever' },
    ];
    expect(resolved).toHaveLength(3);
    expectTypeOf<ResolvedTopic>().toEqualTypeOf<
      | { readonly kind: 'object'; readonly objectId: string }
      | { readonly kind: 'keyword'; readonly topicId: string }
      | { readonly kind: 'free-text'; readonly text: string }
    >();
  });

  it('NPC-MODEL-07: Actor identity is reused from ActorDefinition and persists as NpcStateDto', () => {
    const definition: ActorDefinition = {
      id: 'npc-1',
      aliases: ['guide'],
      initialStateId: 'ready',
    };
    const persisted: NpcStateDto = npcDto();
    expect(definition.id).toBe('npc-1');
    expect(persisted.stateId).toBe('talking');
    expect(definition.aliases).toEqual(['guide']);
    expect(persisted).toHaveProperty('knownTopics');
    expect(persisted).toHaveProperty('inventory');
    expect(persisted).toHaveProperty('topicUses');
  });

  it('NPC-MODEL-08: NpcStateDto omits activeNodeId when no node is active', () => {
    const withoutNode: NpcStateDto = npcDto();
    const withNode: NpcStateDto = npcDto({ activeNodeId: 'node-explain' });
    expect(withoutNode).not.toHaveProperty('activeNodeId');
    expect(withNode.activeNodeId).toBe('node-explain');
    expectTypeOf<NpcStateDto>()
      .toHaveProperty('stateId')
      .toEqualTypeOf<string>();
  });

  it('NPC-MODEL-09: TopicResolver.resolve and DialogueSystem.react are pure seams', () => {
    expectTypeOf<TopicResolver>().toHaveProperty('resolve');
    expectTypeOf<DialogueSystem>().toHaveProperty('react');
  });
});
