---
type: "query"
date: "2026-11-26T16:20:02.916042+00:00"
question: "Do ordinary browser commands autosave the game state?"
contributor: "graphify"
outcome: "corrected"
source_nodes: ["SaveManager", "Game", "saveGame"]
---

# Q: Do ordinary browser commands autosave the game state?

## Answer

No autosave on ordinary commands in this branch; SaveManager.save() is called only by explicit save/meta actions. Browser assertions must issue 'save' before reading localStorage.

## Outcome

- Signal: corrected

## Source Nodes

- SaveManager
- Game
- saveGame