---
type: "query"
date: "2026-11-26T16:14:28.746858+00:00"
question: "Where does the progress panel render spec topic lines and how are citations removed for ENG25-CITATION-01?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["ScorePanel", "renderTopic()", "renderArea()", "SpecTopicView", "GameViewData"]
---

# Q: Where does the progress panel render spec topic lines and how are citations removed for ENG25-CITATION-01?

## Answer

renderTopic() in src/ui/ScorePanel.ts L11-13 renders 'title — status'; renderArea() L15 and .refresh() L37 are unchanged; GameViewData SpecTopicView still carries specReference. A crafted valid v1 save with completedTopics renders real authored titles/status in the sidebar.

## Outcome

- Signal: useful

## Source Nodes

- ScorePanel
- renderTopic()
- renderArea()
- SpecTopicView
- GameViewData