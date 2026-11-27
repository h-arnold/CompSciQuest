---
type: "query"
date: "2026-11-27T08:44:06.086134+00:00"
question: "Why does typing hint after a switchyard quiz retry say there is nothing more to suggest, and how should the browser e2e reach a fresh hint?"
contributor: "graphify"
outcome: "corrected"
source_nodes: ["HintSystem,explicitHint,nextLevel,autoCandidates,hints,quizzes,HintPanel,Game"]
---

# Q: Why does typing hint after a switchyard quiz retry say there is nothing more to suggest, and how should the browser e2e reach a fresh hint?

## Answer

The switchyard quiz has three questions and autoOfferAfter 1, so the three wrong answers that fail it auto-offer all three authored hint-switchyard levels; nextLevel then finds no unshown level. A fresh hint must come from a different authored sequence (hint-data-types), reached in e2e with a crafted valid v1 save that sets quiz-passed:quiz-switchyard, switches-set and turns-since:puzzle-sort-the-data-types=3, then ordinary commands ask foreman about data types and hint. Verified in MCP and by focused e2e.

## Outcome

- Signal: corrected

## Source Nodes

- HintSystem,explicitHint,nextLevel,autoCandidates,hints,quizzes,HintPanel,Game