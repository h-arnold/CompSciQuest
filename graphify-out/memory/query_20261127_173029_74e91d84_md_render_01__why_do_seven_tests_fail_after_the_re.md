---
type: "query"
date: "2026-11-27T17:30:29.196667+00:00"
question: "MD-RENDER-01: why do seven tests fail after the renderer is implemented?"
contributor: "graphify"
outcome: "corrected"
source_nodes: ["FakeElement,FakeDocument,createTextNode"]
---

# Q: MD-RENDER-01: why do seven tests fail after the renderer is implemented?

## Answer

The committed fixture FakeElement constructor uppercases every tagName (#text becomes #TEXT), while tests/ui/markdownRendering.test.ts expects lowercase #text. Fix needs tests/fixtures/ui.ts or the test file, both outside code-implementer permitted paths.

## Outcome

- Signal: corrected

## Source Nodes

- FakeElement,FakeDocument,createTextNode