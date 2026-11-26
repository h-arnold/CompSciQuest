---
type: "query"
date: "2026-11-26T16:50:58.085150+00:00"
question: "Revision 1: how to make the documented talk-to syntax resolvable and remove the literal ? alias from Parser.ts without inventing aliases?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Parser.ts,COMMAND_TABLE,HYPHENATED_VERBS,hyphenatedVerb(),isPunctuationAlias,PUNCTUATION_ALIASES,SINGLE_ALIASES,parseRaw()"]
---

# Q: Revision 1: how to make the documented talk-to syntax resolvable and remove the literal ? alias from Parser.ts without inventing aliases?

## Answer

Derived HYPHENATED_VERBS from COMMAND_TABLE verbs containing a hyphen; hyphenatedVerb() matches the literal prefix before alias lookup and consumes the remainder, so talk-to guide resolves while talk to guide is unchanged. Added a shared isPunctuationAlias predicate used by both PUNCTUATION_ALIASES and SINGLE_ALIASES, removing the literal ? from Parser.ts.

## Outcome

- Signal: useful

## Source Nodes

- Parser.ts,COMMAND_TABLE,HYPHENATED_VERBS,hyphenatedVerb(),isPunctuationAlias,PUNCTUATION_ALIASES,SINGLE_ALIASES,parseRaw()