---
type: "query"
date: "2026-11-26T16:08:25.280712+00:00"
question: "Where is the area-entry life reset implemented and which node owns the issue 15 quiz and puzzle gate?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["EffectApplier", "areaChangeEvents()", "applyEntityEffect()", "applyStateEffect()", "ContentBundle", "areaPairForRoom()", "areQuizzesPassed()", "puzzleSolved()"]
---

# Q: Where is the area-entry life reset implemented and which node owns the issue 15 quiz and puzzle gate?

## Answer

Canonical owner is EffectApplier.ts areaChangeEvents() (L154), called by applyEntityEffect() (L193) on move-player; applyStateEffect() (L94) emits lives-changed. Area mapping uses ContentBundle specTopics.getByAreaId and areaPairForRoom(). Session.areQuizzesPassed() and ScoreTracker.puzzleSolved() are separate scoring/session owners, not the gate.

## Outcome

- Signal: useful

## Source Nodes

- EffectApplier
- areaChangeEvents()
- applyEntityEffect()
- applyStateEffect()
- ContentBundle
- areaPairForRoom()
- areQuizzesPassed()
- puzzleSolved()