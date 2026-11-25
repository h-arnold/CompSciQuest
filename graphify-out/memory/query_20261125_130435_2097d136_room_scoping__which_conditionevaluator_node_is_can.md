---
type: "query"
date: "2026-11-25T13:04:35.779588+00:00"
question: "room-scoping: which ConditionEvaluator node is canonical for in-room/in-area, visited-room and topic-complete?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["isConditionMet()", "progressEntry()", "ConditionEvaluator", "Condition", "GameState", "AreaProgress", "Position"]
---

# Q: room-scoping: which ConditionEvaluator node is canonical for in-room/in-area, visited-room and topic-complete?

## Answer

Canonical evaluator is isConditionMet() at src/core/rules/ConditionEvaluator.ts:19; the first-row-only lookup is progressEntry() at src/core/rules/ConditionEvaluator.ts:15. ScoreTracker.progressEntry() is a separate concern. Contract source is shared-rules.md §3; in-area carries both worldId and areaId.

## Outcome

- Signal: useful

## Source Nodes

- isConditionMet()
- progressEntry()
- ConditionEvaluator
- Condition
- GameState
- AreaProgress
- Position