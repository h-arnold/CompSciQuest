---
type: "query"
date: "2026-11-27T17:40:08.503660+00:00"
question: "MD-RENDER-02/11/15: which canonical nodes own the ___person___ bold-italic shape, raw HTML newline preservation and rejected-link label text?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["renderEmphasis(),renderLeaf(),renderLink(),renderBlock(),renderInline(),FakeElement,.createTextNode()"]
---

# Q: MD-RENDER-02/11/15: which canonical nodes own the ___person___ bold-italic shape, raw HTML newline preservation and rejected-link label text?

## Answer

renderEmphasis() (renderMarkdown.ts L116), renderLeaf() (L182) and renderLink() (L146) are the canonical owners reached from renderBlock() (L242) and renderInline() (L246); FakeElement/.createTextNode() in tests/fixtures/ui.ts build the nodes asserted by the fakes.

## Outcome

- Signal: useful

## Source Nodes

- renderEmphasis(),renderLeaf(),renderLink(),renderBlock(),renderInline(),FakeElement,.createTextNode()