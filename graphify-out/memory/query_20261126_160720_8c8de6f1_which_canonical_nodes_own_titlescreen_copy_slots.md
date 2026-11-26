---
type: "query"
date: "2026-11-26T16:07:20.085084+00:00"
question: "Which canonical nodes own TitleScreen copy slots, GameWindow first-batch transcript seeding and overlay dismissal for onboarding?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["TitleScreen", "GameWindow", ".renderBatch()", ".dismissOverlayAfterFirstBatch()", "OutputLog"]
---

# Q: Which canonical nodes own TitleScreen copy slots, GameWindow first-batch transcript seeding and overlay dismissal for onboarding?

## Answer

TitleScreen (src/ui/TitleScreen.ts:L4) owns the copy slots on the .title-overlay; GameWindow (src/ui/GameWindow.ts:L37) owns transcript seeding, .renderBatch() (L217) and .dismissOverlayAfterFirstBatch() (L232); OutputLog (src/ui/OutputLog.ts:L5) owns the transcript lines. Docs: application-and-ui.md sections 2 and 7.1.

## Outcome

- Signal: useful

## Source Nodes

- TitleScreen
- GameWindow
- .renderBatch()
- .dismissOverlayAfterFirstBatch()
- OutputLog