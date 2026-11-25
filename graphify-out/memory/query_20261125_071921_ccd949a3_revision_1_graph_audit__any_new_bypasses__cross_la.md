---
type: "query"
date: "2026-11-25T07:19:21.603334+00:00"
question: "Revision 1 graph audit: any new bypasses, cross-layer edges or unexpected hub?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["openOrClose,putCommand,NameResolver,Effect,ContentBundle"]
---

# Q: Revision 1 graph audit: any new bypasses, cross-layer edges or unexpected hub?

## Answer

No bypasses: It is already open. is emitted only by openOrClose, putCommand is the sole put resolver, and hasShortName lives only in NameResolver. Cross-layer scan found 0 core to application/ui/storage imports. New high-degree nodes belong to the parallel content-toolchain, not this slice.

## Outcome

- Signal: useful

## Source Nodes

- openOrClose,putCommand,NameResolver,Effect,ContentBundle