---
type: "query"
date: "2026-11-26T20:16:46.462285+00:00"
question: "Which canonical node owns formatEvent transcript rendering for ENG10-FEEDBACK-01 answer-evaluated prefixes, and is there a duplicate owner?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["formatEvent()", "6.1 Event to view mapping", "GameEvent", "loadFormatEvent()"]
---

# Q: Which canonical node owns formatEvent transcript rendering for ENG10-FEEDBACK-01 answer-evaluated prefixes, and is there a duplicate owner?

## Answer

canonical owner is formatEvent() at src/ui/formatEvent.ts (L11; answer-evaluated arm at L22-24 currently returns [event.explanation] with no prefix). Contract from 6.1 Event to view mapping at docs/developer/application-and-ui.md L553 requires 'Correct. ' or 'Incorrect. ' followed by the unchanged explanation; hint-penalty-applied stays suppressed. GameEvent answer-evaluated fields at src/core/events/GameEvent.ts L71-77. No duplicate canonical formatter node found; Load format seam is loadFormatEvent() at tests/fixtures/turn.ts L62.

## Outcome

- Signal: useful

## Source Nodes

- formatEvent()
- 6.1 Event to view mapping
- GameEvent
- loadFormatEvent()