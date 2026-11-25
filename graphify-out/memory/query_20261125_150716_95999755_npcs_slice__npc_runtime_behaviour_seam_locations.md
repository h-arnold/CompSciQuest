---
type: "query"
date: "2026-11-25T15:07:16.611725+00:00"
question: "npcs slice: NPC runtime behaviour seam locations (DialogueSystem, TopicResolver, ConversationFlow, ConversationTopic/Node, ActorState, NpcStateDto, TopicMatch, ResolvedTopic, ResponseStrategy)"
contributor: "graphify"
outcome: "useful"
source_nodes: ["DialogueSystem", "TopicResolver", "ConversationTopic", "ConversationNode", "ActorState", "NpcStateDto", "ResolvedTopic", "TopicMatch", "ResponseStrategy"]
---

# Q: npcs slice: NPC runtime behaviour seam locations (DialogueSystem, TopicResolver, ConversationFlow, ConversationTopic/Node, ActorState, NpcStateDto, TopicMatch, ResolvedTopic, ResponseStrategy)

## Answer

src/core/npcs/DialogueSystem.ts:19,46,20,26,42; src/core/commands/TopicResolver.ts:11,25,12,19; src/core/npcs/ConversationFlow.ts; src/core/npcs/ConversationTopic.ts:7; src/core/npcs/ConversationNode.ts:5; src/core/npcs/ActorState.ts:4; src/core/NpcStateDto.ts:2; src/core/npcs/TopicMatch.ts:2; src/core/npcs/ResolvedTopic.ts:2; src/core/npcs/ResponseStrategy.ts:2

## Outcome

- Signal: useful

## Source Nodes

- DialogueSystem
- TopicResolver
- ConversationTopic
- ConversationNode
- ActorState
- NpcStateDto
- ResolvedTopic
- TopicMatch
- ResponseStrategy