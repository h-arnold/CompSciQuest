---
type: "query"
date: "2026-11-26T16:14:28.876383+00:00"
question: "How can authored spec topics be made visible in the sidebar for browser verification without playing the whole quiz?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["SpecTopic", "ensureProgressRow()", "GameViewData"]
---

# Q: How can authored spec topics be made visible in the sidebar for browser verification without playing the whole quiz?

## Answer

Seed a valid v1 save with progress[].completedTopics containing real authored specTopics ids and matching area/room ids; Game.areaViews maps completedTopics to SpecTopicView, so ScorePanel shows title and status. Proved in browser and e2e.

## Outcome

- Signal: useful

## Source Nodes

- SpecTopic
- ensureProgressRow()
- GameViewData