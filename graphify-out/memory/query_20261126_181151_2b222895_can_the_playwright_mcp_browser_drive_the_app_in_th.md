---
type: "query"
date: "2026-11-26T18:11:51.251902+00:00"
question: "Can the Playwright MCP browser drive the app in this session?"
contributor: "graphify"
outcome: "dead_end"
source_nodes: ["playwright.config.ts", "helpers.ts"]
---

# Q: Can the Playwright MCP browser drive the app in this session?

## Answer

No. tools.playwright.browser_snapshot and browser_tabs both fail with: async initializeServer: Chromium distribution 'chrome' is not found at /opt/google/chrome/chrome. Used local Playwright CLI with bundled Chromium instead, with real screenshots; disclosed in the QA report.

## Outcome

- Signal: dead_end

## Source Nodes

- playwright.config.ts
- helpers.ts