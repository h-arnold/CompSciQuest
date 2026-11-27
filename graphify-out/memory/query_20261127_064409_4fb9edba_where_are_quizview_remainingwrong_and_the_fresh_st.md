---
type: "query"
date: "2026-11-27T06:44:09.494761+00:00"
question: "Where are QuizView.remainingWrong and the fresh-start save writes defined, and which doc sections own them?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["QuizView", "QuizStateDto", "Game", "SaveManager", "GameViewData"]
---

# Q: Where are QuizView.remainingWrong and the fresh-start save writes defined, and which doc sections own them?

## Answer

QuizView [GameViewData.ts L27] and Game [Game.ts L45] own the view derivation; .newGame()/.restart() [Game.ts L47/L49] and SaveManager.save() [SaveManager.ts L35] own the fresh-start write. Canonical doc anchors: application-and-ui.md §4/§4.1/§7.2 and storage-schema.md §10/§11.

## Outcome

- Signal: useful

## Source Nodes

- QuizView
- QuizStateDto
- Game
- SaveManager
- GameViewData