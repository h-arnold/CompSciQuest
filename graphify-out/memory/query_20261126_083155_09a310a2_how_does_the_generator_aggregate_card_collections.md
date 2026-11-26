---
type: "query"
date: "2026-11-26T08:31:55.017274+00:00"
question: "How does the generator aggregate card collections and validate coverage headings, and which fixture helpers mirror that order?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["generateContent(),collectCard(),collectTopics(),normalisedCards(),topicHeadings(),coverageIds(),checkContentIds(),parseCardSet(),expectedZone1Ids(),allIds(),GENERATED_PATHS"]
---

# Q: How does the generator aggregate card collections and validate coverage headings, and which fixture helpers mirror that order?

## Answer

Start at tools/content/generate.ts generateContent L180, collectCard L163, collectTopics L156; tools/content/adapt.ts bundleOf L53; tools/content/gates/common.ts normalisedCards L122, topicHeadings L176, coverageIds L180; tools/content/gates/contentIds.ts checkContentIds L341; mirror fixtures tests/fixtures/zone1.ts allIds L130, expectedZone1Ids L178, zone1DeclaredStart L153 and tests/fixtures/contentToolchain.ts GENERATED_PATHS L501.

## Outcome

- Signal: useful

## Source Nodes

- generateContent(),collectCard(),collectTopics(),normalisedCards(),topicHeadings(),coverageIds(),checkContentIds(),parseCardSet(),expectedZone1Ids(),allIds(),GENERATED_PATHS