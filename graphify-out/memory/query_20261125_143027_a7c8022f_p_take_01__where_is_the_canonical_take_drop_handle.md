---
type: "query"
date: "2026-11-25T14:30:27.838887+00:00"
question: "P-TAKE-01: where is the canonical take/drop handler and which item fields drive its refusal?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["takeHandler() visibleOwners() ItemDefinition putHandler() message() transferItem() getCommandHandler CommandHandler"]
---

# Q: P-TAKE-01: where is the canonical take/drop handler and which item fields drive its refusal?

## Answer

takeHandler() in src/core/commands/verbs/index.ts:L143 is the single owner; it now gates only take on ItemDefinition.portable === false (src/content/ItemDefinition.ts:L2, refusalText L11) and emits a single message via message() (L8), leaving drop untouched. tools/content/adapt.ts:bundleOf() L50 preserves optional refusalText.

## Outcome

- Signal: useful

## Source Nodes

- takeHandler() visibleOwners() ItemDefinition putHandler() message() transferItem() getCommandHandler CommandHandler