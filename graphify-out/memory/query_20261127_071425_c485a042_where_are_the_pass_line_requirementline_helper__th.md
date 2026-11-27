---
type: "query"
date: "2026-11-27T07:14:25.078674+00:00"
question: "Where are the pass-line requirementLine helper, the unused QUARANTINE_DOWNLOAD_NAME export, the restart fresh-start writes, and the quiz view fields defined for ENG30 re-anchoring and fresh-start QA?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["requirementLine()", "QUARANTINE_DOWNLOAD_NAME", "DOWNLOAD_NAME", "helpers.ts", "engine-issue-30-passmark.spec.ts", ".restart()", "QuizView", "QuizPanel"]
---

# Q: Where are the pass-line requirementLine helper, the unused QUARANTINE_DOWNLOAD_NAME export, the restart fresh-start writes, and the quiz view fields defined for ENG30 re-anchoring and fresh-start QA?

## Answer

requirementLine() is at e2e/engine-issue-30-passmark.spec.ts L44; QUARANTINE_DOWNLOAD_NAME is an orphan at e2e/helpers.ts L228 beside DOWNLOAD_NAME at L225; .restart() is at src/ui/SaveControls.ts L9; QuizView at src/application/GameViewData.ts L27; QuizPanel at src/ui/QuizPanel.ts L6.

## Outcome

- Signal: useful

## Source Nodes

- requirementLine()
- QUARANTINE_DOWNLOAD_NAME
- DOWNLOAD_NAME
- helpers.ts
- engine-issue-30-passmark.spec.ts
- .restart()
- QuizView
- QuizPanel