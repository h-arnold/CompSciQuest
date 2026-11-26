---
type: "query"
date: "2026-11-26T16:21:24.356064+00:00"
question: "Can the Playwright MCP browser tools be called directly from a browser-tester subagent session?"
contributor: "graphify"
outcome: "corrected"
correction: "Used a scratchpad JSON-RPC client to invoke the real MCP tools instead of assuming direct availability."
source_nodes: ["playwright", "TitleScreen"]
---

# Q: Can the Playwright MCP browser tools be called directly from a browser-tester subagent session?

## Answer

No direct browser_* tools were exposed in this session; the configured playwright-mcp stdio server was driven over JSON-RPC from a scratchpad client with PLAYWRIGHT_MCP_BROWSER=chromium.

## Outcome

- Signal: corrected
- Correction: Used a scratchpad JSON-RPC client to invoke the real MCP tools instead of assuming direct availability.

## Source Nodes

- playwright
- TitleScreen