---
type: "query"
date: "2026-11-26T18:11:51.383713+00:00"
question: "Which canonical nodes own formatEvent transcript rendering and suppression of puzzle-solved for ENG22-SUCCESSIDS-01?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["formatEvent()", "topicLabel()", "OutputLog", "GameEvent", "GameViewData", "PuzzleSystem", "solveEffects()"]
---

# Q: Which canonical nodes own formatEvent transcript rendering and suppression of puzzle-solved for ENG22-SUCCESSIDS-01?

## Answer

formatEvent() at src/ui/formatEvent.ts L11 owns render-time suppression; topicLabel() L7 resolves spec-topic titles; GameViewData L47 and OutputLog L5 carry view data and rendering. COMPLETED/SOLVED_WITH_TOPIC/SOLVED_WITHOUT_TOPIC in tests/turn/engine-issue-22-success-ids.test.ts define the real event shapes. PuzzleSystem.solveEffects() L75 emits the topic-completed events that format into friendly lines.

## Outcome

- Signal: useful

## Source Nodes

- formatEvent()
- topicLabel()
- OutputLog
- GameEvent
- GameViewData
- PuzzleSystem
- solveEffects()