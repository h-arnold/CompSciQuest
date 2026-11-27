---
type: "query"
date: "2026-11-26T20:32:42.822613+00:00"
question: "ENG10 e2e: why did the quiz panel stay hidden when the ask command was submitted immediately after the second east?"
contributor: "graphify"
outcome: "corrected"
correction: "Wait for room-entry effects to complete before the quiz trigger command."
source_nodes: ["enterSwitchFloorQuiz()", "submit()", "waitForLine()", "The Binary Hall"]
---

# Q: ENG10 e2e: why did the quiz panel stay hidden when the ask command was submitted immediately after the second east?

## Answer

The ask command was typed before the overheat entry effects finished, so it was never echoed or processed. Waiting for both real room titles, The Switch Floor then The Binary Hall, before submitting the ask makes the quiz panel appear reliably.

## Outcome

- Signal: corrected
- Correction: Wait for room-entry effects to complete before the quiz trigger command.

## Source Nodes

- enterSwitchFloorQuiz()
- submit()
- waitForLine()
- The Binary Hall