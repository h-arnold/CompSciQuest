---
type: "query"
date: "2026-11-26T16:33:49.544200+00:00"
question: "Which production node owns the sidebar progress panel and how does it render area cards from GameViewData?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["ScorePanel", ".refresh()", "renderArea()", "renderTopic()", "AreaProgressView", "GameViewData"]
---

# Q: Which production node owns the sidebar progress panel and how does it render area cards from GameViewData?

## Answer

Canonical owner is ScorePanel (src/ui/ScorePanel.ts L27): .refresh() (L37) calls Game.getViewData() and renderArea() (L15) writes each area; renderTopic() (L11) keeps topic title/status and omits specReference. AreaProgressView/GameViewData live in src/application/GameViewData.ts L15/L47. ENG11 requires only the area matching GameViewData.position to render with its own totals. Test writer started at ScorePanel, not a duplicate.

## Outcome

- Signal: useful

## Source Nodes

- ScorePanel
- .refresh()
- renderArea()
- renderTopic()
- AreaProgressView
- GameViewData