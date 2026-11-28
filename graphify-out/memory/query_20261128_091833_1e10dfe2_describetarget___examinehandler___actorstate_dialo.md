---
type: "query"
date: "2026-11-28T09:18:33.479878+00:00"
question: "describeTarget() examineHandler() ActorState DialogueSystem describeScenery() message() SINGLE_ALIASES Command ParsedCommand EffectApplier .react() inferAskActor() — where is examine-on-NPC wording owned?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["describeTarget(),examineHandler(),ActorState,message(),examineInteraction(),DialogueSystem,describeScenery()"]
---

# Q: describeTarget() examineHandler() ActorState DialogueSystem describeScenery() message() SINGLE_ALIASES Command ParsedCommand EffectApplier .react() inferAskActor() — where is examine-on-NPC wording owned?

## Answer

Canonical node for examine fallback text is describeTarget() (src/core/commands/verbs/index.ts:L100), called by examineHandler() (L268), with message() at L21. ActorState (src/core/npcs/ActorState.ts:L4) canonically owns stateDesc (npcs.md §2) and is the in-world source for the showrunner decision; authored examine interactions are owned by examineInteraction() (src/core/commands/InteractionRules.ts:L475, scenery-tiles only). No duplicate canonical node claims examine-on-NPC output.

## Outcome

- Signal: useful

## Source Nodes

- describeTarget(),examineHandler(),ActorState,message(),examineInteraction(),DialogueSystem,describeScenery()