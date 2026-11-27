---
type: "query"
date: "2026-11-26T20:40:31.454869+00:00"
question: "How should browser-tester run e2e on a different port without touching playwright.config.ts for engine-issue-16?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["playwright.config.ts", "helpers.ts", "engine-issue-11.spec.ts", "engine-issue-25.spec.ts"]
---

# Q: How should browser-tester run e2e on a different port without touching playwright.config.ts for engine-issue-16?

## Answer

Use a gitignored scratchpad config (testDir '../../../../e2e', baseURL http://localhost:5216/CompSciQuest/, webServer reuseExistingServer) and set CSQ_E2E_URL for specs with env overrides. engine-issue-11 and engine-25 hardcode test.use({baseURL}) on 5211/5225, so they still fail under another port; this is environmental, not a regression.

## Outcome

- Signal: useful

## Source Nodes

- playwright.config.ts
- helpers.ts
- engine-issue-11.spec.ts
- engine-issue-25.spec.ts