---
type: "query"
date: "2026-11-27T13:53:45.220139+00:00"
question: "WR4 persistence blocker: which canonical SaveManager nodes reject a state.rooms key that is a fixture item ID holding a placed item?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["SaveManager", ".validate()", "haveExistingIds()", ".buildDto()", ".load()", ".save()", "createSaveManager()", "transferItem()"]
---

# Q: WR4 persistence blocker: which canonical SaveManager nodes reject a state.rooms key that is a fixture item ID holding a placed item?

## Answer

Canonical chain: createSaveManager at SaveManager.ts:L335; buildDto/save at L338/L390 serialise transferItem results from EffectApplier.ts:L39; validate at L345 calls hasValidReferences and hasValidPositionReferences at L298/L237, where haveExistingIds at L230 checks Object.keys(state.rooms) via bundle.rooms.getById at L247-L249; failure yields invalid-content at L365-L366 and load at L393 quarantines at L378-L386. Start with SaveManager.validate and haveExistingIds.

## Outcome

- Signal: useful

## Source Nodes

- SaveManager
- .validate()
- haveExistingIds()
- .buildDto()
- .load()
- .save()
- createSaveManager()
- transferItem()