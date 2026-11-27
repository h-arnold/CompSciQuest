---
type: "query"
date: "2026-11-26T21:58:52.217049+00:00"
question: "ENG24 autosave: why does the post-observer trace assertion fail even though the saved DTO has final state?"
contributor: "graphify"
outcome: "corrected"
source_nodes: ["Game submit() saveGame SaveManager RecordingSaveManager makeSetup()"]
---

# Q: ENG24 autosave: why does the post-observer trace assertion fail even though the saved DTO has final state?

## Answer

The recorder's trace array is created inside makeSetup (tests/persistence/engine-issue-24-autosave.test.ts L126) while the custom score/session observers push to a separate array declared in the test at L183. No production change can place observer markers in the recorder's trace. The DTO assertions (L216-217, L222-223) pass with the save placed after score.observe/session.observe in Game.submit; the trace assertion needs a test-fixture fix owned by test-writer/code-lead.

## Outcome

- Signal: corrected

## Source Nodes

- Game submit() saveGame SaveManager RecordingSaveManager makeSetup()