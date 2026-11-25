---
type: "query"
date: "2026-11-25T15:31:13.397416+00:00"
question: "NPC slice: where is the node-default catch and node expiry implemented and why do NODE-02 and GAP-05 share the same shape"
contributor: "graphify"
outcome: "corrected"
source_nodes: ["ConversationFlow"]
---

# Q: NPC slice: where is the node-default catch and node expiry implemented and why do NODE-02 and GAP-05 share the same shape

## Answer

handleConversationTopic in src/core/npcs/ConversationFlow.ts (L241-252) — the !selected.isDefault guard skips expireNode for the authored node default; expireNode (L256) emits node-exited+conversation-ended and restores ready. NODE-02 vs GAP-05 are structurally identical per current tree (both selected.isDefault true, non-sticky, active); all four IDs now green.

## Outcome

- Signal: corrected

## Source Nodes

- ConversationFlow