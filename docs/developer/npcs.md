# NPCs and conversation (design)

Status: planned · Last updated: 2026-11-25

Part of the CompSciQuest design set: [architecture](architecture.md) · [application and UI](application-and-ui.md) ·
[shared rule spine](shared-rules.md) · [storage schema](storage-schema.md) ·
[hazards](hazards.md) ·
[quiz combat](combat.md) · [puzzles](puzzles.md) · [hints](hints.md).

## 1. Scope

NPCs are the main revision interface: they explain concepts, ask questions and
can challenge the player to a quiz ([combat](combat.md)). The model is adapted
from TADS 3's conversation system (`ActorState`, `TopicEntry`, `ConvNode`,
`knowsAbout`) because it produces rich-feeling dialogue from small data tables
and needs no generative model or backend.

NPCs are planned for v1 with designs in this document.

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

The optional `actorId` binding was approved in
[content-rules.md §4.3 point 2](content-rules.md#43-npc-card): a topic is bound to
one actor rather than reachable from every actor. Room or area locality is **not**
a field on the topic: use `isActive` with the `in-room` or `in-area` conditions
from [shared-rules.md §3](shared-rules.md#3-condition). An unscoped topic remains
globally reachable; a room-bound actor's default or catch-all topic must carry the
same scope.

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

`Actor` is an entity with identity and behaviour, so it is a class in `src/core`,
consistent with `architecture.md` §5: `id`/`aliases` (reuse `GameObject`),
`stateId`, `knownTopics`, `inventory`, `activeNodeId?` and `topicUses`. Its
serialised shape is `NpcStateDto` in
[storage-schema.md §3.2](storage-schema.md#32-entity-and-system-state).

## 3. Commands and topic resolution

The NPC commands are `talk-to`, `ask`, `tell`, `give`, `show` and `bye`. Their
exact shapes are part of the canonical union in
[application-and-ui.md §5](application-and-ui.md#5-canonical-command-union-and-verbs);
do not redeclare them here.

`NameResolver` resolves object IDs; it cannot resolve free-text topics.
`TopicResolver` sits beside it and takes the raw noun phrase from
`ParsedCommand`:

```ts
export type ResolvedTopic =
  | { readonly kind: 'object'; readonly objectId: string }
  | { readonly kind: 'keyword'; readonly topicId: string }
  | { readonly kind: 'free-text'; readonly text: string };
```

Resolution order:

1. keyword from the active node's special topics → `keyword`;
2. object alias from room/inventory/known objects → `object`;
3. otherwise → `free-text`, which always finds a `DefaultAskTellTopic` and gets
   a vague in-character reply. **Unknown topics never crash or say "parser
   error".**

Free text therefore reaches the **first** active non-default `ask`/`tell` topic
in declaration order — node topics before actor topics. Both verbs are one
class: a free-text phrase reaches an `ask` topic even when the player typed
`tell`, and the reverse, so an `ask` and a `tell` topic on one actor must also
be mutually exclusive. The verb distinction applies only once a phrase resolves
to an object. There is no keyword or specificity tie-break inside that class, so
two such topics on one actor must be mutually exclusive in `isActive`
([content-rules.md](content-rules.md#c--conversation-and-npcs) C7).
`command`/`special` keywords are the only way to address one topic among several
active ask/tell topics.

Object and NPC aliases must be **globally unique**, validated when content is
loaded. This keeps `NameResolver` unambiguous without a disambiguation prompt.

## 4. Conversation flow

1. `talk-to <actor>` **or any conversational verb** (`ask`, `give`, `show`)
   implicitly starts a conversation: emit `conversation-started`, apply the
   `ready` state's greeting effects and switch the actor to `talking`.
2. In **phase 3 (Execute)**, `DialogueSystem` finds the best matching topic
   (the selection order in [§3](#3-commands-and-topic-resolution)): active node
   topics first, then the actor's state topics, then defaults.
   `isActive` gates topics on world state, including `in-room`/`in-area` checks
   against the player's current `Position` for room-scoped dialogue.
3. The response is emitted as `npc-spoke`; effects are returned to the turn's
   effect buffer. `topic-suggested` events carry prompt strings so the UI can
   show "(You could ask why.)".
4. `bye` emits `conversation-ended` and restores the `ready` state. In **phase 4
   (React)**, leaving the room also ends the conversation. There is deliberately
   **no turn timeout** — no implicit "you drifted away" farewell.
5. A topic's `effects` can call `learn-topic`, adding a topic ID to
   `knownTopics`. This is TADS's `knowsAbout`: the player cannot ask about the
   ring until the NPC mentions it. Where the player could have discovered the
   thing independently, define a second topic with a negated `npc-knows`/
   `has-item` condition (the TADS `AltTopic` pattern).
6. `give` and `show` use the `transfer-item` effect so player and NPC inventories
   update atomically.

## 5. Conversation nodes

ConvNodes are included in v1 because the game is a revision tool: a forced
question is exactly how we make a student engage with a concept.

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
adversarial quiz. The node is exited first. On `quiz-ended`, the actor **returns
to its `ready` state** — there is no pre-quiz state snapshot in `NpcStateDto`.
Content that needs a different post-quiz state can apply `set-actor-state` in the
quiz's `onPass`/`onFail` effects.

## 7. State, events and UI

- `GameStateDto.npcs[id]: NpcStateDto` — see
  [storage-schema.md §3.2](storage-schema.md#32-entity-and-system-state).
- New events (`conversation-started`, `npc-spoke`, `conversation-ended`,
  `topic-suggested`) are part of the canonical union in
  [application-and-ui.md §6](application-and-ui.md#6-canonical-event-union-and-rendering).
- `ConversationPanel` mounts in bootstrap beside `OutputLog`, subscribes to the
  event bus and renders all text via `textContent`. It never computes responses.

## 8. Tests

- `TopicResolver`: keyword → object alias → free-text fallback.
- Unknown topic returns a default reply, never an error.
- Global alias uniqueness is enforced at content load.
- `isActive` gating: topic hidden until `learn-topic` fires; alternative topic
  chosen when the player already has the item.
- Room-scoped dialogue: `in-room`/`in-area` gate topics against the current
  `Position`, and a scoped actor's default or catch-all topic stays scoped
  ([shared-rules.md §12](shared-rules.md#12-tests)).
- ConvNode: one-turn expiry vs sticky; default topic keeps node open; special
  keyword exits it.
- Implicit start via `ask`/`give`/`show`; `give` transfers the item atomically.
- Leaving the room ends the conversation; no timeout after N turns.
- State round-trip: `knownTopics`, active node and counters survive JSON
  save/load.
- Full turn: a `start-quiz` effect from a topic transitions to `QuizSystem`.

## 9. Decisions resolved

- Conversations start implicitly on `ask`/`give`/`show`.
- There is no conversation timeout; only `bye` or leaving the room ends it.
- `give`/`show` use a dedicated `transfer-item` effect.
- Object and NPC aliases are globally unique, enforced by content validation.
