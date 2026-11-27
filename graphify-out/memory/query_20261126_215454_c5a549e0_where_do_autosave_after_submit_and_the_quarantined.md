---
type: "query"
date: "2026-11-26T21:54:54.767769+00:00"
question: "Where do autosave after submit and the quarantined-save download button live?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Game", "SaveManager", "SaveActions", "SaveControls", "GameWindow"]
---

# Q: Where do autosave after submit and the quarantined-save download button live?

## Answer

Canonical nodes: Game.submit() at src/application/Game.ts L46 with saveGame()/recordSeed(); SaveManager.save() at src/application/SaveManager.ts L35 writes only SAVE_KEY and quarantine is boot-only; SaveControls/SaveActions at src/ui/SaveControls.ts L14/L4 and GameWindow.makeActions()/downloadQuarantine() at src/ui/GameWindow.ts L129/L171 own the removed button. No duplicate production SaveManager node; FakeSaveManager is a test fixture only.

## Outcome

- Signal: useful

## Source Nodes

- Game
- SaveManager
- SaveActions
- SaveControls
- GameWindow