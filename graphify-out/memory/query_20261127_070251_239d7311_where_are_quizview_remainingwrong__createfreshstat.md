---
type: "query"
date: "2026-11-27T07:02:51.907302+00:00"
question: "Where are QuizView.remainingWrong, createFreshState and the fresh-start save writes defined, and which seam owns them?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["quizView(),QuizView,QuizPanel,Game,createInitial(),SaveManager,.save()"]
---

# Q: Where are QuizView.remainingWrong, createFreshState and the fresh-start save writes defined, and which seam owns them?

## Answer

quizView() in src/application/Game.ts derives remainingWrong with Math.max(0, questionCount - passMark - (answers.length - correctCount)); QuizView in src/application/GameViewData.ts declares the field; QuizPanel only renders it. The single createFreshState seam in createGame wraps createInitial(), and startFresh reuses replaceState -> saveGame -> publish; saveGame passes createFromDto(state).toDto() to SaveManager.save().

## Outcome

- Signal: useful

## Source Nodes

- quizView(),QuizView,QuizPanel,Game,createInitial(),SaveManager,.save()