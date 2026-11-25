---
type: "query"
date: "2026-11-25T18:55:00.220393+00:00"
question: "How should a quiz retry re-set emit while ScoreTracker awards once, and which object owns the injected initial state?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["ScoreTracker", "quizEnded()", "createScoreTracker()", "EffectApplier", "applyStateEffect()", "Game", "initialRuntimeState()", "flag-changed"]
---

# Q: How should a quiz retry re-set emit while ScoreTracker awards once, and which object owns the injected initial state?

## Answer

EffectApplier.applyStateEffect emits one flag-changed for every set-flag, including a re-set (shared-rules.md §5, application-and-ui.md §9). ScoreTracker.quizEnded compares state.flags[quiz-passed:<quizId>] with a lastObserved Map seeded from live state at createScoreTracker() and refreshed after each observe(); it skips only when isPassed && wasPassed, so a false→true transition or a still-false direct path awards once. No persisted field. Game.createGame uses dependencies.initialState directly as the single live state object; initialRuntimeState and its forwarding copies are removed (application-and-ui.md §10, §4).

## Outcome

- Signal: useful

## Source Nodes

- ScoreTracker
- quizEnded()
- createScoreTracker()
- EffectApplier
- applyStateEffect()
- Game
- initialRuntimeState()
- flag-changed