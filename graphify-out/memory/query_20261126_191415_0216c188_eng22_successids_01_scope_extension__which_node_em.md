---
type: "query"
date: "2026-11-26T19:14:15.205094+00:00"
question: "ENG22-SUCCESSIDS-01 scope extension: which node emits the derived complete-topic effect on a puzzle solve, causing duplicate topic-completed events when onSolve already declares it?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["solveEffects", "PuzzleSystem", "applyStateEffect", "EffectApplier", "createEffectApplier", "GameEvent"]
---

# Q: ENG22-SUCCESSIDS-01 scope extension: which node emits the derived complete-topic effect on a puzzle solve, causing duplicate topic-completed events when onSolve already declares it?

## Answer

solveEffects() at src/core/puzzles/PuzzleSystem.ts L75 always appends a derived complete-topic effect after puzzle.onSolve; applyStateEffect() at src/core/effects/EffectApplier.ts L94 emits one topic-completed event per complete-topic effect (L110-L120). The canonical render-side formatter is formatEvent() at src/ui/formatEvent.ts L11. The fix belongs in solveEffects(), not in rendering or scoring.

## Outcome

- Signal: useful

## Source Nodes

- solveEffects
- PuzzleSystem
- applyStateEffect
- EffectApplier
- createEffectApplier
- GameEvent