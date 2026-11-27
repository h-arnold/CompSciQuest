---
type: "query"
date: "2026-11-27T20:12:56.270360+00:00"
question: "MD-STATUS-02 roomEntryLines room description paragraph break look message; W6H-COUNTS-01 accepted card item count"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src_core_roomtext_roomentrylines,describeRoom(),src_ui_formatevent_formatevent,tests_content_acceptedcontenthandoff_test_acceptedcards"]
---

# Q: MD-STATUS-02 roomEntryLines room description paragraph break look message; W6H-COUNTS-01 accepted card item count

## Answer

Canonical room entry owner is src/core/RoomText.ts roomEntryLines (graph node src_core_roomtext_roomentrylines), consumed by describeRoom() at src/core/commands/verbs/index.ts:85 which emits a single message event joined with newlines; formatEvent.ts:17-22 returns message text unchanged. The four-entry array assertion is correct; the joined-message and position assertions still hold. Accepted-card counts owner is acceptedCards() at tests/content/AcceptedContentHandoff.test.ts:19; pilot adds item-patch-bay-legend so items is 64.

## Outcome

- Signal: useful

## Source Nodes

- src_core_roomtext_roomentrylines,describeRoom(),src_ui_formatevent_formatevent,tests_content_acceptedcontenthandoff_test_acceptedcards