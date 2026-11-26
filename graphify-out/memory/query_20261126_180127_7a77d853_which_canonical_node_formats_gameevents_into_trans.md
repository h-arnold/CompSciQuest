---
type: "query"
date: "2026-11-26T18:01:27.434864+00:00"
question: "Which canonical node formats GameEvents into transcript lines for ENG22-SUCCESSIDS-01, and is there a duplicate owner?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["formatEvent(),topicLabel(),GameEvent"]
---

# Q: Which canonical node formats GameEvents into transcript lines for ENG22-SUCCESSIDS-01, and is there a duplicate owner?

## Answer

formatEvent() at src/ui/formatEvent.ts L11 is the sole formatter (EXTRACTED imports from GameWindow.ts and turn tests; calls topicLabel() at L43). The puzzle-solved arm now returns [] at render time; topic-completed and all other arms unchanged. No duplicate canonical node and no bypass reimplementing transcript literals found in src.

## Outcome

- Signal: useful

## Source Nodes

- formatEvent(),topicLabel(),GameEvent