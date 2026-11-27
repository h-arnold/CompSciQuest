---
type: "query"
date: "2026-11-27T17:30:28.957323+00:00"
question: "MD-RENDER-01: which canonical UI node owns the Markdown to DOM boundary?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["GameWindow,OutputLog,appendLine(),formatEvent(),QuizPanel,HintPanel,renderBlock(),renderInline(),isAllowedLink()"]
---

# Q: MD-RENDER-01: which canonical UI node owns the Markdown to DOM boundary?

## Answer

No renderer node existed. GameWindow, OutputLog, appendLine(), formatEvent(), QuizPanel and HintPanel are the consumers (src/ui/GameWindow.ts L32, src/ui/OutputLog.ts L5, src/ui/appendLine.ts L3, src/ui/formatEvent.ts L11, src/ui/QuizPanel.ts L6, src/ui/HintPanel.ts L6). New nodes renderBlock(), renderInline(), isAllowedLink() now own the boundary.

## Outcome

- Signal: useful

## Source Nodes

- GameWindow,OutputLog,appendLine(),formatEvent(),QuizPanel,HintPanel,renderBlock(),renderInline(),isAllowedLink()