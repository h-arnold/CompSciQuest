---
type: "query"
date: "2026-11-24T15:54:28.171732+00:00"
question: "Is there an existing owner for content validation or effect-scanning that should be reused?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Structural validation gates", "validateContent", "EffectApplier"]
---

# Q: Is there an existing owner for content validation or effect-scanning that should be reused?

## Answer

No. Only SaveManager shape helpers and EffectApplier exist; neither validates content bundles. A new validateContent module is the canonical owner from application-and-ui.md §3.3.

## Outcome

- Signal: useful

## Source Nodes

- Structural validation gates
- validateContent
- EffectApplier