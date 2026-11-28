---
type: "query"
date: "2026-11-28T09:25:35.474906+00:00"
question: "slice3-examine-npc: where is the current NPC stateDesc read for examine, and is there a canonical lookup helper to reuse?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["describeTarget(),examineHandler(),ActorState,stateDesc,ConversationFlow.ts"]
---

# Q: slice3-examine-npc: where is the current NPC stateDesc read for examine, and is there a canonical lookup helper to reuse?

## Answer

describeTarget() (src/core/commands/verbs/index.ts:L100) is the canonical examine fallback owner; the current state is read via context.state.npcs[actorId]?.stateId and bundle.actorStates.getById(stateId)?.stateDesc, matching ConversationFlow.ts:L225/244. No separate helper exists; the change stays inside describeTarget(). Item/scenery paths unchanged.

## Outcome

- Signal: useful

## Source Nodes

- describeTarget(),examineHandler(),ActorState,stateDesc,ConversationFlow.ts