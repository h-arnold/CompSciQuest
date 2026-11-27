---
type: "query"
date: "2026-11-27T19:19:48.597538+00:00"
question: "Do style.css, .output-log and .table-scroll exist as labels in graphify-out/graph.json for MD-CSS browser QA?"
contributor: "graphify"
outcome: "dead_end"
---

# Q: Do style.css, .output-log and .table-scroll exist as labels in graphify-out/graph.json for MD-CSS browser QA?

## Answer

No. graph.json has 3563 nodes but no CSS labels; graphify query with those tokens returns no matching start nodes. Use the confirmed renderer/UI labels and the canonical 7.1 DOM layout section instead.

## Outcome

- Signal: dead_end