---
type: "query"
date: "2026-11-25T10:48:59.398478+00:00"
question: "Do hazard and puzzle doc concept nodes expose runtime source_location?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["HazardSystem,PuzzleSystem,ScheduledEvent (fuse / daemon),Silent cascade skip,title-and-session.spec.ts"]
---

# Q: Do hazard and puzzle doc concept nodes expose runtime source_location?

## Answer

Doc nodes such as HazardSystem, PuzzleSystem, ScheduledEvent (fuse / daemon) and Silent cascade skip have loc None in docs/developer/*.md; they are citation anchors only, not code owners. Graph has no nodes for individual test() calls in e2e specs.

## Outcome

- Signal: useful

## Source Nodes

- HazardSystem,PuzzleSystem,ScheduledEvent (fuse / daemon),Silent cascade skip,title-and-session.spec.ts