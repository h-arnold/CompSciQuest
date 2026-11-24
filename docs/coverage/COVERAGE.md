# Coverage map

This file is the authoritative mapping from the GCSE Computer Science Unit 1
specification to game content. The separate coverage graph built from `docs/`
(indexed at `docs/graphify-out/graph.json`) includes this file and the source
PDF; it is **evidence** for these mappings, not proof that a topic is covered.

Source material: `exam-specs/gcse-unit-1-computer-science.pdf`

## Conventions

- Use one `## Topic: <spec topic name>` heading per specification topic.
- Use the exact same name or ID for the corresponding room/game concept in code,
  so Graphify's concept deduplication can join the document and code nodes.
- Cite the PDF section/page and the code path/symbol. An empty field means
  "not mapped yet", not "covered".
- Status is one of `not started`, `in progress`, `covered`. Record evidence.

## Topic: <spec topic name>

- Spec reference: <PDF section / page>
- Game content / room ID: <name used in code>
- Code location: <path::symbol>
- Status: not started
- Evidence / notes:

## Room index

| Room ID | Purpose | Exits | Spec topics |
| --- | --- | --- | --- |
| <room-id> | <one line> | <direction: room-id, ...> | <Topic: ...> |

## Open questions

- <anything the graph could not establish; verify against source before relying on it>
