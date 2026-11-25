---
type: "query"
date: "2026-11-25T08:43:06.109224+00:00"
question: "Which owner builds the audited area set and drives covered-topic completion in the world-graph gate?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["auditedAreaLikes(),areaLikes(),checkWorld(),completionFindings(),startFindings(),reachabilityFindings(),ownershipFindings(),sharedFindings(),duplicateWorlds(),validateCards()"]
---

# Q: Which owner builds the audited area set and drives covered-topic completion in the world-graph gate?

## Answer

auditedAreaLikes() in tools/content/gates/common.ts is the single audited-area-set owner (called by checkWorld, sharedFindings, both startFindings, ownerFindings); completionFindings() is called only by checkWorld() in world.ts.

## Outcome

- Signal: useful

## Source Nodes

- auditedAreaLikes(),areaLikes(),checkWorld(),completionFindings(),startFindings(),reachabilityFindings(),ownershipFindings(),sharedFindings(),duplicateWorlds(),validateCards()