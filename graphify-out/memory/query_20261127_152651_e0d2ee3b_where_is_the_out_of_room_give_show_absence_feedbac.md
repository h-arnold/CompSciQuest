---
type: "query"
date: "2026-11-27T15:26:51.052998+00:00"
question: "Where is the out-of-room give/show absence feedback handled and is a new Command variant required?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["conversationCommand(),unseenActorHandler(),isActorOutOfRoom(),HANDLERS,Command"]
---

# Q: Where is the out-of-room give/show absence feedback handled and is a new Command variant required?

## Answer

Added canonical 'unseen-actor' Command variant; conversationCommand returns it for give/show with unresolvable item; unseenActorHandler in verbs/index.ts reuses isActorOutOfRoom() and createConditionEvaluator() to emit the canonical absence line.

## Outcome

- Signal: useful

## Source Nodes

- conversationCommand(),unseenActorHandler(),isActorOutOfRoom(),HANDLERS,Command