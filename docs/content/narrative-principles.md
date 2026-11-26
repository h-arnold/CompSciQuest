# Narrative principles

**Status: approved 2026-11-24 by the user.** This is a living document maintained
by the content editor. The tone guide in `content-bible.md` points here, and writer
briefs cite it as settled authority. The editor adds to the pattern log (§11) as the
story develops; only `confirmed` entries influence writing.

## 1. Purpose and authority

- These principles govern voice, humour, stakes and consequences in all game
  text. They are not game content: no design cards and no TypeScript live here.
- The rulebook `docs/developer/content-rules.md` remains authoritative for the
  N/P/C/H/D rules. If a principle and a rule disagree, the rulebook wins and the
  editor escalates rather than quietly choosing one.
- `docs/exam-specs/wjec-unit1.md` remains the authority for every course fact.
  Humour never changes a definition, an example, a number or a spec depth
  ("should know" versus "should be aware of"). A joke that teaches a wrong fact
  is a `PCK-ACC` blocker, not a gag.

## 2. Register and technical language

- Use the full, precise technical term from the Unit 1 teacher guidance. On its
  **first use** pair it with a short plain-English gloss in apposition; after
  that the term stands alone.
- Adopt the similar voice to Terry Prattchett or Douglas Adams. Short, and punchy but with a certain amount of flair.
- Keep second person, present tense and one consistent register (N4). Room
  descriptions stay at or under 200 words (N8) — a ceiling, not a target. Most
  rooms should be shorter; longer passages are for key nodes and NPC teaching
  beats only.
- Avoid repetition of sentence structures or writing effects. Especially cliches such as:
  - It's not x it y.
  - Repetitions of what something is not. This is appropriate when used sparingly.
- Technical language and plain language are not in competition: the term carries
  the marks, the gloss carries the meaning, and neither is padded out.
- **A world term rides with the formal term (added by user instruction, 2026-11-25).**
  On first use, pair the world's name for a thing with the technical term it carries —
  "the rogue thread — the **rogue value**, the mill's name for it — reads −1". After the
  pairing, either may lead, but quizzes, hint targets and coverage evidence always use
  the formal term, so the world never becomes the only route to the marks.
- **Craft and cultural vocabulary is explained in passing (added by user instruction,
  2026-11-25).** Where a pupil may reasonably not know the word — warp, weft, shed,
  selvedge, heddle, carthen, paned — the area, the items and the NPC conversations
  give a short in-voice explanation on first use: one clause, deadpan, never a lesson
  (N8 discipline still applies). The explanation never displaces a technical term and
  never becomes the joke.

**Example:** "The fetch–decode–execute cycle — fetch an instruction, decode it,
then carry it out — has stalled mid-step. The control unit is still pointing at
the same empty slot."

**Non-example:** "The FDE cycle is sort of like a tiny assembly line in the brain
of the computer, if you think about it." The shorthand is imprecise, the gloss
never names the formal term and the sentence eats space without teaching.

**World richness and examinables (confirmed 2026-11-25).** The user wants a rich,
engaging world: a room description should name several concrete things worth
looking at, and some items may exist purely to be examined, with no puzzle or story
work to do. Such an item earns its place through a vivid, specific description. It
must not obscure a gate clue, use an unregistered noun, or imply that it is
required. Every new ID and alias still needs editor allocation and user approval
(D2, bible §9); decorative items are never scoreable and never gate progress.
Set `portable` from real-world plausibility — fixed scenery stays put, small props
can be carried — and expect a refused `TAKE` to answer in world (N5), never with a
parser-style denial. The confirmed "Presence, not labels" pattern in §11 is the
method for naming them.

## 3. Comic mode

- The world is whimsical and slightly absurd. Monty Python, Terry Pratchett and
  *Futurama* are the compass for timing, staging and tone.
- Ridiculous, over-the-top cartoon violence is encouraged and expected. The
  ceiling is a Looney Tunes gag: improbable, elastic and consequence-free beyond
  the joke itself. Nothing approaches realistic injury or suffering.
