---
type: "query"
date: "2026-11-28T08:59:28.953760+00:00"
question: "Where does the YAML schema enforce authoring-only keys, and which artefacts does the stray-key walk reach?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["strayFindings()", "AUTHORING_KEYS", "COLLECTION_KEYS", "shapeFinding()", "parseCardSet()", "zone1CardSet()", "reservedFindings()", "authoringOf()", "asRecord()", "Effect"]
---

# Q: Where does the YAML schema enforce authoring-only keys, and which artefacts does the stray-key walk reach?

## Answer

The stray-authoring-key walk lives in strayFindings at tools/content/schema.ts:L271. It checks the card record direct keys and the direct keys of each entry of the 13 COLLECTION_KEYS at tools/content/schema.ts:L106, and it does not visit a card definition record, so an authoring-only key written beside name and startRoomId on a definition record is invisible today. AUTHORING_KEYS at tools/content/schema.ts:L71 holds 32 names; reason is the only member in no shipped authoring block, and topics is the one derived name deliberately absent because it is a legal card-level collection key. reservedFindings at tools/content/gates/npc.ts:L67 reads authoring reason via authoringOf at tools/content/gates/common.ts:L156, and the Effect union at src/core/effects/Effect.ts:L4 gives reason to change-lives, move-player, end-quiz and announce-hazard.

## Outcome

- Signal: useful

## Source Nodes

- strayFindings()
- AUTHORING_KEYS
- COLLECTION_KEYS
- shapeFinding()
- parseCardSet()
- zone1CardSet()
- reservedFindings()
- authoringOf()
- asRecord()
- Effect