---
type: "query"
date: "2026-11-25T13:09:40.550270+00:00"
question: "Which canonical nodes own condition scoping (in-room/in-area and progress-wide visited-room/topic-complete), and are there duplicate owners or bypasses after the room-scoping change?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["isConditionMet(),Condition,progressEntry(),ConditionEvaluator,GameState,AreaProgress,Position,ScoreTracker"]
---

# Q: Which canonical nodes own condition scoping (in-room/in-area and progress-wide visited-room/topic-complete), and are there duplicate owners or bypasses after the room-scoping change?

## Answer

Owner is isConditionMet() in src/core/rules/ConditionEvaluator.ts:15 with the Condition union in src/core/rules/Condition.ts:2. progressEntry() was deleted from the evaluator; the two progress[0] reads remaining in EffectApplier.ts:100 and ScoreTracker.ts:19 are separate concerns (recording/scoring, out of scope). No duplicate condition evaluator and no bypass reimplementing position/scope evaluation; the doc ConditionEvaluator/Condition nodes are canonical contracts, not code duplicates.

## Outcome

- Signal: useful

## Source Nodes

- isConditionMet(),Condition,progressEntry(),ConditionEvaluator,GameState,AreaProgress,Position,ScoreTracker