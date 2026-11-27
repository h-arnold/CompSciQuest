---
type: "query"
date: "2026-11-27T11:30:26.453042+00:00"
question: "Where is the approved dial blocked string pinned in tests, and which authority superseded it in round 2?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["ConditionalUseSeam.test.ts", "authoredUseEffects()", "useHandler()"]
---

# Q: Where is the approved dial blocked string pinned in tests, and which authority superseded it in round 2?

## Answer

tests/turn/ConditionalUseSeam.test.ts pins it in APPROVED_DIAL_BLOCKED; the round-2 superseding string is content-bible.md §12 (2026-11-27) and the accepted useText.blocked card field in docs/content/assistance-ward/rooms.yaml, regenerated into src/content/authored/items.ts. Runtime owner is authoredUseEffects() in InteractionRules.ts via useHandler() in verbs/index.ts.

## Outcome

- Signal: useful

## Source Nodes

- ConditionalUseSeam.test.ts
- authoredUseEffects()
- useHandler()