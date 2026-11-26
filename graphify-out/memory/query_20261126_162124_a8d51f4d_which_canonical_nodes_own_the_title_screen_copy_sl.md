---
type: "query"
date: "2026-11-26T16:21:24.232214+00:00"
question: "Which canonical nodes own the title-screen copy slots and the first transcript lines?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["TitleScreen", "GameWindow", "OutputLog", ".renderBatch()", ".dismissOverlayAfterFirstBatch()", "GameViewData"]
---

# Q: Which canonical nodes own the title-screen copy slots and the first transcript lines?

## Answer

TitleScreen (src/ui/TitleScreen.ts) builds the overlay slots; GameWindow (src/ui/GameWindow.ts) seeds the OutputLog lines and dismisses the overlay only after renderBatch publishes the first batch.

## Outcome

- Signal: useful

## Source Nodes

- TitleScreen
- GameWindow
- OutputLog
- .renderBatch()
- .dismissOverlayAfterFirstBatch()
- GameViewData