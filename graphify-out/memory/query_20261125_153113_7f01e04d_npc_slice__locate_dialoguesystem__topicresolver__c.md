---
type: "query"
date: "2026-11-25T15:31:13.315306+00:00"
question: "NPC slice: locate DialogueSystem, TopicResolver, ConversationTopic, ConversationNode, ActorState, NpcStateDto, ResolvedTopic, TopicMatch, ResponseStrategy, ConversationPanel, ConditionEvaluator, EffectApplier"
contributor: "graphify"
outcome: "useful"
source_nodes: ["DialogueSystem", "TopicResolver", "ConversationFlow", "TopicSelection"]
---

# Q: NPC slice: locate DialogueSystem, TopicResolver, ConversationTopic, ConversationNode, ActorState, NpcStateDto, ResolvedTopic, TopicMatch, ResponseStrategy, ConversationPanel, ConditionEvaluator, EffectApplier

## Answer

DialogueSystem=src/core/npcs/DialogueSystem.ts:L20/.react() L21; TopicResolver=src/core/commands/TopicResolver.ts:L11/.resolve() L12/createTopicResolver() L25; ConversationTopic=src/core/npcs/ConversationTopic.ts:L7; ConversationNode=src/core/npcs/ConversationNode.ts:L5; ActorState=src/core/npcs/ActorState.ts:L4; NpcStateDto=src/core/NpcStateDto.ts:L2; ResolvedTopic/TopicMatch/ResponseStrategy=L2 of same-named files; ConversationPanel=src/ui/ConversationPanel.ts:L6/.refresh() L15; ConditionEvaluator=src/core/rules/ConditionEvaluator.ts:L7/.evaluate() L8; EffectApplier=src/core/effects/EffectApplier.ts:L13/.apply() L14; ConversationFlow=src/core/npcs/ConversationFlow.ts:L1/handleConversationTopic() L191/endConversation() L135/hasHandledNpcTurn() L324; TopicSelection=src/core/npcs/TopicSelection.ts:L1/selectTopic() L123; GameViewData=src/application/GameViewData.ts:L47; SaveManager=src/application/SaveManager.ts:L1

## Outcome

- Signal: useful

## Source Nodes

- DialogueSystem
- TopicResolver
- ConversationFlow
- TopicSelection