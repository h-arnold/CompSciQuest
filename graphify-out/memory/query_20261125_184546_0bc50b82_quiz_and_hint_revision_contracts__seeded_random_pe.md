---
type: "query"
date: "2026-11-25T18:45:46.698412+00:00"
question: "Quiz and hint revision contracts: seeded Random persistence, set-flag no-op, answer aliases, automatic hint cadence"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Random,Game,EffectApplier,QuizSystem,commandResolution.ts,HintSystem,HazardSystem"]
---

# Q: Quiz and hint revision contracts: seeded Random persistence, set-flag no-op, answer aliases, automatic hint cadence

## Answer

Located canonical owners in src/core/Random.ts, src/application/Game.ts, src/core/effects/EffectApplier.ts, src/core/combat/QuizSystem.ts, src/application/commandResolution.ts, src/core/hints/HintSystem.ts and src/core/hazards/HazardSystem.ts; reused rather than duplicating. Hazard on-room-enter initial fallback narrowed to the area start room so an injected non-start scene is not a room entry.

## Outcome

- Signal: useful

## Source Nodes

- Random,Game,EffectApplier,QuizSystem,commandResolution.ts,HintSystem,HazardSystem