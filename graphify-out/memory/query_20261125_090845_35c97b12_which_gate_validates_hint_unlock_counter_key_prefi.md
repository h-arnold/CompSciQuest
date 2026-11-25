---
type: "query"
date: "2026-11-25T09:08:45.510737+00:00"
question: "Which gate validates hint unlock counter-key prefixes and which prefixes are agreed?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["UNLOCK_PREFIXES,levelFindings(),hint.ts,checkHint(),ContentGates.test.ts"]
---

# Q: Which gate validates hint unlock counter-key prefixes and which prefixes are agreed?

## Answer

UNLOCK_PREFIXES in tools/content/gates/hint.ts (L17) is the sole validator, used by levelFindings(). Canonical agreed prefixes are hints-shown:, failed-attempts:, turns-since: (shared-rules.md §3; hints.md §2). Added hints-shown: to the array; no other code reimplements the check.

## Outcome

- Signal: useful

## Source Nodes

- UNLOCK_PREFIXES,levelFindings(),hint.ts,checkHint(),ContentGates.test.ts