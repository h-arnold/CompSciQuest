---
type: "query"
date: "2026-11-25T14:50:00.877819+00:00"
question: "Where are the NPC runtime seams: TopicResolver, DialogueSystem, ConversationTopic/Node, ActorState, NpcStateDto, EffectApplier and the Game facade?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["TopicResolver DialogueSystem ConversationTopic ConversationNode ActorState NpcStateDto ConditionEvaluator EffectApplier ComposedReaction"]
---

# Q: Where are the NPC runtime seams: TopicResolver, DialogueSystem, ConversationTopic/Node, ActorState, NpcStateDto, EffectApplier and the Game facade?

## Answer

Canonical owners: TopicResolver src/core/commands/TopicResolver.ts:L6; DialogueSystem src/core/npcs/DialogueSystem.ts:L5 (.react L6); ConversationTopic L7, ConversationNode L5, ActorState L4, ResolvedTopic/TopicMatch/ResponseStrategy L2 of same-named files under src/core/npcs/; NpcStateDto src/core/NpcStateDto.ts:L2; ConversationPanel src/ui/ConversationPanel.ts:L6 (.refresh L15); ConditionEvaluator src/core/rules/ConditionEvaluator.ts:L7; EffectApplier src/core/effects/EffectApplier.ts:L13; ComposedReaction src/application/ComposedReaction.ts.

## Outcome

- Signal: useful

## Source Nodes

- TopicResolver DialogueSystem ConversationTopic ConversationNode ActorState NpcStateDto ConditionEvaluator EffectApplier ComposedReaction