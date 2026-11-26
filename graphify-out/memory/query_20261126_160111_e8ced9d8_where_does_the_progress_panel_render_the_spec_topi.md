---
type: "query"
date: "2026-11-26T16:01:11.102058+00:00"
question: "Where does the progress panel render the spec topic title, specReference and status that the citation removal must change?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["ScorePanel", "renderTopic()", "renderArea()", "SpecTopicView", "AreaProgressView", "GameViewData", "SpecStatus"]
---

# Q: Where does the progress panel render the spec topic title, specReference and status that the citation removal must change?

## Answer

Canonical owner is ScorePanel (src/ui/ScorePanel.ts): renderTopic() at L11 interpolates title, specReference and status into one line; renderArea() at L18 loops topics; ScorePanel.refresh() at L40 reads GameViewData. View nodes SpecTopicView L7, AreaProgressView L15 and GameViewData L47 live in src/application/GameViewData.ts. statusText() in tests/ui/SaveControls.test.ts and e2e/helpers.ts is a recorded duplication lead, not the canonical renderer.

## Outcome

- Signal: useful

## Source Nodes

- ScorePanel
- renderTopic()
- renderArea()
- SpecTopicView
- AreaProgressView
- GameViewData
- SpecStatus