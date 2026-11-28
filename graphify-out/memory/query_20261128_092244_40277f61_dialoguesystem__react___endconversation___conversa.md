---
type: "query"
date: "2026-11-28T09:22:44.113225+00:00"
question: "DialogueSystem .react() endConversation() ConversationFlow.ts ActorState byeCommand npcHandler() message() formatEvent CommandTable.ts — silent bye acknowledgement"
contributor: "graphify"
outcome: "useful"
source_nodes: ["DialogueSystem", ".react()", "endConversation()", "npcHandler()", "formatEvent()", "COMMAND_TABLE"]
---

# Q: DialogueSystem .react() endConversation() ConversationFlow.ts ActorState byeCommand npcHandler() message() formatEvent CommandTable.ts — silent bye acknowledgement

## Answer

Canonical owner for the explicit bye acknowledgement is DialogueSystem.ts::react() at L21 (non-talking exact message stays in npcHandlers.ts::npcHandler() at L24). endConversation() at ConversationFlow.ts:L234 keeps the onExit -> exit-node -> conversation-ended -> restore order; formatEvent.ts renders message and suppresses conversation-ended; COMMAND_TABLE maps the goodbye alias at CommandTable.ts:L134.

## Outcome

- Signal: useful

## Source Nodes

- DialogueSystem
- .react()
- endConversation()
- npcHandler()
- formatEvent()
- COMMAND_TABLE