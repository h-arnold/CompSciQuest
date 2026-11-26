---
type: "query"
date: "2026-11-26T16:10:36.507732+00:00"
question: "Which canonical nodes own the TitleScreen copy slots and the boot transcript seed, and is there a duplicate owner or bypass?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["TitleScreen", "TitleCopy", "DEFAULT_TITLE_COPY", "GameWindow", "OutputLog", ".renderBatch(.", "dismissOverlayAfterFirstBatch(.", ".append(."]
---

# Q: Which canonical nodes own the TitleScreen copy slots and the boot transcript seed, and is there a duplicate owner or bypass?

## Answer

TitleScreen (src/ui/TitleScreen.ts) solely owns TitleCopy, DEFAULT_TITLE_COPY and the .title-objective/.title-controls/.title-help-prompt overlay slots. GameWindow solely seeds the OutputLog with DEFAULT_TITLE_COPY and renders/dismisses batches. OutputLog solely owns transcript children. The placeholder strings have one source of truth shared via the import; no duplicated production owner, no unexpected hub, no new cross-layer edge, no bypass found.

## Outcome

- Signal: useful

## Source Nodes

- TitleScreen
- TitleCopy
- DEFAULT_TITLE_COPY
- GameWindow
- OutputLog
- .renderBatch(.
- dismissOverlayAfterFirstBatch(.
- .append(.