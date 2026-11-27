---
type: "query"
date: "2026-11-27T12:31:53.683554+00:00"
question: "Does a wrong free-text quiz answer receive the quiz's out-of-range string?"
contributor: "graphify"
outcome: "corrected"
source_nodes: ["resolveGameCommand(),QuizSystem,evaluateAnswer()"]
---

# Q: Does a wrong free-text quiz answer receive the quiz's out-of-range string?

## Answer

No. Unmatched free text and letters take the existing friendly unknown line 'I don't understand that.'; only out-of-range numbers take 'That answer is not one of the choices.' Neither advances the quiz or changes quiz state, matching WR3-A2's friendly-rejection contract.

## Outcome

- Signal: corrected

## Source Nodes

- resolveGameCommand(),QuizSystem,evaluateAnswer()