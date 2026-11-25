---
type: "query"
date: "2026-11-25T09:58:09.714246+00:00"
question: "Why do C-CONTENT-12/17 fail after C3 generation when validate(loadContent(), COVERAGE_TOPIC_IDS) is called?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["COVERAGE_TOPIC_IDS,validateContent(),coverageProblems(),specTopicsOf(),topicHeadings(),ZONE1_COVERAGE_HEADINGS,ZONE1_SPEC_TOPIC_IDS,CoverageGates.test.ts"]
---

# Q: Why do C-CONTENT-12/17 fail after C3 generation when validate(loadContent(), COVERAGE_TOPIC_IDS) is called?

## Answer

Canonical nodes: COVERAGE_TOPIC_IDS at tests/fixtures/content.ts:L28 is a test-fixture placeholder; validateContent() at src/content/validateContent.ts:L246 with coverageProblems() at L225 and specTopicsOf() at L146 rejects spec topic IDs absent from the injected coverage index; topicHeadings() at tools/content/gates/common.ts:L176 extracts '## Topic:' headings; ZONE1_COVERAGE_HEADINGS/ZONE1_SPEC_TOPIC_IDS at tests/fixtures/zone1.ts:L25/L74 and CoverageGates.test.ts at L1 are the consumers to update.

## Outcome

- Signal: useful

## Source Nodes

- COVERAGE_TOPIC_IDS,validateContent(),coverageProblems(),specTopicsOf(),topicHeadings(),ZONE1_COVERAGE_HEADINGS,ZONE1_SPEC_TOPIC_IDS,CoverageGates.test.ts