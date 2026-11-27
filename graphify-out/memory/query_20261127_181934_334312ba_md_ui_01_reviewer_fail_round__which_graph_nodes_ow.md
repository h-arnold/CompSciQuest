---
type: "query"
date: "2026-11-27T18:19:34.623150+00:00"
question: "MD-UI-01 reviewer-FAIL round: which graph nodes own block/inline markdown channels, quiz requirement order and GameWindow event routing?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["appendMarkdownBlock", "appendMarkdownInline", "renderBlock", "renderInline", "OutputLog", "GameWindow", "QuizPanel"]
---

# Q: MD-UI-01 reviewer-FAIL round: which graph nodes own block/inline markdown channels, quiz requirement order and GameWindow event routing?

## Answer

Canonical owners: appendMarkdownBlock()/appendMarkdownInline() in src/ui/appendMarkdown.ts (L18/L34) append through OutputLog.appendMarkdown (src/ui/OutputLog.ts L31); renderBlock()/renderInline() in src/ui/markdown/renderMarkdown.ts (L277/L281) render the P/OL vs inline shapes; GameWindow.renderBatch() (src/ui/GameWindow.ts L193) routes published events; QuizPanel.refresh() (src/ui/QuizPanel.ts L16) builds the requirement paragraph and panel order. No duplicate canonical renderer: the appenders, renderers and log sink are complementary, not competing owners.

## Outcome

- Signal: useful

## Source Nodes

- appendMarkdownBlock
- appendMarkdownInline
- renderBlock
- renderInline
- OutputLog
- GameWindow
- QuizPanel