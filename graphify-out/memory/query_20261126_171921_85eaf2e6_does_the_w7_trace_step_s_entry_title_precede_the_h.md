---
type: "query"
date: "2026-11-26T17:19:21.321780+00:00"
question: "Does the W7 trace step's entry title precede the hazard message?"
contributor: "graphify"
outcome: "corrected"
source_nodes: ["w7-opening-walkthrough.spec.ts"]
---

# Q: Does the W7 trace step's entry title precede the hazard message?

## Answer

No. For the first runStep hazard step, the entry title is the post-hazard destination room (The Binary Hall), so it follows the message. The room-before-outcome ordering assertion belongs to W7 Beat E, where entry is the triggering Switch Floor. Removed the generic ordering from the shared helper; kept Beat E's check.

## Outcome

- Signal: corrected

## Source Nodes

- w7-opening-walkthrough.spec.ts