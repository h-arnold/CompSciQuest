# NPCs and conversation

NPCs are the main revision interface: they explain concepts, ask questions and
can challenge the player to a quiz ([combat](combat.md)). The model follows TADS
3's conversation system (`ActorState`, `TopicEntry`, `ConvNode`, `knowsAbout`),
which produces rich dialogue from small data tables and needs no generative
model or backend. The [developer documentation index](README.md) lists the
other subsystem docs.

## 1. Scope

Conversation is authored as actors, actor states, topics and nodes.
`DialogueSystem` reacts in phase 4, applies topic effects through
`EffectApplier` and returns the resulting events. Free-text input always
resolves to a topic or a default reply, never a parser error.

## 2. Model

```ts
// src/core/npcs/ActorState.ts — data, not behaviour
export interface ActorState {
  readonly id: string; // e.g. 'idle', 'ready', 'talking', 'hostile'
  readonly stateDesc: string; // appended to examine text
  readonly specialDesc: string; // shown in the room listing
  readonly onEnter?: readonly Effect[];
  readonly onExit?: readonly Effect[];
}

// src/core/npcs/ConversationTopic.ts
export type TopicMatch =
  | {
      readonly kind: 'ask' | 'tell' | 'askTell';
      readonly objectIds: readonly string[];
    }
  | { readonly kind: 'give' | 'show'; readonly itemIds: readonly string[] }
  | {
      readonly kind: 'command' | 'special';
      readonly keywords: readonly string[];
    };

export type ResponseStrategy =
  | { readonly kind: 'once' }
  | { readonly kind: 'sequence' } // play in order, repeat the last
  | { readonly kind: 'rotating' }; // cycle; uses injected Random if shuffled

export interface ConversationTopic {
  readonly id: string;
  readonly actorId?: string; // optional binding; an unbound topic stays global
  readonly match: TopicMatch;
  readonly isActive: Condition; // shared rule spine §3
  readonly responses: readonly string[];
  readonly strategy: ResponseStrategy;
  readonly effects: readonly Effect[]; // learn-topic, set-flag, enter-node, start-quiz…
  readonly prompt?: string; // "(You could ask why.)"
}
```

