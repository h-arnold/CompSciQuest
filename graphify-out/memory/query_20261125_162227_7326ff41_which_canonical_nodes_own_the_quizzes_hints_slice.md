---
type: "query"
date: "2026-11-25T16:22:27.889258+00:00"
question: "Which canonical nodes own the quizzes-hints slice seam, quiz-passed condition, panel rendering and score guard?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["QuizSystem,QuizSystem.handle,HintSystem,HintSystem.react,ConditionEvaluator,ScoreTracker.quizEnded,QuizPanel,QuizPanel.refresh,HintPanel,HintPanel.refresh,GameViewData"]
---

# Q: Which canonical nodes own the quizzes-hints slice seam, quiz-passed condition, panel rendering and score guard?

## Answer

QuizSystem.handle is the phase-3 answer seam (src/core/combat/QuizSystem.ts:7); HintSystem.react is the phase-4 hint seam (src/core/hints/HintSystem.ts:6); ConditionEvaluator owns quiz-passed (src/core/rules/ConditionEvaluator.ts:62); ScoreTracker.quizEnded owns pass scoring (src/core/scoring/ScoreTracker.ts:82); QuizPanel.refresh and HintPanel.refresh own rendering (src/ui/*.ts:15); Game.getViewData is the view mapper with hints/activeQuiz still stubbed (src/application/Game.ts:412).

## Outcome

- Signal: useful

## Source Nodes

- QuizSystem,QuizSystem.handle,HintSystem,HintSystem.react,ConditionEvaluator,ScoreTracker.quizEnded,QuizPanel,QuizPanel.refresh,HintPanel,HintPanel.refresh,GameViewData