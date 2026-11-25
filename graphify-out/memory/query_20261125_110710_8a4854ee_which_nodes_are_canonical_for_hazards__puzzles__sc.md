---
type: "query"
date: "2026-11-25T11:07:10.983935+00:00"
question: "Which nodes are canonical for hazards, puzzles, scheduler, effects and phase-4 ordering in the hazards-puzzles slice?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["HazardSystem,PuzzleSystem,Scheduler,EffectApplier,ConditionEvaluator,ScoreTracker,EventBus,GameStateDto,Turn pipeline (buffered events),Silent cascade skip,Effect-to-event mapping,Canonical GameEvent union"]
---

# Q: Which nodes are canonical for hazards, puzzles, scheduler, effects and phase-4 ordering in the hazards-puzzles slice?

## Answer

Canonical code owners are HazardSystem at src/core/hazards/HazardSystem.ts:L6, PuzzleSystem at src/core/puzzles/PuzzleSystem.ts:L6, Scheduler at src/core/scheduling/Scheduler.ts:L5, EffectApplier at src/core/effects/EffectApplier.ts:L13, ConditionEvaluator at src/core/rules/ConditionEvaluator.ts:L6, ScoreTracker at src/core/scoring/ScoreTracker.ts:L6, EventBus at src/core/events/EventBus.ts:L4 and GameStateDto at src/core/GameState.ts:L15. Doc nodes with loc None (Turn pipeline (buffered events), Silent cascade skip, Effect-to-event mapping, Canonical GameEvent union) are cited by document section, not alternative owners. Authoring gate helpers telegraphFinding() and clueFindings() live at tools/content/gates/hazard.ts:L17 and tools/content/gates/puzzle.ts:L34.

## Outcome

- Signal: useful

## Source Nodes

- HazardSystem,PuzzleSystem,Scheduler,EffectApplier,ConditionEvaluator,ScoreTracker,EventBus,GameStateDto,Turn pipeline (buffered events),Silent cascade skip,Effect-to-event mapping,Canonical GameEvent union