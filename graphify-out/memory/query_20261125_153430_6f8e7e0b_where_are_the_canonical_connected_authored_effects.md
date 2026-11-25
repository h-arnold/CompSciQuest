---
type: "query"
date: "2026-11-25T15:34:30.215405+00:00"
question: "Where are the canonical connected authored-effects seams for room entry, USE/PUT/SHOW, quiz and hint delivery?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src_application_game_game", "src_core_effects_effectapplier_effectapplier", "src_core_commands_verbs_index_handlers", "src_core_puzzles_puzzlesystem_puzzlesystem", "src_core_scoring_scoretracker_scoretracker", "src_core_combat_quizsystem_quizsystem", "src_core_hints_hintsystem_hintsystem", "src_application_composedreaction_createcomposedreaction", "src_core_lifecycle_session_session", "src_core_events_gameevent_roomsummary"]
---

# Q: Where are the canonical connected authored-effects seams for room entry, USE/PUT/SHOW, quiz and hint delivery?

## Answer

Use src/application/Game.ts for command resolution and the single published turn buffer; src/core/effects/EffectApplier.ts is the sole effect mutator and now builds catalogue-derived room summaries; src/core/commands/verbs/index.ts owns canonical verb handlers; src/core/puzzles/PuzzleSystem.ts and src/core/scoring/ScoreTracker.ts own puzzle events and idempotent scoring; src/core/combat/QuizSystem.ts is the phase-3 answer/start seam; src/core/hints/HintSystem.ts is the phase-4 hint seam; src/application/ComposedReaction.ts fixes scheduler-hazards-npcs-puzzles-hints order; src/core/lifecycle/Session.ts owns the win event. The W6 tests show remaining gaps in multiword command resolution, authored USE/PUT/SHOW producers, quiz mechanics, real hint wiring, final-score propagation and missing hub/sample catalogue data.

## Outcome

- Signal: useful

## Source Nodes

- src_application_game_game
- src_core_effects_effectapplier_effectapplier
- src_core_commands_verbs_index_handlers
- src_core_puzzles_puzzlesystem_puzzlesystem
- src_core_scoring_scoretracker_scoretracker
- src_core_combat_quizsystem_quizsystem
- src_core_hints_hintsystem_hintsystem
- src_application_composedreaction_createcomposedreaction
- src_core_lifecycle_session_session
- src_core_events_gameevent_roomsummary