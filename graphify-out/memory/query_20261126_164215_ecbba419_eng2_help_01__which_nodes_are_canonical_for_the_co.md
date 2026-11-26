---
type: "query"
date: "2026-11-26T16:42:15.398190+00:00"
question: "ENG2-HELP-01: which nodes are canonical for the command table, parser aliases and help reply?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["CommandTable.ts,helpText(),COMMAND_TABLE,DIRECTIONS,Parser.ts,commandResolution.ts,verbs/index.ts,HANDLERS"]
---

# Q: ENG2-HELP-01: which nodes are canonical for the command table, parser aliases and help reply?

## Answer

Created src/core/commands/CommandTable.ts as the single canonical table; Parser.ts, commandResolution.ts and verbs/index.ts now derive from it. Two consumers plus one generated help reply.

## Outcome

- Signal: useful

## Source Nodes

- CommandTable.ts,helpText(),COMMAND_TABLE,DIRECTIONS,Parser.ts,commandResolution.ts,verbs/index.ts,HANDLERS