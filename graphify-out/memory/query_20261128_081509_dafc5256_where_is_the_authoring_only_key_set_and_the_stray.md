---
type: "query"
date: "2026-11-28T08:15:09.088171+00:00"
question: "Where is the authoring-only key set and the stray-authoring-key placement check owned, and which collections does the walk visit?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["tools_content_schema_authoring_keys", "tools_content_schema_strayfindings", "tools_content_schema_collection_keys", "tools_content_schema_shapefinding", "tools_content_schema_parsecardset", "tools_content_emit_stripauthoring"]
---

# Q: Where is the authoring-only key set and the stray-authoring-key placement check owned, and which collections does the walk visit?

## Answer

AUTHORING_KEYS (tools/content/schema.ts) is the single owner of the authoring-only key set; strayFindings() walks the card record and each collection entry in COLLECTION_KEYS, skips the 'authoring' key and raises shapeFinding(path, entry, "Authoring key '<key>' must live inside an authoring block") for any authoring-only key that appears as a direct key. parseCardSet() calls it. Extending AUTHORING_KEYS is the whole change needed to enforce placement for a key; the walk needs no change.

## Outcome

- Signal: useful

## Source Nodes

- tools_content_schema_authoring_keys
- tools_content_schema_strayfindings
- tools_content_schema_collection_keys
- tools_content_schema_shapefinding
- tools_content_schema_parsecardset
- tools_content_emit_stripauthoring