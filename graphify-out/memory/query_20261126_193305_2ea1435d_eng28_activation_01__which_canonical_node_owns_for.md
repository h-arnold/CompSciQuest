---
type: "query"
date: "2026-11-26T19:33:05.802347+00:00"
question: "ENG28-ACTIVATION-01: which canonical node owns formatEvent transcript rendering for puzzle-activated, and is render-time suppression the only compliant change?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["formatEvent()", "GameEvent", "OutputLog", "ScorePanel", "EffectApplier"]
---

# Q: ENG28-ACTIVATION-01: which canonical node owns formatEvent transcript rendering for puzzle-activated, and is render-time suppression the only compliant change?

## Answer

formatEvent() (src/ui/formatEvent.ts L11, degree 14) is the sole transcript formatter; GameWindow.ts L219 calls it and appends via OutputLog. The puzzle-activated arm now returns [] with no other arm changed. No duplicate owner, no bypass, no new cross-layer edge or hub. Note: inherited test tests/turn/engine-issue-22-success-ids.test.ts L215-221 still asserts the old notice and now fails; it needs a test-owner update.

## Outcome

- Signal: useful

## Source Nodes

- formatEvent()
- GameEvent
- OutputLog
- ScorePanel
- EffectApplier