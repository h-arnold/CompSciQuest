---
type: "query"
date: "2026-11-26T17:49:34.090808+00:00"
question: "ENG9 browser QA: where are the bare quiz answer and inferred ask command seams, and which view/event names should e2e assert?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["resolveGameCommand()", "bareAnswerCommand()", "inferAskActor()", "QuizPanel", "GameEvent", "GameViewData", "formatEvent()", "submit()", "transcript()"]
---

# Q: ENG9 browser QA: where are the bare quiz answer and inferred ask command seams, and which view/event names should e2e assert?

## Answer

graphify query located bareAnswerCommand() and inferAskActor() in src/application/commandResolution.ts, QuizPanel/GameWindow and formatEvent()/GameEvent/GameViewData in the UI seams. Browser tests assert quiz-panel advance plus saved quiz.answers/index and transcript text, not feedback wording.

## Outcome

- Signal: useful

## Source Nodes

- resolveGameCommand()
- bareAnswerCommand()
- inferAskActor()
- QuizPanel
- GameEvent
- GameViewData
- formatEvent()
- submit()
- transcript()