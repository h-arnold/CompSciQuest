---
type: "query"
date: "2026-11-26T17:08:15.212870+00:00"
question: "Which node canonically owns transcript formatting and suppression of internal-state GameEvent lines for ENG8-LOGID-01?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["formatEvent()", "GameEvent", "OutputLog", "topicLabel()"]
---

# Q: Which node canonically owns transcript formatting and suppression of internal-state GameEvent lines for ENG8-LOGID-01?

## Answer

formatEvent() at src/ui/formatEvent.ts is the sole transcript formatter; six additional internal-state event kinds were added to its existing suppressed group and the now-unused label() helper removed. GameEvent at src/core/events/GameEvent.ts is the canonical union; OutputLog is the sink.

## Outcome

- Signal: useful

## Source Nodes

- formatEvent()
- GameEvent
- OutputLog
- topicLabel()