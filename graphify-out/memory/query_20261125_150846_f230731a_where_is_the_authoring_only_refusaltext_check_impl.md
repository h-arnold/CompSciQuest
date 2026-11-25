---
type: "query"
date: "2026-11-25T15:08:46.912322+00:00"
question: "Where is the authoring-only refusalText check implemented and what are the other gate owners in tools/content/schema.ts?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["tools/content/schema.ts"]
---

# Q: Where is the authoring-only refusalText check implemented and what are the other gate owners in tools/content/schema.ts?

## Answer

refusalTextFindings() in tools/content/schema.ts (new, L127), hooked into parseCardSet() L258; owners: shapeFinding L89, nullFindings L93, todoFindings L127, strayFindings L161, parseCardSet L191, asArray gates/common.ts L22, asRecord L16, finding L43

## Outcome

- Signal: useful

## Source Nodes

- tools/content/schema.ts