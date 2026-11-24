---
type: "query"
date: "2026-11-24T15:54:27.973615+00:00"
question: "Which canonical nodes own ContentBundle, validateContent, structural validation gates and score budgets?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["ContentBundle", "Catalogue", "validateContent", "Structural validation gates", "SpecTopic", "Direction"]
---

# Q: Which canonical nodes own ContentBundle, validateContent, structural validation gates and score budgets?

## Answer

ContentBundle (src/content/ContentBundle.ts L18), Catalogue (src/content/Catalogue.ts L2), SpecTopic (src/core/scoring/SpecTopic.ts L5), Direction (src/types/domain.ts L2) and the doc concepts validateContent / Structural validation gates. No existing runtime owner for validateContent; new module reuses these types rather than duplicating contracts.

## Outcome

- Signal: useful

## Source Nodes

- ContentBundle
- Catalogue
- validateContent
- Structural validation gates
- SpecTopic
- Direction