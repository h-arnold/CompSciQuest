---
type: "query"
date: "2026-11-27T11:51:50.178284+00:00"
question: "Where does putHandler() choose toOwnerId for an authored item fixture and how is putInteraction() reused?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["putHandler()", "putInteraction()", "transferItem()", "hasValidReferences()"]
---

# Q: Where does putHandler() choose toOwnerId for an authored item fixture and how is putInteraction() reused?

## Answer

putHandler() (src/core/commands/verbs/index.ts L122) maps scenery and authored PUT-interaction fixture targets to the current room ID; it computes putInteraction(command, context) once and reuses its flags, so item-rogue-thread into item-counterfoil-drawer no longer creates a phantom room key.

## Outcome

- Signal: useful

## Source Nodes

- putHandler()
- putInteraction()
- transferItem()
- hasValidReferences()