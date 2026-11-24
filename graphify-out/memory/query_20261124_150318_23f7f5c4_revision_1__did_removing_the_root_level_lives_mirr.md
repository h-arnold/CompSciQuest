---
type: "query"
date: "2026-11-24T15:03:18.137637+00:00"
question: "Revision 1: did removing the root-level lives mirror and stub default restore canonical GameStateDto and initial turn 0?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["SaveManager,Game,GameStateDto,createInitial(),createGame(),getViewData()"]
---

# Q: Revision 1: did removing the root-level lives mirror and stub default restore canonical GameStateDto and initial turn 0?

## Answer

Yes. SaveManager.validate() now returns the parsed state unchanged; Game.getViewData() reports derived state.score; createGame() defaults to createInitial() with turn 0. All four gates green; graph rebuilt to 542 nodes/1086 edges with no new hub or cross-layer edge.

## Outcome

- Signal: useful

## Source Nodes

- SaveManager,Game,GameStateDto,createInitial(),createGame(),getViewData()