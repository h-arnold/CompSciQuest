---
type: "query"
date: "2026-11-28T08:31:02.097052+00:00"
question: "Query formatEvent, GameEvent, GameWindow, OutputLog, scrollToLatest, pinnedToLatest for UI-LOGSCROLL scroll geometry E2E"
contributor: "graphify"
outcome: "useful"
source_nodes: ["formatEvent()", "GameEvent", "GameWindow", "OutputLog", ".scrollToLatest()", ".isAtLatest()", ".renderBatch()", ".handleCommand()", "TitleScreen", "SaveControls"]
---

# Q: Query formatEvent, GameEvent, GameWindow, OutputLog, scrollToLatest, pinnedToLatest for UI-LOGSCROLL scroll geometry E2E

## Answer

formatEvent() src/ui/formatEvent.ts L12; GameEvent src/core/events/GameEvent.ts L11; GameWindow src/ui/GameWindow.ts L33 .handleCommand L158 .renderBatch L195 .dismissOverlayAfterFirstBatch L225; OutputLog src/ui/OutputLog.ts L11 .scrollToLatest L63 .isAtLatest L38 .appendMarkdown L53 .appendPlain L47; TitleScreen src/ui/TitleScreen.ts L18; SaveControls src/ui/SaveControls.ts L13; GameViewData src/application/GameViewData.ts L52. pinnedToLatest has no graph node.

## Outcome

- Signal: useful

## Source Nodes

- formatEvent()
- GameEvent
- GameWindow
- OutputLog
- .scrollToLatest()
- .isAtLatest()
- .renderBatch()
- .handleCommand()
- TitleScreen
- SaveControls
- GameViewData