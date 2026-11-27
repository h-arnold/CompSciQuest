---
type: "query"
date: "2026-11-27T18:41:49.999285+00:00"
question: "MD-HELP and MD-STATUS: which canonical nodes own generated help, room entry lines and status copy?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["helpText()", "COMMAND_TABLE", "formatEvent()", "topicLabel()", "describeRoom()", "scoreHandler()"]
---

# Q: MD-HELP and MD-STATUS: which canonical nodes own generated help, room entry lines and status copy?

## Answer

Start at helpText() and COMMAND_TABLE in src/core/commands/CommandTable.ts for grouped help; formatEvent() and topicLabel() in src/ui/formatEvent.ts for status lines; describeRoom() and scoreHandler() in src/core/commands/verbs/index.ts for look and score command copy; the planned src/core/RoomText.ts owns ROOM_HEADING and roomEntryLines per spec section 6.1.

## Outcome

- Signal: useful

## Source Nodes

- helpText()
- COMMAND_TABLE
- formatEvent()
- topicLabel()
- describeRoom()
- scoreHandler()