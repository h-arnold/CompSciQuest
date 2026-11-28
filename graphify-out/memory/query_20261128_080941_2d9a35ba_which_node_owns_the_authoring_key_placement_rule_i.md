---
type: "query"
date: "2026-11-28T08:09:41.240523+00:00"
question: "Which node owns the authoring-key placement rule in the YAML content schema, and where is the authoring-only key set?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["strayFindings()", "AUTHORING_KEYS", "COLLECTION_KEYS", "shapeFinding()", "parseCardSet()", "zone1CardSet()"]
---

# Q: Which node owns the authoring-key placement rule in the YAML content schema, and where is the authoring-only key set?

## Answer

tools/content/schema.ts owns it: strayFindings() at L252 walks the card record and each COLLECTION_KEYS entry, skips the 'authoring' key, and raises shapeFinding(path, entry, "Authoring key '<key>' must live inside an authoring block") for a key in AUTHORING_KEYS (L70). parseCardSet() at L282 calls it at L319 and returns { findings, parsed }. The authoring-only key set currently lacks 'voiceSamples' and 'dialoguePlan', so a stray one on an actors entry or a conversationTopics entry raises nothing; the canonical examples are docs/developer/npcs.md §8 (authoring.voiceSamples, authoring.dialoguePlan) and the placement rule is docs/developer/content-toolchain.md §2 D4. The shipped set is read via the read-only fixture zone1CardSet() at tests/fixtures/zone1.ts L101.

## Outcome

- Signal: useful

## Source Nodes

- strayFindings()
- AUTHORING_KEYS
- COLLECTION_KEYS
- shapeFinding()
- parseCardSet()
- zone1CardSet()