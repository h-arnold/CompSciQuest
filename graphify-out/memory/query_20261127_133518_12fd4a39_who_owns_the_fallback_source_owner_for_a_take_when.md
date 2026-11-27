---
type: "query"
date: "2026-11-27T13:35:18.138926+00:00"
question: "Who owns the fallback source owner for a take when no visible open container branch applies (WR4-B1 closed-cabinet retrieval)?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["takeHandler(),visibleContainerOwner(),itemVisibility,.ownerOf(),transferItem()"]
---

# Q: Who owns the fallback source owner for a take when no visible open container branch applies (WR4-B1 closed-cabinet retrieval)?

## Answer

takeHandler() at src/core/commands/verbs/index.ts:L280 owns the fallback. It now derives fromOwnerId from itemVisibility.ownerOf(context.state, itemId) (itemVisibility at src/core/commands/ItemVisibility.ts:L8, .ownerOf() L10) with the current room as fallback; visibleContainerOwner() L47 still owns the specific open-container wording, and drop keeps player -> room. transferItem() at src/core/effects/EffectApplier.ts:L39 remains the sole transfer mutator. No new owner or flag was introduced.

## Outcome

- Signal: useful

## Source Nodes

- takeHandler(),visibleContainerOwner(),itemVisibility,.ownerOf(),transferItem()