- Favour exaggerated reactions, improbable machinery and daftness delivered
  deadpan. The fun is in the situation, not in a pun that stops the story to
  congratulate itself.

**Example:** "The printer has developed opinions. It prints one sheet, eats the
next, and burps a cloud of toner at anyone who calls it a peripheral device."

**Non-example:** A lingering description of a creature in pain, or a "joke" that
depends on a real person's suffering. If it would not sit comfortably in a
cartoon, it does not go in the game.

## 4. Stakes and difficulty

- Challenges carry real jeopardy. They must not be too easy, and the outcome
  must never feel bland or anodyne. Failure stings.
- **Hard means reasoning, not obscurity.** Difficulty comes from applying
  knowledge — AO2 and AO3 thinking — never from hiding information the player
  could not reasonably find.
- Fairness still holds: two discoverable clues on every gate (N6), hint ladders
  that nudge rather than reveal (H2/H3), unlimited retries and no timer (P5).
  A challenge is hard because it asks the player to think, not because it lies.
- Failure costs a life and a comic indignity. It never resets topic or puzzle
  progress (P5, H1).

**Example:** A puzzle asks the player to route a signal through the correct bus
using two clues found earlier; getting it wrong costs a life and sends them back
to the level start wiser than before.

**Non-example:** A locked exit whose clue is a single word buried in the third
sentence of a room the player has no reason to revisit. That is obscurity, and
N6 forbids it.

## 5. Consequences

- `change-lives` is the only mechanical harm. The comic trimmings below are
  flavour unless a joke item is explicitly lost.
- **Save games:** a save game may be threatened, shattered or "deleted" only as
  an in-fiction prop. `compsciquest:save:v1` is fixed by `content-rules.md` §8 and
  is never touched. A "save crystal" can break; the real save cannot.
- **Comic Sans MS:** a valid and welcome casualty, described in prose only. There
  is no HTML or CSS, so the font can be a cursed cartridge, a cursed poster or a
  villain, but it is never actually rendered.
- **Joke items:** a dedicated expendable item may genuinely be removed from
  inventory with `remove-item`, provided it is registered as expendable in the
  bible, is required by no puzzle and its loss cannot strand the player.
- **Cute animals:** peril is cartoonish and reversible. H1 forbids lasting harm,
  so a duck can explode into glitter and be perfectly fine in the next room.

**Example:** "The Comic Sans cartridge cracks. A small puff of pink smoke escapes
and the caretaker mutters something unrepeatable. You are back at the lab door,
one life lighter, with every puzzle exactly as you left it."

**Non-example:** "Your save has been permanently deleted. Start again." That is
not a cartoon consequence; it is a broken promise and a direct breach of §8.

## 6. Absurd options

- Absurd options are occasionally presented to the player. The editor decides
  when and how often, and coordinates them across areas; there is no fixed
  quota. They are comic detours, not mandatory gates.
- **Do not flag them.** The choice is written in ordinary in-world language,
  using verbs and nouns from the agreed registry, with no warning label and no
  "are you sure?". The absurdity must be obvious from the option itself. If a
  reader cannot tell it is ridiculous, rewrite the option — do not annotate it.
- Choosing one costs a life and triggers a severe, hilarious but bounded
  comeuppance. "Severe" means maximum comic indignity, not maximum mechanical
  loss. H1 and P5 still apply: no progress loss, no real save damage, no puzzle
  phase reset.
- The punishment is delivered entirely in-world, by a character or the
  situation (§9).

**Example:** Among three ordinary exits there is a biscuit tin with a handle
labelled ABSOLUTE UNIT. Taking it leads to a spectacular, entirely deserved
Humiliation involving a mop and a very unimpressed caretaker, and a life lost.

**Non-example:** "Warning: the following option is a joke. Do not choose it."
That removes the joke. Equally bad is an absurd option built from an
unregistered noun, which turns it into the guess-the-noun trap N6 forbids.

