---
type: "query"
date: "2026-11-25T06:59:31.140427+00:00"
question: "Which canonical nodes own parser, turn pipeline and event formatting responsibilities?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["ParsedCommand,Command,CommandHandler,NameResolver,EventBus,GameEvent,ScoreTracker,Session,Game,formatEvent"]
---

# Q: Which canonical nodes own parser, turn pipeline and event formatting responsibilities?

## Answer

Reused ParsedCommand, Command, CommandHandler, NameResolver, EventBus, GameEvent, ScoreTracker, Session and Game; added only missing factories/formatters at their canonical files. No duplicate canonical union created.

## Outcome

- Signal: useful

## Source Nodes

- ParsedCommand,Command,CommandHandler,NameResolver,EventBus,GameEvent,ScoreTracker,Session,Game,formatEvent