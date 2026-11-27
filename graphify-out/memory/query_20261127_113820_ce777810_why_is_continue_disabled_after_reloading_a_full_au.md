---
type: "query"
date: "2026-11-27T11:38:20.512863+00:00"
question: "Why is Continue disabled after reloading a full authored win save?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src_core_effects_effectapplier_transferitem,SaveManager,TitleScreen"]
---

# Q: Why is Continue disabled after reloading a full authored win save?

## Answer

The canonical step-28 PUT files the rogue thread into item-counterfoil-drawer; EffectApplier.transferItem() creates state.rooms['item-counterfoil-drawer'], and SaveManager.validate() rejects unknown room IDs as invalid-content, so boot quarantines the save and TitleScreen disables Continue. MCP evidence: quarantine reason invalid-content and post-reload Continue disabled screenshot.

## Outcome

- Signal: useful

## Source Nodes

- src_core_effects_effectapplier_transferitem,SaveManager,TitleScreen