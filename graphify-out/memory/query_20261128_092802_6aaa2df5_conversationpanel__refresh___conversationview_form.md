---
type: "query"
date: "2026-11-28T09:28:02.815567+00:00"
question: "ConversationPanel .refresh() ConversationView formatEvent() OutputLog appendMarkdownBlock() GameViewData GameEvent — which canonical node owns the suggested prompt after the duplicate panel render was removed?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["ConversationPanel", "ConversationView", "formatEvent()", "appendMarkdownBlock()", "OutputLog", "GameEvent", "GameViewData"]
---

# Q: ConversationPanel .refresh() ConversationView formatEvent() OutputLog appendMarkdownBlock() GameViewData GameEvent — which canonical node owns the suggested prompt after the duplicate panel render was removed?

## Answer

Canonical owner is formatEvent() topic-suggested -> [event.text] in src/ui/formatEvent.ts; appendMarkdownBlock() writes the transcript block via OutputLog. ConversationPanel.refresh() in src/ui/ConversationPanel.ts renders only Talking with X. and must not render conversation.prompt. ConversationView.prompt stays in GameViewData as metadata. Tests re-anchored: NPC-INTEG-03 and MD-UI-08 (moved to tests/ui/markdownConversationPanel.test.ts for the 600-line cap). No duplicate owner found.

## Outcome

- Signal: useful

## Source Nodes

- ConversationPanel
- ConversationView
- formatEvent()
- appendMarkdownBlock()
- OutputLog
- GameEvent
- GameViewData