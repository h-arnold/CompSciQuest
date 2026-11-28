---
type: "query"
date: "2026-11-28T06:55:37.213650+00:00"
question: "Is there a second owner of scroll-to-latest behaviour or a cross-layer edge after adding OutputLog.scrollToLatest()?"
contributor: "graphify"
outcome: "useful"
source_nodes: [".scrollToLatest()", "OutputLog", "GameWindow"]
---

# Q: Is there a second owner of scroll-to-latest behaviour or a cross-layer edge after adding OutputLog.scrollToLatest()?

## Answer

No. Grep of src shows a single scrollTop = scrollHeight computation inside OutputLog.scrollToLatest(); three call sites in GameWindow; no added imports, no new god node, no new cross-layer edge or cycle.

## Outcome

- Signal: useful

## Source Nodes

- .scrollToLatest()
- OutputLog
- GameWindow