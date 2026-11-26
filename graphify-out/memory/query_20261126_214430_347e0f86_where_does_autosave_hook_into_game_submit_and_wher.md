---
type: "query"
date: "2026-11-26T21:44:30.760218+00:00"
question: "Where does autosave hook into Game.submit and where is the quarantine download button defined?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Game", "GameWindow", "SaveControls", "SaveActions", "SaveManager", "OutputLog"]
---

# Q: Where does autosave hook into Game.submit and where is the quarantine download button defined?

## Answer

Game.submit at src/application/Game.ts L46; GameWindow.makeActions at src/ui/GameWindow.ts L129 and downloadQuarantine at L171; SaveControls.downloadQuarantine at src/ui/SaveControls.ts L10 backed by SaveManager.save at src/application/SaveManager.ts L35

## Outcome

- Signal: useful

## Source Nodes

- Game
- GameWindow
- SaveControls
- SaveActions
- SaveManager
- OutputLog