---
type: "query"
date: "2026-11-26T16:36:42.152339+00:00"
question: "Which production node owns sidebar area-card rendering and how should it select the current area from GameViewData?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["ScorePanel", "renderArea()", "renderTopic()", ".refresh()", "AreaProgressView", "GameViewData", ".getViewData()"]
---

# Q: Which production node owns sidebar area-card rendering and how should it select the current area from GameViewData?

## Answer

ScorePanel.refresh() (src/ui/ScorePanel.ts L37) is the sole owner: it reads GameViewData once via Game.getViewData() and renders only the areas entry whose worldId/areaId match data.position through renderArea() (L15); renderTopic() (L11) keeps title and status and omits specReference.

## Outcome

- Signal: useful

## Source Nodes

- ScorePanel
- renderArea()
- renderTopic()
- .refresh()
- AreaProgressView
- GameViewData
- .getViewData()