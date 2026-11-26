---
type: "query"
date: "2026-11-26T17:30:22.172905+00:00"
question: "ENG9: which canonical nodes own bare-number quiz answers and ask-about actor inference, and is there an existing presence owner to reuse?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["resolveGameCommand", "answerCommand", "bareAnswerCommand", "inferAskActor", "isMatchingLocationScope", "TopicResolver", "TopicSelection", "speakingActorIds", "QuizSystem"]
---

# Q: ENG9: which canonical nodes own bare-number quiz answers and ask-about actor inference, and is there an existing presence owner to reuse?

## Answer

resolveGameCommand()/answerCommand() in src/application/commandResolution.ts own Command resolution; bare numbers were newly gated in bareAnswerCommand() there using the existing 1-based answerCommand path and QuizSystem.ts 0-based conversion. TopicResolver.ts resolves a phrase to a topic for a known actor; TopicSelection.ts gates topics; DialogueSystem.actorIdOf() reads the already-resolved command and ConversationFlow.speakingActorIds() tracks TALKING_STATE. None enumerates location-scoped, actor-bound topics to infer an actor for 'ask about <topic>', so a private inferAskActor() helper was added in commandResolution.ts using bundle.conversationTopics.all, bundle.nodes[].topics, ConversationTopic.actorId and in-room/in-area (or all) isActive scopes against state.player.position. No duplicate canonical owner found; bypass leads checked in source and ruled out.

## Outcome

- Signal: useful

## Source Nodes

- resolveGameCommand
- answerCommand
- bareAnswerCommand
- inferAskActor
- isMatchingLocationScope
- TopicResolver
- TopicSelection
- speakingActorIds
- QuizSystem