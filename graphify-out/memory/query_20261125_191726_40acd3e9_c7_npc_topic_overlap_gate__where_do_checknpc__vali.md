---
type: "query"
date: "2026-11-25T19:17:26.137191+00:00"
question: "C7 npc topic overlap gate: where do checkNpc, validateCards, ValidationOptions and Condition exclusivity live and is there an existing overlap owner?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["checkNpc() validateCards() validateCommand() ValidationOptions Condition isConditionMet() checkTopicOverlap()"]
---

# Q: C7 npc topic overlap gate: where do checkNpc, validateCards, ValidationOptions and Condition exclusivity live and is there an existing overlap owner?

## Answer

No existing C7 overlap owner; checkNpc at tools/content/gates/npc.ts:L122, validateCards/validateCommand at tools/content/validate.ts:L48/L69, ValidationOptions at tools/content/contracts.ts:L34, Condition at src/core/rules/Condition.ts:L2, isConditionMet at src/core/rules/ConditionEvaluator.ts:L15. Added one gate module tools/content/gates/topicOverlap.ts with checkTopicOverlap, called from checkNpc when options.topicOverlap is true.

## Outcome

- Signal: useful

## Source Nodes

- checkNpc() validateCards() validateCommand() ValidationOptions Condition isConditionMet() checkTopicOverlap()