---
type: "query"
date: "2026-11-24T10:39:44.242072+00:00"
question: "Why does Unit 1 Teacher Guidance connect Unit 1 Topic Index to Integral Skills Activities, Learning Experience Activities, and Programming and Compilation?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Unit 1 Teacher Guidance", "Learning Experiences", "Opportunities for embedding elements of the Curriculum for Wales", "Integral Skills", "1.5 Software", "SUMMARY OF AMENDMENTS", "Unit 1 Assessment objectives and weightings"]
---

# Q: Why does Unit 1 Teacher Guidance connect Unit 1 Topic Index to Integral Skills Activities, Learning Experience Activities, and Programming and Compilation?

## Answer

Query expanded from original via graph vocab: [teacher, guidance, topic, index, integral, skills, learning, experiences, programming, compilation] ("activities" and "connect" were not in the vocab and were dropped), then traversed with DFS.

Why the bridge exists: Unit 1 Teacher Guidance is an H1 heading at exam-specs/wjec-unit1.md L95. Extraction links every heading to its immediate parent heading with an EXTRACTED conceptually_related_to edge (confidence 1.0). That single H1 therefore has 11 direct children: the eight numbered sections 1.1 Computer architecture (L98), 1.2 How systems are structured and function (L517), 1.3 How systems communicate (L819), 1.4 Algorithms (L1161), 1.5 Software (L1518), 1.6 Logical operations (L1704), 1.7 Operating systems (L1771), 1.8 Systems development lifecycle (L1848), plus Glossary for Unit 1 (L2431), Learning Experiences (L2020) and Opportunities for embedding elements of the Curriculum for Wales (L2119).

Community detection then split those children by content: Learning Experiences formed "Learning Experience Activities"; Opportunities for embedding elements of the Curriculum for Wales (L2119) leads to Integral Skills (L2376) which formed "Integral Skills Activities"; and 1.5 Software (L1518) formed "Programming and Compilation". The remaining topic headings formed or seeded "Unit 1 Topic Index" and the per-topic communities. Because the hub has 11 edges spanning at least four communities, it gets high betweenness (0.678) and shows up as a surprising cross-community bridge.

Paths: Unit 1 Teacher Guidance -> Learning Experiences is 1 hop (EXTRACTED); -> 1.5 Software is 1 hop (EXTRACTED); -> Integral Skills is 2 hops via Opportunities for embedding elements of the Curriculum for Wales (L2119), both hops EXTRACTED.

Important caveat: these are document-structure edges, not semantic dependencies or code calls. The bridge is an artifact of the OCR'd spec heading hierarchy, and there is no rationale attribute on the hub explaining a design intent. The hub's own community is labelled "Unit 1 Topic Index", which makes it look as though the topic index were the bridge, but the actual bridging node is the H1 Unit 1 Teacher Guidance.

Bypasses (sibling H1 sections with no edge to the hub): SUMMARY OF AMENDMENTS at L16 (degree 5) and Unit 1 Assessment objectives and weightings at L89 (degree 0, isolated - its table produced no extracted child concepts). The document title H1 at L1 has degree 1. These are separate top-level roots, so the hub is not the document's unique entry point.

## Outcome

- Signal: useful

## Source Nodes

- Unit 1 Teacher Guidance
- Learning Experiences
- Opportunities for embedding elements of the Curriculum for Wales
- Integral Skills
- 1.5 Software
- SUMMARY OF AMENDMENTS
- Unit 1 Assessment objectives and weightings