---
type: "query"
date: "2026-11-27T11:26:59.533607+00:00"
question: "Who owns wrong-order unlock refusal for a non-portable item offered as the key-like item (WR2-B1)?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["unlockHandler(),message(),itemDefinition,targetDefinition,hasItem()"]
---

# Q: Who owns wrong-order unlock refusal for a non-portable item offered as the key-like item (WR2-B1)?

## Answer

unlockHandler() in src/core/commands/verbs/index.ts is the sole handler owner; no second refusal owner exists. Added a branch before the missing-item check using bundle item portability and names; reused message() and made no state mutation. Parser acceptance untouched.

## Outcome

- Signal: useful

## Source Nodes

- unlockHandler(),message(),itemDefinition,targetDefinition,hasItem()