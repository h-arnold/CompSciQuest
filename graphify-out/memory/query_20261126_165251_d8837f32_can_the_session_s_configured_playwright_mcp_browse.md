---
type: "query"
date: "2026-11-26T16:52:51.545587+00:00"
question: "Can the session's configured Playwright MCP browser tools be used for browser exploration in this subagent?"
contributor: "graphify"
outcome: "corrected"
source_nodes: ["playwright-mcp,Chromium,browser_snapshot,browser_take_screenshot"]
---

# Q: Can the session's configured Playwright MCP browser tools be used for browser exploration in this subagent?

## Answer

Dead end: the shared playwright-mcp server launches Chrome from /opt/google/chrome/chrome, which is absent in the container. Correction: launch a private playwright-mcp with --no-sandbox --headless --executable-path pointing at the installed Chromium binary and drive it over stdio JSON-RPC; this gave working browser_snapshot, browser_type, browser_click, browser_evaluate and browser_take_screenshot.

## Outcome

- Signal: corrected

## Source Nodes

- playwright-mcp,Chromium,browser_snapshot,browser_take_screenshot