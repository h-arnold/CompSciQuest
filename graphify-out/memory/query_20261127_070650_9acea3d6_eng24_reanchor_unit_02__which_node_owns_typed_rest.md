---
type: "query"
date: "2026-11-27T07:06:50.214663+00:00"
question: "ENG24-REANCHOR-UNIT-02: which node owns typed restart and its fresh-state save, and where is the inherited no-write loop?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Game", "SaveManager", "TurnPipeline.test.ts", "initialBatch()"]
---

# Q: ENG24-REANCHOR-UNIT-02: which node owns typed restart and its fresh-state save, and where is the inherited no-write loop?

## Answer

Game (src/application/Game.ts:45) handles typed restart in performMeta via startFresh(createFreshState()) and saveGame() (L341) calls SaveManager.save() (src/application/SaveManager.ts:33). The inherited loop lives in TurnPipeline.test.ts P-TURN-04; restart must be removed from the no-write loop and asserted separately as a second save with turn 0 and clear-views.

## Outcome

- Signal: useful

## Source Nodes

- Game
- SaveManager
- TurnPipeline.test.ts
- initialBatch()