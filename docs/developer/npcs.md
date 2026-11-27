# NPCs and conversation

NPCs are the main revision interface: they explain concepts, ask questions and
can challenge the player to a quiz ([combat](combat.md)). The model follows TADS
3's conversation system (`ActorState`, `TopicEntry`, `ConvNode`, `knowsAbout`),
so small data tables produce dialogue without a generative model or backend.
This document owns NPC authoring rules, the runtime model, card shape, review
checks, gates and acceptance. Rules are cited by ID from their owning documents;
the W1–W7 workflow lives in
[content-editor.md](../../.opencode/agents/content-editor.md). `npc-writer` MUST
read this document in full before beginning work; its agent brief supplies
workflow and a short operational checklist, never a substitute for these rules.

Start with the exchange the player should experience: voice, narrative aim,
takeaway, fallback and comprehension. Only then choose the match kinds, gates,
nodes and effects that deliver it. Rule map:
[write the dialogue first](#write-the-dialogue-first),
[technical rules](#technical-conversation-rules-t),
[card format](#8-npc-card-format),
[review and playtest](#9-reviewer-and-playtest-checks),
[gates](#10-structural-validation-gates) and
[acceptance](#11-agent-acceptance-for-npc-cards).

## Write the dialogue first

An NPC exchange exists to move the story forward and teach something the player
can use. Draft the lines before filling in `match`, `isActive` and `effects`;
those fields must serve the exchange, not replace it. The MUST, SHOULD and MUST
NOT labels and finding severity are defined under
[review labels](content-toolchain.md#review-labels).

Apply A and T rules in this reading order: P0 D6/T4; P1 A3/A6/T6; P2
A1/A2/A5/T1; P3 T2/T3/T5; P4 A4. A lower-priority pass never overrides a
higher-priority finding.

### Authoring conversation rules (A)

Each A row is both a writing rule and a review test. Apply it to every useful
reply, prompt and fallback. Related IDs point to other rules and do not replace
the A row.

| ID  | Test              | MUST                                                                                                                                                                                            | SHOULD                                                                                                                                            | MUST NOT                                                                                                                                | Related IDs            |
| --- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| A1  | Tone and identity | Give the actor a distinct role, voice, motivation and relationship; record the approved tone mode, address form, one sample line and at most one recurring phrase. Cover-test failure is major. | Prefer opposing motivations.                                                                                                                      | Drift from the register, mock the learner's ability, or use more than one recurring phrase for one NPC.                                 | N4                     |
| A2  | Goal and payoff   | Carry a D6 plan on every non-default topic; deliver its takeaway in character so the player can say why the exchange exists and what to do next.                                                | Offer a reachable next question after the takeaway.                                                                                               | Restate another topic, add no information, give away a quiz answer, or leave the goal implicit. Each is a major finding.                | D6, T6, V4             |
| A3  | Relevance         | Answer the player's question or change the situation; every sentence advances the same topic.                                                                                                   | Add a fresh in-world detail that helps the player continue.                                                                                       | Restate another topic, give no new information, reveal a quiz answer, or add unrelated exposition.                                      | N9, A6                 |
| A4  | Length            | Limit each reply to one takeaway; split longer teaching into one node or topic.                                                                                                                 | Keep a reply to 1–2 sentences where the takeaway allows it. Longer replies are acceptable for detailed exposition or an approved character voice. | Write a wall of text or stack several topics or mechanics into one reply.                                                               | N8, A2, A6             |
| A5  | Comprehension     | Let a typical 14–16 learner restate the point, why it matters and the next action; use plain GCSE vocabulary before invented world terms. Never use parser-error phrasing.                      | Gloss the first technical term in apposition.                                                                                                     | Use engine or authoring vocabulary, parser phrases, or lists of lives, resets, progress costs, save behaviour or revision-game framing. | N9, T1, `PCK-DIALOGUE` |
| A6  | Fallback value    | Give a default or catch-all reply a clue, reaction, useful next question or changed stance; repeats add information or change the response.                                                     | Change the character's stance when repetition is likely.                                                                                          | List lives, resets, progress costs, parser commands, save behaviour or revision-game framing.                                           | N9, T1                 |

**Examples.** Two voices on the same topic:

> **The maintenance engineer (blunt, practical):** "Trace table? One row per
> step, in order. I scribble them when the lift plays up."
>
> **The school archivist (precise, gently theatrical):** "A trace table is a
> ledger of the machine's reasoning, row by row. Shall I demonstrate?"

For an unexpected question, the same engineer stays in voice:

> **Pupil:** asks about the weather.
>
> **Engineer:** "Dry enough in here. Ask me about the program, or have a look at
> the board yourself."

Avoid parser-error phrasing ("Error: input not recognised. I don't understand
that"), interchangeable replies from two voices ("An algorithm is a sequence of
steps") and answer leakage ("The answer is B, binary search"). The rule table
governs; these lines only illustrate A1, A3, A5 and A6. For the audience and
shared tone rules, follow
[narrative-principles.md](../content/narrative-principles.md).

### Voice and temperament

NPCs span the full temperament range: brash, rude and wittily sarcastic; warm,
loving and compassionate; characters who present as warm but are cruel and
passive-aggressive; and the exact opposite. There is no quota on inverted
personas, and any target inside the fiction is fair game, including the player's
avatar. Wit is the only limit beyond the harm floor in
[narrative-principles.md §8](../content/narrative-principles.md#8-harm-floor).
An NPC never sneers at the pupil's intelligence or ability.

The **Assistance Ward guide** is a confirmed area-specific voice: the AI's
clipped bureaucracy becomes weary and passive-aggressive, resenting explanations
it considers obvious, speaking of "the pupil" in the third person and treating
independence as an administrative inconvenience. The joke targets its excessive
help and self-importance; the four former pupils stay recoverable people.

Each NPC has a distinct role, voice, motivation and relationship (A1) and may
own at most one recurring phrase. There is no global catchphrase cap: variety
comes from the cast, not a count.

**Example.** "Oh, brilliant. Another student who's read the spec. I'll just
fetch the mop, shall I?" — brash, aimed at the situation rather than the learner.

**Non-example.** "You wouldn't understand this if I drew you a picture." That is
mockery of the learner and barred by the harm floor.

### Dialogue plan metadata (D6)

Priority: P0 · Applies to: NPC authoring metadata · Checked by: `content-critic`

**MUST**

- Keep plans only under `authoring.voiceSamples` on an actor and
  `authoring.dialoguePlan` on a topic ([§8](#8-npc-card-format)).
- Treat a missing or internally contradictory plan as an A2 review finding, not
  a structural validation finding.

**SHOULD**

- Keep each plan beside the artefact it explains.

**MUST NOT**

- Expect the generator to emit these keys; it drops both blocks.

| Authoring field                          | Applies to        | MUST record                                                                        | Review purpose              |
| ---------------------------------------- | ----------------- | ---------------------------------------------------------------------------------- | --------------------------- |
| `authoring.voiceSamples`                 | actor             | Approved tone mode and address form; one sample line; at most one recurring phrase | A1 tone and cover test      |
| `authoring.dialoguePlan.playerQuestion`  | non-default topic | The question the player is expected to ask                                         | A2 question-to-reply match  |
| `authoring.dialoguePlan.intent`          | non-default topic | What the reply is for                                                              | A2 purpose check            |
| `authoring.dialoguePlan.takeaway`        | non-default topic | What the player should understand after the reply                                  | A2, V4 player-outcome check |
| `authoring.dialoguePlan.scopeCheck`      | non-default topic | Where the topic is active and where it is not                                      | T2, T6 scope check          |
| `authoring.dialoguePlan.promptPromise`   | non-default topic | Player wording the prompt advertises                                               | T6 prompt-to-topic trace    |
| `authoring.dialoguePlan.repeatBehaviour` | non-default topic | What happens when the topic is spent or the question repeats                       | A6 fallback check           |

The plan is evidence for review, not a substitute for the response (A2). A
`promptPromise` must satisfy T6 everywhere the prompt can appear.

### Technical conversation rules (T)

T rows prove that the engine can select and deliver the exchange. Apply them
after the A rows; a structurally valid exchange still fails if the player
does not receive the intended line.

| ID  | Concern                    | MUST                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Checked by                                                 | Related IDs                                                                            |
| --- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| T1  | Input resolution           | Every conversational input resolves to a topic or an in-character default ([§3](#3-commands-and-topic-resolution)); prompts surface reachable vocabulary. Parser-error wording is an A5 failure.                                                                                                                                                                                                                                                                                                                                     | `content-critic`, runtime topic selection                  | A5, A6                                                                                 |
| T2  | Knowledge gating and scope | Gate knowledge with `isActive` and `npc-knows`; add a negated second topic when the fact can be found independently ([§4](#4-conversation-flow)). For a lesson ladder, gate the later topic on the earlier beat's evidence and add that evidence as a negated condition on the earlier topic; do not rely on declaration order. Author locality with `in-room`/`in-area`; an unscoped topic is global, and a room-bound actor's catch-all carries the same scope.                                                                    | `content-critic` for scope; `npc-content` for card shape   | A2, D6                                                                                 |
| T3  | Node flow                  | Use a `ConvNode` only for a deliberate teaching beat. Default nodes expire after one turn; `isSticky: true` needs an explicit reason. Conversation ends on `bye`, leaving the room or starting a quiz; there is no turn timeout.                                                                                                                                                                                                                                                                                                     | `content-critic`, `npc-content`                            | A4                                                                                     |
| T4  | Bindings and data shape    | Use the shared `Effect` union and IDs and aliases from the brief and approved cards; never duplicate their vocabulary. Bind every authored topic and node with `actorId`; a global topic is valid only when the brief explicitly asks for one, and the runtime admits an unbound topic as globally reachable. Give every actor an in-character free-text catch-all, keep the ready state silent, mark an unproduced node reserved with a reason, and use only schema-admitted variants. Authoring metadata stays under `authoring:`. | `npc-content`, `content-critic` (D6 placement)             | [shared-rules.md §9](shared-rules.md#9-content-registration), [§8](#8-npc-card-format) |
| T5  | One live free-text target  | Leave at most one non-default `ask`/`tell`/`askTell` topic selectable for any input. Free text reaches the first active topic in declaration order; order and IDs are not specificity rules. Make overlaps mutually exclusive with complementary `isActive` conditions; `ask` and `tell` are one class ([§3](#3-commands-and-topic-resolution)).                                                                                                                                                                                     | `npc-content`, [§10.1](#101-free-text-topic-overlap-proof) | [§3](#3-commands-and-topic-resolution)                                                 |
| T6  | Prompt truthfulness        | Each non-default topic with a D6 `takeaway` carries a `prompt`. A `prompt` advertises only player vocabulary that reaches an active topic in the same state, node and location. It never names an internal ID or promises a room-scoped topic from a global catch-all; a global catch-all prompt is safe wherever the actor can be addressed.                                                                                                                                                                                        | `content-critic`, V4 trace                                 | A2, D6                                                                                 |

## 1. Scope

Conversation is authored as actors, actor states, topics and nodes.
`DialogueSystem` reacts in phase 4, applies topic effects through
`EffectApplier` and returns the resulting events.

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
([§8 "Actor binding"](#8-npc-card-format)): a bound topic is reachable only from
that actor; an unbound topic stays globally reachable. Authored cards bind every
topic and node to an actor; a global topic is valid only when the brief
explicitly asks for one (T4). Room or area locality is not a field on the topic:
use `isActive` with the `in-room` or `in-area` conditions
([shared-rules.md §3](shared-rules.md#3-condition)). A room-bound actor's default
or catch-all topic must carry the same scope (T2). `in-room` and `in-area` match
only the player's current `Position`
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
5. otherwise → `free-text` for topic/default selection. **Unknown topics never
   crash or say "parser error".**

The resolver reads state only; selection owns every gate. A resolved `special`
keyword identifies a candidate, not proof of eligibility. If that candidate is
inactive, selection considers the remaining matching keyword topics in
node-then-actor declaration order, with speaking-actor binding preserved, and
returns the first active eligible topic. While active, the resolved candidate
keeps exact-ID priority over keyword phrase matches.

An exact topic for a declared object phrase wins only while `isActive` is true.
When several topics declare the phrase, a unique actor-bound topic is the exact
match; actor binding, not a topic-ID word, is the tie-break. An inactive,
command-compatible exact topic falls through to normal concrete/default
selection; its effects and use count are untouched. A command-incompatible exact
topic (`ask` versus `tell`) still blocks other concrete topics; an available
default catch-all replies through `speakIdleTopic()` without counting a topic
use. Object resolution requires exactly one declared object ID. Conversation
topic IDs are never player vocabulary: after normalisation, a whole phrase equal
to a catalogue conversation-topic ID is excluded from free-text keyword token
matching and falls through to normal concrete/default selection. It must not
select, rank or promote a topic by ID.

With no resolved target, the **first** active, command-compatible non-default
`ask`/`tell` topic wins in declaration order — node topics before actor topics
([§4](#4-conversation-flow)). Ask and tell are one authoring class for the
overlap proof (T5), but the command check applies on the keyword, object and
free-text paths: an `ask`-only topic cannot answer `tell`, a `tell`-only topic
cannot answer `ask`, and `askTell` accepts both. Content must not rely on a
keyword or an ID word as a tie-break inside that class; two such topics on one
actor must be mutually exclusive in `isActive` (T5). A `command`/`special`
keyword, or a phrase naming one declared object ID, addresses one topic among
several active ask/tell topics.

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
   topic already used by this actor is not selected again, and an exhausted
   `once` default is excluded from the fallback.
3. Only the selected topic reaches response, effect and use-count dispatch. It
   emits its response as `npc-spoke`; its effects are applied through the injected
   `EffectApplier` and the resulting events are returned for the turn's buffer
   ([application-and-ui.md §8](application-and-ui.md#8-behavioural-signatures)).
   `topic-suggested` events carry prompt strings so the UI can show "(You could
   ask why.)". Inactive and unselected topics do not respond, apply effects or
   increment use counts.

   When no topic or default can answer, absence requires unmet mandatory
   positive `in-room` evidence on an actor-bound topic and no matching mandatory
   positive room evidence on any actor-bound topic. `any` alternatives,
   negations and node-only conditions provide no evidence. The flow returns
   `You cannot see that here.` through the canonical `message` effect path.
   `DialogueSystem` may already have applied the actor state's `onEnter` effects
   and set the actor to `talking` during conversation start (step 1); the absence
   branch itself adds no lesson response, topic effects, topic-use increment or
   lesson-state mutation. Actor location is inferred rather than stored on
   `NpcStateDto`.

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
   inventories update atomically, and emit a short in-world transfer message at
   the moment of that effect.

## 5. Conversation nodes

A ConvNode forces a question, which is how the game makes a student engage with
a concept.

- A node has a `defaultTopicId` that keeps the player in the node until a
  `special` topic matches.
- Default nodes last one turn; set `isSticky: true` for a multi-turn exchange.
- `enter-node` starts a node; `exit-node` or leaving the conversation ends it.
- A node's special topics match on keywords from `ParsedCommand` tokens, not on
  resolved object IDs — this is why `TopicResolver` exists.
- Non-default topics with a D6 `takeaway` carry a `prompt`, surfaced through
  `topic-suggested` (T6).

Example shape: after explaining a topic, the NPC enters node `explain-evaluate`;
its special topic `ask why` is active until asked; the default topic repeats the
prompt. Answering correctly applies `learn-topic` and `complete-topic`.

## 6. Link to quiz combat

A topic effect `start-quiz` ([combat](combat.md)) hands the player to an
adversarial quiz. The node is exited first. On `quiz-ended`, the actor returns
to its declared `initialStateId` — there is no pre-quiz state snapshot in
`NpcStateDto`. Content that needs a different post-quiz state applies
`set-actor-state` in the quiz's `onPass`/`onFail` effects. Record the intended
post-quiz state in the brief or the `start-quiz` topic's `authoring.note`.

## 7. State, events and UI

- `GameStateDto.npcs[id]: NpcStateDto` — see
  [storage-schema.md §3.2](storage-schema.md#32-entity-and-system-state).
- The conversation events (`conversation-started`, `npc-spoke`,
  `conversation-ended`, `topic-suggested`) are part of the canonical union in
  [application-and-ui.md §6](application-and-ui.md#6-canonical-event-union-and-rendering).
- `GameWindow` mounts `ConversationPanel` beside `OutputLog` and refreshes it
  from `GameViewData`; the panel renders all text via `textContent` and never
  computes responses.

## 8. NPC card format

`npcs.yaml` holds `actors`, `actorStates`, `conversationTopics` and
`conversationNodes`. The common card conventions are in
[content-toolchain.md §2](content-toolchain.md#2-authoring-format).

```yaml
kind: npc
areaId: 1-2-1-data-representation
status: approved
topicIds: [data-types, number-conversion]

actors:
  - id: npc-archivist
    aliases: [archivist, keeper]
    initialStateId: actorstate-ready
    authoring:
      role: tutor # A1
      voice: clipped, patient # A1
      motivation: ...
      relationship: ...
      voiceSamples: # D6
        toneMode: clipped-patient
        addressForm: second person present
        sampleLine: ...
        recurringPhrase: ... # omit when there is none

actorStates:
  - id: actorstate-ready
    stateDesc: ...
    specialDesc: ...
    # onEnter: [...] # optional; the ready state declares no greeting
    authoring:
      note: Generic default and return state.

conversationTopics:
  - id: topic-fde-explain
    actorId: npc-archivist # binding; omit only for a brief-approved global topic
    match: { kind: askTell, objectIds: [fetch-decode-execute] }
    isActive:
      kind: not
      of:
        {
          kind: npc-knows,
          actorId: npc-archivist,
          topicId: fetch-decode-execute,
        }
    responses:
      - >-
        ... # in-character, N4
    strategy: { kind: once }
    effects:
      - {
          kind: learn-topic,
          actorId: npc-archivist,
          topicId: fetch-decode-execute,
        }
    prompt: (You could ask why.)
    authoring:
      misconception: ...
      dialoguePlan: # A2, D6
        playerQuestion: ...
        intent: ...
        takeaway: ...
        scopeCheck: ...
        promptPromise: ...
        repeatBehaviour: ...

conversationNodes:
  - id: node-fde
    actorId: npc-archivist # authoring-only; the generator drops it
    isSticky: false
    topicIds: [topic-fde-why] # generator resolves these to embedded topics
    defaultTopicId: topic-fde-default
    authoring:
      note: Deliberate one-turn teaching beat (T3).
```

| Concern             | MUST                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Topic vocabulary    | Record `objectIds`, `itemIds` or `keywords` from the brief and approved cards; never duplicate their aliases. Resolve every topic ID to a `## Topic: <id>` heading in `COVERAGE.md` or a declared spec topic; `content-critic` checks conformance with the brief and cards ([§9](#9-reviewer-and-playtest-checks)).                                                                     |
| Actor binding       | Authored topics and nodes carry an `actorId`; a global topic is valid only when the brief asks for one. A topic's `actorId` is emitted and validated; a node's `actorId` is authoring-only and dropped by the generator. Runtime node membership comes from `enter-node` effects; do not work around topic binding with node membership alone ([§3](#3-commands-and-topic-resolution)). |
| Silent greeting     | `actorstate-ready` declares no `onEnter` effects; greetings live in topic responses. The schema admits `onEnter` on other states, but `npc-content` rejects a ready-state greeting.                                                                                                                                                                                                     |
| Reserved nodes      | A node with no `enter-node` producer carries `authoring.reserved: true` and a reason in `authoring.note` or `authoring.reason`. Every `defaultTopicId` belongs to the same actor; a catch-all is an `askTell` topic with empty `objectIds`, whatever its ID. A `defaultTopicId` naming any other shape is ignored at runtime.                                                           |
| Admitted variants   | Use any schema-admitted `TopicMatch`, `Condition`, `Effect` or `ResponseStrategy` kind, including `sequence`; an unused variant is not a finding.                                                                                                                                                                                                                                       |
| Generated node data | Authors write `topicIds`; the generator resolves them into runtime `ConversationNode.topics` in declared order.                                                                                                                                                                                                                                                                         |

## 9. Reviewer and playtest checks

Findings use the format in
[content-critic.md](../../.opencode/agents/content-critic.md). Apply A, T and D6
as written; those tables are the technical and authoring passes. The checks below
cover evidence that the tables cannot carry alone.

`content-critic` MUST:

- Compare each D6 plan with its response; a plan is not evidence that the reply
  delivers the takeaway.
- Check location scope, catch-all scope, conformance with the brief and cards and the
  `npc-content` gate ([§10](#10-structural-validation-gates)); T5 has no
  same-input overlap.
- Check the recorded player takeaway for each key NPC beat in the V4 trace.
- Keep parser-error phrasing and one-takeaway length under A4/A5 and N4/N8.

`content-critic` SHOULD note a cover-test pass that depends on one phrase rather
than a stable voice, where A1 is otherwise satisfied. It MUST NOT accept
`content:validate` as proof of prose, fairness or subject accuracy, and MUST NOT
edit a card or invent course facts.

`pck-reviewer` follows the format and shared tags in
[pck-reviewer.md](../../.opencode/agents/pck-reviewer.md). `PCK-DIALOGUE` is an
authoring comprehension test: a 14–16 learner can restate what an NPC told them,
why it helps and what to do next. Internal mechanics, parser vocabulary and
authoring constraints are not course knowledge; register and comic timing stay
with `content-critic`.

**V4 — walkthrough audit for NPC beats.** Name the natural player wording for
each key beat and check the recorded takeaway against the response, not only the
plan.

**V5 — playtest for NPC-focused areas.** Use ordinary commands, follow prompts
literally and repeat a question to test the fallback. Record whether the player
can restate what they learned and what to do next; SHOULD record the exact
wording that exposed a weak reply for comparison with
`authoring.dialoguePlan.playerQuestion`. The playtest MUST NOT be scripted or
replace the critic's V4 audit.

## 10. Structural validation gates

The `npc-content` gate runs at authoring time in `content:validate` and again
before generation, never against the runtime bundle
([content-toolchain.md §4](content-toolchain.md#4-validation)).

| Gate          | Checks                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npc-content` | Every topic and node `actorId` names a declared actor; a resolving `defaultTopicId` belongs to that actor's topics; node `topicIds` resolve; an unproduced node carries `authoring.reserved: true` with a reason; `actorstate-ready` authors no `onEnter`; T5 overlap ([§10.1](#101-free-text-topic-overlap-proof)). It does not check location or catch-all scope, resolve `itemId`s or keywords, or check aliases against the brief and cards; `content-critic` checks those in [§9](#9-reviewer-and-playtest-checks). |

### 10.1 Free-text topic-overlap proof

This is T5's authoring-time test. The gate compares topics that can receive the
same free-text input: non-default `ask`/`tell`/`askTell` topics and `command`
topics with keywords. `give` pairs with `give` and `show` with `show` only when
their `itemIds` intersect; a give/show topic is never compared with a free-text
topic. A `special` topic is outside T5.

A pair is reported unless `isActive` is provably exclusive. The proof covers
complements of `flag-set`, `npc-knows`, `has-item`, `visited-room`,
`puzzle-solved` and `quiz-passed`, single-valued `in-room`, `in-area`,
`actor-state` and `in-node` literals, and `counter-at-least` ranges, lifted
through `all`, `any` and `not`. A `topic-complete` complement is not proved.

Two topics in one node's `topicIds` are an explicit teaching sequence: the gate
exempts the pair and `content-critic` checks it against the V4 trace. Every
other unproved pair is a finding naming both topic IDs. Non-default ask/tell
topics always overlap for free text, so this is the normal case. The proof
covers structure only; usefulness, tone and comprehension are A tests.

## 11. Agent acceptance for NPC cards

### 11.1 Definition of done

- The brief names the approved tone mode and address form and requires the D6
  dialogue plan ([§8](#8-npc-card-format)).
- Only the named `npcs.yaml` card changed; IDs and aliases come from the brief
  and approved cards and runtime field names match the subsystem docs.
- `content:validate` passes, including the `npc-content` gate and T5 proof
  ([§10](#10-structural-validation-gates)).
- A1–A6, T1–T6 and D6 pass; every reviewer blocker and major is resolved.
- `start-quiz` topics name a real quiz ID and record the expected post-quiz
  state in the brief or the topic's `authoring.note`
  ([§6](#6-link-to-quiz-combat)).
- The final report includes the card path, actor and topic IDs, the
  `content:validate` verdict and flagged assumptions.
- An NPC-focused W7 playtest reports the checks in
  [§9](#9-reviewer-and-playtest-checks) with screenshots to `content-editor`.

### 11.2 Hard constraints and escalation

Return `BLOCKED: <reason> — needs <owner>` rather than guessing when a required
actor ID, topic ID or alias is missing; the brief conflicts with the bible, the
spec or either rule doc; an `actorId` names no declared actor; the silent ready
state gains a greeting; an unentered node has no reserved reason; same-input
topics cannot be proved exclusive; a prompt promises unreachable wording; or a
subject claim is unverifiable.

After a review round, a writer revises only its own card, at most two rounds. A
finding that needs another card, a bible change or an engine change returns
`BLOCKED` to the editor with the owning agent named.
