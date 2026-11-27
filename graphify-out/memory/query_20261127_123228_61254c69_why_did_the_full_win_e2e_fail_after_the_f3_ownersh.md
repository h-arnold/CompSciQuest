---
type: "query"
date: "2026-11-27T12:32:28.209064+00:00"
question: "Why did the full-win e2e fail after the F3 ownership fix, and which failures were e2e fixture mistakes rather than product gaps?"
contributor: "graphify"
outcome: "corrected"
source_nodes: ["applyItemEffect(),hasUniqueItemOwnership(),QuizPanel,save,restore,TitleScreen"]
---

# Q: Why did the full-win e2e fail after the F3 ownership fix, and which failures were e2e fixture mistakes rather than product gaps?

## Answer

Four failures were test-code mistakes: quiz prompt order is shuffled by the game RNG so prompts must be compared as a set; the invented 'Score: 13 / 19' was replaced by the final progress row's earned/max score; import does not rewrite browser storage so savedAt/turn were read from the pre-import save and the savedAt-preservation assertion belongs at SaveManager level; and a momentary import race was removed by waiting for the 'Game imported.' status. No product expectation was weakened; all 94 e2e tests then passed.

## Outcome

- Signal: corrected

## Source Nodes

- applyItemEffect(),hasUniqueItemOwnership(),QuizPanel,save,restore,TitleScreen