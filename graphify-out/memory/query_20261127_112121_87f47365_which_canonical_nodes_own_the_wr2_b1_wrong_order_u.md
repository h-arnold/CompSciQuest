---
type: "query"
date: "2026-11-27T11:21:21.885214+00:00"
question: "Which canonical nodes own the WR2-B1 wrong-order unlock refusal, WR2-B2 item-first unlock preservation and WR2-E1 arrival scenery examine contracts?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["unlockHandler()", "unlockCommand()", "examineHandler()", "describeScenery()", "resolveScenery()", "NameResolver"]
---

# Q: Which canonical nodes own the WR2-B1 wrong-order unlock refusal, WR2-B2 item-first unlock preservation and WR2-E1 arrival scenery examine contracts?

## Answer

Start at unlockHandler() in src/core/commands/verbs/index.ts:L100 for wrong-order unlock feedback and the missing-key branch; at unlockCommand() in src/application/commandResolution.ts:L260 plus NameResolver in src/core/commands/NameResolver.ts:L6 for item-first resolution; and at examineHandler() in src/core/commands/verbs/index.ts:L193 with describeTarget() L60 delegating to describeScenery()/resolveScenery()/sceneryInRoom()/hasMatchingName() in src/core/commands/InteractionRules.ts (SCENERY L34). All four nodes are single-owner; message() and hasItem() also appear in verbs/npcHandlers.ts but that duplicate was not used for these rows.

## Outcome

- Signal: useful

## Source Nodes

- unlockHandler()
- unlockCommand()
- examineHandler()
- describeScenery()
- resolveScenery()
- NameResolver