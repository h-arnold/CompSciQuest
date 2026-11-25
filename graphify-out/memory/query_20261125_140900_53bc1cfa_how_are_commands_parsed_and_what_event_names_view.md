---
type: "query"
date: "2026-11-25T14:09:00.215739+00:00"
question: "How are commands parsed and what event names/view fields exist for assertions?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["parseRaw(),resolveGameCommand(),GameEvent,GameViewData,TitleScreen,SaveControls,formatEvent(),OutputLog,ScorePanel"]
---

# Q: How are commands parsed and what event names/view fields exist for assertions?

## Answer

Parser.ts parseRaw tokenizes; Game.ts resolveGameCommand builds Command union; GameEvent.ts has game-won/hazard-triggered/puzzle-solved/etc; GameViewData.ts has status/lives/score/areas/topics

## Outcome

- Signal: useful

## Source Nodes

- parseRaw(),resolveGameCommand(),GameEvent,GameViewData,TitleScreen,SaveControls,formatEvent(),OutputLog,ScorePanel