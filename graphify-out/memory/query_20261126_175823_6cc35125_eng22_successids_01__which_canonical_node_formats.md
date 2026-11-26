---
type: "query"
date: "2026-11-26T17:58:23.693312+00:00"
question: "ENG22-SUCCESSIDS-01: which canonical node formats puzzle-solved and topic-completed transcript lines, and where is topicLabel() defined?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["formatEvent", "topicLabel", "GameEvent", "loadFormatEvent", "formatEvent.test.ts"]
---

# Q: ENG22-SUCCESSIDS-01: which canonical node formats puzzle-solved and topic-completed transcript lines, and where is topicLabel() defined?

## Answer

The canonical sole formatter is formatEvent() at src/ui/formatEvent.ts L11; topicLabel() at src/ui/formatEvent.ts L7 resolves bundle.specTopics.getById(topicId)?.title ?? topicId; GameEvent union is at src/core/events/GameEvent.ts L11. The puzzle-solved arm at L57-65 is the only defect; all inherited arms stay unchanged.

## Outcome

- Signal: useful

## Source Nodes

- formatEvent
- topicLabel
- GameEvent
- loadFormatEvent
- formatEvent.test.ts