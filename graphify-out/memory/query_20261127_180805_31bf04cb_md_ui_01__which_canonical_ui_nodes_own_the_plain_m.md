---
type: "query"
date: "2026-11-27T18:08:05.508709+00:00"
question: "MD-UI-01: which canonical UI nodes own the plain/Markdown transcript channels and how do appendPlain, appendMarkdownBlock and appendMarkdownInline reuse them?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["OutputLog,appendMarkdown.ts,appendPlain(),appendMarkdownBlock(),appendMarkdownInline(),appendLine(),GameWindow,.renderBatch(),QuizPanel,renderBlock(),renderInline()"]
---

# Q: MD-UI-01: which canonical UI nodes own the plain/Markdown transcript channels and how do appendPlain, appendMarkdownBlock and appendMarkdownInline reuse them?

## Answer

OutputLog owns appendPlain/appendMarkdown/append; appendPlain delegates to the single appendLine writer in src/ui/appendLine.ts. appendMarkdownBlock/appendMarkdownInline in src/ui/appendMarkdown.ts are the only consumers of renderBlock/renderInline for panels; GameWindow.handleCommand uses the plain channel and .renderBatch() uses OutputLog.appendMarkdown. QuizPanel renders the requirement p directly through renderBlock, keeps aria-live on that p, and places it first so it is the first p in the panel. Full suite 628 tests green.

## Outcome

- Signal: useful

## Source Nodes

- OutputLog,appendMarkdown.ts,appendPlain(),appendMarkdownBlock(),appendMarkdownInline(),appendLine(),GameWindow,.renderBatch(),QuizPanel,renderBlock(),renderInline()