---
type: "query"
date: "2026-11-26T16:49:29.045541+00:00"
question: "ENG11 browser QA: how should the W7 expectAreaConsistency helper assert sidebar state after the current-area-only change, and where does the headline score come from in a saved v1 DTO?"
contributor: "graphify"
outcome: "corrected"
source_nodes: ["ScorePanel", "expectAreaConsistency", "GameViewData", "AreaProgressView"]
---

# Q: ENG11 browser QA: how should the W7 expectAreaConsistency helper assert sidebar state after the current-area-only change, and where does the headline score come from in a saved v1 DTO?

## Answer

expectAreaConsistency now reads .score-panel > div lines, asserts exactly one area header line matching the current progress row, asserts that row's Score/earned/max and Rooms visited lines, and asserts no other progress row's area name appears. The persisted GameStateDto deliberately omits score; the view-data headline is derived as the sum of progress[].earnedScore (GameState.ts L36-41).

## Outcome

- Signal: corrected

## Source Nodes

- ScorePanel
- expectAreaConsistency
- GameViewData
- AreaProgressView