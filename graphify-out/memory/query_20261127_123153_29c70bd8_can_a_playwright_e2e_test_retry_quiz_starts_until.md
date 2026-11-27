---
type: "query"
date: "2026-11-27T12:31:53.562494+00:00"
question: "Can a Playwright e2e test retry quiz starts until a target option is not the final question?"
contributor: "graphify"
outcome: "corrected"
source_nodes: ["shuffleQuestionIds(),startQuiz(),startFromLiveSave()"]
---

# Q: Can a Playwright e2e test retry quiz starts until a target option is not the final question?

## Answer

No: startFromLiveSave restores the same v1 save and rngSeed, so shuffleQuestionIds() in src/core/effects/EffectApplier.ts:L260 gives the same order every run; the comma-bearing option q-ao-04 is always final. Assert its pass/completion effects instead of expecting a post-answer quiz state.

## Outcome

- Signal: corrected

## Source Nodes

- shuffleQuestionIds(),startQuiz(),startFromLiveSave()