---
type: "query"
date: "2026-11-24T16:32:05.954958+00:00"
question: "Which graph nodes are canonical for the parser and one-command turn pipeline seams used by slice parser-turn?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["ParsedCommand", "CommandHandler", "NameResolver", "Command", "GameEvent", "EventBus", "ScoreTracker", "Session", "Game", "Turn pipeline (buffered events)"]
---

# Q: Which graph nodes are canonical for the parser and one-command turn pipeline seams used by slice parser-turn?

## Answer

Canonical code nodes: ParsedCommand at src/core/commands/ParsedCommand.ts:L2, CommandHandler at src/core/commands/CommandHandler.ts:L6, NameResolver at src/core/commands/NameResolver.ts:L5, Command at src/core/commands/Command.ts:L4, GameEvent at src/core/events/GameEvent.ts:L11, EventBus at src/core/events/EventBus.ts:L4, ScoreTracker at src/core/scoring/ScoreTracker.ts:L5, Session at src/core/lifecycle/Session.ts:L9, Game at src/application/Game.ts:L19, TurnContext at src/core/TurnContext.ts:L6. Canonical doc nodes: Canonical Command union and Canonical GameEvent union and Game facade and One-command turn pipeline in application-and-ui.md and architecture.md, Turn pipeline (buffered events) in shared-rules.md. ScoreTracker duplication lead: doc nodes in shared-rules.md and application-and-ui.md describe one responsibility; the single code node is canonical. 33 red tests target these seams.

## Outcome

- Signal: useful

## Source Nodes

- ParsedCommand
- CommandHandler
- NameResolver
- Command
- GameEvent
- EventBus
- ScoreTracker
- Session
- Game
- Turn pipeline (buffered events)
- One-command turn pipeline
- Canonical Command union
- Canonical GameEvent union
- Game façade