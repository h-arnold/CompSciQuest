---
type: "query"
date: "2026-11-25T14:54:15.963553+00:00"
question: "Where are QuizSystem, HintSystem and the composed reaction wired?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["QuizSystem", "HintSystem", ".react()", "createComposedReaction()", "ComposedReactionDependencies"]
---

# Q: Where are QuizSystem, HintSystem and the composed reaction wired?

## Answer

QuizSystem.handle() is a phase-3 seam at src/core/combat/QuizSystem.ts:L7 with no Game wiring; HintSystem.react() at src/core/hints/HintSystem.ts:L6; Game.productionReaction() currently injects hints: { react: () => [] } at Game.ts:L374; createComposedReaction() at src/application/ComposedReaction.ts:L26 composes scheduler, hazards, npcs, puzzles, hints; application-and-ui.md §8 pins QuizSystem at phase 3, not in the five-system phase-4 reaction.

## Outcome

- Signal: useful

## Source Nodes

- QuizSystem
- HintSystem
- .react()
- createComposedReaction()
- ComposedReactionDependencies