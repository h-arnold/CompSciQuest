---
type: "query"
date: "2026-11-25T08:26:27.493022+00:00"
question: "Do the revision-1 helpers bypass validateContent(), finding() or collection()?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["validateCards()", "sharedFindings()", "validateContent()", "finding()"]
---

# Q: Do the revision-1 helpers bypass validateContent(), finding() or collection()?

## Answer

No. validateCards() still calls sharedFindings() -> validateContent() as an EXTRACTED path; all new findings go through finding(); area/exit adapters reuse collection()/asRecord()/asText(). Bypass grep for exit['to'], todo placeholders and '## Topic:' found only the owning helpers.

## Outcome

- Signal: useful

## Source Nodes

- validateCards()
- sharedFindings()
- validateContent()
- finding()