---
type: "query"
date: "2026-11-26T17:38:56.275174+00:00"
question: "ENG13-INVENTORY-01: which nodes own the inventory reply and the raw-ID fallback convention?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["inventoryHandler(),takeHandler(),.getById(),ItemDefinition,ContentBundle,formatEvent(),topicLabel(),verbs/index.ts"]
---

# Q: ENG13-INVENTORY-01: which nodes own the inventory reply and the raw-ID fallback convention?

## Answer

inventoryHandler() at src/core/commands/verbs/index.ts L249 is the sole inventory renderer. It now maps each carried ID through context.bundle.items.getById(id)?.name ?? id using the Catalogue contract (.getById() at src/content/Catalogue.ts L4; ItemDefinition at src/content/ItemDefinition.ts L2) and the topicLabel() fallback convention at src/ui/formatEvent.ts L7. formatEvent() L11 already suppresses item-moved. Duplicate/bypass scan: exactly one inventoryHandler() code node, no reimplementation of 'You are carrying' outside it.

## Outcome

- Signal: useful

## Source Nodes

- inventoryHandler(),takeHandler(),.getById(),ItemDefinition,ContentBundle,formatEvent(),topicLabel(),verbs/index.ts