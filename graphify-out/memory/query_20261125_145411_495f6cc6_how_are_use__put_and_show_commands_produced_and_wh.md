---
type: "query"
date: "2026-11-25T14:54:11.402523+00:00"
question: "How are use, put and show commands produced and which handlers map them today?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["putHandler()", "HANDLERS", "resolveGameCommand()", "ContentBundle", "TransferItem"]
---

# Q: How are use, put and show commands produced and which handlers map them today?

## Answer

putHandler() at verbs/index.ts:L111 returns transfer-item plus message; HANDLERS maps use to a fixed message at L212 and show to npcHandler at L233; Game.resolveGameCommand() resolves use/put at Game.ts:L257-L265; no useHandler/showHandler node exists. ContentBundle at ContentBundle.ts:L18 has no item-use catalogue; useNotes is authoring-only per content-rules.md D4.

## Outcome

- Signal: useful

## Source Nodes

- putHandler()
- HANDLERS
- resolveGameCommand()
- ContentBundle
- TransferItem