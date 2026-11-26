---
type: "query"
date: "2026-11-26T17:24:29.887148+00:00"
question: "Where are the canonical seams for bare quiz answers and ask about <topic> NPC inference?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["resolveGameCommand()", "answerCommand()", "QuizSystem", "TopicResolver", "ConversationTopic", "ConditionEvaluator", "GameState"]
---

# Q: Where are the canonical seams for bare quiz answers and ask about <topic> NPC inference?

## Answer

Expanded from literal graph labels: resolveGameCommand(), answerCommand(), ParsedCommand, parseRaw(), QuizSystem, DialogueSystem, TopicResolver, ConversationTopic, GameState, ConditionEvaluator, askTopic(), isConditionMet(). Canonical nodes: resolveGameCommand() at src/application/commandResolution.ts:L247 and answerCommand() at L218 own the Command DTO; QuizSystem at src/core/combat/QuizSystem.ts:L8 owns the 1-based to 0-based conversion and the out-of-range message; ConversationTopic at src/core/npcs/ConversationTopic.ts:L7 and TopicResolver at src/core/commands/TopicResolver.ts:L14 own topic binding and phrase resolution; ConditionEvaluator/isConditionMet at src/core/rules/ConditionEvaluator.ts:L7/L15 own location scope evaluation; GameState at src/core/GameState.ts:L41 owns Position. No duplicate canonical owner found for any of these responsibilities.

## Outcome

- Signal: useful

## Source Nodes

- resolveGameCommand()
- answerCommand()
- QuizSystem
- TopicResolver
- ConversationTopic
- ConditionEvaluator
- GameState