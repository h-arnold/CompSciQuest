---
type: "query"
date: "2026-11-28T09:30:42.696220+00:00"
question: "Is the Goodbye. acknowledgement reimplemented outside DialogueSystem?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["farewell()", "DialogueSystem.ts", "Effect"]
---

# Q: Is the Goodbye. acknowledgement reimplemented outside DialogueSystem?

## Answer

No bypass: literal 'Goodbye.' and reason 'said goodbye' occur only in src/core/npcs/DialogueSystem.ts; other kind:'message' sites are canonical effect constructors in their own subsystems.

## Outcome

- Signal: useful

## Source Nodes

- farewell()
- DialogueSystem.ts
- Effect