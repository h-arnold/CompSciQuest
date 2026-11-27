---
type: "query"
date: "2026-11-27T19:05:03.426823+00:00"
question: "Which canonical nodes own generated help text, transcript rendering and the four-part room heading for the MD-HELP-01/MD-STATUS-01 e2e updates?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["helpText(),COMMAND_TABLE,GameWindow,.renderBatch(),OutputLog,QuizPanel,formatEvent(),describeRoom()"]
---

# Q: Which canonical nodes own generated help text, transcript rendering and the four-part room heading for the MD-HELP-01/MD-STATUS-01 e2e updates?

## Answer

helpText() and COMMAND_TABLE in src/core/commands/CommandTable.ts generate the grouped help; GameWindow.renderBatch() and OutputLog append Markdown blocks; formatEvent() delegates room entry to roomEntryLines in src/core/RoomText.ts so look emits an h2 location heading.

## Outcome

- Signal: useful

## Source Nodes

- helpText(),COMMAND_TABLE,GameWindow,.renderBatch(),OutputLog,QuizPanel,formatEvent(),describeRoom()