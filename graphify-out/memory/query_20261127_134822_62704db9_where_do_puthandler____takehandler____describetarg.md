---
type: "query"
date: "2026-11-27T13:48:22.927199+00:00"
question: "Where do putHandler(), takeHandler(), describeTarget(), ItemVisibility, formatEvent(), GameEvent, TitleScreen, SaveControls and GameViewData live, and what real event names and view fields should browser assertions use?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["putHandler()", "takeHandler()", "describeTarget()", "ItemVisibility", "formatEvent()", "GameEvent", "TitleScreen", "SaveControls", "GameViewData"]
---

# Q: Where do putHandler(), takeHandler(), describeTarget(), ItemVisibility, formatEvent(), GameEvent, TitleScreen, SaveControls and GameViewData live, and what real event names and view fields should browser assertions use?

## Answer

Codebase graph located the canonical verb handlers at src/core/commands/verbs/index.ts (putHandler L192, takeHandler L280, describeTarget L90), ItemVisibility at src/core/commands/ItemVisibility.ts:L8, formatEvent at src/ui/formatEvent.ts:L11, GameEvent at src/core/events/GameEvent.ts:L11, TitleScreen at src/ui/TitleScreen.ts:L18, SaveControls at src/ui/SaveControls.ts:L14 and GameViewData at src/application/GameViewData.ts:L47. These source locations produced the exact player-facing strings asserted in e2e/ward-round4-fixes.spec.ts.

## Outcome

- Signal: useful

## Source Nodes

- putHandler()
- takeHandler()
- describeTarget()
- ItemVisibility
- formatEvent()
- GameEvent
- TitleScreen
- SaveControls
- GameViewData