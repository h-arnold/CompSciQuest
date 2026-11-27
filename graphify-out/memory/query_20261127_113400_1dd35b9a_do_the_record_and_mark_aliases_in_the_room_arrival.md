---
type: "query"
date: "2026-11-27T11:34:00.014526+00:00"
question: "Do the record and mark aliases in the room-arrival SCENERY entry make resolveScenery ambiguous?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["hasMatchingName()", "resolveScenery()", "sceneryInRoom()", "ArrivalScenery.test.ts"]
---

# Q: Do the record and mark aliases in the room-arrival SCENERY entry make resolveScenery ambiguous?

## Answer

No. Verified by two new tests in tests/turn/ArrivalScenery.test.ts: 'examine record' and 'examine mark' each return exactly one accepted scenery message with unchanged state. hasMatchingName() in InteractionRules.ts:L343 returns one boolean per entry via names.some(...); resolveScenery() at L357 filters sceneryInRoom() entries (L353) and requires exactly one matching entry, so multiple aliases inside one entry are harmless. No production change needed.

## Outcome

- Signal: useful

## Source Nodes

- hasMatchingName()
- resolveScenery()
- sceneryInRoom()
- ArrivalScenery.test.ts