---
type: "query"
date: "2026-11-24T14:30:35.846553+00:00"
question: "Bypass check: do compsciquest:save:v1, door-open: or earnedScore have code paths outside the canonical hubs?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["SaveManager,GameState,EffectApplier,SAVE_KEY,earnedScore"]
---

# Q: Bypass check: do compsciquest:save:v1, door-open: or earnedScore have code paths outside the canonical hubs?

## Answer

No bypasses found. Storage keys and door-open: prefix appear only in SaveManager.ts:L12-14; earnedScore derived only in core/GameState.ts:L83 and validated in SaveManager.ts:L145. EffectApplier never writes score. No core->application/storage/ui imports; no new god-node hubs beyond existing GameState/Effect/ContentBundle.

## Outcome

- Signal: useful

## Source Nodes

- SaveManager,GameState,EffectApplier,SAVE_KEY,earnedScore