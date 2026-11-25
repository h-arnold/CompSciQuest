---
type: "query"
date: "2026-11-25T07:13:29.219257+00:00"
question: "Revision 1: which canonical nodes own façade Command resolution for put noun in target, and the already-open door/container precondition message?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["resolveGameCommand()", "parseRaw()", "openOrClose()", "putHandler()", "NameResolver", "Canonical Command union", "Game façade", "Turn pipeline (buffered events)"]
---

# Q: Revision 1: which canonical nodes own façade Command resolution for put noun in target, and the already-open door/container precondition message?

## Answer

Façade resolution is owned by resolveGameCommand() at src/application/Game.ts:L210, fed by parseRaw() at src/core/commands/Parser.ts:L55 and createNameResolver() at src/core/commands/NameResolver.ts:L20. The distinct put Command is canonical in Canonical Command union (application-and-ui.md §5). Door/container preconditions are owned by openOrClose() at src/core/commands/verbs/index.ts:L58 (with flagPrefix() at L28 and isUnlocked() at L38); putHandler() at L100 is the transfer path. The already-open case must emit a friendly in-voice message and leave state unchanged (application-and-ui.md §5.1, §12). Strengthened tests fail for exactly these two seams; all other 32 tests pass.

## Outcome

- Signal: useful

## Source Nodes

- resolveGameCommand()
- parseRaw()
- openOrClose()
- putHandler()
- NameResolver
- Canonical Command union
- Game façade
- Turn pipeline (buffered events)