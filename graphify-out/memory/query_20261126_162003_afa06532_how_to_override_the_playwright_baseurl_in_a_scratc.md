---
type: "query"
date: "2026-11-26T16:20:03.067062+00:00"
question: "How to override the Playwright baseURL in a scratchpad config?"
contributor: "graphify"
outcome: "dead_end"
source_nodes: ["playwright.config.ts", "baseURL"]
---

# Q: How to override the Playwright baseURL in a scratchpad config?

## Answer

Spread the root config and override use.baseURL, not top-level baseURL: the root config nests baseURL inside use, so a top-level override silently keeps port 5173.

## Outcome

- Signal: dead_end

## Source Nodes

- playwright.config.ts
- baseURL