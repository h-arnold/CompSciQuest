---
type: "query"
date: "2026-11-25T14:54:05.146815+00:00"
question: "Where is room-entered built and formatted, and which nodes carry the catalogue room summary?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["EffectApplier", "applyEntityEffect()", "initialBatch()", "RoomSummary", "formatEvent()"]
---

# Q: Where is room-entered built and formatted, and which nodes carry the catalogue room summary?

## Answer

EffectApplier.applyEntityEffect() builds room-entered from effect.roomId at EffectApplier.ts:L125-L138; Game.initialBatch() builds RoomSummary from bundle.rooms.getById at Game.ts:L80-L95; formatEvent() renders title/description/Exits at formatEvent.ts:L19; RoomSummary at GameEvent.ts:L4.

## Outcome

- Signal: useful

## Source Nodes

- EffectApplier
- applyEntityEffect()
- initialBatch()
- RoomSummary
- formatEvent()