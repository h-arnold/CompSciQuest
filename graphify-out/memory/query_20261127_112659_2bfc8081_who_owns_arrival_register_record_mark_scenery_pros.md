---
type: "query"
date: "2026-11-27T11:26:59.685174+00:00"
question: "Who owns arrival register/record/mark scenery prose for WR2-E1?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["SCENERY,SceneryDefinition,resolveScenery(),hasMatchingName(),describeScenery(),NameResolver"]
---

# Q: Who owns arrival register/record/mark scenery prose for WR2-E1?

## Answer

SCENERY in src/core/commands/InteractionRules.ts is the sole scenery table; NameResolver -> resolveScenery() -> sceneryInRoom()/hasMatchingName() -> describeScenery() is the only path. Added one room-arrival entry with code-owned id scenery-arrival-register; no separate resolver, no new item ID, no parser edit. Article forms of record/mark are listed as aliases because the tokenizer keeps 'the' in noun phrases.

## Outcome

- Signal: useful

## Source Nodes

- SCENERY,SceneryDefinition,resolveScenery(),hasMatchingName(),describeScenery(),NameResolver