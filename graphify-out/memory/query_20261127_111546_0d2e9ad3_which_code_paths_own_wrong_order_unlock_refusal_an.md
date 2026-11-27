---
type: "query"
date: "2026-11-27T11:15:46.172680+00:00"
question: "Which code paths own wrong-order unlock refusal and arrival scenery examine"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src_core_commands_verbs_index_unlockhandler,src_core_commands_verbs_index_examinehandler,src_core_commands_interactionrules_scenery,src_core_commands_interactionrules_describescenery,src_application_commandresolution_unlockcommand"]
---

# Q: Which code paths own wrong-order unlock refusal and arrival scenery examine

## Answer

unlockHandler() at src/core/commands/verbs/index.ts:L100 and examineHandler() at L193; SCENERY at src/core/commands/InteractionRules.ts:L34, resolveScenery() L339, describeScenery() L358, sceneryInRoom() L335, hasMatchingName() L325, examineInteraction() L457, describeTarget() verbs/index.ts:L60; unlockCommand() src/application/commandResolution.ts:L260

## Outcome

- Signal: useful

## Source Nodes

- src_core_commands_verbs_index_unlockhandler,src_core_commands_verbs_index_examinehandler,src_core_commands_interactionrules_scenery,src_core_commands_interactionrules_describescenery,src_application_commandresolution_unlockcommand