---
type: "query"
date: "2026-11-28T09:30:42.509845+00:00"
question: "Which existing owner applies a message effect into buffered events in core?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["applyAll()", "applyMessage()", "EffectApplier", "farewell()"]
---

# Q: Which existing owner applies a message effect into buffered events in core?

## Answer

applyAll() at src/core/npcs/ConversationFlow.ts:L115 is the canonical seam but is file-private; HintSystem.applyMessage() (src/core/hints/HintSystem.ts:L115) is a different subsystem. Reused EffectApplier.apply() via a small local farewell() helper in DialogueSystem.ts; no duplicate canonical node.

## Outcome

- Signal: useful

## Source Nodes

- applyAll()
- applyMessage()
- EffectApplier
- farewell()