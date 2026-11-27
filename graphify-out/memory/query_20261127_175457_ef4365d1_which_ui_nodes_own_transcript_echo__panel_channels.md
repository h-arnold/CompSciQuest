---
type: "query"
date: "2026-11-27T17:54:57.849821+00:00"
question: "Which UI nodes own transcript echo, panel channels and the fake DOM for MD-UI-01 to MD-UI-10?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["GameWindow .renderBatch() OutputLog appendLine() QuizPanel ConversationPanel HintPanel ScorePanel formatEvent() renderBlock() renderInline() FakeDocument FakeElement"]
---

# Q: Which UI nodes own transcript echo, panel channels and the fake DOM for MD-UI-01 to MD-UI-10?

## Answer

Canonical owners: GameWindow (.handleCommand L157, .renderBatch L193) for the echo and batch route; OutputLog (.append L18) for transcript entries; QuizPanel, ConversationPanel, HintPanel and ScorePanel (.refresh) for panels; formatEvent() L11 for event-to-line mapping; renderBlock()/renderInline() in src/ui/markdown/renderMarkdown.ts L277/L281 for Markdown nodes; FakeDocument/FakeElement in tests/fixtures/ui.ts L206/L30 for the harness. appendLine() at src/ui/appendLine.ts L3 is the only current plain-line writer; the named appendPlain seam is a duplication lead, not a second owner.

## Outcome

- Signal: useful

## Source Nodes

- GameWindow .renderBatch() OutputLog appendLine() QuizPanel ConversationPanel HintPanel ScorePanel formatEvent() renderBlock() renderInline() FakeDocument FakeElement