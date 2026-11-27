---
type: "query"
date: "2026-11-27T08:47:05.951618+00:00"
question: "W7F-01..14: which canonical owners implement parser aliases, unlock splitting, gate denial, blockedText shape/adapt, quiz idempotence, transfer announcement, title copy and room hint targets?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["COMMAND_TABLE,resolvePair(),RuleEngine,blockedTextFindings(),startQuiz(),announceHandover(),DEFAULT_TITLE_COPY,hintTargetFindings(),targetFindings()"]
---

# Q: W7F-01..14: which canonical owners implement parser aliases, unlock splitting, gate denial, blockedText shape/adapt, quiz idempotence, transfer announcement, title copy and room hint targets?

## Answer

Reused COMMAND_TABLE (aliases flow to MULTIWORD_ALIASES/SINGLE_ALIASES/helpText), resolvePair() in commandResolution for bare unlock, RuleEngine.check for one-line denial, schema.ts refusalTextFindings precedent mirrored by blockedTextFindings, adapt.ts bundleOf for blockedText, EffectApplier.startQuiz for the active-attempt guard, ConversationFlow.announceHandover for SHOW/GIVE, DEFAULT_TITLE_COPY in TitleScreen, and idsOf(collection(cards,'rooms')) in both hint target gates. No parallel owner found.

## Outcome

- Signal: useful

## Source Nodes

- COMMAND_TABLE,resolvePair(),RuleEngine,blockedTextFindings(),startQuiz(),announceHandover(),DEFAULT_TITLE_COPY,hintTargetFindings(),targetFindings()