---
type: "query"
date: "2026-11-26T16:52:51.413891+00:00"
question: "ENG2-HELP-01 — which nodes are canonical for the command table, help text, parser aliases and transcript log?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["CommandTable.ts,helpText(),Parser.ts,HANDLERS,OutputLog,.append(),transcript(),GameWindow,.handleCommand(),formatEvent()"]
---

# Q: ENG2-HELP-01 — which nodes are canonical for the command table, help text, parser aliases and transcript log?

## Answer

CommandTable.ts owns COMMAND_TABLE and helpText(); Parser.ts owns aliases; HANDLERS owns verbs; OutputLog.append() writes transcript lines; e2e/helpers.ts exposes transcript(). These locations were used for the e2e assertions.

## Outcome

- Signal: useful

## Source Nodes

- CommandTable.ts,helpText(),Parser.ts,HANDLERS,OutputLog,.append(),transcript(),GameWindow,.handleCommand(),formatEvent()