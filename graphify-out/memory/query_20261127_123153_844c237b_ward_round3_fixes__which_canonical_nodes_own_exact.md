---
type: "query"
date: "2026-11-27T12:31:53.440686+00:00"
question: "ward-round3-fixes: which canonical nodes own exact quiz option text resolution, answer N/bare N and the outside-quiz unknown path?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["resolveGameCommand(),exactOptionAnswerCommand(),answerCommand(),bareAnswerCommand(),QuizSystem,evaluateAnswer()"]
---

# Q: ward-round3-fixes: which canonical nodes own exact quiz option text resolution, answer N/bare N and the outside-quiz unknown path?

## Answer

resolveGameCommand() at src/application/commandResolution.ts:L380 calls exactOptionAnswerCommand() at L363 before verb dispatch; answerCommand() L330 and bareAnswerCommand() L318 cover answer N and bare N; QuizSystem.handle() src/core/combat/QuizSystem.ts:L27 and evaluateAnswer() src/core/effects/EffectApplier.ts:L344 carry the downstream answer-evaluated/explanation/effects. MCP and e2e confirmed all three paths.

## Outcome

- Signal: useful

## Source Nodes

- resolveGameCommand(),exactOptionAnswerCommand(),answerCommand(),bareAnswerCommand(),QuizSystem,evaluateAnswer()