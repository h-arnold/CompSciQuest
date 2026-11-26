---
type: "query"
date: "2026-11-26T17:01:37.522636+00:00"
question: "ENG2-HELP-01 revision 2: which node owns go <direction> alias resolution when help advertises direction shortcuts?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["resolveGameCommand()", "isDirection()", "DIRECTION_NAMES", "DIRECTIONS", "parseRaw()", "commandResolution.ts", "CommandTable.ts"]
---

# Q: ENG2-HELP-01 revision 2: which node owns go <direction> alias resolution when help advertises direction shortcuts?

## Answer

Canonical owner is resolveGameCommand() (src/application/commandResolution.ts L235), aided by isDirection() (L20) and DIRECTION_NAMES (L12). The names set is derived from DIRECTIONS (src/core/commands/CommandTable.ts L59) but does not include shortcuts, so 'go n' becomes unknown while 'n' and 'go north' work. parseRaw() (src/core/commands/Parser.ts L90) already expands the shortcut, so the fix belongs in commandResolution.ts, not the parser or goHandler(). Red test: tests/parser/GoDirectionAlias.test.ts.

## Outcome

- Signal: useful

## Source Nodes

- resolveGameCommand()
- isDirection()
- DIRECTION_NAMES
- DIRECTIONS
- parseRaw()
- commandResolution.ts
- CommandTable.ts