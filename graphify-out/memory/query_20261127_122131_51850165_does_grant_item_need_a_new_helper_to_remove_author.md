---
type: "query"
date: "2026-11-27T12:21:31.844492+00:00"
question: "Does grant-item need a new helper to remove authored initialRoom copies?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["inventoryOf()", "applyItemEffect()"]
---

# Q: Does grant-item need a new helper to remove authored initialRoom copies?

## Answer

No. inventoryOf() is the existing inventory-lookup seam inside EffectApplier; reusing it in the grant branch avoids a parallel owner-scanning helper. Verified by the new EXTRACTED call edge from applyItemEffect() to inventoryOf() after graphify update.

## Outcome

- Signal: useful

## Source Nodes

- inventoryOf()
- applyItemEffect()