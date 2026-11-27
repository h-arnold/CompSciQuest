---
type: "query"
date: "2026-11-27T12:17:40.437847+00:00"
question: "Which canonical node owns exact displayed quiz option text as an answer, and where should the WR3-A1 fix and shared option-text normalisation live?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["resolveGameCommand()", "answerCommand()", "bareAnswerCommand()", "normaliseOptionText()", "exactOptionAnswerCommand()", "QuizSystem", "evaluateAnswer()"]
---

# Q: Which canonical node owns exact displayed quiz option text as an answer, and where should the WR3-A1 fix and shared option-text normalisation live?

## Answer

resolveGameCommand() in src/application/commandResolution.ts owns command resolution and is the fix owner; answerCommand() already owns option-text normalisation via trim/toLocaleLowerCase('en-GB'); QuizSystem.handle() and evaluateAnswer() are the downstream seam. Added private normaliseOptionText() and exactOptionAnswerCommand() in the same file, called at the top of resolveGameCommand(); no new production owner elsewhere.

## Outcome

- Signal: useful

## Source Nodes

- resolveGameCommand()
- answerCommand()
- bareAnswerCommand()
- normaliseOptionText()
- exactOptionAnswerCommand()
- QuizSystem
- evaluateAnswer()