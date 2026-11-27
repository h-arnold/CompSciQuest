---
type: "query"
date: "2026-11-27T06:54:31.354180+00:00"
question: "ENG24-FRESHSTART-01/DEDUP-01: which nodes own fresh-start state construction and the live save write?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Game", "SaveManager", "createInitial()"]
---

# Q: ENG24-FRESHSTART-01/DEDUP-01: which nodes own fresh-start state construction and the live save write?

## Answer

Game (src/application/Game.ts:45) with .newGame() L47 and .restart() L49 owns the three fresh-start paths; SaveManager (src/application/SaveManager.ts:33) with .save() L35 owns the live storage write; createInitial() (src/core/GameState.ts:105) is the core fresh-state factory. One local seam named createFreshState in Game.ts must be the sole caller of createInitial() and all fresh-start paths must delegate to it.

## Outcome

- Signal: useful

## Source Nodes

- Game
- SaveManager
- createInitial()