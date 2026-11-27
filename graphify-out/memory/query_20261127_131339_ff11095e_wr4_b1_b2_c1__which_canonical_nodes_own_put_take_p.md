---
type: "query"
date: "2026-11-27T13:13:39.565604+00:00"
question: "WR4-B1/B2/C1: which canonical nodes own put/take placement feedback, transfer-item ownership and out-of-room give feedback?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["putHandler()", "takeHandler()", "transferItem()", "inventoryOf()", "NameResolver", "handleConversationTopic()", "isActorOutOfRoom()", "conversationCommand()"]
---

# Q: WR4-B1/B2/C1: which canonical nodes own put/take placement feedback, transfer-item ownership and out-of-room give feedback?

## Answer

Canonical owners: putHandler() at src/core/commands/verbs/index.ts:L149 and takeHandler() at L235 emit the transfer-item and result message effects; transferItem()/inventoryOf() at src/core/effects/EffectApplier.ts:L39/L27 are the sole one-owner mutators; NameResolver.resolve() at src/core/commands/NameResolver.ts:L7/L32 gates visibility; putInteraction() at src/core/commands/InteractionRules.ts:L462 adds no flags for these fixture IDs. Out-of-room absence text is owned by handleConversationTopic() at src/core/npcs/ConversationFlow.ts:L293 with the message at L341/L343 using isActorOutOfRoom() at src/core/npcs/TopicSelection.ts:L271. End-to-end give feedback is reached through conversationCommand() at src/application/commandResolution.ts:L175. Start with putHandler() and handleConversationTopic() for this slice.

## Outcome

- Signal: useful

## Source Nodes

- putHandler()
- takeHandler()
- transferItem()
- inventoryOf()
- NameResolver
- handleConversationTopic()
- isActorOutOfRoom()
- conversationCommand()