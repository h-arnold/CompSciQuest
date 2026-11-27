# Writer agent and contract document pattern

Content writing uses three layers: a thin agent file that carries workflow, one
contract document per content kind that owns every rule for that kind, and
cross-cutting documents that hold only rules shared by all writers. This doc
owns that structure and its templates; the
[documentation style guide](documentation-style-guide.md) owns general writing
and ownership rules.

## The three layers

| Layer            | Location                              | Owns                                                                                                                                                          |
| ---------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Agent file       | `.opencode/agents/<kind>-writer.md`   | Workflow passes, short operational checklists of rules that bear repeating, the mandatory-reading pointer, the final report and the escalation pointer.       |
| Contract doc     | `docs/developer/<kind>.md`            | Every authoring and technical rule for the kind, card format, gates, reviewer checks, definition of done and hard constraints. The single source of truth.   |
| Cross-cutting    | `content-rules.md`, `narrative-principles.md` | Rules and guidance that apply to all writing and all agents.                                                                                          |

An agent file never restates a rule table, a research section or a worked
example. It names the rule ID and links to the owning section. If a line in an
agent file would still be true when shortened to a link, shorten it.

## Mandatory reading

A writer reads its contract document **in full before any other action**. The
brief supplies workflow and a short operational checklist; it never replaces
the contract doc. After the contract doc, the writer reads only the named
cross-cutting sections, the bible, any difficulty document named by its kind,
and the brief. Every writer names the same order in its agent file.

Authoring rules come first in each contract doc: the reader starts with the
exchange, scene or mechanic the player should experience, then meets the
technical contract that delivers it. Code and data tables serve the narrative;
they do not define it.

## Writer agent template

Keep this shape and keep it short. The contract doc holds the detail.

```md
---
description: "<one line>"
mode: subagent
permissions: <unchanged deny/allow block for one YAML card>
---

You are the <kind> writer for CompSciQuest. <One sentence of role.>

**Mandatory reading.** Before any other action, read `<contract doc>` in full.
It owns every <kind> content and technical rule; this brief adds only workflow
and a short operational checklist and never replaces the document. Then read
<cross-cutting sections>, <bible>, <difficulty doc where relevant> and the
brief. The output path is given in the brief and always ends in `<file>.yaml`.
Write only that file. Use block scalars for prose, keep authoring metadata under
`authoring:`, and never edit the schema, validator, generator or generated
TypeScript.

Rules you own: <rule IDs> in `<contract doc>`, plus <shared IDs> in
`content-rules.md`. Work in two passes: author the <thing>, then implement it.

## Pass 1 — author the <thing>

<Numbered steps that point to the contract doc's authoring sections.>

## Pass 2 — implement the <thing>

<Short bullets naming only the crucial rules that bear repeating, each with an
anchor link to the full rule.>

## Finish

Use the [definition of done](<contract doc anchor>). <Report contents.>

## Constraints and escalation

<Agent-specific hard limits.> For every other blocker and for the review loop,
follow <contract doc escalation anchor>: return `BLOCKED: <reason> — needs
<owner>` rather than guessing, revise only your own card for at most two rounds,
then escalate to the editor with the owning agent named.
```

## Contract document template

Keep the runtime contract intact but lead with the authoring rules.

```md
# <Kind>

<One or two sentences: what the kind is and what this document owns. State that
the <kind> writer must read it in full and that the agent brief is only a
workflow checklist. Give a rule map of anchors.>

## Write the <thing> first

<Authoring rule table: ID, test, MUST, SHOULD, MUST NOT, related IDs. Follow it
with a short example and non-example.>

## <Metadata or card-shape rules owned by this kind>

## 1. Scope
## 2. Model
<Existing numbered runtime sections stay in place.>

## <next number>. Card format
## <next number>. Reviewer and playtest checks
## <next number>. Structural validation gates
## <next number>. Agent acceptance
### <next number>.1 Definition of done
### <next number>.2 Hard constraints and escalation
```

## Keep one owner per rule

The full statement of a rule lives in one doc. Where another doc needs the rule,
it names the ID and links to the owner. Rule IDs are stable when a rule moves:
update the
[rule index](content-rules.md#3-rule-catalogue), the writer's mandatory-reading
list and every link that cited the old location. Cross-cutting docs gain no
kind-specific detail, and contract docs gain no rule that applies to every
kind.
