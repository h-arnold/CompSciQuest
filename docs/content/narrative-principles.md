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
- Everything else is short, simple and punchy. No waffle, no throat-clearing and
  no paragraph that restates the previous one. A player should never have to wade
  through prose to find out what is happening.
- Keep second person, present tense and one consistent register (N4). Room
  descriptions stay at or under 80 words (N8); longer passages are for key nodes
  and NPC teaching beats only.
- Technical language and plain language are not in competition: the term carries
  the marks, the gloss carries the meaning, and neither is padded out.

**Example:** "The fetch–decode–execute cycle — fetch an instruction, decode it,
then carry it out — has stalled mid-step. The control unit is still pointing at
the same empty slot."

**Non-example:** "The FDE cycle is sort of like a tiny assembly line in the brain
of the computer, if you think about it." The shorthand is imprecise, the gloss
never names the formal term and the sentence eats space without teaching.

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
