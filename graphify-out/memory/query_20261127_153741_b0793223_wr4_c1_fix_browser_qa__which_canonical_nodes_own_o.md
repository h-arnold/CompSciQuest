---
type: "query"
date: "2026-11-27T15:37:41.081232+00:00"
question: "WR4-C1-FIX browser QA: which canonical nodes own out-of-room give/show feedback and the real transcript/state fields?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["conversationCommand()", "unseenActorHandler()", "isActorOutOfRoom()", "formatEvent()", "GameViewData", "SaveControls"]
---

# Q: WR4-C1-FIX browser QA: which canonical nodes own out-of-room give/show feedback and the real transcript/state fields?

## Answer

conversationCommand() returns unseen-actor with the resolved actor when give/show item resolution fails; unseenActorHandler() emits exactly one canonical message "You cannot see that here." via isActorOutOfRoom(); formatEvent() renders message text verbatim; GameViewData carries score/lives and SaveManager DTO carries flags, inventories and topicUses used for state-purity assertions.

## Outcome

- Signal: useful

## Source Nodes

- conversationCommand()
- unseenActorHandler()
- isActorOutOfRoom()
- formatEvent()
- GameViewData
- SaveControls