---
type: "query"
date: "2026-11-25T14:48:32.564477+00:00"
question: "F1: does an authored refusalText of '' on a non-portable item use the fallback in takeHandler()?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["takeHandler() message() VerbHandlers.test.ts ItemDefinition visibleOwners() transferItem()"]
---

# Q: F1: does an authored refusalText of '' on a non-portable item use the fallback in takeHandler()?

## Answer

No: takeHandler() at src/core/commands/verbs/index.ts:L155 uses item.refusalText ?? fallback, so '' is treated as present and emits a blank message. The user decided on 2026-11-25 that '' is absent; the canonical owner to fix is takeHandler() with message() at L8.

## Outcome

- Signal: useful

## Source Nodes

- takeHandler() message() VerbHandlers.test.ts ItemDefinition visibleOwners() transferItem()