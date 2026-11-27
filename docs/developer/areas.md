# Areas, rooms and items

Areas hold the rooms, exits and items the player explores. This document owns
the authoring rules for that content: the scene the player should experience
comes first, and the runtime contract serves it. The `area-writer` must read it
in full before beginning work; its agent brief is only a workflow checklist.
Rules are cited by ID from their owning documents; the W1–W7 workflow lives in
[content-editor.md](../../.opencode/agents/content-editor.md). [Narrative
principles](../content/narrative-principles.md) owns the shared voice, harm floor
and confirmed prose patterns.

Rule map: [write the room first](#write-the-room-first),
[card format](#7-card-format),
[review checks](#8-reviewer-and-playtest-checks) and
[acceptance](#9-agent-acceptance).

## Write the room first

A room is a place a pupil can picture, move through and act in. Draft the
description and the affordances before writing exits, flags or `topicIds`; those
fields must serve the scene. The MUST/SHOULD/MUST NOT labels and finding severity
are defined under [review labels](content-toolchain.md#review-labels).

Apply the rules in this reading order: N4/N5; N8; N6; N1/N2; D2/D3/D4. Resolve
a conflict in favour of the rule earlier in that order.

| ID  | Test                   | MUST                                                                                                                                                                                           | SHOULD                                                                                                                                                             | MUST NOT                                                                   | Related |
| --- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ------- |
| N4  | Voice                  | Write in second person, present tense and the bible's register. Failure text, refusals and unmatched commands stay in voice.                                                                   | Give each room one concrete image rather than a stack of adjectives; bind each exit to a named landmark and keep a room's description stable across state changes. | Use first person, past tense, or a labelled inventory in place of a scene. | N5, A1  |
| N5  | Feedback for every act | Give every submitted command text with new information: a clue, a sensory detail or a character reaction.                                                                                      | Make a wrong-target `use` answer in world and point back to a clue.                                                                                                | Write a bare "you can't", "nothing happens" or parser-style refusal.       | N4      |
| N8  | Prose length           | Keep each room description to at most two paragraphs.                                                                                                                                          | Aim for 200–300 words as the usual case; go longer only where extra detail is warranted to describe the area accurately and enjoyably.                             | Pad a room to hit a word count or write a wall of text in a key node.      | N4      |
| N6  | Fair gates             | Give each locked exit an in-fiction justification and at least two clues discoverable before the gate is needed, placed in room, item or NPC text. Use only agreed verbs and registered nouns. | Put a clue where the player naturally looks next to the blocker.                                                                                                   | Build a maze, a guess-the-verb trap or a guess-the-noun trap.              | N7, D2  |
| D2  | Registry               | Take every ID and alias from the bible registry; propose new ones for editor approval.                                                                                                         | Group aliases with the artefact they name.                                                                                                                         | Reuse an alias from another area or invent an id outside the brief.        | D1      |
| D3  | Runtime shape          | Use the exact field names from [application-and-ui.md §3.2](application-and-ui.md#32-world-area-room-and-item-definitions); omit optional fields. Prose uses block scalars.                    | Set `portable` from real-world plausibility.                                                                                                                       | Set `null` or `undefined` on an optional field, or author `roomIds`.       | D4      |
| D4  | Authoring metadata     | Keep `interesting`, `useNotes`, `topicIds` and clues under `authoring:`.                                                                                                                       | State in `useNotes` which action sets which flag.                                                                                                                  | Expect authoring keys to reach the runtime bundle.                         | D3      |

**Example — a gate with two placed clues.** The notice reads "Storfa — staff
only" and a sticky key is pinned beside it; `EXAMINE key` says it fits the
cupboard; `USE key on cupboard` sets `store-open`, the gate's requirement. The
player has two things to try without a menu label.

**Non-example — a labelled inventory.** "Items here: switch gauge, foreman. You
can talk to the foreman." That names interactables out of character and breaks
N3. Give the gauge a physical clause and the foreman an action instead.

### World richness and examinables

A room description should name several concrete things worth looking at. Some
items exist only to be examined: they earn their place with a vivid, specific
description and must not obscure a gate clue, use an unregistered noun or imply
they are required (D2, N6). Decorative items are never scoreable and never gate
progress. Set `portable` from real-world plausibility — fixed scenery stays put,
small props can be carried — and answer a refused `TAKE` in world (N5), never
with a parser-style denial.

### Confirmed patterns

The two patterns below are confirmed in
[narrative principles §11](../content/narrative-principles.md#11-pattern-log-living)
and must be applied in room briefs.

- **Flair before the fact.** Give one concrete sensory or character beat before
  the technical payload, so the reader has a reason to stay.
- **Presence, not labels.** `describeRoom()` emits only the title and
  description, so prose is the only in-world route to an interactable. Name a
  registered noun in a physical clause and show an NPC doing something in the
  scene; never add an "Items here" line. Keep H1 telegraph strings and N6 clue
  strings byte-identical when a room is re-briefed.

## 1. Scope

Room content is authored as an `AreaDefinition`, at most one `WorldDefinition`,
and collections of `RoomDefinition` and `ItemDefinition`. Movement gates are
`Exit.preconditions`; flags come from player actions. The runtime contract and
canonical shapes live in
[application-and-ui.md §3.2](application-and-ui.md#32-world-area-room-and-item-definitions)
and are not restated here.

## 2. Ownership and worlds

An artefact belongs in the card of the area that uses it
([bible §4.2](../content/content-bible.md#42-card-ownership-by-area--user-directed-structure)),
never in an unrelated area for convenience. A world is declared exactly once,
in the area whose `startAreaId` names it; other areas in that world set only
`definition.worldId`. `AreaDefinition.roomIds` is derived from room declaration
order and is never authored.

## 3. Exits and items

Exits use the direction vocabulary in
[application-and-ui.md §5](application-and-ui.md#5-canonical-command-union-and-verbs)
and targets from the registry. Conditions use only the shared `Condition` union
([shared-rules.md §3](shared-rules.md#3-condition)). Item `initialRoom` is the
starting owner; afterwards ownership lives on Player, NPC or Room state.
`refusalText` is optional and omitted when the default refusal is enough.

## 4. Reading and scoring

Room `topicIds` are authoring references used by the gates and coverage mapping;
the generator does not copy them into `RoomDefinition`. A room scores on first
visit through its own `score`; authors declare the value but never award it
([application-and-ui.md §10](application-and-ui.md#10-scoring-with-many-puzzles-per-topic)).

## 5. Integration points

- **Hazards** return the player to `definition.startRoomId` ([hazards](hazards.md)).
- **Quizzes** use the same level start on failure ([combat](combat.md)).
- **Puzzles** depend on action-set flags, so `useNotes` must name the producing
  action ([puzzles](puzzles.md)).
- **NPCs** may be named in a room description; their prose is owned by
  [npcs.md](npcs.md).

## 6. Gates

`content-ids`, `world-graph` and `score-content` check unique IDs and aliases,
resolving exits and start rooms, one world declaration, reachability and score
budgets ([content-toolchain.md §4](content-toolchain.md#4-validation)).
`interactionShapeProblems()` checks interaction and scenery shape against both
raw cards and the generated bundle. Target existence stays with `content-ids`.

## 7. Card format

`rooms.yaml` holds the area `definition`, at most one `worlds` entry, and the
`rooms` and `items` collections. One file per area; an artefact goes in the card
of the area that uses it. This is a partial excerpt; generation is owned by
[content-toolchain.md](content-toolchain.md).

```yaml
kind: area
areaId: 1-1-computer-architecture
status: draft
topicIds: [cpu-components, fetch-decode-execute]

definition:
  id: area-1-1-computer-architecture
  worldId: world-1-computer-architecture
  name: Computer Architecture
  startRoomId: room-cpu-lab # runtime level start for hazards and quiz failures
  lives: 3

worlds:
  - id: world-1-computer-architecture
    name: Computer Architecture
    areaIds: [area-1-1-computer-architecture]
    startAreaId: area-1-1-computer-architecture
    lives: 3

rooms:
  - id: room-cpu-lab
    title: The CPU Lab
    aliases: [lab, cpu lab] # authoring-only; the generator drops room aliases
    description: >-
      ... # at most two paragraphs, usually 200–300 words, second person present (N4, N8)
    topicIds: [cpu-components]
    exits:
      - direction: north
        to: room-memory-vault
      - direction: west
        to: room-bus-way
        conditions:
          - { kind: flag-set, flag: bus-mapped }
    score: 0 # first-visit award; 0 when not scoreable
    authoring:
      interesting: The sensory and affordance hook.

items:
  - id: item-register-cache
    name: register cache
    aliases: [cache, registers]
    portable: true
    # refusalText: ... # optional; omit when absent or empty
    description: >-
      ...
    initialRoom: room-cpu-lab # starting owner; ownership is a Player/NPC/Room property
    authoring:
      useNotes: Which action sets which flag.
```

## 8. Reviewer and playtest checks

`content-critic` applies the table above, checks that every gate has two clues
placed where the player can find them, and verifies the V4 trace names every
room and exit. `pck-reviewer` checks course facts and GCSE reading load only.
`play-tester` confirms in W7 that clue locations are discoverable and that no
room relies on a label or a guess-the-noun trap.

## 9. Agent acceptance

### 9.1 Definition of done

- Only `rooms.yaml` changed; document metadata is valid and every artefact is
  an entry in `definition`, `rooms` or `items` (and `worlds` where the area owns
  the world).
- Each room has an id, title, second-person present-tense block-scalar
  description of at most two paragraphs, usually 200–300 words unless extra
  detail is warranted, registry aliases, `authoring.interesting`, at least one
  `topicIds` entry (or `navigation-only`), and exits whose directions and
  targets exist; optional fields are omitted.
- Every gate names at least two discoverable clue placements; no maze and no
  guess-the-verb or guess-the-noun trap.
- `definition.startRoomId` is declared once and names an existing room; there is
  no `levelStart` key.
- Every item sets `portable` by real-world plausibility and records in
  `authoring.useNotes` the action that sets its flag; decorative items say so.
  `refusalText` appears only where it adds in-world refusal text.
- The final report names the file path, room and topic IDs, flagged assumptions
  and every proposed extra item with its ID, aliases and `portable` value.

### 9.2 Hard constraints and escalation

Return `BLOCKED: <reason> — needs <owner>` rather than guessing when a gate needs
a door or exit absent from the bible, a clue belongs in another writer's card,
an exit target is missing, a topic ID is not in `COVERAGE.md`, or an extra item
needs an unratified ID or alias. After a review round, revise only your own card
for at most two rounds; then return `BLOCKED: <finding> requires <owner>` and
let the editor resolve it.
