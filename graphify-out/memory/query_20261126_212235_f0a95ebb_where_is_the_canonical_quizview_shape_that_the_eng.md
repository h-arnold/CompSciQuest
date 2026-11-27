---
type: "query"
date: "2026-11-26T21:22:35.507893+00:00"
question: "Where is the canonical QuizView shape that the engine-issue-30 pass-mark presentation drift affects?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["QuizView", "GameViewData", "quizView()", "QuizPanel"]
---

# Q: Where is the canonical QuizView shape that the engine-issue-30 pass-mark presentation drift affects?

## Answer

application-and-ui.md 7.2 View data owns QuizView; reconciled to seven fields including passMark and remainingWrong derived by Game.getViewData() from quiz.passMark and questionCount.

## Outcome

- Signal: useful

## Source Nodes

- QuizView
- GameViewData
- quizView()
- QuizPanel