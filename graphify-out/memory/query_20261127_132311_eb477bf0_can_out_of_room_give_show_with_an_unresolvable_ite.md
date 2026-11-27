---
type: "query"
date: "2026-11-27T13:23:11.618478+00:00"
question: "Can out-of-room give/show with an unresolvable item emit the canonical absence line without a new Command variant or content card?"
contributor: "graphify"
outcome: "corrected"
source_nodes: ["conversationCommand()", "npcHandler()", "handleConversationTopic()", "isActorOutOfRoom()"]
---

# Q: Can out-of-room give/show with an unresolvable item emit the canonical absence line without a new Command variant or content card?

## Answer

No. give/show require a resolved itemId in the canonical Command union (application-and-ui.md §5); the absence branch is reached only through handleConversationTopic() with a conversational phrase, and DialogueSystem short-circuits give/show whose item is not held. A canonical refusal shape or documented reinterpretation is needed; not attempted in this slice.

## Outcome

- Signal: corrected

## Source Nodes

- conversationCommand()
- npcHandler()
- handleConversationTopic()
- isActorOutOfRoom()