---
type: "query"
date: "2026-11-27T17:44:53.983920+00:00"
question: "MD-RENDER-01 round 1: which canonical nodes own bold-italic emphasis, raw-HTML leaf text and rejected-link labels in the markdown renderer?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["renderEmphasis()", "renderLeaf()", "renderLink()", "renderMarkdown.ts", "isAllowedLink()"]
---

# Q: MD-RENDER-01 round 1: which canonical nodes own bold-italic emphasis, raw-HTML leaf text and rejected-link labels in the markdown renderer?

## Answer

renderEmphasis() (renderMarkdown.ts L116), renderLeaf() (L182) and renderLink() (L146) are the sole owners; collapseNewlines() (L11), literalText() (L21), childTokens() (L15) and isAllowedLink() (links.ts L8) are the existing helpers to reuse.

## Outcome

- Signal: useful

## Source Nodes

- renderEmphasis()
- renderLeaf()
- renderLink()
- renderMarkdown.ts
- isAllowedLink()