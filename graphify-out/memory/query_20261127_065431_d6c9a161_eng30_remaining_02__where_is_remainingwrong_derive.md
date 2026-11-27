---
type: "query"
date: "2026-11-27T06:54:31.225188+00:00"
question: "ENG30-REMAINING-02: where is remainingWrong derived and which QuizView node is canonical for the red tests?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["quizView()", "QuizView", "QuizPanel", "QuizStateDto"]
---

# Q: ENG30-REMAINING-02: where is remainingWrong derived and which QuizView node is canonical for the red tests?

## Answer

quizView() in src/application/Game.ts:175 builds QuizView (src/application/GameViewData.ts:27) and is the canonical node; QuizPanel (src/ui/QuizPanel.ts:6) only renders the supplied fields. remainingWrong must be max(0,(QuizStateDto.questionIds.length - quiz.passMark)-(answers.length-correctCount)).

## Outcome

- Signal: useful

## Source Nodes

- quizView()
- QuizView
- QuizPanel
- QuizStateDto