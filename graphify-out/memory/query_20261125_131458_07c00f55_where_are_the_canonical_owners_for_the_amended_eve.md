---
type: "query"
date: "2026-11-25T13:14:58.528516+00:00"
question: "Where are the canonical owners for the amended event-returning phase-4 composition, hazard triggers, puzzle counters and per-puzzle scoring?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["createComposedReaction(),HazardSystem,PuzzleSystem,ScoreTracker,EffectApplier,TurnContext"]
---

# Q: Where are the canonical owners for the amended event-returning phase-4 composition, hazard triggers, puzzle counters and per-puzzle scoring?

## Answer

createComposedReaction() in src/application/ComposedReaction.ts concatenates Scheduler, HazardSystem, DialogueSystem, PuzzleSystem and HintSystem; each system applies its own effects via the injected EffectApplier and returns readonly GameEvent[]. HazardSystem owns on-verb/on-item-used matching from TurnContext.command and mid-phase effect application; PuzzleSystem owns turns-since counters; ScoreTracker alone awards Puzzle.score for covered topics with evidence and emits score-changed; EffectApplier alone constructs hazard-triggered from announce-hazard.

## Outcome

- Signal: useful

## Source Nodes

- createComposedReaction(),HazardSystem,PuzzleSystem,ScoreTracker,EffectApplier,TurnContext