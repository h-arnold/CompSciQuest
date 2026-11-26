---
type: "query"
date: "2026-11-26T17:46:09.604538+00:00"
question: "Why did the first focused e2e run see a moved-from debug line when browser exploration did not?"
contributor: "graphify"
outcome: "corrected"
source_nodes: ["playwright.config.ts"]
---

# Q: Why did the first focused e2e run see a moved-from debug line when browser exploration did not?

## Answer

Corrected: Playwright reused a stale Vite server on port 5173 belonging to /home/developer/CompSciQuest, not this worktree. The authoritative server is on 5213. Freeing 5173 let Playwright start a fresh server from this worktree and all assertions passed unchanged.

## Outcome

- Signal: corrected

## Source Nodes

- playwright.config.ts