## 7. NPCs and voice

- NPCs span the full temperament range: brash, rude and wittily sarcastic;
  warm, loving and compassionate; characters who present as warm but are cruel
  and passive-aggressive; and the exact opposite. There is no quota on inverted
  personas.
- Any target inside the fiction is fair game, including the player's character.
  Wit is the only limit beyond the harm floor (§8).
- The harm floor still forbids **mockery of the learner**. An NPC may be rude to
  the player's avatar; it never sneers at the pupil's intelligence or ability.
- Each NPC has a distinct role, voice, motivation and relationship (C1) and may
  own **at most one recurring phrase**. There is no global catchphrase cap:
  variety comes from the cast, not from a count.
- Every conversational input still resolves to an in-character reply (C2), and
  teaching beats stay diegetic (N3).

**Example:** "Oh, brilliant. Another student who's read the spec. I'll just fetch
the mop, shall I?" — brash, rude, and aimed at the situation rather than the
learner.

**Non-example:** "You wouldn't understand this if I drew you a picture." That is
mockery of the learner and is barred by the harm floor.

## 8. Harm floor

- No sexual content; no slurs; no gore or realistic cruelty; no real-world
  atrocity gags; no mockery of the learner; and no use of Welsh language or
  culture as the target of a joke.
- Peril falls on fictional creatures, objects and the player's cartoon avatar —
  never on the reader.
- This floor overrides every other principle in this document, including the
  "no limit" on NPC targets in §7.

## 9. Fourth wall

- The world is fully self-contained. Characters never comment on the parser, the
  save file, the engine, the score panel or the fact that this is a revision
  game.
- Even absurd-option punishments stay in-world (§6). A character may be
  humiliated by the situation; the reader is never addressed.
- This sits alongside C2: no "parser error" phrasing and no out-of-character
  defaults.

**Non-example:** "Nice try — the author never planned for that." Fun in a
different game; forbidden here.

## 10. Welsh references

- Weave subtle Welsh references into the world where appropriate: place and
  character names, turns of phrase and small cultural details. Sprinkle them
  across areas; one area may carry more if the premise supports it.
- Keep them accurate and unobtrusive. They enrich the setting; they are not a
  lesson, an exotic prop or the punchline of a joke (§8).
- A Welsh detail never displaces a formal technical term. The spec remains the
  authority for all course facts.

**Example:** A caretaker greets the player with a cheerful "Bore da" before
getting on with the actual business of the room.

**Non-example:** A Welsh-speaking character who exists only to be mocked for
how they talk.

## 11. Pattern log (living)

The editor records themes, trends and patterns the user likes so they can be
reused deliberately. An entry is added when something recurs and the user has
reacted positively to it — never on the strength of a single hunch.

Each entry carries a status, a first-noticed location, why it works, an example,
a non-example and the briefs it should inform:

```md
### <pattern name>
- Status: provisional | confirmed
- First noticed in: <card path or batch>
- Why it works: <one or two sentences>
- Example: <accepted text or device>
- Non-example: <what went wrong when it was overdone>
- Use in: <brief IDs or areas>
```

`provisional` entries are observations only and do not drive briefs. `confirmed`
entries are cited in writer briefs alongside the relevant rule IDs. The editor
reviews the log after each approved batch and asks the user to confirm anything
worth promoting.

### Flair before the fact

- Status: confirmed (user approved the full-scope tone revision, 2026-11-25)
- First noticed in: `hints.yaml`, against arrival and NPC prose written under the
  superseded "short, simple and punchy" wording.
- Why it works: one concrete sensory or character beat before the technical payload
  gives the reader a reason to stay; the term still carries the marks and the gloss
  still carries the meaning (§2). It also stops the "not X, but Y" frame becoming
  the world's default rhythm.
- Example: "An east route glows. It has the air of a clerk who has stamped the
  form." — replaces "not a screen, not a voice, but..." and "not a door" in
  `room-arrival`.
