---
type: "query"
date: "2026-11-27T08:33:12.720056+00:00"
question: "ward-w7-fixes: canonical owners for parser aliases, unlock denial, quiz starts, hint targets"
contributor: "graphify"
outcome: "useful"
source_nodes: ["COMMAND_TABLE", "MULTIWORD_ALIASES", "unlockCommand()", "unlockHandler()", "createRuleEngine()", "parseCardSet()", "bundleOf()", "generateContent()", "TopicResolver", "selectTopic()"]
---

# Q: ward-w7-fixes: canonical owners for parser aliases, unlock denial, quiz starts, hint targets

## Answer

Red tests pinned COMMAND_TABLE/helpText() at CommandTable.ts:L17/L90, MULTIWORD_ALIASES at Parser.ts:L31, unlockCommand() at commandResolution.ts:L249, unlockHandler() at verbs/index.ts:L100, createRuleEngine at RuleEngine.ts:L20, parseCardSet at schema.ts:L227, bundleOf at adapt.ts:L70, generateContent at generate.ts:L180, TopicResolver at L14, selectTopic at TopicSelection.ts:L333, startQuiz at EffectApplier.ts:L308, conversationTransfer at ConversationFlow.ts:L160, DEFAULT_TITLE_COPY at TitleScreen.ts:L11, sequenceForRoom at HintSystem.ts:L61, hintTargetFindings at contentIds.ts:L194, checkHint at hint.ts:L119. Canonical shared owners: EffectApplier for quiz/hint effects and ConditionEvaluator at ConditionEvaluator.ts:L7 for conditions. hasKeyword() duplication lead between TopicResolver.ts:L23 and TopicSelection.ts:L96 recorded, not blessed. W7F-08 and W7F-12 were GREEN at red time.

## Outcome

- Signal: useful

## Source Nodes

- COMMAND_TABLE
- MULTIWORD_ALIASES
- unlockCommand()
- unlockHandler()
- createRuleEngine()
- parseCardSet()
- bundleOf()
- generateContent()
- TopicResolver
- selectTopic()
- startQuiz()
- conversationTransfer()
- DEFAULT_TITLE_COPY
- sequenceForRoom()
- hintTargetFindings()
- checkHint()
- EffectApplier
- ConditionEvaluator