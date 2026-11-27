---
type: "query"
date: "2026-11-27T11:27:25.183828+00:00"
question: "Bypass check on WR2-B1 refusal literal and WR2-E1 arrival scenery prose: any reimplementation outside the canonical hub?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["unlockHandler(),SCENERY,describeRoom(),resolveScenery()"]
---

# Q: Bypass check on WR2-B1 refusal literal and WR2-E1 arrival scenery prose: any reimplementation outside the canonical hub?

## Answer

No code bypass. Raw scan of src/** found 'stays in place; turn its lock with' only in unlockHandler() and 'scenery-arrival-register'/'The register lies open' only in the new SCENERY entry. The other 'The register lies open' hit is generated authored room description data in src/content/authored/rooms.ts, used by describeRoom(); it is content data, not a second scenery resolver or refusal implementation. Graph query returned SCENERY/unlockHandler() as the responsible hubs; EXTRACTED path unlockHandler()->flagsPrefix->verbs/index.ts->InteractionRules.ts->SCENERY.

## Outcome

- Signal: useful

## Source Nodes

- unlockHandler(),SCENERY,describeRoom(),resolveScenery()