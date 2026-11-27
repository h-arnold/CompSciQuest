---
type: "query"
date: "2026-11-27T17:30:29.077070+00:00"
question: "MD-RENDER-01: is there an existing link allowlist or text-node helper to reuse?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["isAllowedLink(),FakeElement,tokenize"]
---

# Q: MD-RENDER-01: is there an existing link allowlist or text-node helper to reuse?

## Answer

No: query on markdown/Lexer/html/token found only command Tokenizer and FakeElement.innerHTML. isAllowedLink() in src/ui/markdown/links.ts L8 is the sole owner; src contains no innerHTML writes.

## Outcome

- Signal: useful

## Source Nodes

- isAllowedLink(),FakeElement,tokenize