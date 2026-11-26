---
type: "query"
date: "2026-11-26T17:46:09.356411+00:00"
question: "ENG13-INVENTORY-01 — which nodes own inventory rendering, catalogue name resolution and item-moved suppression?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["inventoryHandler()", "formatEvent()", "takeHandler()", "verbs/index.ts", "OutputLog", "GameWindow"]
---

# Q: ENG13-INVENTORY-01 — which nodes own inventory rendering, catalogue name resolution and item-moved suppression?

## Answer

inventoryHandler() at src/core/commands/verbs/index.ts resolves names via context.bundle.items.getById(id)?.name ?? id and emits 'You are carrying <names>.'; formatEvent() at src/ui/formatEvent.ts suppresses item-moved. Verified in a real browser: pickup and inventory show no moved-from or to-player debug fragments.

## Outcome

- Signal: useful

## Source Nodes

- inventoryHandler()
- formatEvent()
- takeHandler()
- verbs/index.ts
- OutputLog
- GameWindow