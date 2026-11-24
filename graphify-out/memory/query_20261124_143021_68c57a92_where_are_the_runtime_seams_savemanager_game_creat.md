---
type: "query"
date: "2026-11-24T14:30:21.608385+00:00"
question: "Where are the runtime seams SaveManager Game createInitial EffectApplier Session BrowserStorage defined and how do they connect?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["createSaveManager(),createGame(),createInitial(),createFromDto(),createEffectApplier(),createSession(),BrowserStorage"]
---

# Q: Where are the runtime seams SaveManager Game createInitial EffectApplier Session BrowserStorage defined and how do they connect?

## Answer

createSaveManager src/application/SaveManager.ts:L323, createGame src/application/Game.ts:L93, createInitial/createFromDto src/core/GameState.ts:L99/L80, createEffectApplier src/core/effects/EffectApplier.ts:L233, createSession src/core/lifecycle/Session.ts:L28, BrowserStorage src/storage/BrowserStorage.ts:L10. Reused canonical interfaces; no duplicate owners; no cross-layer core->application/storage/ui imports.

## Outcome

- Signal: useful

## Source Nodes

- createSaveManager(),createGame(),createInitial(),createFromDto(),createEffectApplier(),createSession(),BrowserStorage