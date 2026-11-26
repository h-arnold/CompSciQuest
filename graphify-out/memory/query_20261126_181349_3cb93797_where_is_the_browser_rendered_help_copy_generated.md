---
type: "query"
date: "2026-11-26T18:13:49.822885+00:00"
question: "Where is the browser-rendered help copy generated and which nodes own the issue-9 ask/bare-answer forms?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["helpText()", "COMMAND_TABLE", "engine-issue-2-help.spec.ts", "HelpOutput.test.ts"]
---

# Q: Where is the browser-rendered help copy generated and which nodes own the issue-9 ask/bare-answer forms?

## Answer

helpText() in src/core/commands/CommandTable.ts derives lines from COMMAND_TABLE detail fields; e2e/engine-issue-2-help.spec.ts asserts rendered transcript via helpEntry(); HelpOutput.test.ts covers unit level.

## Outcome

- Signal: useful

## Source Nodes

- helpText()
- COMMAND_TABLE
- engine-issue-2-help.spec.ts
- HelpOutput.test.ts