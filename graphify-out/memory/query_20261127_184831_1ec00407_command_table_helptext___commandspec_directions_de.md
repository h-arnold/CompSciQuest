---
type: "query"
date: "2026-11-27T18:48:31.920330+00:00"
question: "COMMAND_TABLE helpText() CommandSpec DIRECTIONS describeRoom() scoreHandler() formatEvent() topicLabel() RoomSummary — which canonical nodes own grouped help and room-entry text?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["helpText()", "COMMAND_TABLE", "describeRoom()", "formatEvent()", "scoreHandler()", "RoomSummary"]
---

# Q: COMMAND_TABLE helpText() CommandSpec DIRECTIONS describeRoom() scoreHandler() formatEvent() topicLabel() RoomSummary — which canonical nodes own grouped help and room-entry text?

## Answer

helpText(), COMMAND_TABLE, CommandSpec and DIRECTIONS are owned by src/core/commands/CommandTable.ts; describeRoom() and scoreHandler() by src/core/commands/verbs/index.ts; formatEvent() and topicLabel() by src/ui/formatEvent.ts; RoomSummary by src/core/events/GameEvent.ts. No existing node owns roomEntryLines/ROOM_HEADING, so src/core/RoomText.ts is a new canonical helper, not a duplicate.

## Outcome

- Signal: useful

## Source Nodes

- helpText()
- COMMAND_TABLE
- describeRoom()
- formatEvent()
- scoreHandler()
- RoomSummary