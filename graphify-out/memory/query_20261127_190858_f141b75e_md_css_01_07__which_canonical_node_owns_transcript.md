---
type: "query"
date: "2026-11-27T19:08:58.552863+00:00"
question: "MD-CSS-01–07: which canonical node owns transcript styling, and are there competing stylesheets or inline style writers to bypass?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["OutputLog", ".appendMarkdown()", "renderTable()", "renderCode()", "GameWindow", ".renderBatch()", "7.1 DOM layout"]
---

# Q: MD-CSS-01–07: which canonical node owns transcript styling, and are there competing stylesheets or inline style writers to bypass?

## Answer

application-and-ui.md §7.1 names src/ui/style.css as the single stylesheet; graph has no style.css node (AST graph does not index CSS). renderTable(), renderCode(), OutputLog, QuizPanel, GameWindow and .renderBatch() cite src/ui/* lines; the renderer emits classes (table-scroll, align-*, language-*) but no style attributes. Bypass check confirmed src/main.ts L3 is the sole CSS import, no other CSS file and no setAttribute('style') or style= in src/index.html. CSS added only to src/ui/style.css.

## Outcome

- Signal: useful

## Source Nodes

- OutputLog
- .appendMarkdown()
- renderTable()
- renderCode()
- GameWindow
- .renderBatch()
- 7.1 DOM layout