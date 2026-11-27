---
type: "query"
date: "2026-11-27T13:48:23.049822+00:00"
question: "Why does a save written immediately after 'place practice block in practice cabinet' get quarantined as invalid-content on reload?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["SaveManager", ".validate()", "ItemVisibility", "putHandler()"]
---

# Q: Why does a save written immediately after 'place practice block in practice cabinet' get quarantined as invalid-content on reload?

## Answer

Graph query located SaveManager.validate() at src/application/SaveManager.ts:L37. Its content-reference check requires every Object.keys(state.rooms) key to resolve via bundle.rooms.getById. transfer-item writes the placed block to state.rooms['item-assistance-practice-cabinet'], whose key is an item ID, so validation rejects the save and boot quarantines it. Reproduced deterministically: clean New Game, unlock, open, place, save, reload => Continue disabled and quarantine reason invalid-content; a control save without placement reloads fine.

## Outcome

- Signal: useful

## Source Nodes

- SaveManager
- .validate()
- ItemVisibility
- putHandler()