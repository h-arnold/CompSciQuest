---
type: "query"
date: "2026-11-26T22:08:37.440481+00:00"
question: "Which canonical nodes own autosave on Game.submit and the five SaveControls buttons for ENG24-AUTOSAVE-01 and ENG31-REMOVEQUARANTINE-01?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Game,submit(),SaveManager,GameWindow,SaveControls,SaveActions,OutputLog,CONTROL_ORDER,GameEvent,TitleScreen,GameViewData,formatEvent()"]
---

# Q: Which canonical nodes own autosave on Game.submit and the five SaveControls buttons for ENG24-AUTOSAVE-01 and ENG31-REMOVEQUARANTINE-01?

## Answer

Game.submit() at src/application/Game.ts L46 autosaves via SaveManager.save() at src/application/SaveManager.ts L35; SaveControls/SaveActions at src/ui/SaveControls.ts L13/L4 render the five buttons wired by GameWindow.makeActions(); CONTROL_ORDER lives in e2e/w7-accessibility.spec.ts L7.

## Outcome

- Signal: useful

## Source Nodes

- Game,submit(),SaveManager,GameWindow,SaveControls,SaveActions,OutputLog,CONTROL_ORDER,GameEvent,TitleScreen,GameViewData,formatEvent()