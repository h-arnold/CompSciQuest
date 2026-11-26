---
type: "query"
date: "2026-11-26T21:12:17.796827+00:00"
question: "Where are the quiz pass requirement and remaining wrong-answer allowance derived for the view and rendered in the panel?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["QuizView", "GameViewData", "quizView()", "QuizPanel", ".refresh()", "appendLine()"]
---

# Q: Where are the quiz pass requirement and remaining wrong-answer allowance derived for the view and rendered in the panel?

## Answer

Canonical owners: QuizView/GameViewData (src/application/GameViewData.ts L27/L47, activeQuiz L54) and quizView() (src/application/Game.ts L175) derive both numbers from quiz.passMark and questionIds.length; QuizPanel (src/ui/QuizPanel.ts L6, .refresh() L15) renders them as text via appendLine() (src/ui/appendLine.ts L3). No duplicate canonical owner was found; the QuizPanel contested recency signal in LESSONS.md is graph freshness, not a second node.

## Outcome

- Signal: useful

## Source Nodes

- QuizView
- GameViewData
- quizView()
- QuizPanel
- .refresh()
- appendLine()