---
type: "query"
date: "2026-11-27T08:56:34.499281+00:00"
question: "Which canonical nodes supply the approved title copy, help aliases and gate fallback that the four stale e2e assertions must re-anchor?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["DEFAULT_TITLE_COPY", "TitleScreen", "COMMAND_TABLE", "helpText()", "createRuleEngine()", "w7-opening-walkthrough.spec.ts", "w7-scoped-boundary.spec.ts"]
---

# Q: Which canonical nodes supply the approved title copy, help aliases and gate fallback that the four stale e2e assertions must re-anchor?

## Answer

TitleScreen/DEFAULT_TITLE_COPY at src/ui/TitleScreen.ts:L11 and L18 supply the approved objective and controls; COMMAND_TABLE at src/core/commands/CommandTable.ts:L17 and helpText() at L92 supply 'put <item> <target>  (place)' and 'talk-to <npc>  (talk, talk to)'; createRuleEngine() at src/core/rules/RuleEngine.ts:L20/L48-50 supplies 'That way is closed for now.'. The four stale assertions were re-anchored to these exact strings.

## Outcome

- Signal: useful

## Source Nodes

- DEFAULT_TITLE_COPY
- TitleScreen
- COMMAND_TABLE
- helpText()
- createRuleEngine()
- w7-opening-walkthrough.spec.ts
- w7-scoped-boundary.spec.ts