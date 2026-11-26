---
type: "query"
date: "2026-11-26T16:03:47.590361+00:00"
question: "Where is the sidebar progress-panel spec topic line rendered, and who owns it?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["ScorePanel,renderTopic(),renderArea(),appendLine(),SpecTopicView"]
---

# Q: Where is the sidebar progress-panel spec topic line rendered, and who owns it?

## Answer

renderTopic() in src/ui/ScorePanel.ts L11 is the sole owner; it calls appendLine() and is called by renderArea(). No second production owner of the title/specReference/status line exists. specReference removal is a rendering-only change.

## Outcome

- Signal: useful

## Source Nodes

- ScorePanel,renderTopic(),renderArea(),appendLine(),SpecTopicView