---
type: "query"
date: "2026-11-27T18:32:19.636893+00:00"
question: "MD-UI-01 round 2: which canonical UI node owns ordered-list numbering (OL start) and the transcript block channel for formatted event lines?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["renderBlock()", "formatEvent()", "appendMarkdownBlock()", "OutputLog", "FakeElement", "markdownTranscript.test.ts"]
---

# Q: MD-UI-01 round 2: which canonical UI node owns ordered-list numbering (OL start) and the transcript block channel for formatted event lines?

## Answer

Canonical owner is renderBlock() in src/ui/markdown/renderMarkdown.ts (L277): an ordered list keeps its own start attribute (spec §4.2). formatEvent() (src/ui/formatEvent.ts L11) maps question-asked options to numbered lines; appendMarkdownBlock() (src/ui/appendMarkdown.ts L14) routes them to OutputLog.appendMarkdown() (src/ui/OutputLog.ts L31). Pure block rendering yields two separate one-item OLs with start 1 and 2 - each keeps its own number. No text-shape workaround is valid; MD-UI-09 now accepts that DOM shape alongside literal inline and single-OL numbering.

## Outcome

- Signal: useful

## Source Nodes

- renderBlock()
- formatEvent()
- appendMarkdownBlock()
- OutputLog
- FakeElement
- markdownTranscript.test.ts