---
type: "query"
date: "2026-11-26T19:21:08.141767+00:00"
question: "E2E-22-01: does a single puzzle solve still print the friendly completion line twice?"
contributor: "graphify"
outcome: "corrected"
source_nodes: ["solveEffects()", "formatEvent()"]
---

# Q: E2E-22-01: does a single puzzle solve still print the friendly completion line twice?

## Answer

Resolved: the earlier duplicate observation was correct at the time, but the engine fix in PuzzleSystem.solveEffects() now avoids adding a derived complete-topic when onSolve already completes the same topic. Browser re-check shows exactly one 'Topic completed: Data types.' line; the e2e assertion was restored to toHaveLength(1) and both ENG22 tests pass.

## Outcome

- Signal: corrected

## Source Nodes

- solveEffects()
- formatEvent()