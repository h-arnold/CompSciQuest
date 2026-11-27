---
type: "query"
date: "2026-11-27T13:56:36.508153+00:00"
question: "Which SaveManager reference validation quarantines a fixture-owned item inventory key, and what is the smallest canonical fix?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["hasValidPositionReferences()", "hasValidReferences()", "transferItem()", "inventoryOf()", "hasUniqueItemOwnership()"]
---

# Q: Which SaveManager reference validation quarantines a fixture-owned item inventory key, and what is the smallest canonical fix?

## Answer

hasValidPositionReferences() in src/application/SaveManager.ts required every state.rooms key to resolve via bundle.rooms.getById(). transferItem() writes fixture-held items under an item ID key, so the save was rejected as invalid-content. The reference check now accepts bundle.rooms.getById(id) ?? bundle.items.getById(id); the player position check still requires a real room and all other validation stays unchanged.

## Outcome

- Signal: useful

## Source Nodes

- hasValidPositionReferences()
- hasValidReferences()
- transferItem()
- inventoryOf()
- hasUniqueItemOwnership()