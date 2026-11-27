---
type: "query"
date: "2026-11-27T17:18:47.776979+00:00"
question: "MD-RENDER-01: which canonical UI node owns the marked DOM-only renderer boundary for transcript and panel Markdown?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["OutputLog", "formatEvent", "GameWindow", "QuizPanel", "HintPanel"]
---

# Q: MD-RENDER-01: which canonical UI node owns the marked DOM-only renderer boundary for transcript and panel Markdown?

## Answer

No renderer node exists yet (TBD). Start at OutputLog (src/ui/OutputLog.ts L5) and its .append() (L18), formatEvent() (src/ui/formatEvent.ts L11) and GameWindow .renderBatch() (src/ui/GameWindow.ts L193); QuizPanel (L6) and HintPanel (L6) own inline channels. The spec pins renderBlock/renderInline in src/ui/markdown/renderMarkdown.ts returning DOM nodes with no innerHTML.

## Outcome

- Signal: useful

## Source Nodes

- OutputLog
- formatEvent
- GameWindow
- QuizPanel
- HintPanel