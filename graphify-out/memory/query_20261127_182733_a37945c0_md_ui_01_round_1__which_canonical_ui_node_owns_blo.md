---
type: "query"
date: "2026-11-27T18:27:33.116220+00:00"
question: "MD-UI-01 round 1: which canonical UI node owns block vs inline transcript channels after removing the NUMBERED_OPTION heuristic, and can the first MD-UI-09 test stay green?"
contributor: "graphify"
outcome: "corrected"
source_nodes: ["appendMarkdownBlock(),appendMarkdownInline(),renderBatch(),renderBlock(),GameWindow,QuizPanel,OutputLog,markdownTranscript.test.ts"]
---

# Q: MD-UI-01 round 1: which canonical UI node owns block vs inline transcript channels after removing the NUMBERED_OPTION heuristic, and can the first MD-UI-09 test stay green?

## Answer

appendMarkdownBlock (src/ui/appendMarkdown.ts) is the sole block writer and must always append renderBlock nodes; GameWindow.renderBatch routes question-asked prompt via OutputLog.appendMarkdown and option lines via appendMarkdownInline. The first MD-UI-09 test passes every formatEvent line through appendMarkdown and only accepts literal numbering or one OL with two LIs; pure renderBlock yields two one-item OLs, so that inherited expectation cannot stay green without reintroducing the rejected text-shape heuristic or a forbidden test edit.

## Outcome

- Signal: corrected

## Source Nodes

- appendMarkdownBlock(),appendMarkdownInline(),renderBatch(),renderBlock(),GameWindow,QuizPanel,OutputLog,markdownTranscript.test.ts