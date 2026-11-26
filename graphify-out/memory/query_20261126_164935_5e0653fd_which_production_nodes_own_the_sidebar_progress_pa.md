---
type: "query"
date: "2026-11-26T16:49:35.964225+00:00"
question: "Which production nodes own the sidebar progress panel and how does ScorePanel.renderArea/refresh render area cards from GameViewData for ENG11?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["ScorePanel", "renderArea", "refresh", "GameViewData", "areaViews"]
---

# Q: Which production nodes own the sidebar progress panel and how does ScorePanel.renderArea/refresh render area cards from GameViewData for ENG11?

## Answer

ScorePanel.refresh() gets GameViewData, finds the areas entry matching data.position and calls renderArea() for that entry only; renderArea() emits the world/area header, Score: earned/max, Rooms visited: visited/rooms and topic title/status lines. Game.areaViews() maps each saved progress row, but the panel filters to the current position.

## Outcome

- Signal: useful

## Source Nodes

- ScorePanel
- renderArea
- refresh
- GameViewData
- areaViews