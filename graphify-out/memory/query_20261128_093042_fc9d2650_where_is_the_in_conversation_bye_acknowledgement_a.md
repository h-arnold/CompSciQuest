---
type: "query"
date: "2026-11-28T09:30:42.309931+00:00"
question: "Where is the in-conversation bye acknowledgement and conversation-exit seam owned?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["DialogueSystem", ".react()", "endConversation()", "ConversationFlow.ts"]
---

# Q: Where is the in-conversation bye acknowledgement and conversation-exit seam owned?

## Answer

DialogueSystem.react() bye branch (src/core/npcs/DialogueSystem.ts:L21) delegates to endConversation() (src/core/npcs/ConversationFlow.ts:L234); the two .react() nodes are distinct classes (HazardSystem.ts:L15 vs DialogueSystem.ts:L21), not a duplicate owner.

## Outcome

- Signal: useful

## Source Nodes

- DialogueSystem
- .react()
- endConversation()
- ConversationFlow.ts