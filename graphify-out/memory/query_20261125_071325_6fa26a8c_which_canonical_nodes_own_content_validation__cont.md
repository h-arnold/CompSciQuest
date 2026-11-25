---
type: "query"
date: "2026-11-25T07:13:25.676957+00:00"
question: "Which canonical nodes own content validation, content loading, stub bundle and NPC conversation types before adding toolchain modules?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["validateContent(),loadContent(),stubBundle,ConversationTopic,ConversationNode,scripts,package.json"]
---

# Q: Which canonical nodes own content validation, content loading, stub bundle and NPC conversation types before adding toolchain modules?

## Answer

validateContent() src/content/validateContent.ts:L246 is the canonical runtime validator; loadContent() src/content/index.ts:L7 and stubBundle src/content/stub/index.ts:L94 own bundle assembly; ConversationTopic src/core/npcs/ConversationTopic.ts:L7 and ConversationNode src/core/npcs/ConversationNode.ts:L5 own NPC runtime shapes; scripts package.json:L7 has no content:* entries. No tools/content owner exists.

## Outcome

- Signal: useful

## Source Nodes

- validateContent(),loadContent(),stubBundle,ConversationTopic,ConversationNode,scripts,package.json