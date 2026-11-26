---
type: "query"
date: "2026-11-26T19:46:48.995850+00:00"
question: "Can the Playwright MCP browser tools drive the app in this engine-issue-28 session?"
contributor: "graphify"
outcome: "dead_end"
source_nodes: ["playwright.config.ts", "helpers.ts"]
---

# Q: Can the Playwright MCP browser tools drive the app in this engine-issue-28 session?

## Answer

No: both browser_navigate and browser_tabs failed during initializeServer because the configured channel chrome is absent at /opt/google/chrome/chrome; local Playwright CLI with bundled Chromium was used and disclosed.

## Outcome

- Signal: dead_end

## Source Nodes

- playwright.config.ts
- helpers.ts