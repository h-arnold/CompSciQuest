---
type: "query"
date: "2026-11-25T17:26:21.173506+00:00"
question: "Which canonical nodes own W7 room/event rendering and the observed non-quiz runtime failures?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["e2e_w7_opening_walkthrough_spec", "src_ui_formatevent_formatevent", "src_ui_outputlog_outputlog", "src_core_npcs_topicselection_selecttopic", "src_core_npcs_conversationflow_handleconversationtopic", "src_core_scoring_scoretracker_progressentry", "src_core_effects_effectapplier_transferitem", "src_core_commands_interactionrules_putinteraction"]
---

# Q: Which canonical nodes own W7 room/event rendering and the observed non-quiz runtime failures?

## Answer

RoomSummary and formatEvent own entry rendering; OutputLog owns transcript append/scroll behaviour. TopicSelection and ConversationFlow own the AI precedence and SHOW transfer paths. ScoreTracker owns area attribution. EffectApplier and InteractionRules own PUT transfer and producer matching. These locations oriented the browser findings but were not treated as proof.

## Outcome

- Signal: useful

## Source Nodes

- e2e_w7_opening_walkthrough_spec
- src_ui_formatevent_formatevent
- src_ui_outputlog_outputlog
- src_core_npcs_topicselection_selecttopic
- src_core_npcs_conversationflow_handleconversationtopic
- src_core_scoring_scoretracker_progressentry
- src_core_effects_effectapplier_transferitem
- src_core_commands_interactionrules_putinteraction