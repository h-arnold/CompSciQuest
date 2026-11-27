---
type: "query"
date: "2026-11-27T18:51:42.469324+00:00"
question: "MD-HELP-01/MD-STATUS-01 round 1: which canonical nodes own the 21-verb COMMAND_TABLE group split, the Saves help section, and the four-entry room heading?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["COMMAND_TABLE", "helpText()", "SAVE_ACTIONS", "GROUP_ORDER", "HELP_GROUPS", "formatEvent()", "RoomSummary"]
---

# Q: MD-HELP-01/MD-STATUS-01 round 1: which canonical nodes own the 21-verb COMMAND_TABLE group split, the Saves help section, and the four-entry room heading?

## Answer

Canonical owner COMMAND_TABLE (src/core/commands/CommandTable.ts L21) holds exactly 21 parser verbs in four groups only: Movement, Looking and handling, People, Progress. SAVE_ACTIONS (L164) is a separate constant feeding the **Saves** help section emitted by helpText() (L210), with save, load, download, import, restart as inline code; Saves is not a COMMAND_TABLE entry group. GROUP_ORDER (L172) orders all five help sections. formatEvent() (src/ui/formatEvent.ts L12) formats RoomSummary (src/core/events/GameEvent.ts L4) as ## title, blank line, description, Exits. HELP_GROUPS in tests/fixtures/commandTable.ts L12 now mirrors the four entry groups. No duplicate canonical owner found.

## Outcome

- Signal: useful

## Source Nodes

- COMMAND_TABLE
- helpText()
- SAVE_ACTIONS
- GROUP_ORDER
- HELP_GROUPS
- formatEvent()
- RoomSummary