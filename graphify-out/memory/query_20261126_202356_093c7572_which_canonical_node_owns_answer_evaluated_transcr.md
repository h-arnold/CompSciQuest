---
type: "query"
date: "2026-11-26T20:23:56.143005+00:00"
question: "Which canonical node owns answer-evaluated transcript feedback in ENG10-FEEDBACK-01, and is the fixed Correct./Incorrect. prefix duplicated anywhere else in src?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["formatEvent()", "GameEvent", "6.1 Event to view mapping"]
---

# Q: Which canonical node owns answer-evaluated transcript feedback in ENG10-FEEDBACK-01, and is the fixed Correct./Incorrect. prefix duplicated anywhere else in src?

## Answer

formatEvent() in src/ui/formatEvent.ts L11 is the sole canonical formatter; the answer-evaluated arm now prefixes the verbatim explanation with 'Correct. ' or 'Incorrect. ' per application-and-ui.md 6.1. A source scan found no other occurrence of the literal in src, so no bypass or duplicate owner. Graph path formatEvent() -> GameEvent is EXTRACTED; doc references are INFERRED.

## Outcome

- Signal: useful

## Source Nodes

- formatEvent()
- GameEvent
- 6.1 Event to view mapping