---
type: "query"
date: "2026-11-27T09:08:13.288271+00:00"
question: "Which coverage-graph nodes document the tutorial-complete gate for hub east/north?"
contributor: "graphify"
outcome: "dead_end"
---

# Q: Which coverage-graph nodes document the tutorial-complete gate for hub east/north?

## Answer

Coverage graph query returned only generic Unit 1 and workflow nodes; it did not surface the ward gate. Read docs/content/topics/assistance-ward.md §8 (flag table: tutorial-complete produced by puzzle-calibrate-assistance, read by hub east/north, older-interface east) and §10 (hub east/north gate and clues), plus docs/content/network-hub/rooms.yaml (conditions: flag-set tutorial-complete on east and north) directly. Code graph cited src/content/authored/rooms.ts:L4 where generated room preconditions match.

## Outcome

- Signal: dead_end