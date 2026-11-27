---
type: "query"
date: "2026-11-27T07:03:15.409451+00:00"
question: "Where is the conditional use producer, authored useText mapping and condition gate owned for W6S-01..04?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["useInteraction()", "authoredUseEffects()", "ItemDefinition", "useTextOf()", "useHandler()", "ConditionEvaluator"]
---

# Q: Where is the conditional use producer, authored useText mapping and condition gate owned for W6S-01..04?

## Answer

useInteraction() in src/core/commands/InteractionRules.ts is the sole runtime producer; authoredUseEffects() reads ItemDefinition.useText from the bundle and state flags. tools/content/adapt.ts maps YAML useText; tools/content/schema.ts validates it. No duplicate producer exists.

## Outcome

- Signal: useful

## Source Nodes

- useInteraction()
- authoredUseEffects()
- ItemDefinition
- useTextOf()
- useHandler()
- ConditionEvaluator