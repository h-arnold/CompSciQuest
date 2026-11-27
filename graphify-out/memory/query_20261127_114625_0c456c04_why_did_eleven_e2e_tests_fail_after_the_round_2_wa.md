---
type: "query"
date: "2026-11-27T11:46:25.779222+00:00"
question: "Why did eleven e2e tests fail after the round-2 ward card regeneration, and how were stale expectations re-anchored?"
contributor: "graphify"
outcome: "corrected"
correction: "Re-anchor stale fixtures only: seed tutorial-complete via a live save, use generated bundle counts, and use accepted-card copy verbatim."
source_nodes: ["w7-opening-walkthrough.spec.ts", "helpers.ts", "playwright.config.ts"]
---

# Q: Why did eleven e2e tests fail after the round-2 ward card regeneration, and how were stale expectations re-anchored?

## Answer

The accepted hub card gates east and north on the ward calibration mark (tutorial-complete), the regenerated bundle has 6 areas/23 rooms/63 items, the Interface description now says the east arrow is dark until the mark is on record, and the Records AI has a dedicated saving keyword topic. Tests that assumed ungated routes, old counts or old prose were stale; seeding the ward flag in valid v1 saves and re-anchoring counts/prose made them pass without weakening assertions.

## Outcome

- Signal: corrected
- Correction: Re-anchor stale fixtures only: seed tutorial-complete via a live save, use generated bundle counts, and use accepted-card copy verbatim.

## Source Nodes

- w7-opening-walkthrough.spec.ts
- helpers.ts
- playwright.config.ts