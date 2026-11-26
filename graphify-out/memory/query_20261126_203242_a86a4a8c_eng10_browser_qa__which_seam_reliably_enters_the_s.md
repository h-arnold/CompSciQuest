---
type: "query"
date: "2026-11-26T20:32:42.535716+00:00"
question: "ENG10 browser QA: which seam reliably enters the switchyard quiz and which event names/fields own answer feedback?"
contributor: "graphify"
outcome: "corrected"
correction: "Do not assert the suppressed quiz-started event string; derive the correct and wrong option numbers from the generated authored questions matched by the displayed prompt."
source_nodes: ["formatEvent()", "GameEvent", "QuizPanel", "answer-evaluated", "6.1 Event to view mapping"]
---

# Q: ENG10 browser QA: which seam reliably enters the switchyard quiz and which event names/fields own answer feedback?

## Answer

formatEvent()'s answer-evaluated arm emits exactly one line: Correct./Incorrect. plus the verbatim explanation. quiz-started is render-time suppressed, so browser tests must wait for the visible quiz panel and its first Question 1 of 3 line rather than a 'Quiz quiz-switchyard started.' transcript line. The trigger command is 'ask foreman about switch-to-bit' after two east moves.

## Outcome

- Signal: corrected
- Correction: Do not assert the suppressed quiz-started event string; derive the correct and wrong option numbers from the generated authored questions matched by the displayed prompt.

## Source Nodes

- formatEvent()
- GameEvent
- QuizPanel
- answer-evaluated
- 6.1 Event to view mapping