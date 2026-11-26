---
type: "query"
date: "2026-11-26T18:08:36.511648+00:00"
question: "Is there an existing owner for detail-suffix help rendering that detailSuffix() duplicates?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["aliasSuffix() detailSuffix() helpText()"]
---

# Q: Is there an existing owner for detail-suffix help rendering that detailSuffix() duplicates?

## Answer

No. Query for aliasSuffix()/detailSuffix()/helpText() found aliasSuffix() as the only suffix renderer in CommandTable.ts; detailSuffix() is a sibling helper called solely by helpText() (EXTRACTED edges: contains + calls). No duplicate canonical label or bypassed help hub.

## Outcome

- Signal: useful

## Source Nodes

- aliasSuffix() detailSuffix() helpText()