---
type: "query"
date: "2026-11-25T10:24:42.732160+00:00"
question: "Where is Vitest test collection configured and how do I exclude e2e specs?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["vite.config.ts,scripts,test,test:e2e,vitest,exclude,playwright.config.ts"]
---

# Q: Where is Vitest test collection configured and how do I exclude e2e specs?

## Answer

vite.config.ts (L1) is the sole Vite/Vitest config node (community package.json); package.json scripts test=L18, test:e2e=L20, vitest@^5.1.1=L37; playwright.config.ts=L1 owns e2e. No separate vitest.config file exists.

## Outcome

- Signal: useful

## Source Nodes

- vite.config.ts,scripts,test,test:e2e,vitest,exclude,playwright.config.ts