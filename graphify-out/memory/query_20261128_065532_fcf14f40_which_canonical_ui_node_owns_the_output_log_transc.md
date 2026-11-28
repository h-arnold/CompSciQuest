---
type: "query"
date: "2026-11-28T06:55:32.776898+00:00"
question: "Which canonical UI node owns the output-log transcript, its append channels and command echo, and where are the turn-completion points for scroll-to-latest?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["OutputLog", "GameWindow", ".renderBatch()", ".appendPlain()", "appendMarkdownInline()", "formatEvent()", ".handleCommand()", ".dismissOverlayAfterFirstBatch()", ".append()"]
---

# Q: Which canonical UI node owns the output-log transcript, its append channels and command echo, and where are the turn-completion points for scroll-to-latest?

## Answer

OutputLog (src/ui/OutputLog.ts L8) owns the transcript element and appendPlain/appendMarkdown; GameWindow (src/ui/GameWindow.ts L33) owns .handleCommand() L158 echo, .renderBatch() L194 and .dismissOverlayAfterFirstBatch() L223. No existing scroll owner in src, so .scrollToLatest() was added to OutputLog and called at the three turn-completion points.

## Outcome

- Signal: useful

## Source Nodes

- OutputLog
- GameWindow
- .renderBatch()
- .appendPlain()
- appendMarkdownInline()
- formatEvent()
- .handleCommand()
- .dismissOverlayAfterFirstBatch()
- .append()