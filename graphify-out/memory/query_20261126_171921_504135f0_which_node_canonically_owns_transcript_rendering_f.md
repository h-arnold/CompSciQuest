---
type: "query"
date: "2026-11-26T17:19:21.075185+00:00"
question: "Which node canonically owns transcript rendering for ENG8-LOGID-01 and which events are suppressed?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src_ui_formatevent_formatevent", "GameEvent", "src_core_events_GameEvent_GameEvent"]
---

# Q: Which node canonically owns transcript rendering for ENG8-LOGID-01 and which events are suppressed?

## Answer

formatEvent() at src/ui/formatEvent.ts L11 owns GameEvent→lines; GameEvent union at src/core/events/GameEvent.ts L11; suppression list at src/ui/formatEvent.ts L68-82 matches application-and-ui.md §6.1 (L521-552) and ENGINE_ISSUES.md Batch E2 (L46-67). Six internal-state kinds emit []: quiz-started, quiz-ended, hazard-triggered, conversation-started, conversation-ended, hint-penalty-applied.

## Outcome

- Signal: useful

## Source Nodes

- src_ui_formatevent_formatevent
- GameEvent
- src_core_events_GameEvent_GameEvent