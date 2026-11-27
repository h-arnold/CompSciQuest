---
type: "query"
date: "2026-11-27T17:30:20.713696+00:00"
question: "Which canonical UI node owns the Markdown-to-DOM renderer boundary and is there an existing owner to reuse?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["GameWindow,OutputLog,appendLine(),formatEvent(),QuizPanel,HintPanel,renderBlock(),renderInline(),isAllowedLink()"]
---

# Q: Which canonical UI node owns the Markdown-to-DOM renderer boundary and is there an existing owner to reuse?

## Answer

No existing renderer node: GameWindow, OutputLog, appendLine(), formatEvent(), QuizPanel and HintPanel are consumers. New renderBlock()/renderInline() nodes added under src/ui/markdown; no duplicate canonical label found.

## Outcome

- Signal: useful

## Source Nodes

- GameWindow,OutputLog,appendLine(),formatEvent(),QuizPanel,HintPanel,renderBlock(),renderInline(),isAllowedLink()