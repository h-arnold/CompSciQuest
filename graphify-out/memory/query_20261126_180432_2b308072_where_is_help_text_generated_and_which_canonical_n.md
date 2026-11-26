---
type: "query"
date: "2026-11-26T18:04:32.204087+00:00"
question: "Where is help text generated and which canonical node owns COMMAND_TABLE / helpText() for the ask and answer syntax?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["helpText()", "COMMAND_TABLE", "CommandSpec", "aliasSuffix()", "HelpOutput.test.ts", "CommandTable.test.ts", "bareAnswerCommand()", "inferAskActor()"]
---

# Q: Where is help text generated and which canonical node owns COMMAND_TABLE / helpText() for the ask and answer syntax?

## Answer

Canonical help generation is src/core/commands/CommandTable.ts: COMMAND_TABLE (L16), helpText() (L74) and aliasSuffix() (L70) — the single source for player-facing syntax. CommandSpec has a second occurrence at tests/fixtures/commandTable.ts:10 but that is a typed test-fixture mirror, not a competing owner. The new issue 9 forms are resolved in src/application/commandResolution.ts (bareAnswerCommand():299, inferAskActor():149, resolveGameCommand():340); help copy must still be added to the canonical table so helpText() and the help handler both list ask about <topic>, '1, 2, …', and retain ask <npc> about <topic> and answer N.

## Outcome

- Signal: useful

## Source Nodes

- helpText()
- COMMAND_TABLE
- CommandSpec
- aliasSuffix()
- HelpOutput.test.ts
- CommandTable.test.ts
- bareAnswerCommand()
- inferAskActor()