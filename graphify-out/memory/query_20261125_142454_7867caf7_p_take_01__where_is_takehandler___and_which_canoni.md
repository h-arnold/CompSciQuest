---
type: "query"
date: "2026-11-25T14:24:54.956188+00:00"
question: "P-TAKE-01: where is takeHandler() and which canonical nodes gate take/drop and define ItemDefinition?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["takeHandler()", "visibleOwners()", "ItemDefinition", "putHandler()", "message()", "transferItem()", "VerbHandlers.test.ts"]
---

# Q: P-TAKE-01: where is takeHandler() and which canonical nodes gate take/drop and define ItemDefinition?

## Answer

Canonical owner is takeHandler() in src/core/commands/verbs/index.ts:L143 (HANDLERS drop: takeHandler at L199, message() at L8). visibleOwners() at L12 defines visibility; ItemDefinition at src/content/ItemDefinition.ts:L2 (portable at L6) currently lacks refusalText; transferItem() at src/core/effects/EffectApplier.ts:L29 applies transfers; VerbHandlers.test.ts is the test home. No duplicate claimants found. Two new red tests fail on exact message assertion ('Taken.' instead of the fallback/authored text) while portable take and drop regression guards pass.

## Outcome

- Signal: useful

## Source Nodes

- takeHandler()
- visibleOwners()
- ItemDefinition
- putHandler()
- message()
- transferItem()
- VerbHandlers.test.ts