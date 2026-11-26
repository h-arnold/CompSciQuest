---
type: "query"
date: "2026-11-26T19:17:03.661248+00:00"
question: "Which canonical node derives a puzzle's completion effect, and is there a duplicate derivation bypassing it?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["solveEffects(),PuzzleSystem,applyStateEffect(),EffectApplier,GameEvent"]
---

# Q: Which canonical node derives a puzzle's completion effect, and is there a duplicate derivation bypassing it?

## Answer

solveEffects() at src/core/puzzles/PuzzleSystem.ts L75 (called by reactionFor() at L140) is the sole derivation point. It now omits the derived complete-topic when puzzle.onSolve already completes the same topic; EffectApplier (src/core/effects/EffectApplier.ts L110) remains the sole mutator emitting topic-completed. No duplicate derivation or bypass found in src/core; authored onSolve entries are content data, not a second implementation.

## Outcome

- Signal: useful

## Source Nodes

- solveEffects(),PuzzleSystem,applyStateEffect(),EffectApplier,GameEvent