---
type: "query"
date: "2026-11-25T07:41:48.346898+00:00"
question: "Do the new content toolchain nodes bypass the canonical runtime validator or catalogue factory?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["validateCards(),validateContent(),catalogueOf()"]
---

# Q: Do the new content toolchain nodes bypass the canonical runtime validator or catalogue factory?

## Answer

No bypass. tools/content/validate.ts delegates the shared structural checks through tools/content/adapt.ts sharedFindings(), which calls validateContent() in src/content/validateContent.ts; the remaining authoring gates add gate IDs/path/entry. catalogueOf() is now owned by src/content/Catalogue.ts and reused by src/content/index.ts and tools/content/adapt.ts; the only other node is the test-owned fixture.

## Outcome

- Signal: useful

## Source Nodes

- validateCards(),validateContent(),catalogueOf()