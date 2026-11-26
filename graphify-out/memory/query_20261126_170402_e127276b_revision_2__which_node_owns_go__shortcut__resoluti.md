---
type: "query"
date: "2026-11-26T17:04:02.843984+00:00"
question: "Revision 2: which node owns go <shortcut> resolution and how to bind shortcuts to canonical Directions without a second direction list?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["resolveGameCommand(),directionCommand(),DIRECTION_BY_TOKEN,DIRECTIONS,commandResolution.ts,CommandTable.ts,Direction"]
---

# Q: Revision 2: which node owns go <shortcut> resolution and how to bind shortcuts to canonical Directions without a second direction list?

## Answer

resolveGameCommand() now uses DIRECTION_BY_TOKEN derived from CommandTable.DIRECTIONS, mapping both names and shortcuts to canonical Direction values; removed DIRECTION_NAMES and isDirection().

## Outcome

- Signal: useful

## Source Nodes

- resolveGameCommand(),directionCommand(),DIRECTION_BY_TOKEN,DIRECTIONS,commandResolution.ts,CommandTable.ts,Direction