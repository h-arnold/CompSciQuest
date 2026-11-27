---
type: "query"
date: "2026-11-27T13:48:23.172463+00:00"
question: "Does the assistance orientation quiz always present questions in the authored questionIds order?"
contributor: "graphify"
outcome: "corrected"
correction: "Quiz questions are shuffled per attempt; assert against the displayed prompt/current question, not a fixed order."
source_nodes: ["GameViewData", "QuizView"]
---

# Q: Does the assistance orientation quiz always present questions in the authored questionIds order?

## Answer

No. The runtime shuffles the four question IDs per attempt; live state showed questionIds [q-ao-03, q-ao-04, q-ao-02, q-ao-01]. Browser assertions must read the currently displayed prompt rather than assume a fixed first question. Corrected an interim assumption during manual MCP retry checks.

## Outcome

- Signal: corrected
- Correction: Quiz questions are shuffled per attempt; assert against the displayed prompt/current question, not a fixed order.

## Source Nodes

- GameViewData
- QuizView