- Non-example: "It offers an east route, not a door." / "The machine offers routes
  through the work, not around it." — the contrast does all the work and the scene
  stays flat.
- Use in: every tone-revision brief issued 2026-11-25, and all later room, NPC and
  quiz-message prose.

### Presence, not labels

- Status: confirmed (user approved the room briefs and this document's update,
  2026-11-25)
- First noticed in: seven Switchyard rooms whose resident item or NPC was absent
  from the room description, including `room-switch-floor` and `room-hex-deck`.
- Why it works: `describeRoom()` emits only the room title and description, so the
  prose is the player's only in-world way to find an interactable. A registered noun
  in a physical clause, and an NPC doing something in the scene, make them
  discoverable without a menu or an out-of-character label.
- Example: "A brass gauge hangs by the belt, needle at red. The foreman checks the
  clicks." — the player has two things to try, with no "Items here" line.
- Non-example: "Items here: switch gauge, foreman. You can talk to the foreman."
  That is a labelled inventory, not a world (N3, §9).
- Use in: all three rooms briefs in the 2026-11-25 revision. Keep H1 telegraph
  strings and N6 clue strings byte-identical. N8's ceiling is now 200 words, a
  limit rather than a target: write as much as the place needs, not as much as it
  will hold.

## 12. Change control

- This document was `draft` until the user approved it on 2026-11-24. Writer briefs
  cite it as settled authority from that date.
- Approved principles are changed only with the user's agreement. Record each
  change as a dated note below with the reason.
- Pattern log entries (§11) may be added by the editor between approvals; only
  `confirmed` entries influence writing.

### Change log

- 2026-11-24 — Initial draft from the agreed principles: register, comic mode,
  stakes, consequences, absurd options, NPCs, harm floor, fourth wall and Welsh
  references.
- 2026-11-24 — **Approved by the user.** Sign-off recorded; the document is now
  settled authority for writer briefs. No principle text changed.
- 2026-11-25 — **§2 amendment recorded retroactively.** The user replaced the old
  "Everything else is short, simple and punchy. No waffle..." instruction with the
  Pratchett/Adams line ("Short, and punchy but with a certain amount of flair") and
  added a warning against repeated "not X, but Y" constructions and other repeated
  effects (commit 3a8478f). §12 requires each change to be logged; this note closes
  that gap. No rule ID changed.
- 2026-11-25 — **Full-scope tone revision approved.** After the editor showed
  before/after examples, the user chose "Everything built so far". Ten prose-bearing
  YAML cards are re-briefed; `spec-topics.yaml` is evidence metadata and is excluded.
  IDs, aliases, flags, gates, scores, spec facts, the two N6 clues per gate and the
  H1 telegraph strings are frozen. Briefs cite N4, N5, N8, C1, C2, N3, P2, H1 and N6.
- 2026-11-25 — **N8 ceiling raised from 80 to 200 words by the user**, with an
  explicit instruction that 200 is a limit, not a target. §2, the pattern log and
  downstream agent instructions were updated the same day. Existing descriptions,
  all under 80 words, stay valid; no re-brief is triggered by the change alone.
- 2026-11-25 — **World-term pairing and craft/cultural glossing added to §2 by user
  instruction** (during Zone A, The Pattern Mill scoping): world terms pair with the
  formal terms on first use (rogue thread = rogue value); weaving and Welsh vocabulary
  (warp, weft, shed, selvedge, carthen, paned) each get a short in-voice explanation
  where a pupil may reasonably not know the word. Quizzes and evidence always use the
  formal term. The Zone A topic file carries the glossary list; the bible's tone guide
  records the same instruction.
- 2026-11-25 — **World richness and examinables approved.** The user asked for vivid
  descriptions and "lots of items to examine", including props with no puzzle or
  story function. Added to §2 and the confirmed "Presence, not labels" pattern in
  §11. Room briefs are paused pending user approval of new item IDs and aliases
  (D2, bible §9); no writer has been dispatched with unregistered nouns.
