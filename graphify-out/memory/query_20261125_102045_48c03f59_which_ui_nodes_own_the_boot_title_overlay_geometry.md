---
type: "query"
date: "2026-11-25T10:20:45.584515+00:00"
question: "Which UI nodes own the boot title overlay geometry, 360px workspace reflow and transcript live region?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["OutputLog", "GameWindow", "TitleScreen", "SaveControls", "src_ui_style"]
---

# Q: Which UI nodes own the boot title overlay geometry, 360px workspace reflow and transcript live region?

## Answer

OutputLog (src/ui/OutputLog.ts:5) owns the transcript element and now sets role=log/aria-live=polite in its constructor (:8-16); GameWindow (src/ui/GameWindow.ts:37) mounts .workspace (:102) and removes the title overlay from the DOM after the first batch (:232), so a CSS min-height on .window is boot-only and cannot affect the in-session layout; SaveControls (src/ui/SaveControls.ts:14) lives in the aside, so the 48rem media query reflows the grid to one column. src_ui_style is the CSS community node.

## Outcome

- Signal: useful

## Source Nodes

- OutputLog
- GameWindow
- TitleScreen
- SaveControls
- src_ui_style