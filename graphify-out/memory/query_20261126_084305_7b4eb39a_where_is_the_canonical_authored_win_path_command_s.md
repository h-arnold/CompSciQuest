---
type: "query"
date: "2026-11-26T08:43:05.680263+00:00"
question: "Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["AuthoredWinPath.test.ts", "AuthoredRun", "11. Win check owner", "ScoreTracker", "QuizSystem", "HazardSystem", "TopicResolver", "ContentBundle"]
---

# Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?

## Answer

The canonical command driver is tests/turn/AuthoredWinPath.test.ts (AuthoredRun in tests/turn/AuthoredWinPathRun.ts), driven by walkthrough.md §2 and §8 steps 1-30; the win check owner is 11. Win check owner (docs/developer/application-and-ui.md L940) via Session.observe (src/core/lifecycle/Session.ts), with ScoreTracker (src/core/scoring/ScoreTracker.ts L12), QuizSystem (src/core/combat/QuizSystem.ts L8), HazardSystem (src/core/hazards/HazardSystem.ts L14) and TopicResolver (src/core/commands/TopicResolver.ts L14). The rewritten E2E-4 command path resolves all six stale handoffs; remaining red failures are production gaps: no area-change life reset, absent §8.6 Zone A interaction rows in src/core/commands/InteractionRules.ts, and downstream quiz/flag cascade.

## Outcome

- Signal: useful

## Source Nodes

- AuthoredWinPath.test.ts
- AuthoredRun
- 11. Win check owner
- ScoreTracker
- QuizSystem
- HazardSystem
- TopicResolver
- ContentBundle