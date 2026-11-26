---
type: "query"
date: "2026-11-26T17:46:09.482985+00:00"
question: "Can the Playwright MCP browser drive the app in this session?"
contributor: "graphify"
outcome: "dead_end"
source_nodes: ["playwright.config.ts", "helpers.ts"]
---

# Q: Can the Playwright MCP browser drive the app in this session?

## Answer

No. playwright-mcp is configured with the chrome channel and /opt/google/chrome/chrome is absent; the developer account cannot create it and has no sudo. Fell back to the Playwright CLI in bundled Chromium, which successfully exercised the app.

## Outcome

- Signal: dead_end

## Source Nodes

- playwright.config.ts
- helpers.ts