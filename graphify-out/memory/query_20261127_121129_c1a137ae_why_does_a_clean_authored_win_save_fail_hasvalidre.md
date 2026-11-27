---
type: "query"
date: "2026-11-27T12:11:29.012211+00:00"
question: "Why does a clean authored win save fail hasValidReferences and disable Continue after reload?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["applyItemEffect(),hasUniqueItemOwnership(),hasValidReferences(),transferItem()"]
---

# Q: Why does a clean authored win save fail hasValidReferences and disable Continue after reload?

## Answer

Quiz onPass grant-item adds an authored non-portable fixture card to the player without removing its initialRoom copy; give then transfers the player copy to the NPC, leaving two owners. hasUniqueItemOwnership() rejects duplicate item IDs, hasValidReferences() marks the won save invalid-content and boot quarantines it, so Continue is disabled. Evidence: MCP replay at give showed item-pattern-card-sequence in both room-pattern-bureau and npc-the-warp-dresser, quarantine reason invalid-content.

## Outcome

- Signal: useful

## Source Nodes

- applyItemEffect(),hasUniqueItemOwnership(),hasValidReferences(),transferItem()