---
type: "query"
date: "2026-11-26T17:04:57.197652+00:00"
question: "Which node canonically owns formatEvent transcript rendering for ENG8-LOGID-01 and which events must be suppressed?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["formatEvent()", "GameEvent", "OutputLog"]
---

# Q: Which node canonically owns formatEvent transcript rendering for ENG8-LOGID-01 and which events must be suppressed?

## Answer

formatEvent() at src/ui/formatEvent.ts L20 is the single canonical formatter; GameEvent at src/core/events/GameEvent.ts L11 is the canonical union; OutputLog at src/ui/OutputLog.ts L5 is the log sink. Six internal-state kinds (quiz-started, quiz-ended, hazard-triggered, conversation-started, conversation-ended, hint-penalty-applied) must emit no transcript line. No duplicate canonical node was found.

## Outcome

- Signal: useful

## Source Nodes

- formatEvent()
- GameEvent
- OutputLog