---
type: "query"
date: "2026-11-27T08:56:34.633021+00:00"
question: "Why do four W7 browser tests still fail after the string re-anchor, and is it caused by this slice?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["RuleEngine", "w7-opening-walkthrough.spec.ts", "w7-scoped-boundary.spec.ts", "GATE_FLAGS"]
---

# Q: Why do four W7 browser tests still fail after the string re-anchor, and is it caused by this slice?

## Answer

No: baseline HEAD versions of the four affected specs fail 10 tests; after re-anchoring 4 fail. The remaining failures (W7 Beat C, Beat E, non-quiz gates, scoped lives reset) stop at hub east/north with 'That way is closed for now.' because the hub room description says east/north stay dark until ward calibration; those tests navigate before calibration. They are pre-existing and out of scope for the four-string re-anchor; routed to code-lead/content-editor.

## Outcome

- Signal: useful

## Source Nodes

- RuleEngine
- w7-opening-walkthrough.spec.ts
- w7-scoped-boundary.spec.ts
- GATE_FLAGS