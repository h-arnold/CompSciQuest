---
type: "query"
date: "2026-11-26T18:08:36.388752+00:00"
question: "Where is the canonical help copy generated and which node owns COMMAND_TABLE / helpText() for ask and answer syntax?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["helpText() COMMAND_TABLE CommandSpec aliasSuffix() detailSuffix() HelpOutput.test.ts CommandTable.test.ts"]
---

# Q: Where is the canonical help copy generated and which node owns COMMAND_TABLE / helpText() for ask and answer syntax?

## Answer

helpText() in src/core/commands/CommandTable.ts (L90 after change; L74 before) is the sole renderer. Its COMMAND_TABLE entries now carry optional detail copy for ask (NPC inferred when exactly one is present) and answer (bare 1, 2, …), rendered via detailSuffix(); verbs/index.ts imports helpText() so the help handler emits the same list.

## Outcome

- Signal: useful

## Source Nodes

- helpText() COMMAND_TABLE CommandSpec aliasSuffix() detailSuffix() HelpOutput.test.ts CommandTable.test.ts