---
type: "query"
date: "2026-11-27T09:08:13.164204+00:00"
question: "Which canonical nodes own browser save seeding and continuation for gated later-area e2e traces?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["seedStorage()", "startNewGame()", "makeState()", "SAVE_KEY", "SaveManager", "GATE_FLAGS", "w7-opening-walkthrough.spec.ts"]
---

# Q: Which canonical nodes own browser save seeding and continuation for gated later-area e2e traces?

## Answer

seedStorage() at e2e/helpers.ts:L145 installs one-shot localStorage seeds; startNewGame() at L192 and makeState() at L80 build complete/minimal valid states; SAVE_KEY at L10; SaveManager at src/application/SaveManager.ts:L33 restores DTO. Used a real New Game save plus tutorial-complete and quiz-passed:quiz-switchyard flags for the three later-area walkthrough tests and an explicit flag argument in saveAt() for the scoped lives-reset test.

## Outcome

- Signal: useful

## Source Nodes

- seedStorage()
- startNewGame()
- makeState()
- SAVE_KEY
- SaveManager
- GATE_FLAGS
- w7-opening-walkthrough.spec.ts