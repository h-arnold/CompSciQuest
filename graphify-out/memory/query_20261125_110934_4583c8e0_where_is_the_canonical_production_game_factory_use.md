---
type: "query"
date: "2026-11-25T11:09:34.913720+00:00"
question: "Where is the canonical production Game factory used by main.ts for UI-BOOT-18 wiring?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Game façade,createGame(),Game,Turn pipeline (buffered events)"]
---

# Q: Where is the canonical production Game factory used by main.ts for UI-BOOT-18 wiring?

## Answer

The canonical production factory is createGame() in src/application/Game.ts; main.ts must call it without injecting check/dispatch/react so the real verb handler produces turn events. The phase seams are optional test injections, not production defaults.

## Outcome

- Signal: useful

## Source Nodes

- Game façade,createGame(),Game,Turn pipeline (buffered events)