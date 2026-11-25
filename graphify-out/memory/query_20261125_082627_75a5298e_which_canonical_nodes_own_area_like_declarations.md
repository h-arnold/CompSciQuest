---
type: "query"
date: "2026-11-25T08:26:27.288957+00:00"
question: "Which canonical nodes own area-like declarations, exit normalisation and todo detection for the content toolchain?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["areaLikes()", "auditedAreaLikes()", "normalisedCards()", "topicHeadings()", "todoFindings()"]
---

# Q: Which canonical nodes own area-like declarations, exit normalisation and todo detection for the content toolchain?

## Answer

areaLikes()/auditedAreaLikes()/normalisedCards() and topicHeadings() in tools/content/gates/common.ts now own the read-only adapters; todoFindings() stays in tools/content/schema.ts; no second implementation was added.

## Outcome

- Signal: useful

## Source Nodes

- areaLikes()
- auditedAreaLikes()
- normalisedCards()
- topicHeadings()
- todoFindings()