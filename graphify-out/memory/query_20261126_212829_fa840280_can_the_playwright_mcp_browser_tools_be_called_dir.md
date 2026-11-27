---
type: "query"
date: "2026-11-26T21:28:29.408935+00:00"
question: "Can the Playwright MCP browser tools be called directly from a browser-tester subagent session?"
contributor: "graphify"
outcome: "corrected"
correction: "Discover the tool surface with search() inside execute, then call tools.playwright.browser_* directly; keep one MCP call per execute if a combined call is declined."
source_nodes: ["playwright.config.ts", "helpers.ts"]
---

# Q: Can the Playwright MCP browser tools be called directly from a browser-tester subagent session?

## Answer

Yes in this session: the tools are exposed in the code-mode catalog and callable as tools.playwright.* inside execute; no scratchpad JSON-RPC client was needed.

## Outcome

- Signal: corrected
- Correction: Discover the tool surface with search() inside execute, then call tools.playwright.browser_* directly; keep one MCP call per execute if a combined call is declined.

## Source Nodes

- playwright.config.ts
- helpers.ts