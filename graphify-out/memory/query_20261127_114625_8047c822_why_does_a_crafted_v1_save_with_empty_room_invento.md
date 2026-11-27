---
type: "query"
date: "2026-11-27T11:46:25.657907+00:00"
question: "Why does a crafted v1 save with empty room inventories make 'unlock practice cabinet with practice key' return 'I don't understand that.'?"
contributor: "graphify"
outcome: "corrected"
correction: "Seed the full live New Game state (or include the fixture item in the room inventory) when exercising wrong-order unlock in the browser."
source_nodes: ["NameResolver.ts", "unlockHandler()", "makeState()"]
---

# Q: Why does a crafted v1 save with empty room inventories make 'unlock practice cabinet with practice key' return 'I don't understand that.'?

## Answer

NameResolver resolves only items in player inventory or state.rooms[roomId].inventory; the minimal makeState fixture left the practice cabinet invisible, so unlockCommand() took the unknown path before unlockHandler() could refuse. With the cabinet present in the room inventory the exact one-line refusal appears.

## Outcome

- Signal: corrected
- Correction: Seed the full live New Game state (or include the fixture item in the room inventory) when exercising wrong-order unlock in the browser.

## Source Nodes

- NameResolver.ts
- unlockHandler()
- makeState()