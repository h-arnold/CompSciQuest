---
type: "query"
date: "2026-11-26T17:49:34.334724+00:00"
question: "Can the session's configured Playwright MCP browser tools be used for browser exploration in this subagent when Chrome channel is missing?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["browser_navigate", "browser_take_screenshot", "browser_snapshot"]
---

# Q: Can the session's configured Playwright MCP browser tools be used for browser exploration in this subagent when Chrome channel is missing?

## Answer

The tools are callable but the configured playwright-mcp server fails with missing Chrome at /opt/google/chrome/chrome. A scratchpad JSON-RPC client launched playwright-mcp with --browser chromium --executable-path <installed chromium> and drove the same MCP tools against the app on port 5209.

## Outcome

- Signal: useful

## Source Nodes

- browser_navigate
- browser_take_screenshot
- browser_snapshot