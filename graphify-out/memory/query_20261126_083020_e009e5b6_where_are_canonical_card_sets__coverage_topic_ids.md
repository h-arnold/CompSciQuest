---
type: "query"
date: "2026-11-26T08:30:20.090189+00:00"
question: "Where are canonical card sets, coverage topic IDs and quiz/hint wiring defined and consumed by tests?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["zone1CardSet(),cardData(),CoverageTopicIds,zone1Cards(),cataloguesOf(),coverageIds(),topicHeadings(),ParsedCardSet,validateCards(),ContentBundle,QuizSystem,HintSystem"]
---

# Q: Where are canonical card sets, coverage topic IDs and quiz/hint wiring defined and consumed by tests?

## Answer

Start at tests/fixtures/zone1.ts (zone1CardSet L85, cardData L134) and tests/fixtures/content.ts (CoverageTopicIds L23); consumers tests/content/ContentCatalogues.test.ts (cataloguesOf L29), tests/content/GeneratedContent.test.ts (zone1Cards L23). Canonical coverage headings come from tools/content/gates/common.ts (topicHeadings L176, coverageIds L180); content contract tools/content/contracts.ts ParsedCardSet L30 and validation tools/content/validate.ts validateCards L48.

## Outcome

- Signal: useful

## Source Nodes

- zone1CardSet(),cardData(),CoverageTopicIds,zone1Cards(),cataloguesOf(),coverageIds(),topicHeadings(),ParsedCardSet,validateCards(),ContentBundle,QuizSystem,HintSystem