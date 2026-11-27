---
type: "query"
date: "2026-11-27T17:33:14.683193+00:00"
question: "FakeElement FakeDocument .createTextNode() installFakeDocument() OutputLog appendLine() — which node owns the fake text-node tagName casing that caused markdown renderer test failures?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["FakeElement,FakeDocument,.createTextNode(),installFakeDocument(),OutputLog,appendLine()"]
---

# Q: FakeElement FakeDocument .createTextNode() installFakeDocument() OutputLog appendLine() — which node owns the fake text-node tagName casing that caused markdown renderer test failures?

## Answer

FakeElement's constructor in tests/fixtures/ui.ts (L47) owns tagName; FakeDocument.createTextNode() (L213) constructs '#text', and uppercasing it produced '#TEXT' while the tests and DOM convention use '#text'. Fixed the fake only; real Text nodes have no tagName, so src/ must not normalise.

## Outcome

- Signal: useful

## Source Nodes

- FakeElement,FakeDocument,.createTextNode(),installFakeDocument(),OutputLog,appendLine()