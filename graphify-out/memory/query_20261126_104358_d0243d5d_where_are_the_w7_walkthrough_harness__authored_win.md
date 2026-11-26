---
type: "query"
date: "2026-11-26T10:43:58.306130+00:00"
question: "Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["e2e_w7_opening_walkthrough_spec,AreaProgress,Session,MILL_FLAGS,resetQuiz()"]
---

# Q: Where are the W7 walkthrough harness, authored win path, area progress and life reset defined?

## Answer

e2e/w7-opening-walkthrough.spec.ts owns the scoped harness (GATE_FLAGS, runStep, contrastColours). src/core/AreaProgress.ts owns AreaProgress; src/core/lifecycle/Session.ts owns isWon(); tests/turn/AuthoredWinPathRun.ts defines MILL_FLAGS and lastWinningBatch(); src/core/effects/EffectApplier.ts:279 owns resetQuiz(). get_node locations cited above.

## Outcome

- Signal: useful

## Source Nodes

- e2e_w7_opening_walkthrough_spec,AreaProgress,Session,MILL_FLAGS,resetQuiz()