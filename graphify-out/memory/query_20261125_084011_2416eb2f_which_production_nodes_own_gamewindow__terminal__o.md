---
type: "query"
date: "2026-11-25T08:40:11.388239+00:00"
question: "Which production nodes own GameWindow, Terminal, OutputLog, ScorePanel, SaveControls and TitleScreen responsibilities?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Title screen overlay,Game façade,GameViewData,formatEvent(),SaveControls.test.ts"]
---

# Q: Which production nodes own GameWindow, Terminal, OutputLog, ScorePanel, SaveControls and TitleScreen responsibilities?

## Answer

None: graphify query found only documentation concepts (Title screen overlay, Game façade, GameViewData) and test fixtures; the sole production UI node is formatEvent() at src/ui/formatEvent.ts. New UI classes may be added in src/ui/ with formatEvent reused as the event formatter.

## Outcome

- Signal: useful

## Source Nodes

- Title screen overlay,Game façade,GameViewData,formatEvent(),SaveControls.test.ts