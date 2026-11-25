---
type: "query"
date: "2026-11-25T07:19:21.435278+00:00"
question: "Revision 1: which canonical nodes own put-command resolution, short-name alias resolution and the already-open precondition?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["resolveGameCommand,putCommand,createNameResolver,hasShortName,openOrClose,Command,Effect"]
---

# Q: Revision 1: which canonical nodes own put-command resolution, short-name alias resolution and the already-open precondition?

## Answer

Reused Game.resolveGameCommand via a new putCommand helper, NameResolver.createNameResolver with a content-derived short-name fallback, and verbs/index openOrClose with the documented action flag precondition. No duplicate canonical union or parallel hub was created.

## Outcome

- Signal: useful

## Source Nodes

- resolveGameCommand,putCommand,createNameResolver,hasShortName,openOrClose,Command,Effect