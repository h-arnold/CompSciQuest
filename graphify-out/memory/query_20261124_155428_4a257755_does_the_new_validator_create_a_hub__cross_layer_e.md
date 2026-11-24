---
type: "query"
date: "2026-11-24T15:54:28.392160+00:00"
question: "Does the new validator create a hub, cross-layer edge or cycle?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["validateContent()", "ContentBundle"]
---

# Q: Does the new validator create a hub, cross-layer edge or cycle?

## Answer

No. New edges only from validate-content/index.ts to type-only ContentBundle, Catalogue, SpecTopic and Direction; helper functions stay low-degree and no new god nodes appeared.

## Outcome

- Signal: useful

## Source Nodes

- validateContent()
- ContentBundle