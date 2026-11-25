---
type: "query"
date: "2026-11-25T10:32:48.909195+00:00"
question: "Query formatEvent, GameEvent, TitleScreen, SaveControls and GameViewData so assertions use the real event names and view fields rather than remembered ones"
contributor: "graphify"
outcome: "useful"
source_nodes: ["OutputLog", "TitleScreen", "GameEvent", "GameViewData", "SaveControls", "formatEvent()"]
---

# Q: Query formatEvent, GameEvent, TitleScreen, SaveControls and GameViewData so assertions use the real event names and view fields rather than remembered ones

## Answer

Expanded from original query via literal graph node labels: [formatEvent, GameEvent, TitleScreen, SaveControls, GameViewData, OutputLog]. BFS cited OutputLog (src/ui/OutputLog.ts L5) with .append() L18, TitleScreen (src/ui/TitleScreen.ts L4), GameViewData (src/application/GameViewData.ts L47), GameEvent (src/core/events/GameEvent.ts L11), SaveControls (src/ui/SaveControls.ts L14) with SaveActions L4, and formatEvent() (src/ui/formatEvent.ts L19). These nodes pinned the real event/view vocabulary and the UI surfaces re-verified in revision 1: transcript log, title overlay and save controls.

## Outcome

- Signal: useful

## Source Nodes

- OutputLog
- TitleScreen
- GameEvent
- GameViewData
- SaveControls
- formatEvent()