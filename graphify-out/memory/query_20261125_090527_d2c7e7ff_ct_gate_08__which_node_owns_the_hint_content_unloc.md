---
type: "query"
date: "2026-11-25T09:05:27.824963+00:00"
question: "CT-GATE-08: which node owns the hint-content unlock-key namespace check and why is hints-shown:<hintId> rejected?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["UNLOCK_PREFIXES"]
---

# Q: CT-GATE-08: which node owns the hint-content unlock-key namespace check and why is hints-shown:<hintId> rejected?

## Answer

The canonical node is UNLOCK_PREFIXES at tools/content/gates/hint.ts:L17 (via levelFindings():L20 and checkHint():L115). It lists only failed-attempts: and turns-since:, omitting the agreed hints-shown: prefix documented at docs/developer/shared-rules.md §3 (counter namespace table, show-hint effect) and docs/developer/hints.md §2. No duplicate claimant for UNLOCK_PREFIXES was found; the docs nodes Counter key namespace and HintSystem are the authority, not a second validator.

## Outcome

- Signal: useful

## Source Nodes

- UNLOCK_PREFIXES