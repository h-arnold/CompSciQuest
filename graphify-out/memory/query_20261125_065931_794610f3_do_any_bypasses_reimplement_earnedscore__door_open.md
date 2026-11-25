---
type: "query"
date: "2026-11-25T06:59:31.305357+00:00"
question: "Do any bypasses reimplement earnedScore, door-open flags, event bus, unknown message or exits formatting outside their canonical hubs?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["ScoreTracker,SaveManager,EventBus,EffectApplier,formatEvent,getCommandHandler"]
---

# Q: Do any bypasses reimplement earnedScore, door-open flags, event bus, unknown message or exits formatting outside their canonical hubs?

## Answer

No bypasses in src: earnedScore is only derived/read outside ScoreTracker (never effect-written); door-open flags are composed in the canonical verb table and validated in SaveManager; createEventBus, the unknown-message text and Exits: lines each have a single owner. No new cross-layer edges or cycles.

## Outcome

- Signal: useful

## Source Nodes

- ScoreTracker,SaveManager,EventBus,EffectApplier,formatEvent,getCommandHandler