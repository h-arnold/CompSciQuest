---
type: "query"
date: "2026-11-27T14:01:05.498283+00:00"
question: "After the SaveManager fix, does a save written with the practice block placed in the fixture cabinet reload with Continue enabled, and is the invalid-json quarantine path still intact?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["hasValidPositionReferences()", "SaveManager", "transferItem()", "ward-round4-fixes.spec.ts"]
---

# Q: After the SaveManager fix, does a save written with the practice block placed in the fixture cabinet reload with Continue enabled, and is the invalid-json quarantine path still intact?

## Answer

Yes. hasValidPositionReferences() at src/application/SaveManager.ts:L237 now resolves state.rooms keys via bundle.rooms.getById(id) ?? bundle.items.getById(id) while position.roomId still requires a real room. MCP verification in a fresh isolated context: New Game, full placement flow, save, reload => Continue.disabled false, quarantine null; Continue restored Demonstration Ward with the block still in the cabinet (examine says 'It is in the practice cabinet.'), flags unlock/open, lives 3, score 0. A deliberately corrupt save still quarantined with reason invalid-json and Continue disabled. Affected specs 35 passed; npm run test:e2e 92 passed / 1 skipped.

## Outcome

- Signal: useful

## Source Nodes

- hasValidPositionReferences()
- SaveManager
- transferItem()
- ward-round4-fixes.spec.ts