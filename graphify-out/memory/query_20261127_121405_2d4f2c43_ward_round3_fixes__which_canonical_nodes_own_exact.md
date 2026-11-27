---
type: "query"
date: "2026-11-27T12:14:05.612767+00:00"
question: "ward-round3-fixes: which canonical nodes own exact quiz option text resolution, the existing answer paths and the outside-quiz unknown path?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["resolveGameCommand()", "answerCommand()", "bareAnswerCommand()", "QuizSystem", "evaluateAnswer()", "BareQuizAnswer.test.ts"]
---

# Q: ward-round3-fixes: which canonical nodes own exact quiz option text resolution, the existing answer paths and the outside-quiz unknown path?

## Answer

Canonical owner is resolveGameCommand() in src/application/commandResolution.ts (L353); answerCommand() at L324 and bareAnswerCommand() at L312 own the accepted answer forms; Quiz.handle() in src/core/combat/QuizSystem.ts (L27) and evaluateAnswer() in src/core/effects/EffectApplier.ts (L344) are the downstream seam. WR3-A1 fails today because bare displayed option strings fall through to verb dispatch as unknown; WR3-A2/A3 preservation tests pass.

## Outcome

- Signal: useful

## Source Nodes

- resolveGameCommand()
- answerCommand()
- bareAnswerCommand()
- QuizSystem
- evaluateAnswer()
- BareQuizAnswer.test.ts