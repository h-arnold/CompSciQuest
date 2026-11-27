---
type: "query"
date: "2026-11-26T21:28:29.286368+00:00"
question: "Where are the quiz pass requirement and remaining wrong-answer allowance derived and rendered for ENG30-PASSMARK-01?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["QuizView", "quizView()", "QuizPanel", ".refresh()", "30. Quiz pass/fail threshold is invisible"]
---

# Q: Where are the quiz pass requirement and remaining wrong-answer allowance derived and rendered for ENG30-PASSMARK-01?

## Answer

QuizView (src/application/GameViewData.ts L27) carries passMark and remainingWrong; Game.ts::quizView() derives them from bundle.quizzes.getById(quizId).passMark and state.quiz.questionIds.length; QuizPanel.refresh() (src/ui/QuizPanel.ts L15) appends a text-only paragraph after the numbered option divs.

## Outcome

- Signal: useful

## Source Nodes

- QuizView
- quizView()
- QuizPanel
- .refresh()
- 30. Quiz pass/fail threshold is invisible