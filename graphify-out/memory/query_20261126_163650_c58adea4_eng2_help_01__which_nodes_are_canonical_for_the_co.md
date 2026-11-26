---
type: "query"
date: "2026-11-26T16:36:50.643625+00:00"
question: "ENG2-HELP-01: which nodes are canonical for the command table, help output and parser alias resolution?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["parseRaw()", "DIRECTION_SHORTCUTS", "MULTIWORD_ALIASES", "SINGLE_ALIASES", "HANDLERS", "fixedMessage()", "Parser.ts", "commandResolution.ts"]
---

# Q: ENG2-HELP-01: which nodes are canonical for the command table, help output and parser alias resolution?

## Answer

Canonical owners: HANDLERS (src/core/commands/verbs/index.ts L271) and fixedMessage() (L238) own the help reply; parseRaw() (src/core/commands/Parser.ts L55) with DIRECTION_SHORTCUTS, MULTIWORD_ALIASES and SINGLE_ALIASES owns alias resolution. DIRECTION_NAMES is duplicated in Parser.ts L8 and commandResolution.ts L11; it must be derived from the new canonical CommandTable.ts rather than blessed twice. DIRECTIONS in validateContent.ts L14 is a coverage-validation list, not the command-direction owner. Red tests are in tests/parser/CommandTable.test.ts and tests/parser/HelpOutput.test.ts.

## Outcome

- Signal: useful

## Source Nodes

- parseRaw()
- DIRECTION_SHORTCUTS
- MULTIWORD_ALIASES
- SINGLE_ALIASES
- HANDLERS
- fixedMessage()
- Parser.ts
- commandResolution.ts