---
type: "query"
date: "2026-11-26T20:26:20.189326+00:00"
question: "ENG16-SAVECONFIRM-01: which canonical node owns the Save/Download confirmation path and should GameWindow.makeActions() route through it?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Game,.makeActions(),SaveActions,SaveControls,.submit(),metaActionOf(),metaMessage"]
---

# Q: ENG16-SAVECONFIRM-01: which canonical node owns the Save/Download confirmation path and should GameWindow.makeActions() route through it?

## Answer

Game.submit (src/application/Game.ts L46) is the sole facade hub: submit -> metaActionOf (L150) -> performMeta -> saveGame/downloadGame + metaMessage (L378) which publishes a message event on the injected EventBus. GameWindow.makeActions (src/ui/GameWindow.ts L129) previously bypassed it via Game.save()/Game.download() at L136/L142; changed both to game.submit('save'|'download') following the existing load action at L139. Do not render the returned batch — the bus subscription does that. All 6 targeted and 543 full-suite tests pass; no new imports, hubs or cross-layer edges.

## Outcome

- Signal: useful

## Source Nodes

- Game,.makeActions(),SaveActions,SaveControls,.submit(),metaActionOf(),metaMessage