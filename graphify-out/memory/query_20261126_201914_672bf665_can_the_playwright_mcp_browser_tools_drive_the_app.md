---
type: "query"
date: "2026-11-26T20:19:14.069397+00:00"
question: "Can the Playwright MCP browser tools drive the app in this browser-tester session?"
contributor: "graphify"
outcome: "dead_end"
source_nodes: ["playwright.config.ts,helpers.ts"]
---

# Q: Can the Playwright MCP browser tools drive the app in this browser-tester session?

## Answer

No: browser_navigate failed with async initializeServer: Chromium distribution 'chrome' is not found at /opt/google/chrome/chrome. Used the disclosed local Playwright CLI (node_modules/.bin/playwright 1.65.1) in bundled real Chromium instead; it ran all five specs and captured screenshots.

## Outcome

- Signal: dead_end

## Source Nodes

- playwright.config.ts,helpers.ts