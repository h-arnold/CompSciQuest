---
type: "query"
date: "2026-11-25T11:55:16.439511+00:00"
question: "Where are the canonical owners for hazard/puzzle/scheduler/effect/score behaviour in the hazards-puzzles slice?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["HazardSystem,PuzzleSystem,Scheduler,ConditionEvaluator,EffectApplier,ScoreTracker,createPhase4(),GameEvent"]
---

# Q: Where are the canonical owners for hazard/puzzle/scheduler/effect/score behaviour in the hazards-puzzles slice?

## Answer

createHazardSystem, createPuzzleSystem, createScheduler, createConditionEvaluator, createPhase4, EffectApplier and ScoreTracker are the owners; validateContent now mirrors hazard-content and puzzle-graph findings.

## Outcome

- Signal: useful

## Source Nodes

- HazardSystem,PuzzleSystem,Scheduler,ConditionEvaluator,EffectApplier,ScoreTracker,createPhase4(),GameEvent