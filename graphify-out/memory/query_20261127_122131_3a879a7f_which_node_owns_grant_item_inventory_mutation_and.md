---
type: "query"
date: "2026-11-27T12:21:31.723878+00:00"
question: "Which node owns grant-item inventory mutation and how does it keep one owner per item?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["applyItemEffect()", "inventoryOf()", "transferItem()", "hasUniqueItemOwnership()"]
---

# Q: Which node owns grant-item inventory mutation and how does it keep one owner per item?

## Answer

applyItemEffect() (src/core/effects/EffectApplier.ts L70) is the sole owner of grant-item. It reuses inventoryOf() (L27) to remove every copy of the granted item from player, NPC and room inventories, then pushes one copy to the player, emitting the unchanged item-moved event with fromOwnerId 'world' and toOwnerId 'player'.

## Outcome

- Signal: useful

## Source Nodes

- applyItemEffect()
- inventoryOf()
- transferItem()
- hasUniqueItemOwnership()