---
type: "query"
date: "2026-11-25T10:48:54.269761+00:00"
question: "Where are the named Playwright boot tests and GameWindow echo path?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["title-and-session.spec.ts,save-import.spec.ts,meta-and-endstates.spec.ts,.handleCommand(),appendLine()"]
---

# Q: Where are the named Playwright boot tests and GameWindow echo path?

## Answer

e2e/title-and-session.spec.ts, e2e/save-import.spec.ts and e2e/meta-and-endstates.spec.ts hold the E2E-BOOT tests; GameWindow.handleCommand() echoes at src/ui/GameWindow.ts:L181/L184

## Outcome

- Signal: useful

## Source Nodes

- title-and-session.spec.ts,save-import.spec.ts,meta-and-endstates.spec.ts,.handleCommand(),appendLine()