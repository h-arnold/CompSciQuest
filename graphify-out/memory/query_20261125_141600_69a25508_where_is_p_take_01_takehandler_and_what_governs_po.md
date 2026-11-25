---
type: "query"
date: "2026-11-25T14:16:00.119240+00:00"
question: "Where is P-TAKE-01 takeHandler and what governs portable items?"
contributor: "graphify"
outcome: "useful"
---

# Q: Where is P-TAKE-01 takeHandler and what governs portable items?

## Answer

takeHandler() verbs/index.ts:143 ignores ItemDefinition.portable (ItemDefinition.ts:6) and blindly transfers visible items; putHandler() :110 also ignores portable despite app-and-ui.md §5.1 L327. Non-portable fixtures at tests/fixtures/parser.ts:95,103. Refusal wording contract is open (branch-matrix.md:896-899).

## Outcome

- Signal: useful