---
type: "query"
date: "2026-11-26T16:20:02.764791+00:00"
question: "Where does the area-entry life reset gate live and how can it be exercised in a browser?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["areaChangeEvents()", "EffectApplier", "ContentBundle", ".getByAreaId()"]
---

# Q: Where does the area-entry life reset gate live and how can it be exercised in a browser?

## Answer

areaChangeEvents() in src/core/effects/EffectApplier.ts gates on the departed area's spec topics via bundle.specTopics.getByAreaId(), quiz-passed flags and solved puzzle phases. Verified in e2e/engine-issue-15-life-gate.spec.ts.

## Outcome

- Signal: useful

## Source Nodes

- areaChangeEvents()
- EffectApplier
- ContentBundle
- .getByAreaId()