---
type: "query"
date: "2026-11-25T12:03:39.402098+00:00"
question: "Which collaborators canonically own game-over, score awards and hazard events so test seams should delegate to them?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Session,.observe(),ScoreTracker,createScoreTracker(),EffectApplier,createEffectApplier(),phaseFakes(),loadSession()"]
---

# Q: Which collaborators canonically own game-over, score awards and hazard events so test seams should delegate to them?

## Answer

Session.observe() at src/core/lifecycle/Session.ts:L10 owns the game-over transition and final score; ScoreTracker.createScoreTracker() at src/core/scoring/ScoreTracker.ts:L109 is the sole writer of AreaProgress.earnedScore; EffectApplier.createEffectApplier() at src/core/effects/EffectApplier.ts:L267 maps announce-hazard to hazard-triggered. Test fakes should not replace these owners; inject the real collaborators instead so production workarounds are unnecessary.

## Outcome

- Signal: useful

## Source Nodes

- Session,.observe(),ScoreTracker,createScoreTracker(),EffectApplier,createEffectApplier(),phaseFakes(),loadSession()