---
type: "query"
date: "2026-11-25T14:50:33.802908+00:00"
question: "F1: which handler selects refusalText for a non-portable take, and where is the fallback literal produced?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["takeHandler() message() ItemDefinition transferItem()"]
---

# Q: F1: which handler selects refusalText for a non-portable take, and where is the fallback literal produced?

## Answer

takeHandler() at src/core/commands/verbs/index.ts is the single owner of take and drop; its message() call at L156 selects item.refusalText with a fallback to the pinned literal. The ?? -> || change was made there so an empty string is treated as absent; no other producer of the fallback or refusalText exists outside the declaration, adapter and test mirror.

## Outcome

- Signal: useful

## Source Nodes

- takeHandler() message() ItemDefinition transferItem()