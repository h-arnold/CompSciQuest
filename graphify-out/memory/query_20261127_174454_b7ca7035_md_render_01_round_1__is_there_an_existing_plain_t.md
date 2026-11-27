---
type: "query"
date: "2026-11-27T17:44:54.103544+00:00"
question: "MD-RENDER-01 round 1: is there an existing plain-token-text extractor or triple-marker detector to reuse before adding plainText() and boldItalicMarker()?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["childTokens()", "literalText()", "collapseNewlines()", "renderTokens()"]
---

# Q: MD-RENDER-01 round 1: is there an existing plain-token-text extractor or triple-marker detector to reuse before adding plainText() and boldItalicMarker()?

## Answer

No. The renderMarkdown.ts community contains only childTokens(), literalText(), collapseNewlines() and renderTokens(); none recursively extracts plain label text or detects a doubled/tripled emphasis marker. Two new non-exported helpers were added inside the same file.

## Outcome

- Signal: useful

## Source Nodes

- childTokens()
- literalText()
- collapseNewlines()
- renderTokens()