---
type: "query"
date: "2026-11-26T10:41:24.765528+00:00"
question: "Where are the area-change life reset and the ten Zone A InteractionRules rows owned?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["EffectApplier", "applyStateEffect", "applyEntityEffect", "areaChangeEvents", "InteractionRules", "SCENERY", "USE_INTERACTIONS", "PUT_INTERACTIONS", "putHandler", "useHandler"]
---

# Q: Where are the area-change life reset and the ten Zone A InteractionRules rows owned?

## Answer

EffectApplier.applyEntityEffect() move-player branch owns area entry; the new areaChangeEvents() helper delegates to applyStateEffect() (change-lives -> lives-changed) using bundle.areas.getById. InteractionRules.ts SCENERY / USE_INTERACTIONS / PUT_INTERACTIONS own the walkthrough §8.6 rows; putHandler/useHandler reach visible scenery and room items.

## Outcome

- Signal: useful

## Source Nodes

- EffectApplier
- applyStateEffect
- applyEntityEffect
- areaChangeEvents
- InteractionRules
- SCENERY
- USE_INTERACTIONS
- PUT_INTERACTIONS
- putHandler
- useHandler
- AreaDefinition