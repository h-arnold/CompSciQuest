---
type: "query"
date: "2026-11-27T11:51:50.299224+00:00"
question: "Does mapping every item PUT target to the current room break existing parser verb contracts?"
contributor: "graphify"
outcome: "corrected"
source_nodes: ["putHandler()", "putInteraction()"]
---

# Q: Does mapping every item PUT target to the current room break existing parser verb contracts?

## Answer

Yes: tests/parser/VerbHandlers.test.ts P-PARSE-19 expects put key in chest to keep toOwnerId chest-1. The final fix narrows the room mapping to scenery or an authored PUT interaction fixture target, keeping that contract intact (595/595 tests pass).

## Outcome

- Signal: corrected

## Source Nodes

- putHandler()
- putInteraction()