---
type: "query"
date: "2026-11-27T19:19:48.476086+00:00"
question: "MD-CSS-01–07 browser QA: which canonical nodes own transcript CSS, table/fence DOM shape and the Pages footer link?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["OutputLog", ".appendMarkdown()", "renderTable", "renderCode", "GameWindow", ".renderBatch()", "QuizPanel", "renderLink", "isAllowedLink", "7.1 DOM layout"]
---

# Q: MD-CSS-01–07 browser QA: which canonical nodes own transcript CSS, table/fence DOM shape and the Pages footer link?

## Answer

Graph query over OutputLog, .appendMarkdown(), renderTable(), renderCode(), GameWindow, .renderBatch(), QuizPanel, renderLink(), isAllowedLink() and helpReply() located the production boundary. CSS selectors style.css/.output-log/.table-scroll are not node labels because the AST graph does not index CSS; application-and-ui.md 7.1 DOM layout (L623) is canonical for one stylesheet and table wrapper. Browser evidence was gathered with real help link plus injected renderer-shaped DOM.

## Outcome

- Signal: useful

## Source Nodes

- OutputLog
- .appendMarkdown()
- renderTable
- renderCode
- GameWindow
- .renderBatch()
- QuizPanel
- renderLink
- isAllowedLink
- 7.1 DOM layout