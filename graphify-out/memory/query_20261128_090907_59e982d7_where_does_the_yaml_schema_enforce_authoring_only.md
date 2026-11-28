---
type: "query"
date: "2026-11-28T09:09:07.076063+00:00"
question: "Where does the YAML schema enforce authoring-only keys, and which artefacts does the stray-key walk reach?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["strayFindings()", "AUTHORING_KEYS", "COLLECTION_KEYS", "shapeFinding()", "parseCardSet()", "zone1CardSet()", "reservedFindings()", "authoringOf()", "asRecord()"]
---

# Q: Where does the YAML schema enforce authoring-only keys, and which artefacts does the stray-key walk reach?

## Answer

strayFindings() in tools/content/schema.ts is the sole owner of the stray-authoring-key walk. It visits the card record, a card's definition: record and one level of COLLECTION_KEYS entries, and skips the 'authoring' key. The definition: record was previously unreachable, so an authoring-only key written beside name:/startRoomId: on an area card's definition: raised no finding. This slice extends the walk to the definition: record, labelled with the record's own id and falling back to 'definition', so all 45 derived (name, artefact-level) pairs across the shipped set are now enforced, with 'topics' the only tolerated name. The cited neighbours are AUTHORING_KEYS (L71), COLLECTION_KEYS (L106), shapeFinding() (L122), parseCardSet() (L309) and asRecord() from tools/content/gates/common.ts.

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