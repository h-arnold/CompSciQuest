---
type: "query"
date: "2026-11-27T08:43:42.233135+00:00"
question: "Which seams own load confirmation, transient hint clearing on quiz retry, and the quiz requirement aria-live region?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Game,GameWindow,SaveActions,OutputLog,LoadResult,QuizPanel,HintPanel,GameViewData,GameEvent,LoadResult,QuizView"]
---

# Q: Which seams own load confirmation, transient hint clearing on quiz retry, and the quiz requirement aria-live region?

## Answer

Game.loadMeta appends one Game loaded. message to the restore batch; Game.observeViewEvent sets isHintViewSuppressed on quiz-started and clears on hint-shown, so getViewData().hints is empty until a fresh hint; QuizPanel.refresh sets aria-live=polite on the requirement <p>. All three verified in MCP and by focused e2e.

## Outcome

- Signal: useful

## Source Nodes

- Game,GameWindow,SaveActions,OutputLog,LoadResult,QuizPanel,HintPanel,GameViewData,GameEvent,LoadResult,QuizView