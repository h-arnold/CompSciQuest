---
type: "query"
date: "2026-11-27T17:57:52.713937+00:00"
question: "QuizPanel .refresh() requirementLine() FakeElement createTextNode() OutputLog — how is the quiz requirement rendered and how does the fake text node expose tagName for UI-PASSMARK-A11Y-03?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["QuizPanel", ".refresh()", "requirementLine()", "FakeElement", "createTextNode()", "OutputLog", "renderBlock()"]
---

# Q: QuizPanel .refresh() requirementLine() FakeElement createTextNode() OutputLog — how is the quiz requirement rendered and how does the fake text node expose tagName for UI-PASSMARK-A11Y-03?

## Answer

Canonical owner is QuizPanel.refresh() at src/ui/QuizPanel.ts L15 (class at L6); MD-UI-07 requires the pass requirement paragraph through block Markdown, so renderBlock of plain prose yields one #text child (FakeDocument.createTextNode at tests/fixtures/ui.ts L213 returns a FakeElement whose tagName is #text). UI-PASSMARK-A11Y-03 now pins exactly one #text child carrying REQUIREMENT_TEXT while keeping aria-live=polite; the current plain panel fails with expected [] to have a length of 1.

## Outcome

- Signal: useful

## Source Nodes

- QuizPanel
- .refresh()
- requirementLine()
- FakeElement
- createTextNode()
- OutputLog
- renderBlock()