---
type: "query"
date: "2026-11-26T16:36:42.278188+00:00"
question: "Bypass check: does any source outside ScorePanel reimplement the per-area Score / Rooms visited sidebar lines?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["ScorePanel", "renderArea()", "appendLine()", "ScoreTracker"]
---

# Q: Bypass check: does any source outside ScorePanel reimplement the per-area Score / Rooms visited sidebar lines?

## Answer

No. The only source hits for the literals Score: and Rooms visited: are src/ui/ScorePanel.ts lines 17, 20 and 40. ScoreTracker owns calculation, not rendering; no duplicate canonical node exists.

## Outcome

- Signal: useful

## Source Nodes

- ScorePanel
- renderArea()
- appendLine()
- ScoreTracker