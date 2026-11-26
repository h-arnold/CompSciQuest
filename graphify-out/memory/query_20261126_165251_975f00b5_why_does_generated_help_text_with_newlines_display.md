---
type: "query"
date: "2026-11-26T16:52:51.694115+00:00"
question: "Why does generated help text with newlines display as one dense paragraph in the transcript?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["appendLine(),.append(),OutputLog,src_ui_style"]
---

# Q: Why does generated help text with newlines display as one dense paragraph in the transcript?

## Answer

appendLine() assigns the whole string via textContent to a plain div; .output-log has white-space: normal and no pre-wrap, so CSS collapses the newlines. Source: src/ui/appendLine.ts:3-6 and src/ui/style.css:70-77. Aesthetic finding for code-lead, not fixed by browser-tester.

## Outcome

- Signal: useful

## Source Nodes

- appendLine(),.append(),OutputLog,src_ui_style