A topic may carry an optional `actorId` binding
([content-rules.md §4.3 "Actor binding"](content-rules.md#43-npc-card)): a bound topic
is reachable only from that actor; an unbound topic stays globally reachable.
Room or area locality is not a field on the topic: use `isActive` with the
`in-room` or `in-area` conditions
([shared-rules.md §3](shared-rules.md#3-condition)). A room-bound actor's
default or catch-all topic must carry the same scope
([content-rules.md](content-rules.md#c--conversation-and-npcs) C6). `in-room` and
`in-area` match only the player's current `Position`
([shared-rules.md §11](shared-rules.md#11-invariants-the-implementation-must-keep)).

```ts
// src/core/npcs/ConversationNode.ts
export interface ConversationNode {
  readonly id: string;
  readonly isSticky: boolean; // false = expires after one turn
  readonly topics: readonly ConversationTopic[];
  readonly defaultTopicId: string; // catches unmatched input, keeps node open
  readonly onEnterEffects?: readonly Effect[];
}
```

`ActorDefinition` (`src/content/ActorDefinition.ts`) supplies the authored `id`,
`aliases` and `initialStateId`. Runtime state lives in `NpcStateDto`: `stateId`,
`knownTopics`, `inventory`, `activeNodeId?` and `topicUses`
([storage-schema.md §3.2](storage-schema.md#32-entity-and-system-state)).

## 3. Commands and topic resolution

The NPC commands are `talk-to`, `ask`, `tell`, `give`, `show` and `bye`. Their
exact shapes are part of the canonical union in
[application-and-ui.md §5](application-and-ui.md#5-canonical-command-union-and-verbs);
do not redeclare them here.

`NameResolver` resolves object IDs; it cannot resolve free-text topics.
`TopicResolver` sits beside it and takes the raw noun phrase from
`ParsedCommand` plus the speaking actor's ID, so actor-bound topics stay bound
during resolution. Its canonical signature is in
[application-and-ui.md §8](application-and-ui.md#8-behavioural-signatures).

```ts
export type ResolvedTopic =
  | { readonly kind: 'object'; readonly objectId: string }
  | { readonly kind: 'keyword'; readonly topicId: string }
  | { readonly kind: 'free-text'; readonly text: string };
```

Resolution order:

1. a keyword from the active node's own `special` topics → `keyword`;
2. a keyword from a `special` topic bound to the speaking actor → `keyword`
   (a node's own specials are excluded here so they cannot steal its turn);
3. a visible object alias from room, inventory or known objects → `object`;
4. a phrase naming exactly one declared `ask`/`tell` object ID → `object`;
5. otherwise → `free-text`, which uses the authored default reply. **Unknown
   topics never crash or say "parser error".**

The resolver reads state only; selection owns every gate. On an object match,
several authored topics may declare the same phrase; the one bound to the
speaking actor is the exact topic and wins even while `isActive` is false.
Actor binding, not a topic-ID word, is the tie-break. A command-incompatible
exact topic (`ask` versus `tell`) lets no other concrete topic answer: the
default catch-all replies through `speakIdleTopic()` without counting a topic
use. Object resolution requires exactly one declared object ID, so ambiguous
phrases never become object matches. A conversation topic ID is never player
vocabulary.

With no resolved target, the **first** active, command-compatible non-default
`ask`/`tell` topic wins in declaration order — node topics before actor topics
([§4](#4-conversation-flow)). Ask and tell are one authoring class for the
overlap proof ([content-rules.md](content-rules.md#c--conversation-and-npcs) C7),
but the command check applies on the keyword, object and free-text paths: an
`ask`-only topic cannot answer `tell`, a `tell`-only topic cannot answer `ask`,
and `askTell` accepts both. Content must not rely on a keyword or an ID word as
a tie-break inside that class; two such topics on one actor must be mutually
exclusive in `isActive` (C7). A `command`/`special` keyword, or a phrase naming
one declared object ID, addresses one topic among several active ask/tell
topics.

Object and NPC aliases must be **globally unique**, validated when content is
loaded. This keeps `NameResolver` unambiguous without a disambiguation prompt.

## 4. Conversation flow

1. `talk-to <actor>` **or any conversational verb** (`ask`, `give`, `show`)
   starts a conversation implicitly: emit `conversation-started`, apply the
   actor's current state's `onEnter` effects and switch the actor to `talking`.
2. In **phase 4 (React)**, `DialogueSystem` finds the best matching topic among
   node topics, then actor topics (bound to this actor or global), then defaults.
   `isActive` gates topics on world state, including `in-room`/`in-area` checks
   against the player's current `Position` for room-scoped dialogue. A `once`
   topic already used by this actor is not selected again; an exhausted `once`
   default is excluded from the fallback, so a second pass produces no reply,
   no use-count increment and no effects.
3. The response is emitted as `npc-spoke`; the topic's effects are applied
   through the injected `EffectApplier` and the resulting events are returned
   for the turn's buffer
   ([application-and-ui.md §8](application-and-ui.md#8-behavioural-signatures)).
   `topic-suggested` events carry prompt strings so the UI can show "(You could
   ask why.)".
4. `bye` emits `conversation-ended` and returns the actor to its declared
   `initialStateId`. Leaving the room in phase 4 also ends the conversation.
   There is deliberately **no turn timeout** — no implicit "you drifted away"
   farewell.
5. A topic's `effects` can call `learn-topic`, adding a topic ID to
   `knownTopics`. This is TADS's `knowsAbout`: the player cannot ask about the
   ring until the NPC mentions it. Where the player could have discovered the
   thing independently, define a second topic with a negated `npc-knows`/
   `has-item` condition (the TADS `AltTopic` pattern).
6. `give` and `show` use the `transfer-item` effect so player and NPC
   inventories update atomically.

## 5. Conversation nodes

A ConvNode forces a question, which is how the game makes a student engage with
a concept.

- A node has a `defaultTopicId` that keeps the player in the node until a
  `special` topic matches.
- Default nodes last one turn; set `isSticky: true` for a multi-turn exchange.
- `enter-node` starts a node; `exit-node` or leaving the conversation ends it.
- A node's special topics match on keywords from `ParsedCommand` tokens, not on
  resolved object IDs — this is why `TopicResolver` exists.
- Prompt strings from `prompt` fields are surfaced through `topic-suggested`.

Example shape: after explaining a topic, the NPC enters node `explain-evaluate`;
its special topic `ask why` is active until asked; the default topic repeats the
prompt. Answering correctly applies `learn-topic` and `complete-topic`.

## 6. Link to quiz combat

A topic effect `start-quiz` ([combat](combat.md)) hands the player to an
adversarial quiz. The node is exited first. On `quiz-ended`, the actor returns
to its declared `initialStateId` — there is no pre-quiz state snapshot in
`NpcStateDto`. Content that needs a different post-quiz state applies
`set-actor-state` in the quiz's `onPass`/`onFail` effects.

## 7. State, events and UI

- `GameStateDto.npcs[id]: NpcStateDto` — see
  [storage-schema.md §3.2](storage-schema.md#32-entity-and-system-state).
- The conversation events (`conversation-started`, `npc-spoke`,
  `conversation-ended`, `topic-suggested`) are part of the canonical union in
  [application-and-ui.md §6](application-and-ui.md#6-canonical-event-union-and-rendering).
- `GameWindow` mounts `ConversationPanel` beside `OutputLog` and refreshes it
  from `GameViewData`; the panel renders all text via `textContent` and never
  computes responses.
