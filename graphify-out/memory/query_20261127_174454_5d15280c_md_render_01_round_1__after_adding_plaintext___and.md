---
type: "query"
date: "2026-11-27T17:44:54.222825+00:00"
question: "MD-RENDER-01 round 1: after adding plainText() and boldItalicMarker(), are there duplicate canonical nodes, bypasses or new cross-layer edges?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["plainText()", "boldItalicMarker()", "renderMarkdown.ts", "renderLeaf()", "renderLink()"]
---

# Q: MD-RENDER-01 round 1: after adding plainText() and boldItalicMarker(), are there duplicate canonical nodes, bypasses or new cross-layer edges?

## Answer

No duplicates: plainText(), boldItalicMarker() and renderMarkdown.ts each have one definition. Bypass check on collapseNewlines/isAllowedLink/createTextNode found no code outside the touched hub reimplementing them. god-nodes unchanged; imports remain marked + ./links only.

## Outcome

- Signal: useful

## Source Nodes

- plainText()
- boldItalicMarker()
- renderMarkdown.ts
- renderLeaf()
- renderLink()