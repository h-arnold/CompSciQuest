---
type: "query"
date: "2026-11-25T07:57:12.754071+00:00"
question: "ConversationNode ConversationTopic generateContent generateNodes npcData generatedFile topicActorFindings nodeTopicFindings NpcGates.test.ts"
contributor: "graphify"
outcome: "useful"
source_nodes: ["generateContent(),ConversationNode,ConversationTopic"]
---

# Q: ConversationNode ConversationTopic generateContent generateNodes npcData generatedFile topicActorFindings nodeTopicFindings NpcGates.test.ts

## Answer

Canonical node for actorId emission is generateContent()/nodeEntry() at tools/content/generate.ts:L147 (ConversationNode at src/core/npcs/ConversationNode.ts:L5, ConversationTopic at src/core/npcs/ConversationTopic.ts:L7); content-rules.md §4.3 point 2 and §8 require topic actorId retained, node actorId dropped.

## Outcome

- Signal: useful

## Source Nodes

- generateContent(),ConversationNode,ConversationTopic