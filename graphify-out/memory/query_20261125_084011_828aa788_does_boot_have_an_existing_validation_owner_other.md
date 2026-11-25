---
type: "query"
date: "2026-11-25T08:40:11.631855+00:00"
question: "Does boot have an existing validation owner other than validateContent(), and where do LoadFailureReason copy and quarantine live?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["validateContent(),Bootstrap (src/main.ts),LoadFailureReason,QuarantineDto,SaveManager"]
---

# Q: Does boot have an existing validation owner other than validateContent(), and where do LoadFailureReason copy and quarantine live?

## Answer

Boot reuses validateContent() at src/content/validateContent.ts:L246 (one-argument form). LoadFailureReason is canonical at src/application/SaveDto.ts:L10; QuarantineDto at src/application/QuarantineDto.ts:L4; quarantine key is a storage-schema.md §9 literal also used privately in SaveManager. No existing UI copy table or quarantine download owner exists.

## Outcome

- Signal: useful

## Source Nodes

- validateContent(),Bootstrap (src/main.ts),LoadFailureReason,QuarantineDto,SaveManager