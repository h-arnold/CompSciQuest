---
type: "query"
date: "2026-11-27T13:23:11.498030+00:00"
question: "Where are item ownership and current-room visibility owned, and can a block placed in a visible fixture stay nameable?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["putHandler()", "takeHandler()", "isVisible()", "visibleOwners()", "transferItem()", "inventoryOf()", "NameResolver", "describeTarget()", "itemVisibility"]
---

# Q: Where are item ownership and current-room visibility owned, and can a block placed in a visible fixture stay nameable?

## Answer

Before this slice visibleOwners() in verbs/index.ts only saw player plus current room, and NameResolver duplicated that set; EffectApplier.inventoryOf() is the sole mutable owner lookup. No canonical node owned cross-inventory owner lookup. Added src/core/commands/ItemVisibility.ts as the shared read-only seam and wired NameResolver and verbs/index.ts to it; open non-portable fixture containers get derived placement/examine/take wording from bundle names.

## Outcome

- Signal: useful

## Source Nodes

- putHandler()
- takeHandler()
- isVisible()
- visibleOwners()
- transferItem()
- inventoryOf()
- NameResolver
- describeTarget()
- itemVisibility