---
type: "query"
date: "2026-11-26T21:16:20.272918+00:00"
question: "Where are the quiz pass-mark requirement and remaining wrong-answer allowance derived and rendered for ENG30-PASSMARK-01?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["QuizView", "quizView()", "QuizPanel", "passMarkFindings()"]
---

# Q: Where are the quiz pass-mark requirement and remaining wrong-answer allowance derived and rendered for ENG30-PASSMARK-01?

## Answer

QuizView in src/application/GameViewData.ts owns the two new fields; quizView() in src/application/Game.ts derives passMark from bundle.quizzes.getById(quizId).passMark and remainingWrong = questionCount - passMark; QuizPanel.refresh() renders them as textContent in a non-div child, leaving prompt and numbered options intact. passMarkFindings() in tools/content/gates/quiz.ts is authoring validation only, not a view derivation.

## Outcome

- Signal: useful

## Source Nodes

- QuizView
- quizView()
- QuizPanel
- passMarkFindings()