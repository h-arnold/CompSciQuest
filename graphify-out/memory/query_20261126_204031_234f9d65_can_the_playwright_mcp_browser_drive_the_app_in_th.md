---
type: "query"
date: "2026-11-26T20:40:31.146676+00:00"
question: "Can the Playwright MCP browser drive the app in this engine-issue-16 session?"
contributor: "graphify"
outcome: "dead_end"
source_nodes: ["playwright.config.ts", "SaveControls", "OutputLog"]
---

# Q: Can the Playwright MCP browser drive the app in this engine-issue-16 session?

## Answer

No: the MCP Playwright server fails at initializeServer with Chromium distribution 'chrome' missing at /opt/google/chrome/chrome; /opt/google is not writable. Used the local Playwright CLI in real Chromium from node_modules/playwright instead, with screenshots.

## Outcome

- Signal: dead_end

## Source Nodes

- playwright.config.ts
- SaveControls
- OutputLog