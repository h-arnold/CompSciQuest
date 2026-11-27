---
type: "query"
date: "2026-11-27T11:19:28.680064+00:00"
question: "Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["AuthoredWinPath.test.ts,AuthoredWinPathRun.ts,.followPath(),.startQuiz(),HintPanel,QuizPanel,OutputLog,Game,isWon()"]
---

# Q: Where is the canonical authored win path command sequence and whole-game V4 trace that owns quiz handoffs, hazard lives, teaching ladders and game-won?

## Answer

tests/turn/AuthoredWinPath.test.ts and AuthoredWinPathRun.ts (AuthoredRun) drive walkthrough.md §2 and §8 steps 1-30; win check owner in docs/developer/application-and-ui.md §11; ScoreTracker, QuizSystem, HazardSystem, TopicResolver are the canonical collaborators.

## Outcome

- Signal: useful

## Source Nodes

- AuthoredWinPath.test.ts,AuthoredWinPathRun.ts,.followPath(),.startQuiz(),HintPanel,QuizPanel,OutputLog,Game,isWon()