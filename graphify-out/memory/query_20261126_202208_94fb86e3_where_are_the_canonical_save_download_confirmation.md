---
type: "query"
date: "2026-11-26T20:22:08.291522+00:00"
question: "Where are the canonical Save/Download confirmation routing nodes and the bus-publish seam for engine-issue-16?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Game", "SaveControls", "GameWindow", "EventBus", "SaveManager", "RecordingGame"]
---

# Q: Where are the canonical Save/Download confirmation routing nodes and the bus-publish seam for engine-issue-16?

## Answer

Canonical owner for the confirmation lines is Game.performMeta() in src/application/Game.ts (confirmation strings at L401 and L408), reached from GameWindow.makeActions() in src/ui/GameWindow.ts L129 and SaveControls in src/ui/SaveControls.ts L14. Game.submit is at src/application/Game.ts L46, EventBus is canonical at src/core/events/EventBus.ts L4 and SaveManager at src/application/SaveManager.ts L33; FakeBus, FakeSaveManager and RecordingGame under tests/fixtures are test doubles, not competing owners.

## Outcome

- Signal: useful

## Source Nodes

- Game
- SaveControls
- GameWindow
- EventBus
- SaveManager
- RecordingGame