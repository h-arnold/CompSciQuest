---
type: "query"
date: "2026-11-25T16:53:47.558936+00:00"
question: "Which nodes own quiz and hint delivery in the quiz-hints slice?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["QuizSystem,HintSystem,EffectApplier,ScoreTracker,Session,Game,GameViewData"]
---

# Q: Which nodes own quiz and hint delivery in the quiz-hints slice?

## Answer

QuizSystem owns the phase-3 answer seam; HintSystem owns explicit and automatic phase-4 hint delivery; EffectApplier owns the extended quiz/hint effect mutations; ScoreTracker remains the sole earnedScore writer; Session owns the win transition; Game wires all systems and view data.

## Outcome

- Signal: useful

## Source Nodes

- QuizSystem,HintSystem,EffectApplier,ScoreTracker,Session,Game,GameViewData