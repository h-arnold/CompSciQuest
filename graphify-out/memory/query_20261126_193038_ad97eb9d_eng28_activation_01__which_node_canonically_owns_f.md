---
type: "query"
date: "2026-11-26T19:30:38.693493+00:00"
question: "ENG28-ACTIVATION-01: which node canonically owns formatEvent transcript rendering and suppression of puzzle-activated, and is the effect/event pipeline unchanged?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["formatEvent()", "GameEvent", "OutputLog", "createEffectApplier()", "ScorePanel", "PuzzleSystem"]
---

# Q: ENG28-ACTIVATION-01: which node canonically owns formatEvent transcript rendering and suppression of puzzle-activated, and is the effect/event pipeline unchanged?

## Answer

Canonical renderer is formatEvent() at src/ui/formatEvent.ts L11 (sole transcript formatter, no duplicate owner). GameEvent union at src/core/events/GameEvent.ts L11 carries puzzle-activated. OutputLog at src/ui/OutputLog.ts L5 is the transcript sink. createEffectApplier() at src/core/effects/EffectApplier.ts L489 still maps set-puzzle-active to exactly one puzzle-activated event and marks the puzzle active; application-and-ui.md section 9 mapping is unchanged. ScorePanel at src/ui/ScorePanel.ts L30 remains panel-only via view data. Tests added in tests/turn/engine-issue-28-activation.test.ts fail at HEAD only on the activation line.

## Outcome

- Signal: useful

## Source Nodes

- formatEvent()
- GameEvent
- OutputLog
- createEffectApplier()
- ScorePanel
- PuzzleSystem