---
type: "query"
date: "2026-11-26T19:46:49.329207+00:00"
question: "ENG28-ACTIVATION-01 which nodes own puzzle-activated suppression and the effect pipeline?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["formatEvent()", "PuzzleSystem", "OutputLog", "GameViewData", "GameEvent"]
---

# Q: ENG28-ACTIVATION-01 which nodes own puzzle-activated suppression and the effect pipeline?

## Answer

formatEvent() at src/ui/formatEvent.ts L11 suppresses puzzle-activated at render time; PuzzleSystem.react()/solveEffects() at src/core/puzzles/PuzzleSystem.ts L15/L75 own the effect pipeline; OutputLog at src/ui/OutputLog.ts L5 is the transcript sink; GameViewData at src/application/GameViewData.ts L47 carries panel state.

## Outcome

- Signal: useful

## Source Nodes

- formatEvent()
- PuzzleSystem
- OutputLog
- GameViewData
- GameEvent