---
type: "query"
date: "2026-11-26T20:40:31.912806+00:00"
question: "ENG16-SAVECONFIRM-01: where do the canonical Save/Download confirmation lines come from and how do sidebar buttons reach them?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["SaveControls", "SaveActions", "GameWindow", "Game.submit", "metaMessage", "OutputLog"]
---

# Q: ENG16-SAVECONFIRM-01: where do the canonical Save/Download confirmation lines come from and how do sidebar buttons reach them?

## Answer

SaveControls.save/download call SaveActions, and GameWindow.makeActions routes save/download through Game.submit; metaActionOf -> performMeta -> metaMessage publishes 'Game saved.' (Game.ts L401) and 'Save downloaded.' (Game.ts L408) on the bus, which OutputLog renders. Typed commands and buttons therefore share the same wording.

## Outcome

- Signal: useful

## Source Nodes

- SaveControls
- SaveActions
- GameWindow
- Game.submit
- metaMessage
- OutputLog